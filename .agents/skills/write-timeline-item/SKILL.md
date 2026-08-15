---
name: write-timeline-item
description: "Research, audit, and fully refine exactly one Baby Site timeline work item: either one topic's complete dated timeline plus its matching full guide, or one dated homepage stage. Use when given a stable topic/slug or home/stage-key ID and asked to replace the timeline framework's starter copy with current, authoritative, coherent guidance. Do not use for several timeline items at once or for personalized medical advice."
---

# Write Timeline Item

Refine one timeline work item with publication-quality rigor while keeping the
rendered cards short enough to scan while holding a baby.

## Resolve exactly one item

1. Treat the text after `$write-timeline-item` as the complete item ID. Accept
   only `topic/<slug>` or `home/<stage-key>`.
2. Read the applicable `AGENTS.md`, `TIMELINE.md`, `timeline-data.js`,
   `timeline.js`, `timeline-review-progress.json`, and
   `tests/timeline.test.js`.
3. Run `node scripts/timeline-items.js show <item-id>` to resolve the item from
   canonical data. For a new run, run `node scripts/timeline-items.js verify
   <item-id> --pending`; stop without editing if it is unknown or already
   complete. For a persisted runner resume, use the item and baseline SHA in
   the resume prompt. Do not stop merely because the target is already in the
   ledger: a clean committed item may have been returned to the same session
   to repair validation or finish its push.
4. At the start of a new item, require a clean `main` checkout synchronized
   with `origin/main`. Record `git rev-parse HEAD` as the baseline commit before
   editing. When the batch runner resumes this persisted session, keep its
   recorded baseline and preserve any in-scope unfinished work instead of
   rejecting the intentionally dirty checkout.
5. If using subagents, limit them to read-only research or review. Only the
   primary session may edit, commit, or push because all items share
   `timeline-data.js` and the completion ledger.

For a `topic/<slug>` item, the unit of work is the topic's entire dated
timeline—all of its cards considered together—plus reconciliation with
`topics/<slug>.html`. Read the existing page and
[the topic-page contract](../write-page/references/page-contract.md) completely.

For a `home/<stage-key>` item, the unit of work is that one homepage card. Read
`index.html`, the adjacent homepage stages, and the timeline data and full
guides for every topic the card features. Do not revise those topic items in a
homepage run. Require the pending topic queue from
`node scripts/timeline-items.js list --scope topics --status pending --format ids`
to be empty before editing a homepage item.

## Establish the editorial baseline

- Inventory every material claim, number, threshold, transition, source, and
  condition in the target.
- Calculate the target anchors with the repository's date helpers. For a topic,
  identify the effective window created by every card and its neighbors; do not
  assess cards as isolated snippets.
- Use the last commits touching `timeline-data.js` and the matching HTML page as
  research anchors, not as proof that the guidance is current.
- Treat the existing dated text as useful starter material, not as verified or
  complete merely because structural tests pass.

## Research current evidence

Browse current sources on every run because infant health and safety guidance
can change.

- Prefer the authority responsible for the recommendation: AAP and
  HealthyChildren.org, CDC, NIH/NICHD, FDA, NHTSA, CPSC, or another national
  public-health or pediatric body appropriate to the claim.
- Open and read every existing and proposed source. Do not rely on search
  snippets, citation titles, or the starter author's interpretation.
- Check visible publication, review, replacement, archive, and withdrawal
  status when available. An undated primary source may still be useful.
- Cross-check high-stakes numbers, preparation steps, safety rules, and urgent
  thresholds against primary guidance. State uncertainty or a range when
  reputable authorities differ.
- Keep only focused sources that support material target claims. Add or update
  shared source-registry entries when needed; never invent a citation or use a
  search-results page.
- Before changing an existing source-registry entry, find every timeline that
  uses its ID and confirm the new title and URL still support all of them. If
  the source meaning or scope differs, add a target-specific ID instead of
  silently changing other items' citations.
- Keep the guidance general. Do not diagnose, grade an individual baby, request
  family details, or publish personal information beyond the already approved
  centralized birth-date configuration.

## Refine a topic timeline

- Reassess whether each existing transition is meaningful and whether its
  anchor is supported. Keep the stable topic ID; do not delete or rename the
  work item.
- Make the stages a coherent sequence. Each one should explain what changes in
  emphasis, what a caregiver can observe or do, and which condition overrides
  the calendar.
- Distinguish recommendations from descriptions of common behavior. Use broad
  ranges and observable signals; milestones are conversation prompts, not
  deadlines.
- Keep fixed safety rules and warning signs available in the full guide rather
  than implying that they expire when another card is selected.
- Preserve the renderer's concise contract: a brief title and summary, two or
  three useful points, and one to three focused source IDs per stage. Fully
  fleshed out means thoroughly researched and deliberately edited, not long.
- Audit the matching full guide for contradictions, missing transitions,
  outdated links, and unsupported high-stakes claims. Change only what is
  needed to leave the dated cards and full guide mutually accurate and useful.

## Refine a homepage stage

- Reassess the boundary and the reason this card deserves to exist relative to
  the previous and next cards.
- Feature only the small set of topics that is most useful in this window.
  Check every topic ID, priority, and note against its now-reviewed timeline and
  full guide.
- Make the title and summary orient a tired caregiver quickly. Make each topic
  note explain why that guide matters now without turning it into a second
  mini-guide.
- Use focused overview sources for the stage's timing and priorities. A topic's
  detailed claim should remain supported in that topic's own timeline or guide.

## Keep the change inside the item

Allowed editorial changes are deliberately narrow: every item may change only
`timeline-data.js` and `timeline-review-progress.json`; a topic item may also
change its matching `topics/<slug>.html`. A homepage item's rendered content is
entirely data-driven, so it has no additional HTML target.

Do not edit another timeline item, `index.html`, shared rendering or styling,
tests, skill instructions, or documentation. Report a broader framework issue
instead of silently expanding scope or weakening the checks that must pass.

## Record completion

After the research, implementation, source checks, and validation are complete,
add exactly one object to `timeline-review-progress.json`:

```json
{
  "id": "topic/example",
  "reviewedOn": "YYYY-MM-DD",
  "result": "updated"
}
```

Use the current local date. Use `updated` when published editorial content or
sources changed; use `confirmed` only when the rigorous audit supports the
starter content without editorial changes. The ledger change is required even
for `confirmed`, so a completed no-change audit is resumable. Do not mark any
other item, and never mark the target before the checks pass.

## Verify, commit, and push

1. Re-open every cited URL and match each consequential claim to its authority.
2. Run:
   - `node --check timeline-data.js`
   - `node --check timeline.js`
   - `node scripts/timeline-items.js validate`
   - `node scripts/timeline-items.js verify <item-id> --completed`
   - `node scripts/timeline-items.js check-scope <baseline-sha> <item-id>`
   - `node scripts/timeline-items.js check-progress <baseline-sha> <item-id>`
   - `node scripts/timeline-items.js check-files <baseline-sha> <item-id>`
   - `node --test tests/*.test.js`
   - `git diff --check`
3. Review the complete diff from the baseline and confirm every changed file is
   in the allowed list. Inspect the rendered target when browser tooling is
   available or when markup changed.
4. Commit only the scoped files directly to `main`. Before pushing, rerun the
   three baseline-aware `check-scope`, `check-progress`, and `check-files`
   commands against the clean commit and rerun the tests. Do not push a commit
   that fails any check.
5. Push `main` to `origin/main`, fetch, and confirm the clean local HEAD equals
   `origin/main`. The `$write-timeline-item` invocation authorizes this focused
   commit and push.
6. Report the item ID, its researched date windows, authorities used, material
   decisions, validation, remaining uncertainty, and commit/push result.
