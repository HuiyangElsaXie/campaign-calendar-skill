# China Date Base (universal layer)

Year-independent: fixed dates + lunar / solar-term rules + announced (TBC). Never carry
last year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day （元旦， public holiday) |
| Feb 14 | Valentine's Day （情人节， gifting) |
| Mar 8 | International Women's Day （妇女节 / 女神节， gifting + e-commerce) |
| May 1 | Labour Day （劳动节， public holiday + shopping) |
| May 20 | 520 (网络情人节， gifting / commercial — 520 ≈ "I love you" in Mandarin) |
| Jun 1 | Children's Day （儿童节， gifting, kids products) |
| Sep 10 | Teachers' Day （教师节， gifting) |
| Oct 1 | National Day （国庆节， public holiday + Golden Week shopping) |
| Oct 31 | Halloween （万圣节， commercial in urban China — malls, bars, theme parks, schools; NOT a public holiday) |
| Nov 11 | Singles' Day / Double 11 （双11 — fixed date; sale mechanics announced each year, see Class 3) |
| Dec 12 | Double 12 （双12 — fixed date; sale mechanics announced each year, see Class 3) |
| Dec 25 | Christmas （圣诞节， commercial / gifting in urban China; NOT a public holiday) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the lunar / solar-term rule, then verify against a published calendar
for the target year (code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Spring Festival / Chinese New Year （春节） | Lunar 1st month, 1st day （正月初一） |
| Lantern Festival （元宵节） | Lunar 1st month, 15th day （正月十五） = Spring Festival + 14 days; tangyuan promotions, lantern events, mall activities |
| Qingming Festival （清明节） | Qingming solar term (15th day after March equinox; Apr 4–6). Public holiday; low commercial relevance — not a promo anchor |
| Mother's Day （母亲节） | 2nd Sunday of May (same rule as US / Canada) |
| Dragon Boat Festival （端午节） | Lunar 5th month, 5th day （五月初五） |
| Father's Day （父亲节） | 3rd Sunday of June (same rule as US / Canada) |
| Qixi Festival （七夕） | Lunar 7th month, 7th day （七月初七） |
| Mid-Autumn Festival （中秋节） | Lunar 8th month, 15th day （八月十五） |

2027 historical spot-check examples (source records not bundled; re-verify before use): Spring Festival Feb 6, Lantern Festival
Feb 20, Qingming Apr 5, Mother's Day May 9, Dragon Boat Jun 9, Father's Day Jun 20,
Qixi Aug 8, Mid-Autumn Sep 15.

## Class 3 — Announced dates (NEVER invent)

- **618 Shopping Festival （618）** — exact dates / windows set by JD / Tmall each
  year → announced / TBC. Do not hardcode a window.
- **Double 11 mechanics** — the date Nov 11 is fixed, but sale windows / mechanics
  are set by platforms each year → treat mechanics as announced / TBC.

## Notes

- **Statutory leave windows are NOT in this table.** The State Council publishes the
  official holiday schedule (with make-up workdays 调休） around November of the
  prior year. The skill must never hardcode leave windows — festival dates only.
- **Do NOT copy lunar dates across countries.** The Chinese lunar calendar
  occasionally differs by a day from the Korean one (timezone / new-moon timing).
  Spring Festival 2027 = Feb 6 (China); Seollal 2027 = Feb 7 (Korea). Use each
  country's own verified date.
- **Qixi attracts misinformation.** Several AI-generated pages gave mutually
  contradictory Qixi dates; all were discarded. The lunar rule (7/7) is the anchor;
  verify the year's date against Wikipedia + agreeing sources.
- **Deliberately excluded (lean scope):** none currently. Dates are excluded only
  when they fail the commercial-inclusion test (no shops / brands run campaigns
  for them).

## Verification sources

- State Council official holiday schedule — the check source for public holidays.
- Platform official announcements — the only source for Class 3 dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every
  date for the target year before output.
