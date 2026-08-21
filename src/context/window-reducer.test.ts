/**
 * Run with `npm test` (Node strips the types; there is no test dependency).
 *
 * These cover the parts of the state machine that are quietly easy to break:
 * the identity guard that keeps focus from re-rendering the stack, and what
 * "restore" means once a window has been snapped more than once.
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { AppId, Bounds } from '@/types/windows';
import { MIN_H, MIN_W, reducer, zoneRect, type State } from './window-reducer.ts';

const BOUNDS: Bounds = { w: 1440, h: 852 };
const EMPTY: State = { windows: [], nextZ: 1 };

const open = (s: State, id: AppId, w = 800, h = 560): State =>
	reducer(s, { type: 'open', id, w, h, bounds: BOUNDS });

const find = (s: State, id: AppId) => {
	const win = s.windows.find((x) => x.id === id);
	assert.ok(win, `expected ${id} to be open`);
	return win;
};

test('open adds a window and hands it the top z-index', () => {
	const s = open(EMPTY, 'about');
	assert.equal(s.windows.length, 1);
	assert.equal(find(s, 'about').z, 1);
	assert.equal(s.nextZ, 2);
});

test('re-opening a running app raises and un-minimises it rather than duplicating', () => {
	let s = open(open(EMPTY, 'about'), 'skills');
	s = reducer(s, { type: 'minimise', id: 'about' });
	assert.equal(find(s, 'about').minimised, true);

	s = open(s, 'about');
	assert.equal(s.windows.length, 2, 'must not open a second copy');
	assert.equal(find(s, 'about').minimised, false);
	assert.ok(find(s, 'about').z > find(s, 'skills').z, 'should come to the front');
});

test('a window never spawns larger than the desktop it opens into', () => {
	const tiny: Bounds = { w: 600, h: 400 };
	const s = reducer(EMPTY, { type: 'open', id: 'about', w: 1200, h: 900, bounds: tiny });
	const win = find(s, 'about');
	assert.ok(win.w <= tiny.w, `width ${win.w} exceeds desktop ${tiny.w}`);
	assert.ok(win.h <= tiny.h, `height ${win.h} exceeds desktop ${tiny.h}`);
});

test('successive windows cascade instead of stacking exactly', () => {
	const s = open(open(EMPTY, 'about'), 'skills');
	const a = find(s, 'about');
	const b = find(s, 'skills');
	assert.notEqual(`${a.x},${a.y}`, `${b.x},${b.y}`);
});

test('the cascade wraps on the seventh window instead of piling up in a corner', () => {
	/* Clamping alone would leave windows 7, 8, 9… stacked on the same clamped
	   pixel. The wrap sends the seventh back to where the first one started. */
	const ids: AppId[] = ['about', 'skills', 'experience', 'explorer', 'contact', 'media', 'settings'];
	let s = EMPTY;
	for (const id of ids) s = open(s, id);

	const first = find(s, 'about');
	const seventh = find(s, 'settings');
	assert.deepEqual(
		{ x: seventh.x, y: seventh.y },
		{ x: first.x, y: first.y },
		'the seventh window should restart the cascade',
	);

	for (const w of s.windows) {
		assert.ok(w.x >= 0 && w.x + w.w <= BOUNDS.w + 1, `${w.id} sits outside horizontally`);
		assert.ok(w.y >= 0 && w.y + w.h <= BOUNDS.h + 1, `${w.id} sits outside vertically`);
	}
});

test('focusing the window that is already on top returns the identical state', () => {
	/* The whole point of the guard: a pointer-down on a focused window must not
	   publish a new context value, or every open window re-renders. */
	let s = open(open(EMPTY, 'about'), 'skills');
	const before = s;
	s = reducer(s, { type: 'focus', id: 'skills' });
	assert.equal(s, before, 'expected the same object, not a copy');
});

test('focusing a minimised window restores it even when it holds the top z', () => {
	let s = open(EMPTY, 'about');
	s = reducer(s, { type: 'minimise', id: 'about' });
	const before = s;
	s = reducer(s, { type: 'focus', id: 'about' });
	assert.notEqual(s, before, 'the guard must not swallow this');
	assert.equal(find(s, 'about').minimised, false);
});

test('focus raises a buried window above the rest', () => {
	let s = open(open(open(EMPTY, 'about'), 'skills'), 'explorer');
	s = reducer(s, { type: 'focus', id: 'about' });
	const top = s.windows.reduce((a, b) => (a.z > b.z ? a : b));
	assert.equal(top.id, 'about');
});

test('maximise remembers the floating rect and restores it exactly', () => {
	let s = open(EMPTY, 'about');
	const before = { ...find(s, 'about') };

	s = reducer(s, { type: 'toggleMax', id: 'about', bounds: BOUNDS });
	const max = find(s, 'about');
	assert.equal(max.maximised, true);
	assert.deepEqual({ x: max.x, y: max.y, w: max.w, h: max.h }, zoneRect('max', BOUNDS));

	s = reducer(s, { type: 'toggleMax', id: 'about', bounds: BOUNDS });
	const back = find(s, 'about');
	assert.equal(back.maximised, false);
	assert.equal(back.snapped, null);
	assert.deepEqual(
		{ x: back.x, y: back.y, w: back.w, h: back.h },
		{ x: before.x, y: before.y, w: before.w, h: before.h },
	);
});

test('restore survives a chain of snaps and returns to the original geometry', () => {
	/* Snapping left, then right, then maximising and unmaximising must land
	   back where the window floated — not at the previous snap. */
	let s = open(EMPTY, 'about');
	const origin = { ...find(s, 'about') };

	s = reducer(s, { type: 'snap', id: 'about', zone: 'left', bounds: BOUNDS });
	s = reducer(s, { type: 'snap', id: 'about', zone: 'right', bounds: BOUNDS });
	s = reducer(s, { type: 'snap', id: 'about', zone: 'max', bounds: BOUNDS });
	s = reducer(s, { type: 'toggleMax', id: 'about', bounds: BOUNDS });

	const back = find(s, 'about');
	assert.deepEqual(
		{ x: back.x, y: back.y, w: back.w, h: back.h },
		{ x: origin.x, y: origin.y, w: origin.w, h: origin.h },
	);
});

test('tearing a snapped window off re-anchors it under the cursor at its floating size', () => {
	let s = open(EMPTY, 'about');
	const origin = { ...find(s, 'about') };
	s = reducer(s, { type: 'snap', id: 'about', zone: 'left', bounds: BOUNDS });
	s = reducer(s, { type: 'tearOff', id: 'about', x: 500, y: 120 });

	const torn = find(s, 'about');
	assert.equal(torn.snapped, null);
	assert.equal(torn.maximised, false);
	assert.equal(torn.x, 500);
	assert.equal(torn.y, 120);
	assert.equal(torn.w, origin.w, 'should regain its floating width');
	assert.equal(torn.h, origin.h, 'should regain its floating height');
	assert.equal(torn.restore, undefined, 'nothing left to restore to');
});

test('tearing off a window that was never snapped does nothing at all', () => {
	const s = open(EMPTY, 'about');
	const after = reducer(s, { type: 'tearOff', id: 'about', x: 999, y: 999 });
	assert.equal(after.windows[0], s.windows[0], 'expected the same window object');
});

test('close removes only its own window; closeAll clears the desktop', () => {
	let s = open(open(EMPTY, 'about'), 'skills');
	s = reducer(s, { type: 'close', id: 'about' });
	assert.deepEqual(s.windows.map((w) => w.id), ['skills']);

	s = reducer(s, { type: 'closeAll' });
	assert.deepEqual(s.windows, []);
});

test('minimiseAll leaves every window mounted but hidden', () => {
	let s = open(open(EMPTY, 'about'), 'skills');
	s = reducer(s, { type: 'minimiseAll' });
	assert.equal(s.windows.length, 2, 'Show Desktop must not close anything');
	assert.ok(s.windows.every((w) => w.minimised));
});

test('setRect moves a window without disturbing its neighbours', () => {
	let s = open(open(EMPTY, 'about'), 'skills');
	const untouched = find(s, 'skills');
	s = reducer(s, { type: 'setRect', id: 'about', rect: { x: 10, y: 20, w: 640, h: 480 } });
	assert.deepEqual(
		(({ x, y, w, h }) => ({ x, y, w, h }))(find(s, 'about')),
		{ x: 10, y: 20, w: 640, h: 480 },
	);
	assert.equal(find(s, 'skills'), untouched, 'the other window must keep its identity');
});

test('the half and quarter zones tile the desktop without gap or overlap', () => {
	const left = zoneRect('left', BOUNDS);
	const right = zoneRect('right', BOUNDS);
	assert.equal(left.w + right.w, BOUNDS.w, 'halves must cover the full width');
	assert.equal(left.x + left.w, right.x, 'and must not leave a seam');

	const quads = (['tl', 'tr', 'bl', 'br'] as const).map((z) => zoneRect(z, BOUNDS));
	const area = quads.reduce((sum, q) => sum + q.w * q.h, 0);
	assert.equal(area, BOUNDS.w * BOUNDS.h, 'four quarters must equal one desktop');
});

test('every zone stays inside the desktop and above the minimum size', () => {
	const zones = ['left', 'right', 'max', 'tl', 'tr', 'bl', 'br'] as const;
	for (const z of zones) {
		const r = zoneRect(z, BOUNDS);
		assert.ok(r.x >= 0 && r.y >= 0, `${z} starts outside`);
		assert.ok(r.x + r.w <= BOUNDS.w, `${z} overflows the width`);
		assert.ok(r.y + r.h <= BOUNDS.h, `${z} overflows the height`);
		assert.ok(r.w >= MIN_W && r.h >= MIN_H, `${z} is smaller than a window may be`);
	}
});
