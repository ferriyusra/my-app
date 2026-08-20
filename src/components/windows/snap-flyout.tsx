'use client';

import type { SnapZone } from '@/types/windows';

type Cell = { zone: SnapZone; style?: React.CSSProperties };
type Layout = {
	label: string;
	cols: string;
	rows: string;
	cells: Cell[];
};

/**
 * Windows 11's Snap Layouts. Hovering or focusing the maximise button offers
 * layout positions instead of only maximise; each thumbnail is a miniature of
 * the screen whose regions are individually clickable.
 */
const LAYOUTS: Layout[] = [
	{
		label: 'Two columns',
		cols: '1fr 1fr',
		rows: '1fr',
		cells: [{ zone: 'left' }, { zone: 'right' }],
	},
	{
		label: 'Three columns',
		cols: '1fr 1fr 1fr',
		rows: '1fr',
		cells: [{ zone: 'third-l' }, { zone: 'third-c' }, { zone: 'third-r' }],
	},
	{
		label: 'Wide left, two stacked right',
		cols: '2fr 1fr',
		rows: '1fr 1fr',
		cells: [
			{ zone: 'wide-l', style: { gridRow: 'span 2' } },
			{ zone: 'stack-tr' },
			{ zone: 'stack-br' },
		],
	},
	{
		label: 'Four quadrants',
		cols: '1fr 1fr',
		rows: '1fr 1fr',
		cells: [{ zone: 'tl' }, { zone: 'tr' }, { zone: 'bl' }, { zone: 'br' }],
	},
];

const ZONE_LABEL: Record<SnapZone, string> = {
	left: 'Snap to the left half',
	right: 'Snap to the right half',
	tl: 'Snap to the top-left quarter',
	tr: 'Snap to the top-right quarter',
	bl: 'Snap to the bottom-left quarter',
	br: 'Snap to the bottom-right quarter',
	'third-l': 'Snap to the left third',
	'third-c': 'Snap to the centre third',
	'third-r': 'Snap to the right third',
	'wide-l': 'Snap to the left two-thirds',
	'stack-tr': 'Snap to the top-right third',
	'stack-br': 'Snap to the bottom-right third',
	max: 'Maximise',
};

export default function SnapFlyout({
	onSnap,
	onDismiss,
}: {
	onSnap: (zone: SnapZone) => void;
	onDismiss: () => void;
}) {
	return (
		<div
			className='snap-flyout'
			role='group'
			aria-label='Snap layouts'
			onPointerDown={(e) => e.stopPropagation()}>
			{LAYOUTS.map((layout) => (
				<div
					key={layout.label}
					className='snap-layout'
					role='group'
					aria-label={layout.label}
					style={{
						gridTemplateColumns: layout.cols,
						gridTemplateRows: layout.rows,
					}}>
					{layout.cells.map((cell) => (
						<button
							key={cell.zone}
							type='button'
							className='snap-cell'
							style={cell.style}
							title={ZONE_LABEL[cell.zone]}
							aria-label={ZONE_LABEL[cell.zone]}
							onClick={() => {
								onSnap(cell.zone);
								onDismiss();
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}
