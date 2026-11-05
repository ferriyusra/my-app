import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The colour tokens, read from `tokens.css` and handed over as hex.
 *
 * Two consumers cannot read a CSS custom property: the share card, which
 * Satori renders to a PNG on the server, and the browser's theme-colour meta
 * tag. Both used to carry their own hex values, which is how a palette drifts.
 * Reading the token file at build time keeps `tokens.css` the only place a
 * colour is defined.
 */

const SOURCE = readFileSync(join(process.cwd(), 'src/app/tokens.css'), 'utf8');
/* tokens.css declares one colourway in its @theme block and the other inside a
   prefers-color-scheme block; which is which is read, not assumed. */
const ALT = SOURCE.match(/@media \(prefers-color-scheme: (light|dark)\)/);
const ALT_AT = ALT ? (ALT.index ?? -1) : -1;
const ALT_MODE = ALT ? ALT[1] : null;

/** The oklch() value a token is declared with, in light or dark. */
function declared(name: string, mode: 'light' | 'dark'): string {
	const re = new RegExp(`--color-${name}:\\s*(oklch\\([^)]*\\))`);
	const base = ALT_AT >= 0 ? SOURCE.slice(0, ALT_AT) : SOURCE;
	const block = mode === ALT_MODE ? SOURCE.slice(ALT_AT) : base;
	const hit = block.match(re) ?? base.match(re);
	if (!hit) throw new Error(`tokens.css declares no --color-${name}`);
	return hit[1];
}

/** 'oklch(52% 0.19 258)' → '#1d5fd6' (gamut-clipped to sRGB). */
export function oklchToHex(value: string): string {
	const m = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/);
	if (!m) throw new Error(`not an oklch() colour: ${value}`);
	const L = Number(m[1]) / 100;
	const C = Number(m[2]);
	const h = (Number(m[3]) * Math.PI) / 180;
	const a = C * Math.cos(h);
	const b = C * Math.sin(h);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const linear = [
		4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
	];
	return (
		'#' +
		linear
			.map((v) => {
				const c = Math.min(1, Math.max(0, v));
				const srgb = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
				return Math.round(srgb * 255)
					.toString(16)
					.padStart(2, '0');
			})
			.join('')
	);
}

/** A colour token as hex: `color('paper')`, `color('paper', 'dark')`. */
export function color(name: string, mode: 'light' | 'dark' = 'light'): string {
	return oklchToHex(declared(name, mode));
}
