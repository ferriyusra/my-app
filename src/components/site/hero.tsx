import { Fragment, type CSSProperties } from 'react';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { monthLong, monthShort } from '@/lib/dates';
import { slug } from '@/lib/text';

/**
 * The first screen, as an index on a sheet: the claim and its actions at the
 * head, the five places worked set at display size along the foot, and an
 * ultramarine field from column 9 to the bleed holding the chosen place's
 * first year at poster scale, with a caption that says what the year is.
 *
 * The current place is chosen to begin with, in the mark red. Pointing at or
 * focusing another name chooses it and swaps the figure and caption in place,
 * in CSS alone (`:has()`), so the career reads at a glance with no script and
 * no extra words. Each name links to that role's answer below; its dates are
 * in the link's accessible name, because the figure is drawn for the eye.
 */
export default function Hero() {
	const lede = `${profile.role} in ${profile.roleDetail.replace(' & ', ' and ')}, based in Jakarta.`;

	return (
		<section className='hero' aria-labelledby='hero-title'>
			<div className='container hero__grid'>
				<div className='hero__head'>
					{/* Each word in its own span so the opening can set it from its
					    baseline; the spaces stay between them, so the heading reads
					    and wraps as one line of text. */}
					<h1 id='hero-title'>
						{profile.headline.split(' ').map((word, i, all) => (
							<Fragment key={i}>
								<span className='hero__word' style={{ '--i': i } as CSSProperties}>
									{word}
								</span>
								{i < all.length - 1 && ' '}
							</Fragment>
						))}
					</h1>
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

				<ul className='specimen__names'>
					{experiences.map((e, i) => (
						<li key={e.short}>
							<a
								className='specimen__name'
								href={`#role-${slug(e.short)}`}
								data-i={i}
								data-current={e.current || undefined}
								aria-label={`${e.short}, ${e.role}, ${monthShort(e.startISO)} to ${e.endISO ? monthShort(e.endISO) : 'now'}`}>
								{e.short}
							</a>
						</li>
					))}
				</ul>

				<div className='hero__field' aria-hidden='true'>
					{experiences.map((e, i) => (
						<p key={e.short} className='specimen__fig' data-i={i} data-current={e.current || undefined}>
							<span className='specimen__year'>{e.startISO.slice(0, 4)}</span>
							<span className='specimen__cap'>
								Joined {e.short} in {monthLong(e.startISO)}.{' '}
								{e.endISO ? `Left in ${monthLong(e.endISO)}.` : 'Still there.'}
							</span>
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
