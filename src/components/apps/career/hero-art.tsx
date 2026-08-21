/**
 * The character you walk through the career with.
 *
 * Hand-drawn like every other piece of art in this shell — the same rule the
 * app icons follow. It is deliberately small and simple: at 30px wide the
 * readable signal is silhouette and colour, not detail.
 *
 * The walk cycle is CSS on the limb groups rather than frames, so it costs one
 * attribute instead of a sprite sheet, and it stops cleanly the moment the
 * character stands still.
 *
 * It takes no props on purpose. Whether the character is walking changes on
 * almost every frame, so the loop writes `data-walking` / `data-air` onto the
 * wrapper and CSS reads it there — passing it as a prop would put a sixty-times
 * -a-second re-render back into React, which is the thing this whole file is
 * arranged to avoid.
 */

export const HERO_W = 30;
export const HERO_H = 52;

export default function HeroArt() {
	return (
		<svg
			className='cx-hero-svg'
			viewBox='0 0 30 52'
			width={HERO_W}
			height={HERO_H}
			aria-hidden='true'>
			{/* Back leg, drawn first so it reads as behind */}
			<g className='cx-leg cx-leg-back'>
				<rect x='12' y='34' width='6' height='16' rx='2.6' fill='#2f3b57' />
				<rect x='11' y='47' width='8' height='4' rx='1.8' fill='#161c2c' />
			</g>
			{/* Front leg */}
			<g className='cx-leg cx-leg-front'>
				<rect x='13' y='34' width='6' height='16' rx='2.6' fill='#3d4c6e' />
				<rect x='12' y='47' width='8' height='4' rx='1.8' fill='#222a3f' />
			</g>

			{/* Torso — a hoodie in the accent, so it follows the theme */}
			<path
				d='M9 20.5a6 6 0 0 1 6-6h.6a6 6 0 0 1 6 6v11a2.4 2.4 0 0 1-2.4 2.4h-7.8A2.4 2.4 0 0 1 9 31.5z'
				fill='var(--accent-fill)'
			/>
			{/* Hood behind the neck */}
			<path d='M10.6 16.6h9.2v3.4a4.6 4.6 0 0 1-9.2 0z' fill='var(--accent-hover)' />

			{/* Arms */}
			<g className='cx-arm cx-arm-back'>
				<rect x='6.4' y='20' width='5' height='13' rx='2.4' fill='var(--accent-hover)' />
			</g>
			<g className='cx-arm cx-arm-front'>
				<rect x='19' y='20' width='5' height='13' rx='2.4' fill='var(--accent)' />
			</g>

			{/* Head */}
			<rect x='9.6' y='4' width='11' height='11.6' rx='4' fill='#f0c9a4' />
			{/* Hair */}
			<path d='M9.6 8.6a5.5 5.5 0 0 1 11 0v1.2c-1.6-1.4-3.1-2-5.5-2s-3.9.6-5.5 2z' fill='#22283a' />
			{/* Eye — one pixel of it, facing the direction of travel */}
			<rect x='17' y='9.6' width='1.8' height='2.2' rx='0.9' fill='#22283a' />
		</svg>
	);
}
