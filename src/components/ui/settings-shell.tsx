'use client';

import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { LiDownload, LiMail, type IconLike } from '@/components/icons/line-icons';

export type SettingsPage = { key: string; label: string; Icon: IconLike };

/**
 * The Windows 11 Settings chrome: an account card over a nav rail on the
 * left, a titled scrolling pane on the right. About, Skills, Experience and
 * Settings all wear it, which is why it lives here rather than in one app.
 *
 * The rail answers to the width of the window, not of the screen — the
 * `st` container in globals.css — because that is what Windows' own
 * NavigationView does, and because every snapped window is narrow on a
 * screen that is not. The labels stay in the DOM when the rail collapses to
 * icons, so each item keeps its accessible name; `title` is the tooltip the
 * compact rail shows in Windows.
 */
export default function SettingsShell({
	pages,
	active,
	onSelect,
	title,
	subtitle,
	children,
	navLabel = 'Sections',
	account = true,
}: {
	pages: SettingsPage[];
	active: string;
	onSelect: (key: string) => void;
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	navLabel?: string;
	/** The signed-in account card. Tips has none in Windows, and on first
	    arrival it sits beside About, which would show the same card twice. */
	account?: boolean;
}) {
	/* A new page starts at its top, as it does in Settings. The pane is one
	   scroller shared by every page, so without this a link at the foot of a
	   long page — Experience's "Read the case study" — opened the next page
	   partway down. */
	const pane = useRef<HTMLDivElement>(null);
	useEffect(() => {
		pane.current?.scrollTo({ top: 0 });
	}, [active]);

	return (
		<div className='st-shell'>
			<nav className='st-nav' aria-label={navLabel}>
				{account && (
					<div className='st-account'>
						<span className='st-avatar' aria-hidden='true'>
							{profile.initials}
						</span>
						<span className='st-account-text'>
							<strong>{profile.name}</strong>
							<small>{profile.email}</small>
						</span>
					</div>
				)}

				<ul className='st-nav-list'>
					{pages.map(({ key, label, Icon }) => (
						<li key={key}>
							<button
								type='button'
								className='st-nav-item'
								data-active={active === key || undefined}
								aria-current={active === key ? 'page' : undefined}
								title={label}
								onClick={() => onSelect(key)}>
								<span className='st-nav-rail' aria-hidden='true' />
								<Icon size={17} aria-hidden='true' />
								<span className='st-nav-text'>{label}</span>
							</button>
						</li>
					))}
				</ul>
			</nav>

			<div className='st-pane' ref={pane}>
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
