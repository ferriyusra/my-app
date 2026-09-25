import { LiArrowRight } from '@/components/icons/line-icons';
import { careerSince } from '@/data/profile';
import { experiences, tenureLabel, type Experience } from '@/data/experience';
import { career, levels } from '@/data/career-game';
import { caseStudy, caseStudyLength } from '@/data/case-study';
import { roleSlug } from '@/lib/story';
import SectionHead from './section-head';

/** Achievements shown before the fold; the rest open on request. */
const SHOWN = 3;

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/**
 * The career: the whole of it at once, then each role in turn.
 *
 * The bar comes first so the shape reads before a word does — each segment as
 * wide as the months that role lasted, from `levels()`, the same numbers
 * Career.exe and the Experience window draw. Not strictly to scale: a floor in
 * CSS keeps the four-month role wide enough to label, so the ordering and the
 * rough proportions are the honest part. On a wide screen it stays pinned
 * under the nav while the chapters pass beneath it.
 *
 * The chapters run newest first, the way a CV does, because the reader is
 * usually checking the current role against a job description.
 */
export default function Career() {
	const { months, roles } = career();
	const chrono = levels();
	/* Every role so far was in one city; say it once rather than five times,
	   and only while it stays true. */
	const places = [...new Set(experiences.map((e) => e.location))];
	const count = WORDS[roles] ?? String(roles);

	return (
		<section id='career' className='sy-section' aria-labelledby='career-title'>
			<div className='sy-wrap'>
				<SectionHead
					id='career'
					title={`${count} roles since ${careerSince('year')}`}
					meta={[`${months} months in role`, `since ${careerSince()}`, places.length === 1 ? places[0] : null]
						.filter(Boolean)
						.join(' · ')}
				/>
			</div>

			<div className='sy-tl-wrap'>
				<div className='sy-wrap'>
					<ol className='sy-tl' aria-label={`The ${count.toLowerCase()} roles, oldest first, sized by how long each lasted`}>
						{chrono.map((l, i) => (
							<li
								key={l.exp.company}
								style={{ flexGrow: l.months, ['--i' as string]: i }}
								data-current={l.exp.current || undefined}
								data-sy-seg={roleSlug(l.exp)}>
								<a href={`#${roleSlug(l.exp)}`}>
									<span className='sy-tl-name'>{l.exp.short}</span>
									<span className='sy-tl-when'>{tenureLabel(l.exp)}</span>
								</a>
							</li>
						))}
					</ol>
					<p className='sy-tl-axis' aria-hidden='true'>
						<span>{careerSince()}</span>
						<span>now</span>
					</p>
				</div>
			</div>

			<ol className='sy-wrap sy-roles'>
				{experiences.map((e) => (
					<RoleChapter key={e.company} e={e} />
				))}
			</ol>
		</section>
	);
}

function RoleChapter({ e }: { e: Experience }) {
	const shown = e.achievements.slice(0, SHOWN);
	const rest = e.achievements.slice(SHOWN);
	/* The join that sends the reader from the role to the write-up it
	   produced. By name, so `data.test.ts` pins it. */
	const carriesCase = e.short === caseStudy.at;

	return (
		<li id={roleSlug(e)} className='sy-role' data-current={e.current || undefined}>
			<div className='sy-role-rail'>
				<p className='sy-role-period'>{e.period}</p>
				<p className='sy-role-tenure'>{tenureLabel(e)}</p>
				<p className='sy-role-company'>{e.company}</p>
				{/* Kept per role even while every role shares it: a chapter is
				    read on its own, and a print may start mid-list. */}
				<p className='sy-role-place'>{e.location}</p>
			</div>

			<div className='sy-role-body'>
				<h3>
					{e.role}
					<span className='sy-role-at'> · {e.short}</span>
					{e.current && <span className='sy-badge'>Current</span>}
				</h3>

				{e.stats.length > 0 && (
					<ul className='sy-stats'>
						{e.stats.map((s) => (
							<li key={s.label}>
								<strong>{s.value}</strong>
								<span>{s.label}</span>
							</li>
						))}
					</ul>
				)}

				{e.highlights.length > 0 && (
					<ul className='sy-hl'>
						{e.highlights.map((h) => (
							<li key={h}>{h}</li>
						))}
					</ul>
				)}

				<p className='sy-role-desc'>{e.description}</p>

				<ul className='sy-points'>
					{shown.map((a) => (
						<li key={a}>{a}</li>
					))}
				</ul>
				{rest.length > 0 && (
					<details className='sy-more'>
						<summary>
							{rest.length} more outcome{rest.length > 1 ? 's' : ''}
						</summary>
						<ul className='sy-points'>
							{rest.map((a) => (
								<li key={a}>{a}</li>
							))}
						</ul>
					</details>
				)}

				<ul className='sy-tech' aria-label='Stack'>
					{e.tech.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>

				{carriesCase && (
					<a className='sy-deep' href='#case-study'>
						<span className='sy-deep-kicker'>Case study from this role</span>
						<strong>{caseStudy.title}</strong>
						<span className='sy-deep-meta'>
							{caseStudyLength().sections} sections · about {caseStudyLength().minutes} min
							<LiArrowRight size={15} />
						</span>
					</a>
				)}
			</div>
		</li>
	);
}
