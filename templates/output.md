# Output Structure — Two Stages

## v1.1.0 structured contract (overrides old quantity defaults)

Use [structured plans](../references/structured-plans.md) and [content matrix](../references/content-matrix.md). Reuse known intake; headcount is not FTE. Independent cores and platform variants are separate, with quantity derived from required coverage and hours. Old quantities below are conditional options, not automatic defaults. Keep seven full-year milestones distinct and materials ready before warm-up. Preserve unknown budget/capacity; verify all selected IDs, details, nodes, provenance and end markers. Candidate partnerships stay outside the committed Calendar.

## Stage 1 — activity recommendation report (first)

Simple + interactive. See `templates/stage1-recommendation.md`.
Candidate activities for the span (date, activity, why it fits, possible type),
plus what the user decides next (select activities + fill Stage 2 details).
No backwards math, no materials, no budget, no timeline yet.

## Stage 2 — final outputs (in this order, after selection + details)

### 1. Timeline (first — the backbone)

Chronological table. One row per campaign.

| Campaign | Planning deadline | Production start | Warm-up start | Promo dates | Status |
|---|---|---|---|---|---|
| … | … | … | … | … | draft / confirmed |

Rules: sorted by date. Use the single delivery-buffer rule in lead-time-rules.md and show the date/timezone basis. Actual resource conflicts and evidenced overloads are
flagged in-line (CONFLICT / OVERLOAD) with the proposed trade-off next to them.
A selected campaign landing on a known competitor promo date is flagged COMPETITOR
in the Status column, with the user's stance (hold / differentiate / counter-program).
Expo campaigns carry an extra milestone: booth application deadline (keep the sourced date; do not move it to fit a preferred order). Any deadline already past vs today is flagged LATE with the
three options (compress lead times / move the campaign / drop it).

### Materials checklist (per-campaign annex to the timeline)

For each campaign: WHAT + HOW MANY + BY WHEN + use phase (warm-up / promo / both).
See `references/materials-checklist.md` for quantity rules. Copy matrix: flagged as
needed / not needed + piece count (content is 06's job). Offline items (roll-up,
flyers, gifts, QR) appear only if the campaign has offline presence.

### Data-collection checklist (per-campaign annex to the timeline)

What to collect + keep DURING the campaign, so the post-campaign review has data.
See `references/data-collection.md`: daily log (owner: daily data collector),
sales / traffic / in-store / ground / customer / cost / qualitative metrics,
retention rules (raw exports, one folder per campaign, daily, no deletion before
the review), privacy & consent (CASL, photo consent).

### Contingency Plan B (per-campaign annex to the timeline)

Pre-decided responses to common disruptions. See `references/contingency-plan-b.md`.
Pre-decide at Gate 2: rain date, price floor, code caps + kill switch, dynamic QR,
backup roster, holding statement, decision-maker. The skill does not monitor live;
the user / decision-maker executes the Plan B and logs it in the daily log.

### 2. Calendar view (second)

Same data as a calendar: one block per month (or per week for short spans) covering the business span plus earlier preparation, each block listing that period's planning deadlines, production starts,
warm-up starts, and promo dates.

### Calendar markers (visual reports / PDF)

- Planning deadline: hollow thick-bordered square in the campaign's colour
  (the day cell itself gets the thick border).
- Production start: solid circle in the campaign's colour (marker next to the
  day number).
- Promo days: solid fill in the campaign's colour. Warm-up days: light tint
  in the campaign's colour. A legend explains all markers.

### Reminder list (part of the calendar view)

Upcoming deadlines sorted by date: planning deadlines, production starts, warm-up starts.
Default window: 30 days (user-adjustable — the user may set any window).
The user imports this list into their own calendar tool. This skill does not auto-remind.

### 3. Detailed report (third — the plan doc for the boss)

For the chosen time span:

1. One-sentence business goal and primary success signal; baseline / measurement source TBC if unknown.
2. Campaign overview (from the timeline, in prose).
3. **Index table** — one row per campaign: Campaign | Anchor date |
   Warm-up start | Promo date range | Simple idea (one-line concept).
   Directly under the index table, a note distinguishing verified/user-set anchors from estimated preparation dates and unresolved public dates.
4. Milestones (the dates that matter most).
5. Per-campaign details (below the index: key dates, materials, offline
   items, budget line, data collection, Plan B — one block per campaign).
6. **Competitor collisions** — for each selected campaign that lands on a known
   competitor promo date: the competitor, the date, and the user's stance
   (hold / differentiate / counter-program). No known collisions → state
   "no known competitor collisions in this span."
7. Capacity basis/status: required and available hours or comparable throughput for the same period; concurrent work, adaptations and bottlenecks. Missing basis => unconfirmed.
8. **Cost scope** — show currency, materials subtotal (quantities × supplied unit costs), other necessary costs and completeness separately. Unknown costs stay TBC. Compare per-activity / span caps only with complete, same-currency, same-scope totals; partial material costs cannot prove the whole campaign WITHIN. No cap means no cap check.
9. **Assumptions & unknowns log (mandatory)** — every TBC date, every estimated lead
   time, every default. No log = incomplete output.

Post-campaign follow-up (after the campaign, not part of these deliverables):
list of recommended data-organization + reporting items — see
`references/post-campaign-followup.md`. List only, no operations. The review
itself is a separate future skill.

Format: Markdown tables (paste into Sheets / Notion). No .ics / calendar integration promised.
