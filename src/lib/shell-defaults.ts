/**
 * Shell defaults shared by the client provider and the inline boot script.
 *
 * The boot script runs in `layout.tsx` before React exists, so it cannot read
 * the provider — but both have to agree on the starting wallpaper or the first
 * paint shows one and the hydrated app another.
 *
 * Kept free of `'use client'` and of any Node import so a server component and
 * a client component can both take it.
 */

/**
 * The wallpaper a first-time visitor gets.
 *
 * A `custom:` value is only honoured when that file is actually in
 * `public/background`; delete it and the shell falls back to the drawn
 * default rather than showing an empty frame.
 */
export const DEFAULT_WALLPAPER = 'custom:package.jpeg';

/** What it falls back to: always present, because it is drawn in CSS. */
export const FALLBACK_WALLPAPER = 'bloom';
