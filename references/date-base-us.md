# United States Date Base (universal layer)

Year-independent: fixed dates + weekday rules + announced (TBC). Never carry last
year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day (federal) |
| Feb 14 | Valentine's Day (retail anchor, not a holiday) |
| Jun 19 | Juneteenth National Independence Day (federal) |
| Jul 4 | Independence Day (federal) |
| Oct 31 | Halloween (retail anchor — major seasonal retail: costumes, candy, decor; not a holiday) |
| Nov 11 | Veterans Day (federal) |
| Dec 25 | Christmas Day (federal) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the weekday rule, then verify against a published calendar for the
target year (code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Birthday of Martin Luther King, Jr. | 3rd Monday of January (federal) |
| Washington's Birthday (Presidents' Day) | 3rd Monday of February (federal; legal name "Washington's Birthday") |
| Easter Sunday | First Sunday after the first full moon on or after the vernal equinox (Western computus) |
| Mother's Day | 2nd Sunday of May |
| Memorial Day | Last Monday of May (federal) |
| Father's Day | 3rd Sunday of June |
| Labor Day | 1st Monday of September (federal) |
| Columbus Day | 2nd Monday of October (federal; also observed as Indigenous Peoples' Day in many states/cities) |
| Thanksgiving Day | 4th Thursday of November (federal) |
| Black Friday | Day after Thanksgiving (retail anchor, not a federal holiday) |
| Small Business Saturday | Saturday after Thanksgiving |
| Cyber Monday | Monday after Thanksgiving |

2027 spot-checks (verified): Easter Mar 28, Mother's Day May 9, Memorial Day
May 31, Father's Day Jun 20, Labor Day Sep 6, Thanksgiving Nov 25,
Black Friday Nov 26, Cyber Monday Nov 29.

## Class 3 — Announced dates (NEVER invent)

Amazon Prime Day (set by Amazon each year, typically July, plus an October event).
No official date → TBC. Never assume a date. The user may fill in a confirmed date.

## Notes

- **Legal vs observed dates (federal holidays):** when a fixed federal holiday falls
  on Saturday, federal employees observe the preceding Friday; on Sunday, the
  following Monday. Store the LEGAL dates above, not the shifted observed dates,
  so the base stays year-independent. The shift is a presentation note.
- **Deliberately excluded (lean scope):** State holidays, Flag Day, Groundhog Day,
  Giving Tuesday — out of lean scope.

## Verification sources

- OPM federal holidays list (opm.gov) — the check source for federal dates.
- Retailer official announcements — the only source for Class 3 dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every
  date for the target year before output.
