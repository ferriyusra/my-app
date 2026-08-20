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
export const H2_SIZE = 'clamp(28px, 5vw, 48px)';

/** Corner radii: 8 / 12 / 20 / pill. */
export const RADIUS = {
	sm: 8,
	md: 12,
	lg: 20,
	full: 100,
} as const;

/** Border widths: soft hairline vs. the hard neo-brutalist edge. */
export const BORDER = {
	soft: '1.5px',
	hard: '2px',
} as const;

export const SANS = 'var(--font-inter), system-ui, sans-serif';
export const MONO = 'var(--font-jetbrains), ui-monospace, monospace';

/** Every page section shares one content width so headings line up. */
export const CONTAINER: React.CSSProperties = {
	maxWidth: 1200,
	margin: '0 auto',
	padding: '0 24px',
};

/** The canonical card: white surface, hard border, offset shadow. */
export const CARD: React.CSSProperties = {
	background: 'var(--surface)',
	border: `${BORDER.hard} solid var(--line)`,
	borderRadius: RADIUS.lg,
	boxShadow: 'var(--sh-3)',
	overflow: 'hidden',
};

/** Section heading style, shared by every `h2`. */
export const H2: React.CSSProperties = {
	fontSize: H2_SIZE,
	fontWeight: 800,
	fontFamily: SANS,
	color: 'var(--ink)',
	letterSpacing: '-0.02em',
};

/** Shared easing for framer-motion transitions. */
export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
