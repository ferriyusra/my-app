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

export default function CaseStudyBody() {
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
					<h4>{s.heading}</h4>
					{s.body.map((para, i) => (
						<p key={i}>{emphasise(para)}</p>
					))}
				</section>
			))}

			<section className='cs-section cs-open'>
				<h4>What this write-up does not answer</h4>
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
