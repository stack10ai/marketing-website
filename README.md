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

---

## Lead Capture System

The site has a server-side lead capture system backed by a DigitalOcean Managed PostgreSQL database (`stack10-db`, Sydney).

### How it works

1. Visitor fills in the contact form at `/contact`
2. Client-side Zod validation runs first (instant feedback, no round-trip)
3. On success, a `POST /api/contact` request is sent with JSON body
4. Server validates, runs honeypot check, inserts into `website_leads` table
5. Optionally fires a signed webhook to any destination you configure
6. Success state shown in the form card

### Database

**Cluster:** `stack10-db` on DigitalOcean (Sydney / `syd1`)  
**Database:** `defaultdb`  
**Table:** `website_leads`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `created_at` | TIMESTAMPTZ | Auto-set to `NOW()` |
| `name` | TEXT | Required |
| `company` | TEXT | Required |
| `role` | TEXT | Optional |
| `email` | TEXT | Required, validated |
| `phone` | TEXT | Optional |
| `revenue` | TEXT | Optional enum |
| `intent` | TEXT | Required enum |
| `message` | TEXT | Required |
| `source` | TEXT | Optional enum |
| `ip_address` | TEXT | Captured server-side |
| `user_agent` | TEXT | Captured server-side |
| `webhook_sent_at` | TIMESTAMPTZ | Set after webhook delivery |
| `webhook_status` | TEXT | HTTP status or error from webhook |

### API Endpoints

#### `POST /api/contact`

Public. Accepts form submissions.

**Request body (JSON):**
```json
{
  "name": "Alex Chen",
  "company": "Acme Corp",
  "role": "CTO",
  "email": "alex@acmecorp.com",
  "phone": "+61 400 000 000",
  "revenue": "50m-150m",
  "intent": "ai-strategy",
  "message": "We want to explore AI opportunities across our ops team.",
  "source": "linkedin"
}
```

**Responses:**
| Status | Meaning |
|---|---|
| `200 { ok: true }` | Saved successfully |
| `422 { error, fields }` | Validation failed — `fields` maps field names to error messages |
| `429 { error }` | Rate limited (5 requests per IP per 15 min) |
| `500 { error }` | Database error |

---

#### `GET /api/leads`

Protected. Returns stored leads as JSON.

**Authentication:** `Authorization: Bearer <LEADS_API_KEY>` header required.

```bash
curl https://stack10.ai/api/leads \
  -H "Authorization: Bearer <your-api-key>"
```

**Query parameters:**

| Param | Default | Description |
|---|---|---|
| `limit` | `100` | Max results (capped at 500) |
| `offset` | `0` | Pagination offset |
| `intent` | — | Filter by intent value |
| `since` | — | Filter by `created_at >= ISO date` |

**Example:**
```bash
# Last 50 AI strategy leads since January 2026
curl "https://stack10.ai/api/leads?intent=ai-strategy&since=2026-01-01&limit=50" \
  -H "Authorization: Bearer <your-api-key>"
```

**Response:**
```json
{
  "total": 42,
  "limit": 50,
  "offset": 0,
  "leads": [
    {
      "id": "uuid",
      "created_at": "2026-04-14T10:00:00Z",
      "name": "Alex Chen",
      "company": "Acme Corp",
      ...
    }
  ]
}
```

### Webhook

On every new lead, the server fires a `POST` request to `WEBHOOK_URL` (if set). Plug in Zapier, Make, a Slack app, your CRM, or any HTTP endpoint.

**Payload:**
```json
{
  "id": "uuid",
  "created_at": "2026-04-14T10:00:00Z",
  "name": "Alex Chen",
  "company": "Acme Corp",
  "role": "CTO",
  "email": "alex@acmecorp.com",
  "phone": "+61 400 000 000",
  "revenue": "50m-150m",
  "intent": "ai-strategy",
  "message": "We want to explore...",
  "source": "linkedin"
}
```

**Signature verification (recommended):**

Every webhook request includes an `X-Stack10-Signature: sha256=<hmac>` header. Verify it in your receiver:

```javascript
const crypto = require('crypto');

function verifySignature(body, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Environment Variables

Set these in DigitalOcean App Platform → your app → Settings → Environment Variables.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string with `?sslmode=require` |
| `LEADS_API_KEY` | Yes | Secret bearer token for `GET /api/leads` |
| `WEBHOOK_URL` | No | URL to POST new leads to |
| `WEBHOOK_SECRET` | No | HMAC-SHA256 signing secret for webhook payloads |

See `.env.example` for the format.

### Security model

| Layer | Mechanism |
|---|---|
| Bot filtering | Hidden honeypot field — bots fill it, submission silently dropped |
| Rate limiting | 5 requests per IP per 15 minutes (in-memory sliding window) |
| Input validation | Zod schema on both client and server — enum values, lengths, email format |
| SQL injection | Parameterised queries only — no string interpolation |
| Leads retrieval | Bearer token required — 401 if missing or wrong |
| Webhook integrity | HMAC-SHA256 signature on every delivery |
| Secrets | All credentials in env vars — never in source or client bundle |
| DB credentials | Never sent to the browser — server-side only |

---

## Website Archive

The `website-archive/` directory contains the previous version of the site built with plain HTML, CSS, and vanilla JavaScript, preserved for reference.
