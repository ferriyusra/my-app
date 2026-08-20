import type { LucideIcon } from 'lucide-react';

/**
 * A Windows-style app icon: a rounded square filled with the app's colour
 * and a white glyph. Replaces the translucent plate with line art, which was
 * the clearest sign this was not a Windows desktop.
 */
export default function AppTile({
	app,
	size = 40,
}: {
	/* Structural, not nominal: anything carrying a glyph and a gradient can
	   render as a tile, which lets apps and shortcuts share this. */
	app: { Icon: LucideIcon; grad: string };
	size?: number;
}) {
	const { Icon, grad } = app;
	return (
		<span
			className='app-tile'
			aria-hidden='true'
			style={{
				width: size,
				height: size,
				borderRadius: Math.round(size * 0.22),
				background: grad,
			}}>
			<Icon size={Math.round(size * 0.52)} strokeWidth={2.1} color='#fff' />
		</span>
	);
}
