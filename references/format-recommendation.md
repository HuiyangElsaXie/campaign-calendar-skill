# Format Recommendation — Goal-First + Constraint Filter

How the skill recommends up to 3 feasible activity formats per campaign. The recommendation
comes from a FUNNEL of questions (see `templates/intake.md` Stage 2), not from an
industry lookup — "retail" is too broad to decide formats (baby retail ≠ camping
retail ≠ tea retail).

## Step 1 — Goal → candidate formats (goal is the primary key)

| Goal (funnel F1) | Candidate formats |
|---|---|
| Clear stock / end of season （清库存 / 季末） | Clearance, BOGO, Bundle / gift set (move volume) |
| Acquire new customers （拉新） | Giveaway / lucky draw, Collaboration / co-brand, Pop-up / tasting (trial drives acquisition) |
| Increase basket size （提高客单价） | Gift with purchase, Bundle / gift set |
| New product launch （新品发布） | Launch event, Pre-order, Tasting / sampling |
| Repeat purchase / retention （复购 / 留存） | Loyalty / stamp card, Bundle / gift set (stock-up packs) |
| Gifting occasion （送礼场合） | Bundle / gift set, Gift with purchase |
| Awareness / traffic （引流 / 曝光） | Pop-up / in-store event, Giveaway / lucky draw, Collaboration / co-brand |

## Step 2 — Constraint filter (exclusion)

Apply each filter to the candidates from Step 1. A hard filter excludes unsafe / infeasible options. Preferences only rank remaining candidates; they do not reintroduce an excluded format.

| Funnel answer | Filter |
|---|---|
| Channel = online-only (F5) | Exclude pop-up / in-store event, in-store tasting |
| Budget = known tight cap (F6) | Exclude a format when supplied costs exceed the matching cap. Unknown costs remain conditional; prefer a smaller scope among remaining options without promising it is cheap |
| Margin = thin (F3) | Exclude deep discount. Do not assume BOGO or gifts are margin-safe; check supplied unit economics / price floor, otherwise mark margin feasibility unconfirmed |
| Price = high-ticket (F2) | Prefer pre-order, launch event, collaboration (trust-building). Avoid flash discount |
| Purchase pattern = one-time (F4) | Exclude loyalty / stamp card (no repeat to reward) |
| Purchase pattern = repeat (F4) | Loyalty / stamp card and stock-up bundles stay in |
| Product not try-able (inferred from Stage 1 product category, e.g. services, intangible products) | Tasting does not apply — replace with free trial / free consultation where the format list allows |

## Step 3 — Output

- Recommend **up to 3 feasible formats**, each with a one-line reason that cites the user's
  specific answers (goal + price + margin + frequency + channel + budget).
- Never write generic reasons ("this is popular", "best practice"). If a reason
  cannot cite a user answer, the format does not get recommended.
- One feasible option is enough; if none remain, explain the constraint and offer scope / timing changes instead of filling a quota.
- For discounts / gifts / BOGO, use supplied price, product/gift cost and price floor to check margin when available. For same-item BOGO, revenue from one unit must cover the cost of two before other costs. Unknown costs => conditional, never "cost-controlled" by format name.
- The user picks, mixes, or supplies their own idea; preserve cost, date and feasibility constraints and show unresolved risks. Their choice is not evidence that those constraints passed.
- A recommended format may ADD materials (e.g. tasting → samples; pop-up →
  roll-up). The materials checklist picks those up automatically.

## Rules

- Any funnel question may be skipped → the skill proceeds without that filter and
  flags the missing input as an assumption in the report.
- "Not sure" = no constraint from that question (same as skipped).
- "Other (type your own)" answers are used as given — the skill reasons from them,
  never forces them into a fixed option.
- Presets (`references/activity-format-presets.md`) are the menu; this file is the
  logic that picks from the menu. Presets are starting points, not proven winners.
- Never present a recommended format as a performance promise.
