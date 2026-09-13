import type { CaseBlock } from './case-study.ts';

/**
 * Learning notes on data structures, algorithms and system design.
 *
 * This file is the one copy. The Notes window, Explorer's Documents ▸ Notes,
 * Start's search index, the Terminal and the server document all derive from
 * it, the same rule the roles, projects and reversed decisions follow.
 *
 * Two things about the shape, both deliberate:
 *
 * A note is either **written** or it is not, and the union below makes that a
 * type rather than a convention: a planned note has no `sections` field to
 * fill in with a placeholder, and a written one cannot omit it. This
 * repository has already deleted a "Coming soon" route once — see the
 * `/articles` entry in discarded.ts, which is still on the desktop — and the
 * charge there was that the promise carried a date and the date had passed.
 * So an unwritten note carries a `target` month instead of a `date`, and
 * `notes.test.ts` fails when a target falls into the past. The reminder to
 * write it or move it is a failing test rather than a visitor's judgement.
 *
 * The surfaces derive from `writtenNotes()`, not from `notes`: Explorer grows a
 * Notes folder and the document grows a Notes section when there is something
 * to put in them, and not before. An empty folder teaches a visitor the
 * metaphor is a costume — the same argument that took the fake file entries out
 * of Explorer.
 *
 * **It is empty today, and that is the honest state.** It was first written
 * with six planned topics drafted from a course syllabus. Those came out again
 * before the branch was merged, and for two reasons: they were not the author's
 * plan, and a list of topics nobody has started is the promise `/articles` was
 * deleted for. The window says it is empty and why, which is what Mail's Sent
 * folder and the editor's disabled source control already do here — filling any
 * of them would mean inventing content.
 *
 * Nothing here reproduces course material. A written note names what it was
 * studied from and says, on the page, that the write-up is the author's own.
 */

/** A note is built from the same blocks as the case study, minus its figure. */
export type NoteBlock = Exclude<CaseBlock, { kind: 'figure' }>;

export type NoteTopic = 'dsa' | 'system-design';

export const TOPICS: Record<NoteTopic, string> = {
	dsa: 'Data structures & algorithms',
	'system-design': 'System design',
};

/** Short enough for a list row, where the full label does not fit. */
export const TOPIC_SHORT: Record<NoteTopic, string> = {
	dsa: 'Algorithms',
	'system-design': 'System design',
};

export type NoteSection = { heading: string; body: NoteBlock[] };

/** Where a note was studied from, and whose words it is in. */
export type NoteSource = { name: string; note: string };

type NoteBase = {
	/** Lowercase kebab. The Terminal noun, the Explorer id and the search intent. */
	slug: string;
	title: string;
	topic: NoteTopic;
	/** One sentence: the list row, and the subtitle of a search result. */
	summary: string;
	/**
	 * Skills or roles this connects to, spelled exactly as `skills.ts` and
	 * `experience.ts` spell them. It is what separates a note from a blog post:
	 * studying that reaches something already on the CV.
	 */
	applies?: string[];
};

export type WrittenNote = NoteBase & {
	status: 'written';
	/** 'YYYY-MM', when it was written. */
	date: string;
	source: NoteSource;
	sections: NoteSection[];
};

export type PlannedNote = NoteBase & {
	status: 'studying' | 'planned';
	/** 'YYYY-MM', when it is expected. A past target fails the test. */
	target: string;
};

export type Note = WrittenNote | PlannedNote;

/** What a status says on the page. The window and the Terminal both use these. */
export const STATUS_LABEL: Record<Note['status'], string> = {
	written: 'Written',
	studying: 'Studying now',
	planned: 'Planned',
};

/**
 * Every note, written and planned, in reading order.
 *
 * Empty until there is a real one. Add a `written` entry when a write-up
 * exists; add a `studying`/`planned` entry only for something actually being
 * worked on, with the month it is expected — `notes.test.ts` fails once that
 * month is in the past, so a stale plan cannot sit here unnoticed.
 */
export const notes: Note[] = [];

export const writtenNotes = (): WrittenNote[] =>
	notes.filter((n): n is WrittenNote => n.status === 'written');

export const plannedNotes = (): PlannedNote[] =>
	notes.filter((n): n is PlannedNote => n.status !== 'written');

export const noteBySlug = (slug: string): Note | undefined =>
	notes.find((n) => n.slug === slug);

/** When a note happened, whichever end of the union it is on. */
export const noteMonth = (n: Note): string =>
	n.status === 'written' ? n.date : n.target;

/** Prose without its emphasis or inline-code marks. Code keeps everything. */
export function plain(text: string): string {
	return text.replace(/[*`]/g, '');
}

/** One block as the lines a reader would read, in order. */
function blockText(b: NoteBlock): string[] {
	if (typeof b === 'string') return [plain(b)];
	if (b.kind === 'list') return b.items.map(plain);
	if (b.kind === 'code') return [b.text];
	return [...b.head.map(plain), ...b.rows.flat().map(plain)];
}

/**
 * Every line of one written note, in reading order.
 *
 * The search index and the tests both read this, so a block kind that escapes
 * it would be a note nobody could find. `case-study.test.ts` guards its twin
 * for the same reason.
 */
export function noteText(n: WrittenNote): string[] {
	const out = [
		n.title,
		n.summary,
		TOPICS[n.topic],
		n.source.name,
		...(n.applies ?? []),
	];
	for (const s of n.sections) {
		out.push(s.heading);
		for (const b of s.body) out.push(...blockText(b));
	}
	return out;
}

export const notesText = (): string[] => writtenNotes().flatMap(noteText);

/** The most recent written note, for Start's Recommended list. */
export const newestNote = (): WrittenNote | undefined =>
	[...writtenNotes()].sort((a, b) => b.date.localeCompare(a.date))[0];

/**
 * How long a note is, computed rather than written down — the same treatment
 * the case study's own length gets, and true without anyone maintaining it.
 */
export function noteLength(n: WrittenNote): { sections: number; minutes: number } {
	const words = noteText(n).join(' ').split(/\s+/).filter(Boolean).length;
	return {
		sections: n.sections.length,
		/* 200 words a minute, the usual figure for technical prose. */
		minutes: Math.max(1, Math.round(words / 200)),
	};
}
