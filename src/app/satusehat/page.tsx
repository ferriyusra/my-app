import type { Metadata } from 'next';
import { docLength, sectionsText } from '@/data/case-study';
import { experiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { satusehat } from '@/data/satusehat';
import Masthead from '@/components/site/masthead';
import SiteFooter from '@/components/site/site-footer';
import CaseStudyBody from '@/components/content/case-study-body';
import { rangeLabel } from '@/lib/dates';
import { label, prose } from '@/lib/text';

export const metadata: Metadata = {
	title: satusehat.title,
	description: prose(satusehat.summary),
	alternates: { canonical: `/${satusehat.slug}` },
};

/**
 * The SATUSEHAT work as a rough case study, in the same document as
 * `/deposit-alerting`: a head with its front matter on the ultramarine field,
 * then the sections and what the page does not record.
 *
 * The dates, the roles and the live link are derived from `experience.ts` and
 * `projects.ts`, so the page cannot disagree with the Work rows. There is no
 * write-up behind it; the source line says so.
 */
export default function Satusehat() {
	const roles = satusehat.at
		.map((short) => experiences.find((e) => e.short === short))
		.filter((e) => e !== undefined);
	const first = roles[0];
	const last = roles[roles.length - 1];
	const live = projects.find((p) => p.id === satusehat.projects[0])?.demo;
	const length = docLength(
		[satusehat.title, satusehat.summary, ...sectionsText(satusehat.sections), ...satusehat.openQuestions],
		satusehat.sections.length,
	);

	return (
		<>
			<Masthead base='/' />
			<main id='main'>
				<header className='doc__head'>
					<div className='container doc__grid'>
						<div className='doc__text'>
							<h1>{satusehat.title}</h1>
							<p className='lead'>{prose(satusehat.summary)}</p>
						</div>
						<dl className='facts doc__field'>
							<div>
								<dt>Where</dt>
								<dd>{roles.map((r) => r.short).join(', then ')}</dd>
							</div>
							{first && last && (
								<div>
									<dt>When</dt>
									<dd>
										<span className='measured'>{rangeLabel(first.startISO, last.endISO)}</span>
									</dd>
								</div>
							)}
							<div>
								<dt>Role</dt>
								<dd>{label([...new Set(roles.map((r) => r.role))].join(', then '))}</dd>
							</div>
							<div>
								<dt>Stack</dt>
								<dd>{satusehat.stack.join(', ')}</dd>
							</div>
							<div>
								<dt>Length</dt>
								<dd>
									{length.sections} sections, about {length.minutes} minutes
								</dd>
							</div>
							{live && (
								<div>
									<dt>Live</dt>
									<dd>
										<a href={live} target='_blank' rel='noopener noreferrer'>
											SATUSEHAT Data
										</a>
									</dd>
								</div>
							)}
							<div>
								<dt>Source</dt>
								<dd>Written from memory in November 2026; no write-up was kept</dd>
							</div>
						</dl>
					</div>
				</header>

				<div className='container'>
					<CaseStudyBody
						doc={satusehat}
						edge={{
							nav: 'What it does not record',
							heading: 'What this does not record',
							intro:
								'This page was written from memory after the work ended, so it is rough on purpose. These are the questions a reader would ask next that I no longer have the detail for. They are listed rather than answered with a plausible guess.',
						}}
					/>
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
