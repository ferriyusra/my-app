import assert from 'node:assert/strict';
import { test } from 'node:test';

import { caseStudy } from './case-study.ts';

/**
 * The figure is drawn from the prose, and this is what keeps it so.
 *
 * The write-up's own rule is that nothing unrecorded is claimed: no store is
 * named under ASO Database and nobody is named as the alert's recipient,
 * because `openQuestions` says those are not on record. A diagram is the
 * easiest place for that discipline to slip — a box that says "PostgreSQL"
 * reads as a fact — so every label and every detail has to be a phrase that
 * already appears in the summary, the stack, the sections or the open
 * questions. Add to the prose first; the figure follows.
 */
const corpus = [
	caseStudy.summary,
	...caseStudy.stack,
	...caseStudy.sections.flatMap((s) => [s.heading, ...s.body]),
	...caseStudy.openQuestions,
]
	.join(' ')
	.replace(/\*\*/g, '')
	.toLowerCase();

test('every box and every detail in the figure is a phrase from the write-up', () => {
	for (const row of caseStudy.figure.rows) {
		for (const node of row.nodes) {
			assert.ok(
				corpus.includes(node.label.toLowerCase()),
				`${row.name}: "${node.label}" is not a phrase in the write-up`,
			);
			for (const piece of (node.detail ?? '').split(' · ').filter(Boolean)) {
				assert.ok(
					corpus.includes(piece.toLowerCase()),
					`${row.name} › ${node.label}: detail "${piece}" is not a phrase in the write-up`,
				);
			}
		}
	}
});

test('the figure follows a section that exists, and every row is a path', () => {
	assert.ok(
		caseStudy.sections.some((s) => s.heading === caseStudy.figure.after),
		`figure.after is "${caseStudy.figure.after}", which is not a section heading`,
	);
	for (const row of caseStudy.figure.rows) {
		assert.ok(row.nodes.length >= 2, `${row.name} has fewer than two boxes, which is not a path`);
		const labels = row.nodes.map((n) => n.label);
		assert.equal(new Set(labels).size, labels.length, `${row.name} repeats a box`);
	}
});
