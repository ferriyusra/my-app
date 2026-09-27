import assert from 'node:assert/strict';
import { test } from 'node:test';

import { experiences } from './experience.ts';
import { levels } from './career-game.ts';
import { caseStudy, plain } from './case-study.ts';
import { INA_PANEL, decisionRows, goals } from './career-objectives.ts';

/**
 * The objectives are a game skin over the CV, so the one thing they must not
 * do is say something the CV does not. These hold every name to the record and
 * every count to the role's own stat tile.
 */

const role = (short: string) => experiences.find((e) => e.short === short)!;

test('one objective per role, in the order the chapters are walked', () => {
	assert.deepEqual(
		goals().map((g) => g.role),
		levels().map((l) => l.exp.short),
	);
});

test('every name a player touches is taken from that role\'s record, verbatim', () => {
	for (const g of goals()) {
		for (const s of g.stops) {
			if (s.act === 'decide') continue;
			assert.ok(
				role(g.role).achievements.some((a) => a.includes(s.name)),
				`${g.role}: "${s.name}" is not in any of its achievements`,
			);
			assert.ok(g.source.includes(s.name), `${g.role}: "${s.name}" is not in its source line`);
		}
	}
});

test('a counted objective has exactly as many stops as the role\'s stat tile says', () => {
	for (const g of goals()) {
		const stat = role(g.role).stats.find((s) => g.title === `${s.value} ${s.label}`);
		if (!stat) continue;
		assert.equal(
			g.stops.length,
			Number(stat.value),
			`${g.role} asks for ${g.stops.length}, its tile says ${stat.value} ${stat.label}`,
		);
	}
	/* And the three that are counted really are. */
	const counted = goals().filter((g) => /^\d+ /.test(g.title)).map((g) => g.role);
	assert.deepEqual(counted, ['Moladin', 'GovTech Health', 'INA Digital']);
});

test('INA Digital\'s stores light the dashboards that bullet names, not others', () => {
	const ina = goals().find((g) => g.role === 'INA Digital')!;
	assert.ok(ina.source.includes(INA_PANEL));
});

test('the decide() stop is the case study\'s own function, and its title a heading', () => {
	const meditap = goals().find((g) => g.role === caseStudy.at)!;
	const code = caseStudy.sections
		.flatMap((s) => s.body)
		.find((b) => typeof b !== 'string' && b.kind === 'code' && b.lang === 'go');
	assert.ok(code && typeof code !== 'string' && code.kind === 'code');
	assert.ok(code.text.includes('func decide('));
	assert.ok(
		caseStudy.sections.some((s) => s.heading.includes(meditap.title)),
		`"${meditap.title}" is not part of a case-study heading`,
	);
});

test('ids are unique, and a stop that needs another names one that exists earlier', () => {
	const all = goals().flatMap((g) => g.stops);
	assert.equal(new Set(all.map((s) => s.id)).size, all.length);
	for (const g of goals()) {
		g.stops.forEach((s, i) => {
			if (!s.needs) return;
			const at = g.stops.findIndex((x) => x.id === s.needs);
			assert.ok(at >= 0 && at < i, `${s.id} needs ${s.needs}, which is not an earlier stop`);
		});
	}
});

test('the decisions are the case study\'s behaviour table, row for row', () => {
	const table = caseStudy.sections
		.flatMap((s) => s.body)
		.find((b) => typeof b !== 'string' && b.kind === 'table');
	assert.ok(table && typeof table !== 'string' && table.kind === 'table');
	assert.deepEqual([...table.head], ['Last state', "Today's reading", 'Email?', 'Why']);
	const rows = decisionRows();
	assert.equal(rows.length, 9);
	rows.forEach((r, i) => {
		assert.deepEqual(
			[r.last, r.today, r.email, r.why],
			[table.rows[i][0], table.rows[i][1], plain(table.rows[i][2]), table.rows[i][3]],
		);
	});
	assert.ok(rows.some((r) => r.email === 'No') && rows.some((r) => r.email === 'Yes'));
});
