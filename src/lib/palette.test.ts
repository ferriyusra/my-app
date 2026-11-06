import assert from 'node:assert/strict';
import { test } from 'node:test';
import { color, oklchToHex } from './palette.ts';

/**
 * The share card and the theme-colour meta tag take their colours from here,
 * so a broken conversion is a wrong colour shipped where no stylesheet can
 * correct it.
 */

test('oklch converts to the sRGB hex it names', () => {
	assert.equal(oklchToHex('oklch(100% 0 0)'), '#ffffff');
	assert.equal(oklchToHex('oklch(0% 0 0)'), '#000000');
	/* sRGB red, from Björn Ottosson's published OKLab coordinates. */
	assert.equal(oklchToHex('oklch(62.796% 0.25768 29.2339)'), '#ff0000');
});

test('every token the card and the meta tag read resolves in either mode', () => {
	for (const name of ['paper', 'paper-2', 'paper-3', 'ink', 'ink-2', 'muted', 'rule', 'accent-ink']) {
		assert.match(color(name), /^#[0-9a-f]{6}$/, `light ${name}`);
		assert.match(color(name, 'dark'), /^#[0-9a-f]{6}$/, `dark ${name}`);
	}
});

/**
 * The share card sets type in the ink on the paper, whichever way round the
 * theme has them. Until 2026-11-06 this asserted a light paper and a dark ink,
 * which was Grid's palette rather than a rule; Blueprint's sheet is the dark
 * one. What must hold under any theme is that the two read against each
 * other: WCAG's 7:1, the AAA line for body text.
 */
test('the ink reads against the paper', () => {
	const linear = (c: number) => {
		const s = c / 255;
		return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	const luminance = (hex: string) => {
		const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16)));
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const [a, b] = [luminance(color('paper')), luminance(color('ink'))].sort((x, y) => y - x);
	assert.ok((a + 0.05) / (b + 0.05) >= 7, `ink on paper is ${((a + 0.05) / (b + 0.05)).toFixed(2)}:1`);
});

test('a mode the tokens do not declare falls back to the one they do', () => {
	/* The theme ships one colourway; asking for dark must not throw or invent one. */
	assert.equal(color('paper', 'dark'), color('paper'));
});
