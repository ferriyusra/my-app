/**
 * Where a tool was actually used.
 *
 * The Skills window listed 28 names and left it there — the reader had to take
 * "I know Go" on faith. This computes the answer instead, by walking the roles
 * and projects that name the tool. Nothing is written down twice, so it cannot
 * disagree with `experience.ts`, and a tool nobody used says so plainly rather
 * than being quietly padded.
 *
 * The Terminal's `skill <name>` command answers from the same function.
 */

import { experiences, tenureMonths, type Experience } from '../data/experience.ts';
import { projects, type Project } from '../data/projects.ts';

export type Evidence = {
	roles: Experience[];
	projects: Project[];
	/** Total months across the roles that named it. */
	months: number;
	/** Earliest year it appears in the record, or null if it does not. */
	since: string | null;
};

export function evidenceFor(name: string): Evidence {
	const roles = experiences.filter((e) => e.tech.includes(name));
	const built = projects.filter((p) => p.tech.includes(name));
	const months = roles.reduce((n, e) => n + tenureMonths(e), 0);
	const since = roles.length
		? roles.reduce((a, b) => (a.startISO < b.startISO ? a : b)).startISO.slice(0, 4)
		: null;
	return { roles, projects: built, months, since };
}

/**
 * The order tools are listed in: most months on record first, and the typed
 * `years` only to break ties among tools no role names.
 *
 * It sorted on `years` alone, which is typed by hand, and so put Node.js
 * (typed 4) above Go (typed 3) — on a site whose name plate is Go first, and
 * directly above an evidence panel reporting 52 months of Go across five roles
 * and 33 of Node.js across three. A ranking the page contradicts costs more
 * trust than it earns.
 */
export function bySkillEvidence(
	a: { name: string; years: number },
	b: { name: string; years: number },
): number {
	return evidenceFor(b.name).months - evidenceFor(a.name).months || b.years - a.years;
}

/** "1 yr 8 mos" from a raw month count, matching tenureLabel's phrasing. */
export function monthsLabel(total: number): string {
	const years = Math.floor(total / 12);
	const months = total % 12;
	const parts: string[] = [];
	if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
	if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
	return parts.join(' ') || '—';
}
