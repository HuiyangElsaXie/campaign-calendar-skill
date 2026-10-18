# Campaign Calendar Skill（活动日历）

[English](README.md) | **简体中文**

把已选活动日期变成一份连贯计划：准备、推广、复盘，以及相互对应的内容任务、成本假设和角色工时。可以从全年、明确时间段或一个固定节点开始，所有选中活动都应完整出现在交付中。

这是我为个人规划工作维护、在使用中持续更新的 skill。有想法或问题，欢迎通过[个人网站](https://huiyangxie.ca/)联系我。

> 版本 1.0 — 2026-10-17 验收通过。
> 当前为 **1.1.2 行业默认行为修正**。此前缓冲、成本口径、置信标签的变化属于行为变化，不再笼统标成维护修复。见[版本记录](CHANGELOG.zh-CN.md)。

## 从 AI 对话开始

保留整个仓库，让 agent 阅读 [SKILL.zh-CN.md](SKILL.zh-CN.md)。具体安装/发现方式依赖所用产品；只复制一个 SKILL 文件会缺少引用、schema 和工具。

例如：“为我 2027-01-12 的个人非商业修理资料分享做倒排，复用我已经给过的背景和素材，不移动固定日期。比较低资源和标准范围，列准备节点、内容、预算/工时缺口及复盘需要，不执行活动。”这是虚构用法提示，不代表真实需求或已经可执行的计划。

AI 先复用实际可访问且获准的相关上下文，简述来源/日期，只补关键缺失或冲突，不假定能读所有对话。缺少的日期、价格、工时和证据保持 TBC/假设；已有信息足够时继续规划，不重复问卷。见[输入指引](templates/intake.zh-CN.md)。

适合协调多个活动，或从一个关键日倒排。完整文章/设计、真实发布、写日历账户、买广告和执行活动属于其他流程，需要另行授权。公司、品牌、组织及客户项目的使用，需取得[许可](#许可)所述同意。

## 先选规划范围

| planning_mode | 使用的输入 | 边界 |
|---|---|---|
| year | year，例如 2027 | span 为该自然年。 |
| date_range | date_range.start / end | 完整起止日期须有序且匹配 span，不强塞全年节日或 12 个月面板。 |
| anchor_date | anchor_date | span 起止均标识该固定日，已选推广窗口须与其相交。 |

未使用的范围输入为 null。记录 as_of 和市场 IANA 时区。准备可跨年，明确给出的 review_date 可在活动结束后；额外节点仍显示，但不会挪固定日或虚构推广时长。成本、去重口径和周工作量按其明确范围与真实任务计算，不从全年自动均摊。见[模型与命令](references/structured-plans.zh-CN.md)。

## 从选择到可审阅计划

1. **Stage 1：**结合国家/市场、时间范围、提供内容、受众、购买/使用季节和用户日期，提出相关活动，解释证据/置信程度并讨论备选。用户在 Gate 1 选择；已选项目直接复用。
2. **Stage 2：**补实际渠道、推广起止、形式、可复用素材、提前量、预算币种/范围和角色可用时间。AI 建立活动/内容/任务共同 JSON，比较低资源与标准情景，指出冲突或恢复方案。
3. **Gate 2：**用户判断日期、优先级、容量和适用 Plan B。complete-draft 只表示结构完整，不是已批准或已就绪；选择、资源、日期改变后，重新校验并确认受影响的决定。

按 Timeline → Calendar → 完整报告交付。文件包包含每个已选活动的策略和日期、按问题覆盖的核心内容与渠道改写、任务/依赖/工时、成本口径及未知项、角色周容量、衡量/去重、跟进和完整来源日志。日历列真实日期节点及持续窗口，manifest/结束标记校验能发现漏详情和截断输出。

线下机会先判断适配和资源，N/A 也是有效结果。未确认想法单列候选卡，不混入承诺排期/成本；公开 listing 不等于合作接受或许可。[固定版本下游交接](references/downstream-handoffs.zh-CN.md)仅为本地请求/回执，不自动调用写手或 API。见[输出指引](templates/output.zh-CN.md)。

## 直接运行现有离线工具

需要 **Node.js 18+**，只用原生模块，不需安装包或付费账户。在仓库根目录执行，虚构示例输出到仓库外，使用新的输出路径。

~~~sh
node scripts/plan.cjs validate --input templates/plan.example.json
node scripts/plan.cjs generate --input templates/plan.example.json --scenario low-resource --out ../campaign-calendar-demo-low
node scripts/plan.cjs generate --input templates/plan.example.json --scenario standard --out ../campaign-calendar-demo-standard
node scripts/plan.cjs verify --out ../campaign-calendar-demo-standard
node --test tests/plan.test.cjs
~~~

[示例 JSON](templates/plan.example.json)是虚构修理服务模型，不是默认价格、工时或效果。真实使用时由 AI/使用者把获准输入映射到 [schema](schemas/plan.schema.json)，不自动导入任意文字或 CSV。Stage 1 桥接只建不完整脚手架，不伪造 Stage 2 计划。CLI 非交互，只读本地 JSON；桥接、回执选项和失败处理见[结构化计划](references/structured-plans.zh-CN.md)。

examples/ 内旧 Python 是依赖 WeasyPrint 的历史 PDF 样例工具，不是当前规划引擎；Node 流程不调用它们，原 PDF/Python 保持不变。支持生成 HTML/Markdown，不承诺自动导出 PDF 或跨环境视觉渲染。

## 证据、隐私与行业边界

数值和日期携带 fact / assumption / derived / tbc、来源 ID、单位和范围。simulation 需有用户授权记录，历史模拟不证明实际办过活动；面向未来但准备已过期的活动须给缩减/延期/取消方案。缺真实基线，就不编转化、ROI、已核验日期或可行性。

industry_profile 默认 generic，只检查实际相关的产品/服务、提供方、许可、日期、价格和效果，不要求教学或考试资质。明确选择 education 才启用适用的专用提示，不适用可 N/A。见[行业边界与虚构片段](references/industry-profiles.zh-CN.md)。

真实业务/客户输入、结果、私密 brief、联系方式和凭据保存在公开仓库之外。本地工具不联网、不调用模型或账户，只读取 Git 身份用于溯源。AI 做研究需要另外可用且获准的工具；离线日期维持用户提供或未验证状态。此流程不发布、不联络、不申请、不付款、不写外部日历。

## 文件、状态与来源

SKILL.md 及中文双语入口是 agent 工作流；references/ 放日期/方法/profile；templates/ 放输入输出契约和虚构模型；schemas/、scripts/ 校验生成；examples/ 保留标明虚构的历史样例；tests/ 说明确定性检查。开发者测试说明可能仅有英文。流程持续演进，测试覆盖有限规则与本地生成，不证明真实集成、官方事实、人员安排、编辑质量或业务效果。[测试范围](tests/README.md) · [行为历史](CHANGELOG.zh-CN.md)。

原创 skill 与本地编写的规划工具归 Huiyang Xie。下游 skill 保留各自来源/权利，未复制源码到本库，见[固定版本注册表](references/downstream-skills.lock.json)。原 Python 引用 [WeasyPrint](https://weasyprint.org/)；冻结 PDF 含 Noto Sans CJK、Liberation Sans、DejaVu Sans 字体数据。依赖和字体软件保留其自身权利，不作为本 skill 原创代码或由本项目重新许可。

## 许可

[个人非商业有限使用许可证](LICENSE)仅适用于 Huiyang Xie 的原创 Materials。个人非商业安装/使用需保持 skill 本体原样，正常输入、预设可配置项及产出编辑允许。公司、品牌、agency、组织及客户项目即使不另收费，也需事先书面许可；修改/改编、再发布或把受保护 skill 内容纳入其他作品同样需许可。项目名称/链接、法定例外和 GitHub 平台权利保留。这不是开源许可证，第三方材料仍按其自身条款。申请许可通过[个人网站](https://huiyangxie.ca/)。此处仅为摘要，以完整 LICENSE 为准。
