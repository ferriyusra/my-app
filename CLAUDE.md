# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — used only for the reset and
  `@theme`; all component styling is hand-written CSS in
  [src/app/globals.css](src/app/globals.css)
- **Framer Motion** for window, flyout and toast transitions
- **Lucide** for glyph icons; free-form app artwork is hand-drawn SVG in
  [src/components/icons/app-icons.tsx](src/components/icons/app-icons.tsx)

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

### Startup

[src/components/desktop/boot-screen.tsx](src/components/desktop/boot-screen.tsx)
plays boot → lock → sign-in over the desktop, which mounts *underneath* it
rather than after it — the overlay covers work the browser was doing anyway.
`booted` in the shell context gates the two things that would be wasted behind
it (the first window opening, the welcome toast). It runs once per browser
session via `sessionStorage`, collapses to a short fade under
`prefers-reduced-motion`, and Start's Restart replays it by setting `booted`
back to false.

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

`globals.css` is organised as: tokens → accents → base → shared controls →
desktop → windows → taskbar → flyouts → menus → per-app sections → mobile →
reduced motion. Components reference `var(--…)` and never raw hex, so dark
mode, six accents and four wallpapers all switch by changing one attribute on
`<html>` (set before first paint by the boot script in `layout.tsx`).

**Do not write `-webkit-backdrop-filter` by hand.** Lightning CSS collapses an
explicit standard + prefixed pair down to the prefixed property alone, which
Chrome no longer honours — every acrylic surface silently goes opaque. Declare
`backdrop-filter` only and let the build add prefixes.

### Data

All content is typed data under `src/data/` — `profile`, `experience`,
`projects`, `skills`, `source-excerpts`. Derived figures (years of experience,
role tenure) are computed from ISO dates rather than written down, so they stay
true without anyone editing them.

### Contact form

[src/app/api/contact/route.ts](src/app/api/contact/route.ts) delivers over the
Resend REST API when `RESEND_API_KEY` is set. Without a key it returns
`{ ok: true, delivered: false }` and the Mail window falls back to a `mailto:`
draft — it never tells a visitor a message was sent when it was not. Optional
env: `CONTACT_FROM`, `CONTACT_TO`.
