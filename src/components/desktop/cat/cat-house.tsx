/**
 * The cat's house, in a 92×74 box.
 *
 * The doorway is deliberately the darkest thing in the drawing: the cat
 * shrinks into it and the shape has to read as somewhere it could have gone.
 * When the cat is inside, two eyes appear in that dark — otherwise "off" would
 * look like the pet had simply been deleted.
 */

export const HOUSE_W = 92;
export const HOUSE_H = 74;
/** Where the doorway sits across the house, as a fraction of its width. */
export const DOOR_CENTRE = 0.5;

export default function CatHouse({ occupied }: { occupied: boolean }) {
	return (
		<svg
			className='cat-house-art'
			viewBox='0 0 92 74'
			width={HOUSE_W}
			height={HOUSE_H}
			aria-hidden='true'>
			<defs>
				<linearGradient id='ch-roof' x1='0' y1='0' x2='0.4' y2='1'>
					<stop offset='0' stopColor='#e07a5f' />
					<stop offset='1' stopColor='#b4543c' />
				</linearGradient>
				<linearGradient id='ch-wall' x1='0' y1='0' x2='0.3' y2='1'>
					<stop offset='0' stopColor='#f3e0cb' />
					<stop offset='1' stopColor='#dcc3a6' />
				</linearGradient>
			</defs>

			{/* Body */}
			<rect x='9' y='30' width='74' height='42' rx='3' fill='url(#ch-wall)' />
			{/* Roof, overhanging on both sides the way a real one does */}
			<path d='M46 4 88 32H4Z' fill='url(#ch-roof)' />
			<path d='M46 4 88 32h-6L46 11Z' fill='#fff' fillOpacity='0.18' />

			{/* Doorway */}
			<path
				d='M32 72V50a14 14 0 0 1 28 0v22Z'
				fill='#2a1f18'
			/>
			{occupied && (
				/* Somebody is home. */
				<g className='cat-house-eyes'>
					<ellipse cx='40.5' cy='58' rx='2.6' ry='3' fill='#ffd97a' />
					<ellipse cx='51.5' cy='58' rx='2.6' ry='3' fill='#ffd97a' />
					<ellipse cx='40.5' cy='58' rx='1' ry='3' fill='#3a2a14' />
					<ellipse cx='51.5' cy='58' rx='1' ry='3' fill='#3a2a14' />
				</g>
			)}

			{/* A plate over the door, because every cat house has one */}
			<rect x='36' y='36' width='20' height='8' rx='2' fill='#b4543c' />
			<path
				d='M43 40.2a1.6 1.6 0 0 1 3-1 1.6 1.6 0 0 1 3 1c0 1.3-3 3-3 3s-3-1.7-3-3Z'
				fill='#ffd7c8'
				transform='translate(-3 -0.2)'
			/>

			{/* Ground shadow so it sits on the floor rather than floating */}
			<ellipse cx='46' cy='72.5' rx='40' ry='2.4' fill='#000' fillOpacity='0.18' />
		</svg>
	);
}
