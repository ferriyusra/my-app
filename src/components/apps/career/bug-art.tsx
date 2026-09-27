/**
 * A bug, drawn. Inline SVG in `currentColor`, like the character, so it
 * follows the theme and ships no image bytes. The body is the label plate —
 * the name sits on it in CSS — and six legs make it read as a bug rather than
 * a badge.
 */
export default function BugArt() {
	return (
		<svg className='cx-bug-svg' width='28' height='22' viewBox='0 0 28 22' aria-hidden='true'>
			<g className='cx-bug-legs' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round'>
				<path d='M8 14 L3 19' />
				<path d='M14 15 L14 21' />
				<path d='M20 14 L25 19' />
				<path d='M8 10 L2 9' />
				<path d='M20 10 L26 9' />
			</g>
			<ellipse cx='14' cy='10' rx='9' ry='7' fill='currentColor' />
			<circle cx='10.5' cy='7.5' r='1.4' fill='var(--surface)' />
			<circle cx='17.5' cy='7.5' r='1.4' fill='var(--surface)' />
			<path d='M11 2 L9 0 M17 2 L19 0' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
		</svg>
	);
}
