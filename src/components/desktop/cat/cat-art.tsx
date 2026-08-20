/**
 * The cat, side-on, in a 64×48 box.
 *
 * One drawing rather than a pose per state: the parts that need to move —
 * legs, tail, ears, eyelids — are separate elements, and CSS drives them from
 * a `data-mode` on the wrapper. A sprite sheet would have been fewer moving
 * pieces but would not scale, and this has to read at whatever size the
 * desktop is.
 */

export const CAT_W = 64;
export const CAT_H = 48;

export default function CatArt() {
	return (
		<svg
			className='cat-art'
			viewBox='0 0 64 48'
			width={CAT_W}
			height={CAT_H}
			aria-hidden='true'>
			{/* Tail, swaying from the hip */}
			<path
				className='cat-tail'
				d='M14 28C7 28 3.5 21 7.5 15'
				fill='none'
				stroke='var(--cat-fur-dark)'
				strokeWidth='4.2'
				strokeLinecap='round'
			/>

			{/* Far legs sit behind the body so the walk reads as depth */}
			<g className='cat-legs-back'>
				<rect className='cat-leg cat-leg-a' x='19' y='32' width='5' height='13' rx='2.5' />
				<rect className='cat-leg cat-leg-b' x='38' y='32' width='5' height='13' rx='2.5' />
			</g>

			<rect className='cat-body' x='12' y='17' width='36' height='20' rx='10' fill='var(--cat-fur)' />
			{/* Tabby stripes */}
			<g className='cat-stripes' fill='var(--cat-fur-dark)' opacity='0.55'>
				<rect x='20' y='18' width='3' height='7' rx='1.5' />
				<rect x='27' y='17.5' width='3' height='8' rx='1.5' />
				<rect x='34' y='18' width='3' height='7' rx='1.5' />
			</g>

			{/* Near legs, in front */}
			<g className='cat-legs-front'>
				<rect className='cat-leg cat-leg-c' x='25' y='32' width='5.5' height='13' rx='2.7' />
				<rect className='cat-leg cat-leg-d' x='44' y='32' width='5.5' height='13' rx='2.7' />
			</g>

			<g className='cat-head'>
				{/* Ears */}
				<path className='cat-ear cat-ear-l' d='M41 11.5 42 3.5 49 8.5Z' fill='var(--cat-fur)' />
				<path className='cat-ear cat-ear-r' d='M58 11.5 57 3.5 50 8.5Z' fill='var(--cat-fur)' />
				<path d='M43.2 10.4 43.8 6.2 47.6 9Z' fill='var(--cat-pink)' />
				<path d='M55.8 10.4 55.2 6.2 51.4 9Z' fill='var(--cat-pink)' />

				<circle cx='49.5' cy='18' r='11' fill='var(--cat-fur)' />
				{/* Muzzle */}
				<ellipse cx='52' cy='21.5' rx='6' ry='4.4' fill='var(--cat-cream)' />

				{/* Two sets of eyes; CSS shows whichever the mood calls for. */}
				<g className='cat-eyes-open' fill='#2c2118'>
					<ellipse cx='47' cy='16.6' rx='1.7' ry='2.1' />
					<ellipse cx='54.4' cy='16.6' rx='1.7' ry='2.1' />
				</g>
				<g
					className='cat-eyes-shut'
					fill='none'
					stroke='#2c2118'
					strokeWidth='1.5'
					strokeLinecap='round'>
					<path d='M45.2 16.8q1.8 1.8 3.6 0' />
					<path d='M52.6 16.8q1.8 1.8 3.6 0' />
				</g>

				<path d='M52 20.2 50.6 21.8h2.8Z' fill='var(--cat-pink)' />
				<g stroke='var(--cat-fur-dark)' strokeWidth='0.9' strokeLinecap='round' opacity='0.7'>
					<path d='M56.5 20.5 61.5 19' />
					<path d='M56.5 22 61.5 22.5' />
				</g>
			</g>
		</svg>
	);
}
