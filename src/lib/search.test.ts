import assert from 'node:assert/strict';
import { test } from 'node:test';

import { experiences } from '../data/experience.ts';
import { skills } from '../data/skills.ts';
import { excerpt, index, search } from './search.ts';

test('the index covers every role, project and skill without being hand-written', () => {
	const all = index();
	assert.equal(all.filter((h) => h.kind === 'Role').length, experiences.length);
	assert.equal(all.filter((h) => h.kind === 'Skill').length, skills.length);
	assert.ok(all.some((h) => h.kind === 'Case study'));
	assert.ok(all.some((h) => h.kind === 'Discarded'));
});

test('every hit names a window that can actually answer it', () => {
	const apps = new Set(['about', 'explorer', 'skills', 'experience', 'recycle']);
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
