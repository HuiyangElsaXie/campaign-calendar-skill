# Optional pinned downstream skills

[Registry](downstream-skills.lock.json) records the four actually inspected public repositories, immutable SHAs, entrypoint paths, output interfaces and rights notices as of 2026-10-18. They are optional manual/file handoffs, not dependencies, APIs or automatically executed plugins. No source was copied; public visibility does not grant a blanket license. Original additions in these snapshots have no overall/root license, while identified third-party notices remain applicable. Re-read interface/rights before deliberately changing a pin.

- customer-needs: permitted-source desk review → needs/evidence/counterevidence brief; unavailable research stays a hypothesis.
- campaign-planner: one selected campaign + matrix/evidence/resources → execution brief and backlog; annual selection/capacity/budget remain owned here.
- social-writer: requested supported platform + core/evidence/publisher → editable requested copy. Snapshot supports Instagram, TikTok, X, Facebook, Reddit, Xiaohongshu, WeChat Official Account and Zhihu. WeChat Moments is not that adapter; use a labeled local brief/manual fallback. LinkedIn is outside this snapshot.
- blog-writer: requested EN/ZH scope + permitted sources → editable article candidates/claim review. No CMS write, route guesses or deployment.

Generation writes a local request with plan_id, handoff_id, pinned skill SHA, limited business/campaign/content context, source ledger and exact expected_output_ids. It does not invoke a writer or export files. The agent may use an available authorized skill manually; otherwise retain pending/degraded status and a useful local brief. Do not claim actual posts/images/research when only a plan exists.

To accept a result, place its JSON receipt in a local directory and use --receipts DIR with validate/generate. Envelope: handoff_id, plan_id, skill_sha, outputs (each id and nonempty editable body), end_marker END_HANDOFF. Exact expected ID equality, pinned identity and end marker are required. Missing/renamed outputs fail. Content tasks reference upstream_output_ids, so a dropped result cannot disappear silently. Receipt validation proves identity/completeness only, not factual/editorial approval; inspect claims before use. Pending upstream tasks remain blocked drafts. No publication or contact authority is conveyed.
