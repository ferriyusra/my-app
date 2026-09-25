import { LiDownload, LiGithub, LiLinkedin, LiMail } from '@/components/icons/line-icons';
import WindowsLogo from '@/components/ui/windows-logo';
import ModeLink from '@/components/ui/mode-link';
import { profile } from '@/data/profile';
import { BUILT_SUMMARY } from '@/data/tips';
import { DESKTOP_MIN_WIDTH } from '@/lib/shell-defaults';
import SectionHead from './section-head';

/**
 * Where the story ends: what is true this month, how to reach the person, and
 * the other way in.
 *
 * The CV actions repeat here on purpose — this is where a reader who has read
 * everything decides. The desktop teaser comes last, after the evidence, and is
 * drawn in CSS: no image bytes, and it recolours with the theme.
 */
export default function Contact() {
	const [ny, nm] = profile.nowUpdated.split('-').map(Number);
	const updated = new Date(ny, nm - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

	return (
		<section id='contact' className='sy-section sy-contact' aria-labelledby='contact-title'>
			<div className='sy-wrap'>
				<SectionHead id='contact' title='Now, and how to reach me' meta={profile.openTo} />

				<div className='sy-contact-grid'>
					<div className='sy-now'>
						<p className='sy-now-stamp'>Updated {updated}</p>
						<dl>
							{profile.now.map((n) => (
								<div key={n.label}>
									<dt>{n.label}</dt>
									<dd>{n.text}</dd>
								</div>
							))}
						</dl>
					</div>

					<div className='sy-reach'>
						<div className='sy-actions'>
							<a
								className='sy-btn sy-btn-signal'
								href={profile.cvView}
								target='_blank'
								rel='noopener noreferrer'>
								View CV
								<span className='sy-ext' aria-hidden='true'>
									↗
								</span>
							</a>
							<a className='sy-btn' href={profile.cvDownload} target='_blank' rel='noopener noreferrer'>
								<LiDownload size={16} />
								Download PDF
							</a>
						</div>
						<ul className='sy-reach-links'>
							<li>
								<a href={`mailto:${profile.email}`}>
									<LiMail size={18} />
									{profile.email}
								</a>
							</li>
							<li>
								<a href={profile.github} target='_blank' rel='noopener noreferrer'>
									<LiGithub size={18} />
									{profile.github.replace('https://', '')}
								</a>
							</li>
							<li>
								<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
									<LiLinkedin size={18} />
									{profile.linkedin.replace('https://', '')}
								</a>
							</li>
						</ul>
					</div>
				</div>

				<aside className='sy-teaser' aria-labelledby='teaser-title'>
					<div className='sy-teaser-art' aria-hidden='true'>
						<span className='sy-mini-win sy-mini-a' />
						<span className='sy-mini-win sy-mini-b' />
						<span className='sy-mini-bar'>
							<i />
							<i />
							<i />
							<i />
						</span>
					</div>
					<div className='sy-teaser-text'>
						<h3 id='teaser-title'>The same portfolio, as a Windows 11 desktop</h3>
						<p>{BUILT_SUMMARY}</p>
						<ModeLink className='sy-btn sy-desk sy-js' href='/desktop'>
							<WindowsLogo size={14} />
							Open the desktop
						</ModeLink>
						<p className='sy-teaser-narrow'>
							The desktop needs a screen at least {DESKTOP_MIN_WIDTH}px wide.
						</p>
						<p className='sy-nojs'>The desktop needs JavaScript. The portfolio itself is all on this page.</p>
					</div>
				</aside>
			</div>
		</section>
	);
}
