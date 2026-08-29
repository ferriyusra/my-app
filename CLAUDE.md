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

Tests run on Node's built-in runner with native type stripping — there is no
test dependency and no config, and adding a file matching `src/**/*.test.ts`
is enough for `npm test` to pick it up.

Two of the eight check the repository rather than the runtime, because the
bugs they guard cannot be reached from a running page:
`src/lib/repo.test.ts` reads `globals.css` and the component tree as text —
it fails when two apps each style the same class name, when an accent swatch
stops matching the token it previews, or when an icon component name is left
sitting in prose. `src/data/data.test.ts` pins the `projects` ↔ `skills`
name join, which fails silently rather than loudly: a tool spelled "Golang"
in one file and "Go" in the other simply drops out of the evidence.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — used only for the reset and
  `@theme`; all component styling is hand-written CSS in
  [src/app/globals.css](src/app/globals.css)
- **Framer Motion** for window, flyout and toast transitions
- **Two icon families**, and the split is deliberate:
  - **LineIcons**, vendored as generated components in
    [src/components/icons/line-icons.tsx](src/components/icons/line-icons.tsx).
    Neither npm package works here: `lineicons-react` bundles its own React 18,
    so its elements carry `Symbol(react.element)` where React 19 wants
    `Symbol(react.transitional.element)`; `react-lineicons` reaches for
    `document` at import time, so a server component cannot import it at all.
    Taking the artwork and leaving the packaging fixes both, makes every fill
    `currentColor`, and ships only what is used. Regenerate from
    `scratchpad/gen/line-icons.mjs`, which installs the package with
    `--no-save`, emits one component, and is removed again — do not hand-edit
    the file.
  - **Lucide** for the 60-odd glyphs LineIcons has no answer for: window
    minimise and restore, battery and its charging states, wifi on and off,
    pin and unpin, skip back and forward, the alert and warning marks.

  The rule when they meet: **a tight group of controls uses one family.** The
  title bar, the system tray and the media transport are each all-Lucide,
  because in each case at least one glyph in the group has no LineIcons
  equivalent and a heavier LineIcons mark beside a lighter Lucide one reads as
  a mistake. The close mark is Lucide everywhere for the same reason.

  Every app icon is LineIcons. They were hand-drawn shaped compositions until
  the owner asked for the swap; that history, and the fact it reversed an
  earlier decision, is recorded in `discarded.ts` rather than quietly dropped.

## What this is

A portfolio presented as a **Windows 11 desktop shell**, not a scrolling page.
The single route `/` renders a desktop with draggable, resizable, snappable
windows; a taskbar; Start; Quick Settings; a notification centre; and a File
Explorer. Below 900px it swaps to a stacked reading view — a windowing
metaphor needs a pointer and room to overlap.

## Two renderings of the same data

[src/components/content/portfolio-document.tsx](src/components/content/portfolio-document.tsx)
is a **server component** holding the whole portfolio as plain semantic HTML.
It ships in the response body, and it is the entire experience on a narrow
screen — which is why its sections are `<details>`: native collapsing needs no
JavaScript, so the page works with scripting off.

The desktop shell is the enhancement layered on top. `data-shell` on `<html>`
decides which is in charge, and the inline script in `layout.tsx` sets it
**before first paint**, so a wide viewport never flashes the document. Because
only script can set that attribute, its absence means scripting is off — which
is how the document survives and the desktop's black holding screen stays away.

Do not move the document behind a client boundary. Before it existed the
response body was an empty div: every word only appeared after ~266KB of JS
had run, so anything that does not execute scripts — ATS scrapers, social
preview bots, LLM crawlers — saw a blank portfolio.

## Architecture

### State

The window state machine lives in
[src/context/window-reducer.ts](src/context/window-reducer.ts), split out of the
provider so it can be exercised without React. It is where the non-obvious rules
are: `focus` returns the *identical* state object when the target is already on
top (a new object would re-render every open window on every pointer-down), and
`snap` keeps the original floating geometry across a chain of snaps so restore
returns to where the window actually was, not to the previous snap. Both are
covered by tests, and both were verified by breaking them on purpose and
watching the right test fail.

Two contexts, both mounted in [src/components/desktop/desktop.tsx](src/components/desktop/desktop.tsx):

- **[src/context/window-context.tsx](src/context/window-context.tsx)** — a pure
  reducer over `WindowState[]`: open, close, focus, minimise, maximise, snap,
  set-rect, tear-off. It knows nothing about the viewport or the app registry,
  which keeps it trivially testable. `zoneRect()` maps each Snap Layouts zone
  to a rectangle.
- **[src/context/shell-context.tsx](src/context/shell-context.tsx)** — the
  chrome around the windows: which flyout is open, notifications, recents,
  taskbar pins, theme-adjacent personalisation (accent, wallpaper, sound,
  volume, brightness) and power state. Personalisation persists to
  `localStorage` and is read by lazy `useState` initialisers.

Anything needing both the viewport and the registry lives in
[src/hooks/use-window-manager.ts](src/hooks/use-window-manager.ts) — `launch`,
`closeWindow`, `toggleFromTaskbar`, `desktopBounds`.

### Window geometry does not live in React

`WindowFrame` holds position and size in framer-motion **motion values**, not
state. A pointer-move that dispatched to the reducer publishes a new context
value, and a context change re-renders every consumer regardless of
`React.memo` — so dragging one window re-rendered every *other* open window
and all of its app content, once per frame. Measured over four seconds of
dragging with five windows open, that was 653ms of scripting; through motion
values it is 87ms.

The rule that follows: **a pointer gesture must not dispatch**. Drag and
resize write to `mx/my/mw/mh` and paint the snap plate straight onto the DOM,
then commit once on `pointerup`. The `gesture` ref tells the sync effect to
keep its hands off while a gesture is live, and `settle` tells it not to
animate a commit that is already on screen.

Minimising is one scale animation with `transform-origin` pointed at the
window's taskbar button (`[data-app-id]`), so it drops into the taskbar and
grows back out without a second set of coordinates. Minimised windows stay
mounted — and `inert` — because unmounting would make both halves impossible.

### Wallpapers

Four are drawn in CSS and keyed off `data-wallpaper`. Anything in
`public/background` is offered alongside them:
[src/lib/wallpapers.ts](src/lib/wallpapers.ts) lists the directory on the
server, `page.tsx` passes the result into `ShellProvider`, and the choice is
stored as `custom:<file>`.

It is read in a server component rather than an API route on purpose — the page
is prerendered, so the listing happens at build time. A runtime `fs` read is not
dependable on serverless hosts, and a browser cannot list a folder at all.

The filename reaches a CSS `url()`, so it is pattern-checked in three places:
the directory listing rejects anything but plain names, the provider only
honours a file still present in the listing, and the inline boot script in
`layout.tsx` re-checks before setting `--wp-custom` ahead of first paint.
Dropping any of those re-opens a style-injection hole.

### The activation watermark

The shell starts unactivated, so `ActivateWatermark` sits above the windows —
being impossible to cover is the character of the thing. Unlike the real one it
can be cleared, from Settings ▸ System ▸ Activation, which is exactly where its
second line says to go. A portfolio that permanently blocks a corner of itself
for a joke is a worse portfolio, and the instruction leading somewhere is
funnier than a dead end.

The toast is lifted clear of it (`.desktop:not([data-activated]) .toast`) rather
than landing on top as it would in Windows — otherwise the welcome toast hides
the watermark at the one moment anybody would read it.

### The desktop cat

[src/components/desktop/cat/](src/components/desktop/cat/) follows the same
rule as the window frame: **position never touches React**. A transform
written sixty times a second through state would re-render the shell's whole
context tree; only the cat's mood is state, and that changes every few
seconds. Feeding and the house are both signalled through the shell context and
answered *inside the animation loop* rather than an effect — which keeps the
state change out of an effect body, and lets the cat, the only thing that knows
where it is standing, decide where the bowl goes under
`prefers-reduced-motion`.

`catPhase` (`out` → `leaving` → `home` → `arriving`) is the reason the toggle
can be disabled: going in or out takes a walk plus a doorway animation, and a
second click mid-walk would strand the cat. `catBusy` is derived from it, and
`catSettled()` is what the cat calls when it lands. A reload restores whichever
end state was persisted — no walking home on arrival.

### Startup

[src/components/desktop/boot-screen.tsx](src/components/desktop/boot-screen.tsx)
plays boot → lock → sign-in over the desktop, which mounts *underneath* it
rather than after it — the overlay covers work the browser was doing anyway.
`booted` in the shell context gates the two things that would be wasted behind
it (the first window opening, the welcome toast). It runs once per browser
session via `sessionStorage`, collapses to a short fade under
`prefers-reduced-motion`, and Start's Restart replays it by setting `booted`
back to false.

### Teaching the shell

Nothing on a desktop announces that its windows drag, snap and close, and the
only guidance here used to be a toast that lasted six seconds and fired on
every reload — so a returning visitor, who had already dismissed it, was the
one person left with nothing to read.

[src/components/apps/tips-app.tsx](src/components/apps/tips-app.tsx) **opens by
itself on a visitor's first arrival and never again**, which is the whole
reason it is a window rather than an overlay: the first thing anybody does
here is drag, resize and close the thing explaining drag, resize and close.
Coach marks were rejected for the opposite reason — a modal Windows does not
have, blocking the desktop until dismissed, positioned against elements whose
coordinates are deliberately kept out of React.

The arrival is tracked in `shell-context.tsx` as two **idempotent markers**
(`shell:seen`, `shell:greeted`) rather than a counter, because a lazy
initialiser and an effect both run twice under React's development
double-invoke: setting a constant twice is harmless where incrementing is not.
First arrival opens Tips; the second gets one toast pointing at `F1`; every
later one is silent. It is `localStorage`, not `sessionStorage` — that
distinction *is* the bug the toast had.

The content lives in [src/data/tips.ts](src/data/tips.ts), not in the
component, so it reaches the Tips window, Start's search index, the Terminal's
`tips` command and the server document from one place.

**The ⊞ shortcuts do not work on Windows.** The OS claims them before the
browser is told, so on the operating system this shell imitates they do
nothing. `Ctrl`+`Alt` is bound alongside them **for the arrows only** —
`Ctrl`+`Alt` is AltGr on many layouts, where `Ctrl`+`Alt`+`E` types €, and
`⊞`+`D`/`⊞`+`E` already have several other routes. Tips ▸ Keyboard shows
both columns always; the platform only decides which is named first. A reader
shown only the half that fails concludes the site is broken.

### Adding an app

1. Write the content component in `src/components/apps/`.
2. Add an `AppId` to [src/types/windows.ts](src/types/windows.ts).
3. Add an entry to `APPS` in
   [src/components/apps/registry.tsx](src/components/apps/registry.tsx) — title,
   blurb, icon, default size, content component.
4. Optionally list it in `DESKTOP_ITEMS` or `START_PINNED`.

The registry is the only place that maps an id to a window; the desktop,
taskbar, Start, Task View and notification centre all read from it.

### Styling

**A class prefix belongs to one app.** `.xp-bar` was declared twice at equal
specificity — File e**xp**lorer's address bar and e**xp**erience's career bar
had claimed the same three letters. Neither rule was wrong alone; the cascade
merged them per-property, so the address bar was silently forced to 52px tall
with its overflow hidden, in a window whose author never saw the other rule.
Experience is `ex-` now and `xp-` means Explorer only. `repo.test.ts` fails
if two apps ever again each style one class name.

`globals.css` is organised as: tokens → accents → base → shared controls →
desktop → windows → taskbar → flyouts → menus → per-app sections → mobile →
reduced motion. Components reference `var(--…)` and never raw hex, so dark
mode, six accents and four wallpapers all switch by changing one attribute on
`<html>` (set before first paint by the boot script in `layout.tsx`).

**Do not write `-webkit-backdrop-filter` by hand.** Lightning CSS collapses an
explicit standard + prefixed pair down to the prefixed property alone, which
Chrome no longer honours — every acrylic surface silently goes opaque. Declare
`backdrop-filter` only and let the build add prefixes.

### Career.exe

[src/components/apps/career/](src/components/apps/career/) is a small
side-scroller: you walk a character through five chapters, one per role,
collecting the skills that role was the first to use, and climbing two one-way
ledges per chapter to reach the ones held above the floor.

Chapters were gated on collecting everything, and that gate has been removed:
it shut a visitor who could not or would not platform out of the later roles,
which in a portfolio means out of the CV. The post at the end of a chapter
reports what is still out there; it does not stop anyone.

It follows the same rule as the window frame and the desktop cat — **position
never touches React**. The loop writes `translate3d` onto the character and the
camera, and even "am I walking" is a `data-` attribute written from the loop
rather than a prop, because it flips on almost every frame. Only three things
are state: skills collected, current chapter, and whether the controls have
been found.

Two constraints are load-bearing and covered by tests in `world.test.ts`: every
raised token must sit within a jump of the ground (`reachable()` checks it
against the actual `JUMP_V`/`GRAVITY`, which is why those live in `world.ts`
and not in the component), and the first token of every chapter must be
collectable without jumping. Break either and a chapter becomes impossible to
finish.

**Summary mode is not a fallback, it is the same content.** It is the default
under `prefers-reduced-motion`, and anything the game says must be sayable
there too.

Keys are read from `window`, but only while the app's own `.win` ancestor
carries `data-focused`. Binding them to the stage element was tried first and
was wrong: opening the app leaves focus on the window frame, not the stage
inside it, so nothing responded until the playfield was clicked. Listening
globally without the guard is the opposite mistake — an app inside a fake
desktop must not swallow the arrow keys of the page or of whatever window is on
top. The handler also stands down when the event target is a button or field,
so Space on the Summary tab switches mode instead of jumping.

### Four ways into the same content

The shell holds one set of typed data and offers several routes through it. All
of them derive; none of them keep a second copy.

- **Search** ([src/lib/search.ts](src/lib/search.ts)) indexes roles, projects,
  skills, the case study, the discarded decisions, the tips and the profile — 68 entries
  built from `src/data`. Start used to filter fourteen app names, so "Pub/Sub"
  and "Kafka" returned nothing while sitting in the data. A title match outranks
  a body match, and a result quotes the sentence it matched in.
- **Terminal** ([src/lib/terminal.ts](src/lib/terminal.ts)) is a pure
  `(command) → lines` function, which is why it can be tested without a DOM.
  `open <app>` hands a real `AppId` back to the window manager rather than
  drawing a fake window.
- **Skill evidence** ([src/lib/skill-evidence.ts](src/lib/skill-evidence.ts))
  answers "used where, for how long" by walking the roles that name the tool.
  Nine skills are named by no role; the UI says so rather than padding them.
- **File Explorer** ([src/components/apps/explorer-app.tsx](src/components/apps/explorer-app.tsx))
  navigates roles, the case study and the reversed decisions as folders. Three
  of its four folders used to hold `appFile()` entries — *applications wearing
  file icons* — which is worse than an empty folder: it teaches the visitor the
  file metaphor is a costume, and then `Portfolio/`, the one folder that was
  real, gets no credit either. The tree is smaller now and entirely data.
  Skills deliberately gets no folder: 28 names in a flat list is worse than the
  Skills window, and Tips ▸ What's not here says so.
- **Desktop gestures** ([src/hooks/use-desktop-gestures.ts](src/hooks/use-desktop-gestures.ts))
  — marquee select and drag-to-rearrange. Same rule as the window frame and the
  cat: the gesture writes to the DOM and dispatches once, on pointer-up. The
  arrangement persists as an *order*, not pixels, so it survives a resize and a
  change of icon size.

**Focus is the thing to get right in a fake desktop.** The frame takes focus
when a window is raised, which means an app whose whole point is typing must
claim it back — on mount, on mousedown (with `preventDefault`, or the browser's
own focus-follows-mousedown overrides the call), and on `focusin` when the frame
itself is refocused. Career.exe has the mirror problem and solves it the other
way: it reads keys from `window`, guarded on its own `.win` carrying
`data-focused`. Both bugs shipped once because the tests drove the UI through
`fill()` and synthetic events instead of typing.

### The Recycle Bin and the case study

Two windows carry content that a portfolio usually leaves out.

[src/data/discarded.ts](src/data/discarded.ts) holds decisions this repository
reversed — the progress bars, the glyph tiles, ScrollSmoother, `/articles`,
YouTube full-track playback — each with the commit that removed it. Every entry
is real and checkable; the one without a hash (YouTube full-track playback) was
reverted before it was ever committed, and says so. Do not add an entry that did not happen.

It reaches four places from one component,
[discarded-detail.tsx](src/components/content/discarded-detail.tsx), with no
`'use client'` — the Recycle Bin, Explorer's `Documents/Decisions reversed/`,
and the server document, which is what a phone, a crawler and a printed page
see. It was in the Recycle Bin alone until then: the strongest writing here,
behind the last icon on the desktop grid, absent from the HTML entirely. The
bin is pinned to the taskbar by default now.

[src/data/case-study.ts](src/data/case-study.ts) is the Meditap ASO billing
system at more than bullet-point depth. Everything in it traces to the Meditap
entry in `experience.ts`. Where a design decision is not recorded anywhere in
this repository it is **not claimed** — those sit in `openQuestions`, which is
rendered rather than hidden. Keep that discipline: the section is worth more for
naming its gaps than it would be for filling them with plausible invention.

It renders through one component,
[case-study-body.tsx](src/components/content/case-study-body.tsx), with no
`'use client'` — so the Experience window and the server document show the same
prose and cannot drift.

### Data

All content is typed data under `src/data/` — `profile`, `experience`,
`projects`, `skills`, `case-study`, `discarded`.

The editor window is the exception, and deliberately so: its excerpts are
**read from the real files at build time** by
[src/lib/source.ts](src/lib/source.ts), never copied. They used to be copies,
and three of the five had silently stopped matching — `zoneRect` had moved to
another module, `playSound` had grown a parameter — so the window went on
labelling that code with paths it was no longer in. A manifest names a file and
a symbol; a missing symbol throws, so the build stops rather than shipping a
window that lies, and `source.test.ts` catches it before the build does. Derived figures (years of experience,
role tenure) are computed from ISO dates rather than written down, so they stay
true without anyone editing them.

### Environment

`.env*` is gitignored, so **every variable reads through a default in code**
— see [.env.example](.env.example) for the full list. A deploy that never set
one still works; nothing here is required to run. Keep it that way when adding
more: a value that can strand a build belongs in the repository, not in an
ignored file.

### Contact form

[src/app/api/contact/route.ts](src/app/api/contact/route.ts) delivers over the
Resend REST API when `RESEND_API_KEY` is set. Without a key it returns
`{ ok: true, delivered: false }` and the Mail window falls back to a `mailto:`
draft — it never tells a visitor a message was sent when it was not. Optional
env: `CONTACT_FROM`, `CONTACT_TO`.
