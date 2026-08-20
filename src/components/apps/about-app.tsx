'use client';

import { MapPin, Clock, Briefcase, Download, CircleDot } from 'lucide-react';
import { profile } from '@/data/profile';
import { FONT, RADIUS, SANS } from '@/lib/theme';

const facts = [
	{ icon: MapPin, label: 'Based in', value: profile.locationDetail },
	{ icon: Clock, label: 'Timezone', value: 'GMT+7 (WIB) — overlaps EU & APAC' },
	{ icon: Briefcase, label: 'Open to', value: profile.workType },
	{ icon: CircleDot, label: 'Availability', value: profile.availability },
];

export default function AboutApp() {
	return (
		<div className='app-pad'>
			<header className='app-hero'>
				<div className='app-avatar' aria-hidden='true'>
					{profile.initials}
				</div>
				<div>
					<h2 className='app-h2'>{profile.name}</h2>
					<p className='app-sub'>
						{profile.role} — {profile.roleDetail}
					</p>
				</div>
			</header>

			<p className='app-body'>
				{profile.bio} I specialise in <strong>Go</strong> and{' '}
				<strong>Node.js</strong> — from RESTful APIs to event-driven
				architectures.
			</p>
			<p className='app-body'>
				Most of what I have shipped replaced something manual: spreadsheet
				tracking that became a billing source of truth, Tableau dashboards that
				became API-driven services, monitoring that a person used to do by hand.
			</p>

			<dl className='app-facts'>
				{facts.map(({ icon: Icon, label, value }) => (
					<div key={label} className='app-fact'>
						<Icon size={15} aria-hidden='true' />
						<div>
							<dt>{label}</dt>
							<dd>{value}</dd>
						</div>
					</div>
				))}
			</dl>

			<a
				href={profile.cvView}
				target='_blank'
				rel='noopener noreferrer'
				className='fl-btn fl-btn-accent'
				style={{
					marginTop: 20,
					fontFamily: SANS,
					fontSize: FONT.sm,
					borderRadius: RADIUS.sm,
				}}>
				<Download size={15} aria-hidden='true' />
				View CV
			</a>
		</div>
	);
}
