#!/usr/bin/env node

"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const mode = process.env.FAKE_CODEX_MODE;
const invocationLog = process.env.FAKE_CODEX_INVOCATION_LOG;
if (invocationLog) {
  fs.appendFileSync(invocationLog, `${JSON.stringify(args)}\n`);
}

if (mode === "startup-fail") {
  process.stderr.write("simulated Codex startup failure\n");
  process.exit(2);
}
if (mode === "interrupted-no-thread") {
  process.exit(130);
}

const cdIndex = args.indexOf("--cd");
if (cdIndex < 0 || !args[cdIndex + 1]) {
  throw new Error("fake Codex requires --cd PATH");
}
const repo = args[cdIndex + 1];

process.stdout.write(`${JSON.stringify({
  type: "thread.started",
  thread_id: "11111111-1111-4111-8111-111111111111"
})}\n`);

function git(commandArgs) {
  childProcess.execFileSync("git", commandArgs, {
    cwd: repo,
    stdio: ["ignore", "ignore", "pipe"]
  });
}

if (mode === "resume-push") {
  git(["push", "origin", "main"]);
  process.exit(0);
}
if (mode !== "success" && mode !== "commit-no-push") {
  throw new Error(`unknown FAKE_CODEX_MODE: ${mode}`);
}

fs.appendFileSync(
  path.join(repo, "topics", "hunger-and-fullness-cues.html"),
  "\n<!-- Test-only editorial review. -->\n"
);

const now = new Date();
const reviewedOn = [
  String(now.getFullYear()).padStart(4, "0"),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0")
].join("-");
fs.writeFileSync(path.join(repo, "timeline-review-progress.json"), JSON.stringify({
  version: 1,
  completed: [{
    id: "topic/hunger-and-fullness-cues",
    reviewedOn,
    result: "updated"
  }]
}, null, 2) + "\n");

git(["add", "topics/hunger-and-fullness-cues.html", "timeline-review-progress.json"]);
git(["commit", "-m", "Review test timeline item"]);
if (mode === "success") {
  git(["push", "origin", "main"]);
}
