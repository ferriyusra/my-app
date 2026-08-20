'use client';

import { useState } from 'react';
import {
	Briefcase,
	ChevronDown,
	Download,
	Github,
	Layers,
	Linkedin,
	Mail,
	Moon,
	Sun,
	FolderGit2,
	MapPin,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import Meter from '@/components/ui/meter';
import { profile, yearsOfExperience } from '@/data/profile';
import { experiences, tenureLabel } from '@/data/experience';
import { MAX_YEARS, SKILL_CATEGORIES, skills } from '@/data/skills';
import { projects } from '@/data/projects';

/**
 * The narrow-screen view.
 *
 * A windowing metaphor needs a pointer and room to overlap; below ~900px it
 * has neither, so a phone gets the same content as a Windows 11 widgets
 * board — stacked cards with the same tokens, radii and type as the desktop,
 * rather than a shrunken desktop nobody can drive.
 */

function Card({
	icon,
	title,
	subtitle,
	children,
	open: initial = false,
}: {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	open?: boolean;
}) {
	const [open, setOpen] = useState(initial);
	return (
		<section className='mb-card' data-open={open || undefined}>
			<button
				type='button'
				className='mb-card-head'
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}>
				<span className='mb-card-icon' aria-hidden='true'>
					{icon}
				</span>
				<span className='mb-card-title'>
					<strong>{title}</strong>
					<small>{subtitle}</small>
				</span>
				<ChevronDown size={18} aria-hidden='true' data-open={open || undefined} />
			</button>
			{open && <div className='mb-card-body'>{children}</div>}
		</section>
	);
}

export default function MobileShell() {
	const { theme, toggle, mounted } = useTheme();
	const years = yearsOfExperience();
	const dark = mounted && theme === 'dark';

	return (
		<main className='mb-shell' id='main'>
			<header className='mb-head'>
				<span className='mb-avatar' aria-hidden='true'>
					{profile.initials}
				</span>
				<div className='mb-head-text'>
					<h1>{profile.name}</h1>
					<p>
						{profile.role} — {profile.roleDetail}
					</p>
					<p className='mb-loc'>
						<MapPin size={12} aria-hidden='true' />
						{profile.location}
						<span className='mb-dot' aria-hidden='true' />
						{profile.availability}
					</p>
				</div>
				<button
					type='button'
					className='mb-theme'
					aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
					onClick={toggle}>
					{mounted ? dark ? <Sun size={17} /> : <Moon size={17} /> : null}
				</button>
			</header>

			<p className='mb-headline'>{profile.headline}</p>

			<div className='mb-actions'>
				<a
					className='fl-btn fl-btn-accent'
					href={profile.cvView}
					target='_blank'
					rel='noopener noreferrer'>
					<Download size={15} aria-hidden='true' /> Resume
				</a>
				<a className='fl-btn fl-btn-standard' href={`mailto:${profile.email}`}>
					<Mail size={15} aria-hidden='true' /> Email
				</a>
			</div>

			<p className='mb-note'>
				Open this on a wider screen for the full Windows 11 desktop — draggable
				windows, Start menu, File Explorer and all.
			</p>

			<Card
				icon={<Briefcase size={17} />}
				title='Experience'
				subtitle={`${experiences.length} roles · ${years} years`}
				open>
				<ol className='mb-roles'>
					{experiences.map((e) => (
						<li key={e.company}>
							<strong>{e.role}</strong>
							<span className='mb-company'>{e.company}</span>
							<span className='mb-period'>
								{e.period} · {tenureLabel(e)}
							</span>
							<p>{e.description}</p>
							<span className='mb-tech'>{e.tech.slice(0, 6).join(' · ')}</span>
						</li>
					))}
				</ol>
			</Card>

			<Card
				icon={<Layers size={17} />}
				title='Skills'
				subtitle={`${skills.length} tools across ${SKILL_CATEGORIES.length} categories`}>
				{SKILL_CATEGORIES.map((c) => (
					<div key={c.key} className='mb-skill-group'>
						<h3>{c.key}</h3>
						<ul>
							{skills
								.filter((s) => s.category === c.key)
								.sort((a, b) => b.years - a.years)
								.map((s) => (
									<li key={s.name}>
										<span>{s.name}</span>
										<Meter
											value={s.years}
											max={MAX_YEARS}
											unit='years of hands-on use'
											label={s.name}
										/>
										<em>{s.years} yr</em>
									</li>
								))}
						</ul>
					</div>
				))}
			</Card>

			<Card
				icon={<FolderGit2 size={17} />}
				title='Projects'
				subtitle={`${projects.length} selected`}>
				<ul className='mb-projects'>
					{projects.map((p) => (
						<li key={p.id}>
							<span className='mb-project-dot' style={{ background: p.color }} aria-hidden='true' />
							<div>
								<strong>{p.name}</strong>
								<span className='mb-badge' data-type={p.type}>
									{p.type === 'real' ? 'Production' : 'Case study'}
								</span>
								<p>{p.description}</p>
								<span className='mb-tech'>{p.tech.slice(0, 4).join(' · ')}</span>
								<span className='mb-project-links'>
									{p.github && (
										<a href={p.github} target='_blank' rel='noopener noreferrer'>
											Code
										</a>
									)}
									{p.demo && (
										<a href={p.demo} target='_blank' rel='noopener noreferrer'>
											Live demo
										</a>
									)}
								</span>
							</div>
						</li>
					))}
				</ul>
			</Card>

			<footer className='mb-foot'>
				<a href={`mailto:${profile.email}`}>
					<Mail size={16} aria-hidden='true' /> {profile.email}
				</a>
				<a href={profile.github} target='_blank' rel='noopener noreferrer'>
					<Github size={16} aria-hidden='true' /> GitHub
				</a>
				<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
					<Linkedin size={16} aria-hidden='true' /> LinkedIn
				</a>
			</footer>
		</main>
	);
}
