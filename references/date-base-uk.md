# United Kingdom Date Base (universal layer)

Year-independent: fixed dates + weekday rules + announced (TBC). Never carry last
year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

Scope: England & Wales bank holidays (the UK-wide baseline). Scotland / Northern
Ireland / Wales-only days are regional — excluded; add via the research protocol
if the user's market needs them.

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day (bank holiday; substitute-day rule applies) |
| Feb 14 | Valentine's Day (retail anchor, not a holiday) |
| Oct 31 | Halloween (retail anchor, not a holiday) |
| Dec 25 | Christmas Day (bank holiday; substitute-day rule applies) |
| Dec 26 | Boxing Day (bank holiday; substitute-day rule applies) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the weekday rule, then verify against a published calendar for the
target year (code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Good Friday | Friday before Easter Sunday (bank holiday) |
| Easter Sunday | First Sunday after the first full moon on or after Mar 21 (computus) |
| Easter Monday | Day after Easter Sunday (bank holiday) |
| Mothering Sunday (UK Mother's Day) | 4th Sunday of Lent (= Easter Sunday − 21 days). Does NOT match the US date (2nd Sunday of May) |
| Father's Day | 3rd Sunday of June |
| Early May bank holiday | 1st Monday of May |
| Spring bank holiday | Last Monday of May |
| Summer bank holiday | Last Monday of August (England, Wales, NI; Scotland's is the 1st Monday of August — regional) |
| Remembrance Sunday | 2nd Sunday of November — context only, NOT a promo anchor (solemn observance) |
| Black Friday | Day after US Thanksgiving (= 4th Thursday of Nov + 1 day). The UK follows the US date even though Thanksgiving is not a UK holiday |
| Cyber Monday | Monday after Black Friday |
| Small Business Saturday (UK) | 1st Saturday of December (unlike the US Saturday-after-Thanksgiving version) |

2027 spot-checks (verified): Mothering Sunday Mar 7, Easter Mar 28, Black Friday
Nov 26, Cyber Monday Nov 29.

## Class 3 — Announced dates (NEVER invent)

Amazon Prime Day (set by Amazon each year, typically July). No official date →
TBC. Never use a prior year's date.

## Notes

- **Substitute-day rule:** when a fixed bank holiday falls on a weekend, a
  substitute weekday is designated. Store the FIXED dates above, not the
  substitute dates, so the base stays year-independent.
- **Deliberately excluded (regional):** Scotland — 2 January, St Andrew's Day
  (Nov 30), summer bank holiday on the 1st Monday of August. Northern Ireland —
  St Patrick's Day (Mar 17), Battle of the Boyne (Jul 12). Wales — St David's Day
  (Mar 1, not a bank holiday).

## Verification sources

- GOV.UK bank holidays dataset — the check source for bank holidays.
- Retailer official announcements — the only source for Class 3 dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every
  date for the target year before output.
