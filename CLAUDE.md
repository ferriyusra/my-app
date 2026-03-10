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
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss` in [postcss.config.mjs](postcss.config.mjs))

## Architecture

This is a standard Next.js App Router project. All routes live under [src/app/](src/app/). The root layout ([src/app/layout.tsx](src/app/layout.tsx)) sets up Geist fonts via CSS variables (`--font-geist-sans`, `--font-geist-mono`) and applies them globally through [src/app/globals.css](src/app/globals.css).

New pages are created as `page.tsx` files within subdirectories of `src/app/`. Shared layouts can be added as `layout.tsx` at any level of the route tree.
