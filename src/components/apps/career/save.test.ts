import assert from 'node:assert/strict';
import { test } from 'node:test';

import { complete, emptyRun, resetRun, sanitizeRun, toLive, toRun, type Known } from './save.ts';

const known: Known = {
	tokens: new Set(['a', 'b']),
	stops: new Set(['s1']),
	rows: new Set(['row-1', 'row-2']),
	bugs: new Set(['bug-0']),
};

test('garbage, the wrong version or the wrong shape read as a fresh run', () => {
	for (const raw of [null, 7, 'x', [], { v: 2, tokens: ['a'] }, { tokens: ['a'] }]) {
		assert.deepEqual(sanitizeRun(raw, known), emptyRun());
	}
});

test('ids the world no longer has, and duplicates, are dropped', () => {
	const run = sanitizeRun(
		{ v: 1, tokens: ['a', 'a', 'gone', 3], stops: ['s1', 'old'], solved: ['row-1', 'row-9'], firstTry: ['row-1'], tried: [], fixed: ['bug-0', 'bug-7'], played: 12.5, time: null, best: 40 },
		known,
	);
	assert.deepEqual(run.tokens, ['a']);
	assert.deepEqual(run.stops, ['s1']);
	assert.deepEqual(run.solved, ['row-1']);
	assert.deepEqual(run.fixed, ['bug-0']);
	assert.equal(run.played, 12.5);
	assert.equal(run.best, 40);
});

test('numbers must be finite and not negative', () => {
	const run = sanitizeRun({ v: 1, played: -3, time: Infinity, best: 'fast' }, known);
	assert.equal(run.played, 0);
	assert.equal(run.time, null);
	assert.equal(run.best, null);
});

test('a run is won by every skill and every stop — the bugs are optional', () => {
	const live = toLive(emptyRun());
	assert.equal(complete(live, known), false);
	live.tokens.add('a');
	live.tokens.add('b');
	assert.equal(complete(live, known), false, 'the objective is not done yet');
	live.stops.add('s1');
	assert.equal(complete(live, known), true);
});

test('Play again keeps the best time and nothing else', () => {
	const run = resetRun(33);
	assert.deepEqual(run, { ...emptyRun(), best: 33 });
});

test('live and stored forms round-trip', () => {
	const run = sanitizeRun({ v: 1, tokens: ['b'], stops: ['s1'], solved: ['row-2'], firstTry: [], tried: ['row-2'], fixed: [], played: 3, time: 3, best: 3 }, known);
	assert.deepEqual(toRun(toLive(run)), run);
});
