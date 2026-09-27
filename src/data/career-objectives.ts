/**
 * One objective per role in Career.exe, named from the record.
 *
 * The game used to ask one thing of every chapter — walk, jump, pick up the
 * skills — which the owner put plainly: it was only jumping. Each role now
 * asks for something that role actually did, and every name the player
 * touches is lifted from that role's own `achievements`, character for
 * character. `career-objectives.test.ts` holds each one to being a substring
 * of the record, and each count to matching the role's own stat tile — seven
 * product lines, five dashboards, four data stores — so the game cannot
 * quietly claim an eighth.
 *
 * Two honest limits shaped what the objectives are, and are worth keeping:
 *
 * - GovTech Health's five dashboards are the "key dashboard deliveries". The
 *   Tableau migration is a separate bullet that never says which dashboards
 *   it moved, so the switches say *delivered*, not "migrated off Tableau".
 * - INA Digital's four stores fed "dashboards for the Business Intelligence
 *   team". The two dashboards named elsewhere in that role are a different
 *   bullet, so they are not what the stores light up.
 *
 * Meditap's objective is the case study's own state machine: the nine rows
 * of its behaviour table, read from `caseStudy` rather than copied, so the
 * game and the write-up cannot drift — the same rule the editor window keeps
 * with the source it quotes.
 */

import { experiences, type Experience } from './experience.ts';
import { caseStudy, plain } from './case-study.ts';

/** How a stop is completed: walked into, pressed with E, or a decision game. */
export type StopAct = 'touch' | 'use' | 'decide';
/** What it looks like in the world. Purely presentational. */
export type StopKind = 'package' | 'endpoint' | 'line' | 'switch' | 'store' | 'console';

export type Stop = {
	id: string;
	/** The name shown in the world — a substring of the role's record. */
	name: string;
	act: StopAct;
	kind: StopKind;
	/** Pinned to the start or the end of the chapter rather than spread. */
	at?: 'start' | 'end';
	/** Another stop that has to be done first — the package before the delivery. */
	needs?: string;
};

export type Goal = {
	/** `exp.short`, the join to the role. */
	role: string;
	/** The verb the HUD leads with. */
	verb: string;
	/** What the objective is, in the record's words where the record has them. */
	title: string;
	/** The line of the record every stop name is taken from. */
	source: string;
	stops: Stop[];
};

export type DecisionRow = {
	id: string;
	last: string;
	today: string;
	email: 'Yes' | 'No';
	why: string;
};

type Def = {
	verb: string;
	/** A stat tile's label to take the title from, or a fixed title. */
	title: { stat: string } | { text: string };
	stops: Omit<Stop, 'id'>[];
};

const DEFS: Record<string, Def> = {
	/* The tutorial chapter. The quest is the first production API, so the
	   objective is to carry one — both halves of the achievement's own
	   sentence: the API, and where its data went. */
	Jojonomic: {
		verb: 'Deliver',
		title: { text: 'A first production API' },
		stops: [
			{ name: 'RESTful API services', act: 'touch', kind: 'package', at: 'start' },
			{
				name: 'MySQL for data persistence',
				act: 'use',
				kind: 'endpoint',
				at: 'end',
				needs: 'Jojonomic-RESTful API services',
			},
		],
	},
	Moladin: {
		verb: 'Carry',
		title: { stat: 'product lines' },
		stops: [
			'Crash Program',
			'Referral Program',
			'Survey Program',
			'Academy Program',
			'Banner Program',
			'Second Inspection Program',
			'Open Production Issue Tools',
		].map((name) => ({ name, act: 'touch' as const, kind: 'line' as const })),
	},
	'GovTech Health': {
		verb: 'Ship',
		title: { stat: 'dashboards delivered' },
		stops: [
			'Gerakan Anak Sehat',
			'Covid-19 Vaksin',
			'Morbiditas Pasien',
			'Kualitas Internet Survey & Monitoring',
			'Monitoring Implementasi SATUSEHAT',
		].map((name) => ({ name, act: 'use' as const, kind: 'switch' as const })),
	},
	'INA Digital': {
		verb: 'Connect',
		title: { stat: 'data stores integrated' },
		stops: ['PostgreSQL', 'Google BigQuery', 'MongoDB', 'Redis'].map((name) => ({
			name,
			act: 'touch' as const,
			kind: 'store' as const,
		})),
	},
	Meditap: {
		verb: 'Decide',
		title: { text: 'deciding when to speak' },
		stops: [{ name: 'decide()', act: 'decide', kind: 'console', at: 'start' }],
	},
};

/** What INA Digital's four stores power, in the record's words. */
export const INA_PANEL = 'dashboards for the Business Intelligence team';

function titleFor(exp: Experience, def: Def): string {
	if ('text' in def.title) return def.title.text;
	const label = def.title.stat;
	const stat = exp.stats.find((s) => s.label === label);
	if (!stat) throw new Error(`career-objectives: ${exp.short} has no "${label}" stat`);
	return `${stat.value} ${stat.label}`;
}

/** The achievement every stop name comes from; the write-up for Meditap. */
function sourceFor(exp: Experience, stops: Omit<Stop, 'id'>[]): string {
	if (stops.some((s) => s.act === 'decide')) return caseStudy.title;
	const hit = exp.achievements.find((a) =>
		stops.every((s) => a.includes(s.name)),
	);
	if (!hit) throw new Error(`career-objectives: no single achievement of ${exp.short} names every stop`);
	return hit;
}

/** One goal per role, oldest first — the order the chapters are walked in. */
export function goals(): Goal[] {
	return [...experiences].reverse().map((exp) => {
		const def = DEFS[exp.short];
		if (!def) throw new Error(`career-objectives: no objective for ${exp.short}`);
		return {
			role: exp.short,
			verb: def.verb,
			title: titleFor(exp, def),
			source: sourceFor(exp, def.stops),
			stops: def.stops.map((s) => ({ ...s, id: `${exp.short}-${s.name}` })),
		};
	});
}

/** The goal for one role, by `exp.short`. */
export function goalFor(role: string): Goal | undefined {
	return goals().find((g) => g.role === role);
}

/**
 * The case study's behaviour table as decisions to make.
 *
 * Found by its header rather than by position, and the header is checked, so
 * a restructured write-up fails loudly instead of feeding the game a
 * different table.
 */
export function decisionRows(): DecisionRow[] {
	for (const section of caseStudy.sections) {
		for (const block of section.body) {
			if (typeof block === 'string' || block.kind !== 'table') continue;
			if (block.head.join('|') !== ["Last state", "Today's reading", 'Email?', 'Why'].join('|')) continue;
			return block.rows.map((r, i) => ({
				id: `row-${i + 1}`,
				last: r[0],
				today: r[1],
				email: plain(r[2]) === 'Yes' ? 'Yes' : 'No',
				why: r[3],
			}));
		}
	}
	throw new Error('career-objectives: the case study has no behaviour table');
}
