import assert from 'node:assert/strict';
import { test } from 'node:test';

import { projects } from './projects.ts';
import { skills } from './skills.ts';
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
