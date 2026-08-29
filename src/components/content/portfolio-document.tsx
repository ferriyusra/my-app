import { FileCode2, FolderGit2, Radar, Undo2 } from 'lucide-react';
import { LiBriefcase, LiChevronDown, LiDownload, LiGithub, LiLayers, LiLinkedin, LiMail, LiMapPin } from '@/components/icons/line-icons';
import ThemeToggle from './theme-toggle';
import PrintExpander from './print-expander';
import CaseStudyBody from './case-study-body';
import { profile, yearsOfExperience } from '@/data/profile';
import { experiences, tenureLabel } from '@/data/experience';
import { SKILL_CATEGORIES, skills } from '@/data/skills';
import { projects } from '@/data/projects';
import { caseStudy } from '@/data/case-study';
import { discarded } from '@/data/discarded';
import { BUILT_SUMMARY } from '@/data/tips';
import DiscardedDetail from './discarded-detail';

/**
 * The portfolio as a plain document.
 *
 * This is the page the server sends. Before it existed the response body was
 * an empty div: every word of the work history, the projects and the stack
 * only appeared after ~266KB of JavaScript had run, so anything that does not
 * execute scripts — ATS scrapers, social preview bots, LLM crawlers — saw a
 * blank portfolio. Now the content ships in the HTML and the desktop shell is
 * the enhancement on top of it.
 *
 * It is also the narrow-screen experience outright, which is why the sections
 * are `<details>`: native collapsing needs no JavaScript, so the whole page
 * works with scripting switched off.
 */

function Section({
	icon,
	title,
	subtitle,
	children,
	open,
}: {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	open?: boolean;
}) {
	return (
		<details className='mb-card' open={open}>
			<summary className='mb-card-head'>
				<span className='mb-card-icon' aria-hidden='true'>
					{icon}
				</span>
				<span className='mb-card-title'>
					<strong>{title}</strong>
					<small>{subtitle}</small>
				</span>
				<LiChevronDown size={18} aria-hidden='true' />
			</summary>
			<div className='mb-card-body'>{children}</div>
		</details>
	);
}

export default function PortfolioDocument() {
	const years = yearsOfExperience();
	const [ny, nm] = profile.nowUpdated.split('-').map(Number);
	const nowStamp = new Date(ny, nm - 1, 1).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});

	return (
		<main className='mb-shell doc' id='main'>
			<PrintExpander />
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
						<LiMapPin size={12} aria-hidden='true' />
						{profile.location}
						<span className='mb-dot' aria-hidden='true' />
						{profile.availability}
					</p>
				</div>
				<ThemeToggle />
			</header>

			<p className='mb-headline'>{profile.headline}</p>
			<p className='mb-summary'>{profile.proof}</p>

			<div className='mb-actions'>
				<a
					className='fl-btn fl-btn-accent'
					href={profile.cvView}
					target='_blank'
					rel='noopener noreferrer'>
					<LiDownload size={15} aria-hidden='true' /> Resume
				</a>
				<a className='fl-btn fl-btn-standard' href={`mailto:${profile.email}`}>
					<LiMail size={15} aria-hidden='true' /> Email
				</a>
			</div>

			{/* This used to name what the reader was missing and stop there,
			    which is an apology. The sentence from tips.ts says what the thing
			    actually is, and cannot drift from what Tips ▸ How it's built says
			    inside the shell. */}
			<p className='mb-note'>{BUILT_SUMMARY}</p>

			{/* First, because it is the only section that answers "and today?" */}
			<Section
				icon={<Radar size={17} />}
				title='Now'
				subtitle={`Updated ${nowStamp}`}
				open>
				<dl className='mb-now'>
					{profile.now.map((n) => (
						<div key={n.label}>
							<dt>{n.label}</dt>
							<dd>{n.text}</dd>
						</div>
					))}
				</dl>
			</Section>

			<Section
				icon={<LiBriefcase size={17} />}
				title='Experience'
				subtitle={`${experiences.length} roles · ${years} years`}
				open>
				<ol className='mb-roles'>
					{experiences.map((e) => (
						<li key={e.company}>
							<h3>{e.role}</h3>
							<span className='mb-company'>{e.company}</span>
							<span className='mb-period'>
								{e.period} · {tenureLabel(e)} · {e.location}
							</span>
							{e.stats.length > 0 && (
								<ul className='mb-stats'>
									{e.stats.map((s) => (
										<li key={s.label}>
											<strong>{s.value}</strong>
											<span>{s.label}</span>
										</li>
									))}
								</ul>
							)}
							<p>{e.description}</p>
							<ul className='mb-points'>
								{e.achievements.map((a) => (
									<li key={a}>{a}</li>
								))}
							</ul>
							<span className='mb-tech'>{e.tech.join(' · ')}</span>
						</li>
					))}
				</ol>
			</Section>

			{/* The deepest technical content on the site, so it ships in the
			    response body rather than behind the shell. */}
			<Section
				icon={<FileCode2 size={17} />}
				title='Case study'
				subtitle={`${caseStudy.at} · ${caseStudy.period}`}>
				<h3 className='mb-cs-title'>{caseStudy.title}</h3>
				<CaseStudyBody />
			</Section>

			<Section
				icon={<LiLayers size={17} />}
				title='Skills'
				subtitle={`${skills.length} tools across ${SKILL_CATEGORIES.length} categories`}>
				{SKILL_CATEGORIES.map((c) => (
					<div key={c.key} className='mb-skill-group'>
						<h3>{c.key}</h3>
						<dl className='mb-skills'>
							{skills
								.filter((s) => s.category === c.key)
								.sort((a, b) => b.years - a.years)
								.map((s) => (
									<div key={s.name}>
										<dt>{s.name}</dt>
										<dd>{s.note}</dd>
									</div>
								))}
						</dl>
					</div>
				))}
			</Section>

			<Section
				icon={<FolderGit2 size={17} />}
				title='Projects'
				subtitle={`${projects.length} selected`}>
				<ul className='mb-projects'>
					{projects.map((p) => (
						<li key={p.id}>
							<span
								className='mb-project-dot'
								style={{ background: p.color }}
								aria-hidden='true'
							/>
							<div>
								<h3>{p.name}</h3>
								<span className='mb-badge' data-type={p.type}>
									{p.type === 'real' ? 'Production' : 'Case study'}
								</span>
								<p>{p.description}</p>
								<span className='mb-tech'>{p.tech.join(' · ')}</span>
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
			</Section>

			{/* Absent from this document until now, so a phone, a crawler and a
			    printed page all saw a portfolio with no reversals in it. Closed by
			    default because it is long; print-expander opens it for print. */}
			<Section
				icon={<Undo2 size={17} />}
				title='Decisions reversed'
				subtitle={`${discarded.length} things built and thrown away`}>
				<ol className='mb-discarded'>
					{discarded.map((d) => (
						<li key={d.name}>
							<DiscardedDetail item={d} />
						</li>
					))}
				</ol>
			</Section>

			<footer className='mb-foot'>
				<a href={`mailto:${profile.email}`}>
					<LiMail size={16} aria-hidden='true' /> {profile.email}
				</a>
				<a href={profile.github} target='_blank' rel='noopener noreferrer'>
					<LiGithub size={16} aria-hidden='true' /> GitHub
				</a>
				<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
					<LiLinkedin size={16} aria-hidden='true' /> LinkedIn
				</a>
			</footer>
		</main>
	);
}
