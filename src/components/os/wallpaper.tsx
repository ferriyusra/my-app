'use client';

/**
 * A stand-in for the Windows 11 "Bloom" wallpaper.
 *
 * Bloom is a translucent flower: soft petals radiating from a point,
 * screen-blended over a deep blue field. Eight rotated, heavily blurred
 * ellipses get close enough, and being SVG it scales to any viewport and
 * re-tints with the theme without shipping an image.
 */
const PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

export default function Wallpaper() {
	return (
		<svg
			className='wallpaper'
			viewBox='0 0 1600 1000'
			preserveAspectRatio='xMidYMid slice'
			aria-hidden='true'>
			<defs>
				<radialGradient id='wp-field' cx='50%' cy='46%' r='78%'>
					<stop offset='0%' stopColor='var(--wp-field-in)' />
					<stop offset='100%' stopColor='var(--wp-field-out)' />
				</radialGradient>

				{/* Bright at the tip, fading to nothing at the centre — that
				    gradient down each petal is what reads as a bloom rather
				    than a glow. */}
				<linearGradient id='wp-petal' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='var(--wp-petal-a)' stopOpacity='0' />
					<stop offset='34%' stopColor='var(--wp-petal-a)' stopOpacity='0.85' />
					<stop offset='68%' stopColor='var(--wp-petal-b)' stopOpacity='0.55' />
					<stop offset='100%' stopColor='var(--wp-petal-c)' stopOpacity='0' />
				</linearGradient>

				{/* The default filter region is a percentage of the element box,
				    which clipped the blurred petals into rectangles. Pinning it to
				    user space with generous bounds lets the blur run off freely. */}
				<filter
					id='wp-soft'
					filterUnits='userSpaceOnUse'
					x='-1000'
					y='-1000'
					width='2000'
					height='2000'>
					<feGaussianBlur stdDeviation='16' />
				</filter>
			</defs>

			<rect width='1600' height='1000' fill='url(#wp-field)' />

			{/* The bloom itself, drawn once and rotated into a rosette. */}
			<g
				transform='translate(800 470)'
				filter='url(#wp-soft)'
				style={{ mixBlendMode: 'screen' }}>
				{PETALS.map((deg, i) => (
					<ellipse
						key={deg}
						rx={i % 2 === 0 ? 74 : 52}
						ry={i % 2 === 0 ? 330 : 250}
						cy={i % 2 === 0 ? -215 : -170}
						fill='url(#wp-petal)'
						transform={`rotate(${deg})`}
					/>
				))}
			</g>

			{/* A second, tighter rosette gives the centre its glow. */}
			<g
				transform='translate(800 470) scale(0.46)'
				filter='url(#wp-soft)'
				style={{ mixBlendMode: 'screen' }}>
				{PETALS.map((deg) => (
					<ellipse
						key={deg}
						rx={62}
						ry={300}
						cy={-190}
						fill='url(#wp-petal)'
						transform={`rotate(${deg + 22})`}
					/>
				))}
			</g>
		</svg>
	);
}
