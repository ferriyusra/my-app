# Design: Ferri Yusra portfolio

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: Workbench (draw 695238), its hero a Ledge; `/deposit-alerting` and `/satusehat` are long documents under a Banner head
- Theme: Blueprint, the cyanotype sheet (deal 2/3, seed portfolio-backend-engineer-jakarta-4284·6287e448·2026-11-06·r0), the fourth Hallmark run on this site after Cobalt, Console and Grid (2026-11-05)
- Axes: mid/geometric-sans/neutral · posture: drenched · one colourway (the blue sheet is the material; there is no light or dark mode)

## Tokens
`src/app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(35% 0.105 256);  --color-paper-2: oklch(31% 0.10 257);  --color-paper-3: oklch(26.5% 0.095 258);
  --color-ink: oklch(97% 0.012 240);  --color-ink-2: oklch(90% 0.025 242);  --color-muted: oklch(80% 0.045 244);
  --color-rule: oklch(93% 0.02 240 / 0.85);  --color-rule-2: oklch(93% 0.02 240 / 0.32);
  --color-grid: oklch(97% 0.01 240 / 0.09);  --color-grid-2: oklch(97% 0.01 240 / 0.2);
  --color-accent: the ink;  --color-accent-ink: oklch(33% 0.105 256);  --color-focus: the ink;
  --font-display: "Chakra Petch";  --font-body: "IBM Plex Sans";  --font-outlier: "IBM Plex Mono";
  --radius-card: 0;  --radius-pill: 0;  --rule-hair: 1px;  --rule-heavy: 2px;  --shadow-card: none;
  --tracking-display: -0.012em;  --display-weight: 600;  --sheet-inset: 20px;  --tick: 14px;
}
```
The faces are loaded by `next/font` in `layout.tsx` and reach the tokens as `--font-chakra`, `--font-plex` and `--font-plexmono`. The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`. `globals.css` restates `.container { max-width: var(--container) }` because Tailwind v4's own `.container` utility would otherwise cap it at 1280px, and sets `--nav-h: 72px`.

## Type
- Chakra Petch 600 for every head: h1 and h2 in capitals (CSS `text-transform`, the source stays sentence case) at line-height 1.02, h3 in sentence case.
- IBM Plex Sans 400 for prose, 500 for labels and controls, nothing lighter.
- IBM Plex Mono 500 only for what was measured or written by a system: a date range, a figure, a dimension's ends, code. Never a label, a head or a control.
- Labels, captions and meta: Plex Sans 500 a step smaller, sentence case, untracked.

## Surfaces
- Lines, not layers: 1px `--color-rule` keylines on every surface, a second keyline in `--color-rule-2` 5px inside a capture, a `--rule-heavy` line under every section head. Radius 0, no shadow; depth is a second line, a heavy line or a one-step darker ground.
- The drafting grid (24px minor, 120px major, offset by `--sheet-inset`) only under a drawing.
- Two grounds below the sheet: `--color-paper-2` for the Work register and the first sheet's plate, `--color-paper-3` for the service box in the drawing.
- Captures print as cyanotypes inside the double keyline: grayscale and a little contrast, screened onto `--color-paper-3`, so the darks print in the sheet's blue and the lights in a white just short of the ink (globals.css overrides the scaffold's lighten overlay, which left the mid-greys grey).

## Composition (the home page, in order)
1. **Hero, a Ledge.** The deposit-alerting system drawn as a blueprint on a plate a step darker than the sheet, filling every pixel the head leaves; its title block (Drawing, Built at, Write-up) beneath; the headline at the base on columns 1 to 8, the line and the two keys on 9 to 12. The drawing is always drawn wide (at least 60rem): on a phone it pans sideways. The reads and the writes are joined to the service by lines, as the write-up states it.
2. **Where.** A register of four keylined cells: Based, Open to, Hours, Status.
3. **Work, five teams since 2021,** on `--color-paper-2`: the career as a dimension string (its two real ends, Oct 2021 and Now, and its length in years above it), then the five roles as register lines, the dates in mono on the left, then the key to the Meditap case study.
4. **In production at SATUSEHAT.** The two captures side by side at one height (their widths from their aspect ratios), each with its fact as a caption and its disclosure; the key to `/satusehat`; the six built to learn as a two-column index.
5. **Tools, by years of use.** A short keylined list and its "where I used each" disclosure.
6. **Contact in Jakarta, GMT+7.** The address set at display size, the two keys, the links elsewhere, the "now" disclosure; then the title block (Drawn by, Role, Revised) as the footer.

Section heads are in the specification voice: the noun the nav uses, then a fact from the owner's data (the number of teams and the first year, the city and the time zone), each over a heavy line with its one-line answer on the right. There is no case-studies section: the cases are reached from the nav's menu, from the hero's title block and from the key under each section they belong to (the finish review found a section that only repeated the Work rows, the tools and three other links). About 450 visible words on the home page at most (about 420 now); depth folds into native `<details>`. Sections are 96px apart top and bottom.

## Controls
- Primary: an ink-filled square key with sheet-coloured text, 48px, Plex Sans 500; it opens the CV in the hero and the close, and as a 44px key in the nav.
- Secondary: the same key outlined in 1px ink.
- Links: ink with a 1px underline that clears on hover.
- The nav is an edge-aligned bar, 72px, a hairline beneath: the wordmark in capitals at one edge, Work, In production, the "Case studies" menu key and Contact, then the CV key, at the other. "Case studies" opens a native popover of every case, anchored under the keys. Under 60rem the sections move into a full-height "Menu" sheet.

## Motion
- Character: drafted and still once drawn. A link's underline clears, a keylined row's ground darkens a step, a disclosure's chevron turns.
- Three primitives in all: the hover (underline or ground), the chevron, and the one reveal. Never a fourth, and no scroll-scrubbed pattern.

## Variants
- **The one reveal, at the owner's request** (it predates this theme: Blueprint itself is static). On load, in CSS alone and in about 0.8s, the first sheet draws itself: the system's boxes appear in the order the write-up reads them (25ms apart), each arrow draws on from its tail, the joining lines and the title block follow, the headline's words are set from their own baselines (translate and clip-path together) from 200ms, and the line and the keys settle 8px last. Every block marked `data-reveal` settles 8px once as it is first seen, through `reveal.tsx`, gated by the inline script in `layout.tsx` with a 3s failsafe. Visible with scripting off, in print and under reduced motion.

## Exports
`src/app/tokens.css` in this project (a Tailwind v4 `@theme static` block, so the tokens are also utilities). `src/lib/palette.ts` reads it for the share card and the theme-colour meta tag.
