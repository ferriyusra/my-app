'use client';

import { FileText, FolderGit2 } from 'lucide-react';
import { LiChevronDown, LiGithub, LiHome } from '@/components/icons/line-icons';
import { ThisPcIcon } from '@/components/icons/app-icons';
import type { IconLike } from '@/components/icons/line-icons';

/**
 * Every location Explorer can be at. Only the first three are in Quick
 * access — the rest are folders you open, which is the point of them: the
 * tree used to be four folders deep in name and one folder deep in data.
 */
export type NavKey =
	| 'home'
	| 'documents'
	| 'portfolio'
	| 'roles'
	| 'case-study'
	| 'decisions';

export const NAV: { key: NavKey; label: string; Icon: IconLike }[] = [
	{ key: 'home', label: 'Home', Icon: LiHome },
	{ key: 'documents', label: 'Documents', Icon: FileText },
	{ key: 'portfolio', label: 'Portfolio', Icon: FolderGit2 },
];

export const LOCATION_LABEL: Record<NavKey, string> = {
	home: 'Home',
	documents: 'Documents',
	portfolio: 'Portfolio',
	roles: 'Roles',
	'case-study': 'Case study',
	decisions: 'Decisions reversed',
};

/** The folder each location sits in, which is what Up walks and the
    breadcrumb reads. `home` is the root and has none. */
export const PARENT: Record<NavKey, NavKey | null> = {
	home: null,
	documents: 'home',
	portfolio: 'home',
	roles: 'documents',
	'case-study': 'documents',
	decisions: 'documents',
};

/** The Quick access entry a location belongs under, for the highlight. */
export function quickAccessRoot(nav: NavKey): NavKey {
	let key = nav;
	while (PARENT[key] && !NAV.some((n) => n.key === key)) key = PARENT[key]!;
	return key;
}

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
	const root = quickAccessRoot(active);

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
					data-active={root === key || undefined}
					aria-current={root === key ? 'true' : undefined}
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
			{/* Names the machine without pretending to be browsable. It used to
			    open a folder of five app launchers wearing file icons. */}
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
