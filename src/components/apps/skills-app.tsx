'use client';

import { useMemo, useState } from 'react';
import { Boxes, ChevronDown, LayoutTemplate, Server, Sparkles, Wrench } from 'lucide-react';
import {
	LiCloud,
	LiDatabase,
	type IconLike,
} from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SkillEvidence from '@/components/content/skill-evidence';
import SkillMark from './career/token-mark';
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
