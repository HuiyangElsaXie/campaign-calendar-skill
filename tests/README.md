# Offline validation

Run node --test tests/plan.test.cjs from the repository root (Node 18+, no install). The suite uses a fictional repair-workshop model only. It exercises 13-to-5 truncation, hashes/end markers, cross-year dates, initial readiness, simulation permission, role-hour units/overlap, currency/unknown costs, coverage/research reuse, task dependencies, lost handoff outputs and conditional offline opportunities. Temporary output is scoped to a named test directory under the OS temp directory and removed after the tests.

Generate the fictional template through scripts/plan.cjs, then verify its output directory. This tests local deterministic files; it does not prove real prices, official dates, partner acceptance, model-writing quality, visual rendering, external integration or business outcomes. No browser or original Python renderer is used. Client fixtures and acceptance reports belong outside this repository. See ../references/structured-plans.md for the schema boundary and partial/conditional states.

The original 52 Node regressions remain, plus eight scope regressions: calendar year, quarter/cross-month periods, fixed anchor with cross-year preparation and explicit review, reversed/competing inputs, unchanged fixed date, unknown/invalid review, no cost/capacity proration, and transparent v1.1.0 import.
