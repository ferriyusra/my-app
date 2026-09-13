import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { experiences } from '../data/experience.ts';
import { skills } from '../data/skills.ts';
import { TIP_PAGES } from '../data/tips.ts';
import { writtenNotes } from '../data/notes.ts';
import { excerpt, index, search } from './search.ts';

test('the Tips page states the size of the index it describes', () => {
	/* The figure is prose in `tips.ts`, which cannot import the index without
	   a cycle — the index includes the tips. Pinning it here is how it stays
	   true: it said 51 in a release whose index held 68. */
	const tip = TIP_PAGES.flatMap((p) => p.tips).find(
		(t) => t.title === 'One typed dataset, four ways in',
	);
	assert.ok(tip, 'the tip that quotes the index size should still exist');
	const said = tip.body.match(/(\d+) entries/)?.[1];
	assert.equal(said, String(index().length), 'tips.ts quotes a stale index size');
});

test('the index covers every role, project and skill without being hand-written', () => {
	const all = index();
	assert.equal(all.filter((h) => h.kind === 'Role').length, experiences.length);
	assert.equal(all.filter((h) => h.kind === 'Skill').length, skills.length);
	assert.ok(all.some((h) => h.kind === 'Case study'));
	assert.ok(all.some((h) => h.kind === 'Discarded'));
});

test('every hit names a window that can actually answer it', () => {
	/* Read from the AppId union rather than listed here: a hand-kept copy of
	   it passes for exactly as long as nobody adds a window, and the registry
	   cannot be imported into a test with no JSX runtime. */
	const source = readFileSync('src/types/windows.ts', 'utf8');
	const union = source.slice(
		source.indexOf('export type AppId ='),
		source.indexOf(';', source.indexOf('export type AppId =')),
	);
	const apps = new Set([...union.matchAll(/'([a-z]+)'/g)].map((m) => m[1]));
	assert.ok(apps.size > 5, 'the AppId union did not parse');

	for (const h of index()) {
		assert.ok(apps.has(h.app), `${h.title} points at ${h.app}`);
	}
});

test('the queries that used to return nothing now return something', () => {
	/* These are all in src/data, and Start found none of them before. */
	for (const q of ['Pub/Sub', 'Meditap', 'Kafka', 'Tableau', 'SATUSEHAT', 'spreadsheet']) {
		assert.ok(search(q).length > 0, `"${q}" found nothing`);
	}
});

test('a title match outranks the same word buried in a body', () => {
	/* "Go" appears in a dozen descriptions; the skill itself should lead. */
	const top = search('Go')[0];
	assert.equal(top.kind, 'Skill');
	assert.equal(top.title, 'Go');
});

test('an exact title beats a prefix, which beats a substring', () => {
	const hits = search('Kafka');
	assert.equal(hits[0].title, 'Kafka');
	assert.ok(hits.length > 1, 'the role that used it should still be listed');
});

test('a one-character query stays quiet rather than matching everything', () => {
	assert.deepEqual(search('a'), []);
	assert.deepEqual(search(' '), []);
	assert.ok(search('Go').length > 0, 'but two characters are enough');
});

test('the limit is honoured', () => {
	assert.ok(search('e', 3).length <= 3);
	assert.ok(search('a', 3).length <= 3);
	assert.equal(search('the', 2).length <= 2, true);
});

test('an excerpt is offered only when the match is not already visible', () => {
	/* Title match: the reader can see why it matched, so no excerpt. */
	const skill = search('Kafka')[0];
	assert.equal(excerpt(skill, 'Kafka'), null);

	/* Body match: show them where it came from. */
	const body = search('idempotency')[0];
	const e = excerpt(body, 'idempotency');
	assert.ok(e && e.toLowerCase().includes('idempotency'), 'excerpt should quote the match');
});

test('searching a discarded decision finds the Recycle Bin, not a role', () => {
	const hit = search('ScrollSmoother')[0];
	assert.equal(hit.kind, 'Discarded');
	assert.equal(hit.app, 'recycle');
});

test('written notes are indexed, and planned ones are not', () => {
	/* A planned note has no body to match, and a result that opens onto "not
	   written yet" answers nothing — the charge that deleted /articles. */
	const all = index();
	assert.equal(all.filter((h) => h.kind === 'Note').length, writtenNotes().length);
	for (const h of all.filter((h) => h.kind === 'Note')) {
		assert.equal(h.app, 'notes');
		assert.ok(h.intent, `${h.title} has no intent, so Start would open Notes on whatever was last selected`);
	}
});

test('every note hit carries the slug of the note it names', () => {
	for (const n of writtenNotes()) {
		const hit = index().find((h) => h.id === `note:${n.slug}`);
		assert.ok(hit, `${n.slug} is written but not indexed`);
		assert.equal(hit.intent, n.slug);
		assert.equal(hit.title, n.title);
	}
});

test('a hit that lands somewhere particular says where', () => {
	/* Start could only open an app, so a hit on one of the case study's own
	   sentences opened Experience on its landing page. */
	const hit = index().find((h) => h.kind === 'Case study');
	assert.equal(hit?.intent, 'case');
});
