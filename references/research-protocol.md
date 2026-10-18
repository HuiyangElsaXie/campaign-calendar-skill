# Research Protocol — How the AI Fills Date Gaps

The skill does not store every answer. It stores WHAT to research, HOW to research,
and HOW MUCH to trust what comes back. Research happens in Stage 1, before the
recommendation report. Research fills DATE gaps only — never the user's business
facts (what they sell, who they sell to, when customers buy/use).

## Inclusion criterion

A date belongs in a universal layer if shops / brands in that country run
campaigns for it — NOT only if it is a statutory holiday. Adopted / commercial
dates (e.g. Valentine's Day and Christmas in China, Halloween in all six shipped
countries) belong in the layer, marked commercial (not a public holiday).

## When to research (triggers)

- Niche country (no shipped universal layer) → research and build its universal layer.
- Audience cultural dates not in any shipped layer → research those dates.
- Announced dates (Prime Day, retailer-set promos) → check official announcements.
- Any date the AI proposes from general knowledge → verify before presenting as confirmed.

## Source hierarchy

1. Government-published holiday lists (authoritative for public holidays).
2. Official announcements (retailer / brand official pages; federation /
   organizing-committee announcements for mega-events).
3. Reputable reference sources (e.g. Wikipedia, major news) — lunar / variable dates
   need TWO independent sources that agree.
4. City event calendars, BIA listings, community-association announcements
   (local community events).
- NEVER use: content farms, AI-generated listicles, social media posts, undated
  pages, last year's date as this year's date.

## Procedure

1. Search with year-specific queries (e.g. "Canada statutory holidays 2027",
   not a generic search).
2. Open the source page and read it — never trust a search snippet alone.
3. Lunar / variable dates: two independent sources must agree.
4. Conflicting sources → flag the conflict, present both, ask the user.
5. Nothing reliable found → mark UNVERIFIED, ask the user.
6. Record the source + confidence tag for every researched date.

## Confidence tags (shown in the Stage 1 report)

- **base-verified** — from a shipped universal layer.
- **government-sourced** — researched, government source.
- **official-announcement** — researched, official announcement.
- **unverified** — could not be verified. The user must confirm it before it can
  become an anchor.

## Red lines

- User-provided dates are authoritative — never "verify" the user's own dates.
- Business facts (product, audience, season) are the user's — research only fills
  DATE gaps; it does not "check" the user's business.
- A researched date is never presented as confirmed without a source.
- A niche-country layer built by research is shown to the user for confirmation
  before use, and labelled "research-built, please confirm".

## Tool-agnostic

Use the agent's available web-search tools. The protocol does not assume a
specific tool, browser, or runtime. If the agent has no web access, skip research,
mark the gaps UNVERIFIED, and ask the user to supply the dates.
