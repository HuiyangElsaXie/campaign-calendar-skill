# Campaign Calendar Skill

**English** | [简体中文](README.zh-CN.md)

Turn selected campaign dates into a coherent plan: preparation, promotion and review, with content work, cost assumptions and role-hours connected. Start with a full year, an explicit period, or one fixed date; keep every selected activity represented in the outputs.

I maintain this for my own planning work and keep updating it as I use it. Ideas or questions? Contact me through [my website](https://huiyangxie.ca/).

> Version 1.0 — accepted 2026-10-17.
> Current: **1.1.2, industry-default behavior correction**. Earlier buffer, cost-scope and confidence changes were behavior changes, not maintenance-only edits. [Release notes](CHANGELOG.md).

## Start with an AI conversation

Keep the full repository available and ask your agent to read [SKILL.md](SKILL.md). Installation/discovery depends on the host; copying only that file omits its references, schema and utilities.

For example: “Plan backwards from 2027-01-12 for my personal, non-commercial repair-information sharing session. Reuse the context and materials I have already supplied. Keep the date fixed, compare a low-resource and standard scope, show preparation, content, cost/capacity gaps and review needs, and do not run the event.” This is a fictional use prompt, not observed demand or a ready-to-run plan.

The agent uses relevant, permitted context it can actually access, states its source/date and asks only missing or conflicting essentials. It does not assume global access to your conversations. Missing dates, prices, effort or evidence remain TBC/assumptions; sufficient context lets planning continue without repeating the intake. See [intake](templates/intake.md).

This suits coordinating several activities or working backwards from one key date. A finished article/design, actual publishing, calendar-account writes, ad buying and event execution need separate workflows and authorization. Company, brand, organization and client use requires the permission described under [License](#license).

## Choose the scope

| planning_mode | Active input | Boundary |
|---|---|---|
| year | year, such as 2027 | span is that calendar year. |
| date_range | date_range.start / end | Ordered full dates matching span; no forced annual holiday list or twelve panels. |
| anchor_date | anchor_date | Both span endpoints identify that fixed day; selected promotion windows must intersect it. |

Unused scope inputs are null. Record as_of and the market's IANA timezone. Preparation can cross a year boundary, and an explicitly supplied review_date can follow the activity. Those extra nodes remain visible; they do not silently move the fixed date or invent a promotion duration. Costs, cohorts and weekly work use their stated scope and actual tasks, with no automatic annual proration. [Model and commands](references/structured-plans.md).

## From choices to a reviewable plan

1. **Stage 1:** use country/market, time span, offering, audience, purchase/use season and user dates to propose relevant activities, explain evidence/confidence and discuss alternatives. The user selects activities at Gate 1. Already selected activities are reused.
2. **Stage 2:** add actual channels, promotion windows, formats, reusable assets, lead times, budget currency/scope and role availability. The agent builds the shared campaign/content/task JSON, compares low-resource and standard scenarios, and surfaces conflicts or recovery choices.
3. **Gate 2:** the user judges dates, priorities, capacity and applicable Plan B decisions. A generated complete-draft is structurally complete, not approval or proof of readiness. Changes to selection/resources/dates require revalidation and renewed approval where affected.

Timeline comes first, then Calendar and the full report. The bundle includes every selected activity's strategy/dates, coverage-led content cores and channel variants, tasks/dependencies/effort, cost scope and unknowns, role-week capacity, measurement/deduplication, follow-up and a full provenance ledger. Calendar contains actual dated nodes and running windows. A manifest/end-marker check detects missing details and truncated outputs.

Offline opportunities first assess fit and resources; N/A is valid. Unconfirmed ideas remain separate candidate cards, outside committed schedules and costs. Public listings do not establish partner acceptance or permission. Optional [pinned skill handoffs](references/downstream-handoffs.md) are local requests/receipts, not automatic writer/API calls. [Output guide](templates/output.md).

## Run the existing offline utility

Node.js **18+**, native modules only; no package install or paid account is needed. These commands run from the repository root and write fictional examples outside it. Use fresh output paths.

~~~sh
node scripts/plan.cjs validate --input templates/plan.example.json
node scripts/plan.cjs generate --input templates/plan.example.json --scenario low-resource --out ../campaign-calendar-demo-low
node scripts/plan.cjs generate --input templates/plan.example.json --scenario standard --out ../campaign-calendar-demo-standard
node scripts/plan.cjs verify --out ../campaign-calendar-demo-standard
node --test tests/plan.test.cjs
~~~

The [example JSON](templates/plan.example.json) is a fictional repair-service model, not default prices, hours or effectiveness. For real use, the agent/person maps permitted inputs to the [schema](schemas/plan.schema.json); arbitrary prose or CSV is not imported automatically. The Stage 1 bridge creates an incomplete scaffold, not an invented Stage 2 plan. Direct CLI use is noninteractive and reads local JSON only. See [structured plans](references/structured-plans.md) for bridge/receipt options and failure behavior.

The old Python generators in examples/ are historical PDF-example tools using WeasyPrint, not the current planning engine. This Node workflow does not invoke them; the original PDFs and Python files remain unchanged. HTML/Markdown generation is supported; automatic PDF export or cross-host visual rendering is not promised.

## Evidence, privacy and industry boundaries

Record fact / assumption / derived / tbc with source IDs, units and scope. A simulation requires recorded user authority; historical simulation does not prove an event happened. Prospective activities with expired preparation need reduce/postpone/cancel proposals. No measured baseline means no invented conversion, ROI, verified date or feasibility claim.

The default industry_profile is generic. It checks relevant offering/provider/permission/date/price/outcome claims without requesting teaching or exam credentials. Only explicit education enables applicable specialized prompts, with N/A where appropriate. [Profile boundary and fictional fragment](references/industry-profiles.md).

Keep real business/client inputs, outputs, private briefs, contact details and credentials outside the public repository. The local utility has no network/model/account calls and reads Git identity for provenance. Agent research needs separately available, authorized tools; offline dates remain supplied or unverified. No publishing, outreach, applications, payments or calendar writes are performed by this workflow.

## Files, status and sources

SKILL.md and its Chinese twin are the agent entrypoints. references/ contains date/method/profile guidance; templates/ contains intake/output contracts and the fictional model; schemas/ and scripts/ validate/generate; examples/ retains disclosed fictional samples; tests/ documents deterministic checks. Developer test notes may be English-only. The workflow is evolving: tests cover bounded rule/generation behavior, not live integrations, official facts, staffing, editorial quality or business results. [Test scope](tests/README.md) · [behavior history](CHANGELOG.md).

The original skill and locally authored planning utilities are Huiyang Xie's work. Linked downstream skills retain their own sources/rights and are not vendored here; see the [pinned registry](references/downstream-skills.lock.json). The historical Python files import [WeasyPrint](https://weasyprint.org/); the frozen PDFs contain Noto Sans CJK, Liberation Sans and DejaVu Sans font data. Dependencies and font software retain their respective rights and are not claimed as original skill code or relicensed by this project.

## License

[PERSONAL NON-COMMERCIAL LIMITED USE LICENSE](LICENSE) applies only to Huiyang Xie’s original Materials. Personal non-commercial installation/use must keep the skill unmodified; normal inputs, intended settings and output editing are allowed. Company, brand, agency, organizational or client use needs prior written permission, even when not separately charged. Changes/adaptations, redistribution or incorporation of protected skill material also need permission. Mentioning the name/link, applicable legal exceptions and GitHub platform rights remain reserved. This is not an open-source license; third-party materials retain their own terms. For permission, use [the personal website](https://huiyangxie.ca/). The complete LICENSE controls; this paragraph is a summary.
