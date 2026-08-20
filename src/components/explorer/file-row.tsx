'use client';

import type { FsEntry } from './types';

/** An Explorer row, used by both the List and Details views. */
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
	return (
		<button
			type='button'
			className='xp-row'
			role='row'
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
			<span className='xp-row-name' role='cell'>
				<span className='xp-row-icon' aria-hidden='true'>
					{entry.icon}
				</span>
				{entry.name}
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
		</button>
	);
}
