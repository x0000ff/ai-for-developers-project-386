# DESIGN.md

Design system reference for the Callbook frontend.

## Color Palette (CSS variables in `landing.css`)

| Variable        | Value                        | Usage                          |
|-----------------|------------------------------|--------------------------------|
| `--bg`          | `#f2ede6`                    | Page background (warm beige)   |
| `--bg-nav`      | `rgba(242, 237, 230, 0.85)`  | Navbar (semi-transparent)      |
| `--border`      | `#d9d0c4`                    | Borders, dividers              |
| `--fg`          | `#1c1917`                    | Primary text (warm near-black) |
| `--fg-muted`    | `#78716c`                    | Secondary / hint text          |
| `--accent`      | `#c97a1a`                    | Amber — CTAs, icons, badges    |
| `--accent-hover`| `#a86015`                    | Hover state for accent         |
| `--accent-fg`   | `#ffffff`                    | Text/icons on accent background|

Always use these variables — never hardcode colors.

## Typography

- Font: **DM Sans** via `var(--font)` — always set `fontFamily: 'var(--font)'`
- Headings: `fontWeight: 700`, `letterSpacing: '-0.04em'`
- Body: `fontWeight: 400`, `fontSize: 14–16`
- UI labels / buttons: `fontWeight: 500–600`, `letterSpacing: '-0.01em'` to `'-0.02em'`
- Hero headline: responsive with `clamp()` — e.g. `clamp(3rem, 7.5vw, 5.5rem)`

## Layout

- Max content width: `1200px`, centered with `margin: '0 auto'`
- Side padding: `24px`
- Navbar height: `64px`; main area min-height: `calc(100vh - 64px)`
- Full-page sections: `minHeight: '100vh'`

## Components

**Navbar (`Navbar.tsx`)**
- Sticky, `top: 0`, `zIndex: 100`
- `borderBottom: '1px solid var(--border)'`, backdrop blur (`blur(10px)`)
- Logo: 36×36 accent square (`borderRadius: 8`), white lucide icon inside
- Nav buttons: outlined (`nav-btn-outline`) or accent (`nav-btn-accent`) CSS classes

**Buttons**
- `display: 'inline-flex'`, `alignItems: 'center'`, `gap: 10`
- `borderRadius: 8`, `padding: '14px 28px'` (primary) / `'10px 20px'` (secondary)
- Always include a lucide icon alongside text
- Primary CTA: `background: 'var(--accent)'`, `color: 'var(--accent-fg)'`, class `cta-btn`
- Hover/active states are handled via CSS classes in `landing.css`

**Icon Boxes**
- Page hero icons: 64×64, `borderRadius: 16`, accent background, white icon (size 28)
- Navbar logo icon: 36×36, `borderRadius: 8`, accent background, white icon (size 18)

**Badge / Tag**
- `border: '1px solid var(--accent)'`, `borderRadius: 6`, `padding: '5px 12px'`
- `fontSize: 11`, `fontWeight: 600`, `letterSpacing: '0.09em'`, `textTransform: 'uppercase'`
- Include a small lucide icon (size 11) before text

## Animations

- Entrance animation: `fadeUp` keyframe (defined in `landing.css`) — fades in + slides up 16px
- Apply via inline style: `animation: 'fadeUp 0.45s ease both'`
- Stagger delays across elements: `0ms → 80ms → 240ms → 320ms`

## Icons

Use **lucide-react** exclusively. Common icon sizes: 11 (badge), 14–15 (body/nav), 16–18 (buttons/logo), 28 (page heroes). Always set `strokeWidth={2}` or `strokeWidth={1.75}`.

## Page Patterns

**Landing (`LandingPage.tsx`)** — hero layout, left-aligned, vertically centered:
`Badge → H1 (clamp size) → CTA button → Feature row (icon + label chips)`

**Placeholder pages (`BookCallPage`, `AdminPage`)** — centered both axes:
`Icon box (64×64) → H1 → muted paragraph → "Go home" link`

All pages wrap content in `<Navbar />` + `<main>` with the standard max-width container.
