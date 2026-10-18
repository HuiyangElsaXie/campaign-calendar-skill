# 韩国日期底库（通用层）

与年份无关：固定日期 + 农历规则 + 公告型（TBC）。绝不把去年的日期当作今年的。六个现成通用层之一（加拿大、中国、美国、英国、日本、韩国）。小众国家 → 研究协议（`references/research-protocol.md`）。

## 第 1 类 —— 固定日期（内置）

| 日期 | 说明 |
|---|---|
| 1 月 1 日 | 新年 (New Year's Day)（신정 Sinjeong) |
| 2 月 14 日 | 情人节 (Valentine's Day)（commercial — 女性送巧克力给男性） |
| 3 月 1 日 | 三一节 (Independence Movement Day)（삼일절 Samiljeol) |
| 3 月 14 日 | 白色情人节 (White Day)（화이트데이，commercial — 男性回礼） |
| 4 月 14 日 | 黑色情人节 (Black Day)（블랙데이，commercial，次要——单身者吃炸酱面；仅餐饮） |
| 5 月 1 日 | 劳动节 (Labor Day)（노동절；public-holiday 地位于 2026 年恢复——2026 年之前年份需确认） |
| 5 月 5 日 | 儿童节 (Children's Day)（어린이날；也是主要的儿童送礼日） |
| 5 月 8 日 | 父母节 (Parent's Day)（어버이날，commercial / 送礼——康乃馨 + 礼物；NOT a public holiday) |
| 6 月 6 日 | 显忠日 (Memorial Day)（현충일；NO substitute day — 唯一不适用替代公休日的假日） |
| 7 月 17 日 | 制宪节 (Constitution Day)（제헌절；public-holiday 地位于 2026 年恢复——2026 年之前年份需确认） |
| 8 月 15 日 | 光复节 (Liberation Day)（광복절 Gwangbokjeol) |
| 10 月 3 日 | 开天节 (National Foundation Day)（개천절 Gaecheonjeol) |
| 10 月 9 日 | 韩文日 (Hangul Day)（한글날 Hangeulnal) |
| 10 月 31 日 | 万圣节 (Halloween)（commercial，日益普及——酒吧、咖啡馆、主题乐园；NOT a public holiday) |
| 11 月 11 日 | Pepero 节 (Pepero Day)（빼빼로데이，commercial — 大规模零食 / 礼物交换） |
| 12 月 25 日 | 圣诞节 (Christmas Day)（크리스마스） |

## 第 2 类 —— 规则型日期（先计算，再核验）

根据农历规则计算，再对照目标年份已发布的年历核验（代码 / 日历工具 / 使用者核对——三者必居其一，每次都要做）。

| 日期 | 规则 |
|---|---|
| 春节 (Seollal / Lunar New Year)（설날） | 农历正月初一。Public holiday = 前一天 + 当天 + 后一天（共 3 天） |
| 佛诞节 (Buddha's Birthday)（부처님 오신 날） | 农历四月初八 |
| 中秋节 (Chuseok / Harvest Festival)（추석） | 农历八月十五。Public holiday = 前一天 + 当天 + 后一天（共 3 天） |

2027 年抽查（已核验）：春节 2 月 7 日（假日 2 月 6–8 日，替代公休 2 月 9 日）、佛诞节 5 月 13 日、中秋节 9 月 15 日（假日 9 月 14–16 日）。

## 第 3 类 —— 公告型日期（绝不编造）

选举日 (Election Day)（仅在有选举时为临时 public holiday）。无官方日期 → TBC。

## 说明

- **替代公休日 (대체공휴일)：** 指定 public holiday 落在周末时，下一个工作日成为替代公休日。**显忠日（6 月 6 日）除外——它没有替代公休日。** 适用清单由政府法规设定——按年确认。
- **不要跨国照抄农历日期。** 韩国农历偶尔会与中国农历差一天（时区 / 朔时刻）。Seollal 2027 = 2 月 7 日；当年中国的日期是 2 月 6 日。各用各国核验过的日期。
- **有意排除（精简范围）：** 地方假日（济州 4·3、光州 5 月 18 日）、教师节 (Teacher's Day)（5 月 15 日）、国军日 (Armed Forces Day)（10 月 1 日——不是稳定的年度日期）。

## 核验来源

- KASA 年历 / 官方公报——public holidays 的核对来源。
- 零售商官方公告——第 3 类日期的唯一来源。
- 以上表格是起始核对清单，不是事实来源。输出前核验目标年份的每个日期。
