"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const itemId = "topic/hunger-and-fullness-cues";

function git(cwd, args) {
  return childProcess.execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function makeFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "baby-timeline-runner-test-"));
  const checkout = path.join(root, "checkout");
  const origin = path.join(root, "origin.git");
  const fakeBin = path.join(root, "bin");
  const invocationLog = path.join(root, "codex-invocations.jsonl");
  t.after(function () {
    fs.rmSync(root, { recursive: true, force: true });
  });

  fs.cpSync(projectRoot, checkout, {
    recursive: true,
    filter: function (source) {
      return path.basename(source) !== ".git" &&
        path.basename(source) !== "timeline-runner.test.js";
    }
  });
  fs.mkdirSync(fakeBin, { recursive: true });
  fs.copyFileSync(
    path.join(projectRoot, "tests", "fixtures", "fake-codex.js"),
    path.join(fakeBin, "codex")
  );
  fs.chmodSync(path.join(fakeBin, "codex"), 0o755);
  fs.chmodSync(path.join(checkout, "scripts", "write-baby-timeline-items.sh"), 0o755);
  fs.writeFileSync(path.join(checkout, "timeline-review-progress.json"), JSON.stringify({
    version: 1,
    completed: []
  }, null, 2) + "\n");

  git(checkout, ["init", "-b", "main"]);
  git(checkout, ["config", "user.name", "Timeline Runner Test"]);
  git(checkout, ["config", "user.email", "timeline-runner@example.invalid"]);
  git(checkout, ["add", "."]);
  git(checkout, ["commit", "-m", "Create runner fixture"]);
  git(root, ["init", "--bare", "--initial-branch=main", origin]);
  git(checkout, ["remote", "add", "origin", origin]);
  git(checkout, ["push", "-u", "origin", "main"]);

  return {
    root,
    checkout,
    origin,
    baseline: git(checkout, ["rev-parse", "HEAD"]),
    invocationLog,
    env: {
      ...process.env,
      PATH: `${fakeBin}${path.delimiter}${process.env.PATH}`,
      XDG_STATE_HOME: path.join(root, "state"),
      BABY_SITE_TIMELINE_LOG_DIR: path.join(root, "logs"),
      FAKE_CODEX_INVOCATION_LOG: invocationLog
    }
  };
}

function runRunner(fixture, args, mode, options = {}) {
  const runnerEnv = { ...fixture.env, ...options.env, FAKE_CODEX_MODE: mode };
  delete runnerEnv.NODE_TEST_CONTEXT;
  return childProcess.spawnSync(
    path.join(fixture.checkout, "scripts", "write-baby-timeline-items.sh"),
    ["--repo", fixture.checkout, ...args],
    {
      cwd: options.cwd || fixture.root,
      encoding: "utf8",
      env: runnerEnv,
      timeout: 60000
    }
  );
}

function assertSucceeded(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

test("runner completes one item with a logged, pushed Codex session", function (t) {
  const fixture = makeFixture(t);
  const result = runRunner(fixture, ["--item", itemId], "success");
  assertSucceeded(result);
  assert.match(result.stdout, /Completed and synchronized: topic\/hunger-and-fullness-cues/);
  assert.equal(git(fixture.checkout, ["rev-parse", "HEAD"]), git(fixture.checkout, ["rev-parse", "origin/main"]));
  const invocation = JSON.parse(fs.readFileSync(fixture.invocationLog, "utf8").trim());
  assert.ok(invocation.includes("--search"));
  assert.ok(invocation.includes("--json"));
});

test("resume returns a clean but unpushed completion to the same session", function (t) {
  const fixture = makeFixture(t);
  const first = runRunner(fixture, ["--item", itemId], "commit-no-push");
  assert.equal(first.status, 1, `${first.stdout}\n${first.stderr}`);
  assert.match(first.stderr, /Post-session checks failed/);

  const resumed = runRunner(fixture, ["--resume"], "resume-push");
  assertSucceeded(resumed);
  assert.match(resumed.stdout, /returning control to the same Codex session/);
  assert.match(resumed.stdout, /Resuming topic\/hunger-and-fullness-cues in Codex session/);

  const invocations = fs.readFileSync(fixture.invocationLog, "utf8").trim().split("\n").map(JSON.parse);
  const resumeArgs = invocations.find(function (args) { return args.includes("resume"); });
  assert.ok(resumeArgs, "the fake Codex should receive a resume invocation");
  assert.ok(resumeArgs.includes("--search"));
  assert.ok(resumeArgs.includes("--json"));
  assert.equal(resumeArgs[resumeArgs.indexOf("--cd") + 1], fixture.checkout);
  assert.ok(resumeArgs.includes("11111111-1111-4111-8111-111111111111"));
  assert.ok(resumeArgs.some(function (argument) { return argument.includes(fixture.baseline); }));
});

test("resume safely retries startup when no Codex session was created", function (t) {
  const fixture = makeFixture(t);
  const first = runRunner(fixture, ["--item", itemId], "startup-fail");
  assert.notEqual(first.status, 0);
  assert.match(first.stderr, /Codex exited with status 2/);

  const resumed = runRunner(fixture, ["--resume"], "success");
  assertSucceeded(resumed);
  assert.match(resumed.stdout, /No Codex session was created; safely retrying/);

  const invocations = fs.readFileSync(fixture.invocationLog, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(invocations.length, 2);
  assert.equal(invocations.some(function (args) { return args.includes("resume"); }), false);
});

test("resume refuses to create a second session after an unidentified interruption", function (t) {
  const fixture = makeFixture(t);
  const first = runRunner(fixture, ["--item", itemId], "interrupted-no-thread");
  assert.equal(first.status, 130, `${first.stdout}\n${first.stderr}`);

  const resumed = runRunner(fixture, ["--resume"], "success");
  assert.equal(resumed.status, 1, `${resumed.stdout}\n${resumed.stderr}`);
  assert.match(resumed.stderr, /refusing to start a second session/);
  const invocations = fs.readFileSync(fixture.invocationLog, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(invocations.length, 1);
});

test("relative log configuration remains resumable from another working directory", function (t) {
  const fixture = makeFixture(t);
  const firstCwd = path.join(fixture.root, "cwd-a");
  const secondCwd = path.join(fixture.root, "cwd-b");
  fs.mkdirSync(firstCwd);
  fs.mkdirSync(secondCwd);
  const options = { env: { BABY_SITE_TIMELINE_LOG_DIR: "relative-logs" } };

  const first = runRunner(fixture, ["--item", itemId], "startup-fail", {
    ...options,
    cwd: firstCwd
  });
  assert.notEqual(first.status, 0);
  const resumed = runRunner(fixture, ["--resume"], "success", {
    ...options,
    cwd: secondCwd
  });
  assertSucceeded(resumed);
  assert.match(resumed.stdout, /safely retrying the same item/);
});

test("persisted origin state blocks a second clone after a failed session", function (t) {
  const fixture = makeFixture(t);
  const first = runRunner(fixture, ["--item", itemId], "commit-no-push");
  assert.equal(first.status, 1, `${first.stdout}\n${first.stderr}`);

  const secondCheckout = path.join(fixture.root, "second-checkout");
  git(fixture.root, ["clone", fixture.origin, secondCheckout]);
  git(secondCheckout, ["config", "user.name", "Second Timeline Runner"]);
  git(secondCheckout, ["config", "user.email", "second-runner@example.invalid"]);
  const second = childProcess.spawnSync(
    path.join(secondCheckout, "scripts", "write-baby-timeline-items.sh"),
    ["--repo", secondCheckout, "--item", itemId],
    {
      cwd: fixture.root,
      encoding: "utf8",
      env: { ...fixture.env, FAKE_CODEX_MODE: "success" },
      timeout: 60000
    }
  );
  assert.equal(second.status, 1, `${second.stdout}\n${second.stderr}`);
  assert.match(second.stderr, /interrupted session is recorded for this checkout or origin/);
  const invocations = fs.readFileSync(fixture.invocationLog, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(invocations.length, 1);
});
