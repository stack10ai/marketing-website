---
current_step: "Step 5 - Implemented"
last_updated: 2026-04-02
status: implemented
version: "1.3.1"
---

# Stack 10 Brand Design System

## Section 0: Implementation Map

### Token Layer (CSS Custom Properties)

| File | Controls | Sections |
|------|---------|----------|
| `apps/web/styles/globals.css` | CSS import order, base styles (scroll-padding, font-feature-settings, border fallback) | 3E |
| `apps/web/styles/shadcn-ui.css` | All color tokens (`:root` light, `.dark`), radius, font vars | 1, 2, 3A |
| `apps/web/styles/theme.css` | CSS var → Tailwind `@theme` mappings, radius scale, font aliases, animations/keyframes | 1, 2, 3A, 3C |
| `apps/web/styles/theme.utilities.css` | Container layout (`max-w-[81rem]`, `px-4 lg:px-8`) | 3D |
| `apps/web/styles/makerkit.css` | Header/footer gradient lines, mobile dropdown touch targets | 3F |
| `apps/web/lib/fonts.ts` | Font family, weights, subsets, CSS variable name (`--font-sans-fallback`) | 2 |
| `apps/web/.env` | Meta theme-color for mobile browsers (`NEXT_PUBLIC_THEME_COLOR`, `NEXT_PUBLIC_THEME_COLOR_DARK`) | 6 |

### Component Layer (Tailwind Classes)

| File | Controls | Sections |
|------|---------|----------|
| `packages/ui/src/shadcn/button.tsx` | Button variant classes + sizes | 4A, 4B |
| `packages/ui/src/shadcn/radio-group.tsx` | Radio selection states | 4A, 4B |
| `packages/ui/src/shadcn/badge.tsx` | Badge shape and variant colors | 4A |
| `packages/ui/src/makerkit/marketing/pill.tsx` | Marketing pill label styling | 4A |
| `packages/ui/src/makerkit/mode-toggle.tsx` | Theme picker dropdown | 4A |
| `packages/billing/gateway/src/components/plan-picker.tsx` | Billing interval toggle + plan row selection | 4A |
| `apps/web/components/app-logo.tsx` | Logo sizing, dark mode switching | 5 |
| `apps/web/app/(marketing)/_components/site-footer.tsx` | Footer logo usage | 5 |

### Asset Layer

| File | What | Section |
|------|------|---------|
| `apps/web/public/images/logo.svg` | Full logo (light) — Stack 10 wordmark + S emblem, black | 5 |
| `apps/web/public/images/logo-dark.svg` | Full logo (dark) — Stack 10 wordmark + S emblem, white | 5 |
| `apps/web/public/images/logo-mark.svg` | S emblem only (light) — black | 5 |
| `apps/web/public/images/logo-mark-dark.svg` | S emblem only (dark) — white | 5 |
| `apps/web/public/images/favicon/` | All favicon variants | 5 |

### CSS Import Order (globals.css)

```
tailwindcss → theme.css → theme.utilities.css → shadcn-ui.css → markdoc.css → makerkit.css → tw-animate-css
```

### Implementation Order

1. Token layer: `shadcn-ui.css` → `theme.css` → `theme.utilities.css` → `makerkit.css`
2. Font config: `lib/fonts.ts`
3. Component layer: all component files
4. Logo assets: SVGs/PNGs → `app-logo.tsx` → `site-footer.tsx`
5. Environment vars: `.env`
6. Verify: `pnpm typecheck && pnpm lint:fix && pnpm format:fix`
7. Visual check: `pnpm dev` → light and dark mode

---

## Section 1: Color Palette

**Brand colors:** Green #1EE76E, Black #000000, White #FFFFFF
**Neutral family:** True gray (no blue/slate undertone) — matches pure black/white brand palette
**Primary strategy:** Green as primary CTA — identical hue in both modes for brand consistency

> **Accessibility note:** `--primary` (`oklch(0.76 0.21 150)`) fails WCAG AA as text on white. Use `--primary` only for backgrounds (buttons, badges). For green text on light surfaces (links, nav active, pills), use `--primary-text` (`oklch(0.45 0.18 150)`) which passes AA.

### 1A. Core Semantic Colors (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--primary` | Button bg, badge bg | `oklch(0.76 0.21 150)` | Stack 10 Green — bg use only |
| `--primary-foreground` | Text on primary bg | `oklch(0.145 0 0)` | Near-black on green — ~8:1 AA pass |
| `--primary-hover` | Button hover bg | `oklch(0.69 0.21 150)` | Darker green for hover feedback |
| `--primary-text` | Green text on light bg | `oklch(0.45 0.18 150)` | Darker green — AA pass vs white |
| `--secondary` | Secondary buttons, subtle fills | `oklch(0.940 0.045 150)` | Light green tint |
| `--secondary-foreground` | Text on secondary | `oklch(0.205 0 0)` | Near-black |
| `--accent` | Hover highlights, nav selection | `oklch(0.930 0.035 150)` | Noticeably greener for visible hover |
| `--accent-foreground` | Text on accent | `oklch(0.205 0 0)` | Near-black |
| `--muted` | Disabled backgrounds, subtle areas | `oklch(0.965 0.008 150)` | Near-neutral with green tint |
| `--muted-foreground` | Muted text, placeholders | `oklch(0.556 0 0)` | Mid-gray — 5.74:1 vs white |
| `--destructive` | Error, delete actions | `var(--color-red-500)` | Standard red |
| `--destructive-foreground` | Text on destructive | `oklch(1 0 0)` | White |
| `--success` | Success states | `oklch(0.75 0.15 190)` | Teal — distinct from primary green |
| `--success-foreground` | Text on success | `oklch(0.145 0 0)` | Near-black |

### 1B. Surface Colors (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--background` | Page background | `oklch(1 0 0)` | White |
| `--foreground` | Default text | `oklch(0.145 0 0)` | Near-black |
| `--card` | Card backgrounds | `oklch(1 0 0)` | White |
| `--card-foreground` | Card text | `oklch(0.145 0 0)` | Near-black |
| `--popover` | Popover/dropdown bg | `oklch(1 0 0)` | White |
| `--popover-foreground` | Popover text | `oklch(0.145 0 0)` | Near-black |

### 1C. UI Chrome (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--border` | Default border | `oklch(0.922 0.008 150)` | Light green-gray |
| `--input` | Input borders | `oklch(0.87 0.012 150)` | Slightly darker |
| `--ring` | Focus ring | `oklch(0.76 0.21 150)` | Green — matches primary |

### 1D. State Colors (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--success` | Success states | `oklch(0.75 0.15 190)` | Teal — CSS custom property |
| warning | Warning states | `border-orange-500 text-orange-500` | Hardcoded in `badge.tsx` |
| info | Info states | `border-blue-500 text-blue-500` | Hardcoded in `badge.tsx` |

> **Badge success fix:** Replace hardcoded `border-green-500 text-green-500` with `border-[var(--success)] text-[var(--success)]` in `badge.tsx`. This avoids collision with primary green and uses the teal `--success` token.

### 1E. Sidebar Colors (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--sidebar-background` | Sidebar bg | `oklch(0.975 0.010 150)` | Very slight green tint |
| `--sidebar-foreground` | Sidebar text | `oklch(0.371 0 0)` | Dark gray |
| `--sidebar-primary` | Sidebar active item | `oklch(0.76 0.21 150)` | Green |
| `--sidebar-primary-foreground` | Active item text | `oklch(0.145 0 0)` | Black on green |
| `--sidebar-accent` | Sidebar hover | `oklch(0.930 0.035 150)` | Matches main accent |
| `--sidebar-accent-foreground` | Hover text | `oklch(0.145 0 0)` | Near-black |
| `--sidebar-border` | Sidebar borders | `var(--border)` | Inherits |
| `--sidebar-ring` | Sidebar focus ring | `oklch(0.76 0.21 150)` | Green |

### 1F. Chart Colors (Light)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--chart-1` | Chart series 1 | `oklch(0.76 0.21 150)` | Brand green |
| `--chart-2` | Chart series 2 | `oklch(0.55 0.20 260)` | Strong blue (lum ~0.16) |
| `--chart-3` | Chart series 3 | `oklch(0.70 0.18 40)` | Vivid orange (lum ~0.32) |
| `--chart-4` | Chart series 4 | `oklch(0.65 0.18 310)` | Saturated purple (lum ~0.25) |
| `--chart-5` | Chart series 5 | `oklch(0.72 0.14 200)` | Teal (lum ~0.41) |

> Chart colors use staggered luminance for colorblind distinguishability. Hues spread across the wheel (148, 260, 40, 310, 200) for trichromat separation.

### 1G. Core Semantic Colors (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--primary` | Button bg, badge bg | `oklch(0.813 0.219 150)` | Same green — identical in both modes |
| `--primary-foreground` | Text on primary bg | `oklch(0.145 0 0)` | Black on green |
| `--primary-text` | Green text on dark bg | `oklch(0.813 0.219 150)` | Same as primary — passes AA on dark bg (9.64:1) |
| `--secondary` | Secondary buttons | `oklch(0.24 0.04 150)` | Dark green-tinted |
| `--secondary-foreground` | Text on secondary | `oklch(0.97 0 0)` | Near-white |
| `--accent` | Hover highlights | `oklch(0.28 0.030 150)` | Distinctly lighter hover |
| `--accent-foreground` | Text on accent | `oklch(0.97 0 0)` | Near-white |
| `--muted` | Disabled backgrounds | `oklch(0.269 0.008 150)` | Dark gray with green tint |
| `--muted-foreground` | Muted text, placeholders | `oklch(0.62 0 0)` | Adjusted for dark bg — 5.44:1 AA pass |
| `--destructive` | Error states | `oklch(0.62 0.22 27)` | Lighter red for dark bg — ~4.5:1 AA pass |
| `--destructive-foreground` | Text on destructive | `oklch(1 0 0)` | White |
| `--success` | Success states | `oklch(0.72 0.13 190)` | Teal adjusted for dark |
| `--success-foreground` | Text on success | `oklch(0.985 0 0)` | Near-white |

### 1H. Surface Colors (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--background` | Page background | `oklch(0.145 0 0)` | Near-black |
| `--foreground` | Default text | `oklch(0.985 0 0)` | Near-white |
| `--card` | Card backgrounds | `oklch(0.22 0.008 150)` | Visible lift from background |
| `--card-foreground` | Card text | `oklch(0.985 0 0)` | Near-white |
| `--popover` | Popover bg | `oklch(0.22 0.008 150)` | Same as card |
| `--popover-foreground` | Popover text | `oklch(0.985 0 0)` | Near-white |

### 1I. UI Chrome (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--border` | Default border | `oklch(0.30 0.015 150)` | Visible hairline — green-gray |
| `--input` | Input borders | `oklch(0.38 0.015 150)` | Clear input border |
| `--ring` | Focus ring | `oklch(0.813 0.219 150)` | Green — same in both modes |

### 1J. State Colors (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--success` | Success states | `oklch(0.72 0.13 190)` | Teal — CSS custom property |
| warning | Warning states | `border-orange-500 text-orange-500` | Same as light |
| info | Info states | `border-blue-500 text-blue-500` | Same as light |

### 1K. Sidebar Colors (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--sidebar-background` | Sidebar bg | `oklch(0.145 0 0)` | Match background |
| `--sidebar-foreground` | Sidebar text | `oklch(0.985 0 0)` | White |
| `--sidebar-primary` | Sidebar active item | `oklch(0.813 0.219 150)` | Green |
| `--sidebar-primary-foreground` | Active item text | `oklch(0.145 0 0)` | Black on green |
| `--sidebar-accent` | Sidebar hover | `oklch(0.28 0.030 150)` | Matches main accent |
| `--sidebar-accent-foreground` | Hover text | `oklch(0.985 0 0)` | White |
| `--sidebar-border` | Sidebar borders | `var(--border)` | Inherits |
| `--sidebar-ring` | Sidebar focus ring | `oklch(0.813 0.219 150)` | Green |

### 1L. Chart Colors (Dark)

| Token | Purpose | Value | Notes |
|-------|---------|-------|-------|
| `--chart-1` | Chart series 1 | `oklch(0.813 0.219 150)` | Brand green |
| `--chart-2` | Chart series 2 | `oklch(0.60 0.20 260)` | Blue (boosted for dark bg) |
| `--chart-3` | Chart series 3 | `oklch(0.75 0.18 40)` | Orange (adjusted) |
| `--chart-4` | Chart series 4 | `oklch(0.70 0.18 310)` | Purple (adjusted) |
| `--chart-5` | Chart series 5 | `oklch(0.75 0.14 200)` | Teal (adjusted) |

### 1M. Extended Brand Palette

These colors are NOT CSS custom properties — they are brand palette extensions for marketing pages, social media, cards, and banners. Apply via inline styles or one-off Tailwind arbitrary values.

| Name | Value | Purpose | Text Color |
|------|-------|---------|------------|
| Mint | `oklch(0.92 0.06 180)` | Social/banner accent — light cyan | `#0a0a0a` (dark) |
| Lime | `oklch(0.93 0.10 120)` | Social/banner accent — yellow-green | `#0a0a0a` (dark) |
| Sand | `oklch(0.93 0.04 85)` | Social/banner accent — warm beige | `#0a0a0a` (dark) |
| Cream | `oklch(0.95 0.02 85)` | Alternative section background — warm off-white | `#0a0a0a` (dark) |
| Green-100 | `oklch(0.94 0.05 150)` | Lightest green tint for cards | `#0a0a0a` (dark) |
| Green (Card) | `oklch(0.85 0.14 150)` | Medium pastel green for card system | `#0a0a0a` (dark) |

**4-Colour Card System:**
Marketing cards use four background colors for visual variety and hierarchy:
1. **Green (Card)** — `oklch(0.85 0.14 150)` — hero/primary cards (softer than primary to blend with pastels)
2. **Green-100** — `oklch(0.94 0.05 150)` — secondary/supporting cards
3. **Cream** — `oklch(0.95 0.02 85)` — neutral/informational cards
4. **Black** — `oklch(0.145 0 0)` — dark/premium cards (white text: `#fafafa`)

**Social variety palette:**
Used alongside the 4 core social post backgrounds (Primary Green, Light Green, Near-Black, White) for visual diversity:
- Mint, Lime, Sand — all use dark text (`#0a0a0a`) for WCAG AA compliance

**Usage guidance:**
- Website UI stays disciplined with CSS custom properties only
- Extended palette is for marketing sections, landing pages, social posts, and print
- All extended colors pass WCAG AA for dark text on light background
- Cream can be used as an alternative to white for warm, approachable section backgrounds

---

## Section 2: Typography

### Font Family

| Property | Value | Notes |
|----------|-------|-------|
| Font family | **Manrope** | Geometric sans-serif from brand guidelines |
| CSS variable | `--font-sans-fallback` | Set in `fonts.ts` |
| Heading font | Manrope (same) | `heading = sans` pattern kept |
| Weights loaded | 300, 400, 500, 600, 700, 800 | Light through ExtraBold |
| Subsets | `latin` | |
| Fallback stack | `system-ui, Helvetica Neue, Helvetica, Arial` | |

### Font Variable Chain

```
fonts.ts: Manrope → --font-sans-fallback
  → shadcn-ui.css :root: --font-sans: -apple-system, BlinkMacSystemFont, var(--font-sans-fallback)
    → theme.css @theme: --font-sans: -apple-system, var(--font-sans)
```

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Responsive | Tailwind Classes |
|-------|------|--------|-------------|----------------|------------|-----------------|
| H1 | 64px (4rem) | 800 (ExtraBold) | 1.1 | `tracking-tight` | `text-4xl md:text-5xl lg:text-[4rem]` | Hero headlines |
| H2 | 40px (2.5rem) | 700 (Bold) | 1.15 | `tracking-tight` | `text-3xl md:text-[2.5rem]` | Section headlines |
| H3 | 32px (2rem) | 600 (Semibold) | 1.25 | normal | `text-2xl md:text-[1.75rem] lg:text-[2rem]` | Sub-sections |
| H4 | 24px (1.5rem) | 600 (Semibold) | 1.3 | normal | `text-xl md:text-2xl` | Card titles |
| H5 | 20px (1.25rem) | 600 (Semibold) | 1.35 | normal | `text-lg md:text-xl` | Small headings |
| H6 | 16px (1rem) | 600 (Semibold) | 1.35 | normal | `text-base` | Label headings |
| Body (P1) | 18px (1.125rem) | 500 (Medium) | 1.625 | normal | `text-base md:text-lg` | Primary body text |
| Body (P2) | 16px (1rem) | 500 (Medium) | 1.625 | normal | `text-base` | Secondary body text |
| Caption | 14px (0.875rem) | 500 (Medium) | 1.5 | normal | `text-sm` | Captions, help text |
| Overline | 12px (0.75rem) | 500 (Medium) | 1.4 | `tracking-widest` | `text-xs uppercase` | Category labels |

> **Line height classes:** H1-H2: `leading-[1.1]`/`leading-[1.15]` (arbitrary). H3: `leading-tight` (1.25). H5-H6: `leading-[1.35]`. Body: `leading-relaxed` (1.625). Caption: `leading-normal` (1.5).

> **Headings should use `text-wrap: balance`** for H1-H3 to prevent orphaned words on multi-line headings.

### Readability

- **Minimum readable font size:** 12px (0.75rem) — never below for user-facing text
- **Maximum line length:** 65 characters — use `max-w-prose` (Tailwind default 65ch)
- **Font-specific notes:** Manrope is a geometric sans-serif that renders lighter than Inter. Body text uses `font-medium` (500) as default weight (set in `globals.css body { font-weight: 500; }`). Headings use `font-semibold` (600) or higher. `ExtraBold` (800) is reserved for hero H1s only.
- **Tabular numerals:** Use `font-variant-numeric: tabular-nums` for data tables and financial figures.

---

## Section 3: Border Radius, Spacing, Motion, Layout

### 3A. Radius Scale

| Token | Value | Notes |
|-------|-------|-------|
| `--radius` (base) | `0.375rem` (6px) | Geometric feel per baseten reference |
| `--radius-sm` | `calc(var(--radius) - 3px)` = 3px | Badges, checkboxes, tags |
| `--radius-md` | `calc(var(--radius) - 2px)` = 4px | Buttons, inputs |
| `--radius-lg` | `var(--radius)` = 6px | Cards, dialogs |
| `--radius-full` | `9999px` | Pills, avatars |

### 3B. Spacing Scale

Tailwind 4px grid defaults — no overrides:
- 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px, 10 = 40px, 12 = 48px, 16 = 64px, 20 = 80px, 24 = 96px

**Key spacing decisions:**
- Section vertical padding: `py-16 md:py-24` (64px / 96px)
- Card internal padding: `p-6` (24px)
- Form field gap: `gap-4` (16px)
- Button group gap: `gap-3` (12px)

### 3C. Motion & Animation

**Animations defined in `theme.css`:**

| Animation | Duration | Easing | Fill Mode | Usage |
|-----------|----------|--------|-----------|-------|
| `fade-up` | 0.35s | ease-out | both | Entry animation (Y+10 → 0, opacity 0→1) |
| `fade-down` | 0.35s | ease-out | both | Entry animation (Y-10 → 0, opacity 0→1) |
| `accordion-down` | 0.2s | ease-out | — | Accordion open |
| `accordion-up` | 0.2s | ease-out | — | Accordion close |

**Transition duration scale:**
- Fast: 100ms — button hover, icon state
- Normal: 200ms — input focus, dropdown open
- Slow: 350ms — page section reveal, sidebar collapse

**Transition shorthand templates:**
```
Fast:   transition: {property} 100ms ease-in-out;
Normal: transition: {property} 200ms ease-out;
Slow:   transition: {property} 350ms ease-out;
```

**Easing curves:**
- Entrances: `ease-out`
- Movement: `ease-in-out`
- Exits: `ease-in`

**Elements that SHOULD animate:** Button hover/press, dropdown open/close, accordion expand, navigation transitions, page section fade-up on scroll, sidebar collapse/expand, focus ring appearance

**Elements that should NOT animate:** Data table updates, content reflows, live data refreshes, skeleton-to-content swap

**`prefers-reduced-motion`:** All non-essential animations disabled. Accordion transitions become instant. Fade-up/fade-down replaced with instant opacity. Only focus ring transitions retained.

### 3D. Layout & Responsive

**Container:**
- Max width: `81rem` (1296px) — aligned with baseten reference
- Padding: `px-4` (16px) default, `lg:px-8` (32px) at lg
- Margin: `auto` (centered)

**Breakpoints (Tailwind defaults):**

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Single-column stack, larger touch targets |
| `md` | 768px | Two-column layouts begin, form side-by-side |
| `lg` | 1024px | Sidebar visible, full navigation, 3-column grids |
| `xl` | 1280px | Container max approach, relaxed spacing |
| `2xl` | 1536px | No additional changes (container capped at 1296px) |

**Mobile navigation pattern:** Hamburger menu → full-screen overlay with stacked links
**Responsive component behavior:**
- Hero: Full-width stacked on mobile, side-by-side at lg
- Feature grid: 1-col → 2-col at md → 3-col at lg
- Sidebar: Hidden on mobile, collapsible at lg
- Cards: Full-width stack → 2-col grid at md
- Tables: Horizontal scroll on mobile

### 3E. Global Base Styles

From `globals.css`:
- `scroll-padding-top`: 56px (header height)
- `font-feature-settings`: `'rlig' 1, 'calt' 1`
- Border fallback: `var(--border, currentColor)`
- Placeholder color: `theme(--color-muted-foreground)`
- Body default font-weight: 500 (Manrope compensation)

### 3F. Decorative Styles

From `makerkit.css`:

**Header/footer gradient line:**
- Light: `radial-gradient(62.87% 100% at 50% 100%, oklch(0.922 0.008 150) 0%, rgba(255, 255, 255, 0) 100%)`
- Dark: `radial-gradient(62.87% 100% at 50% 100%, rgba(30, 231, 110, 0.08) 0%, rgba(255, 255, 255, 0) 100%)`

**Mobile dropdown optimization:**
- Touch targets: `min-h-12` (48px) on mobile, `min-h-0` on md+
- Dropdown: full-width on mobile, auto on md+

---

## Section 4: Component-Level Patterns

### 4A. Core Patterns

**Button Variants:**

| Variant | Classes | Notes |
|---------|---------|-------|
| `default` | `bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover` | Green CTA — black text, darker green on hover |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs` | Red danger |
| `outline` | `border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs` | Secondary action |
| `secondary` | `bg-muted text-foreground border border-border shadow-xs hover:bg-accent hover:border-foreground/20` | Muted bg with border, accent on hover |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | Minimal — use only for icon buttons, toolbars, or clearly interactive containers |
| `link` | `text-primary-text decoration-primary-text underline-offset-4 hover:underline` | Darker green for AA compliance |

**Button Sizes:**

| Size | Classes |
|------|---------|
| `default` | `h-9 px-4 py-2` |
| `sm` | `h-8 rounded-md px-3 text-xs` |
| `lg` | `h-10 rounded-md px-8` |
| `icon` | `h-9 w-9` |

**Badge Variants:**

| Variant | Classes | Notes |
|---------|---------|-------|
| `default` | `bg-primary text-primary-foreground border-transparent` | Green bg, black text |
| `secondary` | `bg-secondary text-secondary-foreground border-transparent` | Light green-gray bg |
| `destructive` | `text-destructive border-destructive` | Outline-only red |
| `outline` | `text-foreground` | Border from base |
| `success` | `border-[var(--success)] text-[var(--success)]` | **Teal** — distinct from primary green |
| `warning` | `border-orange-500 text-orange-500` | Hardcoded |
| `info` | `border-blue-500 text-blue-500` | Hardcoded |

Badge base: `rounded-md border px-1.5 py-0.5 text-xs font-semibold`

**Selection Indicator Pattern (actual codebase):**
- `radio-group.tsx`: Selected = `bg-accent text-accent-foreground`, unselected = `hover:bg-muted/50` (background-only, no borders)
- `plan-picker.tsx`: Selected interval = `bg-accent text-accent-foreground`, selected plan = accent highlight
- Pattern: background-based selection (accent for selected, muted hover for unselected)

**Pill Label Pattern (actual `pill.tsx`):**
- Label inner span: `bg-primary text-primary-foreground rounded-2xl border px-1.5 py-1.5 text-xs font-bold tracking-tight` (solid green pill with black text)
- Pill body text: `text-secondary-foreground` in light mode; gradient (`foreground/60 → foreground`) in dark mode via `GradientSecondaryText`
- Outer container: `rounded-full border min-h-9 gap-x-1.5`

**Font Weight Overrides:**
- Manrope renders lighter than Inter → body uses `font-medium` (500) as default
- Badge: `font-semibold` (600)
- Button: `font-medium` (500)

### 4B. Interactive State Matrix

| State | Buttons | Inputs | Cards | Radio/Toggle | Links |
|-------|---------|--------|-------|-------------|-------|
| Default | `bg-primary text-primary-fg` | `border-input bg-background` | `border-border bg-card` | `border-input bg-background` | `text-[--primary-text]` |
| Hover | `bg-primary-hover` | `border-ring` | `border-primary/50` | `border-primary/50` | `underline` |
| Focus | `ring-1 ring-ring` (green) | `ring-1 ring-ring` (green) | — | `ring-1 ring-ring` | `ring-1 ring-ring` |
| Active/Pressed | `bg-primary-hover` | `ring-1 ring-ring` | `scale-[0.99]` | — | — |
| Selected | — | — | `border-primary` | `border-primary bg-accent` | — |
| Disabled | `opacity-50 pointer-events-none` | `opacity-50 cursor-not-allowed` | `opacity-50` | `opacity-50` | `opacity-50 no-underline` |
| Loading | spinner + `opacity-70` | skeleton shimmer | skeleton shimmer | — | — |
| Error | — | `border-destructive ring-destructive` | `border-destructive` | `border-destructive` | — |

**Key rules:**
- All focus rings: `ring-1 ring-ring` (1px green ring) — consistent width, color, offset
- All disabled states: `opacity-50` — universal treatment
- Loading: spinner for buttons, skeleton shimmer for content areas

### 4C. Form Elements

- **Input fields:** `border-input bg-background rounded-md px-3 py-2 text-base font-medium` — focus: `ring-1 ring-ring border-ring`
- **Textareas:** Same base as inputs + `resize-y min-h-[80px]`
- **Select/dropdown:** Trigger styled as input — dropdown panel `bg-popover border-border rounded-md shadow-md`
- **Checkbox/switch:** Checked color `bg-primary` (green) — size 16px/20px — label left-aligned with 8px gap
- **Validation states:** Error: `border-destructive` + `text-destructive text-sm` below. Success: `border-[var(--success)]` (teal) briefly, or CheckCircle icon suffix. Do NOT use `border-green-*` — conflicts with green focus ring.
- **Labels:** Above input, `text-sm font-semibold` — required indicator `text-destructive` asterisk — help text `text-muted-foreground text-sm`
- **Input groups:** Prefix/suffix `bg-muted text-muted-foreground px-3` — seamless border with input

### 4D. Extended Components

- **Cards:** `bg-card border-border rounded-lg p-6` — clickable cards add `hover:border-primary/50 cursor-pointer transition-colors`
- **Dialogs/Modals:** Overlay `bg-black/50` — content `bg-card border-border rounded-lg p-6` — close button top-right. Focus trap managed by Radix UI.
- **Tables:** Header `bg-muted/50 font-semibold text-sm` — row hover `hover:bg-muted/30` — borders `border-b border-border`. Use `font-variant-numeric: tabular-nums` for number columns.
- **Toast/notifications:** Position bottom-right — variants: success (teal left border `border-l-4 border-[var(--success)]`), error (red), info (blue), warning (orange) — auto-dismiss 5s
- **Navigation:** Active link `text-[--primary-text] font-semibold` — sidebar selected `bg-sidebar-accent border-l-2 border-primary` — breadcrumb separator `/` in `text-muted-foreground`
- **Empty states:** Centered icon (48px, `text-muted-foreground`) + heading (`text-lg font-semibold mt-4`) + description (`text-muted-foreground text-sm mt-2 max-w-sm`) + CTA button (`mt-6`)
- **Skeleton/loading:** `bg-muted animate-pulse rounded-md` — matches target component border-radius
- **Pagination:** Prev/Next as outline buttons. Current page as default button (green). Total pages as muted text. Pattern: `[< Prev] [1] [2] [3] [Next >]`

---

## Section 5: Logo

### Logo Files

| File | Mode | Source | Status |
|------|------|--------|--------|
| `apps/web/public/images/logo.svg` | Light | Logo 1 (black wordmark + S emblem, transparent bg) | Ready to copy |
| `apps/web/public/images/logo-dark.svg` | Dark | Logo 2 (white wordmark + S emblem, remove black rect bg) | Extract from Logo 2 |
| `apps/web/public/images/logo-mark.svg` | Light (icon only) | Emblem standalone SVG (black) | Ready to copy |
| `apps/web/public/images/logo-mark-dark.svg` | Dark (icon only) | Emblem standalone SVG (white) | Derive from emblem |

**Source locations:**
- `_bmad-output/planning-artifacts/Stack 10 Brand Ecosystem (1)/Stack 10 Brand Ecosystem/Logo files/SVG/Logo 1.svg`
- `_bmad-output/planning-artifacts/Stack 10 Brand Ecosystem (1)/Stack 10 Brand Ecosystem/Logo files/SVG/Logo 2.svg`
- `_bmad-output/planning-artifacts/Stack 10 Brand Ecosystem (1)/Stack 10 Brand Ecosystem/Logo files/Emblem/SVG/`

### Favicon Variants

| File | Size | Source | Status |
|------|------|--------|--------|
| `favicon.ico` | Multi-size | Generate from emblem | Needs generation |
| `favicon.svg` | Scalable | Emblem SVG | Ready to copy |
| `favicon-96x96.png` | 96x96 | Generate from emblem | Needs generation |
| `16x16.png` | 16x16 | Brand ecosystem | Available |
| `32x32.png` | 32x32 | Brand ecosystem | Available |
| `apple-touch-icon.png` | 180x180 | Generate from emblem | Needs generation |
| `android-chrome-192x192.png` | 192x192 | Generate | Needs generation |
| `android-chrome-512x512.png` | 512x512 | Generate | Needs generation |

### Logo Component

**`app-logo.tsx` updates needed:**
- Replace inline MakerKit SVG with Stack 10 logo
- Use `<img>` with `logo.svg` / `logo-dark.svg` or inline the cleaned SVG paths
- Dark mode: `dark:hidden` / `dark:block` pattern for swapping

### Logo Colors

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Wordmark ("stack10") | Black (`oklch(0 0 0)`) | White (`oklch(1 0 0)`) |
| S Emblem (two parallelograms) | Black (`oklch(0 0 0)`) | White (`oklch(1 0 0)`) |

### Sizing

| Context | Width | Classes |
|---------|-------|---------|
| Header | 120px | `w-[100px] lg:w-[120px]` |
| Footer | 100px | `w-[85px] md:w-[100px]` |

---

## Section 6: Meta Theme Colors

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_THEME_COLOR` | `#ffffff` | White — matches light background |
| `NEXT_PUBLIC_THEME_COLOR_DARK` | `#1a1a1a` | Near-black — matches dark background |

Set in `apps/web/.env`.

---

## Section 7: Drop Shadows & Elevation

### Shadow Scale

Use Tailwind defaults. Minimal shadow usage per baseten geometric aesthetic. Prefer border-based depth.

- `shadow-xs`: Buttons only
- `shadow-md`: Dropdowns, popovers
- `shadow-lg`: Modals, dialogs

### Z-Index Hierarchy

| Layer | Z-Index | Component |
|-------|---------|-----------|
| Base | 0 | Default content |
| Sticky header | 40 | Site header |
| Dropdown | 50 | Radix popovers/menus |
| Modal overlay | 50 | Dialog backdrop |
| Modal | 50 | Dialog content |
| Toast | 100 | Sonner notifications |

> Radix UI manages z-index stacking automatically via portal ordering.

---

## Section 8: Iconography & Visual Assets

### Icon Set

| Property | Value | Notes |
|----------|-------|-------|
| Icon library | **Lucide** | Keep MakerKit default |
| Stroke width | 2px (default) | Matches Manrope's geometric cleanness |
| Default size | 20px (`w-5 h-5`) | Body text context |
| Size scale | sm: 16px (`w-4 h-4`), md: 20px (`w-5 h-5`), lg: 24px (`w-6 h-6`) | |

### Brand Custom Icons

Stack 10 Brand Ecosystem includes 30+ custom line icons. **Decision: Keep Lucide for the app UI.** Brand icons for marketing materials only.

### Illustration Style

None — use stat cards, metric displays, and geometric patterns.

### Photography Treatment

Not applicable for SaaS app. Marketing pages: case study screenshots with `rounded-md border border-border`.

### Empty State Pattern

Centered: Lucide icon (48px, `text-muted-foreground`) → heading (`text-lg font-semibold mt-4`) → description (`text-muted-foreground text-sm mt-2 max-w-sm`) → CTA button (`mt-6`)

---

## Section 9: Planning Documents

- [x] PRD (Website) — `_bmad-output/planning-artifacts/prd-stack10-website.md`
- [x] PRD (Brand Identity) — `_bmad-output/planning-artifacts/prd-stack10-brand-identity.md`
- [ ] Product Brief — not yet created
- [ ] Project Context — not yet created
- [ ] UX Design Spec — not yet created
- [x] Brand Ecosystem — `_bmad-output/planning-artifacts/Stack 10 Brand Ecosystem (1)/`
- [x] Brand Guidelines PDF — `_bmad-output/planning-artifacts/Stack 10 Brand Ecosystem (1)/Stack 10 Brand Ecosystem/BrandGuideline/BrandGuideline.pdf`

---

## Section 10: Inspiration & Competitive Reference

**Primary visual reference:**
- **baseten.co** — Dark-first aesthetic, geometric borders, minimal shadows, neon green accent on black. Container max 1296px. Monospace labels. Sharp/geometric border-radius.

**Color reference:**
- **Stack 10 staging site** — Green (#1EE76E), Black (#000000), White (#FFFFFF).

**Design principles:**
- "Performance through simplicity" — minimal, data-forward
- Dark mode is the primary brand expression; light mode is clean/professional
- Green accent creates high contrast and draws attention to CTAs
- Geometric forms echo the S emblem's parallelogram shapes
- Trust signals (certifications, compliance badges) prominent

**Competitor positioning:**
- Enterprise AI consulting firms delivering strategy decks, not production software
- Stack 10 differentiates with "ship, not advise"
- Design must convey: technical competence, production-readiness, trust/compliance, Australian sovereignty

---

## Section 11: User Journeys

1. **First Visit (Prospect):** Landing → 3-stage methodology → Case study results → Trust badges → "Get Started" CTA → Contact form
2. **Content Discovery:** Landing → Blog → Case studies → Contact
3. **Service Exploration:** Landing → Platform → Industries → Services → Contact
4. **Return Visit / Client Login:** Homepage → Auth → Dashboard → AI projects → Settings
5. **Admin Flow:** Login → Dashboard → Team management → Billing → Settings

---

## Section 12: Design Decisions Log & Changelog

### 12A. Design Decisions

1. **Neutral family: True gray (not slate)** — No blue undertone. Matches black/white brand palette.
2. **Primary = Green** — Light: `oklch(0.76 0.21 150)` (slightly darker for better contrast with black text). Dark: `oklch(0.813 0.219 150)` (brighter on dark bg). `--primary-hover` token added for explicit hover states.
3. **`--primary-text` token** — Darker green `oklch(0.45 0.18 150)` for text-on-light-bg contexts. Passes WCAG AA vs white. Primary green fails as text.
4. **Green focus rings** — `--ring` = primary green in both modes.
5. **Success = Teal (not green)** — `--success` uses hue 190 (teal) to distinguish from primary green hue 148. Avoids badge/toast/validation collision.
6. **Secondary ≠ Accent** — Secondary (`oklch(0.940 0.045 150)`) and accent (`oklch(0.930 0.035 150)`) are visually distinct. Accent is noticeably greener for hover feedback.
7. **Dark mode surface lift** — Card `oklch(0.22 0.008 150)` is visibly lighter than background `oklch(0.145 0 0)`. Border `oklch(0.30 0.015 150)` is visible hairline.
8. **Dark mode muted-foreground adjusted** — `oklch(0.62 0 0)` in dark mode (5.44:1 vs dark bg). Light mode stays `oklch(0.556 0 0)` (5.74:1 vs white).
9. **Dark mode destructive adjusted** — `oklch(0.62 0.22 27)` (lighter red) for AA compliance on dark surfaces.
10. **Manrope weight compensation** — Body default weight 500 (not 400). Manrope renders lighter than Inter.
11. **H6 = 16px (not 18px)** — Eliminates collision with Body P1 (18px). H6 distinguished by weight (600 vs 500).
12. **H2 = 40px (not 48px)** — Fixes over-large H2→H3 gap. Creates smoother scale: 64 → 40 → 32 → 24 → 20 → 16.
13. **Reduced radius: 6px base, 3px sm** — Geometric per baseten. `--radius-sm` raised from 2px to 3px for perceptibility.
14. **Fade animations: ease-out, 350ms** — Changed from linear/500ms. Matches entry easing guidelines. `animation-fill-mode: both` to prevent flash.
15. **Chart colors: staggered luminance** — Full-chroma palette with luminance staircase for colorblind distinguishability. Hues spread across wheel.
16. **Container max-width: 1296px** — Matched to baseten.co.
17. **Border-based depth over shadows** — Minimal shadow usage.
18. **Keep Lucide icons** — Brand icons for marketing only.
19. **Extended palette: Mint, Lime, Sand** — Social/banner accent colors outside the CSS token system. High-lightness, low-chroma variants that complement primary green without competing with it.
20. **Cream as warm off-white** — `oklch(0.95 0.02 85)` alternative to pure white for approachable marketing sections. Warmer hue (85) vs primary green hue (150).
21. **4-Colour Card System** — Green (Card), Green-100, Cream, Black for marketing card hierarchy. Each color is visually distinct; cards are clearly distinguishable at a glance.
22. **Extended palette NOT in CSS** — These colors are for marketing/social only. Website UI stays disciplined with semantic tokens. Prevents token bloat and keeps the CSS system focused.
23. **Green (Card) vs Primary** — Card system uses `oklch(0.85 0.14 150)` instead of primary `oklch(0.76 0.21 150)`. Higher lightness (0.85 vs 0.76) and lower chroma (0.14 vs 0.21) creates a pastel that blends harmoniously with Green-100 and Cream. Primary was too vivid next to the soft pastels.

### 12B. Changelog

```
## v1.3.1 - 2026-04-02
- Card system: replaced primary green with softer Green (Card) `oklch(0.85 0.14 150)` for pastel harmony
- Reordered visual: Cards + Bento Grid now appear before Colour Usage Map
- Added Mint, Lime, Sand to Print/Collateral usage map
- Fixed white social post logo variant (uses black favicon)
- Design decision 23 added

## v1.3.0 - 2026-04-02
- Added Section 1M: Extended Brand Palette (Mint, Lime, Sand, Cream, Green-100)
- Added 4-Colour Card System documentation (Green, Green-100, Cream, Black)
- Added social variety palette (Mint, Lime, Sand) alongside core social backgrounds
- Added Bento Grid layout pattern using 4-colour system
- Brand visual updated: 12 → 14 sections (added Cards + Bento Grid)
- Design decisions 19-22 added

## v1.2.0 - 2026-04-02
- Light-mode primary adjusted: oklch(0.813 0.219 150) → oklch(0.76 0.21 150) for better contrast with black foreground text
- Added --primary-hover token: oklch(0.69 0.21 150) light, oklch(0.75 0.219 150) dark
- Primary-text adjusted: oklch(0.50 0.219 150) → oklch(0.45 0.18 150) for stronger AA compliance
- Button default: hover changed from bg-primary/90 to hover:bg-primary-hover
- Button secondary: redesigned to bg-muted with border-border, hover:bg-accent hover:border-foreground/20
- Button link: updated to use primary-text/decoration-primary-text Tailwind tokens
- Selection indicators: standardized to bg-accent (selected) / hover:bg-muted/50 (unselected), no borders
- Billing interval/plan selectors unified to bg-accent text-accent-foreground
- Muted/accent opacity standardized to /50 across marketing components
- Fixed dark gradient in makerkit.css docs: rgba(108,228,124) → rgba(30,231,110)
- Updated ring, sidebar-primary, sidebar-ring, chart-1 light values to match new primary

## v1.0.0 - 2026-04-02
- Initial design system created
- Quality gate fixes applied:
  - Added --primary-text token for WCAG AA text compliance
  - Added --success token (teal) to avoid green collision with primary
  - Fixed dark mode muted-foreground, destructive, card, border values
  - Fixed type scale: H2 48→40px, H6 18→16px, body weight 400→500
  - Fixed animations: linear→ease-out, 500ms→350ms
  - Fixed radius-sm: 2px→3px
  - Separated secondary/accent tokens for visible hover feedback
  - Staggered chart color luminance for accessibility
  - Corrected pill/selection indicator docs to match actual code
  - Added Selected row to interactive state matrix
```

---

## Section 13: Completion Checklist

- [x] Color palette (light + dark)
- [x] Typography defined (including responsive scale and min font size)
- [x] Spacing scale documented
- [x] Radius scale
- [x] Motion & animation vocabulary defined
- [x] Responsive breakpoints and behavior documented
- [x] Logo assets exported (logo.svg, logo-dark.svg, logo-mark.svg, logo-mark-dark.svg)
- [x] Core component patterns documented (selection, buttons, badges, pills)
- [x] Interactive state matrix completed (hover, focus, disabled, loading, error, selected)
- [x] Form element patterns documented
- [x] Extended component patterns documented (cards, tables, toasts, navigation, pagination)
- [x] Accessibility rules verified (contrast, touch targets, reduced-motion, color independence)
- [x] Implementation map verified
- [x] Design decisions logged
- [x] Party mode reviews completed
- [x] Extended brand palette documented (Mint, Lime, Sand, Cream, Green-100)
- [x] 4-Colour Card System documented
- [x] Bento Grid layout pattern documented
- [ ] OG / social share image created (optional)
