'use client';

import { useMemo, useState } from 'react';
import { Boxes, ChevronDown, LayoutTemplate, Server, Sparkles, Wrench } from 'lucide-react';
import {
	LiCloud,
	LiDatabase,
	type IconLike,
} from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import { evidenceFor, monthsLabel } from '@/lib/skill-evidence';
import {
	SKILL_CATEGORIES,
	skills,
	type Skill,
	type SkillCategory,
} from '@/data/skills';

const CATEGORY_ICON: Record<SkillCategory, IconLike> = {
	Backend: Server,
	Frontend: LayoutTemplate,
	Database: LiDatabase,
	DevOps: Wrench,
	Cloud: LiCloud,
	'AI Tools': Sparkles,
};

const PAGES: SettingsPage[] = [
	{ key: 'all', label: 'All skills', Icon: Boxes },
	...SKILL_CATEGORIES.map(({ key }) => ({
		key,
		label: key,
		Icon: CATEGORY_ICON[key],
	})),
];

/** A lettered plate for the handful of tools with no brand mark on disk. */
function SkillMark({ skill }: { skill: Skill }) {
	if (!skill.icon)
		return (
			<span className='sk-mark sk-mark-letter' aria-hidden='true'>
				{skill.name.slice(0, 2)}
			</span>
		);
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={`sk-mark${skill.adaptive ? ' icon-adaptive' : ''}`}
			src={skill.icon}
			alt=''
			aria-hidden='true'
			width={22}
			height={22}
			loading='lazy'
		/>
	);
}

/**
 * The answer to "used where, and for how long" — computed from the roles and
 * projects that name the tool, so it cannot drift from `experience.ts`.
 *
 * A tool that no role names says so. Nine of them are in that position, and
 * padding them with plausible-sounding evidence would be the wrong fix.
 */
function SkillEvidence({ skill }: { skill: Skill }) {
	const { roles, projects: built, months, since } = evidenceFor(skill.name);

	if (!roles.length && !built.length) {
		return (
			<div className='sk-evidence'>
				<p className='sk-evidence-none'>
					Used, but not named in any role or project on record — so there is
					nothing here to show you.
				</p>
			</div>
		);
	}

	return (
		<div className='sk-evidence'>
			{roles.length > 0 && (
				<>
					<p className='sk-evidence-lead'>
						<strong>{monthsLabel(months)}</strong> across {roles.length} role
						{roles.length > 1 ? 's' : ''}
						{since && <span className='sk-since'>since {since}</span>}
					</p>
					<ul className='sk-evidence-roles'>
						{roles.map((r) => (
							<li key={r.company}>
								<strong>{r.short}</strong>
								<span>{r.period}</span>
							</li>
						))}
					</ul>
				</>
			)}
			{built.length > 0 && (
				<p className='sk-evidence-built'>
					Shipped in {built.map((b) => b.name).join(', ')}
				</p>
			)}
		</div>
	);
}

function SkillGroup({
	category,
	blurb,
	items,
	expanded,
	onToggle,
}: {
	category: SkillCategory;
	blurb: string;
	items: Skill[];
	expanded: string | null;
	onToggle: (name: string) => void;
}) {
	const Icon = CATEGORY_ICON[category];
	return (
		<section className='sk-group'>
			<header className='sk-group-head'>
				<span className='sk-group-icon' aria-hidden='true'>
					<Icon size={17} />
				</span>
				<div>
					<h3>{category}</h3>
					<p>{blurb}</p>
				</div>
				<span className='sk-group-count'>{items.length}</span>
			</header>

			<ul className='sk-list'>
				{items.map((s) => {
					const open = expanded === s.name;
					return (
						<li key={s.name} className='sk-row' data-open={open || undefined}>
							<button
								type='button'
								className='sk-row-btn'
								aria-expanded={open}
								onClick={() => onToggle(s.name)}>
								<SkillMark skill={s} />
								<span className='sk-name'>
									{s.name}
									<small>{s.note}</small>
								</span>
								<ChevronDown
									size={14}
									aria-hidden='true'
									className='sk-chev'
								/>
							</button>
							{open && <SkillEvidence skill={s} />}
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/** Skills, laid out as a Windows Settings page grouped by category. */
export default function SkillsApp() {
	const [page, setPage] = useState<string>('all');
	const [expanded, setExpanded] = useState<string | null>(null);

	const groups = useMemo(
		() =>
			SKILL_CATEGORIES.filter((c) => page === 'all' || c.key === page).map(
				(c) => ({
					...c,
					items: skills
						.filter((s) => s.category === c.key)
						.sort((a, b) => b.years - a.years),
				}),
			),
		[page],
	);

	const shown = groups.reduce((n, g) => n + g.items.length, 0);

	return (
		<SettingsShell
			pages={PAGES}
			active={page}
			onSelect={(k) => {
				setPage(k);
				setExpanded(null);
			}}
			navLabel='Skill categories'
			title={page === 'all' ? 'Skills' : page}
			subtitle={`${shown} tools — open one to see where it was used`}>
			{groups.map((g) => (
				<SkillGroup
					key={g.key}
					category={g.key}
					blurb={g.blurb}
					items={g.items}
					expanded={expanded}
					onToggle={(name) =>
						setExpanded((cur) => (cur === name ? null : name))
					}
				/>
			))}
		</SettingsShell>
	);
}
