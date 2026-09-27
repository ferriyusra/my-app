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
 *
 * The filename is also the label Settings and Quick Settings show, which is
 * why it is not `package.jpeg` any more: a tile that said "Package" named a
 * file, not a wallpaper. A visitor who stored the old name falls back to the
 * drawn Bloom once, then keeps whatever they pick next.
 */
export const DEFAULT_WALLPAPER = 'custom:bloom-photo.jpeg';

/** What it falls back to: always present, because it is drawn in CSS. */
export const FALLBACK_WALLPAPER = 'bloom';

/**
 * Who gets the desktop: a screen at least 900px wide that also has a mouse or
 * trackpad, or is tall enough for windows to overlap.
 *
 * It was width alone, and most large phones are 915–932px wide on their
 * side — so a recruiter who turned a phone to read the case study's table
 * watched the document vanish into a boot sequence and a double-click desktop
 * 430px tall, and came back to the top of the page when they turned it back.
 * A windowing metaphor needs a pointer and room to overlap, which is what the
 * docs always said; the query now checks both. A mouse keeps the desktop at
 * any height (a docked DevTools, a 150% scale); a touch-only tablet keeps it
 * when it is tall enough, as it did before.
 *
 * One string, read by the pre-paint script in layout.tsx and by the live
 * listener in desktop.tsx, so the two cannot disagree — repo.test.ts checks
 * that neither spells its own.
 */
export const SHELL_QUERY =
	'(min-width: 900px) and (pointer: fine), (min-width: 900px) and (min-height: 600px)';
