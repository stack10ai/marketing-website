# Stack10 Marketing Website

## Project Overview
Marketing website for Stack10 — an enterprise AI consulting firm based in Australia.

- **Tech**: Astro + React Islands + Tailwind CSS. Build with `npm run build`, dev server with `npm run dev`.
- **Styling**: `css/design-system.css` is the single source of truth. Tailwind maps to design system CSS custom properties.
- **Brand**: Green (#1EE76E), Black, White. Design reference: baseten.co
- **Fonts**: Manrope (sans-serif), JetBrains Mono (monospace) — loaded from Google Fonts
- **Dark mode**: Supported via `.dark` class on `<html>` + `data-theme` attribute + `prefers-color-scheme` media query
- **Deployment**: DigitalOcean App Platform, single app, `main` branch = production
- **Repo**: `stack10ai/marketing-website` on GitHub

### Project Structure
```
src/
  components/    # React .tsx components (interactive islands)
  layouts/       # Astro layout templates
  pages/         # Astro pages (.astro files)
  styles/        # Global CSS (imports design-system.css)
css/             # Design system tokens (design-system.css)
public/          # Static assets (logos, favicons)
```

## 21st.dev Magic MCP Workflow

The project uses the 21st.dev Magic MCP for generating production-ready React/Tailwind components.

### How to Use
1. Use the `@21st-dev/magic` MCP `/ui` command to search or generate components:
   ```
   /ui create a modern pricing section with gradient background
   ```
2. The MCP generates a `.tsx` file with React + Tailwind code.
3. Place the component in `src/components/`.
4. Import into `.astro` pages with a client directive:
   ```astro
   ---
   import PricingSection from '../components/PricingSection.tsx';
   ---
   <PricingSection client:visible />
   ```

### Client Directives
- `client:load` — hydrate immediately (above the fold, interactive nav)
- `client:visible` — hydrate when scrolled into view (sections, cards)
- `client:idle` — hydrate when browser is idle (low-priority)

### Post-Generation Checklist
After generating a component with the MCP:
1. Replace any hardcoded colors with design system CSS custom properties
2. Ensure dark mode works by using semantic tokens (not primitives)
3. Replace Tailwind color utilities with design system class equivalents where they exist
4. Test in both light and dark mode

## Rules

### Always
- Use design system classes from `css/design-system.css` — never raw Tailwind utilities
- Test every page in both light AND dark mode
- Use Playwright to screenshot and verify changes before committing
- Reference `brand-guidelines.md` for color values, typography, and accessibility requirements
- Use `design-system-preview.html` as the living reference for all components
- Keep HTML readable — never commit minified single-line HTML

### Never
- Add inline `style=""` attributes — use design system classes or extend the CSS
- Use hardcoded color values — always reference CSS custom properties
- Skip dark mode — every component must work in both themes
- Use `oklch(from ...)` relative color syntax — limited browser support, use explicit values
- Re-declare theme-dependent tokens in the Layer 3 `:root` block — this causes cascade bugs where light mode values override `.dark` overrides

## Design System Architecture

### Three-Layer Token System
```
Layer 1: Primitives    →  Raw values (--green-500, --gray-700, --radius-6)
         ↓
Layer 2: Semantic      →  Purpose aliases (--primary, --background, --border)
         ↓
Layer 3: Component     →  Per-component overrides (--btn-bg, --input-border, --card-radius)
```

**Critical rule**: Color tokens that change between light/dark mode belong in Layer 2 (semantic). Layer 3 should only contain non-theme-dependent values (sizes, spacing, radius). Putting color values in Layer 3's `:root` block will override `.dark` class overrides due to CSS specificity.

### File: `css/design-system.css`

### Primitives (Layer 1)
```
Green scale:  --green-50 through --green-900  (oklch, hue 150)
Gray scale:   --gray-0 through --gray-1000    (oklch, true gray, no blue undertone)
Status:       --red-500, --red-400, --teal-500, --teal-400, --orange-500, --blue-500
Card palette: --palette-green, --palette-mint, --palette-lavender, --palette-sand, --palette-peach, --palette-cream
Spacing:      --space-1 (4px) through --space-24 (96px)
Radius:       --radius-3 through --radius-full
Shadows:      --shadow-1, --shadow-2, --shadow-3
Durations:    --dur-100, --dur-200, --dur-350
Typography:   --size-xs through --size-6xl, --weight-300 through --weight-800
```

### Semantic Tokens (Layer 2) — these swap in dark mode
```
Primary:      --primary, --primary-foreground, --primary-hover, --primary-text
Secondary:    --secondary, --secondary-foreground
Accent:       --accent, --accent-foreground
Muted:        --muted, --muted-foreground
Status:       --destructive, --success, --warning, --info (each with -foreground)
Surfaces:     --background, --foreground, --card, --card-foreground, --popover, --popover-foreground
Chrome:       --border, --input, --ring
Cards:        --card-green, --card-mint, --card-lavender, --card-sand, --card-peach, --card-cream
Card text:    --card-text (headings/body), --card-text-muted (captions)
Nav:          --nav-bg, --nav-fg, --nav-hover-fg, --nav-dropdown-bg, etc.
```

### Component Tokens (Layer 3) — non-color overrides only
```
Button:  --btn-height, --btn-px, --btn-py, --btn-radius, --btn-font-size
Input:   --input-radius, --input-font-size, --input-px, --input-py
Card:    --card-radius, --card-padding
Badge:   --badge-radius, --badge-px, --badge-py, --badge-font-size
Nav:     --nav-height, --nav-blur, --nav-max-width, --nav-font-size, --nav-dropdown-radius
```

## Component Classes

### Buttons
```html
<button class="btn btn-primary">Primary CTA</button>
<button class="btn btn-outline">Secondary</button>
<button class="btn btn-secondary">Muted</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-destructive">Danger</button>
<button class="btn btn-link">Link</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-icon">+</button>
```

### Badges
```html
<span class="badge badge-default">Default</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-destructive">Error</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-info">Info</span>
```

### Cards
```html
<!-- Default card -->
<div class="card">Content</div>
<div class="card card-clickable">Hover shows green border</div>

<!-- Marketing pastel cards (6 colors, WCAG AA text) -->
<div class="card card-green">Green (H:150)</div>
<div class="card card-mint">Mint (H:185)</div>
<div class="card card-lavender">Lavender (H:280)</div>
<div class="card card-peach">Peach (H:50)</div>
<div class="card card-sand">Sand (H:85)</div>
<div class="card card-cream">Cream (H:95)</div>

<!-- Card text utilities -->
<p class="card-text-muted">Muted caption on any card</p>
```

### Form Inputs
```html
<label class="label">Field name</label>
<input class="input" placeholder="Text">
<input class="input input-error" value="Invalid">
<p class="help-text">Helper text</p>
```

### Navigation
```html
<nav class="nav-header scrolled">
  <div class="nav-inner">
    <!-- Logo -->
    <div class="nav-dropdown-trigger">
      <a class="nav-link">Menu <svg class="nav-chevron">...</svg></a>
      <div class="nav-dropdown">
        <div class="nav-dropdown-panel">
          <div class="nav-dropdown-grid nav-dropdown-grid-2">
            <div class="nav-dropdown-category">Section</div>
            <a class="nav-dropdown-item">
              <div class="nav-dropdown-item-title">Title</div>
              <div class="nav-dropdown-item-desc">Description</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <a class="nav-link">Simple Link</a>
    <a class="nav-link nav-link-active">Active Link</a>
    <div class="nav-actions">
      <button class="btn btn-primary btn-sm">CTA</button>
    </div>
  </div>
</nav>

<!-- Mobile -->
<div class="nav-mobile-overlay open">
  <a class="nav-mobile-link">Link</a>
</div>
<button class="nav-hamburger">Menu</button>
```

### Typography
```html
<h1 class="h1">Display heading (4rem, 800)</h1>
<h2 class="h2">Section heading (2.5rem, 700)</h2>
<h3 class="h3">Sub-section (2rem, 600)</h3>
<h4 class="h4">Card title (1.5rem, 600)</h4>
<h5 class="h5">Small heading (1.25rem, 600)</h5>
<h6 class="h6">Label (1rem, 600)</h6>
<p class="p1">Primary body (1.125rem, 500)</p>
<p class="p2">Secondary body (1rem, 500)</p>
<span class="caption">Caption (0.875rem)</span>
<span class="overline">OVERLINE LABEL (0.75rem, uppercase)</span>
<p class="prose">Max-width 65ch for readability</p>
```

### Layout
```html
<div class="container">Max-width 81rem, centered, responsive padding</div>
<section class="section">Vertical padding (4rem / 6rem at md)</section>
```

### Animation
```html
<div class="animate-fade-up delay-1">Fades in from below (100ms delay)</div>
<div class="animate-fade-down delay-3">Fades in from above (300ms delay)</div>
<!-- Delays: delay-1 through delay-5 (100ms increments) -->
```

### Utilities
```html
<div class="gradient-line"></div>  <!-- Decorative separator -->
<span class="sr-only">Screen reader only</span>
<div class="skeleton"></div>  <!-- Loading placeholder with pulse -->
```

## Dark Mode

### How it works
1. OS preference detected via `@media (prefers-color-scheme: dark)`
2. Manual toggle via `.dark` class + `data-theme="dark|light"` on `<html>`
3. `data-theme="light"` overrides OS dark preference (critical for toggle to work)

### Toggle script pattern
```javascript
// Detect OS preference on load
(function() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

// Toggle function
function toggleTheme() {
  const html = document.documentElement;
  const isCurrentlyDark = html.getAttribute('data-theme') === 'dark' ||
    (!html.hasAttribute('data-theme') && html.classList.contains('dark'));
  if (isCurrentlyDark) {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  } else {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  }
}
```

## Text Selection
Text selection uses brand green — defined globally in design-system.css via `::selection`.

## Key References
- `css/design-system.css` — design system source of truth
- `design-system-preview.html` — live preview of all components (open at `/design-system-preview.html`)
- `brand-guidelines.md` — full brand identity, color values, accessibility rules
- `brand-guidelines-visual.html` — visual brand reference

## Git Workflow
- `main` — production (deploys to www.stack10.ai via DigitalOcean)
- `staging` — staging branch
- `feature/*` — feature branches, PR into staging
- Branch protection on main: requires 1 approving review
