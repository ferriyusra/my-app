import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caseStudy } from '../data/case-study.ts';
import { experiences } from '../data/experience.ts';
import { profile } from '../data/profile.ts';
import { highlightRole, roleSlug, runFigure, runSteps } from './story.ts';

test('every box in the figure is lit by exactly one step of the run', () => {
	const figure = runFigure();
	const all = [...figure.path, ...figure.sets.flatMap((s) => s.nodes)].map((n) => n.id);
	const lit = runSteps(figure).flatMap((s) => s.lights);
	assert.deepEqual([...lit].sort(), [...all].sort());
	assert.equal(new Set(lit).size, lit.length, 'a box is lit twice');
});

test('the run turns aside for each set right after the box it branches from', () => {
	const figure = runFigure();
	const steps = runSteps(figure);
	for (const set of figure.sets) {
		const at = steps.findIndex((s) => s.title === set.after);
		const setAt = steps.findIndex((s) => s.title === set.name);
		assert.ok(at >= 0 && setAt > at, `${set.name} should follow ${set.after}`);
		/* Only other sets from the same box may sit between them. */
		for (const between of steps.slice(at + 1, setAt)) {
			assert.ok(
				figure.sets.some((x) => x.name === between.title && x.after === set.after),
				`${between.title} sits between ${set.after} and its set`,
			);
		}
	}
});

test('the path keeps its own order through the run', () => {
	const figure = runFigure();
	const order = runSteps(figure)
		.map((s) => figure.path.findIndex((n) => n.label === s.title))
		.filter((i) => i >= 0);
	assert.deepEqual(order, figure.path.map((_, i) => i));
});

test('a step says nothing the figure does not', () => {
	const words = new Set<string>();
	for (const row of caseStudy.figure.rows) {
		words.add(row.name);
		for (const n of row.nodes) {
			words.add(n.label);
			if (n.detail) words.add(n.detail);
		}
	}
	for (const step of runSteps()) {
		assert.ok(words.has(step.title), `"${step.title}" is not in the figure`);
		if (step.detail === null) continue;
		const pieces = words.has(step.detail) ? [step.detail] : step.detail.split(' · ');
		for (const piece of pieces) assert.ok(words.has(piece), `"${piece}" is not in the figure`);
	}
});

test('box ids are unique and safe for a data attribute', () => {
	const figure = runFigure();
	const ids = [...figure.path, ...figure.sets.flatMap((s) => s.nodes)].map((n) => n.id);
	assert.equal(new Set(ids).size, ids.length);
	for (const id of ids) assert.match(id, /^[a-z][a-z0-9-]*$/);
});

test('a set that branches from nowhere is refused, not drawn floating', () => {
	assert.throws(() =>
		runFigure({
			caption: '',
			rows: [
				{ name: 'p', kind: 'path', nodes: [{ label: 'a' }, { label: 'b' }] },
				{ name: 's', kind: 'set', nodes: [{ label: 'x' }, { label: 'y' }], after: 'c' },
			],
		}),
	);
});

test('every headline outcome belongs to one role, and happened while it lasted', () => {
	for (const h of profile.highlights) {
		const role = highlightRole(h);
		assert.ok(role, `"${h.lead}" (${h.at}) matches no role`);
		const start = Number(role.startISO.slice(0, 4));
		const end = role.endISO ? Number(role.endISO.slice(0, 4)) : new Date().getFullYear();
		const year = Number(h.year);
		assert.ok(year >= start && year <= end, `"${h.lead}" is dated ${h.year}, outside ${role.short}'s ${role.period}`);
	}
});

test('role anchors are unique and look like the rest of the story\'s ids', () => {
	const slugs = experiences.map(roleSlug);
	assert.equal(new Set(slugs).size, slugs.length);
	for (const s of slugs) assert.match(s, /^role-[a-z0-9]+(-[a-z0-9]+)*$/);
	assert.equal(roleSlug({ short: 'INA Digital' }), 'role-ina-digital');
});
