# Japan Date Base (universal layer)

Year-independent: fixed dates + weekday rules + announced (TBC). Never carry last
year's date forward as this year's. One of six shipped universal layers
(Canada, China, US, UK, Japan, Korea). Niche countries → research protocol
(`references/research-protocol.md`).

## Class 1 — Fixed dates (built in)

| Date | Note |
|---|---|
| Jan 1 | New Year's Day (元日 Ganjitsu) |
| Feb 11 | National Foundation Day (建国記念の日) |
| Feb 14 | Valentine's Day (commercial — major chocolate-giving day) |
| Feb 23 | Emperor's Birthday (天皇誕生日; follows the reigning emperor — date changes if the emperor changes) |
| Mar 14 | White Day (ホワイトデー, commercial — return-gift day) |
| Apr 29 | Shōwa Day (昭和の日) |
| May 3 | Constitution Memorial Day (憲法記念日) |
| May 4 | Greenery Day (みどりの日) |
| May 5 | Children's Day (こどもの日) |
| Aug 11 | Mountain Day (山の日) |
| Oct 31 | Halloween (commercial — urban: Shibuya, theme parks, retailers; NOT a public holiday) |
| Nov 3 | Culture Day (文化の日) |
| Nov 23 | Labor Thanksgiving Day (勤労感謝の日) |
| Dec 25 | Christmas (クリスマス, commercial — NOT a public holiday; cakes, date night) |

## Class 2 — Rule-based dates (compute, then VERIFY)

Compute from the weekday rule, then verify against a published calendar for the
target year (code / calendar tool / user check — one of the three, every time).

| Date | Rule |
|---|---|
| Coming of Age Day (成人の日) | 2nd Monday of January (Happy Monday System) |
| Vernal Equinox Day (春分の日) | Mar 20 or 21, astronomically determined |
| Marine Day (海の日) | 3rd Monday of July (Happy Monday System) |
| Respect for the Aged Day (敬老の日) | 3rd Monday of September (Happy Monday System) |
| Autumnal Equinox Day (秋分の日) | Sep 22 or 23, astronomically determined |
| Sports Day (スポーツの日) | 2nd Monday of October (Happy Monday System) |
| Mother's Day | 2nd Sunday of May (carnations are the traditional gift) |
| Father's Day | 3rd Sunday of June |

2027 spot-checks (verified): Vernal Equinox Mar 21, Autumnal Equinox Sep 23,
Mother's Day May 9, Father's Day Jun 20.

## Seasonal clusters (notes, not separate entries)

- **Golden Week** — seasonal shopping / travel peak, Apr 29 – May 5 (Shōwa Day +
  Constitution Memorial Day + Greenery Day + Children's Day).
- **Obon (お盆)** — Aug 13–15 (national default; NOT a public holiday; major travel
  peak, ~60% of businesses close). Regional variation: Tokyo / Yokohama observe
  Shichigatsu Bon Jul 13–16; Okinawa observes lunar-calendar Bon.
- **New Year sales (hatsu-uri / fukubukuro lucky bags)** — first days of January;
  exact sale dates set by retailers → announced (TBC).

## Notes

- **Substitute holiday (振替休日 Furikae Kyūjitsu):** when a national holiday falls
  on a Sunday, the following weekday becomes a holiday. 2027 example: Vernal
  Equinox Day Sun Mar 21 → substitute holiday Mon Mar 22.
- **Deliberately excluded (lean scope):** Setsubun (Feb 3), Hinamatsuri (Mar 3),
  Tanabata (Jul 7) — seasonal observances, not universal commercial anchors.

## Verification sources

- Cabinet Office public-holiday calendar — the check source for public holidays.
- Retailer official announcements — the only source for announced dates.
- The tables above are a starting checklist, NOT a source of truth. Verify every
  date for the target year before output.
