import assert from 'node:assert/strict';
import { test } from 'node:test';
import { label, prose } from './text.ts';

/**
 * The page prints no em or en dash in visible copy, while the data keeps the
 * author's punctuation. These pin the conversion to forms that still read.
 */

test('a pair of em dashes reads as a pair of commas', () => {
	assert.equal(
		prose('It reads its three sources once each — not once per client — then evaluates.'),
		'It reads its three sources once each, not once per client, then evaluates.',
	);
});

test('a lone em dash before a clause becomes a comma', () => {
	assert.equal(
		prose('Lucide outlines on tinted gradient squares — then brought back.'),
		'Lucide outlines on tinted gradient squares, then brought back.',
	);
});

test('a numeric range reads with "to"', () => {
	assert.equal(prose('~20–30% productivity gain'), '~20 to 30% productivity gain');
	assert.equal(label('2025–2026'), '2025 to 2026');
});

test('no dash survives and no comma is doubled', () => {
	const out = prose('Finance infrastructure at Meditap — the ASO billing services — in Go.');
	assert.ok(!/[—–]/.test(out));
	assert.ok(!/,\s*,/.test(out));
	assert.ok(!/,\./.test(out));
});

test('labels also read "and" for an ampersand', () => {
	assert.equal(label('Backend Engineer — design & implementation'), 'Backend Engineer, design and implementation');
});
