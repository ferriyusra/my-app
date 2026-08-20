'use client';

import AppTile from '@/components/ui/app-tile';
import type { AppDef, ShortcutDef } from '@/components/apps/registry';

type Props = {
	title: string;
	selected: boolean;
	onSelect: () => void;
	onOpen: () => void;
	tile: React.ReactNode;
	href?: string;
};

/**
 * One desktop item. Single click selects and double click opens, matching
 * Windows; Enter opens too, so the grid is reachable from the keyboard.
 */
export default function DesktopIcon({
	title,
	selected,
	onSelect,
	onOpen,
	tile,
	href,
}: Props) {
	const common = {
		className: 'desk-icon',
		'data-selected': selected,
		onPointerDown: (e: React.PointerEvent) => {
			e.stopPropagation();
			onSelect();
		},
		onDoubleClick: onOpen,
		onKeyDown: (e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				onOpen();
			}
		},
	};

	if (href) {
		return (
			<a {...common} href={href} target='_blank' rel='noopener noreferrer'>
				{tile}
				{title}
			</a>
		);
	}
	return (
		<button type='button' {...common} aria-label={`Open ${title}`}>
			{tile}
			{title}
		</button>
	);
}

export function tileFor(def: AppDef | ShortcutDef) {
	return <AppTile app={def} size={46} />;
}
