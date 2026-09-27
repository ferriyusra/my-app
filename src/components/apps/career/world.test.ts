import assert from 'node:assert/strict';
import { test } from 'node:test';

import { levels } from '../../../data/career-game.ts';
import {
	HAZARD_H,
	HAZARD_W,
	MIN_GAP,
	PICKUP_R,
	SIGN_MID,
	SIGN_REACH,
	SPAWN_X,
	SPEED,
	USE_R,
	canClimb,
	chapterAt,
	chapterProgress,
	chapters,
	hasLayout,
	hazardDir,
	hazardX,
	heroPct,
	maxJump,
	pipPct,
	reachable,
	worldWidth,
} from './world.ts';

test('there is one chapter per role, laid end to end', () => {
	const all = chapters();
	assert.equal(all.length, levels().length);
	let x = 0;
	all.forEach((c, i) => {
		assert.equal(c.index, i);
		assert.equal(c.x, x, `${c.exp.short} does not start where the last one ended`);
		x += c.w;
	});
	assert.equal(worldWidth(all), x);
});

test('every role has a layout of its own', () => {
	for (const c of chapters()) assert.ok(hasLayout(c.exp.short), `${c.exp.short} uses the fallback`);
});

test('chapterAt maps any x to the chapter it is in, and clamps', () => {
	const all = chapters();
	for (const c of all) {
		assert.equal(chapterAt(c.x, all), c.index);
		assert.equal(chapterAt(c.x + c.w - 1, all), c.index);
	}
	assert.equal(chapterAt(-50, all), 0);
	assert.equal(chapterAt(worldWidth(all) + 999, all), all.length - 1);
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

test('every stop of a role\'s objective is in its chapter, once', () => {
	for (const c of chapters()) {
		assert.deepEqual(
			c.spots.map((s) => s.id).sort(),
			c.goal.stops.map((s) => s.id).sort(),
		);
	}
});

test('the spread keeps clear of the signpost and the era post, and nothing crowds', () => {
	for (const c of chapters()) {
		const items = [...c.tokens, ...c.spots].map((t) => t.x - c.x).sort((a, b) => a - b);
		for (const local of items) {
			assert.ok(local >= 200, `${c.exp.short}: something sits under the signpost (${local})`);
			assert.ok(local <= c.w - 140, `${c.exp.short}: something sits past the era post (${local})`);
		}
		for (let i = 1; i < items.length; i++) {
			assert.ok(
				items[i] - items[i - 1] >= MIN_GAP - 0.5,
				`${c.exp.short}: two things ${Math.round(items[i] - items[i - 1])}px apart`,
			);
		}
	}
});

test('every token and walk-into stop is reachable from a surface beneath it', () => {
	/* The one rule that would make a chapter impossible to finish. */
	for (const c of chapters()) {
		const things = [
			...c.tokens.map((t) => ({ name: t.skill, x: t.x, y: t.y })),
			...c.spots.filter((s) => s.act === 'touch').map((s) => ({ name: s.name, x: s.x, y: s.y })),
		];
		for (const t of things) {
			const under = c.ledges.filter((l) => t.x >= l.x && t.x <= l.x + l.w && l.y <= t.y);
			const surfaces = [0, ...under.map((l) => l.y)];
			assert.ok(
				surfaces.some((s) => reachable(t.y - s)),
				`${t.name} at y=${t.y} is out of reach of (${surfaces.join(', ')}) with a ${maxJump().toFixed(0)}px jump`,
			);
		}
	}
});

test('every press-E stop stands on something the character can stand on', () => {
	for (const c of chapters()) {
		for (const s of c.spots.filter((s) => s.act !== 'touch')) {
			const on = s.y === 0 || c.ledges.some((l) => l.y === s.y && s.x >= l.x && s.x <= l.x + l.w);
			assert.ok(on, `${s.name} floats at y=${s.y} with nothing under it`);
		}
	}
});

test('no press-E stop is so close to the signpost that E means two things', () => {
	for (const c of chapters()) {
		for (const s of c.spots.filter((s) => s.act !== 'touch')) {
			assert.ok(
				Math.abs(s.x - c.x - SIGN_MID) > SIGN_REACH + USE_R / 2,
				`${s.name} is within the signpost's reach`,
			);
		}
	}
});

test('a stop that needs another comes after it along the walk', () => {
	for (const c of chapters()) {
		for (const s of c.spots) {
			if (!s.needs) continue;
			const first = c.spots.find((x) => x.id === s.needs)!;
			assert.ok(first.x < s.x, `${s.name} comes before ${first.name}`);
		}
	}
});

test('every ledge can be climbed to, in order', () => {
	/* A ledge nothing can reach is a ledge that hides whatever stands on it. */
	for (const c of chapters()) {
		for (const l of c.ledges) {
			const below = [0, ...c.ledges.filter((o) => o.y < l.y && Math.abs(o.x - l.x) < 260).map((o) => o.y)];
			assert.ok(
				below.some((from) => canClimb(from, l.y)),
				`${l.id} at y=${l.y} cannot be climbed from anything near it`,
			);
		}
	}
});

test('the high ledges are a climb, not a hop from the floor', () => {
	for (const c of chapters()) {
		const highest = c.ledges.reduce((a, b) => (a.y > b.y ? a : b));
		assert.ok(!canClimb(0, highest.y), `${highest.id} is reachable straight from the ground`);
	}
});

test('a ledge never blocks the way through a chapter', () => {
	for (const c of chapters()) {
		for (const l of c.ledges) {
			const local = l.x - c.x;
			assert.ok(local >= 200, `${l.id} overlaps the signpost (${local})`);
			assert.ok(local + l.w <= c.w - 140, `${l.id} runs into the era post (${local + l.w})`);
		}
	}
});

test('the first thing in every chapter is picked up by walking', () => {
	/* So nobody is stuck at the start not knowing they can jump. */
	for (const c of chapters()) {
		const first = [...c.tokens, ...c.spots.filter((s) => s.act === 'touch')].sort((a, b) => a.x - b.x)[0];
		assert.ok(first.y <= PICKUP_R, `${c.exp.short} opens with something that needs a jump`);
	}
});

test('the jump is used, or the mechanic is decoration', () => {
	const raised = chapters().flatMap((c) => c.tokens).filter((t) => t.y > PICKUP_R);
	assert.ok(raised.length > 0, 'no token is ever off the ground');
});

test('bugs keep to their chapter and their surface, and can be jumped', () => {
	for (const c of chapters()) {
		for (const h of c.hazards) {
			assert.ok(h.from - HAZARD_W / 2 >= c.x && h.to + HAZARD_W / 2 <= c.x + c.w, `${h.id} walks out of its chapter`);
			if (h.y > 0) {
				const l = c.ledges.find((l) => l.y === h.y && h.from - HAZARD_W / 2 >= l.x && h.to + HAZARD_W / 2 <= l.x + l.w);
				assert.ok(l, `${h.id} walks off the ledge it patrols`);
			}
			assert.ok(h.speed <= SPEED / 2, `${h.id} is faster than half walking pace`);
		}
	}
	assert.ok(HAZARD_H < maxJump() / 2, 'a bug is too tall to jump over');
});

test('no bug patrols the spawn, the signpost, or a place you stand still at', () => {
	for (const c of chapters()) {
		const signEnd = c.x + SIGN_MID + SIGN_REACH + HAZARD_W / 2;
		for (const h of c.hazards) {
			assert.ok(h.from - HAZARD_W / 2 > signEnd, `${h.id} reaches the signpost's reading spot`);
			if (c.index === 0) assert.ok(h.from > SPAWN_X + 200, `${h.id} is at the spawn`);
			for (const s of c.spots.filter((s) => s.act !== 'touch' && s.y === h.y)) {
				const gap = Math.max(h.from - s.x, s.x - h.to);
				assert.ok(gap >= USE_R + HAZARD_W / 2, `${h.id} walks through ${s.name}, where you stop to press E`);
			}
		}
	}
});

test('a bug\'s patrol is a pure function of time and stays in range', () => {
	for (const h of chapters().flatMap((c) => c.hazards)) {
		for (let t = 0; t < 30; t += 0.37) {
			const x = hazardX(h, t);
			assert.ok(x >= h.from - 1e-6 && x <= h.to + 1e-6, `${h.id} left its patrol at t=${t}`);
			assert.equal(hazardX(h, t), x);
			assert.ok(hazardDir(h, t) === 1 || hazardDir(h, t) === -1);
		}
	}
});

test('the first chapter teaches every verb: a climb, a bug, and E', () => {
	const first = chapters()[0];
	assert.ok(first.tokens.some((t) => t.y > PICKUP_R), 'no raised token to jump for');
	assert.ok(first.hazards.length > 0, 'no bug to learn on');
	assert.ok(first.spots.some((s) => s.act === 'use'), 'nothing to press E at');
	assert.ok(first.teach.length > 0, 'no plates saying so');
});

test('chapter progress counts that chapter and no other', () => {
	const all = chapters();
	const ch1 = all[1];
	const have = new Set([...all[0].tokens.map((t) => t.id), ch1.tokens[0].id]);
	assert.deepEqual(chapterProgress(all[0], have), { done: all[0].tokens.length, total: all[0].tokens.length });
	assert.deepEqual(chapterProgress(ch1, have), { done: 1, total: ch1.tokens.length });
	assert.deepEqual(chapterProgress(all[2], have), { done: 0, total: all[2].tokens.length });
});

test('pips stay on the strip and keep the order they are walked in', () => {
	for (const c of chapters()) {
		const pcts = c.tokens.map((t) => pipPct(t, c));
		for (const [i, pct] of pcts.entries()) {
			assert.ok(pct >= 0 && pct <= 100, `${c.tokens[i].skill} maps to ${pct}%, off the strip`);
		}
		for (let i = 1; i < pcts.length; i++) {
			assert.ok(pcts[i] > pcts[i - 1], `${c.tokens[i].skill} is drawn before the token to its left`);
		}
	}
});

test('the marker agrees with the pips it is meant to line up against', () => {
	const c = chapters()[1];
	for (const t of c.tokens) {
		assert.equal(Math.round(heroPct(t.x, c)), Math.round(pipPct(t, c)), `marker and pip disagree at ${t.skill}`);
	}
	assert.equal(heroPct(c.x, c), 0, 'chapter start is the left edge');
	assert.ok(heroPct(c.x - 500, c) === 0, 'clamped before the chapter');
	assert.ok(heroPct(c.x + 99999, c) === 100, 'clamped past the chapter');
});
