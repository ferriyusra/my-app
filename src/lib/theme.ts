/**
 * Shared design vocabulary.
 *
 * Colours live in globals.css as CSS custom properties so they can swap with
 * `data-theme` without any JS. Everything here is theme-independent geometry:
 * scales that were previously re-invented in every component.
 */

/**
 * Fluent 2 type ramp. Windows 11 uses a fixed set of text styles rather than a
 * free scale; these map onto Caption / Body / BodyLarge / Subtitle1 / Title3 /
 * LargeTitle. Key names are unchanged so components did not need rewriting.
 */
export const FONT = {
	micro: 12, // Caption1   12/16
	sm: 14, // Body1      14/20
	base: 16, // BodyLarge  16/22
	lg: 20, // Subtitle1  20/26
	xl: 24, // Title3     24/32
	stat: 40, // LargeTitle 40/52
} as const;

/** Fluent pairs each size with a fixed line height. */
export const LEADING = {
	micro: 16,
	sm: 20,
	base: 22,
	lg: 26,
	xl: 32,
	stat: 52,
} as const;

/** Section heading, used by every `h2`. */
export const H2_SIZE = 'clamp(28px, 3.2vw, 40px)';  /* Fluent LargeTitle */

/** Fluent 2 borderRadius tokens: Medium / Large / XLarge / Circular. */
export const RADIUS = {
	sm: 4,
	md: 6,
	lg: 8,
	full: 9999,
} as const;

/** Fluent draws every surface with a single 1px stroke. */
export const BORDER = {
	soft: '1px',
	hard: '1px',
} as const;

/* Segoe UI Variable is the Windows 11 system face; Windows visitors get it
   natively. Inter is the fallback everywhere else — it is the closest widely
   available neo-grotesque and is already self-hosted. */
export const SANS =
	"'Segoe UI Variable Text', 'Segoe UI', var(--font-inter), system-ui, sans-serif";
export const DISPLAY =
	"'Segoe UI Variable Display', 'Segoe UI', var(--font-inter), system-ui, sans-serif";
export const MONO =
	"'Cascadia Code', 'Cascadia Mono', var(--font-jetbrains), ui-monospace, monospace";

/** Every page section shares one content width so headings line up. */
export const CONTAINER: React.CSSProperties = {
	maxWidth: 1200,
	margin: '0 auto',
	padding: '0 24px',
};

/** The canonical card: paper surface, hairline rule, soft elevation. */
/** Fluent Card: neutral background 1, a 1px stroke, 8px radius, shadow4. */
export const CARD: React.CSSProperties = {
	background: 'var(--surface)',
	border: `1px solid var(--line-soft)`,
	borderRadius: RADIUS.lg,
	boxShadow: 'var(--sh-2)',
	overflow: 'hidden',
};

/** Section heading style, shared by every `h2`. */
export const H2: React.CSSProperties = {
	fontSize: H2_SIZE,
	fontWeight: 600, // Fluent titles are Semibold, never Light or Black
	fontFamily: DISPLAY,
	color: 'var(--ink)',
	letterSpacing: 0, // Fluent does not track its headings tighter
	lineHeight: 1.3,
};

/** Small uppercase mono label that opens a section. */
/** Fluent uses BodyStrong for section labels rather than tracked-out mono. */
export const EYEBROW: React.CSSProperties = {
	fontFamily: SANS,
	fontSize: FONT.sm,
	fontWeight: 600,
	letterSpacing: 0,
	color: 'var(--accent)',
};

/** Shared easing for framer-motion transitions. */
export const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
