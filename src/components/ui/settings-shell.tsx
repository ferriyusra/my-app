'use client';

import { profile } from '@/data/profile';
import { LiDownload, LiMail, type IconLike } from '@/components/icons/line-icons';

export type SettingsPage = { key: string; label: string; Icon: IconLike };

/**
 * The Windows 11 Settings chrome: an account card over a nav rail on the
 * left, a titled scrolling pane on the right. About, Skills, Experience and
 * Settings all wear it, which is why it lives here rather than in one app.
 */
export default function SettingsShell({
	pages,
	active,
	onSelect,
	title,
	subtitle,
	children,
	navLabel = 'Sections',
}: {
	pages: SettingsPage[];
	active: string;
	onSelect: (key: string) => void;
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	navLabel?: string;
}) {
	return (
		<div className='st-shell'>
			<nav className='st-nav' aria-label={navLabel}>
				<div className='st-account'>
					<span className='st-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					<span className='st-account-text'>
						<strong>{profile.name}</strong>
						<small>{profile.email}</small>
					</span>
				</div>

				<ul className='st-nav-list'>
					{pages.map(({ key, label, Icon }) => (
						<li key={key}>
							<button
								type='button'
								className='st-nav-item'
								data-active={active === key || undefined}
								aria-current={active === key ? 'page' : undefined}
								onClick={() => onSelect(key)}>
								<span className='st-nav-rail' aria-hidden='true' />
								<Icon size={17} aria-hidden='true' />
								{label}
							</button>
						</li>
					))}
				</ul>
			</nav>

			<div className='st-pane'>
				<header className='st-pane-head'>
					<h2>{title}</h2>
					{subtitle && <p>{subtitle}</p>}
				</header>
				<div className='st-pane-body'>{children}</div>
				{/* Windows Settings ends every page with "Get help" and "Give
				    feedback". The same slot carries the two actions a visit here
				    succeeds in, so they sit at the foot of About, Experience,
				    Skills and Tips rather than on About's third tab. */}
				<footer className='st-pane-foot'>
					<a href={profile.cvDownload} target='_blank' rel='noopener noreferrer'>
						<LiDownload size={15} aria-hidden='true' /> Download CV
					</a>
					<a href={`mailto:${profile.email}`}>
						<LiMail size={15} aria-hidden='true' /> Email me
					</a>
				</footer>
			</div>
		</div>
	);
}
