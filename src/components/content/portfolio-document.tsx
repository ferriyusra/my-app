import { DocumentIcon, LiChevronDown, LiDownload, LiGithub, LiLinkedin, LiMail, LiMapPin } from '@/components/icons/line-icons';
import ThemeToggle from './theme-toggle';
import PrintExpander from './print-expander';
import CaseStudyBody from './case-study-body';
import { profile, careerSince } from '@/data/profile';
import { experiences, tenureLabel } from '@/data/experience';
import { SKILL_CATEGORIES, skills } from '@/data/skills';
import { projects, projectKind } from '@/data/projects';
import { caseStudy } from '@/data/case-study';
import { discarded } from '@/data/discarded';
import { BUILT_SUMMARY } from '@/data/tips';
import DiscardedDetail, { when } from './discarded-detail';
import { bySkillEvidence } from '@/lib/skill-evidence';
import NoteBody from './note-body';
import { TOPICS, plannedNotes, writtenNotes } from '@/data/notes';

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
/** An anchor for one role, from its short name: "INA Digital" → "role-ina-digital". */
const roleId = (short: string) =>
	'role-' + short.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
	const written = writtenNotes();
	const planned = plannedNotes();
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

			{/* The same words as the About window's buttons, so a reader who
			    meets both renderings meets one set of labels. */}
			<div className='mb-actions'>
				<a
					className='fl-btn fl-btn-accent'
					href={profile.cvView}
					target='_blank'
					rel='noopener noreferrer'>
					<DocumentIcon size={15} /> View CV
				</a>
				{/* This surface has no right-click menu to hide a Save behind, and
				    it is the one a phone and a scripting-disabled browser get. */}
				<a
					className='fl-btn fl-btn-standard'
					href={profile.cvDownload}
					target='_blank'
					rel='noopener noreferrer'>
					<LiDownload size={15} aria-hidden='true' /> Download PDF
				</a>
				<a className='fl-btn fl-btn-standard' href={`mailto:${profile.email}`}>
					<LiMail size={15} aria-hidden='true' /> Email
				</a>
			</div>

			{/* The document is ten screens long on a phone. Anchors, so a reader
			    who came for the reversals need not scroll through five roles to
			    reach them. Plain links: they work with scripting off, which is
			    the whole point of this rendering. The ids are plain words, so a
			    shared link reads as what it opens: /#case-study. */}
			<nav className='mb-jump' aria-label='Sections'>
				<a href='#experience'>Experience</a>
				<a href='#case-study'>Case study</a>
				<a href='#now'>Now</a>
				<a href='#skills'>Skills</a>
				<a href='#projects'>Projects</a>
				{written.length > 0 && <a href='#notes'>Notes</a>}
				<a href='#decisions'>Decisions reversed</a>
			</nav>

			<section aria-labelledby='experience'>
				<Head
					title='Experience'
					meta={`${experiences.length} roles · since ${careerSince('year')}`}
					id='experience'
				/>
				<ol className='mb-spine'>
					{experiences.map((e, i) => {
						/* The join that puts the case study inside its own role. It is
						   by name, so it fails silently if either side is renamed —
						   which is why `data.test.ts` pins it. */
						const carriesCase = e.short === caseStudy.at;
						const next = experiences[i + 1];
						return (
							<li
								key={e.company}
								id={roleId(e.short)}
								data-current={e.current || undefined}>
								<h3>{e.role}</h3>
								<span className='mb-company'>{e.company}</span>
								{/* No duration on the current role: this page is built once
								    and then served as it was, so a computed tenure would
								    freeze on deploy day while the desktop's went on
								    counting. "Present" never goes stale. */}
								<span className='mb-period'>
									{e.current
										? `${e.period} · ${e.location}`
										: `${e.period} · ${tenureLabel(e)} · ${e.location}`}
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

								{/* The way past the depth, where a reader gets stuck. The
								    case study stays inside its role and open; on a 390px
								    phone it is 6,400px long, and the next role — SATUSEHAT,
								    the biggest name in the proof line — started ten
								    screens down with nothing pointing at it. Derived from
								    the next entry, so it cannot name the wrong role. */}
								{carriesCase && next && (
									<a className='mb-skip' href={`#${roleId(next.short)}`}>
										Skip the case study: next role, {next.short}, {next.period.split(' — ')[0]}
									</a>
								)}
								{carriesCase && (
									<div className='mb-case' id='case-study'>
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
			<section aria-labelledby='now'>
				<Head title='Now' meta={`Updated ${nowStamp}`} id='now' />
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
				id='skills'
				title='Skills'
				meta={`${skills.length} tools · ${SKILL_CATEGORIES.length} categories`}>
				{SKILL_CATEGORIES.map((c) => (
					<div key={c.key} className='mb-skill-group'>
						<h3>{c.key}</h3>
						<dl className='mb-skills'>
							{skills
								.filter((s) => s.category === c.key)
								.sort(bySkillEvidence)
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

			<Fold id='projects' title='Projects' meta={`${projects.length} selected`}>
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
									{projectKind(p)}
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
											{p.demoLabel ?? 'Live demo'}
										</a>
									)}
									{/* The one production system with a write-up had no link
									    at all here, while coursework carried two. */}
									{p.id === caseStudy.project && (
										<a href='#case-study'>Read the case study</a>
									)}
								</span>
							</div>
						</li>
					))}
				</ul>
			</Fold>

			{/* Written notes only, and the fold only when there are some: a
			    section of promises is the "Coming soon" page this repository
			    deleted. The plan lives in the Notes window, where it is a study
			    log rather than a claim in the middle of the evidence. */}
			{written.length > 0 && (
				<Fold
					id='notes'
					title='Notes'
					meta={`${written.length} written up`}>
					<ol className='mb-notes'>
						{written.map((n) => (
							<li key={n.slug}>
								<NoteBody note={n} />
							</li>
						))}
					</ol>
					{planned.length > 0 && (
						<p className='mb-note'>
							Also on the plan:{' '}
							{planned
								.map((n) => `${n.title} (${TOPICS[n.topic]}, ${when(n.target)})`)
								.join('; ')}
							.
						</p>
					)}
				</Fold>
			)}

			{/* Open, not folded. PRODUCT.md calls this the thing a neighbouring
			    portfolio cannot truthfully copy; it spent one release behind a tap
			    and before that was absent from the document altogether. */}
			<section aria-labelledby='decisions'>
				<Head
					title='Decisions reversed'
					meta={`${discarded.length} things built and thrown away`}
					id='decisions'
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

			<footer className='mb-foot' id='contact'>
				<a href={`mailto:${profile.email}`}>
					<LiMail size={16} aria-hidden='true' /> {profile.email}
				</a>
				<a href={profile.github} target='_blank' rel='noopener noreferrer'>
					<LiGithub size={16} aria-hidden='true' /> GitHub
				</a>
				<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
					<LiLinkedin size={16} aria-hidden='true' /> LinkedIn
				</a>
				<a href={profile.repo} target='_blank' rel='noopener noreferrer'>
					<LiGithub size={16} aria-hidden='true' /> This site&rsquo;s source
				</a>
			</footer>
		</main>
	);
}
