import Link from 'next/link';
import { cases } from '@/data/cases';
import { profile } from '@/data/profile';

/**
 * A floating nav that stays with the reader: the wordmark (the name in two
 * lines beside a square of the mark red) at one edge, and at the other a pill
 * holding the page's questions and the CV as an ink block, so the one action
 * is never ten screens away.
 *
 * "Case studies" opens a menu of every case in `cases.ts`, one row each: the
 * name, then where and when. It is a native popover (`popover` and
 * `popoverTarget`), so it needs no script: the browser gives it light
 * dismiss, Escape, the top layer and the open state to assistive technology.
 * The panel sits right after its key in the source, so Tab walks from the
 * key into the rows. `current` marks the case the reader is on.
 */
export default function Masthead({
	base = '',
	current,
}: {
	base?: '' | '/';
	/** The path of the case study this page is, if it is one. */
	current?: string;
}) {
	const [first, ...rest] = profile.name.split(' ');
	return (
		<header className='nav'>
			<div className='container nav__bar'>
				<Link href='/' className='wordmark' aria-label={`${profile.name}, home`}>
					<span>{first}</span>
					<span>{rest.join(' ')}</span>
				</Link>
				<div className='nav__pill'>
					<nav className='nav__links' aria-label='Sections'>
						<a href={`${base}#work`}>Work</a>
						<button type='button' className='nav__menu' popoverTarget='case-menu'>
							Case studies
						</button>
						<div id='case-menu' popover='auto' className='case-menu'>
							<ul className='case-menu__list'>
								{cases.map((c) => (
									<li key={c.href}>
										<Link
											href={c.href}
											className='case-menu__item'
											aria-current={c.href === current ? 'page' : undefined}>
											<span className='case-menu__name'>{c.name}</span>
											<span className='case-menu__meta'>
												{c.where}, {c.when}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
						<a href={`${base}#projects`}>Projects</a>
						<a href={`${base}#contact`}>Contact</a>
					</nav>
					<a className='nav__cv' href={profile.cvView} target='_blank' rel='noopener noreferrer'>
						CV
					</a>
				</div>
			</div>
		</header>
	);
}
