'use client';

import { useEffect, useState } from 'react';
import { Building2, FileCode2, History } from 'lucide-react';
import { LiChevronDown, LiMapPin } from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import CaseStudyBody from '@/components/content/case-study-body';
import { useAppIntent } from '@/hooks/use-app-intent';
import { announcePlace } from '@/hooks/use-app-url';
import { caseStudy, caseStudyLength } from '@/data/case-study';
import {
	experiences,
	tenureLabel,
	tenureMonths,
	type Experience,
} from '@/data/experience';

const PAGES: SettingsPage[] = [
	{ key: 'all', label: 'Timeline', Icon: History },
	/* The deepest thing on the site was the hardest to find: a collapsed row
	   under the outcomes and the chips of one role card, after an expand and a
	   scroll. It is a page of its own now, second in the rail. */
	{ key: 'case', label: 'Case study', Icon: FileCode2 },
	...experiences.map((e) => ({
		key: e.short,
		label: e.short,
		Icon: Building2,
	})),
];

/** How many outcomes show before the entry needs expanding. */
const COLLAPSED = 2;

const caseLength = caseStudyLength();

function Role({
	exp,
	expanded,
	onToggle,
	onReadCase,
	single = false,
}: {
	exp: Experience;
	expanded: boolean;
	onToggle: () => void;
	onReadCase: () => void;
	/** The role's own page. Nothing is collapsed there: a reader who picked
	    one role from the rail came for its scope, and the page is one card. */
	single?: boolean;
}) {
	const all = single || expanded;
	const shown = all ? exp.achievements : exp.achievements.slice(0, COLLAPSED);
	const hidden = single ? 0 : exp.achievements.length - COLLAPSED;

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
				{exp.stats.length > 0 && (
				<ul className='ex-stats'>
					{exp.stats.map((st) => (
						<li key={st.label}>
							<strong>{st.value}</strong>
							<span>{st.label}</span>
						</li>
					))}
				</ul>

				)}

				{/* The facts that are not numbers, as a line rather than as tiles: a
				    tile with a word in it reads as a metric that could not be found. */}
				{exp.highlights.length > 0 && (
					<ul className='ex-highlights'>
						{exp.highlights.map((h) => (
							<li key={h}>{h}</li>
						))}
					</ul>
				)}

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

				{/* Only the role the case study is about carries it, and as a
				    way in rather than a copy. Meditap's own page used to show two
				    of its ten outcomes and then the whole 1,400-word write-up
				    expanded beneath them — a second copy of the page one rail
				    item above, with the scope collapsed and the duplicate open.
				    The write-up has one home in this window, with its own "On
				    this page" nav; this row says what it is and goes there. */}
				{exp.short === caseStudy.at && (
					<div className='ex-case'>
						<FileCode2 size={20} aria-hidden='true' />
						<span className='ex-case-text'>
							<strong>Case study: {caseStudy.title}</strong>
							<small>
								{caseStudy.stack.slice(0, 4).join(' · ')} · {caseLength.sections}{' '}
								sections · about {caseLength.minutes} min
							</small>
						</span>
						<button
							type='button'
							className='fl-btn fl-btn-standard'
							onClick={onReadCase}>
							Read the case study
						</button>
					</div>
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

	/* About's overview and Start's Recommended open this window on the case
	   study; the note arrives with the launch, or now if it is already open. */
	useAppIntent('experience', (value) => {
		if (value !== 'case') return;
		setPage('case');
		setOpen(null);
	});

	const isCase = page === 'case';

	/* Put the case study in the address bar, so the link the owner copies to
	   send someone is the link to the write-up. */
	useEffect(() => {
		announcePlace('experience', isCase ? 'case' : null);
	}, [isCase]);

	return (
		<SettingsShell
			pages={PAGES}
			active={page}
			onSelect={(k) => {
				setPage(k);
				setOpen(null);
			}}
			navLabel='Sections'
			title={page === 'all' ? 'Experience' : isCase ? 'Case study' : page}
			subtitle={
				page === 'all'
					? `${experiences.length} roles, most recent first`
					: isCase
						? `${caseStudy.at} · ${caseStudy.period}`
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

			{isCase ? (
				<article className='ex-card ex-case-page'>
					<h3 className='ex-case-title'>{caseStudy.title}</h3>
					<CaseStudyBody />
				</article>
			) : (
				<ol className='ex-timeline'>
					{shown.map((exp) => (
						<Role
							key={exp.company}
							exp={exp}
							expanded={open === exp.company}
							onToggle={() => setOpen(open === exp.company ? null : exp.company)}
							onReadCase={() => {
								setPage('case');
								setOpen(null);
							}}
							single={page !== 'all'}
						/>
					))}
				</ol>
			)}
		</SettingsShell>
	);
}
