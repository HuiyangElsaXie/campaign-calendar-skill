---
name: campaign-calendar-skill
description: Two-stage campaign planning for any user-defined time span (one temporary campaign to a full year) in a chosen country. Stage 1: recommend candidate activities for the span (simple list + interactive report). Stage 2: after the user selects activities and fills in per-activity details (promo range, online/offline, budget range, foot traffic, format), backwards-schedule into planning, production, and promo deadlines. Outputs timeline first, then calendar view, then detailed report. Does not publish, schedule, or buy anything.
---

# Campaign Calendar

## Use when

- User wants a campaign timeline / calendar for a time span they define: one temporary campaign, a quarter, a season, a full year.
- User wants promo dates as anchors with backwards scheduling (planning date, asset production date, promo dates).
- User wants a plan document for their boss for that time span.

## Do not use when

- User wants a single campaign's execution brief → campaign planner skill (06).
- User wants bulk social posting schedules → social / content-calendar skill.
- User wants content topics → content calendar.

## Runtime

- Conversational (dialog-box) agent — no coding / building agent (Codex /
  Claude Code) needed. The skill is a prompt workflow: ask → reason → write
  reports.
- Web research required for full function (niche countries, expo opportunities,
  announced dates, verification). Offline fallback: shipped layers +
  user-provided dates; everything else tagged unverified.
- PDF output required for the Stage 2 visual report (timeline Gantt, calendar).
  If the agent cannot produce PDFs, deliver the Markdown report + an HTML
  version the user can print to PDF. (Stage 1's report is Markdown /
  chat-native and needs no PDF.)

## Intake — two stages (never ask Stage 2 questions before Stage 1 selection)

**Pre-fill rule (never re-ask):** before asking any intake question, check what the
user already provided in the invocation / conversation and use it. Never re-ask a
question the user already answered. If unsure whether an answer covers a question,
confirm briefly ("You said X — using that for this") instead of re-asking.

**Output language:** ask at invocation whether the outputs should be in English
or Chinese. If the user already stated it, use it (pre-fill rule). Read the file
version matching the output language: English `.md` files, or the `.zh-CN.md`
twins when output is Chinese. All user-facing outputs (Stage 1 report, timeline,
calendar, detailed report) are in the chosen language.

### Stage 1 (light — to recommend activities)

Country (6 shipped layers: Canada, China, US, UK, Japan, Korea; other → research-built, see Date base) · time span (start–end dates) · what you sell (product / service category) · who you sell to (target customer + cultural background) · when they buy / use it (usage season / purchase cycle, peak, pre-season?) · brand / self-set dates (may be none) · city / metro (optional — local expo suggestions if given; brand mode if not) · past campaigns (optional — last year / last quarter: what ran, what worked, actual lead times) · known competitor campaigns / dates (optional — avoid head-on collision or deliberately counter-program).

### Stage 2 (after the user selects activities)

Global (once): channels & capacity (website, store count, social account count, matrix accounts) · lead times (planning / production / warm-up; may skip → wide-range estimate + flag) · total span budget (optional — the budget roll-up checks per-activity AND total) · team size + approval chain (ask at least team size — feeds the capacity-aware overload check).
Per selected activity: promo date range (default: anchor ± default duration; user may change) · FUNNEL F1–F6 (goal · price point · margin · purchase pattern · channel · budget band — each with fixed options + "other"; see `templates/intake.md`) → format recommendation via `references/format-recommendation.md` (user's own idea always wins) · foot traffic estimate + take-rate (if offline) · reuse (which assets from earlier campaigns can be reused — reused assets subtract from production load).

Optional (use if given, never chase): offer mechanics · language · reusable assets · priorities (must-do vs cuttable) · offline presence details · distribution target · unit costs + total budget cap · daily data collector · review date + owner · Plan B decision-maker.
Missing → provisional + explicit assumption. Never invent. See `templates/intake.md`.

## Date base (country-level universal layers + research)

Six shipped universal layers (one file each): Canada, China, US, UK, Japan, Korea.
See `references/date-base-canada.md`, `date-base-china.md`, `date-base-us.md`,
`date-base-uk.md`, `date-base-japan.md`, `date-base-korea.md`.
Each layer has three classes: fixed (built in) · rule-based (compute from weekday /
lunar rules, then VERIFY) · announced (NEVER invent: no official date → TBC).
Niche countries: no shipped layer → build one by research
(see `references/research-protocol.md`).

### Stage 1 candidate generation (how recommendations are built)

**Stage 1 principle — maximize breadth within logic:** Stage 1 provides as many
logically-sound date / activity options as possible; the user selects from them
at Gate 1 for Stage 2 planning. Include every candidate with a specific reason.
When in doubt, INCLUDE — Gate 1 is the user's filter, not the skill's. Never
pre-filter on the user's behalf (e.g. never drop a candidate because the list
looks long or because you guess the user won't pick it). "Do not pad" means do
not add candidates WITHOUT a reason — it never means hold back candidates that
have one.

1. **Country layer** — the operating country's universal layer, filtered to the span.
2. **Audience cultural layer** — dates from the audience's cultural background
   (e.g. a Canada store serving Chinese customers → Chinese New Year, Mid-Autumn,
   Children's Day Jun 1). Researched if not in a shipped layer; flagged per the
   research protocol.
3. **Season-anchored candidates** — from the user's usage season / purchase cycle:
   pre-season (default: season start − 4–6 weeks, user-adjustable), in-season,
   end-of-season clearance. The anchor is computed from the user-stated season,
   not a holiday.
4. **User dates** — brand anniversary, self-set promo days (user-input slots,
   never guessed).
5. **Expo / event booth opportunities** — trade shows, expos, conventions,
   festivals, parade stalls, and local community events (researched; see
   `references/expo-booth.md`).
   Confirmed expos enter the main candidate table (with application deadline);
   last-year-only evidence goes in "Worth further research", never mixed in.
6. **Mass sporting mega-events** — FIFA World Cup, Olympics, Super Bowl,
   continental championships (researched; see
   `references/mega-sporting-events.md`). Mass-popular events many industries
   can market around: brand tie-in and / or shop related activities.
   Announced-type dates (TBC); every candidate carries a trademark / IP flag.
7. **Past campaigns** (if given) — calibrate lead times (past actuals beat
   fallback ranges — see `references/lead-time-rules.md`) and inform candidate
   angles; see Generation rules for the past-failure rule.
8. **Competitor dates** (if given) — avoid head-on collision, or deliberately
   counter-program if the user says so. Stage 2 output: the timeline flags
   COMPETITOR on a colliding campaign; the detailed report has a Competitor
   collisions section (competitor, date, user's stance).
9. **User-added candidates** — the user can add their own date + activity
   name at any time; user dates are authoritative, never researched.
10. **Relevance reasoning** — every candidate needs a "why it fits" tied to the
   user's specific answers (product / audience / season). No generic industry
   labels: "retail" is too broad to decide relevance (baby retail ≠ camping retail).
   A candidate with no specific reason does not enter the list.
11. **Transparent filtering** — dates considered but NOT recommended are listed with
   a one-line reason (e.g. Remembrance Day — solemn day, not a promo anchor).
   The user can override any exclusion.
12. **Gap check** — if a quarter / season in the span has zero candidates, flag it
   and ask whether the gap is intentional.
13. **Confidence tags** — every candidate carries one: base-verified /
   government-sourced / official-announcement / unverified (unverified must be
   user-confirmed before it can become an anchor).

**Generation rules (apply to every run):**
- **Layer sweep** — go through EVERY date in the country layer + audience
  cultural layer; for each, decide include or exclude (excluded ones go to
  Transparent filtering with a reason). Never skip a layer date silently. A
  missed layer date is a skill failure, not a user omission.
- **Past failure never auto-vetoes** — a past failure does not remove a candidate.
  It re-enters with a changed-angle note stating what failed last time (e.g.
  "2026 angle was weak — recommend with a changed angle").
- **Campaign-block clustering** — dates within ~7 days that form a recognized
  season (e.g. Christmas + Boxing Day + New Year = Holiday Season) are proposed
  as ONE combined candidate (one campaign block), not separate candidates.

Rules: last year's date does not prove this year's. Candidate dates filtered to
[span start − max lead time, span end]. Dates that vary by province → flag
"confirm local observance" (no province logic in this skill).

## Backwards scheduling

For each anchor date D: promo window = [D − warm-up, D + duration]; production deadline = D − production lead (production lead must be ≥ warm-up, else flag it); production start = deadline − production time; planning deadline = production start − planning lead. Asset sets from channels (see `references/channel-capacity.md`). Lead times: user-supplied wins; else wide RANGE + flagged assumption (never a single-point estimate). Buffer on every deadline (user may change). Check conflicts (overlapping timelines) + overload (same-week production beyond capacity) → propose cut / merge / move by priority. Mark the critical path (usually production start). See `references/lead-time-rules.md`.

## Outputs

### Stage 1 — activity recommendation report (simple + interactive)

Candidate activities for the span: date, activity, why it fits (product / audience /
season), possible type (online / offline / both), confidence tag. Plus what the user
should decide next: select activities + fill Stage 2 details (via HTML form artifact or chat). Plus a
"considered but not recommended" list with one-line reasons.
No backwards math, no materials, no budget, no timeline yet — those need confirmed activities. Never present Stage 1 as the final plan. See `templates/stage1-recommendation.md`.

### Stage 2 — final outputs (in this order, after selection + details)

1. Timeline — chronological list: every campaign with planning deadline, production start, warm-up start, promo dates. The backbone. Each campaign carries a **materials checklist** annex (what + how many + by when; see `references/materials-checklist.md`), a **data-collection checklist** annex (what to collect + keep during the campaign, for the post-campaign review; see `references/data-collection.md`), and a **contingency Plan B** list (pre-decided responses to common disruptions; see `references/contingency-plan-b.md`).
2. Calendar view — same data as a calendar (monthly / span view) + reminder list (upcoming deadlines; default 30-day window, user-adjustable).
3. Detailed report — plan doc for the boss for the chosen span: goal, campaign overview, milestones, capacity note + mandatory assumptions & unknowns log (every TBC date, every estimated lead time, every default). No log = incomplete output. Includes the **budget roll-up** (materials checklist quantities × unit costs; unit costs TBC unless user-supplied — never invented).
Format: Markdown tables (paste into Sheets / Notion). No .ics / calendar integration promised. See `templates/output.md`.

After the campaign: a post-campaign follow-up list — recommended data-organization + reporting items (list only, no operations). The review itself is a separate future skill. See `references/post-campaign-followup.md`.

## Workflow (two stages, two human gates)

Stage 1: 1. Light intake (pre-filled from the invocation — never re-ask; city gate: if no city was given, ask once before generating the report whether the user wants to pin a specific city). 2. Build candidate activities: country layer + audience cultural layer + season-anchored candidates + user dates + expo / booth opportunities + mass sporting mega-events → relevance reasoning → transparent filtering → gap check (see Date base). The user can also add their own candidates at any time (date + activity name) — user dates are authoritative, never researched or verified against external sources. 3. Discussion (chat): the user asks questions about candidates; the agent answers; selection is discussed. 4. GATE 1 — report + collection, two steps kept separate. The Stage 1 report is the staged output AFTER the discussion — it is not chatted with. Step 1 (select): user selects the activities they want. Step 2 (details): AFTER selection, for each selected activity, collect that activity's Stage 2 questions (promo range · funnel F1–F6 · foot traffic · reuse) — via HTML form artifact (tick → reveal that activity's fields; submit returns to the agent) when the environment supports it, otherwise in chat one activity at a time. Timing: ask the user — decide now in chat, or need more time? (a) Decide now: selection + details in conversation. (b) Need more time: the user reviews the report at their own pace and submits the form (or replies in chat) when ready. If new questions arise, discussion reopens in chat; the report is updated.
Stage 2: 5. Format recommendation via the funnel (F1–F6 → 2–3 formats with reasons; user's own idea wins), then backwards math per selected activity (lead times + channel sets + format needs + reuse). 6. Late-planning check (any deadline already past vs today → flag LATE + compress / move / drop) + conflict / overload check (capacity-aware: production load ÷ team capacity; approval chain > 1 → buffer / risk flag) + competitor collision check (selected campaign on a known competitor date → flag COMPETITOR) → trade-off proposals. Default priority when the user gave none: goal fit + audience fit. 7. GATE 2: user confirms timeline. 8. Final outputs in order: timeline → calendar → report. 9. State: nothing published, scheduled, or spent; all dates / lead times per user final confirmation. If the user changes selection / details after Gate 2, re-run steps 5–7.

At Gate 2 the user also pre-decides the Plan B items (rain date, price floor, code caps,
dynamic QR, backup roster, holding statement) and names the Plan B decision-maker
and the daily data collector — so both checklists are ready before launch.

## Honesty rules

- Never invent a date. Never present an estimate as a fact. Unknown is a valid answer.
- No performance promises ("this schedule will lift X").
- Unconfirmed output = draft, not an approved plan. Do not reuse another client's private info.

## Boundaries

- No publishing, scheduling, ad buying, contacting anyone, spending.
- No auto-reminders (no calendar integration; user imports the reminder list).
- No single-campaign execution brief (→ 06). No bulk social scheduling. No budget, no ROI promise.
