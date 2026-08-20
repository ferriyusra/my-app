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
| Windows | Drag, eight-way resize, focus and z-order, minimise into the taskbar button and back out, drag-to-edge snapping with a live preview plate, Snap Layouts flyout with four layouts, Snap Assist offering to fill the free half, per-window system menu |
| Keyboard | `⊞`+`←`/`→` snap, `⊞`+`↑`/`↓` maximise and restore, `⊞`+`D` show desktop, `⊞`+`E` File Explorer, `Alt`+`F4` close, `Esc` close, arrow keys on the desktop grid. Windows itself claims the `⊞` combinations before the browser sees them, so in practice they serve macOS and Linux |
| Taskbar | Pinned and running apps with Windows' widening focus indicator, hover previews, right-click to pin or close, live system tray, clock |
| Start | Search across apps and links, pinned grid, all-apps list, Recommended from this session, power menu — sleep blanks the screen, restart replays the startup sequence, shut down leaves a way back |
| Apps | About (System Properties), File Explorer (Projects), Skills, Experience, Mail (Contact), Media Player, Settings, Browser, VS Code, Recycle Bin |
| Media Player | Type a song, artist or album and play it. Search goes through `/api/music/search`, which proxies Apple's catalogue so its rate limit lands on the server rather than each visitor. Previews are 30 seconds — that is what the public API serves — and the full track is one click away |
| Personalisation | Light / dark, six accents, four built-in wallpapers plus any image you drop into `public/background`, brightness and volume — all persisted, all changing the running shell |
| Activation | It opens unactivated, watermark and all. Settings ▸ System ▸ Activation is where that watermark's own instruction leads, and activating actually clears it |
| Desktop cat | Wanders the floor above the taskbar, sits, grooms and naps on its own. Click to pet it; put food down from the desktop menu or Settings and it will come and eat. It has a house: send it home and it trots over and goes inside — the switch stays disabled until it lands — and letting it out again brings it back through the door |

The four built-in wallpapers are drawn in CSS and every system sound is
synthesised with the Web Audio API, so the shell ships zero image and zero
audio bytes of its own.

**Adding your own wallpapers:** put `.jpg`, `.png`, `.webp` or `.avif` files in
`public/background` and they join the list under Settings ▸ Personalisation ▸
Background. The filename becomes the label, so `sunset-cliffs.jpg` shows as
"Sunset cliffs". The folder is read at build time, so a new image needs a
rebuild to appear in production; `npm run dev` picks one up on the next
refresh.

The whole portfolio also ships as plain HTML in the server response, and that
document *is* the experience below 900px or with JavaScript switched off —
built from the same data and the same design tokens as the desktop.

## Configuration

Every variable is optional — copy [.env.example](.env.example) to `.env` if you
want to change something. Each one falls back to a working default in code, so
the app runs with no `.env` at all and a deploy that forgets one does not break.

```bash
# Music search — /api/music/search
MUSIC_SEARCH_ENDPOINT=https://itunes.apple.com/search
MUSIC_CACHE_SECONDS=3600     # 0 disables caching

# Contact form — /api/contact
RESEND_API_KEY=...           # without it, mail falls back to a mailto: draft
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
