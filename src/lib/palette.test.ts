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
	for (const name of ['paper', 'paper-2', 'ink', 'ink-2', 'muted', 'field', 'field-ink', 'mark']) {
		assert.match(color(name), /^#[0-9a-f]{6}$/, `light ${name}`);
		assert.match(color(name, 'dark'), /^#[0-9a-f]{6}$/, `dark ${name}`);
	}
});

test('the paper is light, the ink is dark', () => {
	const lum = (hex: string) => parseInt(hex.slice(1, 3), 16);
	assert.ok(lum(color('paper')) > 230);
	assert.ok(lum(color('ink')) < 60);
});

test('a mode the tokens do not declare falls back to the one they do', () => {
	/* Grid ships one colourway; asking for dark must not throw or invent one. */
	assert.equal(color('paper', 'dark'), color('paper'));
});
