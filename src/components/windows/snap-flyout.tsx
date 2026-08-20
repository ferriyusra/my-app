'use client';

import type { SnapZone } from '@/types/windows';

/**
 * Windows 11's Snap Layouts: hovering (or focusing) the maximise button
 * offers layout positions instead of only maximise. Each option is a
 * miniature of the screen with the target zone filled.
 */
const LAYOUTS: { label: string; zones: SnapZone[]; cells: string }[] = [
	{ label: 'Split left and right', zones: ['left', 'right'], cells: '1fr 1fr' },
	{ label: 'Four quadrants', zones: ['tl', 'tr', 'bl', 'br'], cells: '1fr 1fr' },
];

const ZONE_LABEL: Record<SnapZone, string> = {
	left: 'Snap to left half',
	right: 'Snap to right half',
	tl: 'Snap to top-left quarter',
	tr: 'Snap to top-right quarter',
	bl: 'Snap to bottom-left quarter',
	br: 'Snap to bottom-right quarter',
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
			onMouseLeave={onDismiss}>
			{LAYOUTS.map(({ label, zones, cells }) => (
				<div
					key={label}
					className='snap-layout'
					style={{ gridTemplateColumns: cells }}
					aria-label={label}>
					{zones.map((z) => (
						<button
							key={z}
							type='button'
							className='snap-cell'
							title={ZONE_LABEL[z]}
							aria-label={ZONE_LABEL[z]}
							onClick={() => {
								onSnap(z);
								onDismiss();
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}
