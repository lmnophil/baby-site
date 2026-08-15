"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const timeline = require("../timeline.js");
const data = require("../timeline-data.js");
const reviewProgress = require("../timeline-review-progress.json");
const timelineItems = require("../scripts/timeline-items.js");

const projectRoot = path.resolve(__dirname, "..");

test("date parsing rejects rollover and non-date values", function () {
  assert.equal(timeline.parseDate("2026-02-29"), null);
  assert.equal(timeline.parseDate("08/12/2026"), null);
  assert.equal(timeline.parseDate(null), null);
  assert.equal(timeline.parseDate("2024-02-29").iso, "2024-02-29");
});

test("day arithmetic stays stable across daylight-saving boundaries", function () {
  assert.equal(timeline.addDays("2026-03-07", 2), "2026-03-09");
  assert.equal(timeline.ageInDays("2026-03-07", "2026-03-09"), 2);
  assert.equal(timeline.addDays("2026-11-01", 1), "2026-11-02");
});

test("calendar-month anchors use anniversaries and clamp short months", function () {
  assert.equal(timeline.addMonths("2026-08-12", 1), "2026-09-12");
  assert.equal(timeline.addMonths("2024-01-31", 1), "2024-02-29");
  assert.equal(timeline.addMonths("2025-01-31", 1), "2025-02-28");
});

test("date windows are formatted compactly but unambiguously", function () {
  assert.equal(timeline.formatDateRange("2026-08-15", "2026-08-18"), "Aug 15 – 18, 2026");
  assert.equal(timeline.formatDateRange("2026-08-26", "2026-09-11"), "Aug 26 – Sep 11, 2026");
});

test("homepage milestones resolve to the intended dates", function () {
  const actual = timeline.stagesWithDates(data.homeStages, data.birthDate).map(function (entry) {
    return entry.date;
  });

  assert.deepEqual(actual, [
    "2026-08-12",
    "2026-08-15",
    "2026-08-19",
    "2026-08-26",
    "2026-09-12",
    "2026-09-23",
    "2026-10-12",
    "2026-11-12"
  ]);
});

test("stage selection changes exactly on each boundary", function () {
  const stages = [
    { key: "birth", at: { days: 0 } },
    { key: "day-3", at: { days: 3 } },
    { key: "month-1", at: { months: 1 } }
  ];

  assert.equal(timeline.selectStage(stages, data.birthDate, "2026-08-14").stage.key, "birth");
  assert.equal(timeline.selectStage(stages, data.birthDate, "2026-08-15").stage.key, "day-3");
  assert.equal(timeline.selectStage(stages, data.birthDate, "2026-09-11").stage.key, "day-3");
  assert.equal(timeline.selectStage(stages, data.birthDate, "2026-09-12").stage.key, "month-1");
});

test("the supported date scope runs from birth through the third month", function () {
  assert.equal(timeline.dateForAnchor(data.birthDate, data.scopeEnd), "2026-12-12");
  assert.equal(timeline.dateScope(data.birthDate, data.scopeEnd, "2026-08-11"), "before");
  assert.equal(timeline.dateScope(data.birthDate, data.scopeEnd, "2026-08-12"), "within");
  assert.equal(timeline.dateScope(data.birthDate, data.scopeEnd, "2026-12-11"), "within");
  assert.equal(timeline.dateScope(data.birthDate, data.scopeEnd, "2026-12-12"), "after");
});

test("every topic page has one matching timeline and enhancement scripts", function () {
  const topicDirectory = path.join(projectRoot, "topics");
  const files = fs.readdirSync(topicDirectory).filter(function (file) {
    return file.endsWith(".html");
  }).sort();
  const configured = Object.keys(data.topicTimelines).map(function (slug) {
    return slug + ".html";
  }).sort();

  assert.deepEqual(configured, files);

  for (const file of files) {
    const slug = path.basename(file, ".html");
    const html = fs.readFileSync(path.join(topicDirectory, file), "utf8");
    assert.match(html, /<script src="\.\.\/timeline-data\.js" defer><\/script>/);
    assert.match(html, /<script src="\.\.\/timeline\.js" defer><\/script>/);
    assert.equal(
      (html.match(new RegExp(`data-topic-timeline="${slug}"`, "g")) || []).length,
      1,
      `${file} should have one matching timeline mount`
    );
  }
});

test("all timeline stages are ordered, complete, and cite known sources", function () {
  for (const [slug, topic] of Object.entries(data.topicTimelines)) {
    assert.ok(topic.stages.length >= 2 && topic.stages.length <= 5, `${slug} should have 2–5 meaningful stages`);

    const dated = timeline.stagesWithDates(topic.stages, data.birthDate);
    assert.equal(dated.length, topic.stages.length, `${slug} has an invalid anchor`);
    assert.equal(new Set(topic.stages.map(function (stage) { return stage.key; })).size, topic.stages.length);

    let previous = -Infinity;
    for (const entry of dated) {
      assert.ok(entry.ordinal > previous, `${slug} anchors should be strictly increasing`);
      previous = entry.ordinal;
      assert.ok(entry.stage.label && entry.stage.title && entry.stage.summary, `${slug} has incomplete copy`);
      assert.ok(entry.stage.points.length >= 2 && entry.stage.points.length <= 3, `${slug} should stay scannable`);
      assert.ok(entry.stage.sources.length >= 1 && entry.stage.sources.length <= 3, `${slug} needs focused sources`);
      for (const sourceId of entry.stage.sources) {
        assert.ok(data.sources[sourceId], `${slug} cites unknown source ${sourceId}`);
      }
    }
  }
});

test("source registry entries have renderable titles and secure URLs", function () {
  for (const [sourceId, source] of Object.entries(data.sources)) {
    assert.equal(typeof source.title, "string", `${sourceId} should have a title`);
    assert.ok(source.title.trim(), `${sourceId} should have a nonempty title`);
    assert.equal(typeof source.url, "string", `${sourceId} should have a URL`);
    const parsed = new URL(source.url);
    assert.equal(parsed.protocol, "https:", `${sourceId} should use HTTPS`);
    assert.ok(parsed.hostname, `${sourceId} should have a hostname`);
    assert.equal(parsed.username, "", `${sourceId} should not contain URL credentials`);
    assert.equal(parsed.password, "", `${sourceId} should not contain URL credentials`);
  }
});

test("timeline editorial review progress uses stable current item IDs", function () {
  const inventory = timelineItems.buildInventory(data);
  const currentIds = new Set([
    ...Object.keys(data.topicTimelines).map(function (slug) { return `topic/${slug}`; }),
    ...data.homeStages.map(function (stage) { return `home/${stage.key}`; })
  ]);
  const completedIds = new Set();

  assert.equal(reviewProgress.version, 1);
  assert.equal(inventory.length, currentIds.size);
  assert.deepEqual(new Set(inventory.map(function (item) { return item.id; })), currentIds);
  assert.equal(inventory.findIndex(function (item) { return item.kind === "home"; }), Object.keys(data.topicTimelines).length);
  assert.ok(Array.isArray(reviewProgress.completed));
  for (const entry of reviewProgress.completed) {
    assert.deepEqual(Object.keys(entry).sort(), ["id", "result", "reviewedOn"]);
    assert.ok(currentIds.has(entry.id), `${entry.id} should identify a current timeline item`);
    assert.equal(completedIds.has(entry.id), false, `${entry.id} should be recorded only once`);
    completedIds.add(entry.id);
    assert.equal(timelineItems.isIsoDate(entry.reviewedOn), true);
    assert.ok(["updated", "confirmed"].includes(entry.result));
  }

  assert.throws(function () {
    timelineItems.readProgressText(JSON.stringify({
      version: 1,
      completed: [{ id: "home/birth", reviewedOn: "2026-02-29", result: "confirmed" }]
    }), inventory);
  }, /real YYYY-MM-DD date/);
  assert.throws(function () {
    timelineItems.readProgressText(JSON.stringify({
      version: 1,
      completed: [
        { id: "home/birth", reviewedOn: "2026-08-15", result: "confirmed" },
        { id: "home/birth", reviewedOn: "2026-08-15", result: "updated" }
      ]
    }), inventory);
  }, /duplicated/);
});

test("homepage stages reference real directory topics and known sources", function () {
  const index = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const directoryTopics = new Set(Array.from(index.matchAll(/data-topic="([^"]+)"/g), function (match) {
    return match[1];
  }));

  assert.equal(directoryTopics.size, 30);
  for (const stage of data.homeStages) {
    assert.ok(stage.topics.length >= 6 && stage.topics.length <= 10);
    assert.equal(
      new Set(stage.topics.map(function (topic) { return topic.id; })).size,
      stage.topics.length,
      `${stage.key} should not repeat a featured topic`
    );
    for (const topic of stage.topics) {
      assert.ok(directoryTopics.has(topic.id), `${stage.key} references missing topic ${topic.id}`);
      assert.ok(topic.note);
    }
    for (const sourceId of stage.sources) {
      assert.ok(data.sources[sourceId], `${stage.key} cites unknown source ${sourceId}`);
    }
  }
});

test("the birth date is centralized outside HTML and CSS", function () {
  const expectedDate = data.birthDate;
  const publicMarkup = [
    fs.readFileSync(path.join(projectRoot, "index.html"), "utf8"),
    fs.readFileSync(path.join(projectRoot, "styles.css"), "utf8"),
    ...fs.readdirSync(path.join(projectRoot, "topics")).map(function (file) {
      return fs.readFileSync(path.join(projectRoot, "topics", file), "utf8");
    })
  ].join("\n");

  assert.equal(publicMarkup.includes(expectedDate), false);
  const escapedDate = expectedDate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.equal(
    (fs.readFileSync(path.join(projectRoot, "timeline-data.js"), "utf8").match(new RegExp(escapedDate, "g")) || []).length,
    1
  );
});

test("HTML keeps unique IDs and resolvable labelled-by references", function () {
  const files = [
    path.join(projectRoot, "index.html"),
    ...fs.readdirSync(path.join(projectRoot, "topics")).map(function (file) {
      return path.join(projectRoot, "topics", file);
    })
  ];

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), function (match) { return match[1]; });
    const labelledBy = Array.from(html.matchAll(/\saria-labelledby="([^"]+)"/g), function (match) {
      return match[1];
    });

    assert.equal(new Set(ids).size, ids.length, `${path.basename(file)} has duplicate IDs`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path.basename(file)} should have one h1`);
    assert.equal(html.includes("Content coming soon"), false, `${path.basename(file)} contains a placeholder`);
    for (const reference of labelledBy) {
      for (const id of reference.split(/\s+/)) {
        assert.ok(ids.includes(id), `${path.basename(file)} references missing ID ${id}`);
      }
    }
  }
});
