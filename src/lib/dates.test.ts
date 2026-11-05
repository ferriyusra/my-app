import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countWord, monthShort, monthsInclusive, rangeLabel } from './dates.ts';


test('a month range counts both of its ends', () => {
	assert.equal(monthsInclusive('2025-07', '2025-07'), 1);
	assert.equal(monthsInclusive('2024-01', '2025-03'), 15);
});

test('months and counts read the way the page prints them', () => {
	assert.equal(monthShort('2025-07'), 'Jul 2025');
	assert.equal(monthShort('2021-09'), 'Sep 2021');
	assert.equal(countWord(5), 'Five');
	assert.equal(countWord(20), '20');
});

test('a role reads as one range, and a role inside one year names its months', () => {
	assert.equal(rangeLabel('2025-07', null), 'Jul 2025 to now');
	assert.equal(rangeLabel('2024-01', '2025-03'), 'Jan 2024 to Mar 2025');
	assert.equal(rangeLabel('2023-07', '2023-12'), 'Jul to Dec 2023');
});
