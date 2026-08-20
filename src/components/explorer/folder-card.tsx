'use client';

/**
 * An Explorer tile in the Large icons view. Single click selects, double
 * click opens — the same contract as the desktop grid.
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
	return (
		<button
			type='button'
			className='xp-tile'
			data-selected={selected || undefined}
			aria-label={`${entry.name} — ${entry.type}`}
			onClick={onSelect}
			onDoubleClick={entry.onOpen}
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
