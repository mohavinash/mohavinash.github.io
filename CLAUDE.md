# DataChutney — Site Documentation

## What This Is

DataChutney (datachutney.io) is a static site hosted on GitHub Pages at `mohavinash/mohavinash.github.io`. It publishes interactive, data-driven stories built with AI and open-source intelligence.

Custom domain: `datachutney.io` (CNAME → mohavinash.github.io)

## Repository Structure

```
mohavinash.github.io/
├── CNAME                              # Custom domain: datachutney.io
├── index.html                         # Homepage — story index
├── sitemap.xml                        # All 4 URLs, submit to Google Search Console
├── robots.txt                         # Allow all crawlers, points to sitemap
├── war-chronicle/
│   ├── index.html                     # Main chronicle page (all content, CSS, JS)
│   ├── hormuz-map.html                # Hormuz before/after Mapbox GL map (iframe)
│   ├── strikes-map.html               # Interactive strikes map, 74 incidents (iframe)
│   ├── impact-map.html                # Global impact map, 39 countries (iframe)
│   └── data-country-impact.md         # Source document for impact map tiers
├── cognitive-surrender-explainer/
│   ├── index.html                     # Tri-System Theory explainer
│   ├── data/                          # Chart and CRT experiment data
│   ├── og-image.png                   # Social sharing image
│   └── favicon.svg, favicon-32.png, apple-touch-icon.png
└── delhi-excise-case-explainer/
    ├── index.html                     # Delhi Excise Policy case explainer
    ├── cover.jpg                      # Social sharing image
    └── *.png                          # Explainer screenshots
```

## Publishing Workflow

### War Chronicle

The war chronicle source lives in the theatrelabs monorepo. Publishing is a manual copy:

```bash
# 1. Edit in theatrelabs
cd /Users/avinash/AICodeLab/theatrelabs/apps/war-chronicle/

# 2. Copy all HTML files to the published site
cp index.html hormuz-map.html strikes-map.html impact-map.html \
   /Users/avinash/AICodeLab/mohavinash.github.io/war-chronicle/

# 3. Commit and push
cd /Users/avinash/AICodeLab/mohavinash.github.io
git add war-chronicle/
git commit -m "update war chronicle"
git push origin main
```

GitHub Pages deploys automatically on push. Changes are live within 1-2 minutes.

### Other Stories

The cognitive surrender and delhi excise explainers live directly in this repo (no separate source). Edit in place.

## War Chronicle Architecture

### Single-page HTML with embedded charts

`war-chronicle/index.html` contains everything: HTML content, CSS, and JavaScript for the oil price chart (SVG) and displacement chart (SVG). The three maps are separate HTML files loaded via iframes.

### Maps (Mapbox GL)

All maps use the same Mapbox access token (public, `pk.eyJ1...`). The token is client-side by design and has been allowed through GitHub's secret scanning.

- **hormuz-map.html** — Side-by-side before/after of Strait traffic. Ship positions are procedurally generated with a seeded RNG. Mine positions are hardcoded.
- **strikes-map.html** — Interactive (zoomable, pannable). Strike data is a JS array of objects with lat/lng/type/attacker/description. Major incidents get text labels with per-marker offset overrides to prevent overlap.
- **impact-map.html** — Three-tier country fills using Mapbox country-boundaries-v1 vector tiles. Tier classification sourced from `data-country-impact.md`.

### Data sources embedded in the page

- **Oil prices**: Yahoo Finance API (BZ=F), hardcoded daily close array
- **Displacement**: UNHCR estimates, hardcoded data array
- **Strikes**: OSINT analysis, hardcoded JS array (74 incidents)
- **Hormuz traffic**: IMF PortWatch + Windward Maritime Intelligence
- **Country impact**: Situation briefings from theatrelabs BN engine

### Updating for new days of war

When adding a new day:

1. **Add day section** — copy an existing `<div class="day" data-day="N">` block, update content
2. **Update hero** — change day count, date range in `hero-daterange`
3. **Update Phase IV dates** — extend the date range
4. **Oil chart** — add entry to the `data` array in the oil chart script
5. **Displacement chart** — add entry to the `data` array, update label offsets if needed
6. **Strikes map** — add incidents to the `STRIKES` array in `strikes-map.html`, add label overrides for major markers
7. **Update closing** — change "After N days" text, update stats
8. **Update meta** — description, JSON-LD dates, colophon date
9. **Copy and push** — follow the publishing workflow above

### Navigation

A sticky timeline nav on the right side is auto-generated from `data-day` attributes. Adding a new day section automatically adds a dot to the nav. Active day highlights on scroll.

## SEO & Indexing

### Google Search Console

- **Verification**: DNS TXT record on datachutney.io
- **Verification meta tag**: `oeEvB4hLQBeqZbkOSB4GOCf_H9AUBiQKHC-dlHLYaaA` (on all pages)
- **Sitemap**: submitted at `datachutney.io/sitemap.xml`

### Structured Data

All pages have JSON-LD:
- **Homepage**: WebSite schema (implicit)
- **War chronicle**: Article schema with phases as hasPart, Place entity for Hormuz
- **Cognitive surrender**: Article schema with ScholarlyArticle isBasedOn
- **Delhi excise**: Article schema with legal keywords

### Social Sharing

All story pages have Open Graph and Twitter Card meta tags. War chronicle and cognitive surrender have `summary_large_image` Twitter cards.

## Relationship to Theatre Labs

The theatrelabs monorepo (`/Users/avinash/AICodeLab/theatrelabs/`) contains:
- **BN engine** (`packages/bn-engine/`) — Rust Bayesian network for geopolitical forecasting
- **API** (`apps/api/`) — FastAPI endpoints for the BN model
- **Situation briefings** (`packages/bn-engine/data/`) — Daily OSINT briefs, the source material for the war chronicle
- **War chronicle source** (`apps/war-chronicle/`) — the working copy that gets published to datachutney

The war chronicle is "one output of a larger analytical project" — the BN model. The model is not public yet.

## Style Guide

- **Font stack**: Courier Prime (body), Special Elite (display/headlines), DM Serif Display (numbers/stats)
- **Colors**: `#FAF8F3` (bg), `#1a1a1a` (text), `#8b2020` (red/crisis), `#b8860b` (amber/economic), `#1a2744` (blue/coalition)
- **Tone**: Factual, thriller-paced narrative. No editorialising. No sided language ("coalition" is acceptable for US+Israel; never "enemy" or "ally" without context). Em-dashes used sparingly. Short punchy sentences mixed with longer ones.
- **Data panels**: Each visual/panel extends the story, never repeats what's already been said in text
- **Quotes**: Pulled out as standalone callouts between day sections. Only direct quotes from named individuals.

## Maintenance

### Updating the sitemap

When adding new stories, add a `<url>` entry to `sitemap.xml` and resubmit in Google Search Console.

### Mapbox token

The token `pk.eyJ1IjoibW9oYXZpbmFzaCIs...` is a public access token tied to the `mohavinash` Mapbox account. If it expires or gets rotated, update it in `hormuz-map.html`, `strikes-map.html`, and `impact-map.html`.

### Country impact updates

Edit `data-country-impact.md` first (the source of truth), then update the `ATTACKED` and `SQUEEZED` arrays in `impact-map.html` to match.
