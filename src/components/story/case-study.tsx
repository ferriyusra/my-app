import CaseStudyBody from '@/components/content/case-study-body';
import { caseStudy } from '@/data/case-study';
import SectionHead from './section-head';
import RunFigure from './run-figure';

/**
 * The one production system written up at depth, given a section of its own.
 *
 * It used to sit inside the Meditap role, folded; here it is the second thing
 * the story says, straight after the career that produced it. The prose is
 * `CaseStudyBody` — the same component the Experience window renders, so the
 * two cannot drift — with its figure swapped for the story's scroll-told one.
 * Its sections are `h3`s under this section's `h2`, and their ids live under
 * `write-up-` so they stay clear of the story's own anchors.
 */
export default function CaseStudy() {
	return (
		<section id='case-study' className='sy-section sy-case' aria-labelledby='case-study-title'>
			<div className='sy-wrap'>
				<SectionHead
					id='case-study'
					title={caseStudy.title}
					meta={`${caseStudy.at} · ${caseStudy.period}`}
				/>
				<CaseStudyBody level={3} idPrefix='write-up' figure={<RunFigure />} />
			</div>
		</section>
	);
}
