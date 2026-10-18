#!/usr/bin/env python3
"""Generate the visual PDF version of the 2027 annual campaign plan sample.

Builds styled HTML (Gantt timeline + 12-month calendar + index + per-campaign
details + caveats) and renders it to PDF with WeasyPrint.

Run: /tmp/weasyvenv/bin/python generate_annual_pdf.py
  (or: python3 generate_annual_pdf.py if weasyprint is installed)
Output: sample-annual-plan-report.pdf (same directory)
"""
import calendar
from datetime import date
from pathlib import Path

HERE = Path(__file__).parent
HTML_PATH = Path("/tmp/annual-plan-report.html")
PDF_PATH = HERE / "sample-annual-plan-report.pdf"

Y = 2027
DAYS = 365  # 2027 is not a leap year


def D(m, d):
    return date(Y, m, d)


CAMPAIGNS = [
    {
        "name": "Valentine's Gift Set",
        "color": "#E75480",
        "light": "#FCE7EF",
        "idea": "Gift-ready tea sets for couples",
        "anchor": "Valentine's Day — Feb 14",
        "planning_deadline": D(1, 15),
        "production_start": D(1, 22),
        "production_deadline": D(2, 5),
        "warmup_start": D(2, 7),
        "promo_start": D(2, 14),
        "promo_end": D(2, 20),
        "materials": "8 visual pieces (2 website banners + 2 store posters + 4 social posters) · 5 copy pieces (1 core + 4 channel adaptations) · Copy matrix needed",
        "offline": "None — no offline presence",
        "budget": "TBC — no unit costs provided",
    },
    {
        "name": "Mother's Day Gift",
        "color": "#8E44AD",
        "light": "#F0E6F6",
        "idea": "Premium gift sets for Mom, with a handwritten card",
        "anchor": "Mother's Day — May 9",
        "planning_deadline": D(4, 9),
        "production_start": D(4, 16),
        "production_deadline": D(4, 30),
        "warmup_start": D(5, 2),
        "promo_start": D(5, 9),
        "promo_end": D(5, 15),
        "materials": "8 visual pieces (2 website banners + 2 store posters + 4 social posters) · 5 copy pieces (1 core + 4 channel adaptations) · Copy matrix needed",
        "offline": "None — no offline presence",
        "budget": "TBC — no unit costs provided",
    },
    {
        "name": "Canada Day Summer Bundle",
        "color": "#D90429",
        "light": "#FDE8EA",
        "idea": "Summer iced-tea bundle + in-store tasting",
        "anchor": "Canada Day — Jul 1",
        "planning_deadline": D(6, 1),
        "production_start": D(6, 8),
        "production_deadline": D(6, 22),
        "warmup_start": D(6, 24),
        "promo_start": D(7, 1),
        "promo_end": D(7, 4),
        "materials": "8 visual pieces (2 website banners + 2 store posters + 4 social posters) · 5 copy pieces (1 core + 4 channel adaptations) · Copy matrix needed",
        "offline": "Roll-up banner × 1 · Samples × TBC (foot traffic unknown) · Staff talking points × 1",
        "budget": "TBC — no unit costs provided",
    },
    {
        "name": "Holiday Season Sale",
        "color": "#1B7A43",
        "light": "#E3F2E8",
        "idea": "Holiday gifting sale, Black Friday through Christmas Eve",
        "anchor": "Black Friday — Nov 26",
        "planning_deadline": D(10, 27),
        "production_start": D(11, 3),
        "production_deadline": D(11, 17),
        "warmup_start": D(11, 19),
        "promo_start": D(11, 26),
        "promo_end": D(12, 24),
        "materials": "8 visual pieces (2 website banners + 2 store posters + 4 social posters) · 5 copy pieces (1 core + 4 channel adaptations) · Copy matrix needed",
        "offline": "None — no offline presence",
        "budget": "TBC — no unit costs provided",
    },
]

PHASES = [
    ("planning", "#93C5FD", "Planning"),
    ("production", "#FBBF24", "Production"),
    ("warmup", "#6EE7B7", "Warm-up"),
]

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
MONTH_START_DOY = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]


def pct(day):
    """Left % of a day on the year axis."""
    return (day.timetuple().tm_yday - 1) / DAYS * 100


def width(d1, d2):
    """Width % of an inclusive date range."""
    return (d2.timetuple().tm_yday - d1.timetuple().tm_yday + 1) / DAYS * 100


def fmt(d):
    return d.strftime("%b %-d")


def build_gantt():
    gridlines = "".join(
        f'<div class="gridline" style="left:{(doy - 1) / DAYS * 100:.2f}%"></div>'
        for doy in MONTH_START_DOY
    )
    month_labels = "".join(
        f'<div class="month-label" style="left:{(doy - 1) / DAYS * 100:.2f}%">{name[:3]}</div>'
        for doy, name in zip(MONTH_START_DOY, MONTHS)
    )
    rows = []
    for c in CAMPAIGNS:
        segs = [
            ("planning", c["planning_deadline"], c["production_start"], "#93C5FD"),
            ("production", c["production_start"], c["production_deadline"], "#FBBF24"),
            ("warmup", c["warmup_start"], c["promo_start"], "#6EE7B7"),
            ("promo", c["promo_start"], c["promo_end"], c["color"]),
        ]
        seg_html = "".join(
            f'<div class="seg" title="{label}: {fmt(a)} – {fmt(b)}" '
            f'style="left:{pct(a):.2f}%;width:{width(a, b):.2f}%;background:{color}"></div>'
            for label, a, b, color in segs
        )
        rows.append(
            f'<div class="gantt-row"><div class="gantt-label">'
            f'<span class="dot" style="background:{c["color"]}"></span>'
            f'<strong>{c["name"]}</strong><br><span class="gantt-dates">'
            f'Promo: {fmt(c["promo_start"])} – {fmt(c["promo_end"])}</span></div>'
            f'<div class="gantt-bar">{seg_html}</div></div>'
        )
    legend = "".join(
        f'<span class="legend-item"><span class="swatch" style="background:{color}"></span>{label}</span>'
        for _, color, label in PHASES
    )
    legend += '<span class="legend-item"><span class="swatch" style="background:#555"></span>Promo (campaign colour)</span>'
    return (
        f'<div class="gantt"><div class="gantt-months">{month_labels}</div>'
        f'<div class="gantt-body">{gridlines}{"".join(rows)}</div>'
        f'<div class="legend">{legend}</div></div>'
    )


def build_calendar():
    cal = calendar.Calendar(firstweekday=6)  # Sunday start
    months_html = []
    for m in range(1, 13):
        cells = []
        for week in cal.monthdayscalendar(Y, m):
            for d in week:
                if d == 0:
                    cells.append('<div class="day empty"></div>')
                    continue
                day = date(Y, m, d)
                bg = ""
                color = ""
                border = ""
                circle = ""
                for c in CAMPAIGNS:
                    if c["promo_start"] <= day <= c["promo_end"]:
                        bg = c["color"]
                        color = "#fff"
                    elif c["warmup_start"] <= day < c["promo_start"]:
                        bg = c["light"]
                    if day == c["planning_deadline"]:
                        # Hollow thick-bordered square in the campaign colour:
                        # the day cell itself gets the thick border.
                        border = c["color"]
                    if day == c["production_start"]:
                        # Solid circle in the campaign colour (glyph after the number).
                        circle = c["color"]
                style = ""
                if bg:
                    style += f"background:{bg};"
                if color:
                    style += f"color:{color};"
                if border:
                    style += f"border:3px solid {border};"
                circ_html = (
                    f'<span class="circ" style="background:{circle}"></span>'
                    if circle else ""
                )
                cells.append(
                    f'<div class="day" style="{style}">{d}{circ_html}</div>'
                )
        months_html.append(
            f'<div class="month"><div class="month-title">{MONTHS[m - 1]}</div>'
            f'<div class="weekdays"><span>Su</span><span>Mo</span><span>Tu</span>'
            f'<span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>'
            f'<div class="days">{"".join(cells)}</div></div>'
        )
    return f'<div class="calendar">{"".join(months_html)}</div>'


def build_index():
    rows = "".join(
        f'<tr><td><span class="dot" style="background:{c["color"]}"></span>'
        f'<strong>{c["name"]}</strong></td><td>{c["anchor"]}</td>'
        f'<td>{fmt(c["warmup_start"])}</td>'
        f'<td>{fmt(c["promo_start"])} – {fmt(c["promo_end"])}</td>'
        f'<td>{c["idea"]}</td></tr>'
        for c in CAMPAIGNS
    )
    return (
        '<table class="index"><thead><tr><th>Campaign</th><th>Anchor date</th>'
        '<th>Warm-up start</th>'
        '<th>Promo date range</th><th>Simple idea</th></tr></thead>'
        f'<tbody>{rows}</tbody></table>'
        '<p class="index-note">Note: These are estimated dates. If you have specific '
        'dates, enter them to replace the estimates.</p>'
    )


def build_details():
    sections = []
    for c in CAMPAIGNS:
        sections.append(f"""
        <div class="campaign" style="border-left:6px solid {c["color"]}">
          <h3><span class="dot" style="background:{c["color"]}"></span>{c["name"]}
            <span class="tag">{fmt(c["promo_start"])} – {fmt(c["promo_end"])}</span></h3>
          <p class="idea">{c["idea"]} · Anchor: {c["anchor"]}</p>
          <table class="detail">
            <tr><th>Planning deadline</th><td>{c["planning_deadline"].strftime("%b %d")}</td></tr>
            <tr><th>Production start (critical path)</th><td>{c["production_start"].strftime("%b %d")}</td></tr>
            <tr><th>Production deadline</th><td>{c["production_deadline"].strftime("%b %d")}</td></tr>
            <tr><th>Warm-up start</th><td>{c["warmup_start"].strftime("%b %d")}</td></tr>
            <tr><th>Promo dates</th><td>{c["promo_start"].strftime("%b %d")} – {c["promo_end"].strftime("%b %d")}</td></tr>
            <tr><th>Materials</th><td>{c["materials"]}</td></tr>
            <tr><th>Offline items</th><td>{c["offline"]}</td></tr>
            <tr><th>Budget</th><td>{c["budget"]}</td></tr>
            <tr><th>Data collection</th><td>Daily log during the campaign (sales, code redemptions, QR scans, traffic, costs). Raw exports kept in one folder per campaign.</td></tr>
            <tr><th>Plan B</th><td>Pre-decided at Gate 2: rain date, price floor, code caps, dynamic QR, backup roster, holding statement.</td></tr>
          </table>
        </div>""")
    return "".join(sections)


CSS = """
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif; color: #1F2937;
  margin: 0; font-size: 10pt; line-height: 1.45;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.header { background: linear-gradient(90deg, #0F4C5C, #2A9D8F); color: #fff;
  padding: 18px 22px; border-radius: 8px; }
.header h1 { margin: 0 0 4px; font-size: 22pt; }
.header p { margin: 2px 0; font-size: 10pt; opacity: .92; }
.badge { display: inline-block; background: #FBBF24; color: #1F2937; font-weight: 700;
  font-size: 8.5pt; padding: 2px 8px; border-radius: 10px; margin-right: 6px; }
.badge.grey { background: #E5E7EB; }
h2 { font-size: 14pt; margin: 20px 0 8px; padding-bottom: 4px;
  border-bottom: 2px solid #0F4C5C; }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%;
  margin-right: 6px; vertical-align: middle; }
/* Gantt */
.gantt-months { position: relative; height: 16px; margin-left: 170px; font-size: 8pt; color: #6B7280; }
.month-label { position: absolute; top: 0; }
.gantt-body { position: relative; border-top: 1px solid #D1D5DB; }
.gridline { position: absolute; top: 0; bottom: 0; width: 1px; background: #EDEFF2; z-index: 0; }
.gantt-row { display: flex; align-items: center; position: relative; z-index: 1; padding: 5px 0; }
.gantt-label { width: 170px; flex: none; font-size: 9pt; padding-right: 8px; }
.gantt-dates { font-size: 8pt; color: #6B7280; }
.gantt-bar { position: relative; flex: 1; height: 22px; background: #F9FAFB; border-radius: 4px; }
.seg { position: absolute; top: 3px; height: 16px; border-radius: 3px; min-width: 3px; }
.legend { margin-top: 8px; font-size: 8.5pt; color: #4B5563; }
.legend-item { margin-right: 14px; }
.swatch { display: inline-block; width: 11px; height: 11px; border-radius: 3px;
  margin-right: 4px; vertical-align: middle; }
/* Calendar */
.calendar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.month { border: 1px solid #E5E7EB; border-radius: 6px; padding: 6px; }
.month-title { font-weight: 700; font-size: 9.5pt; text-align: center; margin-bottom: 4px; }
.weekdays, .days { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
.weekdays { font-size: 7.5pt; color: #9CA3AF; }
.day { font-size: 8.5pt; padding: 2px 0; border-radius: 4px; position: relative; }
.day.empty { background: none; }
.circ { display: inline-block; width: 10px; height: 10px; border-radius: 50%;
  margin-left: 2px; vertical-align: middle; }
.lsq { display: inline-block; width: 10px; height: 10px; border: 2.5px solid #555;
  margin: 0 4px 0 10px; vertical-align: middle; }
.lcirc { display: inline-block; width: 10px; height: 10px; border-radius: 50%;
  background: #555; margin: 0 4px 0 10px; vertical-align: middle; }
.cal-legend { font-size: 8.5pt; color: #4B5563; margin-top: 8px; }
.cal-legend .box { display: inline-block; width: 11px; height: 11px; border-radius: 3px;
  margin: 0 4px 0 10px; vertical-align: middle; }
/* Tables */
table.index, table.detail { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
table.index th, table.index td { border: 1px solid #D1D5DB; padding: 7px 8px; text-align: left; }
table.index th { background: #0F4C5C; color: #fff; }
table.index tbody tr:nth-child(even) { background: #F9FAFB; }
table.detail th { width: 190px; text-align: left; background: #F9FAFB;
  border: 1px solid #E5E7EB; padding: 5px 8px; font-size: 9pt; }
table.detail td { border: 1px solid #E5E7EB; padding: 5px 8px; font-size: 9pt; }
.campaign { margin: 14px 0; padding: 10px 12px 10px 16px; background: #FDFDFD;
  border-radius: 0 6px 6px 0; break-inside: avoid; }
.campaign h3 { margin: 0 0 2px; font-size: 12pt; }
.campaign .tag { font-size: 9pt; color: #6B7280; font-weight: 400; margin-left: 6px; }
.campaign .idea { margin: 0 0 8px; font-size: 9.5pt; color: #4B5563; }
.caveats { background: #FFFBEB; border: 1.5px solid #F59E0B; border-radius: 8px;
  padding: 12px 16px; break-inside: avoid; }
.caveats h2 { border: none; margin-top: 0; color: #92400E; }
.caveats li { margin-bottom: 5px; }
.index-note { font-size: 9pt; color: #4B5563; margin: 6px 0 0; }
.footnote { font-size: 8.5pt; color: #6B7280; margin-top: 14px; }
"""

HTML = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="header">
  <h1>2027 Annual Campaign Plan</h1>
  <p>Maple &amp; Main Tea Co. &nbsp;·&nbsp; Time span: Jan 1 – Dec 31, 2027 &nbsp;·&nbsp; Country: Canada</p>
  <p><span class="badge">DRAFT — awaiting Gate 2 confirmation</span>
  <span class="badge grey">SAMPLE — FICTIONAL</span></p>
</div>

<h2>1 &nbsp; Timeline — full year at a glance</h2>
{build_gantt()}
<p style="font-size:8.5pt;color:#4B5563;">Bars show planning → production → warm-up → promo.
Small gaps between production and warm-up are the 2-day buffer. Sep – Oct is an
intentional gap — no campaign, by user choice.</p>

<h2>2 &nbsp; Campaign calendar — 2027</h2>
{build_calendar()}
<div class="cal-legend"><span class="box" style="background:#E75480"></span>Valentine&rsquo;s promo
<span class="box" style="background:#8E44AD"></span>Mother&rsquo;s Day promo
<span class="box" style="background:#D90429"></span>Canada Day promo
<span class="box" style="background:#1B7A43"></span>Holiday promo
&nbsp;·&nbsp; Light tint = warm-up days &nbsp;·&nbsp; <span class="lsq"></span>planning deadline (hollow thick square, campaign colour) &nbsp;·&nbsp; <span class="lcirc"></span>production start (solid circle, campaign colour)</div>

<h2>3 &nbsp; Index — annual campaigns</h2>
{build_index()}

<h2>4 &nbsp; Campaign details</h2>
{build_details()}

<div class="caveats"><h2>⚠ &nbsp; Please read — what is incomplete / for reference only</h2>
<ul>
<li><strong>Budget: reference only.</strong> No unit costs were provided, so every budget line is TBC. Do not treat any total as an estimate — nothing here is priced by the skill.</li>
<li><strong>Sampling quantity: TBC.</strong> Foot traffic is unknown, so the Canada Day sample count cannot be calculated.</li>
<li><strong>Lead times are user-supplied, not measured.</strong> Planning 1 week, production 2 weeks, warm-up 1 week, buffer 2 days — if the real workflow is slower, every deadline moves earlier.</li>
<li><strong>Copy content is not in this report.</strong> The report counts copy pieces and flags the copy matrix; the actual copy is the campaign planner skill&rsquo;s (06) job.</li>
<li><strong>Dates verified for 2027 only.</strong> All anchor dates were checked against a published calendar for 2027. Do not reuse them for another year — last year&rsquo;s date does not prove this year&rsquo;s.</li>
<li><strong>Remembrance Day observance varies locally</strong> — confirm local observance (context date only, not a campaign).</li>
<li><strong>Sep – Oct gap is intentional</strong> (user choice), not a missing campaign.</li>
<li><strong>Status: DRAFT.</strong> This plan is unconfirmed until Gate 2. Nothing is published, scheduled, or spent.</li>
</ul></div>

<p class="footnote">Sample output of the campaign-calendar skill. Fictional brand, fictional
numbers — format demo only. Year totals: 32 visual pieces + 20 copy pieces
+ roll-up banner × 1.</p>
</body></html>"""

HTML_PATH.write_text(HTML, encoding="utf-8")
from weasyprint import HTML as WPHTML

WPHTML(string=HTML).write_pdf(str(PDF_PATH))
if not PDF_PATH.exists():
    raise SystemExit("PDF was not created")
print("PDF:", PDF_PATH, PDF_PATH.stat().st_size, "bytes")
