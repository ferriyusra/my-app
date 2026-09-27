import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	BUFFER_S,
	COYOTE_S,
	INVULN_S,
	newBody,
	newOut,
	step,
	type Body,
	type Input,
} from './engine.ts';
import { HAZARD_H, HAZARD_W, HERO_W, chapters, canClimb, maxJump, type Hazard, type Ledge } from './world.ts';

/**
 * The loop and these tests run the same `step()`, at the same 60Hz, so what
 * is asserted here is what a player gets — not what a formula promises.
 */

const DT = 1 / 60;
const W = 10_000;
const idle: Input = { dir: 0, run: false, jumpHeld: false };

function run(b: Body, frames: number, input: Input, ledges: Ledge[] = [], hazards: Hazard[] = [], fixed = new Set<string>(), t0 = 0) {
	const out = newOut();
	let clock = t0;
	const events: ReturnType<typeof newOut>[] = [];
	for (let i = 0; i < frames; i++) {
		clock += DT;
		step(b, input, DT, clock, ledges, hazards, fixed, W, out);
		events.push({ ...out });
	}
	return { clock, events };
}

/** The highest point of a jump from standing, with the key held or tapped. */
function peak(hold: boolean): number {
	const b = newBody(100);
	b.jumpAt = DT;
	let top = 0;
	const out = newOut();
	let clock = 0;
	for (let i = 0; i < 90; i++) {
		clock += DT;
		step(b, { dir: 0, run: false, jumpHeld: hold || i < 2 }, DT, clock, [], [], new Set(), W, out);
		top = Math.max(top, b.y);
	}
	return top;
}

test('a held jump reaches close to the analytic peak that reachable() assumes', () => {
	const real = peak(true);
	assert.ok(real <= maxJump() + 0.5, `peaked at ${real}, above ${maxJump()}`);
	assert.ok(real >= maxJump() - 8, `peaked at ${real.toFixed(1)}, far below ${maxJump().toFixed(1)}`);
});

test('every climb in the world clears with the jump the loop really makes', () => {
	/* Ties the layout to the real integrator, not just to the formula. */
	const real = peak(true);
	for (const c of chapters()) {
		for (const l of c.ledges) {
			const from = [0, ...c.ledges.filter((o) => o.y < l.y && Math.abs(o.x - l.x) < 260).map((o) => o.y)];
			assert.ok(
				from.some((f) => canClimb(f, l.y) && l.y - f < real),
				`${l.id} needs ${l.y}px of climb; the loop's jump peaks at ${real.toFixed(1)}`,
			);
		}
	}
});

test('a tapped jump is a hop, well short of a held one', () => {
	assert.ok(peak(false) < peak(true) / 2, `tap ${peak(false).toFixed(1)} vs hold ${peak(true).toFixed(1)}`);
});

test('coyote time: a jump just after walking off an edge still fires', () => {
	const ledge: Ledge = { id: 'l', chapter: 0, x: 0, w: 100, y: 80 };
	for (const [late, fires] of [
		[0.06, true],
		[0.2, false],
	] as const) {
		const b = newBody(60);
		b.y = 80;
		const out = newOut();
		let clock = 0;
		/* Walk right until the ledge is gone from under the feet. */
		while (b.onGround || b.y === 80) {
			clock += DT;
			step(b, { dir: 1, run: false, jumpHeld: false }, DT, clock, [ledge], [], new Set(), W, out);
			if (!b.onGround) break;
		}
		const leftAt = clock;
		/* Wait, then press jump. */
		while (clock - leftAt < late - 1e-9) {
			clock += DT;
			step(b, idle, DT, clock, [ledge], [], new Set(), W, out);
		}
		clock += DT;
		b.jumpAt = clock;
		step(b, { dir: 0, run: false, jumpHeld: true }, DT, clock, [ledge], [], new Set(), W, out);
		assert.equal(out.jumped, fires, `jump ${late * 1000}ms after the edge: expected ${fires ? 'a jump' : 'none'} (coyote ${COYOTE_S}s)`);
	}
});

test('the jump buffer: pressed just before landing, it fires on landing', () => {
	for (const [early, fires] of [
		[0.08, true],
		[0.3, false],
	] as const) {
		const b = newBody(100);
		b.y = 120;
		b.onGround = false;
		b.groundAt = -10;
		let clock = 0;
		const out = newOut();
		let jumped = false;
		/* Fall; press jump `early` seconds before touching down. */
		const landAt = Math.sqrt((2 * 120) / 1900);
		for (let i = 0; i < 60; i++) {
			clock += DT;
			if (Math.abs(clock - (landAt - early)) < DT / 2) b.jumpAt = clock;
			step(b, { dir: 0, run: false, jumpHeld: true }, DT, clock, [], [], new Set(), W, out);
			if (out.jumped) jumped = true;
		}
		assert.equal(jumped, fires, `pressed ${early * 1000}ms early (buffer ${BUFFER_S}s)`);
	}
});

test('holding the key does not jump again on landing', () => {
	const b = newBody(100);
	b.jumpAt = DT;
	const { events } = run(b, 120, { dir: 0, run: false, jumpHeld: true });
	assert.equal(events.filter((e) => e.jumped).length, 1);
});

test('ledges catch a descent, not a rise', () => {
	const ledge: Ledge = { id: 'l', chapter: 0, x: 80, w: 100, y: 60 };
	const b = newBody(100);
	b.jumpAt = DT;
	const { events } = run(b, 90, { dir: 0, run: false, jumpHeld: true }, [ledge]);
	assert.equal(b.y, 60, 'should have landed on the ledge');
	assert.ok(events.some((e) => e.landed));
});

const bug = (x: number): Hazard => ({ id: 'bug', chapter: 0, name: '500', y: 0, from: x, to: x, speed: 0, phase: 0 });

test('landing on a bug fixes it and bounces', () => {
	const b = newBody(200 - HERO_W / 2);
	b.y = 60;
	b.onGround = false;
	b.groundAt = -10;
	const { events } = run(b, 30, idle, [], [bug(200)]);
	const hit = events.findIndex((e) => e.stomped === 'bug');
	assert.ok(hit >= 0, 'never landed on it');
	assert.ok(!events.some((e) => e.hurt), 'a stomp must not also hurt');
	assert.ok(events.slice(hit + 1, hit + 4).every((e) => !e.landed), 'should bounce, not land');
});

test('walking into a bug knocks back once, then not again while shaken', () => {
	const b = newBody(100);
	const hz = [bug(100 + HERO_W + HAZARD_W / 2 + 4)];
	const xs: number[] = [];
	const out = newOut();
	let clock = 0;
	let hits = 0;
	for (let i = 0; i < 40; i++) {
		clock += DT;
		step(b, { dir: 1, run: false, jumpHeld: false }, DT, clock, [], hz, new Set(), W, out);
		if (out.hurt) hits++;
		xs.push(b.x);
	}
	assert.equal(hits, 1, `hurt ${hits} times in ${clock.toFixed(2)}s (invulnerable for ${INVULN_S}s)`);
	const at = xs.findIndex((_, i) => i > 0 && xs[i] < xs[i - 1]);
	assert.ok(at > 0, 'should have been pushed back, away from the bug');
	assert.ok(b.y >= 0);
});

test('a fixed bug is harmless', () => {
	const b = newBody(100);
	const { events } = run(b, 40, { dir: 1, run: false, jumpHeld: false }, [], [bug(150)], new Set(['bug']));
	assert.ok(!events.some((e) => e.hurt || e.stomped));
});

test('a knock never pushes the character out of the world', () => {
	const b = newBody(0);
	run(b, 40, { dir: -1, run: false, jumpHeld: false }, [], [bug(HERO_W + HAZARD_W / 2 - 4)]);
	assert.ok(b.x >= 0);
	assert.ok(HAZARD_H > 0);
});
