# 日本日期底库（通用层）

与年份无关：固定日期 + 星期规则 + 公告型（TBC）。绝不把去年的日期当作今年的。六个现成通用层之一（加拿大、中国、美国、英国、日本、韩国）。小众国家 → 研究协议（`references/research-protocol.md`）。

## 第 1 类 —— 固定日期（内置）

| 日期 | 说明 |
|---|---|
| 1 月 1 日 | 元旦 (New Year's Day)（元日 Ganjitsu) |
| 2 月 11 日 | 建国纪念日 (National Foundation Day)（建国記念の日） |
| 2 月 14 日 | 情人节 (Valentine's Day)（commercial — 主要送巧克力日） |
| 2 月 23 日 | 天皇诞生日 (Emperor's Birthday)（天皇誕生日；跟随在位天皇——天皇更替时日期变化） |
| 3 月 14 日 | 白色情人节 (White Day)（ホワイトデー，commercial — 回礼日） |
| 4 月 29 日 | 昭和日 (Shōwa Day)（昭和の日） |
| 5 月 3 日 | 宪法纪念日 (Constitution Memorial Day)（憲法記念日） |
| 5 月 4 日 | 绿之日 (Greenery Day)（みどりの日） |
| 5 月 5 日 | 儿童节 (Children's Day)（こどもの日） |
| 8 月 11 日 | 山之日 (Mountain Day)（山の日） |
| 10 月 31 日 | 万圣节 (Halloween)（commercial — 城市：涩谷、主题乐园、零售商；NOT a public holiday) |
| 11 月 3 日 | 文化日 (Culture Day)（文化の日） |
| 11 月 23 日 | 劳动感谢日 (Labor Thanksgiving Day)（勤労感謝の日） |
| 12 月 25 日 | 圣诞节 (Christmas)（クリスマス，commercial — NOT a public holiday；蛋糕、约会夜） |

## 第 2 类 —— 规则型日期（先计算，再核验）

根据星期规则计算，再对照目标年份已发布的年历核验（代码 / 日历工具 / 使用者核对——三者必居其一，每次都要做）。

| 日期 | 规则 |
|---|---|
| 成人节 (Coming of Age Day)（成人の日） | 1 月第 2 个星期一（快乐星期一制度） |
| 春分日 (Vernal Equinox Day)（春分の日） | 3 月 20 日或 21 日，天文确定 |
| 海洋节 (Marine Day)（海の日） | 7 月第 3 个星期一（快乐星期一制度） |
| 敬老日 (Respect for the Aged Day)（敬老の日） | 9 月第 3 个星期一（快乐星期一制度） |
| 秋分日 (Autumnal Equinox Day)（秋分の日） | 9 月 22 日或 23 日，天文确定 |
| 体育日 (Sports Day)（スポーツの日） | 10 月第 2 个星期一（快乐星期一制度） |
| 母亲节 (Mother's Day) | 5 月第 2 个星期日（康乃馨是传统礼物） |
| 父亲节 (Father's Day) | 6 月第 3 个星期日 |

2027 年历史抽查示例（原始信源未随包附上；使用前重新核验）：春分日 3 月 21 日、秋分日 9 月 23 日、母亲节 5 月 9 日、父亲节 6 月 20 日。

## 季节簇（说明，不是单独条目）

- **黄金周 (Golden Week)** —— 季节性购物 / 旅行高峰，4 月 29 日 – 5 月 5 日（昭和日 + 宪法纪念日 + 绿之日 + 儿童节）。
- **盂兰盆节 (Obon)（お盆）** —— 8 月 13–15 日（全国默认；NOT a public holiday；主要旅行高峰，约 60% 企业停业）。地区差异：东京 / 横滨过七月盂兰盆节 (Shichigatsu Bon) 7 月 13–16 日；冲绳过农历盂兰盆节。
- **新年促销 (hatsu-uri / fukubukuro 福袋）** —— 1 月头几天；具体促销日期由零售商设定 → announced (TBC)。

## 说明

- **替代假日 (振替休日 Furikae Kyūjitsu)：** 国民假日落在星期日时，下一个工作日成为假日。2027 年示例：春分日星期日 3 月 21 日 → 替代假日星期一 3 月 22 日。
- **有意排除（精简范围）：** 节分 (Setsubun)（2 月 3 日）、雏祭 (Hinamatsuri)（3 月 3 日）、七夕 (Tanabata)（7 月 7 日）——季节性纪念，非通用商业锚点。

## 核验来源

- 内阁府 public-holiday 日历——public holidays 的核对来源。
- 零售商官方公告——announced dates 的唯一来源。
- 以上表格是起始核对清单，不是事实来源。输出前核验目标年份的每个日期。
