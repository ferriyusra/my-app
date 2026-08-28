import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * The excerpts the editor window shows, read from the real files.
 *
 * They used to be copied into `source-excerpts.ts` by hand, and three of the
 * five had quietly stopped matching: `zoneRect` moved to `window-reducer.ts`,
 * `playSound` grew a `detune` parameter, the contact route was rewritten. The
 * window went on labelling that code with paths it was no longer in — in a
 * portfolio whose whole position is that everything here is checkable, that is
 * the worst kind of bug, because it is invisible.
 *
 * So nothing is copied now. A symbol is named, and the file is read at build
 * time, on the server where `page.tsx` renders — the same trick
 * [wallpapers.ts](./wallpapers.ts) uses, and for the same reason: that page is
 * statically prerendered, so this happens once at build and is baked into the
 * HTML. No API route, no runtime filesystem access.
 *
 * **A missing symbol throws.** That is the point: if someone renames or deletes
 * one of these, the build stops rather than shipping a window that lies. There
 * is a test covering it too, so it fails before it gets that far.
 */

export type SourceRef = {
	/** Repository-relative, and shown to the reader as the label. */
	path: string;
	/** The declaration to extract. Renaming it must break the build. */
	symbol: string;
	lang: string;
	summary: string;
};

export type SourceFile = SourceRef & { code: string };

/**
 * Pull one declaration out of a file, with the doc comment above it.
 *
 * Brace-matching rather than a parser: these are five hand-picked declarations
 * in this repository's own style, and a TypeScript parse would be several
 * hundred kilobytes to read five functions. It counts braces outside strings
 * and comments, which is enough for the code it is pointed at — and if it ever
 * is not, the extraction throws instead of returning something plausible.
 */
export function extract(source: string, symbol: string): string {
	const lines = source.split('\n');
	const declares = new RegExp(
		`^\\s*(export\\s+)?(async\\s+)?(function|const|class)\\s+${symbol}\\b`,
	);
	const start = lines.findIndex((l) => declares.test(l));
	if (start === -1) {
		throw new Error(`source: no declaration of \`${symbol}\` found`);
	}

	/* Walk back over the doc comment, if there is one. */
	let from = start;
	if (lines[from - 1]?.trim().endsWith('*/')) {
		let i = from - 1;
		while (i >= 0 && !lines[i].trim().startsWith('/*')) i--;
		if (i >= 0) from = i;
	}

	/* Forward to the matching close, ignoring braces inside strings and
	   comments — a `{` in a template literal must not end the declaration. */
	let depth = 0;
	let seen = false;
	for (let i = start; i < lines.length; i++) {
		const line = lines[i];
		let quote: string | null = null;
		let block = false;
		for (let c = 0; c < line.length; c++) {
			const ch = line[c];
			const next = line[c + 1];
			if (block) {
				if (ch === '*' && next === '/') { block = false; c++; }
				continue;
			}
			if (quote) {
				if (ch === '\\') c++;
				else if (ch === quote) quote = null;
				continue;
			}
			if (ch === '/' && next === '*') { block = true; c++; continue; }
			if (ch === '/' && next === '/') break;
			if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
			if (ch === '{') { depth++; seen = true; }
			else if (ch === '}') {
				depth--;
				if (seen && depth === 0) return lines.slice(from, i + 1).join('\n');
			}
		}
		/* A `const x = …;` with no braces at all ends at its semicolon. */
		if (!seen && line.trimEnd().endsWith(';') && i > start) {
			return lines.slice(from, i + 1).join('\n');
		}
		if (!seen && i === start && line.trimEnd().endsWith(';')) {
			return lines.slice(from, i + 1).join('\n');
		}
	}
	throw new Error(`source: \`${symbol}\` is never closed`);
}

/** The five declarations the editor window shows. */
export const SOURCE_REFS: SourceRef[] = [
	{
		path: 'src/context/window-reducer.ts',
		symbol: 'zoneRect',
		lang: 'TypeScript',
		summary: 'Snap Layouts geometry, derived from the desktop area.',
	},
	{
		path: 'src/hooks/use-window-manager.ts',
		symbol: 'desktopBounds',
		lang: 'TypeScript',
		summary: 'The desktop area: the viewport, minus the taskbar.',
	},
	{
		path: 'src/lib/sounds.ts',
		symbol: 'playSound',
		lang: 'TypeScript',
		summary: 'System chimes, synthesised rather than downloaded.',
	},
	{
		path: 'src/data/career-game.ts',
		symbol: 'levels',
		lang: 'TypeScript',
		summary: 'Skills a role was the first to use — computed, not written.',
	},
	{
		path: 'src/lib/search.ts',
		symbol: 'search',
		lang: 'TypeScript',
		summary: 'Ranking: a title match outranks the same word in a body.',
	},
	{
		path: 'src/components/apps/career/world.ts',
		symbol: 'reachable',
		lang: 'TypeScript',
		summary: 'Whether a raised token can be touched during a jump.',
	},
];

/** Read every excerpt. Throws if any of them has gone missing. */
export async function loadSources(): Promise<SourceFile[]> {
	return Promise.all(
		SOURCE_REFS.map(async (ref) => {
			const full = path.join(process.cwd(), ref.path);
			const source = await readFile(full, 'utf8');
			return { ...ref, code: extract(source, ref.symbol) };
		}),
	);
}
