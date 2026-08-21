import assert from 'node:assert/strict';
import { test } from 'node:test';

import { experiences } from './experience.ts';
import { career, levels } from './career-game.ts';

test('levels run oldest first, so LV.1 is where the career started', () => {
	const all = levels();
	assert.equal(all.length, experiences.length);
	assert.equal(all[0].level, 1);
	assert.equal(all.at(-1)?.exp.current, true, 'the last level is the current role');
	for (let i = 1; i < all.length; i++) {
		assert.ok(
			all[i].exp.startISO >= all[i - 1].exp.startISO,
			'levels must be in chronological order',
		);
	}
});

test('a tool is unlocked once, by the earliest role that used it', () => {
	const all = levels();
	const seen = new Set<string>();
	for (const l of all) {
		for (const t of l.unlocked) {
			assert.ok(!seen.has(t), `${t} was unlocked twice (again at LV.${l.level})`);
			seen.add(t);
		}
	}
	/* Every tool named anywhere must be unlocked exactly once. */
	const every = new Set(experiences.flatMap((e) => e.tech));
	assert.deepEqual([...seen].sort(), [...every].sort());
});

test('carried counts what was already known walking into a role', () => {
	const all = levels();
	assert.equal(all[0].carried, 0, 'nothing is carried into the first role');
	let running = 0;
	for (const l of all) {
		assert.equal(l.carried, running, `LV.${l.level} carried the wrong count`);
		running += l.unlocked.length;
	}
});

test('the totals match the levels they are summed from', () => {
	const all = levels();
	const c = career();
	assert.equal(c.roles, all.length);
	assert.equal(c.skills, new Set(experiences.flatMap((e) => e.tech)).size);
	assert.equal(c.months, all.reduce((s, l) => s + l.months, 0));
	assert.ok(c.months > 0 && c.skills > 0);
});

test('every role has a quest line written for it', () => {
	for (const l of levels()) {
		assert.ok(l.quest.length > 0);
		assert.notEqual(l.quest, l.exp.description, `${l.exp.short} fell back to its description`);
	}
});
