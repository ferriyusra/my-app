import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
	noteLength,
	noteText,
	notes,
	notesText,
	plannedNotes,
	writtenNotes,
} from './notes.ts';
import { skills } from './skills.ts';
import { experiences } from './experience.ts';

/**
 * What these tests defend is the honesty of the feature rather than its
 * rendering. A study log is one bad month away from being the "Coming soon"
 * page this repository already deleted, so the two failures that matter are a
 * promise whose date has passed and a claim that joins to nothing.
 */

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

/** This month, in the same 'YYYY-MM' shape the data uses. */
function thisMonth(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

test('slugs are unique, lowercase and safe in a URL, a path and a command', () => {
	const seen = new Set<string>();
	for (const n of notes) {
		assert.match(
			n.slug,
			/^[a-z0-9]+(-[a-z0-9]+)*$/,
			`"${n.slug}" is not a lowercase kebab slug; the Terminal lowercases its argument, so a capital would be unreachable`,
		);
		assert.ok(!seen.has(n.slug), `two notes share the slug "${n.slug}"`);
		seen.add(n.slug);
	}
});

test('titles are unique, so a search result names one note', () => {
	const titles = notes.map((n) => n.title);
	assert.equal(new Set(titles).size, titles.length, 'two notes share a title');
});

test('every month is a real month', () => {
	for (const n of notes) {
		const month = n.status === 'written' ? n.date : n.target;
		assert.match(month, MONTH, `${n.slug}: "${month}" is not YYYY-MM`);
	}
});

test('no planned note has a target month that has already passed', () => {
	/* The charge against /articles, in discarded.ts: "a promise with a date
	   attached, and the date had passed". It cannot pass here without this
	   failing first. There is no CI, so the reminder lands on `npm test` and
	   never blocks a deploy. */
	const now = thisMonth();
	for (const n of plannedNotes()) {
		assert.ok(
			n.target >= now,
			`${n.slug} was due ${n.target} and is still unwritten. Write it, or move the target — a date that has passed is the bug that deleted /articles.`,
		);
	}
});

test('everything a note claims to apply to is a skill or a role that exists', () => {
	const known = new Set([
		...skills.map((s) => s.name),
		...experiences.map((e) => e.short),
	]);
	for (const n of notes) {
		for (const name of n.applies ?? []) {
			assert.ok(
				known.has(name),
				`${n.slug} applies to "${name}", which is neither a skill in skills.ts nor a role short in experience.ts. Known: ${[...known].join(', ')}`,
			);
		}
	}
});

test('a written note carries a body and says whose words it is in', () => {
	for (const n of writtenNotes()) {
		assert.ok(n.sections.length > 0, `${n.slug} is written but has no sections`);
		for (const s of n.sections) {
			assert.ok(s.heading.trim().length > 0, `${n.slug} has a section with no heading`);
			assert.ok(s.body.length > 0, `${n.slug} › "${s.heading}" has no blocks`);
		}
		assert.ok(
			n.source.name.trim().length > 0,
			`${n.slug} does not name what it was studied from`,
		);
		assert.ok(
			n.source.note.trim().length > 0,
			`${n.slug} does not say on the page that the write-up is the author's own`,
		);
	}
});

test('the flattened text carries every block, so search cannot miss one', () => {
	for (const n of writtenNotes()) {
		const text = noteText(n).join(' ');
		for (const s of n.sections) {
			assert.ok(text.includes(s.heading), `${n.slug}: heading "${s.heading}" is missing from the text`);
			for (const b of s.body) {
				const sample =
					typeof b === 'string'
						? b
						: b.kind === 'list'
							? b.items[0]
							: b.kind === 'code'
								? b.text.split('\n')[0]
								: b.head[0];
				const wanted = typeof b === 'object' && b.kind === 'code' ? sample : sample.replace(/[*`]/g, '');
				assert.ok(text.includes(wanted), `${n.slug}: a ${typeof b === 'string' ? 'paragraph' : b.kind} block is missing from the text`);
			}
		}
	}
});

test('emphasis and inline-code marks are stripped from prose before it is indexed', () => {
	const text = notesText().join(' ');
	assert.ok(!text.includes('**'), 'bold marks should not reach the search index');
	/* Code keeps its backticks — a Go raw string is written with them. Prose
	   does not, so any backtick left in the text belongs to a code block. */
	const codeText = writtenNotes()
		.flatMap((n) => n.sections.flatMap((s) => s.body))
		.filter((b): b is { kind: 'code'; lang: string; text: string } => typeof b !== 'string' && b.kind === 'code')
		.map((b) => b.text)
		.join(' ');
	const proseTicks = text.split('`').length - 1 - (codeText.split('`').length - 1);
	assert.equal(proseTicks, 0, 'inline-code marks should not reach the search index');
});

test('no note title collides with a skill name', () => {
	/* search.test.ts asserts that searching "Go" returns the Skill first. A
	   note titled with a bare tool name would outrank or tie it. */
	const names = new Set(skills.map((s) => s.name.toLowerCase()));
	for (const n of notes) {
		assert.ok(
			!names.has(n.title.toLowerCase()),
			`${n.slug} is titled "${n.title}", which is also a skill name`,
		);
	}
});

test('no slug is caught by the terminal case-study heuristic', () => {
	/* `cat` matches the case study on any argument containing these words. The
	   exact-slug lookup runs first, but a slug that collides would still be
	   unreachable by a prefix, so keep them apart. */
	for (const n of notes) {
		for (const word of ['case', 'aso', 'billing', 'deposit', 'alert']) {
			assert.ok(
				!n.slug.includes(word),
				`${n.slug} contains "${word}", which the terminal reads as the case study`,
			);
		}
	}
});

test('a written note reports a length it actually has', () => {
	for (const n of writtenNotes()) {
		const { sections, minutes } = noteLength(n);
		assert.equal(sections, n.sections.length);
		assert.ok(minutes >= 1, `${n.slug} rounds to less than a minute`);
	}
});

test('an unwritten entry is something started, not a wish list', () => {
	/* Empty is a valid state and the window says so. What is not valid is a
	   file of "planned" rows with nothing in hand: that is a list of topics
	   nobody has begun, which is the promise /articles was deleted for. */
	if (notes.length === 0) return;
	assert.ok(
		notes.some((n) => n.status === 'studying' || n.status === 'written'),
		'every entry is "planned" — a list of topics nobody has started is a promise, not a study log',
	);
});

test('the empty state promises nothing and names no date', () => {
	/* The failure this guards cannot be reached from a running page: someone
	   fills the quiet window with a teaser. repo.test.ts reads the component
	   tree as text for the same class of bug. */
	const src = readFileSync(
		new URL('../components/apps/notes-app.tsx', import.meta.url),
		'utf8',
	);
	const empty = src.slice(src.indexOf('function Empty()'), src.indexOf('function Planned('));
	assert.ok(empty.length > 200, 'the empty state should still be in this file');
	for (const phrase of [/coming soon/i, /stay tuned/i, /check back/i, /watch this space/i]) {
		assert.ok(
			!phrase.test(empty),
			`the empty state says ${phrase} — that is the /articles bug, written out longhand`,
		);
	}
	assert.ok(
		!/\b20\d{2}\b/.test(empty),
		'the empty state names a year, which turns an honest blank into a deadline',
	);
});
