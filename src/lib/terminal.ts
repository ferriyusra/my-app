/**
 * The command set behind the Terminal app.
 *
 * Kept as a pure function of (command, context) so the parsing and the output
 * can be tested without a DOM — the app is a renderer, this is the shell.
 *
 * Everything it prints comes from the same typed data the windows render, so a
 * role added to `experience.ts` shows up in `ls roles` with nothing else to
 * edit. Nothing here is a canned string pretending to be computed.
 */

import { experiences, tenureLabel, tenureMonths } from '../data/experience.ts';
import { projects } from '../data/projects.ts';
import { skills } from '../data/skills.ts';
import { caseStudy } from '../data/case-study.ts';
import { profile, yearsOfExperience, CAREER_START } from '../data/profile.ts';
import type { AppId } from '../types/windows.ts';
import { SHORTCUTS, SHORTCUT_NOTE, TIP_PAGES } from '../data/tips.ts';

export type Line = { text: string; tone?: 'dim' | 'accent' | 'error' };

export type Result = {
	lines: Line[];
	/** A window the command asked the shell to open. */
	open?: AppId;
	/** Set by `clear`. */
	clear?: boolean;
};

const dim = (text: string): Line => ({ text, tone: 'dim' });
const acc = (text: string): Line => ({ text, tone: 'accent' });
const p = (text = ''): Line => ({ text });

/** Breaks a sentence onto terminal-width lines, on word boundaries. */
function wrap(text: string, width = 72): string[] {
	const out: string[] = [];
	let line = '';
	for (const word of text.split(' ')) {
		if (line && line.length + word.length + 1 > width) {
			out.push(line);
			line = word;
		} else line = line ? `${line} ${word}` : word;
	}
	if (line) out.push(line);
	return out;
}

const APP_WORDS: Record<string, AppId> = {
	tips: 'tips',
	about: 'about',
	skills: 'skills',
	experience: 'experience',
	projects: 'explorer',
	explorer: 'explorer',
	contact: 'contact',
	mail: 'contact',
	media: 'media',
	music: 'media',
	settings: 'settings',
	career: 'career',
	recycle: 'recycle',
	bin: 'recycle',
	code: 'vscode',
	vscode: 'vscode',
};

const COMMANDS = [
	['help', 'this list'],
	['whoami', 'who is behind the desktop'],
	['ls [roles|projects|skills]', 'list what is on record'],
	['cat <role|project|case>', 'read one entry in full'],
	['skill <name>', 'where a tool was actually used'],
	['open <app>', 'open a window'],
	['uptime', 'years in the industry, computed'],
	['tips [keys]', 'what this desktop does, and the keys it answers to'],
	['contact', 'how to reach him'],
	['clear', 'clear the screen'],
] as const;

export function run(input: string): Result {
	const raw = input.trim();
	if (!raw) return { lines: [] };
	const [cmd, ...rest] = raw.split(/\s+/);
	const arg = rest.join(' ').toLowerCase();

	switch (cmd.toLowerCase()) {
		case 'help':
			return {
				lines: [
					acc('Available commands'),
					...COMMANDS.map(([c, d]) => p(`  ${c.padEnd(28)}${d}`)),
					dim(''),
					dim('Tab completes. ↑ and ↓ walk the history.'),
				],
			};

		case 'whoami':
			return {
				lines: [
					acc(profile.name),
					p(`${profile.role} — ${profile.roleDetail}`),
					p(`${profile.location} · ${profile.availability}`),
					dim(''),
					p(profile.headline),
					dim(`Previously: ${profile.previously}`),
				],
			};

		case 'uptime': {
			const months = experiences.reduce((n, e) => n + tenureMonths(e), 0);
			return {
				lines: [
					p(`up ${yearsOfExperience()} years, ${months} months across ${experiences.length} roles`),
					dim(`since ${CAREER_START} · ${skills.length} tools · load average: steady`),
				],
			};
		}

		case 'ls': {
			const what = arg || 'roles';
			if (what.startsWith('role')) {
				return {
					lines: [
						acc(`${experiences.length} roles`),
						...experiences.map((e) =>
							p(`  ${e.short.padEnd(16)}${e.period.padEnd(24)}${tenureLabel(e)}`),
						),
						dim(''),
						dim('cat <name> to read one'),
					],
				};
			}
			if (what.startsWith('project')) {
				return {
					lines: [
						acc(`${projects.length} projects`),
						...projects.map((x) => p(`  ${x.name.padEnd(34)}${x.tech.slice(0, 3).join(', ')}`)),
					],
				};
			}
			if (what.startsWith('skill')) {
				const byCat = new Map<string, string[]>();
				for (const s of skills) {
					byCat.set(s.category, [...(byCat.get(s.category) ?? []), s.name]);
				}
				return {
					lines: [
						acc(`${skills.length} tools`),
						...[...byCat].map(([c, names]) => p(`  ${c.padEnd(12)}${names.join(', ')}`)),
					],
				};
			}
			return { lines: [{ text: `ls: no such listing: ${what}`, tone: 'error' }, dim('try: roles, projects, skills')] };
		}

		case 'cat': {
			if (!arg) return { lines: [{ text: 'cat: needs a name', tone: 'error' }] };
			if (arg.startsWith('case') || arg.includes('aso') || arg.includes('billing')) {
				return {
					lines: [
						acc(caseStudy.title),
						dim(`${caseStudy.at} · ${caseStudy.period}`),
						p(''),
						p(caseStudy.summary),
						p(''),
						...caseStudy.sections.flatMap((s) => [acc(s.heading), ...s.body.map((b) => p(b.replace(/\*\*/g, ''))), p('')]),
						acc('What this write-up does not answer'),
						...caseStudy.openQuestions.map((q) => p(`  · ${q}`)),
					],
				};
			}
			const role = experiences.find((e) => e.short.toLowerCase().includes(arg) || e.company.toLowerCase().includes(arg));
			if (role) {
				return {
					lines: [
						acc(`${role.role} — ${role.company}`),
						dim(`${role.period} · ${tenureLabel(role)} · ${role.location}`),
						p(''),
						p(role.description),
						p(''),
						...role.achievements.map((a) => p(`  · ${a}`)),
						p(''),
						dim(role.tech.join(' · ')),
					],
				};
			}
			const proj = projects.find((x) => x.name.toLowerCase().includes(arg));
			if (proj) {
				return {
					lines: [acc(proj.name), p(''), p(proj.description), p(''), dim(proj.tech.join(' · '))],
				};
			}
			return { lines: [{ text: `cat: not found: ${arg}`, tone: 'error' }, dim('ls roles · ls projects · cat case')] };
		}

		case 'skill': {
			if (!arg) return { lines: [{ text: 'skill: needs a name', tone: 'error' }] };
			const hit = skills.find((s) => s.name.toLowerCase() === arg) ?? skills.find((s) => s.name.toLowerCase().includes(arg));
			if (!hit) return { lines: [{ text: `skill: not found: ${arg}`, tone: 'error' }, dim('ls skills')] };
			/* Evidence, computed — the roles that actually name it. */
			const used = experiences.filter((e) => e.tech.includes(hit.name));
			const months = used.reduce((n, e) => n + tenureMonths(e), 0);
			const built = projects.filter((x) => x.tech.includes(hit.name));
			return {
				lines: [
					acc(hit.name),
					dim(hit.category),
					p(''),
					used.length
						? p(`Used in ${used.length} role${used.length > 1 ? 's' : ''}, ${months} months total:`)
						: dim('Not named in any role on record.'),
					...used.map((e) => p(`  ${e.short.padEnd(16)}${e.period}`)),
					...(built.length ? [p(''), p(`Shipped in: ${built.map((x) => x.name).join(', ')}`)] : []),
				],
			};
		}

		case 'open': {
			const app = APP_WORDS[arg];
			if (!app) {
				return {
					lines: [
						{ text: `open: unknown window: ${arg || '(nothing)'}`, tone: 'error' },
						dim(Object.keys(APP_WORDS).join(' · ')),
					],
				};
			}
			return { lines: [dim(`opening ${arg}…`)], open: app };
		}

		case 'tips': {
			if (arg === 'keys' || arg === 'keyboard') {
				return {
					lines: [
						acc('Keyboard'),
						...SHORTCUTS.map((k) =>
							p(`  ${(k.alt ? `${k.chord}  /  ${k.alt}` : k.chord).padEnd(24)}${k.does}`),
						),
						dim(''),
						...wrap(SHORTCUT_NOTE).map(dim),
					],
				};
			}
			return {
				lines: [
					...TIP_PAGES.flatMap((page) => [
						acc(page.title),
						...page.tips.map((t) =>
							p(`  ${t.title}${t.where ? ` — ${t.where}` : ''}`),
						),
						p(''),
					]),
					dim('tips keys for the shortcuts, open tips for the window'),
				],
			};
		}

		case 'contact':
			return {
				lines: [
					acc('Reach him'),
					p(`  email     ${profile.email}`),
					p(`  github    ${profile.github}`),
					p(`  linkedin  ${profile.linkedin}`),
					dim(''),
					dim('open mail to write from the desktop'),
				],
			};

		case 'clear':
			return { lines: [], clear: true };

		case 'sudo':
			return { lines: [dim('Nice try.')] };

		case 'exit':
			return { lines: [dim('Close the window — this one has no shell to exit to.')] };

		default:
			return {
				lines: [
					{ text: `${cmd}: command not found`, tone: 'error' },
					dim('help lists what there is'),
				],
			};
	}
}

/** Names Tab can complete: the commands, plus every noun they take. */
export function completions(): string[] {
	return [
		...COMMANDS.map(([c]) => c.split(' ')[0]),
		...Object.keys(APP_WORDS),
		...experiences.map((e) => e.short),
		...skills.map((s) => s.name),
	];
}
