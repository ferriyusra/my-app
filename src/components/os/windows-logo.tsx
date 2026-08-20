/** The Windows 11 mark: four panes with an even gutter. */
export default function WindowsLogo({ size = 20 }: { size?: number }) {
	const pane = 8.6;
	const gap = 2.8;
	const o = pane + gap;
	return (
		<svg
			width={size}
			height={size}
			viewBox='0 0 20 20'
			fill='currentColor'
			aria-hidden='true'>
			<rect x='0' y='0' width={pane} height={pane} rx='0.8' />
			<rect x={o} y='0' width={pane} height={pane} rx='0.8' />
			<rect x='0' y={o} width={pane} height={pane} rx='0.8' />
			<rect x={o} y={o} width={pane} height={pane} rx='0.8' />
		</svg>
	);
}
