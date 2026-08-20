# Ferri Yusra — portfolio

A backend engineer's portfolio, built as a **Windows 11 desktop that runs in
the browser**. Not a page with Windows colours: a shell with draggable,
resizable, snappable windows, a real taskbar, Start, Quick Settings, a
notification centre and a File Explorer.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## What's in it

| Surface | Behaviour |
|---|---|
| Startup | Firmware logo with the orbiting dot ring, lock screen with the clock, then sign-in — once per browser session. Any key walks it forward, Skip ends it, and it doubles as the shell's loading state: the desktop mounts behind it |
| Desktop | Column-first icon grid, single click to select, double click to open, arrow-key navigation, right-click menu with working View / Sort by / Refresh |
| Windows | Drag, eight-way resize, focus and z-order, minimise / maximise / restore / close, drag-to-edge snapping with a live preview plate, Snap Layouts flyout with four layouts, per-window system menu |
| Taskbar | Pinned and running apps with Windows' widening focus indicator, hover previews, right-click to pin or close, live system tray, clock |
| Start | Search across apps and links, pinned grid, all-apps list, Recommended from this session, power menu — sleep blanks the screen, restart replays the startup sequence, shut down leaves a way back |
| Apps | About (System Properties), File Explorer (Projects), Skills, Experience, Mail (Contact), Settings, Browser, VS Code, Recycle Bin |
| Personalisation | Light / dark, six accents, four wallpapers, brightness and volume — all persisted, all changing the running shell |

Every wallpaper is drawn in CSS and every system sound is synthesised with the
Web Audio API, so the shell ships zero image and zero audio bytes.

Below 900px the desktop is replaced by a stacked reading view built from the
same design tokens.

## Configuration

The contact form posts to `/api/contact`, which delivers over Resend when
configured and otherwise falls back to a pre-filled `mailto:` draft.

```bash
RESEND_API_KEY=...          # optional; without it, mail falls back to mailto:
CONTACT_FROM=portfolio@example.com
CONTACT_TO=you@example.com
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (reset and
theme only — the shell is hand-written CSS) · Framer Motion · Lucide.

See [CLAUDE.md](CLAUDE.md) for the architecture notes.
