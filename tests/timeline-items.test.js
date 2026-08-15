"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");

function git(fixture, args) {
  return childProcess.execFileSync("git", args, {
    cwd: fixture,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function runHelper(fixture, args) {
  return childProcess.spawnSync(
    process.execPath,
    [path.join(fixture, "scripts", "timeline-items.js"), ...args],
    { cwd: fixture, encoding: "utf8" }
  );
}

function localDateIso() {
  const now = new Date();
  return [
    String(now.getFullYear()).padStart(4, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

function makeFixture(t) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "baby-timeline-items-test-"));
  t.after(function () {
    fs.rmSync(fixture, { recursive: true, force: true });
  });

  fs.mkdirSync(path.join(fixture, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(fixture, "topics"), { recursive: true });
  for (const relativePath of [
    "timeline-data.js",
    "timeline-review-progress.json",
    "scripts/timeline-items.js",
    "topics/hunger-and-fullness-cues.html"
  ]) {
    fs.copyFileSync(path.join(projectRoot, relativePath), path.join(fixture, relativePath));
  }
  fs.writeFileSync(path.join(fixture, "timeline-review-progress.json"), JSON.stringify({
    version: 1,
    completed: []
  }, null, 2) + "\n");

  git(fixture, ["init", "-b", "main"]);
  git(fixture, ["config", "user.name", "Timeline Test"]);
  git(fixture, ["config", "user.email", "timeline-test@example.invalid"]);
  git(fixture, ["add", "."]);
  git(fixture, ["commit", "-m", "Create fixture"]);
  return {
    path: fixture,
    baseline: git(fixture, ["rev-parse", "HEAD"]),
    originalData: fs.readFileSync(path.join(fixture, "timeline-data.js"), "utf8")
  };
}

function writeProgress(fixture, result, reviewedOn = localDateIso()) {
  fs.writeFileSync(path.join(fixture, "timeline-review-progress.json"), JSON.stringify({
    version: 1,
    completed: [{
      id: "topic/hunger-and-fullness-cues",
      reviewedOn,
      result
    }]
  }, null, 2) + "\n");
}

test("scope and progress guards accept an updated target before and after commit", function (t) {
  const fixture = makeFixture(t);
  fs.appendFileSync(
    path.join(fixture.path, "topics", "hunger-and-fullness-cues.html"),
    "\n<!-- Test-only editorial review. -->\n"
  );
  writeProgress(fixture.path, "updated");

  for (const command of ["check-scope", "check-progress", "check-files"]) {
    const beforeCommit = runHelper(fixture.path, [command, fixture.baseline, "topic/hunger-and-fullness-cues"]);
    assert.equal(beforeCommit.status, 0, beforeCommit.stderr);
  }

  git(fixture.path, ["add", "topics/hunger-and-fullness-cues.html", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Review target timeline"]);
  for (const command of ["check-scope", "check-progress", "check-files"]) {
    const afterCommit = runHelper(fixture.path, [command, fixture.baseline, "topic/hunger-and-fullness-cues"]);
    assert.equal(afterCommit.status, 0, afterCommit.stderr);
  }
});

test("progress guard rejects confirmed when published target content changed", function (t) {
  const fixture = makeFixture(t);
  fs.appendFileSync(
    path.join(fixture.path, "topics", "hunger-and-fullness-cues.html"),
    "\n<!-- Test-only conflicting review. -->\n"
  );
  writeProgress(fixture.path, "confirmed");

  const result = runHelper(fixture.path, [
    "check-progress",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /marked confirmed.*editorial change/);
});

test("scope guard detects another item's change even when a later commit restores it", function (t) {
  const fixture = makeFixture(t);
  const unrelatedChange = `${fixture.originalData}\n` +
    "globalThis.LittleNotesData.topicTimelines[\"bottle-feeding\"].heading = \"Wrongly changed bottle timeline\";\n" +
    "if (typeof module === \"object\" && module.exports) { module.exports = globalThis.LittleNotesData; }\n";
  fs.writeFileSync(path.join(fixture.path, "timeline-data.js"), unrelatedChange);
  git(fixture.path, ["add", "timeline-data.js"]);
  git(fixture.path, ["commit", "-m", "Change another item"]);

  fs.writeFileSync(path.join(fixture.path, "timeline-data.js"), fixture.originalData);
  git(fixture.path, ["add", "timeline-data.js"]);
  git(fixture.path, ["commit", "-m", "Restore another item"]);

  const result = runHelper(fixture.path, [
    "check-scope",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /changed outside topic\/hunger-and-fullness-cues/);
});

test("file guard detects a forbidden path even when a later commit restores it", function (t) {
  const fixture = makeFixture(t);
  fs.writeFileSync(path.join(fixture.path, "outside.txt"), "temporary forbidden change\n");
  git(fixture.path, ["add", "outside.txt"]);
  git(fixture.path, ["commit", "-m", "Add forbidden file"]);
  fs.rmSync(path.join(fixture.path, "outside.txt"));
  git(fixture.path, ["add", "outside.txt"]);
  git(fixture.path, ["commit", "-m", "Remove forbidden file"]);

  const result = runHelper(fixture.path, [
    "check-files",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /files changed outside topic\/hunger-and-fullness-cues/);
  assert.match(result.stderr, /outside\.txt/);
});

test("progress guard detects another completion even when a later commit restores it", function (t) {
  const fixture = makeFixture(t);
  fs.appendFileSync(
    path.join(fixture.path, "topics", "hunger-and-fullness-cues.html"),
    "\n<!-- Test-only editorial review. -->\n"
  );
  writeProgress(fixture.path, "updated");
  git(fixture.path, ["add", "topics/hunger-and-fullness-cues.html", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Review target timeline"]);

  const targetProgress = JSON.parse(fs.readFileSync(
    path.join(fixture.path, "timeline-review-progress.json"),
    "utf8"
  ));
  targetProgress.completed.push({
    id: "home/birth",
    reviewedOn: localDateIso(),
    result: "confirmed"
  });
  fs.writeFileSync(
    path.join(fixture.path, "timeline-review-progress.json"),
    `${JSON.stringify(targetProgress, null, 2)}\n`
  );
  git(fixture.path, ["add", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Temporarily complete another item"]);
  writeProgress(fixture.path, "updated");
  git(fixture.path, ["add", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Restore target-only progress"]);

  const result = runHelper(fixture.path, [
    "check-progress",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /completion progress changed outside/);
  assert.match(result.stderr, /home\/birth/);
});

test("progress guard detects an incorrect target result in intermediate history", function (t) {
  const fixture = makeFixture(t);
  fs.appendFileSync(
    path.join(fixture.path, "topics", "hunger-and-fullness-cues.html"),
    "\n<!-- Test-only editorial review. -->\n"
  );
  writeProgress(fixture.path, "confirmed");
  git(fixture.path, ["add", "topics/hunger-and-fullness-cues.html", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Record incorrect target result"]);
  writeProgress(fixture.path, "updated");
  git(fixture.path, ["add", "timeline-review-progress.json"]);
  git(fixture.path, ["commit", "-m", "Correct target result"]);

  const result = runHelper(fixture.path, [
    "check-progress",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /marked confirmed despite an editorial change/);
});

test("review date does not trust a forged author date", function (t) {
  const fixture = makeFixture(t);
  fs.appendFileSync(
    path.join(fixture.path, "topics", "hunger-and-fullness-cues.html"),
    "\n<!-- Test-only editorial review. -->\n"
  );
  writeProgress(fixture.path, "updated", "1999-01-01");
  git(fixture.path, ["add", "topics/hunger-and-fullness-cues.html", "timeline-review-progress.json"]);
  childProcess.execFileSync("git", ["commit", "-m", "Review with forged author date"], {
    cwd: fixture.path,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_AUTHOR_DATE: "1999-01-01T12:00:00Z" }
  });

  const result = runHelper(fixture.path, [
    "check-progress",
    fixture.baseline,
    "topic/hunger-and-fullness-cues"
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /reviewedOn must match/);
});
