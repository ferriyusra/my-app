/**
 * What Start actually searches.
 *
 * It used to filter fourteen things: the app titles and their one-line blurbs.
 * Typing "Pub/Sub" or "Meditap" or "Kafka" returned nothing, even though all
 * three are in `src/data` — the shell knew the answer and would not say it.
 *
 * Windows Search looks inside content, so this does too. The index is built
 * from the same typed data every window renders, which means it cannot drift:
 * a role added to `experience.ts` is searchable the moment it is added, with no
 * second list to remember.
 *
 * Kept free of React and of the registry so it can be exercised directly —
 * see search.test.ts.
 */

/* Relative rather than the `@/` alias so `node --test` can load this without a
   resolver — the ranking below is logic, and it is covered by tests. */
import { experiences } from '../data/experience.ts';
import { projects } from '../data/projects.ts';
import { skills } from '../data/skills.ts';
import { caseStudy } from '../data/case-study.ts';
import { discarded } from '../data/discarded.ts';
import { profile } from '../data/profile.ts';
import { SHORTCUTS, TIP_PAGES } from '../data/tips.ts';
import type { AppId } from '../types/windows.ts';

export type Hit = {
	id: string;
	/** Which window answers this, and what Start should open. */
	app: AppId;
	kind: 'Role' | 'Project' | 'Skill' | 'Case study' | 'Discarded' | 'Profile' | 'Tip';
	title: string;
	subtitle: string;
	/** Everything matched against; never shown. */
	haystack: string;
	/** Score contribution when the title itself matches. */
	weight: number;
};

/** Built once per module load; the data is static for the life of the page. */
let cached: Hit[] | null = null;

export function index(): Hit[] {
	if (cached) return cached;
	const out: Hit[] = [];

	for (const e of experiences) {
		out.push({
			id: `role:${e.company}`,
			app: 'experience',
			kind: 'Role',
			title: `${e.role} — ${e.short}`,
			subtitle: e.period,
			haystack: [e.role, e.company, e.short, e.period, e.location, e.description, ...e.achievements, ...e.tech, ...e.stats.map((s) => `${s.value} ${s.label}`)].join(' '),
			weight: 3,
		});
	}

	for (const p of projects) {
		out.push({
			id: `project:${p.id}`,
			app: 'explorer',
			kind: 'Project',
			title: p.name,
			subtitle: p.tech.slice(0, 3).join(' · '),
			haystack: [p.name, p.description, ...p.tech].join(' '),
			weight: 3,
		});
	}

	for (const s of skills) {
		/* A skill's evidence is where it was actually used, so the roles that
		   name it are part of what you can find it by. */
		const used = experiences.filter((e) => e.tech.includes(s.name));
		out.push({
			id: `skill:${s.name}`,
			app: 'skills',
			kind: 'Skill',
			title: s.name,
			subtitle: used.length
				? `${s.category} · used at ${used.map((e) => e.short).join(', ')}`
				: s.category,
			haystack: [s.name, s.category, ...used.map((e) => e.short)].join(' '),
			weight: 4,
		});
	}

	out.push({
		id: 'case:aso',
		app: 'experience',
		kind: 'Case study',
		title: caseStudy.title,
		subtitle: `${caseStudy.at} · ${caseStudy.period}`,
		haystack: [caseStudy.title, caseStudy.summary, ...caseStudy.stack, ...caseStudy.sections.flatMap((s) => [s.heading, ...s.body]), ...caseStudy.openQuestions].join(' '),
		weight: 3,
	});

	for (const d of discarded) {
		out.push({
			id: `discarded:${d.name}`,
			app: 'recycle',
			kind: 'Discarded',
			title: d.name,
			subtitle: d.summary,
			haystack: [d.name, d.origin, d.summary, d.reason, d.commit ?? ''].join(' '),
			weight: 3,
		});
	}

	out.push({
		id: 'profile:now',
		app: 'about',
		kind: 'Profile',
		title: 'Now',
		subtitle: profile.now.map((n) => n.label).join(' · '),
		haystack: [profile.name, profile.role, profile.roleDetail, profile.headline, profile.proof, profile.location, profile.availability, ...profile.now.map((n) => `${n.label} ${n.text}`)].join(' '),
		weight: 2,
	});

	for (const page of TIP_PAGES) {
		for (const tip of page.tips) {
			out.push({
				id: `tip:${tip.title}`,
				app: 'tips',
				kind: 'Tip',
				title: tip.title,
				subtitle: tip.where ?? page.label,
				haystack: [tip.title, tip.body, tip.where ?? '', page.label].join(' '),
				weight: 2,
			});
		}
	}

	/* One entry for the whole map, so "shortcut", "keyboard" or a chord finds
	   the page rather than nothing. */
	out.push({
		id: 'tip:keyboard',
		app: 'tips',
		kind: 'Tip',
		title: 'Keyboard shortcuts',
		subtitle: `${SHORTCUTS.length} chords the shell answers to`,
		haystack: ['keyboard shortcuts keys chords', ...SHORTCUTS.map((k) => `${k.chord} ${k.alt ?? ''} ${k.does}`)].join(' '),
		weight: 3,
	});

	cached = out;
	return out;
}

/**
 * Rank matches. A hit in the title beats a hit buried in the body, so typing
 * "Go" surfaces the skill before the six paragraphs that mention Go in passing.
 */
export function search(query: string, limit = 8): Hit[] {
	const q = query.trim().toLowerCase();
	if (q.length < 2) return [];

	const scored: { hit: Hit; score: number }[] = [];
	for (const hit of index()) {
		const title = hit.title.toLowerCase();
		const sub = hit.subtitle.toLowerCase();
		const hay = hit.haystack.toLowerCase();

		let score = 0;
		if (title === q) score += 40 * hit.weight;
		else if (title.startsWith(q)) score += 20 * hit.weight;
		else if (title.includes(q)) score += 10 * hit.weight;
		if (sub.includes(q)) score += 4;
		if (hay.includes(q)) score += 2;
		if (score > 0) scored.push({ hit, score });
	}

	return scored
		.sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title))
		.slice(0, limit)
		.map((s) => s.hit);
}

/** The line Start shows under a result: the words either side of the match. */
export function excerpt(hit: Hit, query: string, span = 64): string | null {
	const q = query.trim().toLowerCase();
	const at = hit.haystack.toLowerCase().indexOf(q);
	if (at === -1 || hit.title.toLowerCase().includes(q)) return null;
	const from = Math.max(0, at - span / 2);
	const to = Math.min(hit.haystack.length, at + q.length + span / 2);
	return (from > 0 ? '…' : '') + hit.haystack.slice(from, to).trim() + (to < hit.haystack.length ? '…' : '');
}
