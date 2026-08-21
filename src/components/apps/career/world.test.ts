import assert from 'node:assert/strict';
import { test } from 'node:test';

import { levels } from '../../../data/career-game.ts';
import {
	CHAPTER_W,
	PICKUP_R,
	chapterProgress,
	chapters,
	heroPct,
	maxJump,
	pipPct,
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

test('chapter progress counts that chapter and no other', () => {
	const all = chapters();
	const ch1 = all[1];
	/* Take everything in chapter 0 and one thing in chapter 1. */
	const have = new Set([
		...all[0].tokens.map((t) => t.id),
		ch1.tokens[0].id,
	]);

	assert.deepEqual(chapterProgress(all[0], have), {
		done: all[0].tokens.length,
		total: all[0].tokens.length,
	});
	assert.deepEqual(chapterProgress(ch1, have), {
		done: 1,
		total: ch1.tokens.length,
	});
	assert.deepEqual(chapterProgress(all[2], have), {
		done: 0,
		total: all[2].tokens.length,
	});
});

test('pips stay on the strip and keep the order they are walked in', () => {
	for (const c of chapters()) {
		const pcts = c.tokens.map((t) => pipPct(t, c));
		for (const [i, pct] of pcts.entries()) {
			assert.ok(
				pct >= 0 && pct <= 100,
				`${c.tokens[i].skill} maps to ${pct}%, off the strip`,
			);
		}
		for (let i = 1; i < pcts.length; i++) {
			assert.ok(
				pcts[i] > pcts[i - 1],
				`${c.tokens[i].skill} is drawn before the token to its left`,
			);
		}
	}
});

test('the marker agrees with the pips it is meant to line up against', () => {
	const c = chapters()[1];
	/* Standing exactly on a token must put the marker on that pip. */
	for (const t of c.tokens) {
		assert.equal(
			Math.round(heroPct(t.x, c)),
			Math.round(pipPct(t, c)),
			`marker and pip disagree at ${t.skill}`,
		);
	}
	assert.equal(heroPct(c.x, c), 0, 'chapter start is the left edge');
	assert.ok(heroPct(c.x - 500, c) === 0, 'clamped before the chapter');
	assert.ok(heroPct(c.x + 99999, c) === 100, 'clamped past the chapter');
});
