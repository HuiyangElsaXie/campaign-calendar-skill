# Stage 2 结构化计划 — v1.1.0

由 agent 做判断与研究，本地工具负责校验和生成。同一份 JSON 驱动 Timeline、Calendar、逐活动详情、内容矩阵、任务、预算和来源；不可分别凭记忆重写。阅读[模型 schema](../schemas/plan.schema.json)和[虚构接口样例](../templates/plan.example.json)，样例值不是客户默认值。

## 本地命令

Node.js 18+，仅使用原生模块。在仓库根目录执行；只读本地 JSON 和 Git 身份、写指定输出目录，不联网、不调用模型、不发布、不排期到外部账户。此流程不运行原附件 Python。

~~~sh
node scripts/plan.cjs from-selection --input selection.json --out scaffold.json --selection-confirmed
node scripts/plan.cjs validate --input plan.json
node scripts/plan.cjs generate --input plan.json --scenario low-resource --out output-low
node scripts/plan.cjs generate --input plan.json --scenario standard --out output-standard
node scripts/plan.cjs verify --out output-standard
node --test tests/plan.test.cjs
~~~

Stage 1 桥接保留 ID 和完整年份，但输出刻意不完整的脚手架。补齐策略、矩阵、任务、来源及明确的未知值再校验；用户确已选择才使用 selection-confirmed。已存在文件默认拒绝覆盖。私密输入及生成结果保存在 skill 仓库之外。

## 数据和日期约束

- 根数据包含 meta、sources、business_context、scenarios、campaigns、coverage、content、tasks、costs、funnel、handoffs、offline 及 END_PLAN_INPUT。重复 ID 或缺失引用报错。低资源、标准两种情景均须有容量依据，允许明确的 null 待确认。
- 七个日期独立：策划开始 ≤ 策划完成截止 ≤ 制作开始 ≤ 素材完成 < 预热开始 ≤ 活动开始 ≤ 活动结束，均为完整 ISO 年月日。旧倒推公式中的 planning start-by 是策划开始节点，不可改名为策划完成；策划工作时长需另有依据或待确认。
- 首批预热/上线素材须在 production_complete 前交付，早于预热。日历列实际阶段、交付和内容节点，覆盖跨年前期准备；未知活动日期进入未排期区。
- 记录 mode、as_of、IANA 时区。经用户授权的历史模拟不机械标 LATE，也不代表实际完成。尚未开始或正在进行但准备已过期的活动，必须提出缩减/延期/取消方案及备选，保留 recovery.original_dates，不能伪造已完成准备。
- 数值/日期携带 fact、assumption、derived 或 tbc 及来源 ID。未知为 null，不是 0。用户提供的事实保留来源性质；公开核验需要真实 URL、核验日期。课程、年龄年级/资格、日期、师资、成绩等关键声明缺证据时从公开文案中暂扣。
- 角色容量用 hours/week，工作量用 hours。人数、营业时长不能换算 FTE。共用任务 ID 仅算一次。工具按日历日均摊至周一开始的周，仅为透明近似，不是实际人员排班。
- 成本为数量 × 单价，带币种和类别。物料小计与全成本分开；人工/媒介/场地未知不能判全案 WITHIN。不同币种分别列示，不发明汇率；共用成本全年一次，equal-share 才按活动分摊。
- 漏斗必须说明分子、分母、同一人/家庭的去重键、归因和时间窗。不可把月度去重人数直接相加当年度去重；区间相乘只是模拟，不是实际转化或 ROI。

## 完整性契约

生成 Markdown、自包含 HTML、规范化模型、Timeline/Calendar JSON、预算产能分析、完整字段级假设日志、交接包及 SHA-256 清单。清单记录实际 repo/ref/SHA/version、引擎哈希、工作区是否修改、时区和模式，并与输入声称的版本分开。

校验必需文件、章节、结束标记、字节/哈希、选中 ID = Timeline ID = 详情 ID、日历与模型、假设日志及预算产能推导。13 个选中只写 5 个详情，即使补结束标记也失败。非零退出表示不完整，保留失败输出和准确阻塞。

complete-draft 仅表示结构完整，不代表 Gate 2 已批准或事实/预算已就绪。待交接、预算产能未知、暂扣声明继续显示。没有 Node 时可写对话草案，但须明确未通过可执行核验，不能伪造成功清单。按需阅读[内容矩阵](content-matrix.zh-CN.md)、[交接](downstream-handoffs.zh-CN.md)、[线下机会](offline-opportunities.zh-CN.md)。
