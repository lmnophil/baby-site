#!/usr/bin/env node

"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "timeline-data.js");
const progressPath = path.join(projectRoot, "timeline-review-progress.json");
const allowedResults = new Set(["updated", "confirmed"]);

function usage() {
  return [
    "Usage:",
    "  node scripts/timeline-items.js list [--scope all|topics|home] [--status pending|completed|all] [--format tsv|ids|json]",
    "  node scripts/timeline-items.js show ITEM_ID",
    "  node scripts/timeline-items.js verify ITEM_ID [--pending|--completed]",
    "  node scripts/timeline-items.js check-scope BASELINE_SHA ITEM_ID",
    "  node scripts/timeline-items.js check-progress BASELINE_SHA ITEM_ID",
    "  node scripts/timeline-items.js check-files BASELINE_SHA ITEM_ID",
    "  node scripts/timeline-items.js session-id LOG_FILE",
    "  node scripts/timeline-items.js validate"
  ].join("\n");
}

function readCurrentData() {
  delete require.cache[require.resolve(dataPath)];
  return require(dataPath);
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function buildInventory(data) {
  if (!data || !Array.isArray(data.homeStages) || !data.topicTimelines) {
    throw new Error("timeline-data.js does not expose the expected timeline structure");
  }

  const items = [];
  for (const [slug, topic] of Object.entries(data.topicTimelines)) {
    items.push({
      id: `topic/${slug}`,
      kind: "topic",
      key: slug,
      label: topic.heading,
      detail: `${topic.stages.length} dated card${topic.stages.length === 1 ? "" : "s"}`,
      targetFile: `topics/${slug}.html`,
      data: topic
    });
  }
  for (const stage of data.homeStages) {
    items.push({
      id: `home/${stage.key}`,
      kind: "home",
      key: stage.key,
      label: `${stage.label} — ${stage.title}`,
      detail: `${stage.topics.length} featured topic${stage.topics.length === 1 ? "" : "s"}`,
      targetFile: "index.html",
      data: stage
    });
  }
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new Error("timeline-data.js produces duplicate timeline item IDs");
  }
  return items;
}

function readProgressText(text, inventory) {
  let progress;
  try {
    progress = JSON.parse(text);
  } catch (error) {
    throw new Error(`timeline-review-progress.json is not valid JSON: ${error.message}`);
  }

  const errors = [];
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    throw new Error("timeline-review-progress.json must contain an object");
  }
  if (JSON.stringify(Object.keys(progress).sort()) !== JSON.stringify(["completed", "version"])) {
    errors.push("progress must contain only version and completed");
  }
  if (progress.version !== 1) {
    errors.push("progress.version must be 1");
  }
  if (!Array.isArray(progress.completed)) {
    errors.push("progress.completed must be an array");
  }

  const knownIds = new Set(inventory.map((item) => item.id));
  const seenIds = new Set();
  const completed = Array.isArray(progress.completed) ? progress.completed : [];
  for (const [index, entry] of completed.entries()) {
    const prefix = `progress.completed[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }

    const keys = Object.keys(entry).sort();
    if (JSON.stringify(keys) !== JSON.stringify(["id", "result", "reviewedOn"])) {
      errors.push(`${prefix} must contain only id, reviewedOn, and result`);
    }
    if (typeof entry.id !== "string" || !knownIds.has(entry.id)) {
      errors.push(`${prefix}.id is not a current timeline item: ${String(entry.id)}`);
    } else if (seenIds.has(entry.id)) {
      errors.push(`${prefix}.id is duplicated: ${entry.id}`);
    } else {
      seenIds.add(entry.id);
    }
    if (!isIsoDate(entry.reviewedOn)) {
      errors.push(`${prefix}.reviewedOn must be a real YYYY-MM-DD date`);
    }
    if (!allowedResults.has(entry.result)) {
      errors.push(`${prefix}.result must be updated or confirmed`);
    }
  }

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
  return progress;
}

function readCurrentProgress(inventory) {
  return readProgressText(fs.readFileSync(progressPath, "utf8"), inventory);
}

function getContext() {
  const data = readCurrentData();
  const inventory = buildInventory(data);
  const progress = readCurrentProgress(inventory);
  const completedIds = new Set(progress.completed.map((entry) => entry.id));
  return { data, inventory, progress, completedIds };
}

function findItem(inventory, itemId) {
  const item = inventory.find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new Error(`unknown timeline item: ${itemId}`);
  }
  return item;
}

function cleanField(value) {
  return String(value).replace(/[\t\r\n]+/g, " ").trim();
}

function parseListOptions(args) {
  const options = { scope: "all", status: "pending", format: "tsv" };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (!["--scope", "--status", "--format"].includes(flag) || index + 1 >= args.length) {
      throw new Error(`invalid list option: ${flag}`);
    }
    options[flag.slice(2)] = args[index + 1];
    index += 1;
  }
  if (!["all", "topics", "home"].includes(options.scope)) {
    throw new Error("--scope must be all, topics, or home");
  }
  if (!["pending", "completed", "all"].includes(options.status)) {
    throw new Error("--status must be pending, completed, or all");
  }
  if (!["tsv", "ids", "json"].includes(options.format)) {
    throw new Error("--format must be tsv, ids, or json");
  }
  return options;
}

function listItems(args) {
  const options = parseListOptions(args);
  const { inventory, completedIds } = getContext();
  const selected = inventory.filter((item) => {
    const inScope = options.scope === "all" ||
      (options.scope === "topics" && item.kind === "topic") ||
      (options.scope === "home" && item.kind === "home");
    const completed = completedIds.has(item.id);
    const hasStatus = options.status === "all" ||
      (options.status === "completed" && completed) ||
      (options.status === "pending" && !completed);
    return inScope && hasStatus;
  }).map((item) => ({
    id: item.id,
    kind: item.kind,
    label: item.label,
    detail: item.detail,
    targetFile: item.targetFile,
    status: completedIds.has(item.id) ? "completed" : "pending"
  }));

  if (options.format === "json") {
    process.stdout.write(`${JSON.stringify(selected, null, 2)}\n`);
    return;
  }
  for (const item of selected) {
    if (options.format === "ids") {
      process.stdout.write(`${item.id}\n`);
    } else {
      process.stdout.write([
        item.status,
        item.id,
        cleanField(item.label),
        cleanField(item.detail),
        item.targetFile
      ].join("\t") + "\n");
    }
  }
}

function showItem(itemId) {
  const { data, inventory, completedIds } = getContext();
  const item = findItem(inventory, itemId);
  const sourceIds = new Set();
  const stages = item.kind === "topic" ? item.data.stages : [item.data];
  for (const stage of stages) {
    for (const sourceId of stage.sources || []) {
      sourceIds.add(sourceId);
    }
  }
  const sources = Object.fromEntries(Array.from(sourceIds, (sourceId) => [sourceId, data.sources[sourceId]]));
  process.stdout.write(`${JSON.stringify({
    id: item.id,
    kind: item.kind,
    label: item.label,
    detail: item.detail,
    targetFile: item.targetFile,
    status: completedIds.has(item.id) ? "completed" : "pending",
    timeline: item.data,
    sources
  }, null, 2)}\n`);
}

function verifyItem(itemId, expectation) {
  const { inventory, completedIds } = getContext();
  findItem(inventory, itemId);
  const completed = completedIds.has(itemId);
  if (expectation === "pending" && completed) {
    throw new Error(`timeline item is already completed: ${itemId}`);
  }
  if (expectation === "completed" && !completed) {
    throw new Error(`timeline item is not completed: ${itemId}`);
  }
  process.stdout.write(`${itemId}: ${completed ? "completed" : "pending"}\n`);
}

function readFileAtCommit(commit, relativePath) {
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error(`baseline must be a full 40-character commit SHA: ${commit}`);
  }
  try {
    return childProcess.execFileSync(
      "git",
      ["-C", projectRoot, "show", `${commit}:${relativePath}`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
  } catch (error) {
    const detail = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`cannot read ${relativePath} at ${commit}: ${detail}`);
  }
}

function pathChangedSince(commit, relativePath) {
  const result = childProcess.spawnSync(
    "git",
    ["-C", projectRoot, "diff", "--quiet", commit, "--", relativePath],
    { encoding: "utf8" }
  );
  if (result.status === 0) {
    return false;
  }
  if (result.status === 1) {
    return true;
  }
  throw new Error(`cannot compare ${relativePath} with ${commit}: ${String(result.stderr || result.error || "git diff failed").trim()}`);
}

function pathChangedAtCommit(baseline, commit, relativePath) {
  const result = childProcess.spawnSync(
    "git",
    ["-C", projectRoot, "diff", "--quiet", baseline, commit, "--", relativePath],
    { encoding: "utf8" }
  );
  if (result.status === 0) {
    return false;
  }
  if (result.status === 1) {
    return true;
  }
  throw new Error(`cannot compare ${relativePath} between ${baseline} and ${commit}: ${String(result.stderr || result.error || "git diff failed").trim()}`);
}

function commitsSince(commit) {
  try {
    const output = childProcess.execFileSync(
      "git",
      ["-C", projectRoot, "rev-list", "--reverse", `${commit}..HEAD`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    ).trim();
    return output ? output.split("\n") : [];
  } catch (error) {
    const detail = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`cannot inspect commits after ${commit}: ${detail}`);
  }
}

function gitPathList(args, failureMessage) {
  const result = childProcess.spawnSync(
    "git",
    ["-C", projectRoot, ...args],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(`${failureMessage}: ${String(result.stderr || result.error || "git failed").trim()}`);
  }
  return result.stdout.split("\0").filter(Boolean);
}

function commitCompletionDate(commit) {
  try {
    return childProcess.execFileSync(
      "git",
      ["-C", projectRoot, "show", "-s", "--format=%cd", "--date=short", commit],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    ).trim();
  } catch (error) {
    const detail = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`cannot read the completion date for ${commit}: ${detail}`);
  }
}

function localDateIso() {
  const now = new Date();
  return [
    String(now.getFullYear()).padStart(4, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

function evaluateTimelineData(source, filename) {
  const context = {};
  context.globalThis = context;
  try {
    vm.runInNewContext(source, context, { filename, timeout: 1000 });
  } catch (error) {
    throw new Error(`cannot evaluate ${filename}: ${error.message}`);
  }
  if (!context.LittleNotesData) {
    throw new Error(`${filename} did not expose LittleNotesData`);
  }
  return JSON.parse(JSON.stringify(context.LittleNotesData));
}

function canonicalJson(value) {
  return JSON.stringify(value);
}

function sourceIdsForItem(data, itemId) {
  let stages;
  if (itemId.startsWith("topic/")) {
    const slug = itemId.slice("topic/".length);
    if (!Object.prototype.hasOwnProperty.call(data.topicTimelines, slug)) {
      throw new Error(`target topic is missing from timeline data: ${slug}`);
    }
    stages = data.topicTimelines[slug].stages;
  } else if (itemId.startsWith("home/")) {
    const key = itemId.slice("home/".length);
    const stage = data.homeStages.find((candidate) => candidate.key === key);
    if (!stage) {
      throw new Error(`target homepage stage is missing from timeline data: ${key}`);
    }
    stages = [stage];
  } else {
    throw new Error(`unknown timeline item: ${itemId}`);
  }

  return new Set(stages.flatMap((stage) => stage.sources || []));
}

function dataOutsideTarget(data, itemId, allowedSourceIds) {
  const copy = JSON.parse(JSON.stringify(data));
  for (const sourceId of allowedSourceIds) {
    delete copy.sources[sourceId];
  }

  if (itemId.startsWith("topic/")) {
    const slug = itemId.slice("topic/".length);
    if (!Object.prototype.hasOwnProperty.call(copy.topicTimelines, slug)) {
      throw new Error(`target topic is missing from timeline data: ${slug}`);
    }
    copy.topicTimelines[slug] = "__TARGET_CHANGES_ALLOWED__";
    return copy;
  }

  if (itemId.startsWith("home/")) {
    const key = itemId.slice("home/".length);
    const index = copy.homeStages.findIndex((stage) => stage.key === key);
    if (index < 0) {
      throw new Error(`target homepage stage is missing from timeline data: ${key}`);
    }
    copy.homeStages[index] = { key, allowed: "__TARGET_CHANGES_ALLOWED__" };
    return copy;
  }

  throw new Error(`unknown timeline item: ${itemId}`);
}

function checkScope(baseline, itemId) {
  const current = readCurrentData();
  findItem(buildInventory(current), itemId);
  const previous = evaluateTimelineData(
    readFileAtCommit(baseline, "timeline-data.js"),
    `${baseline}:timeline-data.js`
  );
  findItem(buildInventory(previous), itemId);

  const snapshots = commitsSince(baseline).map((commit) => ({
    label: commit,
    data: evaluateTimelineData(
      readFileAtCommit(commit, "timeline-data.js"),
      `${commit}:timeline-data.js`
    )
  }));
  snapshots.push({ label: "current working tree", data: current });

  const baselineSourceIds = new Set(Object.keys(previous.sources));
  const baselineTargetSourceIds = sourceIdsForItem(previous, itemId);

  for (const snapshot of snapshots) {
    findItem(buildInventory(snapshot.data), itemId);
    const allowedSourceIds = new Set(baselineTargetSourceIds);
    for (const sourceId of sourceIdsForItem(snapshot.data, itemId)) {
      if (!baselineSourceIds.has(sourceId)) {
        allowedSourceIds.add(sourceId);
      }
    }
    if (canonicalJson(dataOutsideTarget(previous, itemId, allowedSourceIds)) !==
        canonicalJson(dataOutsideTarget(snapshot.data, itemId, allowedSourceIds))) {
      throw new Error(`timeline-data.js changed outside ${itemId} or its referenced source entries at ${snapshot.label}`);
    }
  }
  process.stdout.write(`${itemId}: timeline data scope is valid\n`);
}

function checkProgress(baseline, itemId) {
  const currentData = readCurrentData();
  const inventory = buildInventory(currentData);
  const item = findItem(inventory, itemId);
  const before = readProgressText(
    readFileAtCommit(baseline, "timeline-review-progress.json"),
    inventory
  );
  const after = readCurrentProgress(inventory);
  const beforeById = new Map(before.completed.map((entry) => [entry.id, entry]));
  const afterById = new Map(after.completed.map((entry) => [entry.id, entry]));
  const commits = commitsSince(baseline);

  if (beforeById.has(itemId)) {
    throw new Error(`target was already completed at the baseline commit: ${itemId}`);
  }
  if (!afterById.has(itemId)) {
    throw new Error(`target was not added to completion progress: ${itemId}`);
  }

  const progressSnapshots = commits.map((commit) => ({
    label: commit,
    progress: readProgressText(
      readFileAtCommit(commit, "timeline-review-progress.json"),
      inventory
    )
  }));
  progressSnapshots.push({ label: "current working tree", progress: after });
  for (const snapshot of progressSnapshots) {
    const snapshotById = new Map(snapshot.progress.completed.map((entry) => [entry.id, entry]));
    const addedOutsideTarget = Array.from(snapshotById.keys()).filter((id) =>
      !beforeById.has(id) && id !== itemId
    );
    const removedPrior = Array.from(beforeById.keys()).filter((id) => !snapshotById.has(id));
    const changedPrior = Array.from(beforeById.keys()).filter((id) => {
      if (!snapshotById.has(id)) {
        return false;
      }
      const baselineEntry = beforeById.get(id);
      const snapshotEntry = snapshotById.get(id);
      return baselineEntry.id !== snapshotEntry.id ||
        baselineEntry.reviewedOn !== snapshotEntry.reviewedOn ||
        baselineEntry.result !== snapshotEntry.result;
    });
    if (addedOutsideTarget.length || removedPrior.length || changedPrior.length) {
      throw new Error([
        `completion progress changed outside ${itemId} at ${snapshot.label}`,
        `added: ${addedOutsideTarget.join(", ") || "none"}`,
        `removed: ${removedPrior.join(", ") || "none"}`,
        `changed: ${changedPrior.join(", ") || "none"}`
      ].join("\n"));
    }
    const targetEntry = snapshotById.get(itemId);
    if (targetEntry) {
      const editorialChangedAtSnapshot = snapshot.label === "current working tree"
        ? pathChangedSince(baseline, "timeline-data.js") || pathChangedSince(baseline, item.targetFile)
        : pathChangedAtCommit(baseline, snapshot.label, "timeline-data.js") ||
          pathChangedAtCommit(baseline, snapshot.label, item.targetFile);
      if (targetEntry.result === "confirmed" && editorialChangedAtSnapshot) {
        throw new Error(`${itemId} was marked confirmed despite an editorial change at ${snapshot.label}`);
      }
      if (targetEntry.result === "updated" && !editorialChangedAtSnapshot) {
        throw new Error(`${itemId} was marked updated without an editorial change at ${snapshot.label}`);
      }
    }
  }

  const added = Array.from(afterById.keys()).filter((id) => !beforeById.has(id));
  const removed = Array.from(beforeById.keys()).filter((id) => !afterById.has(id));
  const changed = Array.from(beforeById.keys()).filter((id) => {
    if (!afterById.has(id)) {
      return false;
    }
    const beforeEntry = beforeById.get(id);
    const afterEntry = afterById.get(id);
    return beforeEntry.id !== afterEntry.id ||
      beforeEntry.reviewedOn !== afterEntry.reviewedOn ||
      beforeEntry.result !== afterEntry.result;
  });
  if (added.length !== 1 || added[0] !== itemId || removed.length || changed.length) {
    throw new Error([
      `completion progress changed outside ${itemId}`,
      `added: ${added.join(", ") || "none"}`,
      `removed: ${removed.join(", ") || "none"}`,
      `changed: ${changed.join(", ") || "none"}`
    ].join("\n"));
  }
  const result = afterById.get(itemId).result;
  const editorialChanged = pathChangedSince(baseline, "timeline-data.js") ||
    pathChangedSince(baseline, item.targetFile);
  if (result === "confirmed" && editorialChanged) {
    throw new Error(`${itemId} is marked confirmed but its published editorial content changed`);
  }
  if (result === "updated" && !editorialChanged) {
    throw new Error(`${itemId} is marked updated but its published editorial content did not change`);
  }
  const allowedReviewDates = new Set([localDateIso()]);
  for (const commit of commits) {
    const committedProgress = readProgressText(
      readFileAtCommit(commit, "timeline-review-progress.json"),
      inventory
    );
    if (committedProgress.completed.some((entry) => entry.id === itemId)) {
      allowedReviewDates.add(commitCompletionDate(commit));
    }
  }
  if (!allowedReviewDates.has(afterById.get(itemId).reviewedOn)) {
    throw new Error(`${itemId}.reviewedOn must match the local audit or completion-commit date`);
  }
  process.stdout.write(`${itemId}: completion progress is valid\n`);
}

function pathAllowedForItem(relativePath, item) {
  return relativePath === "timeline-data.js" ||
    relativePath === "timeline-review-progress.json" ||
    (item.kind === "topic" && relativePath === item.targetFile);
}

function checkFiles(baseline, itemId) {
  readFileAtCommit(baseline, "timeline-data.js");
  const { inventory } = getContext();
  const item = findItem(inventory, itemId);
  const changedPaths = new Set([
    ...gitPathList(
      ["log", "--format=", "--name-only", "-z", `${baseline}..HEAD`],
      `cannot inspect committed paths after ${baseline}`
    ),
    ...gitPathList(
      ["diff", "--name-only", "-z", baseline],
      `cannot inspect working-tree paths after ${baseline}`
    ),
    ...gitPathList(
      ["ls-files", "--others", "--exclude-standard", "-z"],
      "cannot inspect untracked paths"
    )
  ]);
  const unexpected = Array.from(changedPaths).filter((relativePath) =>
    !pathAllowedForItem(relativePath, item)
  ).sort();
  if (unexpected.length) {
    throw new Error([
      `files changed outside ${itemId}`,
      ...unexpected.map((relativePath) => `unexpected: ${relativePath}`)
    ].join("\n"));
  }
  process.stdout.write(`${itemId}: changed-file scope is valid\n`);
}

function printSessionId(logFile) {
  let text;
  try {
    text = fs.readFileSync(logFile, "utf8");
  } catch (error) {
    throw new Error(`cannot read Codex JSONL log ${logFile}: ${error.message}`);
  }
  const sessionIds = new Set();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }
    let event;
    try {
      event = JSON.parse(line);
    } catch (_error) {
      continue;
    }
    if (event && event.type === "thread.started" && typeof event.thread_id === "string") {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(event.thread_id)) {
        throw new Error(`Codex log contains an invalid thread ID: ${event.thread_id}`);
      }
      sessionIds.add(event.thread_id);
    }
  }
  if (sessionIds.size > 1) {
    throw new Error(`Codex log contains several thread IDs: ${Array.from(sessionIds).join(", ")}`);
  }
  if (sessionIds.size === 1) {
    process.stdout.write(`${Array.from(sessionIds)[0]}\n`);
  }
}

function main(argv) {
  const [command, ...args] = argv;
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (command === "list") {
    listItems(args);
    return;
  }
  if (command === "show" && args.length === 1) {
    showItem(args[0]);
    return;
  }
  if (command === "verify" && (args.length === 1 || args.length === 2)) {
    const expectation = args[1] ? args[1].replace(/^--/, "") : "any";
    if (!["any", "pending", "completed"].includes(expectation)) {
      throw new Error("verify accepts only --pending or --completed");
    }
    verifyItem(args[0], expectation);
    return;
  }
  if (command === "check-scope" && args.length === 2) {
    checkScope(args[0], args[1]);
    return;
  }
  if (command === "check-progress" && args.length === 2) {
    checkProgress(args[0], args[1]);
    return;
  }
  if (command === "check-files" && args.length === 2) {
    checkFiles(args[0], args[1]);
    return;
  }
  if (command === "session-id" && args.length === 1) {
    printSessionId(args[0]);
    return;
  }
  if (command === "validate" && args.length === 0) {
    const { inventory, progress } = getContext();
    process.stdout.write(`Timeline review data is valid: ${inventory.length} items, ${progress.completed.length} completed.\n`);
    return;
  }
  throw new Error(`invalid command or arguments\n${usage()}`);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { buildInventory, isIsoDate, readProgressText };
