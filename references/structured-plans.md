# Structured Stage 2 plans — v1.1.0

The agent researches and reasons; the local utility validates and materializes the agreed model. Use one JSON source for Timeline, Calendar, details, matrix, tasks, budgets and provenance. Do not independently regenerate these views in prose. Read [the schema](../schemas/plan.schema.json) and [fictional example](../templates/plan.example.json); the example is an interface demonstration, never a client's defaults.

## Local commands

Node.js 18+; native modules only. Run from the repository root. The utility reads local JSON, writes only the chosen output directory, and reads Git identity. It makes no network, model, publishing, scheduling or account calls. Do not run the original attached Python renderers as part of this workflow.

~~~sh
node scripts/plan.cjs from-selection --input selection.json --out scaffold.json --selection-confirmed
node scripts/plan.cjs validate --input plan.json
node scripts/plan.cjs generate --input plan.json --scenario low-resource --out output-low
node scripts/plan.cjs generate --input plan.json --scenario standard --out output-standard
node scripts/plan.cjs verify --out output-standard
node --test tests/plan.test.cjs
~~~

The Stage 1 bridge preserves IDs and full-year anchors, but deliberately creates an incomplete scaffold. Supply the strategy, matrix, evidence, tasks and declared unknowns before validation can pass. Only use the selection flag when the user has selected those activities. Generation refuses existing target files unless explicit overwrite is supplied. Keep private inputs and generated outputs outside the skill repository.

## Record and date rules

- Root records: meta, sources, business_context, scenarios, campaigns, coverage, content, tasks, costs, funnel, handoffs, offline and END_PLAN_INPUT. IDs link records; unknown references and duplicate IDs fail. Both low-resource and standard scenarios are required, with explicit capacity assumptions or null unknowns.
- Date fields are distinct: planning_start ≤ planning_deadline ≤ production_start ≤ production_complete < warmup_start ≤ start ≤ end. Full ISO years survive cross-year spans. Planning completion is not the planning start-by node in the original backwards formula. Choose a planning-work duration or retain an unknown; do not relabel one as the other.
- Initial warm-up/launch deliverables must be ready by production_complete, before warm-up. Calendar includes earlier preparation and actual phase/task/content nodes, not twelve themes. Unknown endpoints appear in an unscheduled bucket.
- Record mode, as_of and IANA timezone. A user-authorized historical simulation is a modeled scenario, not evidence of actual completion and not automatically LATE. A future/ongoing activity whose preparation expired requires a reduce/postpone/cancel proposal and alternatives; it remains conditional. Keep original dates in recovery.original_dates.
- Every number/date uses fact, assumption, derived or tbc with source IDs. Null means unknown, never zero. Supplied facts remain supplied assertions; public verification needs the actual URL and checked date. Critical course, eligibility, date and outcome claims without evidence are held from public copy.
- Hours/week measure role availability; hours measure work. Headcount and opening hours never become FTE. Shared task IDs count once. The utility spreads effort uniformly over calendar days into Monday weeks: this is a visible approximation, not a staffed work calendar.
- Costs use quantity × unit cost, currency and cost category. Materials are a subset; unknown labor/media/event costs prevent a full-cost WITHIN claim. Different currencies are separate. Shared costs count once across the span; only equal-share costs allocate to campaigns. No exchange rate is invented.
- Funnel numerator, denominator, cohort unit, identity key, attribution and window must be explicit. Annual unique people/households are deduplicated across months and channels. Multiplying hypothetical cohort and conversion ranges is a scenario, not measured ROI.

## Completion contract

Generate Markdown + self-contained HTML, normalized-plan, Timeline/Calendar JSON, analysis, the full field-level assumptions ledger, handoff packets and a SHA-256 manifest. The manifest records actual repository/ref/SHA/version, engine hash, dirty status, timezone and mode separately from input declarations.

The verifier checks required files/sections/end markers, bytes and hashes, selected IDs = Timeline IDs = detail IDs, Calendar/model consistency, assumptions ledger, and budget/capacity projection. A 13-to-5 report cannot pass by adding an end marker. Exit nonzero means incomplete. Never label a partial response complete; retain the failed output and precise blocker.

complete-draft means structurally complete files, not Gate 2 approval or factual/financial readiness. Pending handoffs, unknown budget/capacity and held claims stay visible. If Node is unavailable, a conversational draft is allowed, but say the executable contract was not verified; do not invent a passing manifest. Read [content matrix](content-matrix.md), [handoffs](downstream-handoffs.md), and [offline opportunities](offline-opportunities.md) as applicable.
