# Explicit industry profiles

The common planner is industry-neutral. `meta.industry_profile` defaults to `generic` when absent. It is never inferred from a client name, previous conversation, the offline industry field or a sample. Generic claims concern relevant products/services, providers, permissions, dates, prices, eligibility and outcomes; a repair business is not asked for teaching or exam credentials.

Set `meta.industry_profile` to `education` only when that industry context is explicitly established. The optional prompts in [the profile data](industry-profiles.json) then apply to relevant claims. A course, instructor, exam pathway or test-center claim needs its own evidence; N/A is appropriate when it is not offered. This profile does not require every education provider to offer exams or hold test-center status. Unsupported public claims remain held.

Education-specific claim kinds (`course`, `instructor`, `exam_eligibility`, `test_center`) without the explicit profile fail with `INDUSTRY_PROFILE_REQUIRED`. They are not silently discarded or changed into generic claims. Other industries may use generic `offer`, `provider`, `authorization` and `eligibility` claims. Add a future profile only with an explicit scope and tests; do not broaden the default notice.

## Fictional example fragment — not a complete plan

This fragment illustrates a fictional learning workshop, not an actual organization, exam date, qualification or client record. Insert only applicable claims into an otherwise complete validated plan; retain the actual permitted source IDs.

```json
{
  "meta": { "industry_profile": "education" },
  "evidence_requirements": [
    { "claim": "Advertised workshop content and learner fit are not yet evidenced", "kind": "course", "state": "tbc", "source_ids": ["S-UNKNOWN"], "public_action": "hold" },
    { "claim": "An instructor credential claim needs its own evidence if used", "kind": "instructor", "state": "tbc", "source_ids": ["S-UNKNOWN"], "public_action": "hold" }
  ]
}
```

Runtime path: `preparePlan` supplies the generic fallback; `validatePlan` gates specialized claim kinds and checks public-claim evidence; `buildReport` reads the selected profile's notice/checks. The common schema stores a neutral kind identifier; the profile data defines the vocabulary, and semantic validation rejects unknown kinds and enforces applicability. These controls do not perform research or certify eligibility.
