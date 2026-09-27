'use client';

import type { FsEntry } from './types';
import { useTapOpen } from '@/hooks/use-tap-open';

/**
 * An Explorer row, used by both the List and Details views.
 *
 * The row is a `div` with the row role and the button sits inside it: a
 * `<button role='row'>` replaces the button's role, so a screen reader was
 * told it was on a row it could not press.
 */
export default function FileRow({
	entry,
	selected,
	details,
	onSelect,
}: {
	entry: FsEntry;
	selected: boolean;
	/** Details adds the Type and Details columns beside the name. */
	details: boolean;
	onSelect: () => void;
}) {
	const tap = useTapOpen(entry.onOpen);
	return (
		<div className='xp-row' role='row' data-selected={selected || undefined}>
			<span className='xp-row-name' role='cell'>
				<button
					type='button'
					className='xp-row-btn'
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
					<span className='xp-row-icon' aria-hidden='true'>
						{entry.icon}
					</span>
					{entry.name}
				</button>
			</span>
			{details && (
				<>
					<span className='xp-row-type' role='cell'>
						{entry.type}
					</span>
					<span className='xp-row-meta' role='cell'>
						{entry.meta}
					</span>
				</>
			)}
		</div>
	);
}
