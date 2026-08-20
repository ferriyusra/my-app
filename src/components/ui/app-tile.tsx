/**
 * An app icon.
 *
 * Every icon in this shell is drawn artwork, because that is what Windows 11
 * ships: its app icons are shaped compositions, not line art on a tinted
 * square. Half of these used to be a Lucide glyph over a gradient tile, and
 * next to the folder and the bin the difference was the loudest thing on the
 * desktop.
 */
export type TileArt = {
	Art: (props: { size?: number }) => React.ReactElement;
};

export default function AppTile({
	tile,
	size = 40,
}: {
	tile: TileArt;
	size?: number;
}) {
	return (
		<span
			className='app-tile'
			aria-hidden='true'
			style={{ width: size, height: size }}>
			<tile.Art size={size} />
		</span>
	);
}
