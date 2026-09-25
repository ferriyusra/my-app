import { LiMoon, LiSun } from '@/components/icons/line-icons';
import WindowsLogo from '@/components/ui/windows-logo';
import ModeLink from '@/components/ui/mode-link';
import { STORY_SECTIONS } from '@/lib/story-sections';
import { profile } from '@/data/profile';
import ThemeSwitch from './theme-switch';

const LINKS = STORY_SECTIONS.filter((s) => s.nav !== null);

/**
 * The bar that stays at the top while the story scrolls.
 *
 * The CV is in it at every scroll position, because the CV being opened is
 * what a visit here is for; nothing else in the bar is styled to compete with
 * it. Section links are plain anchors, so they work with scripting off. Below
 * the width that fits them they fold into a native `<details>` menu, which also
 * needs no script.
 */
export default function StoryNav() {
	return (
		<header className='sy-nav'>
			<div className='sy-wrap sy-nav-in'>
				<a className='sy-monogram' href='#top' aria-label={`${profile.name}, back to the top`}>
					{profile.initials}
				</a>

				<nav className='sy-links' aria-label='Sections'>
					{LINKS.map((s) => (
						<a key={s.id} href={`#${s.id}`} data-sy-link={s.id}>
							{s.nav}
						</a>
					))}
				</nav>

				<div className='sy-nav-actions'>
					<a
						className='sy-btn sy-btn-signal sy-btn-sm'
						href={profile.cvView}
						target='_blank'
						rel='noopener noreferrer'>
						View CV
					</a>
					<ModeLink className='sy-btn sy-btn-ghost sy-btn-sm sy-desk sy-js' href='/desktop'>
						<WindowsLogo size={13} />
						Desktop
					</ModeLink>
					<ThemeSwitch sun={<LiSun size={17} />} moon={<LiMoon size={17} />} />
					<details className='sy-menu'>
						<summary className='sy-icon-btn' aria-label='Sections'>
							<span className='sy-menu-bars' aria-hidden='true' />
						</summary>
						<nav className='sy-menu-panel' aria-label='Sections'>
							{LINKS.map((s) => (
								<a key={s.id} href={`#${s.id}`}>
									<span aria-hidden='true'>{s.index}</span>
									{s.nav}
								</a>
							))}
						</nav>
					</details>
				</div>
			</div>
			{/* Drawn by a scroll timeline where the browser has one; nothing
			    otherwise. Decoration, so it is hidden from assistive tech. */}
			<span className='sy-progress' aria-hidden='true' />
		</header>
	);
}
