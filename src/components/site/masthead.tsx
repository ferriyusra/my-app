import Link from 'next/link';
import { cases, type CaseEntry } from '@/data/cases';
import { profile } from '@/data/profile';

/** One case study as a menu row: its name, then where and when. */
function CaseRow({ c, current }: { c: CaseEntry; current?: string }) {
	return (
		<Link href={c.href} className='case-menu__item' aria-current={c.href === current ? 'page' : undefined}>
			<span className='case-menu__name'>{c.name}</span>
			<span className='case-menu__meta'>
				{c.where}, {c.when}
			</span>
		</Link>
	);
}

/**
 * The nav, in two forms from one source.
 *
 * From 60rem it floats: the wordmark (the name in two lines beside a square
 * of the mark red) at one edge, and at the other a pill holding the page's
 * questions and the CV as an ink block, so the one action is never ten
 * screens away. "Case studies" opens a menu of every case in `cases.ts`.
 *
 * Under 60rem it is a solid paper bar, so nothing it carries sits on top of a
 * heading: the wordmark, then a small pill with "Menu" and the CV. "Menu"
 * opens a sheet under the bar with the same sections and the same cases.
 * Until 2026-11-06 a phone got the name and the CV and nothing else.
 *
 * Both menus are native popovers (`popover` and `popoverTarget`), so they
 * need no script: the browser gives them light dismiss, Escape, the top
 * layer and their open state to assistive technology. Each sits right after
 * its key in the source, so Tab walks from the key into it. `current` marks
 * the case the reader is on.
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
										<CaseRow c={c} current={current} />
									</li>
								))}
							</ul>
						</div>
						<a href={`${base}#projects`}>Projects</a>
						<a href={`${base}#contact`}>Contact</a>
					</nav>

					<button type='button' className='nav__menu nav__menu--site' popoverTarget='site-menu'>
						Menu
					</button>
					<div id='site-menu' popover='auto' className='site-menu'>
						<nav aria-label='Menu'>
							<ul className='site-menu__list'>
								<li>
									<a href={`${base}#work`}>Work</a>
								</li>
								<li>
									<a href={`${base}#projects`}>Projects</a>
								</li>
								<li>
									<a href={`${base}#contact`}>Contact</a>
								</li>
							</ul>
							<p className='site-menu__label' id='site-menu-cases'>
								Case studies
							</p>
							<ul className='case-menu__list' aria-labelledby='site-menu-cases'>
								{cases.map((c) => (
									<li key={c.href}>
										<CaseRow c={c} current={current} />
									</li>
								))}
							</ul>
						</nav>
					</div>

					<a className='nav__cv' href={profile.cvView} target='_blank' rel='noopener noreferrer'>
						CV
					</a>
				</div>
			</div>
		</header>
	);
}
