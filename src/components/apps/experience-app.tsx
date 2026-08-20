'use client';

import { useState } from 'react';
import { Building2, ChevronDown, History, MapPin } from 'lucide-react';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import {
	experiences,
	tenureLabel,
	type Experience,
} from '@/data/experience';

const PAGES: SettingsPage[] = [
	{ key: 'all', label: 'Timeline', Icon: History },
	...experiences.map((e) => ({
		key: e.short,
		label: e.short,
		Icon: Building2,
	})),
];

/** How many outcomes show before the entry needs expanding. */
const COLLAPSED = 2;

function Role({
	exp,
	expanded,
	onToggle,
}: {
	exp: Experience;
	expanded: boolean;
	onToggle: () => void;
}) {
	const shown = expanded ? exp.achievements : exp.achievements.slice(0, COLLAPSED);
	const hidden = exp.achievements.length - COLLAPSED;

	return (
		<li className='xp-entry' data-current={exp.current || undefined}>
			<span className='xp-marker' aria-hidden='true' />

			<article className='xp-card'>
				<header className='xp-card-head'>
					<div>
						<h3>{exp.role}</h3>
						<p className='xp-company'>
							{exp.company}
							<span className='xp-loc'>
								<MapPin size={12} aria-hidden='true' />
								{exp.location}
							</span>
						</p>
					</div>
					<div className='xp-when'>
						<time dateTime={exp.startISO}>{exp.period}</time>
						<small>{tenureLabel(exp)}</small>
						{exp.current && <span className='xp-now'>Current</span>}
					</div>
				</header>

				<p className='xp-desc'>{exp.description}</p>

				<ul className='xp-points'>
					{shown.map((a) => (
						<li key={a}>{a}</li>
					))}
				</ul>

				{hidden > 0 && (
					<button
						type='button'
						className='xp-toggle'
						aria-expanded={expanded}
						onClick={onToggle}>
						{expanded ? 'Show less' : `${hidden} more outcome${hidden > 1 ? 's' : ''}`}
						<ChevronDown
							size={14}
							aria-hidden='true'
							data-open={expanded || undefined}
						/>
					</button>
				)}

				<ul className='xp-tech'>
					{exp.tech.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
			</article>
		</li>
	);
}

/** Experience as a Settings page: a company rail beside a drawn timeline. */
export default function ExperienceApp() {
	const [page, setPage] = useState('all');
	const [open, setOpen] = useState<string | null>(null);

	const shown =
		page === 'all' ? experiences : experiences.filter((e) => e.short === page);

	return (
		<SettingsShell
			pages={PAGES}
			active={page}
			onSelect={(k) => {
				setPage(k);
				setOpen(null);
			}}
			navLabel='Employers'
			title={page === 'all' ? 'Experience' : page}
			subtitle={
				page === 'all'
					? `${experiences.length} roles, most recent first`
					: shown[0]?.company
			}>
			<ol className='xp-timeline'>
				{shown.map((exp) => (
					<Role
						key={exp.company}
						exp={exp}
						expanded={open === exp.company}
						onToggle={() => setOpen(open === exp.company ? null : exp.company)}
					/>
				))}
			</ol>
		</SettingsShell>
	);
}
