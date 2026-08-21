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

/** About: a person on an accent disc, the way Windows draws an account. */
export function PersonIcon({ size = 32 }: IconProps) {
	const id = 'per';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.15' y1='0' x2='0.85' y2='1'>
					<stop offset='0' stopColor='#5ac8fa' />
					<stop offset='1' stopColor='#0f5fbd' />
				</linearGradient>
			</defs>
			<circle cx='16' cy='16' r='13.4' fill={`url(#${id}-a)`} />
			{/* Head and shoulders as two solid shapes — an outline this small
			    turns to mush at 16px, which is where the title bar draws it. */}
			<circle cx='16' cy='12.6' r='4.7' fill='#fff' />
			<path
				d='M16 18.6c4.5 0 8.2 2.7 8.9 6.3a13.4 13.4 0 0 1-17.8 0c.7-3.6 4.4-6.3 8.9-6.3Z'
				fill='#fff'
			/>
			<path
				d='M16 2.6a13.4 13.4 0 0 1 12.4 8.3c-1.7-3.2-5.4-5-9.5-5-5.1 0-9 2.6-10.6 6.2A13.4 13.4 0 0 1 16 2.6Z'
				fill='#fff'
				fillOpacity='0.22'
			/>
		</svg>
	);
}

/** Skills: three isometric plates, stacked the way Fluent draws layers. */
export function LayersIcon({ size = 32 }: IconProps) {
	const id = 'lyr';
	const plate = (cy: number) => `M16 ${cy - 5.6} 28 ${cy} 16 ${cy + 5.6} 4 ${cy}Z`;
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0' stopColor='#c7a8ff' />
					<stop offset='1' stopColor='#8b5cf6' />
				</linearGradient>
				<linearGradient id={`${id}-b`} x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0' stopColor='#a97dff' />
					<stop offset='1' stopColor='#6d3fd4' />
				</linearGradient>
			</defs>
			<path d={plate(23.4)} fill='#4c2a9e' />
			<path d={plate(18.2)} fill={`url(#${id}-b)`} />
			<path d={plate(11.4)} fill={`url(#${id}-a)`} />
		</svg>
	);
}

/** Experience: a briefcase with a lid band and a clasp. */
export function BriefcaseIcon({ size = 32 }: IconProps) {
	const id = 'bag';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.1' y1='0' x2='0.9' y2='1'>
					<stop offset='0' stopColor='#5fe3d0' />
					<stop offset='1' stopColor='#0d7a6e' />
				</linearGradient>
			</defs>
			{/* Handle */}
			<path
				d='M12.4 8.4V6.9a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.5'
				fill='none'
				stroke='#0b5d54'
				strokeWidth='2.2'
				strokeLinecap='round'
			/>
			<rect x='2.8' y='8.4' width='26.4' height='18.2' rx='2.6' fill={`url(#${id}-a)`} />
			{/* The band across the middle, and the clasp sitting on it. */}
			<rect x='2.8' y='15.2' width='26.4' height='3.4' fill='#0b5d54' fillOpacity='0.28' />
			<rect x='13.6' y='14.2' width='4.8' height='5.4' rx='1.1' fill='#f2fbf9' />
			<path d='M2.8 11a2.6 2.6 0 0 1 2.6-2.6h21.2A2.6 2.6 0 0 1 29.2 11Z' fill='#fff' fillOpacity='0.2' />
		</svg>
	);
}

/**
 * Career.exe: a retro handheld, because the window it opens is the one place
 * on this desktop that admits to being a toy. Shaped, not line art — the same
 * rule every other icon here follows.
 */
export function CareerIcon({ size = 32 }: IconProps) {
	const id = 'cx';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.15' y1='0' x2='0.85' y2='1'>
					<stop offset='0' stopColor='#8b7bf0' />
					<stop offset='1' stopColor='#4c3ab5' />
				</linearGradient>
			</defs>
			{/* Body */}
			<rect x='5.4' y='3' width='21.2' height='26' rx='3.4' fill={`url(#${id}-a)`} />
			{/* Screen */}
			<rect x='8.4' y='6.2' width='15.2' height='11' rx='1.6' fill='#12103a' />
			{/* Two bars on the screen, the XP the app is about */}
			<rect x='10.2' y='9' width='11.6' height='1.9' rx='0.95' fill='#5fe3d0' />
			<rect x='10.2' y='12.2' width='7.2' height='1.9' rx='0.95' fill='#5fe3d0' fillOpacity='0.5' />
			{/* D-pad */}
			<path
				d='M11.6 21.4h1.9v-1.9h1.9v1.9h1.9v1.9h-1.9v1.9h-1.9v-1.9h-1.9z'
				fill='#1d1a4d'
			/>
			{/* Two buttons */}
			<circle cx='21.4' cy='21' r='1.7' fill='#ff6b8a' />
			<circle cx='24.4' cy='24' r='1.7' fill='#ffd36b' />
			{/* The sheen every other icon in this set carries */}
			<path d='M5.4 6.4A3.4 3.4 0 0 1 8.8 3h14.4a3.4 3.4 0 0 1 3.4 3.4Z' fill='#fff' fillOpacity='0.18' />
		</svg>
	);
}

/** Contact: the Mail envelope, flap closed. */
export function MailIcon({ size = 32 }: IconProps) {
	const id = 'mal';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.1' y1='0' x2='0.9' y2='1'>
					<stop offset='0' stopColor='#59b4f0' />
					<stop offset='1' stopColor='#12489c' />
				</linearGradient>
			</defs>
			<rect x='2.6' y='7.2' width='26.8' height='17.6' rx='2.8' fill={`url(#${id}-a)`} />
			{/* The flap: one solid white chevron reads as an envelope at any size. */}
			<path
				d='M3.8 9.3a2.8 2.8 0 0 1 2.4-1.4h19.6a2.8 2.8 0 0 1 2.4 1.4L16 16.6Z'
				fill='#fff'
			/>
			<path d='M3.4 9 16 16.6 28.6 9l.8 1.1L16 18.4 2.6 10.1Z' fill='#0a3670' fillOpacity='0.25' />
		</svg>
	);
}

/** Settings: the grey gear, eight teeth around a hollow hub. */
export function GearIcon({ size = 32 }: IconProps) {
	const id = 'gea';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.15' y1='0' x2='0.85' y2='1'>
					<stop offset='0' stopColor='#b6c0cb' />
					<stop offset='1' stopColor='#5a6675' />
				</linearGradient>
			</defs>
			<g fill={`url(#${id}-a)`}>
				{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
					<rect
						key={a}
						x='13.9'
						y='1.9'
						width='4.2'
						height='7.6'
						rx='1.5'
						transform={`rotate(${a} 16 16)`}
					/>
				))}
				<circle cx='16' cy='16' r='10.2' />
			</g>
			<circle cx='16' cy='16' r='4.3' fill='#eef1f5' />
			<path d='M16 5.8a10.2 10.2 0 0 1 9.6 6.8c-1.6-3-5.2-5-9.6-5s-8 2-9.6 5A10.2 10.2 0 0 1 16 5.8Z' fill='#fff' fillOpacity='0.25' />
		</svg>
	);
}

/**
 * GitHub and LinkedIn keep their own marks on their own colours — those are
 * the icons those products actually ship, so drawing something else here would
 * make the shortcuts harder to recognise, not easier.
 */
export function GitHubIcon({ size = 32 }: IconProps) {
	return (
		<svg {...box(size)}>
			<rect width='32' height='32' rx='7' fill='#1b1f24' />
			<g transform='translate(5.5 5.5) scale(0.875)'>
				<path
					fill='#fff'
					d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
				/>
			</g>
		</svg>
	);
}

export function LinkedInIcon({ size = 32 }: IconProps) {
	return (
		<svg {...box(size)}>
			<rect width='32' height='32' rx='7' fill='#0a66c2' />
			<g transform='translate(4 4) scale(1)'>
				<path
					fill='#fff'
					d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452z'
				/>
			</g>
		</svg>
	);
}

/** Media Player: a play mark over a disc, on the gradient it ships with. */
export function MediaIcon({ size = 32 }: IconProps) {
	const id = 'med';
	return (
		<svg {...box(size)}>
			<defs>
				<linearGradient id={`${id}-a`} x1='0.1' y1='0' x2='0.9' y2='1'>
					<stop offset='0' stopColor='#7aa8ff' />
					<stop offset='0.55' stopColor='#3d63e0' />
					<stop offset='1' stopColor='#6b3fd4' />
				</linearGradient>
			</defs>
			<rect width='32' height='32' rx='7' fill={`url(#${id}-a)`} />
			{/* A ring behind the play mark reads as a disc without the clutter
			    of grooves, which vanish at 16px anyway. */}
			<circle
				cx='16'
				cy='16'
				r='9.4'
				fill='none'
				stroke='#fff'
				strokeOpacity='0.45'
				strokeWidth='1.6'
			/>
			<path d='M13.4 11.3 21.6 16l-8.2 4.7Z' fill='#fff' />
			<path
				d='M32 9.5A7 7 0 0 0 25 2.6H7A7 7 0 0 0 0 9.5C1.9 6 8.2 3.6 16 3.6s14.1 2.4 16 5.9Z'
				fill='#fff'
				fillOpacity='0.18'
			/>
		</svg>
	);
}
