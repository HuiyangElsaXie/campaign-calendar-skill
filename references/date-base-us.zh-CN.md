# 美国日期底库（通用层）

与年份无关：固定日期 + 星期规则 + 公告型（TBC）。绝不把去年的日期当作今年的。六个现成通用层之一（加拿大、中国、美国、英国、日本、韩国）。小众国家 → 研究协议（`references/research-protocol.md`）。

## 第 1 类 —— 固定日期（内置）

| 日期 | 说明 |
|---|---|
| 1 月 1 日 | 元旦 (New Year's Day)（federal) |
| 2 月 14 日 | 情人节 (Valentine's Day)（零售锚点，不是假日） |
| 6 月 19 日 | 六月节国家独立日 (Juneteenth National Independence Day)（federal) |
| 7 月 4 日 | 独立日 (Independence Day)（federal) |
| 10 月 31 日 | 万圣节 (Halloween)（零售锚点——主要季节零售：服装、糖果、装饰；不是假日） |
| 11 月 11 日 | 退伍军人节 (Veterans Day)（federal) |
| 12 月 25 日 | 圣诞节 (Christmas Day)（federal) |

## 第 2 类 —— 规则型日期（先计算，再核验）

根据星期规则计算，再对照目标年份已发布的年历核验（代码 / 日历工具 / 使用者核对——三者必居其一，每次都要做）。

| 日期 | 规则 |
|---|---|
| 马丁·路德·金纪念日 (Birthday of Martin Luther King, Jr.) | 1 月第 3 个星期一（federal) |
| 华盛顿诞辰（总统日）(Washington's Birthday (Presidents' Day)) | 2 月第 3 个星期一（federal；法定名称为 "Washington's Birthday"） |
| 复活节 (Easter Sunday) | 春分当日或之后的第一个满月之后的第一个星期日（西方复活节推算） |
| 母亲节 (Mother's Day) | 5 月第 2 个星期日 |
| 阵亡将士纪念日 (Memorial Day) | 5 月最后一个星期一（federal) |
| 父亲节 (Father's Day) | 6 月第 3 个星期日 |
| 劳动节 (Labor Day) | 9 月第 1 个星期一（federal) |
| 哥伦布日 (Columbus Day) | 10 月第 2 个星期一（federal；许多州 / 城市同时庆祝为原住民日 (Indigenous Peoples' Day)） |
| 感恩节 (Thanksgiving Day) | 11 月第 4 个星期四（federal) |
| 黑色星期五 (Black Friday) | 感恩节次日（零售锚点，不是 federal holiday) |
| 小企业星期六 (Small Business Saturday) | 感恩节之后的星期六 |
| 网络星期一 (Cyber Monday) | 感恩节之后的星期一 |

2027 年抽查（已核验）：复活节 3 月 28 日、母亲节 5 月 9 日、阵亡将士纪念日 5 月 31 日、父亲节 6 月 20 日、劳动节 9 月 6 日、感恩节 11 月 25 日、黑色星期五 11 月 26 日、网络星期一 11 月 29 日。

## 第 3 类 —— 公告型日期（绝不编造）

亚马逊 Prime Day（由亚马逊每年设定，通常在 7 月，另有 10 月场）。无官方日期 → TBC。绝不假设日期。使用者可填入已确认的日期。

## 说明

- **法定日期 vs 实际放假日期（federal holidays）：** 固定 federal holiday 落在星期六时，联邦雇员在前一个星期五放假；落在星期日时，在下一个星期一放假。存上面所列的 LEGAL 日期，不是平移后的 observed 日期，这样底库才能与年份无关。平移只是展示说明。
- **有意排除（精简范围）：** 州假日、国旗日 (Flag Day)、土拨鼠日 (Groundhog Day)、捐赠星期二 (Giving Tuesday)——超出精简范围。

## 核验来源

- OPM federal holidays 列表（opm.gov）——federal dates 的核对来源。
- 零售商官方公告——第 3 类日期的唯一来源。
- 以上表格是起始核对清单，不是事实来源。输出前核验目标年份的每个日期。
