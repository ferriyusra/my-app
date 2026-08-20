'use client';

import { useState } from 'react';
import {
	BadgeCheck,
	Clock,
	Cpu,
	Download,
	Github,
	Info,
	Linkedin,
	Link as LinkIcon,
	Mail,
	MapPin,
	Monitor,
	Briefcase,
} from 'lucide-react';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SettingCard from '@/components/ui/setting-card';
import { profile, yearsOfExperience } from '@/data/profile';
import { experiences } from '@/data/experience';

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
	const years = yearsOfExperience();
	const current = experiences.find((e) => e.current) ?? experiences[0];

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
									<MapPin size={13} aria-hidden='true' /> {profile.location}
								</span>
								<span className='ab-badge' data-live>
									<Clock size={13} aria-hidden='true' /> {profile.availability}
								</span>
							</span>
						</div>
					</div>

					<SettingCard
						Icon={Info}
						title='Summary'
						description={profile.proof}
					/>

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
				</>
			)}

			{page === 'specs' && (
				<>
					<SettingCard Icon={Monitor} title='Engineer specifications'>
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
					<a
						className='ab-link'
						href={profile.cvView}
						target='_blank'
						rel='noopener noreferrer'>
						<Download size={17} aria-hidden='true' />
						<span>
							<strong>Resume</strong>
							<small>PDF · opens in a new tab</small>
						</span>
					</a>
					<a className='ab-link' href={`mailto:${profile.email}`}>
						<Mail size={17} aria-hidden='true' />
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
						<Github size={17} aria-hidden='true' />
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
						<Linkedin size={17} aria-hidden='true' />
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
