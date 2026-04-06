# Stack10 Marketing Website

Marketing website for [Stack10](https://stack10.ai) — an enterprise AI transformation consultancy delivering strategy-to-production AI solutions for financial services, government, and other industries.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build) (static site generation) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) (utility-first) |
| **Fonts** | [Manrope](https://fonts.google.com/specimen/Manrope) (body) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (monospace) via Google Fonts |
| **Analytics** | [PostHog](https://posthog.com) |
| **Assets / CDN** | [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) (`stack10-assets.syd1.digitaloceanspaces.com`) |
| **Hosting** | DigitalOcean |

## Repository Structure

This repo contains the **pre-built static output** from an Astro project. All pages are compiled HTML with hashed Astro CSS bundles.

```
.
├── _astro/               # Astro-generated CSS bundles
├── about/                # /about
├── ai-transformation/    # /ai-transformation
├── blog/                 # /blog
├── careers/              # /careers
├── case-studies/         # /case-studies
├── contact/              # /contact
├── customers/            # /customers (+ sub-pages)
├── get-started/          # /get-started
├── homev2/               # /homev2 (alternate homepage)
├── how-we-work/          # /how-we-work
├── industries/           # /industries (+ 8 industry pages)
├── insights/             # /insights (+ articles)
├── partners/             # /partners
├── platform/             # /platform
├── services/             # 5 service pages (Discover, Audit, One, Map, E2E)
├── trust/                # /trust (security & compliance)
├── website-archive/      # Previous version of the site (plain HTML/CSS/JS)
├── index.html            # Homepage
├── robots.txt            # Crawl rules (staging blocks all indexing)
├── sitemap-index.xml     # Sitemap index
├── sitemap-0.xml         # Sitemap
├── favicon.svg           # Favicon (SVG)
├── favicon.ico           # Favicon (ICO)
├── logo-dark.svg         # Dark logo variant
└── logo-light.svg        # Light logo variant
```

## Pages

### Core
- **Homepage** — Hero, stats, approach overview, CTA
- **About** — Company story and mission
- **Contact** — Book a discovery call
- **Get Started** — Onboarding entry point
- **Careers** — Open positions

### Platform
- **Platform Overview** — AI operating system approach
- **AI Transformation** — Why execution beats strategy
- **How We Work** — 5-stage delivery methodology
- **Trust Center** — Security and compliance

### Services
| Service | Description |
|---|---|
| **Stack Discover** | AI opportunity discovery (2-week engagement) |
| **Stack Audit** | Deep-dive audit + working prototype |
| **Stack One** | Ongoing AI engineering |
| **Stack Map** | Process intelligence quickstart |
| **Stack E2E** | End-to-end organisational process mapping |

### Industries
Financial Services, Government, Manufacturing, Healthcare, Logistics, Media & Entertainment, Professional Services, Retail

### Resources
- **Insights** — Articles and research
- **Customer Stories** — Case studies with results
- **Partners** — Keystone Intelligence and more

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production (`stack10.ai`) |
| `staging` | Staging / preview (blocks indexing via `robots.txt`) |

## Website Archive

The `website-archive/` directory contains the previous version of the site built with plain HTML, CSS, and vanilla JavaScript, preserved for reference.
