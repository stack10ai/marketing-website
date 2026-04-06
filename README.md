# Stack10 Marketing Website

Static marketing website for Stack10 — enterprise AI transformation consultancy.

**Tech stack:** Vanilla HTML5, CSS3 (custom properties), ES6+ JavaScript. No build tools, no frameworks, no dependencies.

**Live at:** `stack10.ai` (currently blocked from crawlers via `robots.txt`)

---

## Quick Start

```bash
# Serve locally (any static server works)
cd marketing-website
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`. No build step required — edit files and refresh.

---

## File Structure

```
marketing-website/
├── index.html                  Homepage
├── about.html                  About / manifesto
├── ai-transformation.html      AI Transformation overview
├── how-we-work.html            Methodology
├── industries.html             Industry verticals
├── contact.html                Contact / booking form
├── robots.txt                  Search engine config
│
├── services/                   Service detail pages
│   ├── stack-discover.html     $25k · 2 weeks
│   ├── stack-map.html          $25k · 30 days
│   ├── stack-audit.html        $75k · 6–8 weeks
│   └── stack-one.html          $50k/month ongoing
│
├── css/
│   ├── style.css               Main stylesheet (all components)
│   └── animated-strip.css      Horizontal scrolling strip animation
│
├── js/
│   └── main.js                 All interactive behaviour
│
└── images/
    ├── logo-dark.svg           Dark logo (used on light backgrounds)
    ├── logo-light.svg          Light logo (footer, dark sections)
    ├── logo-1.svg              Nav logo variant 1 (light bg)
    ├── logo-2.svg              Nav logo variant 2 (dark hero pages)
    ├── logo-3.svg              Alternate variant
    ├── logo-dark.jpg            JPG fallback
    ├── logo-light.jpg           JPG fallback
    ├── emblem-dark.svg          Emblem/icon only (dark)
    ├── emblem-light.svg         Emblem/icon only (light)
    ├── favicon-16.png
    ├── favicon-32.png
    ├── graphic-pattern-3.svg    Geometric pattern (used in dark sections)
    └── graphic-pattern-5.svg    Alternate pattern
```

---

## Content Editing Guide

### Page structure

Every page follows the same skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Page Title | Stack10</title>
  <meta name="description" content="...">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- Announcement Banner -->
  <!-- Navigation -->
  <!-- Page sections -->
  <!-- Footer -->
  <script src="js/main.js"></script>
</body>
</html>
```

Service pages use `../` relative paths (e.g. `../css/style.css`, `../images/logo-dark.svg`).

### Navigation

The nav is duplicated in every HTML file (no templating). When updating nav links, update **all 10 pages**:

| File | Nav path prefix |
|------|----------------|
| Root pages (`index.html`, `about.html`, etc.) | Direct: `about.html`, `services/stack-discover.html` |
| Service pages (`services/*.html`) | Parent: `../about.html`, `stack-discover.html` (sibling) |

The mobile menu (`.mobile-menu` div) lists all service pages individually and must also be updated.

### Announcement banner

The green bar at the top of every page:

```html
<div id="announcement-banner" class="announcement-bar">
  <span>🚀 Stack Discover — Find your top AI opportunities in 2 weeks</span>
  <a href="services/stack-discover.html">Learn more →</a>
  <button id="banner-close" ...>✕</button>
</div>
```

- Edit the `<span>` text and `<a>` link to promote a different service or announcement
- The banner auto-hides on scroll (>60px) and can be manually dismissed
- Dismissal does not persist across page loads

### Adding a new page

1. Copy an existing page as a template (e.g. `about.html`)
2. Update `<title>` and `<meta name="description">`
3. Set the correct `class="active"` on the nav link for the new page
4. If in `services/`, adjust all paths to use `../` prefix
5. Add the page link to the nav and footer on **all existing pages**

### Footer

The footer lives at the bottom of every page with columns for Company, Services, Industries, and Connect. Update footer links across all pages when adding/removing pages.

### Contact form

`contact.html` contains a form that generates a `mailto:` link to `hello@stack10.ai` on submit. It does not connect to a backend — form data is composed into an email URL that opens the user's email client.

### SEO / crawling

`robots.txt` currently blocks all crawlers:
```
User-agent: *
Disallow: /
```

Remove the `Disallow: /` line (or replace with `Allow: /`) when the site is ready to be indexed.

---

## Design System Reference

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--white` | `#FFFFFF` | Page backgrounds |
| `--black` | `#000000` | Primary text, dark sections |
| `--green` | `#1EE76E` | Primary accent — CTAs, highlights |
| `--green-dark` | `#19D063` | Hover state for green elements |
| `--green-50` | `#ECFDF5` | Subtle green background |
| `--green-100` | `#D1FAE5` | Card background (replaces lavender/lilac) |
| `--green-300` | `#6EE7A0` | Borders |
| `--green-700` | `#15B554` | Active state |
| `--green-900` | `#0D7A3A` | Green text on light backgrounds (WCAG AA) |
| `--cream` | `#F5F0E8` | Warm section backgrounds (hero, alternating sections) |
| `--cream-dark` | `#EDE5D8` | Darker cream variant (cards, approach cards) |
| `--cream-50` | `#FAF8F5` | Subtle warm background |
| `--cream-300` | `#DDD3C3` | Cream borders |
| `--cream-500` | `#B8A88F` | Muted text on cream |
| `--mint` | `#91EDE0` | Social media backgrounds only |
| `--lime` | `#E1FF73` | Social media backgrounds only |
| `--sand` | `#FDE68A` | Social media backgrounds + banner accents |
| `--error` | `#DC2626` | Destructive actions, error states |
| `--warning` | `#D97706` | Caution states |
| `--success` | `#059669` | Confirmation states |
| `--info` | `#2563EB` | Informational states |

**Grey scale** (50–900): `--grey-50` (#F9FAFB) through `--grey-900` (#111827).

### Typography

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Body | Manrope | 400 | 16px | — |
| H1 | Manrope | 800 | 72px (clamp 3rem–5rem on hero) | -2px |
| H2 | Manrope | 800 | 44px | -2px |
| H3 | Manrope | 700 | 28px | — |
| H4 | Manrope | 700 | 20px | — |
| Eyebrow | JetBrains Mono | 700 | 12px | 3px, uppercase |
| Mono elements | JetBrains Mono | 400–700 | varies | — |
| `.subtitle` | Manrope | 300 | 22px | — |
| `.body-lg` | Manrope | 400 | 18px | — |

Fonts are loaded from Google Fonts (no self-hosting):
- `Manrope` — 300, 400, 500, 600, 700, 800
- `JetBrains Mono` — 400, 500, 700

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-height` | 72px | Fixed navigation height |
| `--max-width` | 1200px | Container max width |
| `--section-pad` | 120px | Vertical section padding (desktop) |
| `--section-pad-mobile` | 64px | Vertical section padding (mobile) |

### Buttons

| Class | Appearance | Usage |
|-------|------------|-------|
| `.btn-pill-black` | Black pill, white text | Primary CTA |
| `.btn-pill-white` | White pill, black text | CTA on dark backgrounds |
| `.btn-pill-ghost` | Transparent pill, grey border | Secondary CTA |
| `.btn-primary` | Black rectangle, rounded | Legacy/alternative primary |
| `.btn-secondary` | Transparent, grey border, rounded | Legacy/alternative secondary |
| `.btn-green` | Green rectangle, rounded | Accent CTA |
| `.nav-cta` | Green rectangle, small | Navigation CTA |
| `.text-link` | Text with green underline | Inline links |

### Section Backgrounds

| Class | Background | Text |
|-------|------------|------|
| `.section-white` | White | Black |
| `.section-cream` | Cream (#F5F0E8) | Black |
| `.section-dark` | Black | White |
| `.section-grey` | Grey-50 with dot grid | Black |
| `.section-pattern` | Adds SVG pattern overlay (8% opacity) | — |
| `.section-green-cta` | Stack Green | Black |

### Card Components

**Bento cards** (`.bento-card`) — 20px border radius, 40px padding:

| Variant | Class | Background |
|---------|-------|------------|
| Green | `.bento-card-green` | Stack Green (#1EE76E) |
| Green-100 | `.bento-card-lavender` | Green-100 (#D1FAE5) |
| Green-100 | `.bento-card-lilac` | Green-100 (#D1FAE5) |
| Cream | `.bento-card-cream-dark` | Cream Dark (#EDE5D8) |
| Dark | `.bento-card-dark` | Black (#000000) |
| Patterned | `.bento-card-pattern` | Adds SVG pattern overlay |

**Standard cards** (`.card`) — 12px border radius, 1px grey border, hover lift.

### Grid Layouts

| Class | Columns |
|-------|---------|
| `.cards-grid-2` | 2 columns |
| `.cards-grid-3` | 3 columns |
| `.cards-grid-4` | 4 columns |
| `.services-bento` | 2 columns (service cards) |
| `.why-bento` | 3 columns (differentiators) |
| `.approach-flow` | Horizontal flex (4 cards + arrows) |

### Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| > 1024px | Full desktop layout |
| 768–1024px | Grids collapse to 2 columns, hero adjusts |
| < 768px | Single column, hamburger nav, smaller type |

At **768px**: Nav links hide, hamburger appears, all grids go single-column, hero min-height reduces.

---

## JavaScript Behaviour

All JS lives in `js/main.js` (~160 lines). No dependencies.

### Features

| Feature | How it works |
|---------|-------------|
| **Announcement banner** | Auto-hides on scroll >60px, restores at top. Manual close via X button sets a flag to prevent restore. |
| **Nav scroll effect** | Adds `.scrolled` class on scroll >10px — adds white background, blur, shadow, and bottom border. Also shows a secondary CTA button (`.nav-cta-scroll`). |
| **Logo swap** | On pages with `.hero.section-dark`, swaps between `logo-1.svg` (scrolled) and `logo-2.svg` (top). |
| **Mobile menu** | Hamburger toggles `.open` class on `.mobile-menu`. Links auto-close the menu. |
| **Fade-up animations** | Elements with `.fade-up` start invisible and translate-Y 24px. IntersectionObserver adds `.visible` at 10% visibility. One-shot (unobserves after triggering). |
| **Number count-up** | Elements with `.stat-number` animate from 0 to their target value. Supports `%` suffix and `$` prefix with decimal. Triggers at 50% visibility. |
| **Contact form** | `#contact-form` composes a `mailto:` URL on submit — no backend required. |

### Adding scroll animations

Add `class="fade-up"` to any element to make it animate in on scroll:

```html
<div class="fade-up">This fades up when scrolled into view</div>
```

For staggered animations, add delay classes:
```html
<div class="fade-up">First</div>
<div class="fade-up fade-up-delay-1">Second (0.1s delay)</div>
<div class="fade-up fade-up-delay-2">Third (0.2s delay)</div>
```

Available delays: `fade-up-delay-1` through `fade-up-delay-6` (0.1s–0.6s).

### Animated scrolling strips

The geometric strips between sections use CSS-only continuous horizontal scroll animation:

```html
<div class="animated-strip">
  <div class="strip-track"><!-- blocks scroll left --></div>
  <div class="strip-track reverse"><!-- blocks scroll right --></div>
  <div class="strip-track slow"><!-- blocks scroll left, slower --></div>
</div>
```

Each track contains duplicated `.strip-block` elements (first half duplicated for seamless loop). Block colour classes: `sb-green`, `sb-green-dk`, `sb-green-t`, `sb-lavender` (green-100), `sb-lav-t` (green 15%), `sb-coral` (cream-dark), `sb-cream-t`, `sb-white`, `sb-dark`.

Respects `prefers-reduced-motion: reduce` (animations disabled).

---

## Deployment

The site is purely static — deploy to any static hosting:

- **DigitalOcean App Platform / Spaces** — upload the `marketing-website/` directory
- **Netlify / Vercel** — point to `marketing-website/` as the publish directory
- **S3 + CloudFront** — upload files, set `index.html` as default document
- **Nginx** — serve from document root

No build command needed. Remember to update `robots.txt` to allow crawlers before going live.

---

## Checklist for Common Tasks

### Update service pricing
1. Edit the service page in `services/` (hero section, pricing badge)
2. Update the approach flow cards on `index.html` (`.approach-price` spans)
3. Update the services bento grid on `index.html` (`.bento-price` spans)

### Add a client logo
Replace a `.logo-placeholder` div in the logo bar section on `index.html`:
```html
<img src="images/client-name.png" alt="Client Name" style="height:32px;width:auto;opacity:0.6;">
```

### Change the primary accent colour
Update `--green` in `:root` in `css/style.css` (line 12). Also update `--green-dark` for hover states.

### Add a new section to the homepage
1. Add the HTML between existing sections in `index.html`
2. Use an existing section class for the background (`section-white`, `section-cream`, `section-dark`)
3. Add `fade-up` classes to animate elements on scroll
4. Wrap content in `<div class="container">` for proper max-width and padding
