import assert from 'node:assert/strict';
import { test } from 'node:test';

import { levels } from '../../../data/career-game.ts';
import {
	CHAPTER_W,
	PICKUP_R,
	chapters,
	maxJump,
	reachable,
} from './world.ts';

test('there is one chapter per role, laid out left to right', () => {
	const all = chapters();
	assert.equal(all.length, levels().length);
	all.forEach((c, i) => {
		assert.equal(c.index, i);
		assert.equal(c.x, i * CHAPTER_W);
	});
});

test('every skill a role unlocked becomes exactly one token', () => {
	for (const c of chapters()) {
		assert.deepEqual(
			c.tokens.map((t) => t.skill),
			[...c.unlocked],
			`${c.exp.short} lost or gained a token`,
		);
	}
});

test('tokens stay clear of the signpost and the gate', () => {
	for (const c of chapters()) {
		for (const t of c.tokens) {
			const local = t.x - c.x;
			assert.ok(local >= 200, `${t.skill} sits under the signpost (${local})`);
			assert.ok(
				local <= CHAPTER_W - 140,
				`${t.skill} sits past the gate (${local})`,
			);
		}
	}
});

test('every raised token can actually be reached by jumping', () => {
	/* The one rule that would make a chapter impossible to finish. */
	for (const c of chapters()) {
		for (const t of c.tokens) {
			assert.ok(
				reachable(t.y),
				`${t.skill} at y=${t.y} is above a ${maxJump().toFixed(0)}px jump`,
			);
		}
	}
});

test('the first token of a chapter never needs a jump', () => {
	/* So nobody is stuck at the start of the game not knowing they can jump. */
	for (const c of chapters()) {
		const first = c.tokens[0];
		assert.ok(
			first.y <= PICKUP_R,
			`${c.exp.short} opens with a token that needs a jump`,
		);
	}
});

test('at least one chapter uses the jump, or the mechanic is decoration', () => {
	const raised = chapters().flatMap((c) => c.tokens).filter((t) => t.y > PICKUP_R);
	assert.ok(raised.length > 0, 'no token is ever off the ground');
});
