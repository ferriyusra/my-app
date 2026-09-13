import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isHighlighted, tokenize } from './highlight.ts';

/**
 * The highlighter's one hard promise is that it changes colour and nothing
 * else: a reader selects and copies what the author wrote. Everything below
 * either checks that, or checks a keyword set that would be wrong if the
 * languages shared one — which is the bug that made this per-language.
 */

const joined = (line: string, lang?: string) =>
	tokenize(line, lang)
		.map((t) => t.text)
		.join('');

const classOf = (line: string, lang: string, word: string) =>
	tokenize(line, lang).find((t) => t.text === word)?.cls ?? '';

test('the runs concatenate back to the line, whatever the language', () => {
	const lines: [string, string][] = [
		['const x = 1; // note', 'ts'],
		['func decide(a int) error { return nil }', 'go'],
		['def solve(n):  # O(n log n)', 'python'],
		["SELECT id FROM members WHERE name = 'a' -- all", 'sql'],
		['    indented   and   spaced    ', 'go'],
		['', 'ts'],
		['no grammar for this one', 'brainfuck'],
	];
	for (const [line, lang] of lines) {
		assert.equal(joined(line, lang), line, `${lang}: "${line}" did not round-trip`);
	}
});

test('a language with no grammar is returned untouched rather than guessed at', () => {
	const tokens = tokenize('threshold = balance / claims', 'text');
	assert.equal(tokens.length, 1);
	assert.equal(tokens[0].cls, '', 'plain text should carry no colour');
	assert.equal(isHighlighted('text'), false);
	assert.equal(isHighlighted('go'), true);
});

test('keyword sets do not leak between languages', () => {
	/* The bug this file exists to prevent: `.map(` is a method in TypeScript
	   and `map` is a type in Go, and one shared list colours both wrongly. */
	assert.equal(classOf('const out = xs.map(f);', 'ts', 'map'), '');
	assert.equal(classOf('var m map[string]int', 'go', 'map'), 'tk-keyword');
	assert.equal(classOf('for i := range xs {', 'go', 'range'), 'tk-keyword');
	assert.equal(classOf('for (const x of range) {', 'ts', 'range'), '');
	assert.equal(classOf('func main() {', 'go', 'func'), 'tk-keyword');
	assert.equal(classOf('def main():', 'python', 'def'), 'tk-keyword');
	assert.equal(classOf('def main():', 'ts', 'def'), '');
});

test('comments open on the marker the language actually uses', () => {
	assert.equal(classOf('x = 1  # why', 'python', '# why'), 'tk-comment');
	/* `#` is a private field in TypeScript, not a comment. */
	assert.equal(tokenize('this.#count = 1', 'ts').some((t) => t.cls === 'tk-comment'), false);
	assert.equal(classOf('SELECT 1 -- why', 'sql', '-- why'), 'tk-comment');
	assert.equal(classOf('const a = 1; // why', 'ts', '// why'), 'tk-comment');
});

test('a keyword inside a string or a comment is not coloured as one', () => {
	const inString = tokenize(`const s = 'return false';`, 'ts');
	assert.equal(inString.filter((t) => t.cls === 'tk-keyword').length, 1, 'only the leading const is a keyword');
	assert.equal(classOf(`const s = 'return false';`, 'ts', `'return false'`), 'tk-string');

	const inComment = tokenize('// return null when absent', 'ts');
	assert.equal(inComment.length, 1);
	assert.equal(inComment[0].cls, 'tk-comment');
});

test('SQL folds case, and the languages that do not, do not', () => {
	assert.equal(classOf('select id from t', 'sql', 'select'), 'tk-keyword');
	assert.equal(classOf('SELECT id FROM t', 'sql', 'SELECT'), 'tk-keyword');
	assert.equal(classOf('CONST x = 1', 'ts', 'CONST'), '', 'TypeScript is case-sensitive');
});

test('the language name is case-folded, because it is also a label', () => {
	/* The editor's manifest says lang: 'TypeScript' and shows that string to
	   the reader. A case-sensitive lookup missed it and silently dropped every
	   colour in the VS Code window. */
	assert.equal(classOf('const a = 1;', 'TypeScript', 'const'), 'tk-keyword');
	assert.equal(classOf('func main() {', 'Go', 'func'), 'tk-keyword');
	assert.equal(isHighlighted('TypeScript'), true);
});

test('aliases reach the same grammar as the name they stand for', () => {
	for (const [alias, real] of [['typescript', 'ts'], ['golang', 'go'], ['py', 'python'], ['postgres', 'sql']]) {
		assert.deepEqual(
			tokenize('x = 1', alias),
			tokenize('x = 1', real),
			`${alias} should tokenise as ${real}`,
		);
	}
});

test('numbers are coloured, and identifiers holding digits are not split', () => {
	assert.equal(classOf('const n = 200;', 'ts', '200'), 'tk-number');
	assert.equal(joined('const sha256 = 1;', 'ts'), 'const sha256 = 1;');
	assert.equal(tokenize('const sha256 = 1;', 'ts').some((t) => t.text === '256'), false);
});
