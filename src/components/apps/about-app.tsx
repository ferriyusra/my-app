'use client';

import { useState } from 'react';
import { BadgeCheck, Briefcase, Clock, Cpu, FileCode2, Info, Link as LinkIcon, MapPin, Radar } from 'lucide-react';
import { DocumentIcon, LiDownload, LiGithub, LiLinkedin, LiMail, LiMonitor } from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SettingCard from '@/components/ui/setting-card';
import { useWindowManager } from '@/hooks/use-window-manager';
import { sendIntent } from '@/hooks/use-app-intent';
import { profile, careerSince } from '@/data/profile';
import { experiences } from '@/data/experience';
import { caseStudy, caseStudyLength } from '@/data/case-study';
import { career } from '@/data/career-game';

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

	/* Experience, opened on the case study rather than the timeline. */
	const openCase = () => {
		sendIntent('experience', 'case');
		launch('experience');
	};
	const current = experiences.find((e) => e.current) ?? experiences[0];
	const caseLength = caseStudyLength();
	const inRole = career().months;
	const [ny, nm] = profile.nowUpdated.split('-').map(Number);
	const nowStamp = new Date(ny, nm - 1, 1).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});

	const deviceSpecs: [string, string][] = [
		['Name', profile.name],
		['Role', `${profile.role} — ${profile.roleDetail}`],
		['Experience', `Since ${careerSince()} · ${inRole} months in role across ${experiences.length} roles`],
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
			title='About'>
			{page === 'overview' && (
				<>
					<div className='ab-hero'>
						<span className='ab-avatar' aria-hidden='true'>
							{profile.initials}
						</span>
						{/* Three levels, in the order a reader decides on them: who,
						    what they do and in which stack, then the pitch. The page
						    title used to be the largest text here and the role was a
						    13px grey subtitle above the card — the one fact every
						    reader compares against a job description, set as a
						    caption. The stack line was only on the Specifications
						    tab, and "Available" had no object. */}
						<div className='ab-hero-text'>
							<h3>{profile.name}</h3>
							<p className='ab-role'>
								{profile.role} — {profile.roleDetail}
							</p>
							<p className='ab-lede'>{profile.headline}</p>
							<span className='ab-badges'>
								<span className='ab-badge'>
									<BadgeCheck size={13} aria-hidden='true' /> Since {careerSince('year')}
								</span>
								<span className='ab-badge'>
									<MapPin size={13} aria-hidden='true' /> {profile.locationDetail}
								</span>
								<span className='ab-badge' data-live>
									<Clock size={13} aria-hidden='true' /> {profile.availability} ·{' '}
									{profile.workType}
								</span>
							</span>
							{/* The CV sat on the third tab, so the one action this site
							    is measured by was behind a click a recruiter had to guess.
							    The first screen now carries it. */}
							<div className='ab-actions'>
								<a
									className='fl-btn fl-btn-accent'
									href={profile.cvView}
									target='_blank'
									rel='noopener noreferrer'>
									<DocumentIcon size={15} />
									View CV
								</a>
								<a
									className='fl-btn fl-btn-standard'
									href={profile.cvDownload}
									target='_blank'
									rel='noopener noreferrer'>
									<LiDownload size={15} aria-hidden='true' />
									Download PDF
								</a>
								<a className='fl-btn fl-btn-standard' href={`mailto:${profile.email}`}>
									<LiMail size={15} aria-hidden='true' />
									Email me
								</a>
							</div>
						</div>
					</div>

					{/* The paragraph a hiring manager reads, straight under the card
					    it belongs to. It was a card of its own whose 62px header
					    existed to say "Summary", and that header is what pushed the
					    case study below the fold on a 720p laptop. */}
					<p className='ab-proof'>{profile.proof}</p>

					{/* The one piece of this site a neighbouring portfolio cannot
					    copy. As a one-line row it said only "health plans", which
					    tells an engineer nothing; its own summary and stack do. The
					    button stays standard so View CV remains the one primary
					    action on the page. */}
					<SettingCard
						Icon={FileCode2}
						title={`Case study: ${caseStudy.title}`}
						description={`${caseStudy.stack.slice(0, 4).join(' · ')} · about ${caseLength.minutes} min read`}
						control={
							<button
								type='button'
								className='fl-btn fl-btn-standard'
								onClick={openCase}>
								Read the case study
							</button>
						}>
						<p className='st-prose'>{caseStudy.summary}</p>
					</SettingCard>

					<SettingCard Icon={Briefcase} title='What I actually ship'>
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
