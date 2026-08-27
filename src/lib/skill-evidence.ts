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

/** "1 yr 8 mos" from a raw month count, matching tenureLabel's phrasing. */
export function monthsLabel(total: number): string {
	const years = Math.floor(total / 12);
	const months = total % 12;
	const parts: string[] = [];
	if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
	if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
	return parts.join(' ') || '—';
}
