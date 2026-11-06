import Link from 'next/link';
import { caseStudy } from '@/data/case-study';
import { caseFor } from '@/data/cases';
import { experiences, tenureLabel } from '@/data/experience';
import { CAREER_START, yearsOfExperience } from '@/data/profile';
import { countWord, monthLong, monthShort, rangeLabel } from '@/lib/dates';
import { prose, slug } from '@/lib/text';
import Question from './question';

/**
 * The places worked, as a drawing register on the darker sheet: first the
 * whole career as a dimension string, its two real ends (the first month and
 * now) and its length set above it, then five rows, newest first, each a
 * disclosure. The row is the register line (the dates, the place, the role,
 * how long, and the role's first figure where it has one); opening it gives
 * the highlights, the full description and everything done there. All of it is
 * in the HTML for a crawler and a printer.
 */
export default function Roles() {
	const years = yearsOfExperience();
	return (
		<Question
			id='work'
			tone='band'
			question={`Work, ${countWord(experiences.length).toLowerCase()} teams since ${CAREER_START.slice(0, 4)}`}
			answer='Backend, in Jakarta, newest first.'>
			<div className='dim' role='img' aria-label={`${years} years, ${monthLong(CAREER_START)} to now`} data-reveal>
				<span className='dim__value' aria-hidden='true'>
					{years} years
				</span>
				<span className='dim__line' aria-hidden='true' />
				<span className='dim__end num' aria-hidden='true'>
					{monthShort(CAREER_START)}
				</span>
				<span className='dim__end dim__end--now num' aria-hidden='true'>
					Now
				</span>
			</div>
			<ol className='rows'>
				{experiences.map((e) => {
					const fig = e.stats[0];
					const study = caseFor(e.short);
					return (
						<li key={e.company} id={`role-${slug(e.short)}`} className='row' data-reveal>
							<details className='row__details'>
								<summary className='row__sum'>
									<h3 className='row__name' data-current={e.current || undefined}>
										{e.short}
									</h3>
									<span className='row__meta'>
										{e.role}, {tenureLabel(e)}
										{fig && (
											<>
												{'. '}
												<strong className='row__fig'>{fig.value}</strong> {fig.label}
											</>
										)}
									</span>
									<span className='row__when'>{rangeLabel(e.startISO, e.endISO)}</span>
								</summary>
								<div className='row__body'>
									<p className='row__lead'>{e.company}</p>
									{e.stats.length > 1 && (
										<dl className='figs'>
											{e.stats.map((s) => (
												<div key={s.label}>
													<dt>{s.label}</dt>
													<dd>{s.value}</dd>
												</div>
											))}
										</dl>
									)}
									<ul className='marks'>
										{e.highlights.map((h) => (
											<li key={h}>{prose(h)}</li>
										))}
									</ul>
									<p>{prose(e.description)}</p>
									<ul className='marks'>
										{e.achievements.map((a) => (
											<li key={a}>{prose(a)}</li>
										))}
									</ul>
									<p className='row__stack'>Stack: {e.tech.join(', ')}</p>
									{/* A role with a case study links to it, by the `at` join
									    in cases.ts that data.test.ts pins. */}
									{study && (
										<p className='row__links'>
											<Link href={study.href}>Read the case study</Link>
										</p>
									)}
								</div>
							</details>
						</li>
					);
				})}
			</ol>
			{/* The current role's case study, hung under the register the way the
			    SATUSEHAT one hangs under its captures. */}
			<div className='q__links' data-reveal>
				<Link className='btn btn--secondary' href={`/${caseStudy.slug}`}>
					Read the {caseStudy.at} case study
				</Link>
			</div>
		</Question>
	);
}
