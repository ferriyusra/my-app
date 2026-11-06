# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run the unit tests
```

Tests run on Node's built-in runner with native type stripping. There is no
test dependency and no config: adding a file matching `src/**/*.test.ts` is
enough for `npm test` to pick it up.

Two of them check the repository rather than the runtime, because the bugs
they guard cannot be reached from a running page. `src/lib/repo.test.ts` reads
the component tree as text and fails when an icon component name is left
sitting in prose. `src/data/data.test.ts` pins the `projects` ↔ `skills` name
join, which fails silently rather than loudly: a tool spelled "Golang" in one
file and "Go" in the other simply drops out of the evidence.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss`, used for the reset and to
  emit the tokens (`tokens.css` is an `@theme static` block). All styling is
  hand-written CSS in [src/app/globals.css](src/app/globals.css).
- **next/font** self-hosts one neo-grotesque in two optical cuts: Radio Canada
  Big for heads, figures and the index, Radio Canada for the body.
- **LineIcons**, vendored as generated components in
  [src/components/icons/line-icons.tsx](src/components/icons/line-icons.tsx).
  Neither npm package works here (`lineicons-react` bundles React 18,
  `react-lineicons` touches `document` at import). Regenerate from
  `scratchpad/gen/line-icons.mjs`; do not hand-edit the file. The site uses one
  icon, on the Download key.

No other runtime dependencies. No environment variables.

## What this is

A portfolio for a backend engineer: **one server-rendered page and two case
studies**, all static.

- `/` ([src/app/page.tsx](src/app/page.tsx)), an interview: the five places
  worked as an index on the first sheet, then the questions a hiring manager
  would ask (which tools and where, who have you built for since 2021, what
  did you ship for SATUSEHAT, how do I reach you in Jakarta), each answered in
  a line with the
  depth folded beneath and the question pinned beside it.
- `/deposit-alerting` ([src/app/deposit-alerting/page.tsx](src/app/deposit-alerting/page.tsx)):
  the case study as a long document, with the system diagram and the
  questions the write-up does not answer.
- `/satusehat` ([src/app/satusehat/page.tsx](src/app/satusehat/page.tsx)):
  a rough case study of the SATUSEHAT work across two roles (GovTech Health,
  then INA Digital), written from the owner's memory, in the same document.

**Until 2026-11-05 this was a Windows 11 desktop shell** (draggable windows, a
taskbar, Start, a desktop cat, Career.exe). The owner had it deleted outright
and the site rebuilt with the Hallmark design skill. The shell is in git
history, not in the tree; do not resurrect pieces of it.

## The design system

The site is designed with [Hallmark](https://github.com/Nutlope/hallmark),
installed as a Claude Code skill (`npx skills add nutlope/hallmark -g`, so it
lives in `~/.claude/skills/hallmark`, not in this repo). It ran three times on
2026-11-05: Cobalt (light, Index-First), then Console (dark, Letter), then,
because the owner found Console too wordy, the **Grid** theme (genre
editorial, shape Conversational FAQ, hero Index). The system is locked in
[DESIGN.md](DESIGN.md); read it before changing anything visual.
`.hallmark/log.json` records the runs, so the next deal steers away from them.

**Keep the page short.** The owner's complaint that started the Grid run was
"too much text". The home page shows about 430 words; everything else sits in
native `<details>` rows. Add depth inside a disclosure, never onto the page.

- [src/app/tokens.css](src/app/tokens.css) is the only place a colour, a face,
  a radius or a shadow is defined, in one light colourway (Grid's white is its
  material; there is no dark mode). Components reference `var(--…)` and never
  a literal. Tailwind v4's own `.container` utility caps at 1280px and outranks
  `base.css`, so `globals.css` restates the scaffold's 1440px cap.
- [src/app/base.css](src/app/base.css) is Hallmark's scaffold: the Floor's
  decisions (overflow clip, focus ring, heading measure, reduced motion).
- [src/app/globals.css](src/app/globals.css) **opens with the Hallmark stamp**:
  the shape, theme, hero posture, signature, the pre-emit critique, and every
  `dropped`, `waive` and `dismissed` line. Keep it within the first 40 lines
  and keep it true; it is what the linter and the next Hallmark run read.
- The share card ([opengraph-image.tsx](src/app/opengraph-image.tsx)) and the
  theme-colour meta tag cannot read CSS, so
  [src/lib/palette.ts](src/lib/palette.ts) reads `tokens.css` at build time and
  hands them hex. Do not type a hex value anywhere else.

Rules the page holds, from Hallmark's Floor:

- the ink block opens the CV: in the hero, in the floating nav on every page,
  and in the close;
- no eyebrow over a heading, no tracked capitals, no middle-dot meta strings,
  no em or en dash in visible copy: the data keeps the author's punctuation,
  and every renderer passes prose through `prose()` in `src/lib/text.ts`
  (and labels through `label()`), which prints the dashes as commas and the
  ranges as "to". New prose on the page must go through it too;
- mono only for what was measured or written by a system (dates, figures,
  hashes, code), never a label, a head or a control;
- every disclosure a native `<details>`, so nothing needs script to open.

**Motion is one reveal.** At the owner's request (2026-11-05) the site runs
Hallmark's one reveal (`craft.md` § 5, `patterns.md` "One reveal that
survives no script"): everything rises once into place the first time it is
seen, **on a hard refresh as well as on a scroll**. Every block outside the
hero carries `data-reveal`, and
[reveal.tsx](src/components/content/reveal.tsx) adds `.is-in` when it comes
into view, staggering blocks that arrive together. A new block that should
arrive needs only the attribute.

**The hero's opening is CSS only, and set like a sheet off the press.** The
owner had it redesigned with Hallmark on 2026-11-06; before that it was one
fade-up for every block. It takes 0.82s:
- the field is laid from the column-9 line by a `.hero::before` paper overlay
  shrinking right;
- the headline's words (one `.hero__word` span each, in `hero.tsx`) and the
  five names rise out of their own baselines (`set`);
- the line and the actions settle 8px;
- the current name turns red last.

Two traps:
- `set` moves `translate` and `clip-path` together so the clip edge holds
  still. Keep both in the keyframes.
- **Never animate a `.specimen__fig` itself.** The hover swap toggles it with
  `display`, which restarts any animation on it, so the field rises as one
  block, `.hero__field`.

Before and after filmstrips are in `.hallmark/opening-before/` and
`.hallmark/opening-after/`.

The order of operations is what keeps it safe. An inline script in
`layout.tsx` ([reveal-gate.ts](src/components/content/reveal-gate.ts)) sets
`<html data-js="pending">` before the first paint, and only where
IntersectionObserver exists and motion is allowed. Blocks are hidden only
under that attribute and only on `screen`, so scripting off, reduced motion
and print all get the finished page. If the bundle never runs, a 3s CSS
failsafe shows every block. `reveal.tsx` re-runs on every route change,
because the masthead and the case link navigate client-side.

**Why it replaced the scroll pattern.** The site first ran a scroll-scrubbed
sticky diptych (`scroll-choreography.md` pattern 4) on `view()` timelines. The
owner reported twice that nothing animated. A scrubbed pattern draws in-view
sections at their end state on a refresh and kept the hero still, so a
refresh showed no motion at all. Do not bring a scroll-scrubbed pattern back
beside the reveal, and do not add a motion library; the repo has already
removed GSAP ScrollSmoother and framer-motion. `DESIGN.md` records it under
Variants.

**Test it headless, not in the app's browser pane.** A hidden pane runs no
rendering steps, so IntersectionObserver never fires there and every block
looks stuck. **Keep `@keyframes` at the top level:** nested in a `@media`
inside a `@supports`, Next's Turbopack CSS pipeline silently drops the whole
block (Tailwind and Lightning CSS on their own keep it), and nothing errors.

**Linting the design.** Install `puppeteer-core` somewhere outside the tree
and point `HALLMARK_PUPPETEER` at that folder, start the dev server, and run
`node ~/.claude/skills/hallmark/scripts/sloplint.mjs src --genre editorial --render --kept --url http://localhost:3000/ --url http://localhost:3000/deposit-alerting --url http://localhost:3000/satusehat`.
It reads 0 FAIL and 0 REFLEX. Waivers are global, so a waiver written for one
route can hide a regression on the other: after changing the hero, check the
home fold with the case page's `44c` waiver commented out. The `.hallmark/`
folder holds the before record and screenshots and is ignored by git apart
from the log and the rotation salt.

## Architecture

There is no client state. Every component is a server component except two
in `src/components/content/`:
- [print-expander.tsx](src/components/content/print-expander.tsx) opens every
  `<details>` before printing and closes the ones it opened afterwards.
- [reveal.tsx](src/components/content/reveal.tsx), mounted once in the
  layout, runs the one reveal.

Sections live in [src/components/site/](src/components/site/), one file each.
Content renderers shared across the pages live in
[src/components/content/](src/components/content/): `prose.tsx` (paragraphs,
lists, highlighted code, tables), `case-study-body.tsx` (takes a document
and its closing "does not answer" section as props, so both case pages use
it) and `note-body.tsx`.

### The first sheet

The headline in `profile.ts` is **the owner's choice** (2026-11-05):
"Backend systems for health and finance data." It names what is built, in the
two domains the roles are in. Do not reword it without being asked.

[hero.tsx](src/components/site/hero.tsx) sets the five places worked at
display size along the foot, the current one in the mark red, and on an
ultramarine field from the column-9 line its first year at poster scale with
a caption ("Joined Meditap in July 2025. Still there."). Pointing at or
focusing another name swaps the year and caption, in CSS alone (`:has()`).
The field is the section's own background, a hard stop computed from the
container, so it bleeds without measuring the viewport.

Dates are rendered from the ISO months (`Jul 2025 to now`), never from the
`period` strings, which keep their dashes because a test pins the case
study's period to its role's.

### The case study

[src/data/case-study.ts](src/data/case-study.ts) is the Meditap
deposit-threshold alerting system at more than bullet-point depth. **The
record is the author's own Markdown write-up** at
`public/projects/meditap/portfolio-aso-case-study.md`, served as-is and linked
from the page; `case-study.ts` is that document as typed data, and
`case-study.test.ts` reads the Markdown and fails when the title, role, stack,
summary, headings, code or table rows drift. Where the write-up does not
record something a reader would ask, the question sits in `openQuestions`,
rendered rather than hidden. Keep that discipline.

**The home page has no case section.** It used to show the write-up's
behaviour table as a radio control on the ultramarine field ("When should an
alert go out?"). On 2026-11-06 the owner had it removed: without the
write-up's context, choices like "threshold 1 → below threshold 2" told a new
reader nothing, and the home copy is meant to stay unspecific. The case study
is reached from the nav's "Case studies" menu and from a link inside the
Meditap row. Do not bring the control back without being asked.

**Every case study is listed once, in
[src/data/cases.ts](src/data/cases.ts)**, with the roles it belongs to by
`short` and its name, where and when derived from those roles.
`data.test.ts` fails when a name stops matching or a role belongs to two.
Two surfaces read it:
- the Work rows, which link a role to its case;
- the nav's **"Case studies" menu** in
  [masthead.tsx](src/components/site/masthead.tsx), redesigned with Hallmark
  on 2026-11-06.

The menu is a native popover (`popover` and `popoverTarget`): no script,
light dismiss and Escape from the browser. It is anchored under the pill and
exactly its width, with a fixed fallback where anchor positioning is
missing. A case page passes `current` to the masthead so its row shows in red.
A new case study needs only an entry in `cases.ts`. The state preview is
`.hallmark/case-menu.preview.html`, which is not tracked.

**The nav has a second form under 60rem**, redesigned with Hallmark on
2026-11-06. Until then phones and tablets lost every section link and the
floating name plate sat on top of headings.

What it looks like:
- `.nav` is a solid paper bar of `--bar` (72px), so the page scrolls under
  it.
- The pill holds "Menu" (`.nav__menu--site`) and the CV.
- "Menu" opens `#site-menu`, a second native popover hung at `top: var(--bar)`
  and as tall as the rest of the screen. It lists the three sections, then
  the case studies, from the same `cases.ts`.

How it works:
- Popovers do not close when a link inside them is followed, so
  [menu-close.ts](src/components/site/menu-close.ts) is a one-listener inline
  script in `<head>` that hides the open popover on a link click.
- Without script the sheet still opens, and closes on a tap outside.
- The section hrefs are written out literally (`` `${base}#work` `` and so
  on) in both the pill and the sheet, because sloplint's `--kept` record
  matches href expressions in the source.

**If a CSS edit does not show up in dev**, look at the served chunk before
debugging the CSS. On 2026-11-06 Turbopack's persistent cache in
`.next/dev` kept serving the stylesheet from one edit earlier, through
restarts, with no error. Stop the dev server, delete `.next/dev`, and start
it again.

### The SATUSEHAT case study, rough on purpose

[src/data/satusehat.ts](src/data/satusehat.ts) covers the SATUSEHAT work
from Jul 2023 to Mar 2025: the Go APIs behind the Ministry of Health's
native dashboards (replacing Tableau's data layer), and the SATUSEHAT Data
API. **There is no write-up behind it.** The owner said they do not remember
the detail, and on 2026-11-06 gave these facts, which are the page's only new
ones:
- the dashboards were built in Go over PostgreSQL, MongoDB and BigQuery;
- the data team built the pipelines, and the owner consumed the data they
  loaded;
- the Data API was a previous team's NestJS, Prisma and PostgreSQL project,
  which the owner continued.

Everything else is taken from the two roles' bullets and the `ssd` and
`native` projects. What nobody kept (volumes, latencies, licence costs, cache
policy, which endpoints) sits in its `openQuestions`. Do not fill those with
plausible figures; ask the owner. The dates, roles and live link on the page
are derived from `experience.ts` and `projects.ts`. The section headings
carry a "Dashboards:" or "The Data API:" prefix because the contents list
shows only what follows the colon; longer labels wrap at 1024px and fail
sloplint 49a.

The page shows the two SATUSEHAT captures, as a `{ kind: 'capture', project }`
block that `case-study-body.tsx` draws from `projects.ts`. A capture's pixel
size lives in the project's `coverSize`, the one source the home page's
pair also reads. A portrait capture is held to 26rem so it never runs a
screen tall.

The **figure** (`caseStudy.figure`) is the write-up's own diagram redrawn as
DOM and borders, on the case page. Every label and detail is a phrase from the
write-up, and the test fails if one is not.

### Decisions reversed: removed

The site used to publish the decisions this repository reversed, each with
the commit that removed it, from `src/data/discarded.ts`. **On 2026-11-05 the
owner removed the section ("What have you thrown away?") as not useful to a
reader and had the data file deleted with it.** It is in git history. Do not
bring either back without being asked.

### Notes

[src/data/notes.ts](src/data/notes.ts) is the learning log and **it is empty
on purpose**. The home page renders a Notes section only once a note is
`written`; a list of planned topics is the "Coming soon" page this
repository already deleted once (`/articles`, commit 9f30192). A note is a discriminated union: a `written` one must carry
`sections` and a `source`, and `applies` must name a real skill or role. Do
not seed this file to make the page look busier.

### Data

All content is typed data under `src/data/`: `profile`, `experience`,
`projects`, `skills`, `case-study`, `notes`. Every surface
derives from it; none keeps a second copy. Derived figures (tenure, the axis,
reading length) are computed rather than written down, so they stay true
without anyone editing them.

`profile.openTo` was reworded in the redesign to drop its middle dots; the
rest of the data is as it was.
