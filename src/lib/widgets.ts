/**
 * The figures the Widgets board states, computed from the record.
 *
 * Kept out of the component so they can be tested without a DOM, and so the
 * board cannot hold a number that Experience, Career.exe and About do not.
 */

import { career } from '../data/career-game.ts';
import { experiences, type Experience } from '../data/experience.ts';
import { careerSince } from '../data/profile.ts';

export type CareerSummary = {
	roles: number;
	/** "Oct 2021" — the start date, the one career figure that never goes stale. */
	since: string;
	/** Months actually in role, summed per role; the gaps between jobs are not counted. */
	months: number;
	current: Experience;
};

export function careerSummary(): CareerSummary {
	const { months, roles } = career();
	return {
		roles,
		since: careerSince(),
		months,
		current: experiences.find((e) => e.current) ?? experiences[0],
	};
}

/**
 * The first sentence of a paragraph, for a card that has room for one.
 *
 * Cut from the record rather than rewritten, so the widget says nothing the
 * write-up does not — a test holds it to being a prefix of the source.
 */
export function firstSentence(text: string): string {
	const m = text.match(/^.+?[.!?](?=\s|$)/);
	return (m ? m[0] : text).trim();
}
