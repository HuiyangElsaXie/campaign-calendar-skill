# Backwards Scheduling Rules

## Definitions

- **Anchor date (D)**: the promo / event date everything counts back from.
- **Window-type candidates** (mega-events): the candidate is a window, not a
  day. D = the promo window START (the first day the campaign must be live).
  Warm-up is before the window start. Peaks inside the window (final / key
  match days) are promo peaks, not separate anchors.
- **Planning lead**: time needed to decide the campaign (offer, angle, channels) before production starts.
- **Production time**: time needed to make the assets.
- **Production lead**: how far before D production must be FINISHED. Must be ≥ warm-up
  (assets are needed by warm-up start). If the user gives a production lead shorter than
  warm-up, flag it: assets would not be ready when promotion starts.
- **Warm-up**: pre-promo promotion window before D.
- **Duration**: how long the promo itself runs.
- **Buffer**: slack added to every deadline. User may change it; default 2–3 days.

## Formulas (per anchor date D)

- Promo window = [D − warm-up, D + duration]
- Production deadline = D − production lead
- Production start = production deadline − production time
- Planning deadline = production start − planning lead

## Lead-time sources

User-supplied numbers always win. **Past actuals beat fallback ranges:** if the
user gave past campaigns with actual lead times (Stage 1 intake), use the actuals
as the lead times and flag them as "from past actuals" in the assumptions log.
If the user does not provide them, use these FALLBACK
RANGES and flag every one as an estimate in the assumptions log:

| Item | Fallback range |
|---|---|
| Planning lead | 1–2 weeks |
| Production time | 2–4 weeks |
| Warm-up | 1–2 weeks |
| Buffer | 2–3 days |

Fallback ranges are starting ranges, not standards. Never present a single-point estimate
("production takes 3 weeks"). The report must state that missing information only permits
a wide-range estimate.

## Late-planning check

Compare every computed deadline to TODAY (the user's local date). Any deadline already past → flag LATE
in the timeline with three options: compress lead times (state the compressed
numbers + the risk) / move the campaign (later anchor) / drop it. Never output
an already-expired timeline without the LATE flag.

## Conflict check

Two campaigns' timelines overlap → flag CONFLICT + propose a trade-off by priority:
cut (drop the lower-priority campaign), merge (combine promos), or move (shift the
lower-priority anchor). The user decides; the skill only proposes.

**Default priority** (when the user gave no priorities): goal fit + audience fit
(from the Stage 1 "why it fits" strength). A campaign that serves the stated
goal and hits the target customer outranks one that does neither.

## Overload check (capacity-aware)

Production sets due in the same week beyond the user's capacity → flag OVERLOAD +
propose: spread the work, reuse assets, or cut scope. Capacity = team size from
intake (1 person vs team) ÷ production load. Approval chain > 1 step → add buffer
or flag the risk (approvals consume calendar time even when production does not).
Do not silently assume the user can absorb it.

## Re-run rule

If the user changes selection / details after Gate 2, re-run the math + conflict /
overload / late-planning checks and re-confirm the timeline (Gate 2 again).

## Critical path

Mark the node that must not slip for each campaign — usually production start. If that
node slips, the promo date slips (or scope gets cut). Say so explicitly.
