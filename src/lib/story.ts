/**
 * What the story computes rather than states.
 *
 * The story is a rendering of `src/data`, like every other surface here; this
 * is the small amount of arithmetic it needs on top — the order the case
 * study's run is told in, and which role each headline outcome belongs to.
 * Kept out of the components so `node --test` can check it.
 */

import { caseStudy, type FigureNode, type FigureRow } from '../data/case-study.ts';
import { experiences, type Experience } from '../data/experience.ts';

/* ── The run ── */

/** A box in the figure, with the id the markup and the scroll observer share. */
export type RunNode = FigureNode & { id: string };

export type RunSet = { name: string; after: string; nodes: RunNode[] };

export type RunFigure = { path: RunNode[]; sets: RunSet[]; caption: string };

/** One beat of the scroll-played run: which boxes it lights, and what it says. */
export type RunStep = {
	/** The boxes lit while this step is on screen. */
	lights: string[];
	/** The box or set name, verbatim from the figure. */
	title: string;
	/** The figure's own detail line, if it has one. A set lists its boxes. */
	detail: string | null;
};

/**
 * The figure with ids on every box: `p0…` along the path, `s0-0…` for the
 * boxes of each set in order.
 *
 * Throws on a set with no branch point rather than drawing it floating;
 * `case-study.test.ts` holds the same line against the data.
 */
export function runFigure(figure: { rows: readonly FigureRow[]; caption: string } = caseStudy.figure): RunFigure {
	const pathRow = figure.rows.find((r) => r.kind === 'path');
	if (!pathRow) throw new Error('The figure has no path to tell');
	const path = pathRow.nodes.map((n, i) => ({ ...n, id: `p${i}` }));
	const sets = figure.rows
		.filter((r) => r.kind === 'set')
		.map((r, i) => {
			if (!r.after || !path.some((n) => n.label === r.after)) {
				throw new Error(`Set "${r.name}" does not branch from a box on the path`);
			}
			return {
				name: r.name,
				after: r.after,
				nodes: r.nodes.map((n, j) => ({ ...n, id: `s${i}-${j}` })),
			};
		});
	return { path, sets, caption: figure.caption };
}

/**
 * The run in the order the write-up tells it: along the path, turning aside
 * at each branch point for the sets that hang off it — so the service reads
 * its sources and writes its outcomes before the alert queue carries a
 * message on. Every box is lit by exactly one step.
 */
export function runSteps(figure: RunFigure = runFigure()): RunStep[] {
	const steps: RunStep[] = [];
	for (const node of figure.path) {
		steps.push({ lights: [node.id], title: node.label, detail: node.detail ?? null });
		for (const set of figure.sets.filter((s) => s.after === node.label)) {
			steps.push({
				lights: set.nodes.map((n) => n.id),
				title: set.name,
				detail: set.nodes.map((n) => n.label).join(' · '),
			});
		}
	}
	return steps;
}

/* ── Roles ── */

/** "INA Digital" → "role-ina-digital": the anchor a role's chapter carries. */
export function roleSlug(exp: Pick<Experience, 'short'>): string {
	return `role-${exp.short.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/**
 * The role a headline outcome in `profile.highlights` came from.
 *
 * The outcome names where it happened (`at`), but in the register a reader
 * knows — "SATUSEHAT" is the platform, not the employer's short name — so the
 * join also accepts a role that lists the same outcome among its own
 * highlights. Null when neither matches; the test fails before that ships.
 */
export function highlightRole(h: { lead: string; at: string }): Experience | null {
	return (
		experiences.find((e) => e.short === h.at) ??
		experiences.find((e) => (e.highlights as readonly string[]).includes(h.lead)) ??
		null
	);
}
