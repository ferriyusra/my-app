import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { SOURCE_REFS, extract } from './source.ts';

/**
 * The point of these: the editor window used to quote code that had moved or
 * been rewritten, under a path it was no longer in. That could happen silently
 * because the excerpts were copies. They are read from the files now, and this
 * fails the moment one of them stops resolving — before the build does.
 */

test('every excerpt still resolves to real code in the file it names', async () => {
	for (const ref of SOURCE_REFS) {
		const source = await readFile(ref.path, 'utf8');
		const code = extract(source, ref.symbol);
		assert.ok(
			code.includes(ref.symbol),
			`${ref.path} :: ${ref.symbol} extracted something without the symbol in it`,
		);
		assert.ok(
			source.includes(code),
			`${ref.path} :: ${ref.symbol} is not a verbatim slice of the file`,
		);
	}
});

test('an excerpt is short enough to read in a window', async () => {
	/* A 180-line function is a scroll, not an excerpt — the first attempt at
	   this pulled in the whole terminal command set. */
	for (const ref of SOURCE_REFS) {
		const code = extract(await readFile(ref.path, 'utf8'), ref.symbol);
		const lines = code.split('\n').length;
		assert.ok(lines <= 60, `${ref.symbol} is ${lines} lines — too long to show`);
	}
});

test('a renamed or deleted symbol throws rather than returning something else', () => {
	assert.throws(
		() => extract('export function other() {\n  return 1;\n}\n', 'gone'),
		/no declaration of `gone`/,
	);
});

test('the doc comment above a declaration comes with it', () => {
	const code = extract(
		['/** Why this exists. */', 'export function thing() {', '\treturn 1;', '}'].join('\n'),
		'thing',
	);
	assert.match(code, /^\/\*\* Why this exists\. \*\//);
});

test('a brace inside a string does not end the declaration early', () => {
	/* The naive version cut `playSound` in half at the first `{` in a template
	   literal. */
	const code = extract(
		[
			'export function thing() {',
			'\tconst s = `a { b`;',
			"\tconst t = '} c';",
			'\treturn s + t;',
			'}',
		].join('\n'),
		'thing',
	);
	assert.match(code, /return s \+ t;/);
	assert.equal(code.split('\n').length, 5);
});

test('a comment brace does not end it early either', () => {
	const code = extract(
		['export function thing() {', '\t// a { here', '\t/* and } here */', '\treturn 1;', '}'].join('\n'),
		'thing',
	);
	assert.match(code, /return 1;/);
});

test('every excerpt names a distinct file, so the tree is worth drawing', () => {
	const paths = SOURCE_REFS.map((r) => r.path);
	assert.equal(new Set(paths).size, paths.length, 'two excerpts share a file');
});
