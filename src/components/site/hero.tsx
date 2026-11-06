import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import { caseStudy } from '@/data/case-study';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { CaseStudyFigure } from '@/components/content/case-study-body';
import { label } from '@/lib/text';

/**
 * The first sheet, a Ledge: a tall drawing above and the head resting at its
 * base.
 *
 * The drawing is the signature: the deposit-alerting system as the owner's
 * write-up draws it (`caseStudy.figure`), set as a blueprint over the drafting
 * grid, every box and label a phrase from the write-up. It is real project
 * data, never a picture standing in for one, and its title block says what it
 * is, where it was built and where the write-up is.
 *
 * Under 60rem the head comes first and the drawing follows, in reading order.
 * Each headline word sits in its own span so the opening can set it from its
 * baseline; the spaces stay between them, so it reads as one line of text.
 */
export default function Hero() {
	const lede = `${profile.role} in ${profile.roleDetail.replace(' & ', ' and ')}, based in Jakarta.`;
	const drawn = projects.find((p) => p.id === caseStudy.project)?.name ?? caseStudy.title;

	return (
		<section className='hero' aria-labelledby='hero-title'>
			<div className='container hero__grid'>
				<div className='hero__sheet'>
					{/* The plate keeps the drawing at its drawn width: on a phone it
					    pans sideways rather than stacking into a column of bars. It
					    takes focus so a keyboard can scroll it. */}
					<div className='hero__plate' role='region' aria-label='The deposit-alerting system, drawn' tabIndex={0}>
						<div className='hero__drawing'>
							<CaseStudyFigure figure={caseStudy.figure} caption={false} />
						</div>
					</div>
					<dl className='titleblock hero__title'>
						<div>
							<dt>Drawing</dt>
							<dd>{drawn}</dd>
						</div>
						<div>
							<dt>Built at</dt>
							<dd>
								{caseStudy.at}, <span className='num'>{label(caseStudy.year)}</span>
							</dd>
						</div>
						<div>
							<dt>Write-up</dt>
							<dd>
								<Link href={`/${caseStudy.slug}`}>Read the case study</Link>
							</dd>
						</div>
					</dl>
				</div>

				<h1 id='hero-title' className='hero__head'>
					{profile.headline.split(' ').map((word, i, all) => (
						<Fragment key={i}>
							<span className='hero__word' style={{ '--i': i } as CSSProperties}>
								{word}
							</span>
							{i < all.length - 1 && ' '}
						</Fragment>
					))}
				</h1>

				<div className='hero__side'>
					<p className='lede'>{lede}</p>
					<div className='actions'>
						<a
							className='btn btn--primary'
							href={profile.cvView}
							target='_blank'
							rel='noopener noreferrer'>
							Open my CV
						</a>
						<a className='btn btn--secondary' href={`mailto:${profile.email}`}>
							Email me
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
