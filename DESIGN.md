# Design: Ferri Yusra portfolio

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial
- Shape of the first page: Conversational FAQ (draw fd59c5), its hero an Index; `/deposit-alerting` and `/satusehat` are long documents under a Banner head
- Theme: Grid (deal 1/3, seed portfolio-backend-engineer-few-d334·6287e448·2026-11-05·r0)
- Axes: light/grotesk-sans/cool · posture: full-palette · one colourway (the white is the material; no dark mode)

## Tokens
`src/app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(97.5% 0.005 90);  --color-paper-2: oklch(94.2% 0.006 90);  --color-paper-3: oklch(90.5% 0.008 90);
  --color-ink: oklch(19% 0.022 266);  --color-ink-2: oklch(31% 0.02 266);  --color-muted: oklch(47% 0.016 266);  --color-rule: oklch(87.5% 0.008 90);
  --color-field: oklch(44% 0.2 266);  --color-field-ink: oklch(97.5% 0.005 90);
  --color-mark: oklch(57% 0.215 29);  --color-mark-ink: oklch(97.5% 0.005 90);  --color-focus: oklch(46% 0.2 266);
  --font-display: "Radio Canada Big", ui-sans-serif, system-ui, sans-serif;  --font-body: "Radio Canada", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 0;  --radius-pill: 0;  --rule-hair: 1px;  --shadow-card: none;  --tracking-display: -0.035em;  --display-weight: 700;
}
```
The faces are loaded by `next/font` in `layout.tsx` and reach the tokens as `--font-rcbig` and `--font-rc`. The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`. `globals.css` restates `.container { max-width: var(--container) }` because Tailwind v4's own `.container` utility would otherwise cap it at 1280px.

## Roles of colour
- Field, the ultramarine: a flood a sheet is printed on (the hero's figure, from the column-9 line to the bleed; the case page's front matter). The home page's case section, a control on this field, was removed on 2026-11-06.
- Mark, the Swiss red: what is chosen or current (the current employer, a hovered link, list marks) and the one red field (the contact question).
- Ink: type on paper and the primary control. Red never sits on the ultramarine, and two fields never touch.

## Composition
- Each section is a question hung from column 1 at the section size, its answer from column 6. The answer is one line; the depth folds into native `<details>` rows with hairlines between them, like table rows.
- No strokes part the sections: space, a change of paper or a field. Radius 0 and no shadow anywhere.
- About 450 visible words on the home page at most. New content goes inside a disclosure, not onto the page.

## Controls
- Primary: a square ink block with paper text, 52px tall, the same on paper and on either field; it opens the CV.
- Secondary: a word underlined at 1px that turns mark red on hover (field-ink on a field).
- The nav's CV is a small ink block in the floating pill.
- **Under 60rem the nav is a bar, not a float** (redesigned with Hallmark on 2026-11-06; until then a phone or tablet got the name and the CV and nothing else, and the floating name plate sat on top of headings). It is solid paper, 72px tall, with a hairline under it, so the page scrolls beneath it. It holds the wordmark plate, then a small pill holding "Menu" (the same chevron key as "Case studies") and the CV block. "Menu" opens a sheet of paper from the bar to the foot of the screen, also a native popover. The sheet lists Work, Projects and Contact set in the display face at 56px a row, then "Case studies" with the same rows as the desktop menu. Following a link closes it.
- The nav's "Case studies" is a key with a drawn chevron that opens a menu: a native popover (no script; light dismiss and Escape from the browser) anchored under the pill and exactly its width, paper-2 like the pill, one row per case in `src/data/cases.ts` (the name, then where and when), hairlines between rows. It opens at once. The case the reader is on is marked in the mark red. Without anchor positioning it hangs from the container's right gutter at 24rem.

## Motion
- Character: still, with one exception (below). A name or link turns red, a value at poster scale swaps in place (the hero's year), both in CSS alone. No parallax; under reduced motion every transition ends at once.
- Three primitives in all: the red hover, the in-place swap, and the one reveal. Never a fourth, and no scroll-scrubbed pattern beside the reveal (F8).

## Variants
- **The one reveal, 2026-11-05, at the owner's request.** Grid keeps still; this site runs Hallmark's one reveal (`craft.md` § 5, `patterns.md` "One reveal that survives no script"). Everything rises once into place, `rise` keyframes, `--dur-long` (420ms) on `--ease-out`, from transparent and 24px below (40px for the question heads and the headline, 48px for the hero's field).
- **The hero plays on load, in CSS alone,** so the first screen never waits for script. It is set like a sheet coming off the press, 0.82s in all (redesigned with Hallmark on 2026-11-06; it was one fade-up for every block):
  - at 0ms the ultramarine field is laid from the column-9 line to the bleed, a paper overlay shrinking to the right (`scaleX`, under 60rem the field is a band and does not lay);
  - from 40ms the headline's words are set, each rising out of its own baseline, 30ms apart;
  - at 160ms and 220ms the line and the actions settle 8px;
  - at 240ms the year and its caption rise out of the field's foot;
  - from 260ms the five names are set left to right, 35ms apart;
  - at 700ms the current name takes the mark red, the choice made last.
- "Rising out of a baseline" (`set`) moves `translate` and `clip-path` together so the clip edge holds still while the type passes it; nothing fades and nothing scales. The field rises as one block because its figures swap by `display`, which would replay an animation on every hover.
- **Every other block carries `data-reveal`:** each question and its answer line, the tool rows, the work rows, the two captures, the learning list and its head, every "more" disclosure, and the close's address, answer, actions and office. `reveal.tsx` adds `.is-in` the first time a block comes into view, and blocks that arrive together are staggered 60ms apart in page order, five steps at most.
- **Why it replaced the scroll pattern.** The site first ran scroll-choreography pattern 4, a sticky diptych scrubbed by `view()`. On a hard refresh the hero held still and in-view sections were drawn at their end state, so the owner saw no section arrive. A reveal plays in time, so a refresh shows it.
- **It survives no script.** Blocks are hidden only under `html[data-js]`, which an inline script in `layout.tsx` sets before the first paint, and only where IntersectionObserver exists and motion is allowed. Print, reduced motion and scripting off get the finished page. If the bundle never runs, a 3s failsafe shows every block. Blocks already scrolled past on a refresh get `.is-seen` and do not move.
- The case pages' long documents do not move; only its close, which is the same footer as the home page's, arrives.

## Exports
`src/app/tokens.css` in this project (a Tailwind v4 `@theme static` block, so the tokens are also utilities). `src/lib/palette.ts` reads it for the share card and the theme-colour meta tag.
