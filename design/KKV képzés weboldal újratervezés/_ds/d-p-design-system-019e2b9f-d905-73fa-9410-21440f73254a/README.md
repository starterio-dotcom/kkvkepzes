# DÁP Design System

A complete design system for **Digitális Állampolgárság Program** — the Hungarian government's *Digital Citizenship Program* and the unified design language behind **magyarorszag.hu** and the official DÁP mobile app.

Hungary's government uses this single design system across every citizen-facing digital surface — informational websites, transactional ügyintézés (administration) flows, the mobile wallet for IDs and official letters, even the gov.hu "official site" badge embedded on partner pages. The brand mark is the lowercase **iD** lockup (a stylised *i* + *D*, the abbreviation of *Digital iDentity* / *Digitális ID*).

## Sources

- **Figma:** `Design System_1.3.fig` (mounted at `/`), file size 84 pages, 648 frames. Top-level breakdown:
  - `Cover` · `Changelog` · **`FOUNDATIONS`** (Color, Color-modes, Size, Elevation, Typography, Illustration)
  - **`D-P`** brand pages (brand-guidelines, sign-in-button, logo, badge, mobile-dashboard, splash-screen, official-banner)
  - **`COMPONENTS`** — Accordion, Avatar, Badge, Breadcrumb, Button, Callout, Checkbox, Content-switcher, Date-picker-field, Dialog, Divider, Dropdown, Feedback-message, Label, Link, List-item, Loading-spinner, Menu, Number-field, Password-field, Radio-button, Search-field, Switch, Table, Tab, Text-field, Textarea
  - **`PATTERNS`** — 404, Help-center, Hero-section, Header, File-upload, Media-card, Language-selector, Footer-section, Timeline, Pagination, Cookie-popup
  - **`ICONS`** — *Remix Icon* library re-rendered as Figma components (Arrows, Buildings, Business, Communication, Custom, Design, Development, Device, Document, Editor, Finance, Food, Header, Health-and-medical, Logos, Map, Media, Others, System, Users-and-faces, Weather), plus Country-icons (27 countries) and the Hungarian Coat-of-Arms
- **Production sites:** [magyarorszag.hu](https://magyarorszag.hu/), the *DÁP mobil* app (Android & iOS)
- **Original library name:** *DÁP Design System / UI kit*, v1.3

---

## File index

```
README.md                  ← this file
SKILL.md                   ← packaged skill instructions
colors_and_type.css        ← all design tokens (colors, type, spacing, radii, shadows, focus)

assets/
  logo-dap-lockup.svg      ← full "iD / Digitális Állampolgárság Program" lockup
  logo-id-mark.svg         ← iD mark only (no wordmark)
  logo-dap-mark-ring.svg   ← decorative gov.hu encircled mark
  photo-portrait-1..5.png  ← stock portraits used in Figma placeholders
  icons/                   ← (icons live in CDN — see Iconography below)

preview/                   ← cards rendered in the Design System tab
  brand-logo.html
  color-indigo.html · color-cold-grey.html · color-semantic-{blue,green,orange,red}.html
  semantic-roles.html · color-accents.html
  type-family.html · type-headings.html · type-body.html
  spacing-scale.html · radius.html · elevation.html
  buttons.html · badges.html · form-fields.html · controls.html · callouts.html · cards.html
  iconography.html

ui_kits/
  citizen-portal/          ← magyarorszag.hu (web)
  mobile-app/              ← DÁP mobile companion app
```

---

## Content fundamentals

**Language.** All copy is in **Hungarian**. The system is bilingual-ready (the `Language-selector` pattern is built in), but every default string in the Figma is Hungarian.

**Tone.** Plain, warm, calm. The system explicitly rejects bureaucratic legalese. Sentences are short. Headings are declarative — *"Egyszerű ügyintézés, online."* / *"Hogyan tudunk segíteni?"* — never marketing-y or exclamation-heavy.

**Person.** Second-person singular informal ("**te**" form). Verbs end in -j / -d / -sz: *"Lépj be Ügyfélkapuval"*, *"Töltsd ki az űrlapot"*, *"Csatold a dokumentumot"*. The familiar form was a deliberate choice — Hungarian government services historically used the formal "Ön" form, and DÁP signals modernisation by dropping it.

**Sentence case.** Headings and body are always sentence case. UPPERCASE is reserved for **eyebrow labels** (e.g. `MAGYARORSZAG.HU`, `SZEMÉLYAZONOSÍTÓ`) and **section keys** in sidebars (e.g. `EZEN AZ OLDALON`, `SZÜKSÉGES`). Never use Title Case For Headings.

**Numbers, dates and IDs.** Dates always use the Hungarian format `YYYY. MM. DD.` (e.g. `2026. 04. 12.`). Phone numbers like the citizen helpline `1818` are always presented bare, never with a `+36` prefix. Document numbers in mono.

**Microcopy samples.**

| Surface | Hungarian | English (for our reference) |
| --- | --- | --- |
| Hero | *Egyszerű ügyintézés, online.* | Simple administration, online. |
| Search placeholder | *Keresés a szolgáltatások között* | Search the services |
| CTA | *Vissza a főoldalra* | Back to home |
| Error 404 | *OOPS! Technikai probléma.* | OOPS! Technical issue. |
| Footer security badge | *Magyarország hivatalos weboldala.* | The official website of Hungary. |
| Login | *Belépés Ügyfélkapu+ azonosítással* | Sign in with Ügyfélkapu+ |
| Empty state hint | *Az állam veled van.* | The state is with you. |

**Emoji.** Never. The brand system has zero emoji in the entire 84-page Figma file.

**Greetings.** The mobile app greets the user with the casual *"Üdv újra!"* ("welcome back!") followed by their formal name. The first name is in Hungarian order (family name first): "Kovács Anna".

---

## Visual foundations

### Brand colours

- **Primary brand:** `#4258ED` — the same exact indigo used by the Hungarian government across all DÁP surfaces. It is named **Indigo 900** in the foundation, and aliased as `--brand`.
- **Indigo scale** runs 20 stops, from `#f0f3ff` (100, surfaces) to `#030616` (2000, deep backgrounds). The scale numbering is in **hundreds** (100, 200, 300… 2000), not the more common 50-900.
- **Neutral** is *Cold Grey* — a slightly blue-tinted grey, never pure black. Pure black is reserved for status-bar glyphs only.
- **Semantic palettes** are full 20-step scales of Blue (informative), Green (positive), Orange (warning) and Red (negative). All are slightly muted and high-contrast at the `900` step.
- **Accent palettes** (Teal, Azure, Violet) exist only for data viz and decorative illustration. They are *not* used in core UI.

### Typography

- **Family:** **Inter** for everything (`primary` and `secondary` both = Inter). Roboto + Roboto Mono show up in a tiny number of legacy / utility places but are not used in new work.
- **Weights actually used:** Medium 500 (body, labels) and Bold 700 (headings, buttons, badges). Regular 400 is not part of the system.
- **Scale:** named t-shirt sizes from `2xs` (10) up to `12xl` (74). Common in-product sizes are 14, 16, 18, 20, 32, 40.
- **Tracking:** `-0.02em` on every heading 24 px and up (this is the most distinctive type detail of the system). Body has no tracking adjustment.
- **Line-height:** `1.25` for headings, `1.5` for body.

### Spacing

- A pure **4-px grid**. Tokens are named `100` (4 px), `200` (8 px), `300` (12 px) and so on up to `6000` (240 px). Gaps in the scale (no 900, 1100, 1300…) are intentional — those values are forbidden.

### Radius

- Six steps only: **0, 2, 4, 8, 16, 24** plus `full` (9999).
- **Inputs** use 8. **Cards** use 16. **Hero panels** use 16 or 24. **Buttons** are always fully rounded pills.

### Elevation

- Six tiers `100`→`600` for floating things, and six negative tiers `-100`→`-600` for inset effects (the system has explicit *negative* elevation, which is unusual).
- Shadow recipe: a stack of two `rgba(0,0,0,0.06)` + `rgba(0,0,0,0.08)` shadows. Never tinted. Never coloured.

### Borders & focus

- **Border widths:** only 1 and 2 px.
- **Focus ring:** a double-layer halo — 2 px white + 2 px brand — applied to every interactive element. Implemented as `box-shadow: 0 0 0 2px var(--canvas), 0 0 0 4px var(--brand)`.

### Imagery

- **Photography** in the Figma is warm-toned, lit naturally, mostly portrait. People are shown in everyday clothing — never in suits, never staged. Subjects represent ordinary Hungarians (working-age, multi-generational, smiling but not toothy).
- **No b&w**, **no grain**, **no gradient maps** over photos.
- **No hand-drawn illustration** is included in the brand assets — illustration usage in the system is bespoke per pattern (404, Hero) and we treat it as out-of-scope until provided.

### Backgrounds & layout

- The hero on every primary page uses a **flat indigo `#4258ED` background**, occasionally enriched with a subtle radial gradient toward `Indigo 1200`. There are no patterns, no textures, no images bleeding behind text.
- Page bodies sit on `Cold Grey 200` (`#F5F7FA`) — the canonical "panel" colour.
- Cards live on **pure white** with elevation-200. Nested cards are never used — depth is conveyed by elevation, not by border or tint.
- Max content width is **1320 px**; max title-block width is **960 px**. Side gutters at desktop are 24 px.

### Motion

- **Animations are restrained.** No bounces, no springs. Transitions on hover / focus use `200 ms ease-out`. Modals fade + 4-px translate in.
- **No parallax**, **no scroll-jacking**, **no auto-playing video** — gov.hu accessibility rules forbid them.

### States

- **Hover** → backgrounds darken one step (e.g. `indigo-900` → `indigo-1000`); text colour does not change.
- **Press** → no scale, no shrink. The button gets `inset` elevation-200 instead of dropping. This is unusual and worth flagging — *the design system explicitly disallows scale-on-press*.
- **Disabled** → 40% opacity + neutral surface fill + neutral-700 text.
- **Loading** → a 24-px circular spinner in `--brand`, no skeleton overlays in the system.

### Corner & shape vocabulary

- **Buttons:** pills (full rounding).
- **Inputs:** 8 px corners, 2 px border.
- **Cards:** 16 px corners, 1 px alpha-5 border or elevation-200.
- **Badges:** pills, 4 / 10 padding.
- **Sheets / modals:** 24 px corners (mobile), 16 px (desktop).
- **Hero panels:** 0 (full-bleed) or 24.

---

## Iconography

The Figma's icon page is a **complete copy of [Remix Icon](https://remixicon.com/)** — a 3000+ icon set with paired `-line` and `-fill` variants. Every icon component in the file is named like `IconArrowLeftLine`, `IconCheckLine`, `IconCarLine` — exactly the Remix Icon naming convention.

**What we ship.** We don't bundle the icon font. Every preview, ui kit and slide in this design system pulls Remix Icon from CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css">
<!-- usage -->
<i class="ri-arrow-left-line"></i>
<i class="ri-shield-check-fill" style="color: var(--brand);"></i>
```

**Icon sizing tokens.** Use `--icon-xsmall / small / base / medium / large` (12 / 16 / 20 / 24 / 32 px). 24 px is the default body-icon size; 16 px is the default label-icon size.

**Logos & special marks.** The DÁP "iD" mark and the lockup are real SVGs we ship in `assets/`. The Hungarian Coat-of-Arms also has a dedicated Figma frame; copy it from `/Hungarian-Coat-of-Arms` if needed.

**Country flags.** The Figma includes 27 country-flag icons (for the language selector). Pull from `/Country-icons/` on demand; we don't bundle them by default.

**Emoji.** Never used in the system.

---

## How designs are made

When building a new screen:

1. Start with **`Header`** + **`OfficialBanner`** at the top.
2. Use the **brand hero** (`#4258ED` flat) for marketing-style pages, and `Cold Grey 200` panels for in-app pages.
3. Compose with the **components in `ui_kits/`**. Don't invent new visual primitives; if you need something new, propose it as an addition to the system.
4. Body copy at 16 px medium, headings at the named scale step.
5. End every flow with a `Footer` (web) or `TabBar` (app).

If a brand asset is missing (illustration, splash, etc), leave a labelled placeholder rather than improvising.

---

## Caveats

- **Font substitution:** Inter is loaded from Google Fonts. If you want pixel-perfect alignment with the Figma binary, drop the foundry-original TTFs into `fonts/` and update `colors_and_type.css`.
- **Icon library:** the Figma re-renders Remix Icon — we link the official Remix Icon CDN rather than re-rendering the SVGs. The names match 1:1 with the figma components (`IconArrowLeftLine` → `ri-arrow-left-line`).
- **Splash screen** (Figma `D-P-splash-screen`) was empty in the export; not modelled. Same for some PATTERNS frames.
- The 20-step palette `hex` values are reconstructed from the figma screenshot of the Color foundations page. If the gov.hu team has the canonical hex tokens, please drop them in — we'll re-align `colors_and_type.css`.
