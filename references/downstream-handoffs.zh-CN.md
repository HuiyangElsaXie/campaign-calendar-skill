# 可选、固定版本的下游 skill 交接

[注册表](downstream-skills.lock.json)记录 2026-10-18 实际读过的四个公开仓库、固定 SHA、真实入口路径、输出接口和权利说明。仅为可选人工/文件交接，不是运行依赖、API 或自动插件；没有复制源码。公开可见不代表整体许可，快照的原创部分未授整体/root license，已标第三方权利仍适用。主动升级 SHA 前重新核对接口与权利。

- customer-needs：获准来源的案头审阅 → 需求、证据、反证和限制；未做调查不能称调查结果。
- campaign-planner：单个已选活动、矩阵、证据和资源 → 执行简报、任务；全年选择、预算产能仍归本 skill。
- social-writer：已支持平台、核心、证据及发布者身份 → 请求范围内的可编辑文案。快照支持 Instagram、TikTok、X、Facebook、Reddit、小红书、微信公众号、知乎。朋友圈不等于公众号适配器，应保留标注清楚的本地简报/人工降级；LinkedIn 不在该快照范围。
- blog-writer：所需中英范围及来源 → 可编辑文章候选、声明核对；不写 CMS、不猜路由、不部署。

生成器只写本地 request：plan_id、handoff_id、固定 skill SHA、最小业务/活动/内容上下文、来源和精确 expected_output_ids；不会调用写手或上传文件。agent 可人工使用已授权且可用的 skill；不可用就标 pending/degraded，保留可用简报。计划不等于真实文案、图片或已完成研究。

回传 JSON 放本地目录，validate/generate 使用 --receipts DIR。信封包含 handoff_id、plan_id、skill_sha、outputs（逐项 id 和非空可编辑 body）、end_marker END_HANDOFF。输出 ID 必须与期望完全相等，SHA 和结束标记须匹配；漏项或改名报错。任务引用 upstream_output_ids，防止上游交付无声丢失。回执只证明身份/完整性，事实与编辑审核仍须另做；pending 上游对应任务仍是阻塞草案，不传递发布或联络授权。
