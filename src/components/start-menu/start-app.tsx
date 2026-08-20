'use client';

import AppTile, { type TileArt } from '@/components/ui/app-tile';

/** One tile in Start's pinned grid, or one row in its all-apps list. */
export default function StartApp({
	title,
	tile,
	blurb,
	variant = 'tile',
	href,
	onSelect,
}: {
	title: string;
	tile: TileArt;
	blurb?: string;
	variant?: 'tile' | 'row';
	href?: string;
	onSelect: () => void;
}) {
	const size = variant === 'tile' ? 34 : 22;
	const inner = (
		<>
			<AppTile tile={tile} size={size} />
			<span className='start-app-text'>
				{title}
				{variant === 'row' && blurb && <small>{blurb}</small>}
			</span>
		</>
	);

	const cls = variant === 'tile' ? 'start-tile' : 'start-row';

	if (href) {
		return (
			<a
				className={cls}
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				onClick={onSelect}>
				{inner}
			</a>
		);
	}

	return (
		<button type='button' className={cls} onClick={onSelect}>
			{inner}
		</button>
	);
}
