'use client';

import { Folder, Star } from 'lucide-react';

/**
 * An Explorer tile. Windows shows a folder glyph tinted by content; the
 * project's own colour does that job here.
 */
export default function FolderCard({
	name,
	meta,
	colour,
	featured,
	onOpen,
}: {
	name: string;
	meta: string;
	colour: string;
	featured?: boolean;
	onOpen: () => void;
}) {
	return (
		<button
			type='button'
			className='xp-folder'
			onDoubleClick={onOpen}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					onOpen();
				}
			}}
			aria-label={`Open ${name}`}>
			<span className='xp-folder-icon' aria-hidden='true'>
				<Folder size={38} fill={colour} color={colour} />
				{featured && <Star size={12} fill='currentColor' className='xp-folder-star' />}
			</span>
			<span className='xp-folder-name'>{name}</span>
			<span className='xp-folder-meta'>{meta}</span>
		</button>
	);
}
