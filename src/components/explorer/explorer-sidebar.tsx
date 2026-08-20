'use client';

import {
	Home,
	Monitor,
	FileText,
	Download,
	FolderGit2,
	Github,
	type LucideIcon,
} from 'lucide-react';

export type NavKey = 'home' | 'desktop' | 'documents' | 'downloads' | 'portfolio';

const NAV: { key: NavKey; label: string; Icon: LucideIcon }[] = [
	{ key: 'home', label: 'Home', Icon: Home },
	{ key: 'desktop', label: 'Desktop', Icon: Monitor },
	{ key: 'documents', label: 'Documents', Icon: FileText },
	{ key: 'downloads', label: 'Downloads', Icon: Download },
	{ key: 'portfolio', label: 'Portfolio', Icon: FolderGit2 },
];

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
			{NAV.map(({ key, label, Icon }) => (
				<button
					key={key}
					type='button'
					className='xp-side-item'
					data-active={active === key}
					aria-current={active === key ? 'true' : undefined}
					onClick={() => onSelect(key)}>
					<Icon size={16} aria-hidden='true' />
					{label}
				</button>
			))}
			<span className='xp-side-sep' aria-hidden='true' />
			<a
				className='xp-side-item'
				href={githubHref}
				target='_blank'
				rel='noopener noreferrer'>
				<Github size={16} aria-hidden='true' />
				GitHub
			</a>
		</nav>
	);
}
