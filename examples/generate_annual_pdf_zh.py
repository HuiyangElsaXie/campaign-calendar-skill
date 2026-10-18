#!/usr/bin/env python3
"""Generate the CHINESE visual PDF version of the 2027 annual campaign plan sample.

Chinese twin of generate_annual_pdf.py. Same structure (Gantt timeline +
12-month calendar + index + per-campaign details + caveats), same data,
all user-visible strings in Simplified Chinese, rendered with Noto Sans CJK SC.

Run: /tmp/weasyvenv/bin/python generate_annual_pdf_zh.py
  (or: python3 generate_annual_pdf_zh.py if weasyprint is installed)
Output: sample-annual-plan-report-zh-CN.pdf (same directory)
"""
import calendar
from datetime import date
from pathlib import Path

HERE = Path(__file__).parent
HTML_PATH = Path("/tmp/annual-plan-report-zh.html")
PDF_PATH = HERE / "sample-annual-plan-report-zh-CN.pdf"

Y = 2027
DAYS = 365  # 2027 is not a leap year


def D(m, d):
    return date(Y, m, d)


CAMPAIGNS = [
    {
        "name": "情人节礼盒",
        "color": "#E75480",
        "light": "#FCE7EF",
        "idea": "送礼即取的情侣茶礼盒",
        "anchor": "情人节 — 2月14日",
        "planning_deadline": D(1, 15),
        "production_start": D(1, 22),
        "production_deadline": D(2, 5),
        "warmup_start": D(2, 7),
        "promo_start": D(2, 14),
        "promo_end": D(2, 20),
        "materials": "8 件视觉物料（2 张网站横幅 + 2 张门店海报 + 4 张社媒海报）· 5 份文案（1 条核心信息 + 4 条渠道改编版）· 需要文案矩阵",
        "offline": "无 — 无线下",
        "budget": "TBC — 未提供单价",
    },
    {
        "name": "母亲节礼物",
        "color": "#8E44AD",
        "light": "#F0E6F6",
        "idea": "给妈妈的高端礼盒，附手写卡片",
        "anchor": "母亲节 — 5月9日",
        "planning_deadline": D(4, 9),
        "production_start": D(4, 16),
        "production_deadline": D(4, 30),
        "warmup_start": D(5, 2),
        "promo_start": D(5, 9),
        "promo_end": D(5, 15),
        "materials": "8 件视觉物料（2 张网站横幅 + 2 张门店海报 + 4 张社媒海报）· 5 份文案（1 条核心信息 + 4 条渠道改编版）· 需要文案矩阵",
        "offline": "无 — 无线下",
        "budget": "TBC — 未提供单价",
    },
    {
        "name": "加拿大日夏日组合",
        "color": "#D90429",
        "light": "#FDE8EA",
        "idea": "夏日冰茶组合 + 店内试吃",
        "anchor": "加拿大日 — 7月1日",
        "planning_deadline": D(6, 1),
        "production_start": D(6, 8),
        "production_deadline": D(6, 22),
        "warmup_start": D(6, 24),
        "promo_start": D(7, 1),
        "promo_end": D(7, 4),
        "materials": "8 件视觉物料（2 张网站横幅 + 2 张门店海报 + 4 张社媒海报）· 5 份文案（1 条核心信息 + 4 条渠道改编版）· 需要文案矩阵",
        "offline": "易拉宝 × 1 · 样品 × TBC（人流未知）· 员工话术单 × 1",
        "budget": "TBC — 未提供单价",
    },
    {
        "name": "假日季大促",
        "color": "#1B7A43",
        "light": "#E3F2E8",
        "idea": "假日送礼大促，从黑五到平安夜",
        "anchor": "黑五 — 11月26日",
        "planning_deadline": D(10, 27),
        "production_start": D(11, 3),
        "production_deadline": D(11, 17),
        "warmup_start": D(11, 19),
        "promo_start": D(11, 26),
        "promo_end": D(12, 24),
        "materials": "8 件视觉物料（2 张网站横幅 + 2 张门店海报 + 4 张社媒海报）· 5 份文案（1 条核心信息 + 4 条渠道改编版）· 需要文案矩阵",
        "offline": "无 — 无线下",
        "budget": "TBC — 未提供单价",
    },
]

PHASES = [
    ("planning", "#93C5FD", "企划"),
    ("production", "#FBBF24", "制作"),
    ("warmup", "#6EE7B7", "预热"),
]

MONTHS = [f"{m}月" for m in range(1, 13)]
MONTH_START_DOY = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]


def pct(day):
    """Left % of a day on the year axis."""
    return (day.timetuple().tm_yday - 1) / DAYS * 100


def width(d1, d2):
    """Width % of an inclusive date range."""
    return (d2.timetuple().tm_yday - d1.timetuple().tm_yday + 1) / DAYS * 100


def fmt(d):
    return f"{d.month}月{d.day}日"


def build_gantt():
    gridlines = "".join(
        f'<div class="gridline" style="left:{(doy - 1) / DAYS * 100:.2f}%"></div>'
        for doy in MONTH_START_DOY
    )
    month_labels = "".join(
        f'<div class="month-label" style="left:{(doy - 1) / DAYS * 100:.2f}%">{name}</div>'
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
            f'大促：{fmt(c["promo_start"])} – {fmt(c["promo_end"])}</span></div>'
            f'<div class="gantt-bar">{seg_html}</div></div>'
        )
    legend = "".join(
        f'<span class="legend-item"><span class="swatch" style="background:{color}"></span>{label}</span>'
        for _, color, label in PHASES
    )
    legend += '<span class="legend-item"><span class="swatch" style="background:#555"></span>大促（活动色）</span>'
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
        weekdays_html = "".join(f"<span>{w}</span>" for w in WEEKDAYS)
        months_html.append(
            f'<div class="month"><div class="month-title">{MONTHS[m - 1]}</div>'
            f'<div class="weekdays">{weekdays_html}</div>'
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
        '<table class="index"><thead><tr><th>活动</th><th>锚点日期</th>'
        '<th>预热开始</th>'
        '<th>大促日期范围</th><th>一句话思路</th></tr></thead>'
        f'<tbody>{rows}</tbody></table>'
        '<p class="index-note">注：这些是预估日期。如果你有具体日期，请输入以替换预估值。</p>'
    )


def build_details():
    sections = []
    for c in CAMPAIGNS:
        sections.append(f"""
        <div class="campaign" style="border-left:6px solid {c["color"]}">
          <h3><span class="dot" style="background:{c["color"]}"></span>{c["name"]}
            <span class="tag">{fmt(c["promo_start"])} – {fmt(c["promo_end"])}</span></h3>
          <p class="idea">{c["idea"]} · 锚点：{c["anchor"]}</p>
          <table class="detail">
            <tr><th>企划截止</th><td>{fmt(c["planning_deadline"])}</td></tr>
            <tr><th>制作开始（关键路径）</th><td>{fmt(c["production_start"])}</td></tr>
            <tr><th>制作截止</th><td>{fmt(c["production_deadline"])}</td></tr>
            <tr><th>预热开始</th><td>{fmt(c["warmup_start"])}</td></tr>
            <tr><th>大促日期</th><td>{fmt(c["promo_start"])} – {fmt(c["promo_end"])}</td></tr>
            <tr><th>物料</th><td>{c["materials"]}</td></tr>
            <tr><th>线下物料</th><td>{c["offline"]}</td></tr>
            <tr><th>预算</th><td>{c["budget"]}</td></tr>
            <tr><th>数据收集</th><td>活动期间每日日志（销售、折扣码核销、二维码扫描、流量、成本）。原始导出按每个活动一个文件夹保存。</td></tr>
            <tr><th>Plan B</th><td>关口 2 时预决：雨天日期、价格底线、折扣码上限、动态二维码、替补排班、统一口径。</td></tr>
          </table>
        </div>""")
    return "".join(sections)


CSS = """
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; }
body { font-family: 'Noto Sans CJK SC', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif; color: #1F2937;
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
  <h1>2027 年度活动计划</h1>
  <p>Maple &amp; Main Tea Co. &nbsp;·&nbsp; 时间跨度：2027 年 1 月 1 日 – 12 月 31 日 &nbsp;·&nbsp; 国家：加拿大</p>
  <p><span class="badge">DRAFT — 等待关口 2 确认</span>
  <span class="badge grey">样本 — 虚构</span></p>
</div>

<h2>1 &nbsp; 时间线 — 全年一览</h2>
{build_gantt()}
<p style="font-size:8.5pt;color:#4B5563;">条形表示企划 → 制作 → 预热 → 大促。
制作与预热之间的小空隙是 2 天缓冲。9–10 月是特意留的空档——没有活动，是使用者主动选择。</p>

<h2>2 &nbsp; 活动日历 — 2027</h2>
{build_calendar()}
<div class="cal-legend"><span class="box" style="background:#E75480"></span>情人节大促
<span class="box" style="background:#8E44AD"></span>母亲节大促
<span class="box" style="background:#D90429"></span>加拿大日大促
<span class="box" style="background:#1B7A43"></span>假日季大促
&nbsp;·&nbsp; 浅色 = 预热日 &nbsp;·&nbsp; <span class="lsq"></span>企划截止（活动色空心粗边方框） &nbsp;·&nbsp; <span class="lcirc"></span>制作开始（活动色实心圆）</div>

<h2>3 &nbsp; 索引 — 年度活动</h2>
{build_index()}

<h2>4 &nbsp; 活动详情</h2>
{build_details()}

<div class="caveats"><h2>⚠ &nbsp; 请先读 — 哪些信息不全、只能参考</h2>
<ul>
<li><strong>预算：仅供参考。</strong>未提供单价，所以每个预算行都是 TBC。不要把任何总数当预估——skill 不给这里定价。</li>
<li><strong>样品数量：TBC。</strong>人流未知，所以加拿大日样品数算不出来。</li>
<li><strong>提前量是使用者给的，不是实测的。</strong>企划 1 周、制作 2 周、预热 1 周、缓冲 2 天——如果真实流程更慢，每个截止日都要往前移。</li>
<li><strong>文案内容不在这份报告里。</strong>报告只计数文案份数并标注文案矩阵；真正的文案是活动策划 skill（06）的工作。</li>
<li><strong>日期只验算了 2027 年。</strong>所有锚点日期都对 2027 年的日历核验过。不要挪到别的年份用——去年的日期不能证明今年的。</li>
<li><strong>Remembrance Day 各地 observance 不同</strong>——请确认当地情况（仅作背景日期，不是活动）。</li>
<li><strong>9–10 月空档是特意的</strong>（使用者选择），不是漏了活动。</li>
<li><strong>状态：DRAFT。</strong>关口 2 确认之前，这份计划未确认。什么都没发布、没排期、没花钱。</li>
</ul></div>

<p class="footnote">campaign-calendar skill 的样本输出。虚构品牌、虚构数字——仅用于演示格式。全年总量：32 件视觉物料 + 20 份文案 + 易拉宝 × 1。</p>
</body></html>"""

HTML_PATH.write_text(HTML, encoding="utf-8")
from weasyprint import HTML as WPHTML

WPHTML(string=HTML).write_pdf(str(PDF_PATH))
if not PDF_PATH.exists():
    raise SystemExit("PDF was not created")
print("PDF:", PDF_PATH, PDF_PATH.stat().st_size, "bytes")
