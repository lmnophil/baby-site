# Baby Site

Baby Site is a static, personal baby-reference website. It keeps lightweight,
accessible guidance in one place and uses dated cards to move through the first
three months without hiding the full reference library.

The project has no dependencies, build system, analytics, or deployment
configuration. Open `index.html` directly in a browser to view it.

`timeline-data.js` contains the single birth-date setting, eight homepage
stages, and topic-specific stages for every guide. `timeline.js` calculates
calendar dates, selects the stage that applies today, and preserves a chosen
preview date while navigating between pages. Add `?date=YYYY-MM-DD` to any page
URL to preview a date directly.

See `TIMELINE.md` before changing milestone dates or dated content. Run the
dependency-free checks with:

```sh
node --check timeline.js
node --check timeline-data.js
node --test tests/*.test.js
```

The dated cards began as researched starter copy and have an explicit,
item-by-item editorial review queue. To inspect or run it:

```sh
./scripts/write-baby-timeline-items.sh --list
./scripts/write-baby-timeline-items.sh
```

Each Codex session handles one complete topic timeline or one homepage card,
records completion in `timeline-review-progress.json`, commits to `main`, and
pushes before the next session starts. See `TIMELINE.md` for the review contract
and recovery options.
