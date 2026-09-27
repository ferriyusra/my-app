import assert from 'node:assert/strict';
import { test } from 'node:test';

import { career } from '../data/career-game.ts';
import { caseStudy } from '../data/case-study.ts';
import { experiences, tenureMonths } from '../data/experience.ts';
import { careerSummary, firstSentence } from './widgets.ts';

/**
 * The Widgets board is one more place that states the career, so it is held
 * to the same numbers as the places that already do: Career.exe's totals and
 * the months each role actually lasted.
 */

test('the career widget states the record, not a figure of its own', () => {
	const s = careerSummary();
	assert.equal(s.roles, experiences.length);
	assert.equal(s.months, career().months);
	assert.equal(
		s.months,
		experiences.reduce((n, e) => n + tenureMonths(e), 0),
		'months in role should be the sum of the roles, gaps excluded',
	);
	assert.ok(s.current.current, 'the current role is the one marked current');
});

test('the case study widget quotes the write-up, and only the start of it', () => {
	const line = firstSentence(caseStudy.summary);
	assert.ok(line.length > 0);
	assert.ok(caseStudy.summary.startsWith(line), 'the widget line must be a prefix of the summary');
	assert.match(line, /[.!?]$/);
});

test('firstSentence stops at the first full stop, not inside a number', () => {
	assert.equal(firstSentence('Costs fell 2.5x. Then more.'), 'Costs fell 2.5x.');
	assert.equal(firstSentence('No stop at all'), 'No stop at all');
});
