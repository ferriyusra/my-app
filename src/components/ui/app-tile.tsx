import type { LucideIcon } from 'lucide-react';

/**
 * Windows draws app icons two ways: a tinted rounded square with a white
 * glyph (Mail, Settings, Photos), or free-form artwork (the folder, the bin,
 * the browser). Modelling both as one union lets every surface — desktop,
 * taskbar, Start, title bar — render an icon without caring which it is.
 */
export type TileArt =
	| { kind: 'glyph'; Icon: LucideIcon; grad: string }
	| { kind: 'art'; Art: (props: { size?: number }) => React.ReactElement };

export default function AppTile({
	tile,
	size = 40,
}: {
	tile: TileArt;
	size?: number;
}) {
	if (tile.kind === 'art') {
		return (
			<span className='app-tile app-tile-art' style={{ width: size, height: size }}>
				<tile.Art size={size} />
			</span>
		);
	}

	const { Icon, grad } = tile;
	return (
		<span
			className='app-tile'
			aria-hidden='true'
			style={{
				width: size,
				height: size,
				/* Fluent icon corners are ~22% of the tile, so they stay
				   proportional from 16px in a title bar to 46px on the desktop. */
				borderRadius: Math.max(3, Math.round(size * 0.22)),
				background: grad,
			}}>
			<Icon size={Math.round(size * 0.52)} strokeWidth={2.1} color='#fff' />
		</span>
	);
}
