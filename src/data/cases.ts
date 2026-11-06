import { caseStudy } from './case-study.ts';
import { experiences } from './experience.ts';
import { projects } from './projects.ts';
import { satusehat } from './satusehat.ts';
import { rangeLabel } from '../lib/dates.ts';

export type CaseEntry = {
	href: string;
	/** What the nav's menu calls it: short, so a row reads at a glance. */
	name: string;
	title: string;
	/** The roles it belongs to, by `short` in experience.ts, oldest first. */
	at: readonly string[];
	/** "Meditap", or "GovTech Health, then INA Digital". */
	where: string;
	/** "Jul 2025 to now", from the roles' ISO months. */
	when: string;
};

/** Where and when, derived from the roles so a menu row cannot drift from the Work rows. */
function span(at: readonly string[]): { where: string; when: string } {
	const roles = at.map((s) => experiences.find((e) => e.short === s)).filter((e) => e !== undefined);
	const first = roles[0];
	const last = roles[roles.length - 1];
	return {
		where: roles.map((r) => r.short).join(', then '),
		when: first && last ? rangeLabel(first.startISO, last.endISO) : '',
	};
}

/**
 * Every case study on the site, with the roles it belongs to. The Work rows
 * and the nav's case-study menu both read from here, so a role finds its case
 * by its `short` name rather than by a second copy of the path;
 * `data.test.ts` fails when an `at` stops naming a role.
 */
export const cases: CaseEntry[] = [
	{
		href: `/${caseStudy.slug}`,
		name: projects.find((p) => p.id === caseStudy.project)?.name ?? caseStudy.title,
		title: caseStudy.title,
		at: [caseStudy.at],
		...span([caseStudy.at]),
	},
	{
		href: `/${satusehat.slug}`,
		name: satusehat.name,
		title: satusehat.title,
		at: satusehat.at,
		...span(satusehat.at),
	},
];

/** The case study a role belongs to, if it has one. */
export function caseFor(short: string) {
	return cases.find((c) => c.at.includes(short));
}
