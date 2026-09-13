/**
 * A minimal, per-language highlighter.
 *
 * A full tokeniser (or Shiki) would be several hundred kilobytes to colour a
 * handful of short excerpts. One ordered alternation covering comments,
 * strings, keywords and numbers gets the same read at a rounding error of the
 * cost — and because the alternation is ordered, a keyword inside a string or
 * a comment is never mis-coloured.
 *
 * It lived inside the editor window and was TypeScript-only, which was fine
 * while the only code on the site was this repository's own. The notes carry
 * Go, Python and SQL, and the keyword sets are not interchangeable: `map` and
 * `range` are keywords in Go and ordinary identifiers in TypeScript, where
 * `.map(` appears in most of the editor's excerpts; `#` opens a comment in
 * Python and a private field in TypeScript. So the sets key off the language,
 * and a language with no entry is returned untouched rather than guessed at.
 *
 * No JSX here on purpose: this is logic, and `node --test` loads it directly.
 * The two callers wrap the spans themselves.
 */

/** A run of source, and the class that colours it. `cls` is empty for plain text. */
export type Token = { text: string; cls: string };

type Grammar = {
	/** What opens a comment that runs to the end of the line. */
	comment: string;
	/** Which quote characters open a string. */
	quotes: string[];
	words: string[];
	/** SQL is conventionally written in capitals, and just as often is not. */
	fold?: boolean;
};

const GRAMMARS: Record<string, Grammar> = {
	ts: {
		comment: '//',
		quotes: ["'", '"', '`'],
		words: [
			'const', 'let', 'var', 'function', 'return', 'type', 'interface',
			'export', 'import', 'from', 'if', 'else', 'switch', 'case', 'default',
			'new', 'await', 'async', 'for', 'of', 'null', 'true', 'false',
			'undefined',
		],
	},
	go: {
		comment: '//',
		quotes: ["'", '"', '`'],
		words: [
			'package', 'import', 'func', 'return', 'type', 'struct', 'interface',
			'var', 'const', 'if', 'else', 'for', 'range', 'switch', 'case',
			'default', 'go', 'defer', 'select', 'chan', 'map', 'nil', 'true',
			'false',
		],
	},
	python: {
		comment: '#',
		quotes: ["'", '"'],
		words: [
			'def', 'class', 'return', 'import', 'from', 'if', 'elif', 'else',
			'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True',
			'False', 'try', 'except', 'finally', 'raise', 'with', 'as', 'yield',
			'lambda', 'pass', 'break', 'continue',
		],
	},
	sql: {
		comment: '--',
		quotes: ["'"],
		fold: true,
		words: [
			'select', 'from', 'where', 'group', 'order', 'by', 'having', 'join',
			'left', 'right', 'inner', 'outer', 'on', 'insert', 'into', 'values',
			'update', 'set', 'delete', 'create', 'table', 'index', 'as', 'and',
			'or', 'not', 'null', 'limit', 'offset', 'with', 'distinct', 'case',
			'when', 'then', 'end', 'asc', 'desc',
		],
	},
};

/** Languages the notes and the editor may name for the same grammar. */
const ALIAS: Record<string, string> = {
	typescript: 'ts',
	tsx: 'ts',
	js: 'ts',
	javascript: 'ts',
	json: 'ts',
	golang: 'go',
	py: 'python',
	postgres: 'sql',
	postgresql: 'sql',
};

function escape(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** `'(?:\\.|[^'\\])*'` for each quote, so an escaped quote does not end the run. */
function strings(quotes: string[]): string {
	return quotes.map((q) => `${q}(?:\\\\.|[^${q}\\\\])*${q}`).join('|');
}

/* Built once per language and kept: the alternation is the same every call. */
const compiled = new Map<string, RegExp | null>();

function patternFor(lang: string): RegExp | null {
	/* Case-folded: the editor's manifest labels its excerpts "TypeScript"
	   because that string is also shown to the reader. */
	const name = lang.toLowerCase();
	const key = ALIAS[name] ?? name;
	if (compiled.has(key)) return compiled.get(key) ?? null;

	const g = GRAMMARS[key];
	if (!g) {
		compiled.set(key, null);
		return null;
	}
	const re = new RegExp(
		`(${escape(g.comment)}[^\\n]*)` +
			`|(${strings(g.quotes)})` +
			`|\\b(${g.words.join('|')})\\b` +
			`|\\b(\\d+(?:\\.\\d+)?)\\b`,
		g.fold ? 'gi' : 'g',
	);
	compiled.set(key, re);
	return re;
}

/** True when this language is coloured at all, so a caller can label the box. */
export function isHighlighted(lang: string): boolean {
	return patternFor(lang) !== null;
}

/**
 * One line of source as coloured runs.
 *
 * Concatenating every `text` returns the line exactly, so a caller can render
 * these as spans without changing what the reader can select or copy.
 */
export function tokenize(line: string, lang = 'ts'): Token[] {
	const re = patternFor(lang);
	if (!re || !line) return line ? [{ text: line, cls: '' }] : [];

	const out: Token[] = [];
	let last = 0;
	let m: RegExpExecArray | null;
	re.lastIndex = 0;

	while ((m = re.exec(line))) {
		if (m.index > last) out.push({ text: line.slice(last, m.index), cls: '' });
		const [full, comment, string, keyword, num] = m;
		out.push({
			text: full,
			cls: comment
				? 'tk-comment'
				: string
					? 'tk-string'
					: keyword
						? 'tk-keyword'
						: num
							? 'tk-number'
							: '',
		});
		last = m.index + full.length;
	}
	if (last < line.length) out.push({ text: line.slice(last), cls: '' });
	return out;
}
