'use client';

import { useTapOpen } from '@/hooks/use-tap-open';

/**
 * An Explorer tile in the Large icons view. With a mouse, single click
 * selects and double click opens — the same contract as the desktop grid —
 * and a tap or an assistive-technology click opens.
 */
export default function FolderCard({
	entry,
	selected,
	onSelect,
}: {
	entry: import('./types').FsEntry;
	selected: boolean;
	onSelect: () => void;
}) {
	const tap = useTapOpen(entry.onOpen);
	return (
		<button
			type='button'
			className='xp-tile'
			data-selected={selected || undefined}
			aria-label={`${entry.name} — ${entry.type}`}
			onPointerDown={tap.onPointerDown}
			onClick={(e) => {
				onSelect();
				tap.onClick(e);
			}}
			onDoubleClick={tap.onDoubleClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					entry.onOpen();
				}
			}}>
			<span className='xp-tile-icon' aria-hidden='true'>
				{entry.icon}
			</span>
			<span className='xp-tile-name'>{entry.name}</span>
			<span className='xp-tile-meta'>{entry.meta}</span>
		</button>
	);
}
