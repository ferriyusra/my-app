import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

/**
 * Checks over the repository itself, for bugs that no runtime assertion can
 * reach: the stylesheets and the component tree read as text.
 *
 * There is no DOM here on purpose.
 */

function files(ext: string, dir = 'src', out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) files(ext, path, out);
		else if (path.endsWith(ext)) out.push(path);
	}
	return out;
}

test('no icon component name is left sitting in prose', () => {
	/* The icons were renamed to an `Li` prefix with a find-and-replace that
	   reached into English. `616c1de` fixed the first escape; a second one
	   shipped anyway and read "LiSearch Apple's catalogue" to every visitor.
	   Twice is enough to warrant a guard.

	   An icon name belongs in code. In a comment it is always a leak, and in a
	   JSX text run (a line carrying no tag, attribute or expression) it is the
	   version a visitor reads. */
	const ICON = /\bLi[A-Z][a-zA-Z]*\b/;
	const leaks: string[] = [];

	for (const file of files('.tsx')) {
		readFileSync(file, 'utf8')
			.split('\n')
			.forEach((line, i) => {
				/* An HTML entity ends in a semicolon, which would otherwise read
				   as code punctuation and excuse the very line this exists for. */
				const text = line.trim().replace(/&[a-z]+;/g, '');
				if (!ICON.test(text)) return;
				const inComment = /^(\/\/|\/\*|\*)/.test(text);
				const inProse =
					!/[<>={}():;]/.test(text) &&
					!text.endsWith(',') &&
					text.split(/\s+/).length >= 3;
				if (inComment || inProse) {
					leaks.push(`${file}:${i + 1}  ${text.slice(0, 72)}`);
				}
			});
	}

	assert.deepEqual(
		leaks,
		[],
		`an icon component name is being read as a word:\n  ${leaks.join('\n  ')}`,
	);
});

test('no colour is written outside the token file', () => {
	/* Hallmark's Floor 48, and the reason dark mode is one block: a literal in
	   a component stylesheet is a colour the dark tokens cannot reach. The
	   token file is exempt by definition; everything else goes through var(). */
	const LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/;
	const hits: string[] = [];
	for (const file of files('.css')) {
		if (file.endsWith('tokens.css')) continue;
		readFileSync(file, 'utf8')
			.split('\n')
			.forEach((line, i) => {
				/* Comments may name a colour; the Hallmark stamp quotes gates. */
				const code = line.replace(/\/\*.*?\*\//g, '');
				if (LITERAL.test(code)) hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 72)}`);
			});
	}
	assert.deepEqual(hits, [], `a colour literal outside tokens.css:\n  ${hits.join('\n  ')}`);
});

test('the stylesheet opens with the Hallmark stamp', () => {
	/* The stamp is what the design linter and the next Hallmark run read: the
	   shape, the theme, and every waiver and drop on the record. It has to be
	   the first thing in the file. */
	const first = readFileSync('src/app/globals.css', 'utf8').split('\n').find((l) => l.trim());
	assert.match(first ?? '', /^\/\* Hallmark · shape: /);
});
