import { LiArrowUp } from '@/components/icons/line-icons';
import WindowsLogo from '@/components/ui/windows-logo';
import ModeLink from '@/components/ui/mode-link';
import PrintExpander from '@/components/content/print-expander';
import { profile } from '@/data/profile';
import StoryNav from './story-nav';
import Hero from './hero';
import Career from './career';
import CaseStudy from './case-study';
import Projects from './projects';
import Stack from './stack';
import Notes from './notes';
import Decisions from './decisions';
import Contact from './contact';
import StoryObserver from './story-observer';

/**
 * The portfolio at `/`: one page, told in the order a technical reader checks
 * a claim — who, the career, the deepest piece of work, what shipped, the
 * tools and where they were used, what was reversed, and how to get in touch.
 *
 * Every section is a server component rendering `src/data`, so every word is
 * in the response body: a crawler, an ATS, a printer and a browser without
 * scripting all get the whole story. Motion and the few interactive islands
 * are layered on top and take nothing away when absent. Do not move this
 * behind a client boundary — see CLAUDE.md for what that once cost.
 *
 * `className` carries the mono face's variable, so only this route loads it.
 */
export default function Story({ className = '' }: { className?: string }) {
	return (
		<div className={`sy ${className}`}>
			<StoryNav />
			<main id='main' className='sy-main'>
				<Hero />
				<Career />
				<CaseStudy />
				<Projects />
				<Stack />
				<Notes />
				<Decisions />
				<Contact />
			</main>
			<footer className='sy-foot'>
				<div className='sy-wrap sy-foot-in'>
					<p>
						{profile.name} · {profile.role} · {profile.location}
					</p>
					<p className='sy-foot-links'>
						<ModeLink className='sy-desk sy-js' href='/desktop'>
							<WindowsLogo size={12} />
							Desktop
						</ModeLink>
						<a href='#top'>
							Back to the top <LiArrowUp size={14} />
						</a>
					</p>
				</div>
			</footer>
			<PrintExpander scope='.sy' />
			<StoryObserver />
		</div>
	);
}
