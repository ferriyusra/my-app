import Image from 'next/image';
import { Fragment } from 'react';
import { LiArrowRight } from '@/components/icons/line-icons';
import { projects, type Project } from '@/data/projects';
import { caseStudy } from '@/data/case-study';
import { tokenize } from '@/lib/highlight';
import ExtArrow from './ext-arrow';
import SectionHead from './section-head';

/** Lines of the write-up's Go shown on the card that has no screenshot. */
const COVER_LINES = 14;

/**
 * A link's name, from where it goes. A `demo` that is a paper is not a demo,
 * and a `github` that is an issue page is not "the source".
 */
function linkLabel(url: string, kind: 'github' | 'demo'): string {
	if (kind === 'github') return 'GitHub';
	return /researchgate\.net/.test(url) ? 'Paper' : 'Live';
}

/**
 * The cover for the one production system with no screenshot: the opening of
 * its own decision function, from the write-up. Real code rather than a stock
 * illustration, and decoration here — the whole function is in the case study,
 * so this copy is hidden from assistive tech.
 */
function CodeCover() {
	const code = caseStudy.sections
		.flatMap((s) => s.body)
		.find((b) => typeof b !== 'string' && b.kind === 'code' && b.lang === 'go');
	if (!code || typeof code === 'string' || code.kind !== 'code') return null;
	const lines = code.text.split('\n').slice(0, COVER_LINES);
	return (
		<pre className='sy-card-code' aria-hidden='true'>
			<code>
				{lines.map((line, i) => (
					<Fragment key={i}>
						{tokenize(line, 'go').map((t, j) =>
							t.cls ? (
								<span key={j} className={t.cls}>
									{t.text}
								</span>
							) : (
								<Fragment key={j}>{t.text}</Fragment>
							),
						)}
						{'\n'}
					</Fragment>
				))}
			</code>
		</pre>
	);
}

function ProductionCard({ p }: { p: Project }) {
	const isCase = p.id === caseStudy.project;
	return (
		<li className='sy-card'>
			<div className='sy-card-cover'>
				{p.cover ? (
					<Image
						src={p.cover}
						alt={`Screenshot of ${p.name}`}
						fill
						sizes='(min-width: 1100px) 360px, (min-width: 700px) 50vw, 100vw'
					/>
				) : isCase ? (
					<CodeCover />
				) : (
					<span className='sy-card-initial' aria-hidden='true'>
						{p.initial}
					</span>
				)}
			</div>
			<div className='sy-card-body'>
				<p className='sy-card-kind'>Production</p>
				<h3>{p.name}</h3>
				<p className='sy-card-desc'>{p.description}</p>
				<ul className='sy-tech' aria-label='Stack'>
					{p.tech.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
				<p className='sy-card-links'>
					{isCase && (
						<a href='#case-study'>
							Read the case study <LiArrowRight size={14} />
						</a>
					)}
					{p.demo && (
						<a href={p.demo} target='_blank' rel='noopener noreferrer'>
							{linkLabel(p.demo, 'demo')} <ExtArrow />
						</a>
					)}
					{p.github && (
						<a href={p.github} target='_blank' rel='noopener noreferrer'>
							{linkLabel(p.github, 'github')} <ExtArrow />
						</a>
					)}
				</p>
			</div>
		</li>
	);
}

/**
 * Production work large, learning work small — the owner's call, and the
 * honest weighting: three systems that shipped to real users, then six
 * projects built to learn, each labelled as such rather than dressed up.
 */
export default function Projects() {
	const production = projects.filter((p) => p.type === 'real');
	const learning = projects.filter((p) => p.type !== 'real');

	return (
		<section id='projects' className='sy-section' aria-labelledby='projects-title'>
			<div className='sy-wrap'>
				<SectionHead
					id='projects'
					title='What shipped, and what I built to learn'
					meta={`${production.length} in production · ${learning.length} learning projects`}
				/>

				<ul className='sy-prod'>
					{production.map((p) => (
						<ProductionCard key={p.id} p={p} />
					))}
				</ul>

				<h3 className='sy-sub'>Learning projects</h3>
				<ul className='sy-learn'>
					{learning.map((p) => (
						<li key={p.id}>
							<div className='sy-learn-main'>
								<h4>{p.name}</h4>
								<p>{p.description}</p>
							</div>
							<p className='sy-learn-tech'>{p.tech.join(' · ')}</p>
							<p className='sy-card-links'>
								{p.demo && (
									<a href={p.demo} target='_blank' rel='noopener noreferrer'>
										{linkLabel(p.demo, 'demo')} <ExtArrow />
									</a>
								)}
								{p.github && (
									<a href={p.github} target='_blank' rel='noopener noreferrer'>
										{linkLabel(p.github, 'github')} <ExtArrow />
									</a>
								)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
