'use client';

import { useMemo, useState } from 'react';
import {
	Boxes,
	Cloud,
	Database,
	LayoutTemplate,
	Server,
	Sparkles,
	Wrench,
	type LucideIcon,
} from 'lucide-react';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import {
	SKILL_CATEGORIES,
	skills,
	type Skill,
	type SkillCategory,
} from '@/data/skills';

const CATEGORY_ICON: Record<SkillCategory, LucideIcon> = {
	Backend: Server,
	Frontend: LayoutTemplate,
	Database: Database,
	DevOps: Wrench,
	Cloud: Cloud,
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

function SkillGroup({
	category,
	blurb,
	items,
}: {
	category: SkillCategory;
	blurb: string;
	items: Skill[];
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
				{items.map((s) => (
					<li key={s.name} className='sk-row'>
						<SkillMark skill={s} />
						<span className='sk-name'>
							{s.name}
							<small>{s.note}</small>
						</span>
					</li>
				))}
			</ul>
		</section>
	);
}

/** Skills, laid out as a Windows Settings page grouped by category. */
export default function SkillsApp() {
	const [page, setPage] = useState<string>('all');

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
			onSelect={setPage}
			navLabel='Skill categories'
			title={page === 'all' ? 'Skills' : page}
			subtitle={`${shown} tools, most-used first`}>
			{groups.map((g) => (
				<SkillGroup
					key={g.key}
					category={g.key}
					blurb={g.blurb}
					items={g.items}
				/>
			))}
		</SettingsShell>
	);
}
