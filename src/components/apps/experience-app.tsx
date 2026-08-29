'use client';

import { useState } from 'react';
import { Building2, FileCode2, History } from 'lucide-react';
import { LiChevronDown, LiMapPin } from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import CaseStudyBody from '@/components/content/case-study-body';
import { caseStudy } from '@/data/case-study';
import {
	experiences,
	tenureLabel,
	tenureMonths,
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
		<li className='ex-entry' data-current={exp.current || undefined}>
			<article className='ex-card'>
				<header className='ex-card-head'>
					<div>
						<h3>{exp.role}</h3>
						<p className='ex-company'>
							{exp.company}
							<span className='ex-loc'>
								<LiMapPin size={12} aria-hidden='true' />
								{exp.location}
							</span>
						</p>
					</div>
					<div className='ex-when'>
						<time dateTime={exp.startISO}>{exp.period}</time>
						<small>{tenureLabel(exp)}</small>
						{exp.current && <span className='ex-now'>Current</span>}
					</div>
				</header>

				{/* The numbers lead. They were the strongest thing on the card
				    and were sunk inside four lines of prose. */}
				<ul className='ex-stats'>
					{exp.stats.map((st) => (
						<li key={st.label}>
							<strong>{st.value}</strong>
							<span>{st.label}</span>
						</li>
					))}
				</ul>

				<p className='ex-desc'>{exp.description}</p>

				<ul className='ex-points'>
					{shown.map((a) => (
						<li key={a}>{a}</li>
					))}
				</ul>

				{hidden > 0 && (
					<button
						type='button'
						className='ex-toggle'
						aria-expanded={expanded}
						onClick={onToggle}>
						{expanded ? 'Show less' : `${hidden} more outcome${hidden > 1 ? 's' : ''}`}
						<LiChevronDown
							size={14}
							aria-hidden='true'
							data-open={expanded || undefined}
						/>
					</button>
				)}

				{/* All of them stay visible — they are what a keyword scan looks
				    for — but the first three are what the role actually ran on. */}
				<ul className='ex-tech'>
					{exp.tech.map((t, i) => (
						<li key={t} data-lead={i < 3 || undefined}>
							{t}
						</li>
					))}
				</ul>

				{/* Only the role the case study is about carries it. `<details>`
				    rather than state: it is long, and it should be closed by
				    default without another toggle to wire up. */}
				{exp.short === caseStudy.at && (
					<details className='ex-case'>
						<summary>
							<FileCode2 size={14} aria-hidden='true' />
							Case study — {caseStudy.title}
							<LiChevronDown size={14} aria-hidden='true' className='ex-case-chev' />
						</summary>
						<CaseStudyBody />
					</details>
				)}
			</article>
		</li>
	);
}

/**
 * The career as one proportional bar.
 *
 * The old rail drew a line and a dot, which looked like a timeline without
 * being one — it encoded nothing. Each segment here grows with the months the
 * role lasted, so five years reads as a shape before a word of it is read: two
 * short early roles, then the run that is still going.
 *
 * Not strictly to scale: a four-month role would come out around 48px, too
 * narrow to label, so segments carry a floor. Short roles are therefore a
 * little wider than their share. The ordering and the rough proportions are
 * the honest part; do not read exact durations off the widths.
 */
function CareerBar({
	roles,
	active,
	onPick,
}: {
	roles: Experience[];
	active: string | null;
	onPick: (short: string) => void;
}) {
	/* Oldest first, so the bar runs left-to-right like every other timeline. */
	const ordered = [...roles].reverse();
	const total = ordered.reduce((sum, e) => sum + tenureMonths(e), 0);
	const firstYear = ordered[0]?.startISO.slice(0, 4);

	return (
		<div className='ex-bar-wrap'>
			<div className='ex-bar' role='group' aria-label='Career timeline'>
				{ordered.map((e) => {
					const months = tenureMonths(e);
					return (
						<button
							key={e.company}
							type='button'
							className='ex-seg'
							style={{ flexGrow: months }}
							data-on={active === e.short || undefined}
							data-current={e.current || undefined}
							onClick={() => onPick(e.short)}
							title={`${e.short} · ${tenureLabel(e)}`}
							aria-label={`${e.short}, ${tenureLabel(e)}`}>
							<span className='ex-seg-label'>{e.short}</span>
							<span className='ex-seg-len'>{tenureLabel(e)}</span>
						</button>
					);
				})}
			</div>
			<div className='ex-bar-axis' aria-hidden='true'>
				<span>{firstYear}</span>
				<span>
					{Math.floor(total / 12)} yrs {total % 12 ? `${total % 12} mos` : ''}
				</span>
				<span>Now</span>
			</div>
		</div>
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
			{page === 'all' && (
				<CareerBar
					roles={experiences}
					active={null}
					onPick={(short) => {
						setPage(short);
						setOpen(null);
					}}
				/>
			)}

			<ol className='ex-timeline'>
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
