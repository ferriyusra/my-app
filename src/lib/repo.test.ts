import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

/**
 * Checks over the repository itself, for bugs that no runtime assertion can
 * reach: a stylesheet and a component tree agreeing with each other.
 *
 * There is no DOM here on purpose — these read the files as text.
 */

const CSS_PATH = 'src/app/globals.css';
const css = readFileSync(CSS_PATH, 'utf8');

function tsxFiles(dir = 'src', out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) tsxFiles(path, out);
		else if (path.endsWith('.tsx')) out.push(path);
	}
	return out;
}

/** Which files write each class name. */
function classOwners(): Map<string, Set<string>> {
	const owners = new Map<string, Set<string>>();
	for (const file of tsxFiles()) {
		for (const match of readFileSync(file, 'utf8').matchAll(/className='([^']+)'/g)) {
			for (const name of match[1].split(/\s+/).filter(Boolean)) {
				if (!owners.has(name)) owners.set(name, new Set());
				owners.get(name)!.add(file);
			}
		}
	}
	return owners;
}

/** The app a component belongs to, or null for shared chrome. */
function appOf(file: string): string | null {
	const m = file.match(/^src\/components\/apps\/([^/]+?)(?:-app)?(?:\.tsx|\/)/);
	return m ? m[1] : null;
}

test('no two apps style the same class name', () => {
	/* `.xp-bar` was declared twice at equal specificity — once as File
	   eXPlorer's address bar and once as eXPerience's career bar — because
	   both apps had claimed the same three-letter prefix. Neither rule was
	   wrong on its own; the cascade merged them per-property, so the address
	   bar was silently forced to 52px tall with its overflow hidden.

	   Two apps sharing a class is fine when one rule styles it, which is what
	   a shared control is. Two apps *and* two rules is the collision. */
	const owners = classOwners();
	for (const [name, files] of owners) {
		const apps = new Set([...files].map(appOf).filter(Boolean));
		if (apps.size < 2) continue;

		const rules = css.match(new RegExp(`^\\.${name} \\{`, 'gm')) ?? [];
		assert.ok(
			rules.length < 2,
			`.${name} has ${rules.length} rules of its own and is written by ` +
				`${[...apps].join(' and ')}. Whichever rule comes second wins on every ` +
				`property both declare, in a window whose author never saw the other one. ` +
				`Give one of them its own prefix.`,
		);
	}
});

test('the accent picker shows the colour selecting it produces', () => {
	/* The swatches used to carry their own hex in shell-context.tsx, and had
	   drifted from the tokens for four of the six. They live in globals.css
	   now, a few lines under the definitions they have to agree with — this
	   is what keeps them there. */
	const swatches = [...css.matchAll(
		/^\.sw-swatch\[data-accent='(\w+)'\]\s*\{\s*background:\s*(#[0-9a-f]{6});/gm,
	)];
	assert.ok(swatches.length >= 6, 'the swatch rules have moved or been renamed');

	for (const [, accent, hex] of swatches) {
		const block = css.match(
			new RegExp(`^html\\[data-accent='${accent}'\\][^{]*\\{([^}]*)\\}`, 'm'),
		);
		assert.ok(block, `no light accent block for '${accent}'`);
		const fill = block![1].match(/--accent-fill:\s*(#[0-9a-f]{6})/)?.[1];
		assert.equal(
			hex,
			fill,
			`the '${accent}' swatch paints ${hex} but selecting it produces ${fill}`,
		);
	}

	/* A dark counterpart is needed exactly where the fill moves between
	   themes, and today that is blue alone. If another accent's dark fill
	   diverges, this fails rather than letting the picker quietly lie again. */
	for (const [, accent] of swatches) {
		const light = css
			.match(new RegExp(`^html\\[data-accent='${accent}'\\][^{]*\\{([^}]*)\\}`, 'm'))![1]
			.match(/--accent-fill:\s*(#[0-9a-f]{6})/)![1];
		const dark = css
			.match(
				new RegExp(`^html\\[data-theme='dark'\\]\\[data-accent='${accent}'\\][^{]*\\{([^}]*)\\}`, 'm'),
			)![1]
			.match(/--accent-fill:\s*(#[0-9a-f]{6})/)![1];
		const override = css.match(
			new RegExp(
				`^html\\[data-theme='dark'\\] \\.sw-swatch\\[data-accent='${accent}'\\]\\s*\\{\\s*background:\\s*(#[0-9a-f]{6});`,
				'm',
			),
		);
		if (light === dark) {
			assert.equal(
				override,
				null,
				`'${accent}' paints the same fill in both themes, so its dark swatch ` +
					`override is dead weight`,
			);
		} else {
			assert.ok(
				override,
				`'${accent}' fills ${light} on light and ${dark} on dark, so the picker ` +
					`needs a dark swatch override and has none`,
			);
			assert.equal(override![1], dark);
		}
	}
});

test('no icon component name is left sitting in prose', () => {
	/* The icons were renamed to an `Li` prefix with a find-and-replace that
	   reached into English. `616c1de` fixed the first escape; a second one
	   shipped anyway and read "LiSearch Apple's catalogue" to every visitor who
	   opened the Media Player. Twice is enough to warrant a guard.

	   An icon name belongs in code. In a comment it is always a leak, and in a
	   JSX text run — a line carrying no tag, attribute or expression — it is
	   the version a visitor reads. */
	const ICON = /\bLi[A-Z][a-zA-Z]*\b/;
	const leaks: string[] = [];

	for (const file of tsxFiles()) {
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
