(function (root, factory) {
  "use strict";

  const data = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = data;
  }

  root.LittleNotesData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  return {
    // This is intentionally the only public copy of the birth date. It drives the
    // static site's dated cards; do not add names, health records, or other family data.
    birthDate: "2026-08-12",
    // The 3-month card remains current until the 4-month anniversary, when this
    // deliberately scoped framework ends.
    scopeEnd: { months: 4 },
    researchReviewed: "2026-08-15",

    sources: {
      aapBathing: {
        title: "American Academy of Pediatrics: Bathing Your Baby",
        url: "https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Bathing-Your-Newborn.aspx"
      },
      aapBreastfeedingQuestions: {
        title: "American Academy of Pediatrics: Breastfeeding Questions",
        url: "https://www.healthychildren.org/English/tips-tools/symptom-checker/Pages/symptomviewer.aspx?symptom=Breast-Feeding+Questions"
      },
      aapBreathingTrouble: {
        title: "American Academy of Pediatrics: Breathing Trouble",
        url: "https://www.healthychildren.org/English/tips-tools/Symptom-Checker/Pages/symptomviewer.aspx?symptom=Breathing%2BTrouble"
      },
      aapBurping: {
        title: "American Academy of Pediatrics: Baby Burping, Hiccups & Spit-Up",
        url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/baby-burping-hiccups-and-spit-up.aspx"
      },
      aapCarSeat: {
        title: "American Academy of Pediatrics: Car Seats—Information for Families",
        url: "https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Car-Safety-Seats-Information-for-Families.aspx"
      },
      aapColic: {
        title: "American Academy of Pediatrics: Colic Relief Tips for Parents",
        url: "https://www.healthychildren.org/English/ages-stages/baby/crying-colic/pages/Colic.aspx"
      },
      aapCommonNewbornConditions: {
        title: "American Academy of Pediatrics: 11 Common Conditions in Newborns",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Common-Conditions-in-Newborns.aspx"
      },
      aapCorrectedAge: {
        title: "American Academy of Pediatrics: Developmental Milestones for Preterm Babies",
        url: "https://www.healthychildren.org/English/ages-stages/baby/preemie/Pages/Preemie-Milestones.aspx"
      },
      aapCord: {
        title: "American Academy of Pediatrics: Umbilical Cord Care in Newborns",
        url: "https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Umbilical-Cord-Care.aspx"
      },
      aapCryingSupport: {
        title: "American Academy of Pediatrics: How to Cope With Challenges of Being a New Parent",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Challenges-of-Being-a-New-Mom.aspx"
      },
      aapRespondingToCries: {
        title: "American Academy of Pediatrics: Responding to Your Baby’s Cries",
        url: "https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Responding-to-Your-Babys-Cries.aspx"
      },
      aapCryingUnder3: {
        title: "American Academy of Pediatrics: Crying Baby—Before 3 Months Old",
        url: "https://www.healthychildren.org/English/tips-tools/Symptom-Checker/Pages/symptomviewer.aspx?symptom=Crying+Baby+-+Before+3+Months+Old"
      },
      aapDehydration: {
        title: "American Academy of Pediatrics: Signs of Dehydration in Infants & Children",
        url: "https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/dehydration.aspx"
      },
      aapDiaperRash: {
        title: "American Academy of Pediatrics: Common Diaper Rashes & Treatments",
        url: "https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx"
      },
      aapFever: {
        title: "American Academy of Pediatrics: Fever and Your Baby",
        url: "https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx"
      },
      aapFirstMonthDevelopment: {
        title: "American Academy of Pediatrics: Developmental Milestones at 1 Month Old",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-1-Month.aspx"
      },
      aapFirstMonthGrowth: {
        title: "American Academy of Pediatrics: Your Baby’s First Month—Growth & Physical Appearance",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/First-Month-Physical-Appearance-and-Growth.aspx"
      },
      aapFirstWeekVisit: {
        title: "American Academy of Pediatrics: First Week Visit (3 to 5 Days)",
        url: "https://www.aap.org/en/patient-care/newborn-infant-and-early-childhood-nutrition/newborn-and-infant-health-assessment-and-promotion/first-office-visit-3-5-days/"
      },
      aapJaundice: {
        title: "American Academy of Pediatrics: Jaundice in Newborns",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/jaundice.aspx"
      },
      aapMedicalHelp: {
        title: "American Academy of Pediatrics: Urgent Care, ER or Pediatrician?",
        url: "https://www.healthychildren.org/English/family-life/health-management/Pages/urgent-care-ER-or-pediatrician-a-parent-guide.aspx"
      },
      aapNewbornAppearance: {
        title: "American Academy of Pediatrics: How Your Newborn Looks",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/How-Your-Newborn-Looks.aspx"
      },
      aapNewbornBehavior: {
        title: "American Academy of Pediatrics: Newborn Reflexes and Behavior",
        url: "https://www.healthychildren.org/English/tips-tools/Symptom-Checker/Pages/symptomviewer.aspx?symptom=Newborn%2BReflexes%2Band%2BBehavior"
      },
      aapNewbornIllness: {
        title: "American Academy of Pediatrics: Newborn Illness—How to Recognize",
        url: "https://www.healthychildren.org/English/tips-tools/Symptom-Checker/Pages/symptomviewer.aspx?symptom=Newborn%2BIllness%2B-%2BHow%2Bto%2BRecognize"
      },
      aapNewbornPoop: {
        title: "American Academy of Pediatrics: Baby’s First Days—Bowel Movements & Urination",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Babys-First-Days-Bowel-Movements-and-Urination.aspx"
      },
      aapPacifier: {
        title: "American Academy of Pediatrics: Baby Pacifiers & Thumb Sucking—What Parents Need to Know",
        url: "https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Pacifiers-and-Thumb-Sucking.aspx?lang=en"
      },
      aapReflux: {
        title: "American Academy of Pediatrics: Gastroesophageal Reflux in Infants",
        url: "https://www.healthychildren.org/English/health-issues/conditions/abdominal/Pages/GERD-Reflux.aspx"
      },
      aapSafeSleep: {
        title: "American Academy of Pediatrics: How to Keep Your Sleeping Baby Safe",
        url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx"
      },
      aapSleep: {
        title: "American Academy of Pediatrics: Getting Your Baby to Sleep",
        url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/getting-your-baby-to-sleep.aspx"
      },
      aapSkinToSkin: {
        title: "American Academy of Pediatrics: Skin-to-Skin Contact",
        url: "https://www.healthychildren.org/English/ages-stages/baby/preemie/Pages/About-Skin-to-Skin-Care.aspx"
      },
      aapSwaddle: {
        title: "American Academy of Pediatrics: Swaddling—Is It Safe?",
        url: "https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx"
      },
      aapTemperature: {
        title: "American Academy of Pediatrics: How to Take a Child’s Temperature",
        url: "https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/How-to-Take-a-Childs-Temperature.aspx"
      },
      aapTummyTime: {
        title: "American Academy of Pediatrics: Back to Sleep, Tummy to Play",
        url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Back-to-Sleep-Tummy-to-Play.aspx"
      },
      aapWaterSafety: {
        title: "American Academy of Pediatrics: Infant Drowning Prevention & Water Safety",
        url: "https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Infant-Water-Safety.aspx"
      },
      cdcBottleFeeding: {
        title: "CDC: About Feeding From a Bottle",
        url: "https://www.cdc.gov/infant-toddler-nutrition/bottle-feeding/index.html"
      },
      cdcBreastfeedingBasics: {
        title: "CDC: Newborn Breastfeeding Basics",
        url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/newborn-basics.html"
      },
      cdcBreastfeedingFrequency: {
        title: "CDC: How Much and How Often to Breastfeed",
        url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/how-much-and-how-often.html"
      },
      cdcBreastfeedingTransition: {
        title: "CDC: What to Expect While Breastfeeding",
        url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/what-to-expect-while-breastfeeding.html"
      },
      cdcCleaning: {
        title: "CDC: How to Clean, Sanitize, and Store Infant Feeding Items",
        url: "https://www.cdc.gov/hygiene/faq/"
      },
      cdcAbusiveHeadTrauma: {
        title: "CDC: About Abusive Head Trauma",
        url: "https://www.cdc.gov/child-abuse-neglect/about/about-abusive-head-trauma.html"
      },
      cdcBottleCleaning: {
        title: "CDC: How to Clean, Sanitize, and Store Infant Feeding Items",
        url: "https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html"
      },
      cdcFormulaPrep: {
        title: "CDC: Infant Formula Preparation and Storage",
        url: "https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/preparation-and-storage.html"
      },
      cdcFormulaFrequency: {
        title: "CDC: How Much and How Often to Feed Infant Formula",
        url: "https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html"
      },
      cdcHungerCues: {
        title: "CDC: Signs Your Child Is Hungry or Full",
        url: "https://www.cdc.gov/infant-toddler-nutrition/mealtime/signs-your-child-is-hungry-or-full.html"
      },
      cdcMilestones2: {
        title: "CDC: Milestones by 2 Months",
        url: "https://www.cdc.gov/act-early/milestones/2-months.html"
      },
      cdcMilestones4: {
        title: "CDC: Milestones by 4 Months",
        url: "https://www.cdc.gov/act-early/milestones/4-months.html"
      },
      cdcSafeSleep: {
        title: "CDC: Providing Care for Babies to Sleep Safely",
        url: "https://www.cdc.gov/sudden-infant-death/sleep-safely/"
      },
      cdcSkinToSkin: {
        title: "CDC: Safety in Maternity Care",
        url: "https://www.cdc.gov/breastfeeding/php/guidelines-recommendations/safety-in-maternity-care.html"
      },
      cdcMpinCSupportingEvidence: {
        title: "CDC: mPINC Survey Supporting Evidence",
        url: "https://www.cdc.gov/breastfeeding-data/mpinc/supporting-evidence.html"
      },
      medlineDiaperRash: {
        title: "MedlinePlus: Diaper Rash",
        url: "https://medlineplus.gov/ency/article/000964.htm"
      },
      nhtsaRearFacing: {
        title: "NHTSA: How to Install Rear-Facing Car Seats",
        url: "https://www.nhtsa.gov/car-seats-and-booster-seats/how-install-rear-facing-car-seats"
      },
      nihSafeSleep: {
        title: "NIH Safe to Sleep: Ways to Reduce Baby’s Risk",
        url: "https://safetosleep.nichd.nih.gov/reduce-risk/reduce"
      },
      nihSafeSleepEnvironment: {
        title: "NIH Safe to Sleep: Safe Sleep Environment for Baby",
        url: "https://safetosleep.nichd.nih.gov/reduce-risk/safe-sleep-environment"
      },
      nihTummyTime: {
        title: "NIH Safe to Sleep: Tummy Time for a Healthy Baby",
        url: "https://safetosleep.nichd.nih.gov/reduce-risk/tummy-time"
      },
      nationalAcademiesSleepPhysiology: {
        title: "National Academies: Sleep Physiology and Infant Sleep Patterns",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK19956/"
      },
      nhsBabySleep: {
        title: "NHS: Helping Your Baby to Sleep",
        url: "https://www.nhs.uk/baby/caring-for-a-newborn/helping-your-baby-to-sleep/"
      },
      whoPostnatal: {
        title: "World Health Organization: Recommendations on Maternal and Newborn Care",
        url: "https://www.who.int/publications/i/item/9789240045989"
      }
    },

    homeStages: [
      {
        key: "birth",
        at: { days: 0 },
        label: "Birth · day 0",
        title: "Start with the essentials",
        summary: "Feed responsively, keep baby warm and close, and set up every sleep safely. Early patterns change quickly.",
        topics: [
          { id: "skin-to-skin", note: "Warmth, calm, connection, and early feeding support." },
          { id: "feeding-frequency-and-waking", note: "Frequent feeds and an individualized waking plan." },
          { id: "hunger-and-fullness-cues", note: "Respond to early cues before crying begins." },
          { id: "breastfeeding-and-latch", note: "Get help early when latch or milk transfer hurts or worries you." },
          { id: "bottle-feeding", note: "Use responsive positioning and pacing when a bottle is used." },
          { id: "formula-preparation-and-storage", note: "If formula is used, prepare and store it safely from the first bottle." },
          { id: "clothing-and-room-temperature", note: "Balance newborn warmth with avoiding overheating." },
          { id: "car-seat-safety", note: "Check the setup before the first trip home." }
        ],
        sources: ["cdcBreastfeedingFrequency", "cdcHungerCues", "aapSafeSleep", "cdcFormulaPrep"]
      },
      {
        key: "day-3",
        at: { days: 3 },
        label: "Day 3",
        title: "Watch the first trends",
        summary: "Milk, feeding, diapers, stool, and jaundice often shift now. Look at the whole pattern and ask early when something feels off.",
        topics: [
          { id: "getting-enough", note: "Judge intake through feeding, output, behavior, and weight together." },
          { id: "wet-diapers", note: "The expected pattern rises quickly during the first days." },
          { id: "newborn-poop", note: "Stool should begin changing away from dark meconium." },
          { id: "jaundice", note: "Yellowing commonly becomes noticeable during the first few days." },
          { id: "breastfeeding-and-latch", note: "Increasing milk volume may make transfer concerns clearer." },
          { id: "formula-preparation-and-storage", note: "Correct mixing, handling, and storage reduce risk." },
          { id: "rest-of-the-first-week", note: "Prepare for the 3–5 day check and the next few days." }
        ],
        sources: ["aapFirstWeekVisit", "cdcBreastfeedingBasics", "aapJaundice", "cdcFormulaPrep"]
      },
      {
        key: "week-1",
        at: { days: 7 },
        label: "Week 1 · day 7",
        title: "One week together",
        summary: "Review feeding and follow-up, care for the cord and skin, and expect sleep to remain fragmented.",
        topics: [
          { id: "jaundice", note: "Keep following the measured bilirubin and feeding plan." },
          { id: "umbilical-cord-care", note: "The stump is drying but may normally remain attached." },
          { id: "bathing-a-newborn", note: "Bathing guidance still depends on cord healing." },
          { id: "newborn-skin", note: "Peeling, spots, and transient rashes prompt common questions." },
          { id: "normal-newborn-sleep", note: "Short, irregular sleep is expected—not a schedule problem." },
          { id: "getting-enough", note: "Review feeding, output, and the weight trend." },
          { id: "wet-diapers", note: "Output remains a practical clue to hydration and intake." }
        ],
        sources: ["aapCord", "aapBathing", "aapSleep", "cdcBreastfeedingBasics", "aapJaundice"]
      },
      {
        key: "week-2",
        at: { days: 14 },
        label: "Week 2 · day 14",
        title: "New patterns are showing up",
        summary: "Review birth-weight recovery and jaundice while crying, spit-up, and soothing needs become more noticeable. Normal ranges remain broad.",
        topics: [
          { id: "weeks-two-to-four", note: "Frame the next stretch without expecting a fixed schedule." },
          { id: "crying-and-soothing", note: "Crying often begins increasing during the early weeks." },
          { id: "burping-gas-and-spit-up", note: "Spit-up and feeding discomfort may become more apparent." },
          { id: "umbilical-cord-care", note: "Many cords separate around now, but timing varies." },
          { id: "getting-enough", note: "Use the measured trend to confirm birth-weight recovery." },
          { id: "swaddling-safely", note: "Reinforce safe technique and back sleeping." },
          { id: "jaundice", note: "Persistent yellowing now has feeding-method-specific follow-up points." }
        ],
        sources: ["aapFirstWeekVisit", "aapJaundice", "aapCryingSupport", "aapReflux"]
      },
      {
        key: "month-1",
        at: { months: 1 },
        label: "1 month",
        title: "More awake, still unpredictable",
        summary: "Baby may be more alert and interactive while sleep and crying remain irregular. Offer connection and play without testing performance.",
        topics: [
          { id: "feeding-frequency-and-waking", note: "Intervals may shift, but cues and the growth plan still lead." },
          { id: "tummy-time-and-awake-play", note: "Expand short, supervised play as alert time grows." },
          { id: "crying-and-soothing", note: "Crying may still be increasing; caregiver support matters." },
          { id: "day-and-night", note: "Use gentle light and activity cues, without expecting a schedule." },
          { id: "newborn-skin", note: "Baby acne and other benign changes may appear now." },
          { id: "pacifiers", note: "Use can be reconsidered once feeding is going well." },
          { id: "jaundice", note: "Yellowing that remains at 4 weeks needs a feeding-specific review." }
        ],
        sources: ["aapFirstMonthDevelopment", "nihTummyTime", "aapCryingSupport", "cdcBreastfeedingFrequency", "aapJaundice"]
      },
      {
        key: "week-6",
        at: { days: 42 },
        label: "Week 6 · day 42",
        title: "The fussy stretch",
        summary: "Crying is often near its high period around 4–6 weeks. Build in caregiver relief, keep play gentle, and prepare for the 2-month check-in.",
        topics: [
          { id: "crying-and-soothing", note: "This is a common high-crying window, not a guaranteed peak." },
          { id: "tummy-time-and-awake-play", note: "Gradually increase supervised play as baby tolerates it." },
          { id: "swaddling-safely", note: "Rolling signs—not this date—are the stop signal; recheck now." },
          { id: "two-month-milestones", note: "Preview observations to discuss with the pediatrician." },
          { id: "getting-enough", note: "Breastfed stool frequency may change while wet-diaper expectations do not." },
          { id: "burping-gas-and-spit-up", note: "Reflux and spit-up commonly continue." },
          { id: "normal-newborn-sleep", note: "Frequent waking remains normal." }
        ],
        sources: ["aapColic", "nihTummyTime", "cdcMilestones2", "cdcBreastfeedingBasics", "aapSwaddle"]
      },
      {
        key: "month-2",
        at: { months: 2 },
        label: "2 months",
        title: "Check in, don’t grade",
        summary: "Use 2-month milestones as conversation prompts, revisit swaddling before rolling attempts, and keep safe-sleep practices unchanged.",
        topics: [
          { id: "two-month-milestones", note: "Notice what baby does; use corrected age after prematurity." },
          { id: "tummy-time-and-awake-play", note: "Observe head lifting and movement through play." },
          { id: "swaddling-safely", note: "Rolling signs override age—stop as soon as they appear." },
          { id: "day-and-night", note: "Night sleep may lengthen, but a schedule is not required." },
          { id: "crying-and-soothing", note: "Crying may be near its high point or beginning to ease." },
          { id: "hunger-and-fullness-cues", note: "Let changing feed size or spacing remain cue-led." },
          { id: "car-seat-safety", note: "Growth makes harness fit worth rechecking." }
        ],
        sources: ["cdcMilestones2", "aapCorrectedAge", "aapSwaddle", "aapSafeSleep"]
      },
      {
        key: "month-3",
        at: { months: 3 },
        label: "3 months",
        title: "Rhythms may be emerging",
        summary: "Longer alert periods and clearer day-night patterns may appear, while feeding, reflux, crying, and sleep still vary widely.",
        topics: [
          { id: "tummy-time-and-awake-play", note: "Floor play can grow with stamina while staying supervised." },
          { id: "day-and-night", note: "A day-night rhythm may be clearer without being dependable." },
          { id: "normal-newborn-sleep", note: "Regular sleep cycles generally remain a later development." },
          { id: "burping-gas-and-spit-up", note: "Normal reflux may continue and can increase beyond 3 months." },
          { id: "crying-and-soothing", note: "Many babies ease, but continued crying is not automatically abnormal." },
          { id: "two-month-milestones", note: "Review progress and preview what comes next without grading." },
          { id: "hunger-and-fullness-cues", note: "Keep changing feed size and spacing led by baby’s cues." },
          { id: "car-seat-safety", note: "Recheck fit as length, weight, and head control change." }
        ],
        sources: ["aapSleep", "aapColic", "cdcMilestones4", "aapReflux", "aapCarSeat", "cdcHungerCues"]
      }
    ],

    topicTimelines: {
      "hunger-and-fullness-cues": {
        heading: "Feeding cues for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Catch cues while baby is calm",
            summary: "Crying is often a late hunger cue. Offer the breast or bottle when early cues appear, while following any waking plan from the discharge or care team.",
            points: [
              "Hunger may look like hands to mouth, rooting, lip-smacking, or clenched hands.",
              "Fullness may look like a closed mouth, turning away, or relaxed hands.",
              "Pause or stop for fullness cues; baby does not need to finish a bottle."
            ],
            sources: ["cdcHungerCues"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Let the rhythm keep changing",
            summary: "Many babies gradually take more at a feed and some intervals lengthen, but the pattern still varies. Keep cues and the growth plan ahead of a clock.",
            points: [
              "Crying or sucking alone can also mean comfort, tiredness, a diaper, or a need for closeness.",
              "Offer more after a bottle only if hunger cues return; do not pressure baby to finish.",
              "Ask the clinician before changing a waking plan for a baby with feeding or growth concerns."
            ],
            sources: ["cdcHungerCues", "cdcBreastfeedingFrequency"]
          }
        ]
      },
      "feeding-frequency-and-waking": {
        heading: "Feeding rhythm for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Feed around the clock, by cues and plan",
            summary: "Newborn stomachs are small, so frequent feeds are expected. Offer milk at early cues; until intake and growth are reassuring, wake a sleepy baby on the discharge or clinician plan.",
            points: [
              "Breastfed babies commonly feed 8–12 times in 24 hours and may want to eat every 1–3 hours.",
              "If using only formula, start by offering 1–2 ounces every 2–3 hours; offer more when baby shows hunger cues.",
              "Patting, stroking, a diaper change, or undressing can help wake a sleepy baby for a feed."
            ],
            sources: ["cdcBreastfeedingFrequency", "cdcFormulaFrequency", "cdcBreastfeedingBasics"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Let the weight check set the waking plan",
            summary: "Birth weight is often regained by 7–14 days, but the feeding, diaper, jaundice, and weight trends belong together. Do not lengthen a waking interval from the calendar alone.",
            points: [
              "Keep the discharge or clinician plan until the care team says intake and growth are reassuring.",
              "Ask at the follow-up weight check what the longest gap should be, including overnight.",
              "Call promptly for poor intake, difficult waking, falling output, worsening yellow color, or continued weight loss."
            ],
            sources: ["aapFirstWeekVisit", "cdcBreastfeedingBasics"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Expect variation as some gaps stretch",
            summary: "Some gaps may lengthen gradually, while cluster feeding and night feeds can still be normal. Feed responsively; growth and the clinician’s advice decide whether a scheduled wake-up can change.",
            points: [
              "Exclusively breastfed babies average every 2–4 hours, though some feeds may be hourly or a sleep gap may reach 4–5 hours.",
              "Formula-fed babies commonly feed about every 3–4 hours in the first weeks and months.",
              "Do not force a longer interval or larger feed; ask the clinician before changing a waking plan."
            ],
            sources: ["cdcBreastfeedingFrequency", "cdcFormulaFrequency"]
          }
        ]
      },
      "breastfeeding-and-latch": {
        heading: "Latch and milk transfer for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Build a deep, comfortable latch",
            summary: "Breastfeeding is a learning process. A deep latch helps milk transfer and should feel like tugging, not ongoing pain or pinching.",
            points: [
              "Look for a wide mouth over the areola, lips turned out, chin on the breast, and head and body in line.",
              "Watch or listen for regular swallowing; early colostrum swallows can be quiet.",
              "If it pinches or hurts, gently break suction and relatch; get hands-on help early if it keeps happening."
            ],
            sources: ["cdcBreastfeedingBasics"]
          },
          {
            key: "day-3",
            at: { days: 3 },
            label: "Day 3",
            title: "Expect milk volume to rise",
            summary: "For most parents, thinner, whiter milk comes in by about day 3, though it can take longer. Frequent feeding and milk removal help build supply.",
            points: [
              "Full, warm breasts and more obvious swallowing can appear; feed often rather than relying on a clock alone.",
              "Use swallowing plus diaper and weight trends—not breast fullness alone—to judge transfer.",
              "Ask for help promptly if severe fullness makes it hard for baby to attach."
            ],
            sources: ["cdcBreastfeedingTransition", "cdcBreastfeedingBasics"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Persistent pain needs help",
            summary: "Early nipple tenderness can happen, but breastfeeding should not stay painful with a good latch. Pain that has not improved over 1–2 weeks needs assessment.",
            points: [
              "Get help with cracked or bleeding nipples, clicking, repeated unlatching, or a nipple that looks flattened after feeds.",
              "Call a clinician for breast pain with fever, or if baby is not back to birth weight or is not gaining as expected."
            ],
            sources: ["cdcBreastfeedingTransition", "aapBreastfeedingQuestions"]
          }
        ]
      },
      "bottle-feeding": {
        heading: "Bottle feeding for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Follow cues and hold every bottle",
            summary: "Feed responsively: let sucking control the flow, allow breaks, and stop at fullness cues. The amount left in the bottle is not the goal.",
            points: [
              "Hold baby close and angle the bottle so milk flows only when baby sucks.",
              "Pause when baby pauses; stop for a closed mouth, turning away, or relaxed hands—even if milk remains.",
              "Never prop or leave a bottle in baby’s mouth; clean all bottle parts after every feed."
            ],
            sources: ["cdcBottleFeeding", "cdcHungerCues", "cdcBottleCleaning"]
          },
          {
            key: "week-4",
            at: { weeks: 4 },
            label: "4 weeks",
            title: "Practice a bottle if nursing is established",
            summary: "For a baby nursing well at the breast, the AAP suggests offering a small bottle of expressed milk at about 4 weeks. A feeding or growth concern overrides the date.",
            points: [
              "Try when baby is calm, not extremely hungry or already full.",
              "Another caregiver may have an easier first attempt.",
              "Use the same cue-led pacing; ask the care team before changing a feeding plan."
            ],
            sources: ["aapBreastfeedingQuestions", "cdcBottleFeeding"]
          }
        ]
      },
      "formula-preparation-and-storage": {
        heading: "Formula safety for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Use exact mixing and time limits",
            summary: "Powdered formula is not sterile. Follow the container exactly, use safe water, and keep the preparation and storage clocks visible.",
            points: [
              "Measure water first, then add the exact amount of powder.",
              "Use prepared formula within 2 hours and within 1 hour after feeding starts; refrigerate untouched formula no longer than 24 hours.",
              "Discard leftovers and never microwave formula."
            ],
            sources: ["cdcFormulaPrep"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Keep cleaning; reassess daily sanitizing",
            summary: "After 2 months, daily sanitizing may no longer be needed for a healthy baby when items are carefully cleaned after every use. Prematurity or immune compromise keeps extra precautions active.",
            points: [
              "Take apart and clean bottles and all parts after every feeding, then air-dry them completely.",
              "Continue using safe water, exact label directions, and every storage limit for powdered formula.",
              "For a baby born prematurely or with a weakened immune system, keep the extra powdered-formula and daily-sanitizing precautions; use the clinician’s plan."
            ],
            sources: ["cdcFormulaPrep", "cdcBottleCleaning"]
          }
        ]
      },
      "getting-enough": {
        heading: "Intake clues for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Small output is expected at first",
            summary: "Intake and output begin small, especially before larger milk volumes arrive. The trend should rise each day.",
            points: [
              "Expect at least one wet diaper and one meconium stool on day 1.",
              "Watch swallowing, alertness for feeds, and satisfaction afterward."
            ],
            sources: ["cdcBreastfeedingBasics"]
          },
          {
            key: "day-3",
            at: { days: 3 },
            label: "Day 3",
            title: "Counts should be climbing",
            summary: "For a baby receiving breast milk, CDC guidance lists at least 5 wet diapers and 3 stools on day 3. Stool should be moving away from black meconium.",
            points: [
              "Look for active swallowing and a stool shift through brown or green toward yellow.",
              "Poor feeding, unusual sleepiness, deepening yellow color, or a measured loss over 10% needs prompt assessment."
            ],
            sources: ["aapFirstWeekVisit", "cdcBreastfeedingBasics"]
          },
          {
            key: "day-5",
            at: { days: 5 },
            label: "Day 5",
            title: "Output should now be obvious",
            summary: "By day 4–5, a newborn should pass 6 or more clear, dilute urines each day. With good human-milk intake, stool is usually yellow and seedy by now.",
            points: [
              "Formula-fed stool may look different, so use feeding, wet diapers, alertness, and the weight trend together.",
              "Call promptly for fewer than 6 wet diapers, continuing black stool, worsening yellow color, or weak feeding."
            ],
            sources: ["aapFirstWeekVisit", "cdcBreastfeedingBasics"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Birth-weight checkpoint",
            summary: "Birth weight is commonly regained by days 7–14. A measured loss over 10% needs evaluation; the clinician’s repeat weights answer whether gain is on track.",
            points: [
              "Use the clinician’s measured growth trend rather than a home impression.",
              "Keep watching feeding effectiveness and output; feeding or jaundice concerns override the calendar."
            ],
            sources: ["aapFirstWeekVisit"]
          },
          {
            key: "week-6",
            at: { weeks: 6 },
            label: "6 weeks",
            title: "Breastfed stool may become less frequent",
            summary: "After about 6 weeks, a baby receiving only breast milk may poop less often. Soft stool and reassuring feeding, wet diapers, and growth matter more than a perfect schedule.",
            points: [
              "Do not apply this reassurance to hard stools, illness, poor intake, or poor growth.",
              "Wet-diaper expectations do not drop with stool frequency."
            ],
            sources: ["cdcBreastfeedingBasics"]
          }
        ]
      },
      "burping-gas-and-spit-up": {
        heading: "Burping and spit-up for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Burp at natural pauses",
            summary: "Young babies can swallow air while feeding, especially from a bottle. Some breastfed babies swallow little air and may need little or no burping.",
            points: [
              "For a bottle, try after 2–3 ounces (60–90 mL); while nursing, try when switching breasts.",
              "If baby fusses while feeding, pause before more air is swallowed.",
              "Passing gas is normal, but it is not a reliable explanation for a crying spell."
            ],
            sources: ["aapBurping", "aapCryingUnder3"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Spit-up may become noticeable",
            summary: "Normal infant reflux commonly begins around 2–3 weeks. An easy, comfortable spit-up in a baby who is feeding and growing is often called a happy spitter.",
            points: [
              "Follow hunger and fullness cues rather than pressuring a bigger feed.",
              "Keep baby upright and closely supervised for a while after feeding; sleep is still flat and on the back.",
              "Burp at natural pauses rather than repeatedly interrupting an effective feed.",
            ],
            sources: ["aapReflux", "aapBurping"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Reflux may still be building",
            summary: "Normal reflux often peaks around 4–5 months. Judge the pattern by comfort, feeding, diapers, and growth—not laundry volume.",
            points: [
              "A later peak does not make pain, feeding refusal, or poor growth expected.",
              "Projectile, green, bloody, painful, or growth-limiting vomiting needs medical advice."
            ],
            sources: ["aapReflux"]
          }
        ]
      },
      "normal-newborn-sleep": {
        heading: "Sleep expectations for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Sleep comes in short pieces",
            summary: "Newborns sleep about 16–17 hours a day on average, often only one or two hours at a time. Waking around the clock is expected.",
            points: [
              "Expect feeding, sleeping, and waking to overlap without a schedule.",
              "Follow the feeding-wake plan from your care team, even when baby is sleepy.",
              "Start every sleep on the back in baby's own firm, flat sleep space."
            ],
            sources: ["aapSleep", "aapSafeSleep"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Notice the pattern, not a deadline",
            summary: "A longer nighttime stretch may be emerging, while frequent waking can still be normal. Regular sleep cycles generally do not develop until about 4 months.",
            points: [
              "Compare this week with last week, not with another baby's sleep.",
              "Keep daytime interaction and nighttime feeds calm and low-stimulation.",
              "Continue the same safe-sleep setup for every nap and night sleep."
            ],
            sources: ["aapSleep", "nhsBabySleep"]
          }
        ]
      },
      "day-and-night": {
        heading: "Day-and-night cues for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Make day and night feel different",
            summary: "Newborn sleep is spread across 24 hours. Gentle, repeated light and activity cues can introduce a difference without expecting a schedule.",
            points: [
              "By day, open curtains and use ordinary household sound, conversation, and play when baby is awake.",
              "At night, keep lights low and feeds and needed changes quiet and low-key.",
              "Feed or wake baby as the care team advises; a longer night is not the goal yet."
            ],
            sources: ["aapSleep", "nhsBabySleep", "cdcBreastfeedingFrequency"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "A pattern may be emerging",
            summary: "Daytime wakefulness and longer nighttime sleep may gradually become easier to notice around 2–3 months. Variation is still normal.",
            points: [
              "Keep the same simple daytime and nighttime cues rather than chasing a precise schedule.",
              "A short, calm wind-down can be useful, but nighttime hunger and the feeding plan still lead.",
              "Look for a trend over several days, not one unusually good or hard night."
            ],
            sources: ["nationalAcademiesSleepPhysiology", "aapSleep", "nhsBabySleep"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Keep cues; skip the deadline",
            summary: "The day-night difference may be clearer, but regular sleep cycles generally do not develop until about 4 months. A reliable schedule is not required.",
            points: [
              "Keep daytime interaction and nighttime care calm and low-stimulation.",
              "Do not treat a night waking as a behavior problem; respond to feeding, diaper, illness, or comfort needs.",
              "Check with the clinician before changing a plan to wake for feeds."
            ],
            sources: ["aapSleep", "nhsBabySleep"]
          }
        ]
      },
      "safe-sleep-setup": {
        heading: "Safe-sleep checks for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Set up every sleep space",
            summary: "For every nap and nighttime sleep, use a separate, firm, flat, level infant sleep surface in the caregiver’s room. These basics continue through the first year.",
            points: [
              "Use a mattress made for that sleep space and only its fitted sheet; keep soft and weighted objects out.",
              "Start every sleep on the back, including with spit-up or reflux unless the care team gives different instructions.",
              "After travel, move a sleeping baby from a sitting or carrying device to their regular sleep space as soon as possible."
            ],
            sources: ["cdcSafeSleep", "aapSafeSleep"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Let rolling set the change",
            summary: "Some babies start working toward rolling as early as 2 months. Recheck now, but an attempt to roll—not a birthday—is the signal to stop swaddling.",
            points: [
              "Make sure every caregiver keeps the sleep space empty and follows the product’s limits and instructions.",
              "Stop a swaddle or a sleep sack that compresses the arms, chest, or body at the first sign of trying to roll.",
              "A non-swaddling sleep sack that lets baby move freely can still be used if it fits and is used as directed."
            ],
            sources: ["aapSwaddle", "aapSafeSleep"]
          }
        ]
      },
      "swaddling-safely": {
        heading: "Swaddling guidance for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Optional calming, with room to move",
            summary: "Swaddling may calm some newborns but does not reduce SIDS risk. If used, it must fit within the permanent safe-sleep setup.",
            points: [
              "Place baby on the back for every nap and nighttime sleep, on a firm, flat, bare sleep surface.",
              "Keep the wrap secure and away from the face; let hips and knees bend up and out.",
              "Avoid overheating and never use a weighted swaddle or blanket."
            ],
            sources: ["aapSwaddle", "aapSafeSleep"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Watch for the exit signal",
            summary: "Some babies start trying to roll as early as 2 months. The first sign of trying—not a later birthday—is the stop point for swaddling.",
            points: [
              "Stop every blanket swaddle and wearable product that compresses the arms, chest, or body when baby starts trying to roll.",
              "Use fitted sleep clothing or a non-weighted sleep sack that lets baby move freely.",
              "Tell every caregiver; continue starting every sleep on the back."
            ],
            sources: ["aapSwaddle", "nihSafeSleep", "aapSafeSleep"]
          }
        ]
      },
      "pacifiers": {
        heading: "Pacifier guidance for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Feed first; soothe after",
            summary: "A pacifier is optional. Offer it for naps and bedtime only when you are sure baby is not hungry.",
            points: [
              "If feeding human milk by direct breastfeeding, wait until feeding is well established; if not breastfeeding, offer one whenever you like.",
              "Never use it to delay a feeding or force baby to take it.",
              "Do not attach it to clothing, blankets, toys, or anything in the sleep space."
            ],
            sources: ["aapPacifier", "nihSafeSleep"]
          },
          {
            key: "week-4",
            at: { weeks: 4 },
            label: "4 weeks",
            title: "Use feeding, not the date, as the signal",
            summary: "Three to four weeks is a common time for direct breastfeeding to be established, but comfort, enough milk, and weight gain matter more than the calendar.",
            points: [
              "If feeding is going well, offer it at naps and bedtime if desired; ask the pediatrician or lactation professional if you are unsure.",
              "If it falls out during sleep, there is no need to replace it.",
              "It is fine if baby refuses it; do not force it."
            ],
            sources: ["aapPacifier", "nihSafeSleep"]
          }
        ]
      },
      "skin-to-skin": {
        heading: "Skin-to-skin ideas for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "An observed first hour",
            summary: "For medically stable newborns and caregivers, start skin-to-skin as soon as possible after birth. The first hour or first feed is a useful protected window, with staff observation.",
            points: [
              "Keep baby upright on a bare chest, with the face visible and the airway clear.",
              "If feeding at the breast, let baby stay through the first feed when possible; it also benefits babies fed another way.",
              "Ask staff for help if either of you needs care; after a cesarean, begin when the caregiver is responsive and alert."
            ],
            sources: ["cdcSkinToSkin", "cdcMpinCSupportingEvidence"]
          },
          {
            key: "after-day-1",
            at: { days: 1 },
            label: "After day 1",
            title: "Comfort and feeding support—awake only",
            summary: "Keep skin-to-skin as a flexible tool for closeness, calming, and feeding support at home or in the hospital. Either parent or another caregiver can participate while fully alert.",
            points: [
              "Try it when baby is showing early feeding cues, needs calming, or after a bath; there is no home-session quota.",
              "Keep checking baby’s face, breathing, color, movement, and warmth—not only whether they seem quiet.",
              "If the caregiver becomes sleepy, move baby onto their back in their own firm, flat, level sleep space."
            ],
            sources: ["aapSkinToSkin", "cdcSkinToSkin", "nihSafeSleepEnvironment"]
          }
        ]
      },
      "crying-and-soothing": {
        heading: "Crying and soothing for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Respond and work through the basics",
            summary: "Crying is communication. In the first months, prompt, calm comforting does not spoil a baby; it helps you learn what they need.",
            points: [
              "Check hunger, a wet or soiled diaper, temperature, tiredness, and anything uncomfortable such as tight clothing or a hair around a toe.",
              "When baby seems well but keeps crying, try one or two calm options—holding, gentle rocking, a quiet voice, sucking, or skin-to-skin—then reassess.",
              "If soothing becomes sleep, use the usual safe sleep space; illness signs override every soothing plan."
            ],
            sources: ["aapRespondingToCries", "aapCryingUnder3"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Crying often starts to rise",
            summary: "Many babies begin crying more around 2 weeks and may keep doing so for about 2 months. A hard stretch can still be a normal pattern, but support matters.",
            points: [
              "Use a repeatable sequence: meet the most pressing need, lower stimulation, try a comfort method, then pause before changing course.",
              "Plan a handoff or a check-in with another calm adult before frustration builds.",
              "If overwhelmed, put baby on their back in an empty safe sleep space and take a brief reset; never shake, throw, hit, or jerk a baby."
            ],
            sources: ["aapCryingSupport", "cdcAbusiveHeadTrauma"]
          },
          {
            key: "week-6",
            at: { weeks: 6 },
            label: "6 weeks",
            title: "Near a common high-crying window",
            summary: "Regular fussiness often peaks around 4–6 weeks, sometimes near 3 hours a day. Calm periods, usual feeding, and normal growth are reassuring signs.",
            points: [
              "A predictable late-day fussy spell can be common; keep the response calm rather than trying many stimulating techniques at once.",
              "Protect caregiver breaks and sleep—crying can be especially intense in the first few months.",
              "Nonstop crying for more than 2 hours when baby cannot be consoled, or any abnormal behavior, needs prompt medical advice."
            ],
            sources: ["aapColic", "aapCryingUnder3", "cdcAbusiveHeadTrauma"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "The curve may start turning",
            summary: "Crying often begins to improve after 2 months, but the change is gradual and each baby’s pattern differs.",
            points: [
              "Keep the low-stimulation methods that work for your baby, and let ordinary feeds and sleep—not the clock—guide the routine.",
              "If you swaddle for comfort, stop at the first sign of trying to roll; keep back-sleep and a clear, firm sleep surface for every sleep."
            ],
            sources: ["aapCryingUnder3", "aapSafeSleep"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Often easing, never something to ignore",
            summary: "By 3–4 months, regular fussiness often drops to 1–2 hours a day and colicky crying commonly resolves. A new, worsening, or concerning cry still needs assessment.",
            points: [
              "You may notice longer calm periods and more response to familiar voice, face, and routines; those are observations, not a deadline.",
              "Do not assume pain, illness, poor feeding, or a changed cry is ‘just colic’—the pattern, not the birthday, decides what to do."
            ],
            sources: ["aapColic", "aapCryingUnder3"]
          }
        ]
      },
      "tummy-time-and-awake-play": {
        heading: "Awake play for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Start short, awake, and watched",
            summary: "Most babies can start tummy time a day or two after birth. Keep every try awake and supervised; very short repetitions count.",
            points: [
              "Try two or three short 3–5 minute sessions, then stop sooner if baby needs a break.",
              "A clear floor, tummy-to-tummy, or a supported lap position can make the first tries easier.",
              "If baby gets sleepy or you need to step away, place them on their back in a safe sleep space."
            ],
            sources: ["nihTummyTime", "aapTummyTime"]
          },
          {
            key: "week-7",
            at: { weeks: 7 },
            label: "7 weeks",
            title: "Build the daily total",
            summary: "AAP advises working gradually toward 15–30 total minutes a day by 7 weeks; NIH describes the same target as about 2 months. Split it into manageable sessions.",
            points: [
              "Add a minute or another session rather than forcing one long session.",
              "Pair it with waking from a nap or a diaper change.",
              "Vary awake positions and limit long stretches in swings, bouncers, car seats, and carriers."
            ],
            sources: ["nihTummyTime", "aapTummyTime"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Watch head control emerge",
            summary: "Holding the head up on the tummy and moving both arms and legs are CDC 2-month milestones. They describe what most babies do by this age, not a pass/fail test.",
            points: [
              "Talk face-to-face and let baby watch you move.",
              "Use short floor-play sessions throughout the day.",
              "For a baby born more than 3 weeks early, use corrected age for developmental timing and discuss concerns with the pediatrician."
            ],
            sources: ["cdcMilestones2", "aapCorrectedAge"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Make room for movement",
            summary: "Longer awake floor-play sessions can offer more chances to look, reach, and practice head control. Follow baby’s cues rather than testing a skill.",
            points: [
              "Put your face or a toy within reach, and offer visual interest on either side.",
              "Continue varying awake positions and limiting time in sitting devices.",
              "Keep play on the floor; never leave baby unattended on a bed, sofa, or other elevated surface."
            ],
            sources: ["aapTummyTime", "cdcMilestones2"]
          }
        ]
      },
      "wet-diapers": {
        heading: "Wet-diaper expectations for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "The first few diapers",
            summary: "Wetness should rise quickly as intake increases. Early counts vary with feeding method and an individual care plan.",
            points: [
              "For a breastfed newborn, CDC lists at least 1 wet diaper on day 1 and 2 on day 2.",
              "Count across 24 hours; an early disposable diaper may feel only slightly wet.",
              "Also watch feeding effort, alertness, urine color, and the weight plan."
            ],
            sources: ["cdcBreastfeedingBasics"]
          },
          {
            key: "day-3",
            at: { days: 3 },
            label: "Day 3",
            title: "Wetness should be rising",
            summary: "CDC’s breastfeeding guide lists at least 5 wet diapers on day 3 as intake builds. The trend and the whole feeding picture matter more than one isolated count.",
            points: [
              "Notice whether diapers are becoming easier to recognize as wet.",
              "Call when output is not rising or baby is feeding poorly or unusually sleepy."
            ],
            sources: ["cdcBreastfeedingBasics", "aapDehydration"]
          },
          {
            key: "day-4",
            at: { days: 4 },
            label: "Day 4",
            title: "A steadier pattern",
            summary: "By about day 4 or 5, look for at least 6 clear, dilute wet diapers in 24 hours. A low count matters more with poor feeding, dark urine, or unusual sleepiness.",
            points: [
              "Call promptly if the count is not rising toward this pattern.",
              "A persistent pink or brick-red stain deserves a call, especially with low output."
            ],
            sources: ["aapFirstWeekVisit", "cdcBreastfeedingBasics"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Follow the full-day trend",
            summary: "After the first week, diapers need not arrive at even intervals. The usual 24-hour count and any sudden drop are more useful than expecting one after every feed.",
            points: [
              "Use the whole pattern: feeding, wetness, urine color, alertness, and growth.",
              "Call about a clear fall from usual output or signs of dehydration."
            ],
            sources: ["aapNewbornPoop", "aapDehydration"]
          }
        ]
      },
      "newborn-poop": {
        heading: "Poop changes for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Meconium first",
            summary: "The first poop is usually sticky black or dark-green meconium. Most newborns pass it during the first day or two.",
            points: [
              "Expect thick, tar-like diapers at first.",
              "Contact the care team promptly if no meconium has passed by 48 hours."
            ],
            sources: ["aapCommonNewbornConditions", "aapNewbornPoop"]
          },
          {
            key: "day-2",
            at: { days: 2 },
            label: "Day 2",
            title: "Transition stools",
            summary: "Over the next few days, poop should loosen and move through green or yellow-green as milk replaces meconium. A shift away from black is reassuring.",
            points: [
              "Track whether stools are becoming lighter and softer.",
              "Call if poop is still meconium-dark by day 5, especially with low intake or output."
            ],
            sources: ["aapFirstWeekVisit", "aapNewbornPoop"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Milk stools settle in",
            summary: "Breast-milk stools are commonly loose, yellow, and seedy; formula stools are often tan or yellow and soft-clay-like. Green can be normal with either feeding method.",
            points: [
              "Focus on soft texture, steady feeding, wet diapers, and a comfortable belly.",
              "Red, white or chalky, or black tarry poop after meconium needs prompt advice."
            ],
            sources: ["aapNewbornPoop"]
          },
          {
            key: "week-3",
            at: { weeks: 3 },
            label: "3 weeks",
            title: "Frequency may vary more",
            summary: "In the following weeks, some breastfed babies begin pooping less often. Soft stool and reassuring feeding and growth matter more than a perfect schedule.",
            points: [
              "Do not judge constipation by frequency alone; hard, dry, or pellet-like stool is more concerning.",
              "Call about a sudden large increase in watery stools or illness signs."
            ],
            sources: ["cdcBreastfeedingBasics", "aapNewbornPoop"]
          }
        ]
      },
      "umbilical-cord-care": {
        heading: "Cord care for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Keep the stump clean and dry",
            summary: "A fresh stump may look shiny and yellowish, then become brown, gray, or nearly black as it dries. Simple dry care is usually all it needs.",
            points: [
              "Fold the diaper below it; clean contamination gently, then pat dry.",
              "Do not pull, cover, or add alcohol, peroxide, ointment, powder, or oil unless instructed."
            ],
            sources: ["aapCord", "whoPostnatal"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Let separation happen naturally",
            summary: "The stump commonly loosens and falls within 1–3 weeks. A few drops of blood can follow, but the center should become drier over the next several days.",
            points: [
              "Let it detach on its own, even if it hangs by a thread.",
              "Keep the diaper edge below the healing navel."
            ],
            sources: ["aapCord"]
          },
          {
            key: "week-3",
            at: { weeks: 3 },
            label: "3 weeks",
            title: "Recheck a lingering or moist navel",
            summary: "The AAP advises a visit if the stump is still attached at about 3 weeks. A persistent moist pink bump or drainage after separation can also need a clinician’s check.",
            points: [
              "Call about a stump still attached or a navel that is not becoming dry.",
              "Get prompt help for spreading redness, foul drainage, tenderness, fever, or an unwell baby."
            ],
            sources: ["aapCord"]
          }
        ]
      },
      "bathing-a-newborn": {
        heading: "Bathing setup for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Sponge baths while the cord heals",
            summary: "Use sponge baths until the stump is off and the navel is dry and healed. Newborns do not need a daily bath.",
            points: [
              "Set out supplies first and keep one hand on baby.",
              "Use warm water, gentle cleaning, and immediate drying and dressing."
            ],
            sources: ["aapBathing"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Look for tub readiness",
            summary: "Many cords separate during weeks 1–3, but age alone does not decide when to start a tub. Continue sponge baths if the stump remains or the navel is moist or raw.",
            points: [
              "Use a dry, healed belly button—not a date—as the transition signal.",
              "Call if the cord or navel is not following a reassuring drying pattern."
            ],
            sources: ["aapBathing", "aapCord"]
          },
          {
            key: "week-3",
            at: { weeks: 3 },
            label: "3 weeks",
            title: "Keep tub baths brief and hands-on",
            summary: "Once the navel is healed, use a stable infant tub, shallow warm water, and continuous hands-on supervision. Increasing wiggles never change the supervision rule.",
            points: [
              "Support the head and neck, lower baby feet first, and keep the face above water.",
              "Never step away or rely on a bath seat, even briefly."
            ],
            sources: ["aapBathing", "aapWaterSafety"]
          }
        ]
      },
      "newborn-skin": {
        heading: "Skin changes for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Newborn skin can look unfamiliar",
            summary: "Vernix, peeling, blotchy color, milia, fine hair, and birth-related marks can all be visible in the first days.",
            points: [
              "Do not scrub, peel, squeeze, or use acne products.",
              "Check yellow color in bright white light and follow the bilirubin plan."
            ],
            sources: ["aapNewbornAppearance", "aapCommonNewbornConditions"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Common early changes begin settling",
            summary: "Peeling may become more noticeable, while transient newborn rashes can come and go. Reassuring areas stay intact without spreading redness, drainage, swelling, or tenderness.",
            points: [
              "Use brief, infrequent baths and fragrance-free moisturizer if needed.",
              "Call about a rash that keeps spreading or skin becoming raw, wet, or painful."
            ],
            sources: ["aapCommonNewbornConditions", "aapBathing"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Watch the trend over coming weeks",
            summary: "Milia and fine body hair often fade gradually; some marks lighten more slowly, and a raised red birthmark may first become noticeable. These are broad patterns, not deadlines.",
            points: [
              "Photograph a new or changing mark in consistent light.",
              "Ask the pediatrician to identify a newly raised or changing birthmark."
            ],
            sources: ["aapNewbornAppearance"]
          }
        ]
      },
      "diaper-rash": {
        heading: "Diaper-rash care for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Extra caution in the first six weeks",
            summary: "Most diaper rash is irritation from moisture, stool, or rubbing, but a new rash in a very young baby deserves a lower threshold for calling.",
            points: [
              "Change promptly, clean gently, air-dry, and use a plain barrier paste.",
              "Contact the pediatrician about any diaper-area rash in the first 6 weeks.",
              "Avoid cycling through medicines or antifungal creams without guidance."
            ],
            sources: ["aapDiaperRash", "medlineDiaperRash"]
          },
          {
            key: "week-6",
            at: { weeks: 6 },
            label: "6 weeks",
            title: "Judge ordinary irritation by its trend",
            summary: "A typical contact-area rash should begin looking less red, raw, or uncomfortable within 2–3 days of gentle care. Fold involvement, nearby bumps, crusts, or oozing need assessment.",
            points: [
              "Call if there is no clear improvement within 2–3 days or the rash worsens.",
              "The under-3-month fever rule remains unchanged."
            ],
            sources: ["aapDiaperRash", "medlineDiaperRash"]
          }
        ]
      },
      "clothing-and-room-temperature": {
        heading: "Clothing checks for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Dress lightly and check the chest",
            summary: "After the first hours following birth, an indoor hat is not routine. Start with no more than one light layer beyond what an adult finds comfortable.",
            points: [
              "Use a warm, dry chest—not cool hands or feet—as the better comfort check.",
              "Keep the head uncovered for sleep and use fitted sleep clothing instead of loose bedding.",
              "Remove a layer if the chest is hot or baby is sweating."
            ],
            sources: ["aapSafeSleep", "aapFirstMonthGrowth"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Recheck fit as baby grows",
            summary: "The warmth guidance is unchanged; this is a fit reminder. Clothes and wearable blankets should stay clear of the face and within their stated size and weight ranges.",
            points: [
              "Move up a size before necklines ride up or fabric bunches around the face.",
              "Recheck the chest whenever the room, weather, car, or activity changes."
            ],
            sources: ["aapSafeSleep"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Watch for the swaddling transition",
            summary: "This date is only a reminder to look for growth and movement changes. Stop swaddling at the first sign of trying to roll, whenever it happens.",
            points: [
              "Use non-weighted sleepwear that leaves the arms and body free once swaddling stops.",
              "Keep the back-first, bare-sleep-space rules unchanged."
            ],
            sources: ["aapSwaddle", "aapSafeSleep"]
          }
        ]
      },
      "when-to-get-medical-help": {
        heading: "Warning signs for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "First week: changes can be subtle",
            summary: "Notice feeding effort, wakefulness, breathing, color, movement, temperature, and output. A newborn who cannot be woken, is struggling to breathe, or turns blue or gray needs emergency help.",
            points: [
              "Call promptly for a sudden weak suck, inability to finish feeds, or newly abnormal behavior.",
              "A rectal temperature of 100.4°F (38°C) or higher needs immediate medical attention."
            ],
            sources: ["aapNewbornIllness", "aapFever"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Keep a low threshold through the first month",
            summary: "You will know more of baby’s usual pattern, so a sudden departure becomes useful information. Promptly contact the pediatrician when a baby under 1 month looks or acts abnormal.",
            points: [
              "Compare with baby’s own usual feeding, alertness, breathing, and output.",
              "Do not wait for several symptoms when a newborn seems newly unwell."
            ],
            sources: ["aapNewbornIllness"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Keep watching the whole pattern",
            summary: "Emergency signs and the young-infant fever threshold remain important. Feeding, wet diapers, alertness, breathing effort, and color work best as a cluster.",
            points: [
              "Call immediately for a rectal temperature of 100.4°F (38°C) or higher.",
              "Get help sooner for a sudden change or caregiver concern, even without fever."
            ],
            sources: ["aapFever", "aapMedicalHelp"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Keep the fever rule while updating the plan",
            summary: "At and around the third-month boundary, keep treating a rectal temperature of 100.4°F (38°C) or higher as an immediate call until the pediatrician gives a new age-specific plan.",
            points: [
              "Emergency breathing, color, responsiveness, and seizure signs do not change.",
              "Save the pediatrician’s updated after-hours instructions."
            ],
            sources: ["aapFever", "aapMedicalHelp"]
          }
        ]
      },
      "fever-and-temperature": {
        heading: "Fever guidance for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth through 3 months",
            title: "One fever rule through three months",
            summary: "For a baby 3 months old or younger, one rectal temperature of 100.4°F (38°C) or higher needs immediate medical attention, even if baby seems well.",
            points: [
              "Write down the exact number, time, and measurement location.",
              "Call immediately; do not wait for another reading or give medicine first.",
              "A rectal reading is the most reliable at this age."
            ],
            sources: ["aapFever", "aapTemperature"]
          },
          {
            key: "after-month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Keep calling while you confirm the next rule",
            summary: "At and around this boundary, continue to call immediately for a rectal temperature of 100.4°F (38°C) or higher. Ask the pediatrician when a different age-based plan begins.",
            points: [
              "Continue using a digital thermometer and recording the exact result.",
              "Do not use an ear thermometer before about 6 months."
            ],
            sources: ["aapFever", "aapTemperature"]
          }
        ]
      },
      "jaundice": {
        heading: "Jaundice priorities for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Measure—do not judge by color alone",
            summary: "Every newborn needs a bilirubin measurement before discharge. Yellow color during the first 24 hours needs prompt measurement and assessment.",
            points: [
              "Know the bilirubin result and the next-check date.",
              "Keep follow-up even when yellow color looks mild.",
              "Do not use sunlight as treatment."
            ],
            sources: ["aapJaundice"]
          },
          {
            key: "day-3",
            at: { days: 3 },
            label: "Day 3",
            title: "The common peak window",
            summary: "Jaundice related to low milk intake often becomes most important around days 3–5. Feeding, weight, diapers, wakefulness, and the measured bilirubin trend matter more than a visual guess.",
            points: [
              "Keep scheduled feeding, weight, and bilirubin checks.",
              "Call for deepening or spreading yellow color, poor feeding, or difficulty waking."
            ],
            sources: ["aapJaundice", "cdcBreastfeedingBasics"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "Follow the measured trend",
            summary: "The bilirubin plan should now show whether jaundice is improving or needs more follow-up. Color alone cannot replace the measurement and feeding trend.",
            points: [
              "Keep every scheduled bilirubin, feeding, and weight check.",
              "Call for deepening yellow color, poor feeding, unusual sleepiness, pale stool, or dark urine."
            ],
            sources: ["aapJaundice", "aapFirstWeekVisit"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Recheck jaundice that remains",
            summary: "Jaundice clears in many babies during the first two weeks. The AAP advises calling if it persists beyond 2 weeks in a formula-fed baby.",
            points: [
              "Call now for pale or chalky stool, dark urine, poor feeding, or an unwell baby.",
              "Do not stop breastfeeding solely because yellow color remains; follow the clinician’s plan."
            ],
            sources: ["aapJaundice"]
          },
          {
            key: "week-4",
            at: { weeks: 4 },
            label: "4 weeks",
            title: "Persistent breastfed jaundice needs review",
            summary: "A primarily breastfed baby who remains jaundiced beyond 4 weeks should be assessed. Persistence is a reason to check, not proof that something is wrong.",
            points: [
              "Arrange the recommended clinician review.",
              "Continue watching stool color, urine, feeding, growth, and alertness."
            ],
            sources: ["aapJaundice"]
          }
        ]
      },
      "breathing-and-congestion": {
        heading: "Breathing checks for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Noisy can still be comfortable",
            summary: "Newborn breathing can speed up, slow down, pause for under 10 seconds while baby stays comfortable and normally colored, and sound snuffly. Effort, color, feeding, and alertness matter more than volume.",
            points: [
              "Watch while baby is calm; brief pauses can be periodic breathing.",
              "Retractions, repeated grunting, head bobbing, or blue or gray color are not ordinary congestion.",
              "Use plain saline and gentle suction only when blockage interferes with feeding."
            ],
            sources: ["aapNewbornBehavior", "aapBreathingTrouble"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Baby’s usual pattern is clearer",
            summary: "You may recognize normal newborn sounds more easily now, but a new cough or congestion can still become serious quickly in a young infant.",
            points: [
              "Keep judging breathing effort, color, feeding, wet diapers, and alertness.",
              "Call promptly for new illness signs rather than waiting for a cold timeline."
            ],
            sources: ["aapNewbornBehavior", "aapBreathingTrouble"]
          }
        ]
      },
      "car-seat-safety": {
        heading: "Car-seat checks for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Set up the first ride",
            summary: "Use a correctly fitted rear-facing seat in the back seat for every trip. Correct recline, a tight installation, and a snug harness matter more than brand or price.",
            points: [
              "Test movement at the belt path: no more than 1 inch side-to-side or front-to-back.",
              "Keep straps at or below the shoulders and the chest clip at armpit level.",
              "Put nothing bulky under the harness."
            ],
            sources: ["nhtsaRearFacing", "aapCarSeat"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Do a growth-fit check",
            summary: "This is a reminder, not an age-triggered seat change. As shoulders rise and clothing sizes change, recheck every adjustable part against the manual.",
            points: [
              "Recheck harness slots, headrest, crotch buckle, infant inserts, and recline indicator.",
              "Repeat the snug-harness and carrier or base-lock checks before every ride."
            ],
            sources: ["nhtsaRearFacing", "aapCarSeat"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Growth—not a birthday—controls changes",
            summary: "Keep the seat rear-facing and follow its height and weight limits. Change recline, padding, harness position, or seat type only when the manuals and fit limits say to.",
            points: [
              "Use another appropriate rear-facing seat only when the current one is outgrown or no longer suits the trip.",
              "Move a sleeping baby to a firm, flat sleep space when travel ends."
            ],
            sources: ["aapCarSeat", "aapSafeSleep"]
          }
        ]
      },
      "rest-of-the-first-week": {
        heading: "First-week guidance for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Birth through the first 48 hours",
            summary: "Expect short cycles of feeding, sleep, and diaper changes with no dependable schedule. Follow the discharge feeding and waking plan.",
            points: [
              "Keep the newborn follow-up date and bilirubin result easy to find.",
              "Use back, firm, flat, bare sleep for every sleep."
            ],
            sources: ["aapFirstWeekVisit", "nihSafeSleep"]
          },
          {
            key: "day-2",
            at: { days: 2 },
            label: "Day 2",
            title: "Intake is building",
            summary: "Feeds may cluster and baby may still need gentle waking. Wet diapers should begin increasing and stool should start becoming less black and sticky.",
            points: [
              "Notice active drinking and swallowing, not only time at breast or bottle.",
              "Call if baby is much harder to wake or feeding becomes weaker."
            ],
            sources: ["cdcBreastfeedingBasics"]
          },
          {
            key: "day-3",
            at: { days: 3 },
            label: "Day 3",
            title: "Watch feeding and jaundice together",
            summary: "Milk intake and swallowing often become easier to notice, stool lightens, and jaundice may become more visible. The newborn visit checks the whole picture.",
            points: [
              "Keep scheduled feeding, weight, and bilirubin follow-up.",
              "Call for deepening yellow color with poor feeding or unusual sleepiness."
            ],
            sources: ["aapFirstWeekVisit", "aapJaundice"]
          },
          {
            key: "day-5",
            at: { days: 5 },
            label: "Day 5",
            title: "Look for a rising trend",
            summary: "By day 5, CDC breastfeeding guidance lists at least 6 wet diapers and 3 stools in 24 hours; another feeding plan may differ. Weight should stop falling.",
            points: [
              "Use output, feeding, wakefulness, and weight as a cluster.",
              "Call about continued weight loss, falling output, or a wet, red, or foul-smelling cord."
            ],
            sources: ["cdcBreastfeedingBasics", "aapCord"]
          },
          {
            key: "week-1",
            at: { weeks: 1 },
            label: "1 week",
            title: "The first week is complete",
            summary: "Feeding and sleep can remain irregular, but output and intake should now have an established trend. The weeks 2–4 guide becomes the useful next view.",
            points: [
              "Bring unresolved feeding, weight, jaundice, or cord questions to the pediatrician.",
              "Expect continued newborn rhythms, not a schedule."
            ],
            sources: ["aapFirstWeekVisit", "aapSleep"]
          }
        ]
      },
      "weeks-two-to-four": {
        heading: "Weeks 2–4 for the date you choose",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Before week 2",
            title: "Coming up after the first week",
            summary: "Until this guide becomes current, use the first-week feeding, diaper, weight, jaundice, and follow-up plan. Longer alert moments are previews, not newborn requirements.",
            points: [
              "Keep first-week appointments and output checks.",
              "Do not expect a predictable routine."
            ],
            sources: ["aapFirstWeekVisit"]
          },
          {
            key: "week-2",
            at: { weeks: 2 },
            label: "2 weeks",
            title: "Check the growth trend",
            summary: "Weight should generally be moving back toward birth weight by about 2 weeks, with almost all babies there by 3 weeks. The cord may also separate in this window.",
            points: [
              "Use repeat clinical weights rather than judging one feed or diaper.",
              "Let the cord separate naturally and call about infection signs."
            ],
            sources: ["aapFirstMonthGrowth", "aapCord"]
          },
          {
            key: "week-3",
            at: { weeks: 3 },
            label: "3 weeks",
            title: "More looking, often more crying",
            summary: "Quiet-alert moments may lengthen, while crying can increase from around 2 weeks without meaning a caregiver is doing something wrong.",
            points: [
              "Offer close faces, voices, cuddling, and brief awake play without testing baby.",
              "Use a safe handoff or safe-sleep-space break when crying overwhelms a caregiver."
            ],
            sources: ["aapFirstMonthDevelopment", "aapCryingSupport"]
          },
          {
            key: "week-4",
            at: { weeks: 4 },
            label: "4 weeks",
            title: "First-month progress",
            summary: "Many babies are more alert and responsive, react to sound, and focus best at close range. These are guides, not deadlines.",
            points: [
              "Look for a cluster of growing responses rather than one performance.",
              "Bring feeding, growth, movement, hearing, or alertness concerns to the next visit.",
              "If baby was born more than 3 weeks early, use corrected age with the care team."
            ],
            sources: ["aapFirstMonthDevelopment", "aapFirstMonthGrowth", "aapCorrectedAge"]
          }
        ]
      },
      "two-month-milestones": {
        heading: "Development for the date you choose",
        description: "Choose a date to shift the developmental focus. If baby was born more than 3 weeks early, use corrected age with the care team.",
        stages: [
          {
            key: "birth",
            at: { days: 0 },
            label: "Birth · day 0",
            title: "Early signs may be brief",
            summary: "Quiet-alert moments are short, movements can be reflexive, and the head still needs support. A glance, voice response, or brief head lift is practice—not a test.",
            points: [
              "Talk or sing during calm awake moments, then pause for any response.",
              "Offer short, supervised tummy-time tries."
            ],
            sources: ["aapFirstMonthDevelopment", "nihTummyTime"]
          },
          {
            key: "month-1",
            at: { months: 1 },
            label: "1 month",
            title: "Social responses may become clearer",
            summary: "During the second month, baby may watch and listen longer, begin smiling in response, calm to a familiar voice or touch, and make sounds besides crying.",
            points: [
              "Notice repeated responses during ordinary interactions.",
              "Let baby look away or rest instead of repeatedly trying to produce a skill."
            ],
            sources: ["aapFirstMonthDevelopment", "cdcMilestones2"]
          },
          {
            key: "month-2",
            at: { months: 2 },
            label: "2 months",
            title: "Review the 2-month checklist",
            summary: "CDC milestones describe what at least 75% of children do by this age. They are conversation prompts, not a daily score or a screening test.",
            points: [
              "Notice face-looking, non-crying sounds, reactions to sound, movement of both sides, and head lifting on the tummy.",
              "Use the checklist to prepare examples and questions for the 2-month visit.",
              "Share a missing or lost skill, or any concern about seeing, hearing, response, or movement."
            ],
            sources: ["cdcMilestones2", "aapCorrectedAge"]
          },
          {
            key: "month-3",
            at: { months: 3 },
            label: "3 months",
            title: "Look ahead without a 3-month checklist",
            summary: "There is no CDC 3-month checklist. Use 2-month skills as a reference and preview the 4-month list as what comes next—not as expectations for today.",
            points: [
              "Notice growing social, sound, visual, and movement responses across ordinary days.",
              "Keep offering face-to-face interaction and supervised tummy time.",
              "Contact the pediatrician promptly for lost skills or a persistent concern."
            ],
            sources: ["cdcMilestones2", "cdcMilestones4", "aapCorrectedAge"]
          }
        ]
      }
    }
  };
});
