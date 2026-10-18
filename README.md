# Campaign Calendar Skill

This is a skill I maintain for my own campaign-planning work and keep updating as I use it. Ideas or questions? Contact me through [my website](https://huiyangxie.ca/).

> Version 1.0 — accepted 2026-10-17.
> Maintenance revision 1.0.1 — date, scheduling, cost, capacity and form fixes (2026-10-18).
> Maintenance revision 1.1.0 — shared model, offline generator/validator, content matrix and optional handoffs (2026-10-18).
> Maintenance revision 1.1.1 — year, date-range, fixed-anchor modes and review dates (2026-10-18).

Build a campaign timeline + calendar for any time span the user defines — one temporary
campaign, a quarter, a season, a full year. Promo dates are the anchors; planning,
production, and promo deadlines are counted backwards from each anchor.

## Inputs — two stages

**Stage 1 (to recommend activities):**
- Country (6 shipped layers: Canada, China, US, UK, Japan, Korea; other → research-built per the research protocol)
- Time span (start–end dates, user-defined)
- What you sell (product / service category)
- Who you sell to (target customer + cultural background)
- When they buy / use it (usage season / purchase cycle, peak, pre-season?)
- Brand / self-set dates (may be none)
- City / metro (optional — local expo / community-stall suggestions + host-city mega-events if given; brand mode if not)
- Past campaigns (optional — what ran, what worked, actual lead times)
- Known competitor campaigns / dates (optional)

**Stage 2 (after selection, per selected activity):**
- Channels & capacity (website, store count, social account count, matrix accounts)
- Lead times: planning, production time, warm-up and one delivery buffer (missing values => ranges + flagged assumptions)
- Budget currency, cost scope and any explicit cap (materials subtotal is separate from complete activity/span costs)
- Team size + approval chain; available hours/throughput when needed, otherwise capacity unconfirmed
- Per activity: promo date range · funnel F1–F6 → format recommendation · foot traffic estimate (if offline) · reuse

## Outputs

**Stage 1 — activity recommendation report** (simple + interactive): candidate activities for the span + what the user decides next (select + fill Stage 2 details). No math, materials, budget, or timeline yet.

**Stage 2 — final outputs (in this order):**

1. **Timeline** — chronological list: every campaign with planning deadline, production
   start, warm-up start, promo dates. The backbone. Each campaign carries three annexes:
   **materials checklist** (what + how many + by when), **data-collection checklist**
   (what to collect + keep during the campaign, for the review), **contingency Plan B**
   (pre-decided responses to common disruptions).
2. **Calendar view** — the same data as a calendar + reminder list of upcoming deadlines.
3. **Detailed report** — plan doc for the boss for the chosen span: goal, campaign overview,
   milestones, capacity basis/status + **cost scope** (materials subtotal plus other
   required costs; matching-scope cap checks only when complete, no invented prices) + mandatory assumptions & unknowns log.

## How to Use / Execution Flow

**Stage 1 — recommend:**
1. **You** provide light intake: country, time span, what you sell, who you sell to, when they buy / use it, brand dates (see `templates/intake.md` Stage 1).
2. **AI** builds candidate activities from the country layer + audience cultural layer + season-anchored candidates + your dates + expo / local community stall opportunities + mass sporting mega-events + user-added candidates, with relevance reasoning (past campaigns calibrate), and outputs a simple recommendation report.
3. **You decide (Gate 1 — selection)**: pick the activities you want + fill Stage 2 details per activity (promo range, online / offline, budget range, foot traffic, format — your idea or a preset).

**Stage 2 — plan:**
4. **AI** recommends formats via the funnel, applies lead times and channel sets, counts backwards, runs the late-planning check + capacity-aware conflict / overload checks, proposes trade-offs.
5. **You decide (Gate 2)**: confirm the timeline (adjust dates / priorities).
6. **AI** outputs in order: timeline → calendar → detailed report.
7. **You** import the reminder list into your own calendar tool. Nothing is published, scheduled, or spent by this skill.

Human decisions in this flow: which activities to run, per-activity details (range, online / offline, budget, format), which campaigns are must-do vs cuttable, final timeline approval. AI does the recommending, date math, conflict checks, and drafting.

After the campaign: a post-campaign follow-up list (recommended data-organization +
reporting items, list only). The review itself is a separate future skill.

## Honesty rules

No invented dates. Estimates are always ranges + flagged assumptions. Unknown is a valid
answer. No performance promises. Unconfirmed output = draft, not an approved plan.

## License

TBD — non-commercial direction. NOT MIT (MIT allows commercial use, which conflicts
with the author's non-commercial intent).

## Languages

Every `.md` file in this repo has a `.zh-CN.md` twin (same content, Simplified
Chinese). **Output language:** the skill asks at invocation whether outputs
should be in English or Chinese, and reads the matching file version.

## Runtime

The agent plans and researches; Stage 2 uses the native Node.js 18+ offline validator/generator. No dependency installation or external API is required. Deliver Markdown and self-contained HTML; PDF export is optional when supported. Unresearched public dates remain unverified. See [structured plans](references/structured-plans.md).

## Example

See `examples/fictional-example.md` — a fictional single temporary campaign showing
the full output shape. See `examples/sample-stage1-report.md` — a fictional full-year
Stage 1 recommendation report (brand mode, cultural layer, expo prompts,
last-year evidence, gap check). See `examples/sample-stage1-report.html` — the
same Stage 1 report as an interactive HTML sample (tick → reveal that
activity's Stage 2 fields; submit shows the collected JSON). See
`examples/sample-stage1-report-en.html` — the English twin of that HTML sample.
See `examples/sample-stage1-local-shop-2026.md` — a Stage 1 validation sample
for a Vancouver local shop, summer 2026 (World Cup host-city tie-in + Main
Street Car Free Day stall + user-added anniversary).


## Structured Stage 2

Start with [structured plans](references/structured-plans.md). Native Node utilities generate Timeline, actual-node Calendar, every selected activity detail, resource scenarios and complete ledgers from one JSON, then verify hashes/end markers. Keep private cases outside the repository; shipped input is fictional. The 1.0.1 date/budget/capacity/form fixes remain in place.


## Planning scope (v1.1.1)

Plan a full year, an explicit start/end period, or backwards from one fixed date/key activity. The repository name stays the same. planning_mode selects year, date_range or anchor_date, with the other two inputs null; timezone is required and span must match. Short plans do not receive a forced year of holidays or twelve panels. Fixed dates are never silently moved. Preparation can cross a year boundary; a supplied review date can extend beyond the activity, while an unknown review remains TBC. Costs, role-week workload and cohorts use the stated scope and actual tasks, with no automatic annual proration. See [structured plans](references/structured-plans.md).