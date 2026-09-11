'use client';

import { useState } from 'react';
import { BadgeCheck, Clock, Cpu, FileCode2, Info, Link as LinkIcon, Radar } from 'lucide-react';
import { DocumentIcon, LiBriefcase, LiDownload, LiGithub, LiLinkedin, LiMail, LiMapPin, LiMonitor } from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SettingCard from '@/components/ui/setting-card';
import { useWindowManager } from '@/hooks/use-window-manager';
import { sendIntent } from '@/hooks/use-app-intent';
import { profile, yearsOfExperience } from '@/data/profile';
import { experiences } from '@/data/experience';
import { caseStudy } from '@/data/case-study';

const PAGES: SettingsPage[] = [
	{ key: 'overview', label: 'Overview', Icon: Info },
	{ key: 'specs', label: 'Specifications', Icon: Cpu },
	{ key: 'links', label: 'Related links', Icon: LinkIcon },
];

/**
 * About Me, dressed as Settings ▸ System ▸ About.
 *
 * Windows presents that page as two specification tables under a device card,
 * which is a surprisingly good fit for a CV: the facts a recruiter scans for
 * are exactly the shape of a spec sheet.
 */
export default function AboutApp() {
	const [page, setPage] = useState('overview');
	const { launch } = useWindowManager();
	const years = yearsOfExperience();

	/* Experience, opened on the case study rather than the timeline. */
	const openCase = () => {
		sendIntent('experience', 'case');
		launch('experience');
	};
	const current = experiences.find((e) => e.current) ?? experiences[0];
	const [ny, nm] = profile.nowUpdated.split('-').map(Number);
	const nowStamp = new Date(ny, nm - 1, 1).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});

	const deviceSpecs: [string, string][] = [
		['Name', profile.name],
		['Role', `${profile.role} — ${profile.roleDetail}`],
		['Experience', `${years} years, since ${current ? 'Oct 2021' : '—'}`],
		['Currently', current.company],
		['Location', profile.locationDetail],
		['Time zone', 'GMT+7 (WIB) — overlaps EU and APAC'],
	];

	const stackSpecs: [string, string][] = [
		['Primary languages', 'Go, TypeScript, Node.js'],
		['Data', 'PostgreSQL, MongoDB, Redis, BigQuery'],
		['Platform', 'Google Cloud, Docker, Pub/Sub, Cloud Scheduler'],
		['Gateway and IAM', 'KrakenD, Keycloak'],
		['Open to', profile.workType],
		['Availability', profile.availability],
	];

	return (
		<SettingsShell
			pages={PAGES}
			active={page}
			onSelect={setPage}
			title='About'
			subtitle={`${profile.role} · ${profile.location}`}>
			{page === 'overview' && (
				<>
					<div className='ab-hero'>
						<span className='ab-avatar' aria-hidden='true'>
							{profile.initials}
						</span>
						<div className='ab-hero-text'>
							<h3>{profile.name}</h3>
							<p>{profile.headline}</p>
							<span className='ab-badges'>
								<span className='ab-badge'>
									<BadgeCheck size={13} aria-hidden='true' /> {years} yrs experience
								</span>
								<span className='ab-badge'>
									<LiMapPin size={13} aria-hidden='true' /> {profile.location}
								</span>
								<span className='ab-badge' data-live>
									<Clock size={13} aria-hidden='true' /> {profile.availability}
								</span>
							</span>
						</div>
					</div>

					{/* As prose in the card body, not as the card's 12px caption: this
					    paragraph is the one a hiring manager reads. */}
					<SettingCard Icon={Info} title='Summary'>
						<p className='st-prose'>{profile.proof}</p>
					</SettingCard>

					{/* The one piece of this site a neighbouring portfolio cannot
					    copy was reachable from here only by knowing it existed. */}
					<SettingCard
						Icon={FileCode2}
						title='Case study'
						description={caseStudy.title}
						control={
							<button
								type='button'
								className='fl-btn fl-btn-standard'
								onClick={openCase}>
								Read it
							</button>
						}
					/>

					<SettingCard Icon={Radar} title='Now'>
						<dl className='ab-now'>
							{profile.now.map((n) => (
								<div key={n.label}>
									<dt>{n.label}</dt>
									<dd>{n.text}</dd>
								</div>
							))}
						</dl>
						<p className='ab-now-stamp'>Updated {nowStamp}</p>
					</SettingCard>

					<SettingCard Icon={LiBriefcase} title='What I actually ship'>
						<p className='st-prose'>
							Most of what I have shipped replaced something manual: spreadsheet
							tracking that became a billing source of truth, Tableau dashboards
							that became API-driven services, monitoring that a person used to
							do by hand.
						</p>
						<ul className='ab-outcomes'>
							{profile.highlights.map((h) => (
								<li key={h.lead}>
									<strong>{h.lead}</strong>
									<span>{h.detail}</span>
									<em>
										{h.at} · {h.year}
									</em>
								</li>
							))}
						</ul>
					</SettingCard>
				</>
			)}

			{page === 'specs' && (
				<>
					<SettingCard Icon={LiMonitor} title='Engineer specifications'>
						<dl className='st-specs'>
							{deviceSpecs.map(([k, v]) => (
								<div key={k}>
									<dt>{k}</dt>
									<dd>{v}</dd>
								</div>
							))}
						</dl>
					</SettingCard>

					<SettingCard Icon={Cpu} title='Stack specifications'>
						<dl className='st-specs'>
							{stackSpecs.map(([k, v]) => (
								<div key={k}>
									<dt>{k}</dt>
									<dd>{v}</dd>
								</div>
							))}
						</dl>
					</SettingCard>
				</>
			)}

			{page === 'links' && (
				<div className='ab-links'>
					{/* Two rows because they are two actions. This one carried a
					    download glyph while opening a viewer, which is the kind of
					    control that names something it does not do. */}
					<a
						className='ab-link'
						href={profile.cvView}
						target='_blank'
						rel='noopener noreferrer'>
						<DocumentIcon size={17} />
						<span>
							<strong>Resume</strong>
							<small>PDF · opens in a new tab</small>
						</span>
					</a>
					<a
						className='ab-link'
						href={profile.cvDownload}
						target='_blank'
						rel='noopener noreferrer'>
						<LiDownload size={17} aria-hidden='true' />
						<span>
							<strong>Download resume</strong>
							<small>PDF · saves to your device</small>
						</span>
					</a>
					<a className='ab-link' href={`mailto:${profile.email}`}>
						<LiMail size={17} aria-hidden='true' />
						<span>
							<strong>Email</strong>
							<small>{profile.email}</small>
						</span>
					</a>
					<a
						className='ab-link'
						href={profile.github}
						target='_blank'
						rel='noopener noreferrer'>
						<LiGithub size={17} aria-hidden='true' />
						<span>
							<strong>GitHub</strong>
							<small>{profile.github.replace('https://', '')}</small>
						</span>
					</a>
					<a
						className='ab-link'
						href={profile.linkedin}
						target='_blank'
						rel='noopener noreferrer'>
						<LiLinkedin size={17} aria-hidden='true' />
						<span>
							<strong>LinkedIn</strong>
							<small>{profile.linkedin.replace('https://', '')}</small>
						</span>
					</a>
				</div>
			)}
		</SettingsShell>
	);
}
