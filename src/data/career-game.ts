/**
 * Career.exe — the same work history, read as a progression.
 *
 * This is a presentation layer over `experience.ts`, deliberately kept out of
 * it: the CV data stays the plain truth, and the game framing lives here where
 * it can be changed or deleted without touching what the Experience window
 * and the server document render.
 *
 * The one mechanic that matters is honest. "Skills unlocked" is not a written
 * list — it is computed by walking the roles oldest-first and taking the tech
 * that had not appeared in any earlier role. So the shape it draws is real:
 * eight new tools in the second role, two in the fourth, a fresh cloud and
 * gateway layer in the fifth.
 */

import { experiences, tenureMonths, type Experience } from './experience.ts';

/**
 * One line per role, in the register of a quest log. Each is a restatement of
 * something already in that role's `achievements` — nothing new is claimed.
 */
const QUESTS: Record<string, string> = {
	Jojonomic: 'Shipped a first production API in PHP and MySQL',
	Moladin: 'Carried seven product lines and a weekly pager',
	'GovTech Health': "Replaced Tableau's data layer with in-house services",
	'INA Digital': 'Kept a national health platform fed with data',
	Meditap: 'Retired the finance spreadsheet for ~160 entities',
};

export type Level = {
	level: number;
	exp: Experience;
	months: number;
	quest: string;
	/** Tech appearing here for the first time in the career. */
	unlocked: string[];
	/** Everything already known coming into this role. */
	carried: number;
};

/** The career as levels, oldest first — LV.1 is where it started. */
export function levels(): Level[] {
	const chrono = [...experiences].reverse();
	const seen = new Set<string>();

	return chrono.map((exp, i) => {
		const unlocked = exp.tech.filter((t) => !seen.has(t));
		const carried = seen.size;
		unlocked.forEach((t) => seen.add(t));
		return {
			level: i + 1,
			exp,
			months: tenureMonths(exp),
			quest: QUESTS[exp.short] ?? exp.description,
			unlocked,
			carried,
		};
	});
}

/** Totals for the header: months served and distinct tools reached for. */
export function career(): { months: number; skills: number; roles: number } {
	const all = levels();
	return {
		months: all.reduce((sum, l) => sum + l.months, 0),
		skills: all.reduce((sum, l) => sum + l.unlocked.length, 0),
		roles: all.length,
	};
}
