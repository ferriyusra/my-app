import type { Metadata } from 'next';
import { caseStudy, caseStudyLength } from '@/data/case-study';
import Masthead from '@/components/site/masthead';
import SiteFooter from '@/components/site/site-footer';
import CaseStudyBody from '@/components/content/case-study-body';
import { label, prose } from '@/lib/text';

export const metadata: Metadata = {
	title: caseStudy.title,
	description: caseStudy.summary,
	alternates: { canonical: '/deposit-alerting' },
};

/**
 * The case study as a long document: the author's own write-up, transcribed
 * into `case-study.ts` and pinned to the Markdown by `case-study.test.ts`.
 *
 * The letter's single column at a reading measure; code, the table and the
 * diagram widen past it, because they are exhibits rather than prose. The
 * front matter is a definition list, not a meta string.
 */
export default function DepositAlerting() {
	const length = caseStudyLength();

	return (
		<>
			<Masthead base='/' />
			<main id='main'>
				<header className='doc__head'>
					<div className='container doc__grid'>
						<div className='doc__text'>
							<h1>{caseStudy.title}</h1>
							<p className='lead'>{prose(caseStudy.summary)}</p>
						</div>
						{/* The front matter on the ultramarine field, from the column-9
						    line to the bleed, as the home page's first sheet hangs its figure. */}
						<dl className='facts doc__field'>
								<div>
									<dt>Where</dt>
									<dd>
										{caseStudy.at}, <span className='measured'>{label(caseStudy.year)}</span>
									</dd>
								</div>
								<div>
									<dt>Role</dt>
									<dd>{label(caseStudy.role)}</dd>
								</div>
								<div>
									<dt>Domain</dt>
									<dd>{caseStudy.domain}</dd>
								</div>
								<div>
									<dt>Stack</dt>
									<dd>{caseStudy.stack.join(', ')}</dd>
								</div>
								<div>
									<dt>Length</dt>
									<dd>
										{length.sections} sections, about {length.minutes} minutes
									</dd>
								</div>
								<div>
									<dt>Source</dt>
									<dd>
										<a href={caseStudy.source}>The original Markdown</a>
									</dd>
								</div>
						</dl>
					</div>
				</header>

				<div className='container'>
					<CaseStudyBody />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
