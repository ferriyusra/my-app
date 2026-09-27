'use client';

import { useEffect, useRef } from 'react';
import type { SnapZone } from '@/types/windows';

type Cell = { zone: SnapZone; style?: React.CSSProperties };
type Layout = {
	label: string;
	cols: string;
	rows: string;
	cells: Cell[];
};

/**
 * Windows 11's Snap Layouts. Hovering the maximise button, or pressing ↓ on
 * it, offers layout positions instead of only maximise; each thumbnail is a
 * miniature of the screen whose regions are individually clickable.
 *
 * The cells are one arrow-key group rather than twelve Tab stops, so the
 * panel costs a keyboard reader one stop, not twelve. Escape closes the panel
 * and gives focus back to maximise — and is marked handled, so the window
 * underneath, which also closes on Escape, stands down.
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
	onEscape,
	takeFocus = false,
}: {
	onSnap: (zone: SnapZone) => void;
	onDismiss: () => void;
	onEscape: () => void;
	/** Opened from the keyboard: put focus on the first cell. */
	takeFocus?: boolean;
}) {
	const root = useRef<HTMLDivElement>(null);
	const cells = () =>
		Array.from(root.current?.querySelectorAll<HTMLButtonElement>('.snap-cell') ?? []);

	useEffect(() => {
		if (takeFocus) cells()[0]?.focus();
	}, [takeFocus]);

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			onEscape();
			return;
		}
		const list = cells();
		const i = list.indexOf(document.activeElement as HTMLButtonElement);
		const to =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? i + 1
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? i - 1
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? list.length - 1
							: null;
		if (to === null) return;
		e.preventDefault();
		list[(to + list.length) % list.length]?.focus();
	};

	return (
		<div
			ref={root}
			className='snap-flyout'
			role='group'
			aria-label='Snap layouts'
			onKeyDown={onKeyDown}
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
							tabIndex={-1}
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
