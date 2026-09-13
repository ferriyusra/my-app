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
 * The study plan, and then the notes as they are written.
 *
 * Ordered as it is read: what is in hand, then what is next. A planned entry
 * says what the note will cover and which tool already on the CV it reaches,
 * so the list is a direction rather than a wish.
 */
export const notes: Note[] = [
	{
		slug: 'binary-search-boundaries',
		title: 'Binary search on an answer, not an index',
		topic: 'dsa',
		status: 'studying',
		target: '2026-09',
		summary:
			'The shape shared by first-true and last-true problems, and why the loop invariant matters more than the midpoint arithmetic.',
	},
	{
		slug: 'two-pointers-and-windows',
		title: 'Two pointers, and the window that falls out of them',
		topic: 'dsa',
		status: 'planned',
		target: '2026-10',
		summary:
			'When a nested loop is really one pass, and the condition that decides which pointer moves.',
	},
	{
		slug: 'graphs-bfs-dfs',
		title: 'Breadth, depth, and choosing between them',
		topic: 'dsa',
		status: 'planned',
		target: '2026-11',
		summary:
			'Traversal as one template with two queues, and the problems where the choice of queue is the whole answer.',
	},
	{
		slug: 'idempotency-and-retries',
		title: 'Retries, idempotency keys and exactly-once that is not',
		topic: 'system-design',
		status: 'planned',
		target: '2026-12',
		summary:
			'Why at-least-once delivery is the honest default, and what a consumer has to hold to survive it.',
		applies: ['Kafka', 'Pub/Sub', 'PostgreSQL'],
	},
	{
		slug: 'caching-and-invalidation',
		title: 'Caches, and the cost of being wrong for a while',
		topic: 'system-design',
		status: 'planned',
		target: '2027-01',
		summary:
			'Read-through, write-through and TTL as a decision about staleness rather than about speed.',
		applies: ['Redis', 'PostgreSQL'],
	},
	{
		slug: 'sharding-and-hot-keys',
		title: 'Sharding, and the key that ruins it',
		topic: 'system-design',
		status: 'planned',
		target: '2027-02',
		summary:
			'Partitioning by hash, by range and by tenant, and what each one does when one tenant is ten times the rest.',
		applies: ['PostgreSQL', 'Kafka'],
	},
];

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
