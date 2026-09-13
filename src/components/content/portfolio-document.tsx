import { DocumentIcon, LiChevronDown, LiDownload, LiGithub, LiLinkedin, LiMail, LiMapPin } from '@/components/icons/line-icons';
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
 * The portfolio as plain semantic HTML, in the response body.
 *
 * This is the whole experience below 900px and with scripting off, and it is
 * what a crawler, an ATS and a printer see. It is a server component and must
 * stay one: before it existed the response body was an empty div.
 *
 * The arrangement is a spine. The five roles run newest-first down one rule,
 * and the case study is rendered *inside* the role that produced it rather
 * than filed after it — everything in `case-study.ts` traces to that entry, so
 * a reader meets the depth while reading the role, not by finding a second
 * section. What replaced: six collapsed `<details>` of equal weight, in which
 * the case study and the reversed decisions — the two things a neighbouring
 * portfolio cannot copy — each sat behind a tap, below four other headings.
 */

/**
 * A heading with its own rule and a count beside it.
 *
 * The sections used to be `<strong>` inside a `<summary>`, which reads as bold
 * text to a screen reader rather than as a landmark. These are real `h2`s, so
 * the document has an outline: name, section, role, case study.
 */
function Head({ title, meta, id }: { title: string; meta: string; id: string }) {
	return (
		<h2 className='mb-rule-h' id={id}>
			{title} <span>{meta}</span>
		</h2>
	);
}

/**
 * Reference material that stays collapsible.
 *
 * The rule: the spine and the reversals are the argument and are always open;
 * Skills and Projects are lookup, and a reader opens them when they want them.
 * Still native `<details>`, so it collapses with no JavaScript, and
 * `PrintExpander` opens it for print.
 */
function Fold({
	id,
	title,
	meta,
	children,
}: {
	/** An anchor for the jump row; the fold need not open to be reached. */
	id: string;
	title: string;
	meta: string;
	children: React.ReactNode;
}) {
	return (
		<details className='mb-fold' id={id}>
			<summary className='mb-fold-head'>
				<h2>
					{title} <span>{meta}</span>
				</h2>
				<LiChevronDown size={18} aria-hidden='true' />
			</summary>
			<div className='mb-fold-body'>{children}</div>
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
					{/* "Available" has an object here. The long form stays in Now;
					    on a phone that section is eight screens down. */}
					<p className='mb-open'>{profile.openTo}</p>
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
					<DocumentIcon size={15} /> Resume
				</a>
				{/* This surface has no right-click menu to hide a Save behind, and
				    it is the one a phone and a scripting-disabled browser get. */}
				<a
					className='fl-btn fl-btn-standard'
					href={profile.cvDownload}
					target='_blank'
					rel='noopener noreferrer'>
					<LiDownload size={15} aria-hidden='true' /> Download
				</a>
				<a className='fl-btn fl-btn-standard' href={`mailto:${profile.email}`}>
					<LiMail size={15} aria-hidden='true' /> Email
				</a>
			</div>

			{/* The document is ten screens long on a phone. Five anchors, so a
			    reader who came for the reversals need not scroll through five
			    roles to reach them. Plain links: they work with scripting off,
			    which is the whole point of this rendering. */}
			<nav className='mb-jump' aria-label='Sections'>
				<a href='#doc-exp'>Experience</a>
				<a href='#doc-now'>Now</a>
				<a href='#doc-skills'>Skills</a>
				<a href='#doc-projects'>Projects</a>
				<a href='#doc-rev'>Decisions reversed</a>
			</nav>

			<section aria-labelledby='doc-exp'>
				<Head
					title='Experience'
					meta={`${experiences.length} roles · ${years} years`}
					id='doc-exp'
				/>
				<ol className='mb-spine'>
					{experiences.map((e) => {
						/* The join that puts the case study inside its own role. It is
						   by name, so it fails silently if either side is renamed —
						   which is why `data.test.ts` pins it. */
						const carriesCase = e.short === caseStudy.at;
						return (
							<li key={e.company} data-current={e.current || undefined}>
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
								{e.highlights.length > 0 && (
									<ul className='mb-highlights'>
										{e.highlights.map((h) => (
											<li key={h}>{h}</li>
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

								{carriesCase && (
									<div className='mb-case'>
										<h4 className='mb-cs-title'>{caseStudy.title}</h4>
										<CaseStudyBody level={5} idPrefix='doc-cs' />
									</div>
								)}
							</li>
						);
					})}
				</ol>
			</section>

			{/* After the spine, not before it. Above the actions it pushed the
			    first role past the fold on every phone once browser chrome is
			    counted, and the first viewport is the one thing the direction
			    contract spends on the career. Here it closes the reverse-
			    chronological run — the last role read is the current one, and this
			    says what that role is doing this month. Availability already
			    appears in the header, so nothing above the fold was lost. */}
			<section aria-labelledby='doc-now'>
				<Head title='Now' meta={`Updated ${nowStamp}`} id='doc-now' />
				<dl className='mb-now'>
					{profile.now.map((n) => (
						<div key={n.label}>
							<dt>{n.label}</dt>
							<dd>{n.text}</dd>
						</div>
					))}
				</dl>
			</section>

			<Fold
				id='doc-skills'
				title='Skills'
				meta={`${skills.length} tools · ${SKILL_CATEGORIES.length} categories`}>
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
			</Fold>

			<Fold id='doc-projects' title='Projects' meta={`${projects.length} selected`}>
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
			</Fold>

			{/* Open, not folded. PRODUCT.md calls this the thing a neighbouring
			    portfolio cannot truthfully copy; it spent one release behind a tap
			    and before that was absent from the document altogether. */}
			<section aria-labelledby='doc-rev'>
				<Head
					title='Decisions reversed'
					meta={`${discarded.length} things built and thrown away`}
					id='doc-rev'
				/>
				<ol className='mb-discarded'>
					{discarded.map((d) => (
						<li key={d.name}>
							<DiscardedDetail item={d} />
						</li>
					))}
				</ol>
			</section>

			{/* An aside about the other rendering, so it sits after the evidence
			    rather than in front of it: between the actions and the career it
			    cost 200px of the one viewport that has to carry the spine. */}
			<p className='mb-note'>{BUILT_SUMMARY}</p>

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
