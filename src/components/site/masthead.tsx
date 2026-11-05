import Link from 'next/link';
import { profile } from '@/data/profile';

/**
 * A floating nav that stays with the reader: the wordmark (the name in two
 * lines beside a square of the mark red) at one edge, and at the other a pill
 * holding the page's questions and the CV as an ink block, so the one action
 * is never ten screens away.
 */
export default function Masthead({ base = '' }: { base?: '' | '/' }) {
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
						<a href={`${base}#case`}>Case study</a>
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
