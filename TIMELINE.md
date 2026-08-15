# Dated content framework

The timeline changes editorial emphasis; it does not decide whether a baby is
developing normally. Every full guide and every urgent-care section remains
available regardless of the selected date.

## How selection works

- With no query parameter, the browser's current local date is selected.
- A dated card changes the URL to `?date=YYYY-MM-DD`. That preview date follows
  links between the homepage and topic pages.
- The active stage is the latest stage whose start date is on or before the
  selected date.
- The supported interval is birth through the day before the 4-month
  anniversary. A date before or after it gets an explicit scope notice while
  still showing the closest card for planning or reference.
- Day and week anchors use completed calendar days from birth. Month anchors
  use calendar anniversaries, not 30-day approximations.
- The exact birth date has one public copy: `timeline-data.js`.
- If JavaScript fails, the site fails open: the existing full guides remain
  readable and the homepage directory remains open.

## Why the homepage has these eight dates

These are deliberately sparse. A new date exists only where several concerns
change together or an especially useful reminder becomes timely.

| Anchor | Editorial reason |
| --- | --- |
| Birth | Frequent feeding, cue learning, warmth, safe sleep, and the first ride home are immediate priorities. |
| Day 3 | Milk volume, urine, stool, weight, and jaundice often enter an important transition; the first outpatient visit is commonly at 3–5 days. |
| Week 1 | Intake should have an established trend while cord, bathing, skin, and fragmented sleep remain prominent. |
| Week 2 | Birth-weight recovery, persistent jaundice, increasing crying, spit-up, and cord separation become useful review points. |
| Calendar month 1 | Longer alert periods make interaction and awake play more noticeable, while crying and sleep remain unpredictable. |
| Week 6 | Crying is commonly near its high period, tummy-time totals can build, and a 2-month check-in is close. |
| Calendar month 2 | The CDC 2-month checklist becomes appropriate; rolling attempts can begin this early, so swaddling deserves a strong recheck. |
| Calendar month 3 | Rhythms and stamina may be clearer, but the site previews 4-month development instead of inventing a 3-month pass/fail checklist. |

The homepage source starting points are embedded in each selected panel. Core
authorities include the [AAP 3–5 day visit guide](https://www.aap.org/en/patient-care/newborn-infant-and-early-childhood-nutrition/newborn-and-infant-health-assessment-and-promotion/first-office-visit-3-5-days/),
[CDC newborn feeding and diaper guidance](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/newborn-basics.html),
[CDC milestones by 2 months](https://www.cdc.gov/act-early/milestones/2-months.html),
and [NIH tummy-time guidance](https://safetosleep.nichd.nih.gov/reduce-risk/tummy-time).
The initial framework research was reviewed on 2026-08-15. Editorial completion
of each starter item is tracked separately as described below.

## Topic timelines

Every file under `topics/` has a matching entry in
`timeline-data.js#topicTimelines`. Topic dates are intentionally independent:
wet diapers change day by day at first, jaundice has day 3 and persistence
checks, crying has week 2 and week 6 emphasis, and fixed setup topics use only
meaningful recheck dates.

Each stage contains:

```js
{
  key: "week-2",
  at: { weeks: 2 }, // or { days: 3 } / { months: 2 }
  label: "2 weeks",
  title: "A concise change in focus",
  summary: "One or two useful sentences.",
  points: ["Two or three practical observations."],
  sources: ["sourceRegistryId"]
}
```

Keep stages short enough to scan while holding a baby. Add a date only when the
source supports a real timing change. Put fixed safety rules and warning signs
in the full guide, not behind a dated card.

## Editorial review queue

The original timeline pass deliberately created useful starter copy. A tracked
review queue now distinguishes structurally valid starter text from a timeline
item that has received a focused, current evidence audit.

There are two work-item shapes:

- `topic/<slug>` covers every dated card for one topic and reconciles those
  cards with the matching full HTML guide. The cards form one sequence, so they
  are researched together rather than in disconnected card-by-card sessions.
- `home/<stage-key>` covers one dated homepage card, including its boundary,
  featured topics, notes, and overview sources.

Topic items run before homepage items so the final homepage summaries can be
checked against reviewed topic guidance. `timeline-review-progress.json` stores
the stable item ID, local review date, and whether the audit updated published
content or confirmed it without an editorial change. It is authoring metadata
and is not loaded by the website.

Use the checked-in runner:

```sh
./scripts/write-baby-timeline-items.sh --list
./scripts/write-baby-timeline-items.sh --limit 1
./scripts/write-baby-timeline-items.sh --item topic/getting-enough
./scripts/write-baby-timeline-items.sh --resume
```

The runner uses one persisted Codex session per item, enables current web
research, logs outside the repository, and stops on the first failed session or
postcondition. It requires clean, synchronized `main`; verifies that only the
target item was marked complete; reruns the dependency-free checks; and confirms
the result was pushed before continuing. `--resume` continues the same session
after an interruption instead of silently starting a second audit.

## Conditions that override dates

Some changes cannot be inferred safely from a birth date. Dated text should
name the observable condition that wins:

- stop swaddling at the first sign of trying to roll;
- use sponge baths until the cord is off and the navel is dry and healed;
- change a feeding-wake plan only after the clinician confirms intake and
  growth are reassuring;
- introduce a pacifier around direct breastfeeding only when feeding is well
  established;
- after a birth more than 3 weeks early, use
  [corrected age](https://www.healthychildren.org/English/ages-stages/baby/preemie/Pages/Preemie-Milestones.aspx)
  with the care team for developmental timing;
- use clinician and current official guidance for vaccines, RSV protection,
  screening follow-up, and any individualized plan.

## Researched backlog for future topics

These are intentionally not improvised as simple age gates. The notes below
preserve useful starting anchors and the conditions that should override them.

| Topic | Candidate anchors and initial content | Starting source |
| --- | --- | --- |
| Checkups, screening results, and the clinician plan | At discharge, record whether blood-spot, pulse-ox, and hearing screens were completed and how results arrive. Feature the routine 3–5-day, 1-month, and 2-month visits, while letting the baby’s discharge plan override those dates. Keep immunization details link-driven because recommendations can change. | [AAP well-child schedule](https://www.healthychildren.org/English/family-life/health-management/Pages/Well-Child-Care-A-Check-Up-for-Success.aspx), [HRSA three-part newborn screening overview](https://newbornscreening.hrsa.gov/about-newborn-screening) |
| Parent recovery and mental health | Keep urgent physical and mental-health warning signs permanently visible. Around 2 weeks, distinguish short-lived “baby blues” from severe or persistent symptoms. Prompt contact with the maternal care team within 3 weeks and a comprehensive visit no later than 12 weeks; individualized risks may require earlier care. Thoughts of self-harm or harming the baby and postpartum psychosis are emergencies. | [ACOG postpartum-care guidance](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care), [NIMH perinatal depression](https://www.nimh.nih.gov/health/publications/perinatal-depression) |
| Vitamin D | Start in the first days, but gate the advice by feeding method rather than a later birthday. CDC says breastfed infants, and partially breastfed infants consuming under 32 ounces of infant formula daily, generally need 400 IU daily; the clinician should confirm the product and plan. | [CDC vitamin D and breastfeeding](https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/vitamin-d.html) |
| RSV protection | For the first RSV season, the main gates are maternal vaccination status and timing, infant age, season, and geography—not whether a healthy term infant has extra risk factors. Most infants need either maternal vaccination or an infant antibody, not both. Ask at birth/discharge and again before the local season; point to current guidance instead of copying a schedule into static data. | [CDC infant RSV guidance](https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/infants-young-children.html) |
| Hearing follow-up | Confirm screening by 1 month. If baby did not pass, highlight diagnostic audiology before 3 months; diagnosed hearing loss should connect to intervention before 6 months. A non-pass result overrides every generic card. | [CDC hearing-screen benchmarks](https://www.cdc.gov/hearing-loss-children/screening/index.html) |

If one is added, create a normal full guide with authoritative sources first,
then add only the few dated stages that materially change its emphasis.

## Manual browser smoke check

The automated tests cover date arithmetic, configuration integrity, and static
markup without adding a browser dependency. After changing `timeline.js`, also
check these behaviors in a browser:

1. Load without `?date=` and confirm the current local date and card are shown.
2. Use the keyboard to activate a past or future card; focus should return to
   the selected card, the URL should update, and the new panel should announce.
3. Open a featured topic and return home; the preview date should follow both
   links. “Return to today” should remove it.
4. Open `index.html#feeding` directly and confirm the full directory expands.
5. Preview one date before birth and one on or after the 4-month anniversary;
   each should show a scope notice and a bounded panel range.
6. Disable JavaScript and confirm every full topic guide remains readable and
   all 30 homepage links remain open. Also test one direct `file://` preview.
