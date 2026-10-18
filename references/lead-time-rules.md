# Backwards Scheduling Rules

## Definitions and date basis

- **S / E**: first and last promo dates, inclusive. A single-day promo has S = E. For a window-type candidate, the anchor D is S; peaks inside it do not create extra anchors.
- **Warm-up W**: days before S. Warm-up is a separate phase, [S - W, S - 1]; it is empty when W = 0. The **promo window** is [S, E].
- **Duration N**: number of inclusive promo days; E = S + N - 1. If the user gave a range, use its endpoints. Do not invent an anchor-plus/minus duration.
- **Planning lead L**: time to decide the campaign before production. The existing "planning deadline" column means **planning must start by** this date; planning finishes by production start.
- **Production time P**: time to make the assets.
- **Delivery buffer B**: slack between production completion and warm-up start, counted **once**, not subtracted again from every node.
- **Production lead Q** (optional): days from production completion to S. By default Q = W + B. An explicit Q must be at least W + B; otherwise flag a readiness conflict and ask the user to change Q, W, B, or scope. Never silently replace their number.

Record the market timezone / local date used for TODAY. Default arithmetic is **calendar days**; label it. Business-day inputs require the user's working week and relevant closure dates. Keep full years across year boundaries; validate start <= end and nonnegative durations.

## Formulas and range inputs

    warm-up start = S - W
    production completion = S - Q       (default Q = W + B)
    production start = production completion - P
    planning start-by = production start - L

This model uses one delivery buffer. If an approval or supplier adds another delay, name that dependency and its duration separately; do not count it again inside B. Exact user-supplied values produce exact calculated dates, not estimates. Estimated input ranges produce date ranges (earliest/latest endpoints); do not silently pick a midpoint. Unknown S, P, or required dependency => conditional dates / TBC, not a confirmed schedule.

Promo candidates must intersect the user's business span. Preparation may begin before it and remains visible in the timeline, calendar and reminders. A promo window extending outside the span is flagged for the user to retain or shorten; do not silently extend the agreed scope. Generate dates separately for every year in a cross-year span.

## Lead-time sources

Use current explicit inputs first. Past actuals are useful when team, channels and scope are comparable; otherwise flag the changed basis before reusing them. An explicit correction wins over an older brief; clarify only the conflicting fact.

| Missing item | Fallback range |
|---|---|
| Planning lead L | 1-2 weeks |
| Production time P | 2-4 weeks |
| Warm-up W | 1-2 weeks |
| Delivery buffer B | 2-3 days |

These are starting ranges, not standards or promises. Log each fallback, the calendar-day basis, and the derived Q. No default promo duration is supplied.

## Late-planning check

Compare every computed start-by / completion date with TODAY in the recorded timezone. For prospective planning, expired preparation requires a conditional reduce/postpone/cancel recovery proposal (show revised dates, effort and risk). Authorized historical simulation is not mechanically LATE. If a date range straddles TODAY, flag possible lateness. A past promo date belongs only in an explicitly requested retrospective or authorized simulation, never as a new executable recommendation. Compression does not itself prove feasibility.

## Conflict and capacity checks

Overlapping windows trigger a **shared-resource check**, not automatic rejection. Flag **CONFLICT** when named resources, approval, inventory or channel commitments actually compete; if unknown, label the conflict unassessed. Propose cut / merge / move by priority and let the user decide. Default priority: stated goal fit + audience fit.

For **OVERLOAD**, compare the same unit over the same period: estimated role-hours per week against available role-hours per week, or user-confirmed comparable sets per week against sets required. Sum concurrent commitments, include adaptation / review and any existing workload the user reports. Team headcount alone is not throughput; do not divide people by pieces or infer "no overload" just because campaigns do not overlap.

Ask for a rough bottleneck availability only when needed to judge feasibility. If capacity or effort is missing, say **capacity unconfirmed** and propose a conservative scope; never invent hours. Approval chains and supplier / print / delivery constraints are named dependencies with owner, due date and status when applicable. Unknown critical dependencies keep the plan conditional.

## Re-run and critical path

After Gate 2, changed selection, dates, scope, cost constraints or capacity => rerun date, late, budget, conflict and overload checks; reconfirm Gate 2. Mark the limiting dependency / node for each campaign (often production start); state what slips or must be cut if it misses. Gate 2 cannot turn an unknown fact into a verified one.


## v1.1.0 mode and planning-node clarification

The start-by formula denotes planning start, not planning completion; store planning_start and planning_deadline separately. Authorized historical simulation is a scenario, not automatically LATE or actually completed. Future/ongoing campaigns with expired preparation need reduce/postpone/cancel alternatives and stay conditional without readiness evidence. See [structured plans](structured-plans.md).
