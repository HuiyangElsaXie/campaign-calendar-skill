# South Korea Date Base (universal layer)

Year-independent: fixed dates + lunar rules + announced (TBC). Never carry last
year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day (신정 Sinjeong) |
| Feb 14 | Valentine's Day (commercial — women give chocolate to men) |
| Mar 1 | Independence Movement Day (삼일절 Samiljeol) |
| Mar 14 | White Day (화이트데이, commercial — men reciprocate) |
| Apr 14 | Black Day (블랙데이, commercial, minor — singles eat jajangmyeon; F&B only) |
| May 1 | Labor Day (노동절; public-holiday status restored 2026 — confirm for years before 2026) |
| May 5 | Children's Day (어린이날; also a major children's gifting day) |
| May 8 | Parent's Day (어버이날, commercial / gifting — carnations + gifts; NOT a public holiday) |
| Jun 6 | Memorial Day (현충일; NO substitute day — the only holiday excluded from substitution) |
| Jul 17 | Constitution Day (제헌절; public-holiday status restored 2026 — confirm for years before 2026) |
| Aug 15 | Liberation Day (광복절 Gwangbokjeol) |
| Oct 3 | National Foundation Day (개천절 Gaecheonjeol) |
| Oct 9 | Hangul Day (한글날 Hangeulnal) |
| Oct 31 | Halloween (commercial, growing — bars, cafes, theme parks; NOT a public holiday) |
| Nov 11 | Pepero Day (빼빼로데이, commercial — massive snack / gift exchange) |
| Dec 25 | Christmas Day (크리스마스) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the lunar rule, then verify against a published calendar for the
target year (code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Seollal / Lunar New Year (설날) | Lunar 1st month, 1st day. Public holiday = day before + day + day after (3 days) |
| Buddha's Birthday (부처님 오신 날) | Lunar 4th month, 8th day |
| Chuseok / Harvest Festival (추석) | Lunar 8th month, 15th day. Public holiday = day before + day + day after (3 days) |

2027 spot-checks (verified): Seollal Feb 7 (holiday Feb 6–8, substitute Feb 9),
Buddha's Birthday May 13, Chuseok Sep 15 (holiday Sep 14–16).

## Class 3 — Announced dates (NEVER invent)

Election Day (temporary public holiday only when an election occurs).
No official date → TBC.

## Notes

- **Substitute holiday (대체공휴일):** when a designated public holiday falls on a
  weekend, the next working day becomes a substitute holiday. **Memorial Day
  (Jun 6) is excluded — it gets no substitute day.** The eligible list is set by
  government regulation — confirm per year.
- **Do NOT copy lunar dates across countries.** The Korean lunar calendar
  occasionally differs by one day from the Chinese one (timezone / new-moon
  timing). Seollal 2027 = Feb 7; the Chinese date that year is Feb 6. Use each
  country's own verified date.
- **Deliberately excluded (lean scope):** local holidays (Jeju 4·3, Gwangju May 18),
  Teacher's Day (May 15), Armed Forces Day (Oct 1 — not a
  stable annual date).

## Verification sources

- KASA almanac / Official Gazette — the check source for public holidays.
- Retailer official announcements — the only source for Class 3 dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every
  date for the target year before output.
