import { caseStudy } from './case-study.ts';
import { satusehat } from './satusehat.ts';

/**
 * Every case study on the site, with the roles it belongs to. The Work rows
 * link from here, so a role finds its case by its `short` name rather than by
 * a second copy of the path; `data.test.ts` fails when an `at` stops naming a
 * role.
 */
export const cases: { href: string; title: string; at: readonly string[] }[] = [
	{ href: `/${caseStudy.slug}`, title: caseStudy.title, at: [caseStudy.at] },
	{ href: `/${satusehat.slug}`, title: satusehat.title, at: satusehat.at },
];

/** The case study a role belongs to, if it has one. */
export function caseFor(short: string) {
	return cases.find((c) => c.at.includes(short));
}
