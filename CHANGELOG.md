# Feature and behavior releases

The original 1.0 acceptance remains recorded. Historical version numbers are retained for traceability; they do not imply that these changes were maintenance-only or that all prior consumers remain compatible.

## 1.1.2 — industry-default behavior correction (2026-10-18)

- Removed education assumptions from the default report notice, common guidance and fictional repair-service fixture. Generic offer/provider/permission/date/price/outcome checks remain relevant across industries.
- Added explicit `meta.industry_profile`: absent means `generic`, not an inferred industry. Education prompts and specialized claim kinds are defined in the [profile reference](references/industry-profiles.md). They activate only for `education`, and only relevant checks apply; others may be N/A.
- Education-specific kinds outside that profile now fail clearly instead of being silently discarded. Existing education inputs using `course` or `instructor` must explicitly choose the profile. Legacy generic inputs default neutrally. Generic `offer`, `provider`, `authorization` and `price` claims also retain evidence checks before public use.
- Corrected the release labels and documented the earlier behavior changes below. No date arithmetic, budgets, country holiday entries or rights terms are changed in this correction.

## 1.1.1 — planning-scope features and validation (2026-10-18)

Year, explicit date range and fixed anchor are mutually exclusive inputs with matching spans and timezone. Added a supplied review milestone; unknown review dates stay TBC. Short scopes do not force twelve monthly panels, fixed dates never shift silently, and costs/role-hours are not automatically prorated from a year. Older complete-span inputs are explicitly mapped during import.

## 1.1.0 — structured planning features and behavior (2026-10-18)

Added a common campaign/content/task model, offline validator/generator, file hashes and executable completeness checks. Selected campaign IDs must appear in Timeline, Calendar and all details; truncated reports fail. Coverage-led cores/variants, role-hour estimates, unknown cost states and deduplicated cohorts replace unsupported completion/feasibility claims. Optional pinned file handoffs validate returned output identities; no external writer/API is automatically called. Existing free-form inputs need a completed structured model for these checks.

## 1.0.1 — scheduling, budget and intake behavior (2026-10-18)

- Applied one delivery buffer; distinguished inclusive promotion dates, warm-up and production readiness; retained full years and corrected rule-based date calculations. Consumers of the old schedules must recheck calculated deadlines.
- Separated material subtotals from complete activity/span costs, currencies and matching-scope caps. Unknown required costs prevent an overall WITHIN claim. Headcount/opening hours do not establish available role-hours; adaptations and concurrent work consume capacity.
- Distinguished base-listed, user-set and reported/unverified dates rather than upgrading them to verified facts. Stage 1 custom dates, array fields and reconsideration behavior changed; downstream consumers must check the payload contract.
- Revised format recommendations to respect margin/eligibility and up to three feasible options rather than filling a quota.

## Verification boundary

Deterministic regression tests cover the specified rules, local generation and file integrity. They do not establish real prices, official-date/credential verification, editorial quality, external integrations, live staffing or business outcomes. Per-run counts belong in the actual test output, not a permanent success promise in this document.

## Owner-approved license adoption (2026-10-18; separate from 1.1.2 behavior changes)

Added the exact owner-approved PERSONAL NON-COMMERCIAL LIMITED USE LICENSE and synchronized bilingual usage summaries. It applies to owner-original Materials, excludes third-party materials, and preserves the stated legal/GitHub rights. No historical PDF, author identity or dependency/source notice was changed.
