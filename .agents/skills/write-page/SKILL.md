---
name: write-page
description: Research and complete exactly one Baby Site topic page from its homepage listing. Use when the user supplies a single page name and wants that page to explain what the topic looks like now, how and when it changes, reassuring signs, warning signs, normal variation, and practical next steps. This skill is specific to the dependency-free baby-site HTML/CSS project; do not use it to write several pages at once or to provide personalized medical advice.
---

# Write Page

Complete one linked Baby Site topic page from one input: the page name.

## Interpret the input

- Treat the text following `$write-page` as the complete page name. Accept a homepage link label, page heading, filename, or filename stem, case-insensitively.
- Strip surrounding quotes or braces from the page name.
- Read [references/site-context.md](references/site-context.md), calculate the baby's age as of the current local date, and use that age only to prioritize the research and explain what “right now” means. Do not repeat the birth date in output or embed it in the page.
- If the context file is unavailable, infer the intended age or time window from the target page and the site's newborn context. Do not ask for the baby's age, dates, health history, name, or other family information.
- Ask only for the page name if no value was supplied.

## Resolve one target

1. Read the applicable `AGENTS.md`, `index.html`, `styles.css`, and the target topic page before making changes.
2. Resolve the target against links in the homepage using this priority:
   - exact visible link text;
   - exact filename or filename stem;
   - normalized visible text, ignoring punctuation and typographic dashes.
3. Require a unique homepage match. If there is no unique match, stop without editing and report the closest homepage names.
4. Limit the run to that one topic page. A shared `styles.css` change is allowed only when needed for reusable topic-page presentation. Do not fill any other topic page.

## Build an evidence base

Browse current sources on every run because infant health and safety guidance can change.

- Prefer direct, authoritative sources appropriate to the topic: the American Academy of Pediatrics and HealthyChildren.org; CDC; NIH/NICHD; FDA; NHTSA; CPSC; and other national public-health or pediatric bodies when they are the primary authority.
- Use two to five strong sources rather than a long generic bibliography. Open and read the pages; do not rely on search snippets.
- Cross-check thresholds, preparation instructions, emergency guidance, and safety rules against a primary authority. If reputable sources differ, state the uncertainty or range instead of silently choosing one.
- Link citations directly from the claims they support and include a compact Sources section. Never invent a citation or cite a search-results page.
- Keep guidance general and educational. Do not diagnose, predict an individual baby's development, or request private family data.
- Use any calculated age as authoring context, not as personal content. Keep the published page useful to caregivers generally and avoid text that becomes false as the baby gets older.

## Plan the page

Read [references/page-contract.md](references/page-contract.md) completely before drafting. Use its content outcomes and adapt them to the topic rather than forcing irrelevant headings. Treat the checked-in site context as private authoring context even though it travels with the repository.

Make the page answer, in this order:

1. What does this look like right now?
2. What changes next, roughly when, and how can a caregiver recognize the transition?
3. What does reassuring progress look like?
4. What deserves a routine call, a prompt call, or urgent help?
5. What common variation is usually not worth stressing about?
6. What small actions are useful today?

Use observable signs and ranges. Explain transitions as changes a caregiver can notice, not only as calendar dates. Treat milestones as broad guides, not deadlines.

## Implement the page

- Replace the target's placeholder content with concise, scannable, semantic HTML.
- Preserve its existing title, homepage category, back link, stylesheet path, and overall Little Notes visual language.
- Use plain HTML and shared CSS only. Add no JavaScript, package, font, tracker, form, or external runtime dependency.
- Prefer reusable class names in `styles.css`; do not add inline styles. Reuse existing topic-page classes once established.
- Keep the page lightweight enough to scan while holding a baby. Favor short paragraphs, clear lists, descriptive link text, and a restrained number of callouts.
- Use calm, direct language. Avoid shame, absolutes, promises, and vague instructions such as “monitor closely” without saying what to watch for.
- Separate emergency signs visually and textually from common variation. Never let reassurance obscure an urgent threshold.
- Do not hard-code personal baby or family details.

## Verify before finishing

1. Confirm the target no longer contains `Content coming soon` or placeholder-only markup.
2. Check that every required content outcome in the page contract is present or intentionally adapted for the topic.
3. Check heading order, landmark structure, focus-visible behavior, readable link text, mobile layout, and reduced-motion compatibility.
4. Check all cited URLs and confirm high-stakes numbers and thresholds match the cited authority.
5. Run available HTML/CSS checks without adding dependencies. Inspect the rendered page in a browser when browser tooling is available.
6. Review the diff. It should contain one topic page and, only if necessary, shared CSS. Preserve unrelated user changes.
7. If validation passes, treat the `$write-page` invocation as authorization to commit the target page and any necessary shared CSS directly to `main`, then push. Skip the commit or push only when the user explicitly asks. Never include unrelated worktree changes.
8. Report the completed page, validation performed, source authorities used, remaining uncertainty, and the commit and push result.
