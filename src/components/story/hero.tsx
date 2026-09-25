import { LiDownload, LiMail } from '@/components/icons/line-icons';
import WindowsLogo from '@/components/ui/windows-logo';
import ModeLink from '@/components/ui/mode-link';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { run } from '@/lib/terminal';
import { highlightRole, roleSlug } from '@/lib/story';

/** What the terminal card has already typed when the page arrives. */
const OPENING = 'ls roles';

/**
 * The first screen: who, what, the proof, and the CV.
 *
 * On a phone the first viewport holds the name, the headline, the proof line
 * and the CV actions — the contract the old document kept, carried over. The
 * terminal card beside it on a wide screen is not decoration: its output is
 * the real `run()` behind the desktop's Terminal, executed here on the server,
 * so the career is legible in five lines before a word of it is scrolled to.
 *
 * Under it, the three outcomes `profile.highlights` records — each linked to
 * the role it came from.
 */
export default function Hero() {
	const current = experiences.find((e) => e.current) ?? experiences[0];
	const lines = run(OPENING).lines;

	return (
		<section id='top' className='sy-hero' aria-labelledby='top-title'>
			<div className='sy-wrap sy-hero-grid'>
				<div className='sy-hero-text'>
					<p className='sy-status'>
						<span className='sy-status-dot' aria-hidden='true' />
						{profile.openTo}
					</p>
					<h1 id='top-title' className='sy-name'>
						{profile.name}
					</h1>
					<p className='sy-hero-role'>
						{profile.role}
						<span> — {profile.roleDetail}</span>
					</p>
					<p className='sy-headline'>{profile.headline}</p>
					<p className='sy-proof'>{profile.proof}</p>

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
						<a className='sy-btn sy-btn-ghost' href={`mailto:${profile.email}`}>
							<LiMail size={16} />
							Email
						</a>
						<ModeLink className='sy-btn sy-btn-ghost sy-desk sy-js' href='/desktop'>
							<WindowsLogo size={14} />
							Open the desktop
						</ModeLink>
					</div>

					<p className='sy-current'>
						Currently <strong>{current.role}</strong> at{' '}
						<a href={`#${roleSlug(current)}`}>{current.short}</a>
						<span className='sy-current-when'>{current.period}</span>
					</p>
				</div>

				<figure className='sy-term' aria-label={`Terminal, after running ${OPENING}`}>
					<div className='sy-term-bar' aria-hidden='true'>
						<span className='sy-term-lights'>
							<i />
							<i />
							<i />
						</span>
						<span className='sy-term-title'>~/ferri-yusra</span>
					</div>
					<pre className='sy-term-body'>
						<code>
							<span className='sy-term-line'>
								<span className='sy-term-ps' aria-hidden='true'>
									${' '}
								</span>
								{OPENING}
								{'\n'}
							</span>
							{lines.map((l, i) => (
								<span key={i} className='sy-term-line' data-tone={l.tone}>
									{l.text}
									{'\n'}
								</span>
							))}
						</code>
					</pre>
				</figure>
			</div>

			<div className='sy-wrap'>
				<p className='sy-shipped-label'>Shipped</p>
				<ul className='sy-shipped'>
					{profile.highlights.map((h) => {
						const role = highlightRole(h);
						const body = (
							<>
								<span className='sy-shipped-at'>
									{h.at} · {h.year}
								</span>
								<strong>{h.lead}</strong>
								<span className='sy-shipped-detail'>{h.detail}</span>
							</>
						);
						return (
							<li key={h.lead}>
								{role ? <a href={`#${roleSlug(role)}`}>{body}</a> : <div>{body}</div>}
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
