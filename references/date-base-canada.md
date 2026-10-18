# Canada Date Base (universal layer)

Country-level only. No province selection, no province logic. Where a date is known to vary
by province, the skill flags it "confirm local observance" and moves on.

Year-independent: fixed dates + weekday rules + announced (TBC). Never carry last
year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day |
| Jul 1 | Canada Day |
| Sep 30 | National Day for Truth and Reconciliation (federal; confirm local observance) |
| Oct 31 | Halloween (retail anchor, not a holiday) |
| Nov 11 | Remembrance Day (confirm local observance) |
| Dec 25 | Christmas Day |
| Dec 26 | Boxing Day (confirm local observance) |
| Feb 14 | Valentine's Day (retail anchor, not a holiday) |
| Nov 11 | Singles' Day (retail anchor, cross-border e-commerce) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the weekday rule, then verify against a published calendar for the target year
(code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Labour Day | First Monday of September |
| Thanksgiving | Second Monday of October |
| Victoria Day | Monday before May 25 |
| Family Day | Third Monday of February (not observed in all provinces — confirm local observance) |
| Mother's Day | Second Sunday of May |
| Father's Day | Third Sunday of June |
| Black Friday | Day after US Thanksgiving (4th Friday of November) |
| Cyber Monday | Monday after Black Friday |

2027 spot-checks (verified): Victoria Day May 24, Family Day Feb 15, Mother's Day
May 9, Father's Day Jun 20, Labour Day Sep 6, Thanksgiving Oct 11,
Black Friday Nov 26, Cyber Monday Nov 29.

## Class 3 — Announced dates (NEVER invent)

Prime Day, retailer-set promos, lunar-calendar holidays (e.g. Chinese New Year, Mid-Autumn Festival).
No official date → TBC + "usually in [month], confirm after official announcement".
The user may fill in a confirmed date. Never carry last year's date forward as this year's.

## User-layer dates

Brand anniversary, self-set promo days → user-input slots. Never guessed, never inferred
from the brand name or past campaigns.

## Verification sources

- Federal government published statutory-holiday list (Canada.ca) — the check source for
  Class 1 and Class 2 dates, every time, for the target year.
- Retailer / brand official announcements — the only source for Class 3 dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every date
  for the target year before output.

## Boundary rules

- Last year's date does not prove this year's date.
- Candidate dates are filtered to [time-span start − max lead time, time-span end].
  Dates outside that window are not listed.
- If a date's observance is uncertain, mark it unknown / TBC. Unknown is a valid answer.
