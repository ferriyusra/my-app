import assert from 'node:assert/strict';
import { test } from 'node:test';

import { projects } from './projects.ts';
import { skills } from './skills.ts';
import { experiences } from './experience.ts';
import { caseStudy } from './case-study.ts';
import { evidenceFor } from '../lib/skill-evidence.ts';

/**
 * The point of these: `evidenceFor()` joins a skill to a project with
 * `includes()` on the raw name, and so do `search.ts`, `terminal.ts` and
 * `career-game.ts`. A near miss does not throw — it silently drops the
 * project from that skill's evidence.
 *
 * `projects.ts` said "Golang", "Nest.js", "React.Js" and "Next.js 15" while
 * `skills.ts` said "Go", "NestJS", "React" and "Next.js", so 22 of 28 skills
 * showed no project at all. Go and NestJS — the two tools the profile leads
 * with — claimed none while shipping in two apiece, and nothing failed.
 */

/**
 * Tools a project genuinely uses that are not in `skills.ts`. Keeping the
 * list here rather than loosening the check is the point: adding a name to
 * it is a decision, and a typo is not on it.
 */
const NOT_A_LISTED_SKILL = new Set([
	'shadcn/ui',
	'Supabase',
	'Zustand',
	'React Query',
	'Zod',
	'Midtrans',
	'Recharts',
	'Gin Framework',
	'PHP',
	'Laravel 7',
	'Codeigniter 3',
	'Leaflet',
	'Python',
	'Implement Algorithm TF-IDF',
	'Implement Algorithm Naive Bayes Classifier',
	/* The deposit-alerting stack, from the write-up in public/projects/meditap/. */
	'MS SQL Server',
	'GORM',
	'Protobuf',
]);

test('every tool a project names is either a listed skill or a known exception', () => {
	const listed = new Set(skills.map((s) => s.name));
	for (const project of projects) {
		for (const tool of project.tech) {
			assert.ok(
				listed.has(tool) || NOT_A_LISTED_SKILL.has(tool),
				`${project.name} names "${tool}", which is neither a skill in skills.ts ` +
					`nor on the allowlist in this file. If it is the same tool under ` +
					`another spelling, match skills.ts; if it is genuinely something ` +
					`else, add it to NOT_A_LISTED_SKILL.`,
			);
		}
	}
});

test('the tools the profile leads with can point at the work that used them', () => {
	/* Named explicitly because these two are the regression a reader would
	   check first: the headline is "Go, Node.js & PostgreSQL". */
	for (const name of ['Go', 'NestJS', 'Node.js', 'PostgreSQL']) {
		const built = evidenceFor(name).projects;
		assert.ok(
			built.length > 0,
			`${name} claims no projects — the skills.ts name and the projects.ts ` +
				`spelling have drifted apart again`,
		);
	}
});

test('a skill nobody used says so rather than being padded', () => {
	/* The other half of the contract: the join must not start matching things
	   it should not. Nine tools are named by no role and no project, and the
	   UI is written to say that plainly. */
	const evidence = evidenceFor('Cursor');
	assert.equal(evidence.roles.length, 0);
	assert.equal(evidence.months, 0);
	assert.equal(evidence.since, null);
});

test('every skill and project name is distinct', () => {
	/* Two entries with one name would make the join ambiguous, and whichever
	   lost would be invisible with nothing reporting it. */
	const names = skills.map((s) => s.name);
	assert.equal(new Set(names).size, names.length, 'skills.ts has a duplicate name');
	const ids = projects.map((p) => p.id);
	assert.equal(new Set(ids).size, ids.length, 'projects.ts has a duplicate id');
});

/**
 * The document renders the case study *inside* the role that produced it, and
 * finds that role by `experiences[].short === caseStudy.at`. Nothing throws
 * when the join misses: the spine simply renders five roles and the deepest
 * technical writing on the site disappears from the response body — which is
 * the surface a phone, an ATS and a crawler get.
 *
 * The same failure as the `projects` ↔ `skills` join above, in a place where
 * exactly one match is expected rather than many.
 */
test('the case study names a role that exists, exactly once', () => {
	const hosts = experiences.filter((e) => e.short === caseStudy.at);
	assert.equal(
		hosts.length,
		1,
		`caseStudy.at is "${caseStudy.at}", which matches ${hosts.length} roles by \`short\`. ` +
			`Known: ${experiences.map((e) => e.short).join(', ')}.`,
	);
});

/**
 * The case study's own claim is that everything in it traces to that role, so
 * the period it prints has to be the role's period rather than a second copy
 * that can drift.
 */
test('the case study period matches the role it belongs to', () => {
	const host = experiences.find((e) => e.short === caseStudy.at);
	assert.ok(host, 'no host role — see the test above');
	assert.equal(caseStudy.period, host.period);
});

/**
 * A stat tile promises a metric. The tiles used to carry "National", "Kafka",
 * "On-call" and "PHP" where a number was expected, which reads as a metric
 * that could not be found. Those are `highlights` now, and a tile without a
 * digit in it fails here rather than shipping.
 */
test('every stat tile carries a number; the words are highlights', () => {
	for (const e of experiences) {
		for (const s of e.stats) {
			assert.match(s.value, /\d/, `${e.short}: tile "${s.value} ${s.label}" has no number in it`);
		}
		assert.ok(
			e.stats.length + e.highlights.length > 0,
			`${e.short} has nothing to lead its card with`,
		);
		assert.ok(
			e.stats.length <= 3 && e.highlights.length <= 3,
			`${e.short} leads with more than a card can carry`,
		);
	}
});
