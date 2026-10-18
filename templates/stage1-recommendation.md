# Stage 1 — Activity Recommendation Report

Simple + interactive. This is a RECOMMENDATION, not the plan. No backwards math,
no materials, no budget, no timeline yet — those need confirmed activities.

## Header

Country · time span · what you sell · who you sell to (+ cultural background) ·
when they buy / use it (usage season / purchase cycle, pre-season?) · city /
metro (given → local mode; not given → brand mode) · past campaigns (if given) ·
known competitor campaigns / dates (if given).

## Candidate activities

| # | Date | Activity | Why it fits (product / audience / season) | Possible type | Confidence |
|---|---|---|---|---|---|
| 1 | … | … | … | online / offline / both | base-verified / government-sourced / official-announcement / unverified |

Rules:
- Candidates come from six sources: country layer + audience cultural layer +
  season-anchored candidates (pre-season / in-season / end-of-season clearance,
  computed from the user-stated season) + user dates + expo / booth
  opportunities (see `references/expo-booth.md`) + mass sporting mega-events
  (see `references/mega-sporting-events.md`).
- Confirmed expo / booth candidates go in the main table, with the application
  deadline in the Activity cell, e.g. "Exhibit at Vancouver Baby Expo
  (apply by ~Mar 1)".
- Every candidate needs a "why it fits" tied to the user's specific answers
  (product / audience / season). No generic industry labels — "retail" is too
  broad to decide relevance. A candidate with no specific reason does not enter
  the list.
- Pre-season default: season start − 4–6 weeks (user-adjustable).
- TBC dates (announced) are flagged TBC — never presented as confirmed.
- Unverified dates must be user-confirmed before they can become an anchor.
- Layer sweep: every date in the country layer + audience cultural layer was
  considered; excluded ones are in "Considered but not recommended" with a
  reason. No layer date is skipped silently.
- Campaign blocks: dates within ~7 days forming a recognized season (e.g.
  Christmas + Boxing Day + New Year = Holiday Season) are one combined
  candidate, not separate candidates.
- Do not pad the list. If only 2 activities fit the span, list 2.
- Stage 1 maximizes breadth within logic — include every candidate with a
  specific reason; the user decides at Gate 1. When in doubt, include. Never
  pre-filter on the user's behalf.
- Do not rank by "expected performance" — the skill does not predict performance.

## Brand-exposure prompts (brand mode — no city given)

| City | Event | Why it is good exposure |
|---|---|---|
| … | … | … (audience match + reach) |

Out-of-city expos carry a flag: "factor in travel / logistics."

## Worth further research (last-year evidence only — NEVER mixed into candidates)

| Event | Last-year date | What was found | What the user should verify |
|---|---|---|---|
| … | … | … (source) | This year's date, application deadline, booth fee |

Last year's existence proves the event recurs annually and is worth checking.
Last year's DATE never proves this year's date.

## Considered but not recommended

| Date | Why not recommended |
|---|---|
| … | … (e.g. Remembrance Day — solemn day, not a promo anchor) |

The user can override any exclusion.

## Gap check

If a quarter / season in the span has zero candidates, flag it and ask whether
the gap is intentional.

## What the user decides next (interactive)

The Stage 1 report is the staged output AFTER the discussion — it is not
chatted with. Discussion happens before it (in chat); if new questions arise,
discussion reopens in chat and the report is updated.

Two steps, kept separate — never in the same block.

**Step 1 — select:** select the activities you want, or add your own
(date + activity name — in chat, or via the form's "add your own" block).
If the user selects nothing: confirm the span is intentionally empty
(no campaigns) or ask whether to stop. Do not proceed to Stage 2 with
zero activities. (The HTML form enforces at least one selection.)

**Step 2 — details:** AFTER selection, for each selected activity, collect
that activity's Stage 2 questions (promo date range · funnel F1–F6 · foot
traffic estimate if offline · reuse) — via HTML form artifact (tick → reveal
that activity's fields; submit returns to the agent) when the environment
supports it, otherwise in chat one activity at a time. If the user has no
format idea, suggest 2–3 via the Stage 2 funnel (`templates/intake.md`
F1–F6 + `references/format-recommendation.md`). The user picks, mixes, or
overrides with their own idea.

**Form submission payload (the contract the agent expects back):**

```json
{
  "selectedActivities": [
    { "id": "...", "name": "...", "userAdded": false,
      "promoRange": "...", "f1": "...", "f2": "...", "f3": "...",
      "f4": "...", "f5": "...", "footTraffic": "...", "f6": "...",
      "reuse": "...", "other": "..." }
  ],
  "brandExposurePrompts": [ "same fields as selectedActivities" ],
  "pursueFurtherResearch": [ { "event": "...", "note": "..." } ],
  "overturn": [ { "date": "...", "note": "..." } ]
}
```

`userAdded: true` marks a candidate the user added (date + name); all other
fields are the same. The HTML sample (`examples/sample-stage1-report.html`)
is the reference implementation of this payload.

**Timing:** the skill first asks — can you decide now in chat, or do you need
more time?
- **Decide now:** selection + details in conversation.
- **Need more time:** review the report at your own pace and submit the form
  (or reply in chat) when ready.

## Boundary

- Stage 1 never outputs a timeline, calendar, materials, or budget.
- If the user skips Stage 1 and demands the final report, ask for the
  Stage 1 selection first — the final report cannot be built on unconfirmed
  activities.
