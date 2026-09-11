import { caseStudy } from '@/data/case-study';

/**
 * No 'use client' on purpose: the server document renders this into the
 * response body, and the Experience window renders the same component inside
 * the shell. One implementation, so the two never drift.
 */

/** The only markup the case-study prose uses is **bold** for service names. */
function emphasise(text: string) {
	return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
		part.startsWith('**') && part.endsWith('**') ? (
			<strong key={i}>{part.slice(2, -2)}</strong>
		) : (
			part
		),
	);
}

/**
 * `level` is the heading level of the write-up's own sections.
 *
 * It defaults to 4, which is right where a window renders the case study under
 * an `h3` title. The document nests it one deeper — the write-up lives inside
 * the Meditap role there, under that role's `h3` and its own `h4` title — so
 * without this the title and the sections it introduces would be siblings.
 */
export default function CaseStudyBody({ level = 4 }: { level?: 4 | 5 }) {
	const H = (level === 5 ? 'h5' : 'h4') as 'h4' | 'h5';
	return (
		<div className='cs'>
			<p className='cs-summary'>{caseStudy.summary}</p>

			<ul className='cs-stack'>
				{caseStudy.stack.map((t) => (
					<li key={t}>{t}</li>
				))}
			</ul>

			{caseStudy.sections.map((s) => (
				<section key={s.heading} className='cs-section'>
					<H>{s.heading}</H>
					{s.body.map((para, i) => (
						<p key={i}>{emphasise(para)}</p>
					))}
				</section>
			))}

			<section className='cs-section cs-open'>
				<H>What this write-up does not answer</H>
				<p>
					These are the questions a reader with production experience would ask
					next. They are listed rather than glossed over, because a case study
					with no visible edges is a brochure.
				</p>
				<ul>
					{caseStudy.openQuestions.map((q) => (
						<li key={q}>{q}</li>
					))}
				</ul>
			</section>
		</div>
	);
}
