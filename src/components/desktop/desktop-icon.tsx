'use client';

import { memo } from 'react';
import AppTile, { type TileArt } from '@/components/ui/app-tile';

type Props = {
	id: string;
	label: string;
	tile: TileArt;
	selected: boolean;
	/** Artwork size in px, set by the desktop's View sub-menu. */
	tileSize: number;
	/** True for the one cell that is reachable by Tab (roving tabindex). */
	tabbable: boolean;
	href?: string;
	onSelect: () => void;
	onOpen: () => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	onContextMenu: (e: React.MouseEvent) => void;
	/** Begins a drag; the press has already been stopped from bubbling. */
	onDragStart: (e: React.PointerEvent) => void;
};

/**
 * One desktop cell. Single click selects and double click opens, matching
 * Windows; Enter opens too, so the grid works from the keyboard.
 */
function DesktopIcon({
	id,
	label,
	tile,
	selected,
	tileSize,
	tabbable,
	href,
	onSelect,
	onOpen,
	onKeyDown,
	onContextMenu,
	onDragStart,
}: Props) {
	const common = {
		'data-icon-id': id,
		className: 'desk-icon',
		'data-selected': selected,
		tabIndex: tabbable ? 0 : -1,
		onPointerDown: (e: React.PointerEvent) => {
			/* Stop the desktop's own pointerdown from clearing the selection
			   this click is about to make — and from starting a marquee, since
			   the press landed on an icon rather than bare wallpaper. */
			e.stopPropagation();
			onSelect();
			/* Which is also why the drag begins here rather than on the <li>:
			   the event never gets that far. */
			onDragStart(e);
		},
		onDoubleClick: onOpen,
		onKeyDown: (e: React.KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onOpen();
			} else {
				onKeyDown(e);
			}
		},
		onContextMenu,
	};

	const inner = (
		<>
			<span className='desk-icon-art' aria-hidden='true'>
				<AppTile tile={tile} size={tileSize} />
			</span>
			<span className='desk-icon-label'>{label}</span>
		</>
	);

	/* Shortcuts stay real anchors: middle-click, copy-link and open-in-new-tab
	   all keep working, which a button would throw away. */
	if (href) {
		return (
			<a
				{...common}
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				aria-label={`${label} — opens in a new tab`}
				/* The anchor's own activation would race the double-click, so the
				   open path stays the one the grid controls. */
				onClick={(e) => e.preventDefault()}>
				{inner}
			</a>
		);
	}

	return (
		<button type='button' {...common} aria-label={`Open ${label}`}>
			{inner}
		</button>
	);
}

export default memo(DesktopIcon);
