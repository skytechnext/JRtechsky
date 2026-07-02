# JR-Tech Solution — Marketing Website & Plan

Marketing website and comprehensive marketing plan for **JR-Tech Solution Sdn Bhd** — Malaysia's one-stop commercial kitchen partner (consulting, stainless-steel fabrication, equipment sales & rental, maintenance, and chemicals), based in Gelugor, Penang, trading since 2009.

## What's in here

| File / folder | Purpose |
|---|---|
| `index.html` | The marketing homepage — a long-form, conversion-focused site with **51 sections** (hero, services, equipment, chemicals, fabrication, projects, case studies, plans, FAQ, contact, and more). |
| `services.html`, `projects.html`, `contact.html` | Supporting pages for depth and SEO. |
| `MARKETING-PLAN.md` | The full marketing strategy (market analysis, personas, positioning, channels, budget, 12-month roadmap, measurement). |
| `assets/css/styles.css` | Self-contained design system (no build step). |
| `assets/js/main.js` | Vanilla-JS interactivity (nav, accordion, counters, carousel, form validation, cookie bar). |
| `robots.txt`, `sitemap.xml` | Basic SEO/crawl files. |

## Design

- **Direction:** clean corporate / trustworthy, grounded in the client's material world — **steel-blue + brushed stainless**.
- **Type:** Archivo (display) · IBM Plex Sans (body) · IBM Plex Mono (data/labels).
- **Stack:** static **HTML + Tailwind (CDN) + vanilla JS**. The site is **fully styled by `styles.css`**, so it renders correctly even if the Tailwind CDN or web fonts are blocked.
- **SEO:** per-page meta + Open Graph, `LocalBusiness` JSON-LD using the real business NAP, semantic structure, mobile-first.

## View it locally

No build step required. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before going live (handover checklist)

1. **Forms** are demo-only (no data is sent). Wire them to a backend, email, a service like Formspree, or the WhatsApp Business API.
2. Replace **representative content** (clearly marked on the page): project photos, brand-partner logos, testimonials, certifications, and any illustrative figures/stats.
3. Add **GA4**, **Google Search Console**, and call/WhatsApp tracking.
4. Confirm **business hours**, finalise the company **milestones/timeline**, and add real **privacy & cookie** policy pages.
5. Optimise the **Google Business Profile** (see `MARKETING-PLAN.md`, §13).

## Contact (business)

JR-Tech Solution Sdn Bhd (Reg. 200901013633) · 556-Y, Mukim 13, Batu Uban, Jalan Sultan Azlan Shah, 11700 Gelugor, Penang
Tel +604-657 2916 / +604-657 5196 · WhatsApp +6012-476 0525 · jrtechboon@gmail.com · www.jrtech.com.my
