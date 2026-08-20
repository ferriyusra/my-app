/**
 * Shared design vocabulary.
 *
 * Colours live in globals.css as CSS custom properties so they can swap with
 * `data-theme` without any JS. Everything here is theme-independent geometry:
 * scales that were previously re-invented in every component.
 */

/** Type scale. Replaces the 15 ad-hoc sizes that were in use. */
export const FONT = {
	micro: 11, // mono labels, chips, badges
	sm: 13, // secondary text, tags
	base: 15, // body copy
	lg: 17, // compact card title
	xl: 20, // card title
	stat: 32, // count-up figures
} as const;

/** Section heading, used by every `h2`. */
export const H2_SIZE = 'clamp(32px, 5.5vw, 56px)';

/** Corner radii. Tightened from 8/12/20 — large radii read as app UI, not print. */
export const RADIUS = {
	sm: 6,
	md: 10,
	lg: 14,
	full: 100,
} as const;

/** Border widths. Both are hairlines now: structure comes from the rule
 *  colour (--line vs --line-strong), not from thickness. */
export const BORDER = {
	soft: '1px',
	hard: '1px',
} as const;

export const SANS = 'var(--font-inter), system-ui, sans-serif';
export const MONO = 'var(--font-jetbrains), ui-monospace, monospace';
export const DISPLAY = 'var(--font-display), Iowan Old Style, Georgia, serif';

/** Every page section shares one content width so headings line up. */
export const CONTAINER: React.CSSProperties = {
	maxWidth: 1200,
	margin: '0 auto',
	padding: '0 24px',
};

/** The canonical card: paper surface, hairline rule, soft elevation. */
export const CARD: React.CSSProperties = {
	background: 'var(--surface)',
	border: `1px solid var(--line)`,
	borderRadius: RADIUS.lg,
	boxShadow: 'var(--sh-2)',
	overflow: 'hidden',
};

/** Section heading style, shared by every `h2`. */
export const H2: React.CSSProperties = {
	fontSize: H2_SIZE,
	fontWeight: 400,
	fontFamily: DISPLAY,
	color: 'var(--ink)',
	letterSpacing: '-0.015em',
	lineHeight: 1.08,
};

/** Small uppercase mono label that opens a section. */
export const EYEBROW: React.CSSProperties = {
	fontFamily: MONO,
	fontSize: 11,
	fontWeight: 600,
	letterSpacing: '0.18em',
	textTransform: 'uppercase',
	color: 'var(--ink-muted)',
};

/** Shared easing for framer-motion transitions. */
export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
