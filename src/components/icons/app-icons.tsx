/**
 * Free-form app icons.
 *
 * Most Windows apps ship a tinted square with a white glyph, which `AppTile`
 * draws. A handful — the folder, the bin, the browser — are shaped artwork
 * instead, and drawing them as tiles is the single loudest tell that a page is
 * only *themed* like Windows. These are those.
 *
 * Each takes a `size` and paints inside a 32×32 box, so the same component
 * reads at 16px in a title bar and at 46px on the desktop.
 */

type IconProps = { size?: number };

function box(size: number) {
	return {
		width: size,
		height: size,
		viewBox: '0 0 32 32',
		fill: 'none',
		'aria-hidden': true as const,
	};
}

/** File Explorer's manila folder: a darker back leaf under a lighter face. */
export function FolderIcon({ size = 32 }: IconProps) {
	const id = 'fld';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-back`} x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0' stopColor='#f0b429' />
					<stop offset='1' stopColor='#d99512' />
				</linearGradient>
				<linearGradient id={`${id}-face`} x1='0.1' y1='0' x2='0.9' y2='1'>
					<stop offset='0' stopColor='#ffdd7d' />
					<stop offset='1' stopColor='#f6b93b' />
				</linearGradient>
			</defs>
			{/* Back leaf with the tab */}
			<path
				d='M2.5 8.2a2 2 0 0 1 2-2h7.1a2 2 0 0 1 1.42.59l1.6 1.6a2 2 0 0 0 1.41.59h11.57a2 2 0 0 1 2 2v13.4a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2Z'
				fill={`url(#${id}-back)`}
			/>
			{/* Front face, offset down so the back leaf reads as a separate sheet */}
			<path
				d='M2.5 12.6h27.1v11.78a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2Z'
				fill={`url(#${id}-face)`}
			/>
			<path d='M2.5 12.6h27.1v1.1H2.5Z' fill='#fff' fillOpacity='0.45' />
		</svg>
	);
}

/** The browser mark: a swirled ring with a crescent bitten out of it. */
export function BrowserIcon({ size = 32 }: IconProps) {
	const id = 'brw';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.15' y1='0.05' x2='0.8' y2='0.95'>
					<stop offset='0' stopColor='#2ea7e0' />
					<stop offset='0.55' stopColor='#1668c8' />
					<stop offset='1' stopColor='#0b2f8a' />
				</linearGradient>
				<linearGradient id={`${id}-b`} x1='0.05' y1='1' x2='0.95' y2='0.15'>
					<stop offset='0' stopColor='#6ff0c8' />
					<stop offset='0.5' stopColor='#28c8e8' />
					<stop offset='1' stopColor='#2b8fe0' />
				</linearGradient>
			</defs>
			<circle cx='16' cy='16' r='13.2' fill={`url(#${id}-a)`} />
			{/* The comma sweeping up from the lower left — the shape that makes
			    this read as a browser rather than a generic blue disc. */}
			<path
				d='M4.2 21.6a13.2 13.2 0 0 0 22.9 1.5c-3.1 2.6-7 3.6-10.9 3.1-4.6-.6-7.6-3.5-7.4-6.7.15-2.4 1.9-4.3 4.4-5.1-4.6-.5-8.4 2.1-9.4 5.5a8.6 8.6 0 0 0 .4 1.7Z'
				fill={`url(#${id}-b)`}
			/>
			{/* Top highlight: every Fluent sphere carries one. */}
			<path
				d='M16 2.8a13.2 13.2 0 0 1 12.3 8.4c-2-3-5.5-4.6-9.3-4.6-4.9 0-8.7 2.4-10.4 5.9A13.2 13.2 0 0 1 16 2.8Z'
				fill='#ffffff'
				fillOpacity='0.26'
			/>
		</svg>
	);
}

/** The editor mark: a folded blue ribbon with a notch cut from its spine. */
export function CodeIcon({ size = 32 }: IconProps) {
	const id = 'cde';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.1' y1='0' x2='0.9' y2='1'>
					<stop offset='0' stopColor='#4fc3f7' />
					<stop offset='1' stopColor='#1177bb' />
				</linearGradient>
			</defs>
			{/* The ribbon: right-hand bar, the long chevron, and the left tail. */}
			<path
				d='M24.19 2.59 30.72 5.73v20.54l-6.53 3.14-14.34-13.66-6.05 4.61L1.28 19 6.72 16 1.28 13l2.53-1.34 6.05 4.61Z'
				fill={`url(#${id}-a)`}
			/>
			{/* The fold, a shade darker so the ribbon reads as wrapped. */}
			<path d='M24.19 8.64v14.72L14.46 16Z' fill='#0b3f63' fillOpacity='0.34' />
		</svg>
	);
}

/** The Recycle Bin: a translucent grey drum with the chasing-arrows mark. */
export function RecycleIcon({ size = 32 }: IconProps) {
	const id = 'rcy';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0' y1='0' x2='1' y2='0'>
					<stop offset='0' stopColor='#e6ebf1' stopOpacity='0.95' />
					<stop offset='0.5' stopColor='#c3ccd6' stopOpacity='0.8' />
					<stop offset='1' stopColor='#9aa5b1' stopOpacity='0.95' />
				</linearGradient>
			</defs>
			{/* Lid */}
			<rect x='5.6' y='6.4' width='20.8' height='3.4' rx='1.7' fill='#8d99a6' />
			<rect x='12.6' y='4' width='6.8' height='2.6' rx='1.3' fill='#8d99a6' />
			{/* Drum */}
			<path
				d='M7.2 10.6h17.6l-1.5 16.1a2 2 0 0 1-2 1.82h-9.6a2 2 0 0 1-2-1.82Z'
				fill={`url(#${id}-a)`}
				stroke='#7d8894'
				strokeWidth='0.8'
			/>
			{/* Chasing arrows, simplified to three wedges around a centre */}
			<g fill='#3f8f4a'>
				<path d='M16 13.4l2.5 4.3h-5Z' />
				<path d='M11.2 24.2l-1.4-4.8 4.3 2.5Z' />
				<path d='M20.8 24.2l-2.9-2.3 4.3-2.5Z' />
			</g>
		</svg>
	);
}

/** A plain document sheet with a folded corner, for Resume shortcuts. */
export function DocumentIcon({ size = 32 }: IconProps) {
	const id = 'doc';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0' y1='0' x2='0.6' y2='1'>
					<stop offset='0' stopColor='#ffffff' />
					<stop offset='1' stopColor='#e4e8ee' />
				</linearGradient>
			</defs>
			<path
				d='M7 3.4h11.2L26 11.2v17.4a1.6 1.6 0 0 1-1.6 1.6H7a1.6 1.6 0 0 1-1.6-1.6V5a1.6 1.6 0 0 1 1.6-1.6Z'
				fill={`url(#${id}-a)`}
				stroke='#c3ccd6'
				strokeWidth='0.9'
			/>
			<path d='M18.2 3.4 26 11.2h-6.2a1.6 1.6 0 0 1-1.6-1.6Z' fill='#c9d2dc' />
			<g fill='#c43e1c'>
				<rect x='4.2' y='16.4' width='14.4' height='8.4' rx='1.4' />
			</g>
			<text
				x='11.4'
				y='22.6'
				textAnchor='middle'
				fill='#fff'
				fontSize='5.4'
				fontWeight='700'
				fontFamily='Segoe UI, sans-serif'>
				PDF
			</text>
		</svg>
	);
}

/** This PC: the small monitor Explorer uses for the machine root. */
export function ThisPcIcon({ size = 32 }: IconProps) {
	return (
		<svg {...box(size)}>
			<rect
				x='3.4'
				y='6'
				width='25.2'
				height='16.4'
				rx='1.8'
				fill='#4a5a6a'
			/>
			<rect x='5.2' y='7.8' width='21.6' height='12.8' rx='1' fill='#4cc2ff' />
			<path
				d='M5.2 7.8h21.6v5.2c-6.4 2.4-14.4 2.6-21.6.4Z'
				fill='#fff'
				fillOpacity='0.22'
			/>
			<path d='M11.6 24.2h8.8l1 3.4h-10.8Z' fill='#4a5a6a' />
			<rect x='8.6' y='27' width='14.8' height='2' rx='1' fill='#3c4a58' />
		</svg>
	);
}
