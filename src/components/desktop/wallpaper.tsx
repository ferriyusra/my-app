/**
 * The desktop background.
 *
 * Four wallpapers, all drawn in CSS: the shipped Windows 11 "Bloom" rosette,
 * a ribbon field, a dusk gradient, and a flat accent. Painting them rather
 * than shipping four 4K JPEGs keeps the first load at zero image bytes and
 * lets each one recolour with the theme.
 *
 * `data-wallpaper` on <html> selects which layer set is visible; the layers
 * themselves live in globals.css so no JS runs to repaint.
 */
export default function Wallpaper() {
	return (
		<div className='wallpaper' aria-hidden='true'>
			<span className='wp-layer wp-a' />
			<span className='wp-layer wp-b' />
			<span className='wp-layer wp-c' />
			{/* A faint vignette anchors the icons at the top-left corner. */}
			<span className='wp-vignette' />
		</div>
	);
}
