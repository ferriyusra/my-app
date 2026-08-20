'use client';

import AppTile, { type TileArt } from '@/components/ui/app-tile';

/**
 * The title bar. Drag handling lives in the frame — the header only renders
 * and forwards pointer events, which keeps the geometry maths in one place.
 */
export default function WindowHeader({
	titleId,
	title,
	tile,
	controls,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	onDoubleClick,
	onContextMenu,
}: {
	titleId: string;
	title: string;
	tile: TileArt;
	controls: React.ReactNode;
	onPointerDown: (e: React.PointerEvent) => void;
	onPointerMove: (e: React.PointerEvent) => void;
	onPointerUp: (e: React.PointerEvent) => void;
	onDoubleClick: () => void;
	onContextMenu: (e: React.MouseEvent) => void;
}) {
	return (
		<div
			className='win-title'
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			onDoubleClick={onDoubleClick}
			onContextMenu={onContextMenu}>
			<span className='win-title-icon' aria-hidden='true'>
				<AppTile tile={tile} size={16} />
			</span>
			<span className='win-title-text' id={titleId}>
				{title}
			</span>
			{controls}
		</div>
	);
}
