'use client';

import { FileText, FolderGit2 } from 'lucide-react';
import { LiChevronDown, LiDownload, LiGithub, LiHome, LiMonitor } from '@/components/icons/line-icons';
import { ThisPcIcon } from '@/components/icons/app-icons';
import type { IconLike } from '@/components/icons/line-icons';

export type NavKey =
	| 'home'
	| 'desktop'
	| 'documents'
	| 'downloads'
	| 'portfolio';

export const NAV: { key: NavKey; label: string; Icon: IconLike }[] = [
	{ key: 'home', label: 'Home', Icon: LiHome },
	{ key: 'desktop', label: 'Desktop', Icon: LiMonitor },
	{ key: 'documents', label: 'Documents', Icon: FileText },
	{ key: 'downloads', label: 'Downloads', Icon: LiDownload },
	{ key: 'portfolio', label: 'Portfolio', Icon: FolderGit2 },
];

/** Explorer's navigation pane: quick access over This PC, plus one link out. */
export default function ExplorerSidebar({
	active,
	onSelect,
	githubHref,
}: {
	active: NavKey;
	onSelect: (key: NavKey) => void;
	githubHref: string;
}) {
	return (
		<nav className='xp-side' aria-label='Explorer locations'>
			<p className='xp-side-head'>
				<LiChevronDown size={13} aria-hidden='true' />
				Quick access
			</p>

			{NAV.map(({ key, label, Icon }) => (
				<button
					key={key}
					type='button'
					className='xp-side-item'
					data-active={active === key || undefined}
					aria-current={active === key ? 'true' : undefined}
					onClick={() => onSelect(key)}>
					<Icon size={16} aria-hidden='true' />
					{label}
				</button>
			))}

			<span className='xp-side-sep' aria-hidden='true' />

			<p className='xp-side-head'>
				<LiChevronDown size={13} aria-hidden='true' />
				This PC
			</p>
			<span className='xp-side-item xp-side-static'>
				<ThisPcIcon size={16} />
				Local Disk (C:)
			</span>

			<span className='xp-side-sep' aria-hidden='true' />

			<a
				className='xp-side-item'
				href={githubHref}
				target='_blank'
				rel='noopener noreferrer'>
				<LiGithub size={16} aria-hidden='true' />
				GitHub
			</a>
		</nav>
	);
}
