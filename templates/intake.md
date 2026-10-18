# Intake Form — Two Stages

Never ask Stage 2 questions before the Stage 1 selection. Missing → provisional
+ explicit assumption.

**Output language (asked at invocation):** English or Chinese. If the user already
stated it, use it — never re-ask. Read the `.zh-CN.md` file versions when output
is Chinese.

## Stage 1 — light intake (to recommend activities)

| # | Question | Answer |
|---|---|---|
| 1 | Country (6 shipped layers: Canada, China, US, UK, Japan, Korea; other → research-built per the research protocol) | |
| 2 | Time span — start date and end date (one temporary campaign, a quarter, a season, a full year — user defines it) | |
| 3 | What do you sell? (product / service category — e.g. baby products, camping gear, tea) | |
| 4 | Who do you sell to? (target customer + cultural background — e.g. local gift buyers; Chinese-Canadian families) | |
| 5 | When do they buy / use it? (usage season / purchase cycle, peak, is there a pre-season? — e.g. camping peaks in summer, pre-season in spring) | |
| 6 | Brand / self-set dates: brand anniversary, self-set promo days (may be none) | |
| 7 | City / metro (optional — local expo suggestions if given; brand mode if not) | |

**City gate (ask once, before generating the Stage 1 report):** if the user
did NOT give a city in the invocation, ask ONE question before generating the
report: "Do you want to pin a specific city?" Pinning a city unlocks local
opportunities that cannot be researched without one — local community stalls,
local expos, host-city mega-events. Without a city, the skill proceeds in
brand mode (brand-exposure prompts only, no concrete local stall
opportunities). If a city was already given, do NOT ask. Local opportunities
are only proposed after sources are confirmed (research protocol); never
propose a local event from memory or assumption.
| 8 | Past campaigns (optional — last year / last quarter: what ran, what worked, actual lead times; calibrates lead times + filters candidates) | |
| 9 | Known competitor campaigns / dates (optional — avoid head-on collision or deliberately counter-program) | |

## Stage 2 — after the user selects activities

### Global (once)

| # | Question | Answer |
|---|---|---|
| G1 | Channels & capacity: website (yes / no), number of physical stores, number of social accounts (by platform), matrix accounts (yes / no, which platforms) | |
| G2 | Lead times: planning / production / warm-up — user may skip → wide-range estimate + flagged assumption | |
| G3 | Total span budget (optional — the budget roll-up checks per-activity AND total) | |
| G4 | Team size + approval chain (ask at least team size — feeds the capacity-aware overload check; approval chain > 1 → buffer / risk flag) | |

### Per selected activity

Promo date range first, then the FUNNEL (F1–F6). The funnel narrows from broad
(goal) to specific (budget) so the skill can recommend 2–3 formats with reasons.
Every question offers fixed options + "other (type your own)". Any question may
be skipped → the skill proceeds without that filter and flags the missing input
as an assumption.

| # | Question | Fixed options (+ other / not sure) | Answer |
|---|---|---|---|
| 10 | Promo date range (default: anchor ± default duration; user may change) | — | |
| F1 | Goal — what is this campaign for? | Clear stock / end of season · Acquire new customers · Increase basket size · New product launch · Repeat purchase / retention · Gifting occasion · Awareness / traffic · Other (type your own) | |
| F2 | Price point — featured products' price band (relative to your own catalog) | Low (small-ticket, high frequency) · Mid · High (big-ticket, low frequency) · Not sure · Other (type your own, e.g. specific price band) | |
| F3 | Margin | Thin (can't deep-discount) · Healthy (discount OK) · Not sure · Other | |
| F4 | Purchase pattern | One-time purchase · Repeat purchase · Both · Not sure | |
| F5 | Channel | Online-only · Offline · Both · Other | |
| F6 | Budget band (in local currency; enter your own band if these don't fit) | Under $500 · $500–2,000 · $2,000–10,000 · Over $10,000 · Not sure · Other (type your own) | |
| 11 | Foot traffic estimate + take-rate (only if offline — feeds gift / sample quantities) | — | |
| 12 | Reuse — which assets from earlier campaigns can be reused? (product photos, roll-up, talking points, …) Reused assets subtract from production load | — | |

Format recommendation: the skill applies the funnel answers via
`references/format-recommendation.md` (goal → candidates → constraint filter →
2–3 formats with reasons). The user picks, mixes, or overrides with their own
idea — the user's own idea always wins.

## Optional (use if given, never chase)

| Item | Answer |
|---|---|
| Offer mechanics (discount, new product, clearance, …) | |
| Language (default EN; add ZH on request) | |
| Priorities: which campaigns are must-do, which are cuttable (if missing → default priority: goal fit + audience fit) | |
| Offline presence (in-store event / pop-up / 地推 / none) — decides roll-up, flyers, gifts, QR | |
| Distribution target (households / people) — decides flyer quantity | |
| Unit costs per material (if known) + total materials budget cap (if any) | |
| Daily data collector (who fills the daily log during the campaign) | |
| Review date + owner (when + who does the post-campaign review) | |
| Plan B decision-maker (who can authorize a Plan B during the campaign) | |

## Rules

- **Pre-fill (never re-ask):** before asking any question, check what the user
  already provided in the invocation / conversation and use it. Never re-ask a
  question the user already answered. If unsure whether an answer covers a
  question, confirm briefly ("You said X — using that for this") instead of
  re-asking.
- Stage 1 first: country + span + what you sell + who you sell to +
  when they buy / use it + brand dates only.
  Do not ask channels, lead times, budget, or format before selection.
- Brand / self-set dates are user-input slots. Never infer them.
- Stage 2 budget band becomes the cap the final report checks against (per
  activity); total span budget is checked against the sum.
- Stage 2 foot traffic estimate + take-rate feeds gift / sample quantities (unknown → TBC).
- Stage 2 format may add materials (e.g. tasting → samples; pop-up → roll-up).
- Reused assets subtract from production load — list what is reused.
