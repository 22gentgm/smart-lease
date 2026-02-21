from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "True_Fruits_Case_Study_FINAL.pdf")

BLACK = black
GRAY = HexColor("#666666")
LIGHT_GRAY = HexColor("#cccccc")
BLUE = HexColor("#4472C4")
LIGHT_BLUE = HexColor("#D6E4F0")

FONT = "Times-Roman"
FONT_B = "Times-Bold"
FONT_I = "Times-Italic"

title_style = ParagraphStyle("Title", fontSize=16, fontName=FONT_B,
    alignment=TA_CENTER, spaceAfter=4, textColor=BLACK)
subtitle_style = ParagraphStyle("Sub", fontSize=12, fontName=FONT,
    alignment=TA_CENTER, spaceAfter=20, textColor=GRAY)
h1 = ParagraphStyle("H1", fontSize=13, fontName=FONT_B, spaceBefore=14,
    spaceAfter=6, textColor=BLACK, underline=True)
h2 = ParagraphStyle("H2", fontSize=11, fontName=FONT_B, spaceBefore=10,
    spaceAfter=4, textColor=BLACK)
body = ParagraphStyle("Body", fontSize=11, fontName=FONT, leading=16,
    spaceAfter=6, textColor=BLACK)
bullet_style = ParagraphStyle("Bullet", fontSize=11, fontName=FONT,
    leading=15, spaceAfter=4, leftIndent=20, bulletIndent=8, textColor=BLACK)

slide_title = ParagraphStyle("SlTitle", fontSize=16, fontName=FONT_B,
    spaceAfter=8, textColor=BLUE, alignment=TA_LEFT)
slide_body = ParagraphStyle("SlBody", fontSize=10, fontName=FONT,
    leading=14, spaceAfter=4, textColor=BLACK)
slide_bullet = ParagraphStyle("SlBullet", fontSize=10, fontName=FONT,
    leading=13, spaceAfter=3, leftIndent=16, bulletIndent=6, textColor=BLACK)
slide_h2 = ParagraphStyle("SlH2", fontSize=11, fontName=FONT_B,
    spaceBefore=6, spaceAfter=3, textColor=BLACK)

def p(text, s=body):
    return Paragraph(text, s)

def b(text):
    return Paragraph(f"<bullet>&bull;</bullet>{text}", bullet_style)

def sb(text):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", slide_bullet)

def simple_table(data, widths=None, header_bg=LIGHT_BLUE):
    t = Table(data, colWidths=widths, hAlign="LEFT")
    cmds = [
        ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("FONTNAME", (0, 0), (-1, 0), FONT_B),
    ]
    t.setStyle(TableStyle(cmds))
    return t


def build_writeup(story):
    story.append(p("True Fruits: International Expansion", title_style))
    story.append(p("Case Study Analysis", subtitle_style))

    # Q1
    story.append(p("<u>Q1: How Attractive Is the Smoothie Industry & How Is True Fruits Positioned?</u>", h1))

    story.append(p("<b>Porter's Five Forces</b>", h2))
    story.append(p(
        "I would say the smoothie industry is moderately attractive. The market is worth about "
        "$17.8 billion globally and growing around 10% a year, so there is definitely money to be made. "
        "But when you actually look at each of Porter's forces, it gets more complicated."
    ))
    story.append(b("<b>New Entrants (Moderate):</b> Making smoothies is not that hard, but getting into stores and setting up refrigerated shipping is expensive. That keeps a lot of smaller players out."))
    story.append(b("<b>Supplier Power (Moderate-High):</b> Fresh fruit prices go up and down a lot depending on weather and seasons. True Fruits can not just swap in cheap fillers because they promise no additives."))
    story.append(b("<b>Buyer Power (High):</b> Big grocery stores basically decide what goes on shelves. Consumers can also just grab a different brand without thinking twice."))
    story.append(b("<b>Substitutes (High):</b> There are tons of alternatives. Juice, kombucha, protein shakes, energy drinks, or just eating fruit."))
    story.append(b("<b>Rivalry (High):</b> Innocent has Coca-Cola behind them. PepsiCo has Naked. Danone and Nestle are in the space too."))

    story.append(Spacer(1, 6))
    story.append(p("<b>SWOT</b>", h2))
    swot = [
        ["Strengths", "Weaknesses"],
        ["- 70%+ market share in Germany\n- Premium glass bottles, all natural\n- Strong brand identity\n- Eckes-Granini owns 67%\n- 70M euros in revenue (2023)",
         "- Only 35 employees\n- Outsources all manufacturing\n- Controversial marketing history\n- Not much international experience\n- Glass is expensive to ship"],
        ["Opportunities", "Threats"],
        ["- EU smoothie market growing 4.4%/yr\n- Health trend keeps getting bigger\n- Lots of countries they haven't entered\n- E-commerce as a new channel",
         "- Innocent backed by Coca-Cola\n- Fruit prices are unpredictable\n- Their edgy ads could backfire abroad\n- Inflation hurting premium products"],
    ]
    t = Table(swot, colWidths=[3.1*inch, 3.1*inch])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
        ("FONTNAME", (0, 0), (-1, 0), FONT_B), ("FONTNAME", (0, 2), (-1, 2), FONT_B),
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
        ("BACKGROUND", (0, 2), (-1, 2), LIGHT_BLUE),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

    # Q2
    story.append(p("<u>Q2: How Did Bilzerian Get From 192 to 32 Countries?</u>", h1))
    story.append(p(
        "He basically used a funnel. Started with every country in the world and kept cutting based "
        "on whether it actually made sense for True Fruits to go there."
    ))
    story.append(b("<b>Round 1 (192 to around 80):</b> Cut countries where people can not afford a $2.50 glass bottle smoothie. Set a minimum GDP per capita. Also removed really small countries and unstable ones."))
    story.append(b("<b>Round 2 (80 to around 50):</b> Cut countries without cold-chain logistics, since smoothies go bad without refrigeration. Also removed places without real supermarkets or with really high tariffs."))
    story.append(b("<b>Round 3 (50 to 32):</b> Narrowed it down based on how close they are to Germany, whether people there are into health food, and if Eckes-Granini already has connections in that market."))
    story.append(Spacer(1, 4))
    story.append(p(
        "I think GDP per capita and cold-chain infrastructure were probably the two biggest deal breakers. "
        "You just can not sell an expensive smoothie where people can not pay for it, and you can not ship "
        "it somewhere it will spoil. Some other variables I think would have been useful: how much fruit "
        "people in that country already consume, how big social media is there (since True Fruits relies "
        "on viral marketing), and whether the country has glass recycling infrastructure since their "
        "bottles are a big part of the brand."
    ))

    # Q3
    story.append(p("<u>Q3: Top Three Countries</u>", h1))
    story.append(p(
        "I made a scoring model with 10 criteria to try to rank the countries objectively. Each country "
        "gets a 1 to 5 on each factor, multiplied by the weight, then I added them up. I left out "
        "Germany, Austria, Switzerland, Luxembourg, France, and Spain since True Fruits is already there."
    ))
    story.append(Spacer(1, 4))

    hdr = ["Country", "GDP\n15%", "Pop\n10%", "Mkt\n15%", "Prox\n10%", "Cold\n10%",
           "Retail\n10%", "Health\n10%", "Comp\n5%", "Ease\n10%", "Cult\n5%", "Score"]
    rows = [hdr,
        ["Netherlands","5","3","4","5","5","5","5","3","5","5","4.50"],
        ["UK","4","5","5","3","5","5","5","2","4","4","4.30"],
        ["Denmark","5","2","3","4","5","5","5","4","5","5","4.20"],
        ["Sweden","4","3","3","3","5","5","5","4","5","4","4.05"],
        ["Belgium","4","2","3","5","5","5","4","3","5","4","3.95"],
        ["Norway","5","2","3","3","5","5","5","4","4","4","3.95"],
        ["Italy","3","5","4","4","4","4","4","3","3","3","3.70"],
        ["Canada","4","4","3","1","5","5","5","3","5","3","3.70"],
        ["Poland","2","4","3","4","3","4","3","4","4","3","3.30"],
        ["Japan","3","5","3","1","5","5","4","3","3","2","3.30"],
    ]
    cw = [0.95*inch] + [0.47*inch]*10 + [0.52*inch]
    story.append(simple_table(rows, widths=cw))
    story.append(Spacer(1, 6))
    story.append(p(
        "<b>Formula:</b> Score = (GDP x .15) + (Pop x .10) + (Mkt x .15) + (Prox x .10) + "
        "(Cold x .10) + (Retail x .10) + (Health x .10) + (Comp x .05) + (Ease x .10) + (Culture x .05)"
    ))
    story.append(Spacer(1, 4))
    story.append(p(
        "<b>1. Netherlands (4.50)</b> - Right next to Germany so shipping is cheap. GDP per capita "
        "is $73K. Has great grocery chains like Albert Heijn. Eckes-Granini already has distribution "
        "there which is a huge advantage. EU member so no tariffs."
    ))
    story.append(p(
        "<b>2. United Kingdom (4.30)</b> - Biggest smoothie market in Europe at 18.6% of the "
        "continent. 67 million people. Innocent is the main competitor but True Fruits has a "
        "totally different vibe. Downside is Brexit makes trade more complicated."
    ))
    story.append(p(
        "<b>3. Denmark (4.20)</b> - GDP per capita of $76K which is one of the highest in Europe. "
        "Danes really care about organic and natural food which fits True Fruits well. Also a good "
        "stepping stone into the rest of Scandinavia. EU member so zero trade barriers."
    ))

    # Q4
    story.append(p("<u>Q4: Is Exporting the Best Mode of Entry?</u>", h1))
    story.append(p(
        "Exporting makes sense for right now since True Fruits is so small. But it is not the only "
        "option. Here are the main modes of entry and how they fit:"
    ))

    moe = [
        ["Mode", "What It Is", "Pros", "Cons", "True Fruits Fit"],
        ["Exporting", "Make in Germany,\nship abroad", "Low cost and risk,\neasy to pull out", "Glass is heavy/costly\nto ship, spoilage risk", "Good for now"],
        ["Licensing", "Local company\nmakes your product", "Almost zero\ninvestment needed", "Lose quality control\nwhich is their whole brand", "Bad fit"],
        ["Franchising", "Partner runs your\nbusiness system", "Fast growth,\nlocal knowledge", "This is for restaurants\nnot bottled products", "Does not\napply"],
        ["Joint Venture", "Partner with a\nlocal company", "Shared risk and\nlocal expertise", "Share profits,\npossible conflicts", "Could work for\nfarther markets"],
        ["FDI", "Build or buy\noperations abroad", "Total control\nover everything", "Way too expensive\nfor 35 people", "Too early"],
    ]
    story.append(simple_table(moe, widths=[0.8*inch, 1.05*inch, 1.1*inch, 1.2*inch, 1.15*inch, 0.9*inch]))
    story.append(Spacer(1, 6))
    story.append(p(
        "The criteria you use to pick a country definitely change depending on your mode of entry. "
        "If you are exporting, proximity and cold-chain logistics matter a ton. But if you do a joint "
        "venture and produce locally, those barely matter anymore. Instead you need to care about "
        "finding the right partner and protecting your brand. My recommendation would be to start "
        "exporting to the Netherlands and Denmark since they are close, then think about a joint "
        "venture for the UK once there is proof the product sells."
    ))

    # Q5
    story.append(p("<u>Q5: Challenges They Will Face</u>", h1))
    story.append(p("<b>Internal:</b>"))
    story.append(b("35 employees is barely enough to run Germany, let alone three new countries"))
    story.append(b("Their contract manufacturer needs to be able to handle way more volume"))
    story.append(b("Their edgy marketing works in Germany but could offend people in other countries"))
    story.append(b("Shipping glass bottles internationally is expensive and they break"))
    story.append(b("All the upfront costs (listing fees, marketing, logistics) come before any revenue"))
    story.append(Spacer(1, 4))
    story.append(p("<b>External:</b>"))
    story.append(b("Getting shelf space at foreign grocery stores is super competitive"))
    story.append(b("Innocent has Coca-Cola money and will fight to keep their market share"))
    story.append(b("Brexit means extra customs paperwork and possible tariffs for the UK"))
    story.append(b("People in different countries like different flavors and portion sizes"))
    story.append(b("Currency changes between euros, pounds, and kroner can cut into profits"))

    story.append(Spacer(1, 16))

    # Sources
    story.append(p("<u>Sources</u>", h1))
    srcs = [
        "True Fruits. Wikipedia. en.wikipedia.org/wiki/True_Fruits",
        "True Fruits Case, Rotterdam School of Management (813-044-1).",
        'Duhig, A. "True Fruits Potential Viability in the Paraguay Market." Medium.',
        'Fortune Business Insights. "Smoothie Market Size and Analysis, 2026-2034."',
        'Market Data Forecast. "Europe Smoothies Market Report, 2034."',
        'IMARC Group. "Europe Smoothies Market, 2025-2033."',
        'Worldometer. "GDP per Capita, 2025."',
        'Eurostat. "Population and Population Change Statistics, 2025."',
        'Mainsights.io. "Eckes-Granini Acquires Majority Stake in True Fruits."',
        'World Bank. "B-READY 2025 Business Environment Assessment."',
        'MBA Knowledge Base. "Modes of Entry into International Business."',
    ]
    for i, s in enumerate(srcs, 1):
        story.append(p(f"{i}. {s}"))

    story.append(PageBreak())


def make_slide(story, title, content_fn):
    inner = []
    inner.append(Paragraph(title, slide_title))
    inner.append(Spacer(1, 4))
    content_fn(inner)

    slide = Table([[inner]], colWidths=[6.3*inch], rowHeights=[3.5*inch])
    slide.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("BOX", (0, 0), (-1, -1), 1, LIGHT_GRAY),
        ("LINEBELOW", (0, 0), (-1, 0), 0, white),
    ]))
    story.append(slide)
    story.append(Spacer(1, 12))


def build_slides(story):

    def s1(inner):
        inner.append(Spacer(1, 50))
        inner.append(Paragraph("Where Should They Expand Next?", ParagraphStyle(
            "x", fontSize=13, fontName=FONT_I, alignment=TA_CENTER, textColor=GRAY, spaceAfter=20)))
        inner.append(Paragraph("Case Study Analysis", ParagraphStyle(
            "x2", fontSize=11, fontName=FONT, alignment=TA_CENTER, textColor=GRAY)))
    make_slide(story, "True Fruits: International Expansion", s1)

    def s2(inner):
        inner.append(Paragraph("Global smoothie market: $17.8B, growing about 10%/year", slide_body))
        inner.append(Spacer(1, 4))
        d = [["Force", "Rating", "Why"],
             ["New Entrants", "Moderate", "Cold-chain and shelf space are barriers"],
             ["Supplier Power", "Mod-High", "Fruit prices jump around"],
             ["Buyer Power", "High", "Retailers control shelf space"],
             ["Substitutes", "High", "Juice, kombucha, protein shakes, etc."],
             ["Rivalry", "High", "Innocent/Coca-Cola, PepsiCo, Danone"]]
        t = Table(d, colWidths=[1.1*inch, 0.85*inch, 3.0*inch])
        t.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
            ("FONTNAME", (0, 0), (-1, 0), FONT_B),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ]))
        inner.append(t)
        inner.append(Spacer(1, 4))
        inner.append(Paragraph("Overall: moderately attractive industry", slide_body))
    make_slide(story, "Porter's Five Forces", s2)

    def s3(inner):
        d = [["Strengths", "Weaknesses"],
             ["- 70%+ German market share\n- All-natural, glass bottles\n- Bold brand\n- Eckes-Granini backing",
              "- 35 employees\n- Outsourced production\n- Controversial marketing\n- Limited intl experience"],
             ["Opportunities", "Threats"],
             ["- EU market growing 4.4%/yr\n- Health trend keeps building\n- Untapped markets nearby",
              "- Innocent has Coca-Cola\n- Fruit price swings\n- Ads could backfire abroad"]]
        t = Table(d, colWidths=[2.8*inch, 2.8*inch])
        t.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("FONTNAME", (0, 0), (-1, 0), FONT_B), ("FONTNAME", (0, 2), (-1, 2), FONT_B),
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
            ("BACKGROUND", (0, 2), (-1, 2), LIGHT_BLUE),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 5), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        inner.append(t)
    make_slide(story, "SWOT Analysis", s3)

    def s4(inner):
        inner.append(sb("<b>Round 1 (192 to ~80):</b> GDP per capita, population, political stability"))
        inner.append(sb("<b>Round 2 (~80 to ~50):</b> Cold-chain logistics, modern retail, tariffs"))
        inner.append(sb("<b>Round 3 (~50 to 32):</b> Proximity, health trends, Eckes-Granini network"))
        inner.append(Spacer(1, 8))
        inner.append(Paragraph("<b>Most important filters:</b>", slide_body))
        inner.append(sb("GDP per capita - premium product needs people who can pay"))
        inner.append(sb("Cold-chain infrastructure - smoothies spoil without refrigeration"))
        inner.append(sb("Proximity to Germany - keeps shipping costs and spoilage down"))
    make_slide(story, "Market Screening: 192 to 32", s4)

    def s5(inner):
        inner.append(Paragraph("Weighted scoring model with 10 criteria, each scored 1-5", slide_body))
        inner.append(Spacer(1, 4))
        d = [["Rank", "Country", "Score", "Why"],
             ["1", "Netherlands", "4.50", "Next to Germany, high GDP, Eckes-Granini network"],
             ["2", "UK", "4.30", "Biggest smoothie market in Europe"],
             ["3", "Denmark", "4.20", "Rich consumers, health-obsessed, EU member"],
             ["4", "Sweden", "4.05", "Health-conscious, great infrastructure"],
             ["5", "Belgium", "3.95", "Right next door, EU single market"]]
        t = Table(d, colWidths=[0.5*inch, 1.1*inch, 0.6*inch, 3.0*inch])
        t.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
            ("FONTNAME", (0, 0), (-1, 0), FONT_B),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ]))
        inner.append(t)
    make_slide(story, "Top Country Rankings", s5)

    def s6(inner):
        inner.append(Paragraph("<b>Netherlands</b>", slide_body))
        inner.append(sb("GDP/cap: $73K | 17.8M people | Borders Germany"))
        inner.append(sb("Eckes-Granini already distributes there | No tariffs"))
        inner.append(Spacer(1, 3))
        inner.append(Paragraph("<b>United Kingdom</b>", slide_body))
        inner.append(sb("Biggest smoothie market in Europe | 67M people"))
        inner.append(sb("Innocent is the main competitor | Brexit adds trade friction"))
        inner.append(Spacer(1, 3))
        inner.append(Paragraph("<b>Denmark</b>", slide_body))
        inner.append(sb("GDP/cap: $76K | Strong organic food culture"))
        inner.append(sb("Gateway to rest of Scandinavia | EU member"))
    make_slide(story, "Why These Three Countries?", s6)

    def s7(inner):
        d = [["Mode", "Risk", "Cost", "Control", "Fit for True Fruits"],
             ["Exporting", "Low", "Low", "Low", "Good for now"],
             ["Licensing", "Low", "Low", "Low", "Bad - quality risk"],
             ["Franchising", "Med", "Low", "Med", "Does not apply"],
             ["Joint Venture", "Med", "Med", "Shared", "Good for far markets"],
             ["FDI", "High", "High", "Full", "Too early"]]
        t = Table(d, colWidths=[1.0*inch, 0.55*inch, 0.55*inch, 0.65*inch, 1.5*inch])
        t.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
            ("FONTNAME", (0, 0), (-1, 0), FONT_B),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ]))
        inner.append(t)
        inner.append(Spacer(1, 6))
        inner.append(sb("Start with exporting to Netherlands and Denmark"))
        inner.append(sb("Consider a joint venture for the UK once demand is proven"))
    make_slide(story, "Modes of Entry", s7)

    def s8(inner):
        inner.append(Paragraph("<b>Internal</b>", slide_body))
        inner.append(sb("Need to hire - 35 people is not enough"))
        inner.append(sb("Manufacturer has to scale up production"))
        inner.append(sb("Marketing needs to be toned down for new cultures"))
        inner.append(sb("Glass bottles are heavy and fragile to ship"))
        inner.append(Spacer(1, 4))
        inner.append(Paragraph("<b>External</b>", slide_body))
        inner.append(sb("Getting shelf space is really competitive"))
        inner.append(sb("Innocent/Coca-Cola will push back hard"))
        inner.append(sb("Brexit complicates UK trade"))
        inner.append(sb("Different countries have different taste preferences"))
        inner.append(Spacer(1, 4))
        inner.append(Paragraph("<b>Plan:</b> Go Netherlands first, then UK, then Denmark", slide_body))
    make_slide(story, "Challenges and Recommendations", s8)


def build():
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=letter,
        leftMargin=1*inch, rightMargin=1*inch,
        topMargin=1*inch, bottomMargin=1*inch,
    )
    story = []
    build_writeup(story)

    story.append(p("Slides", title_style))
    story.append(Spacer(1, 8))
    build_slides(story)

    doc.build(story)
    print(f"Done: {OUTPUT_PATH}")

if __name__ == "__main__":
    build()
