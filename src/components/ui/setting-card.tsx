'use client';

import type { IconLike } from '@/components/icons/line-icons';


/**
 * One Settings row: a glyph, a title over a description, and whatever
 * control belongs on the right. Fluent's card, not a generic list item.
 *
 * The glyph is plain, as Windows 11 Settings draws it. Every card used to
 * lead with the same blue plate, so a page of five cards showed five
 * identical blue squares and the accent meant nothing by the time it reached
 * the CV button. A plate is drawn only when a card has a state to report —
 * `tint` — which is what Settings ▸ Activation uses it for.
 */
export default function SettingCard({
	Icon,
	tint,
	title,
	description,
	control,
	children,
}: {
	Icon?: IconLike;
	/** Draws a plate behind the glyph, in this colour, for a card that reports
	    a state. Without it the glyph is plain. */
	tint?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	control?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<section className='st-card'>
			<div className='st-card-row'>
				{Icon && (
					<span
						className='st-card-icon'
						aria-hidden='true'
						data-plate={tint ? '' : undefined}
						style={tint ? { background: tint } : undefined}>
						<Icon size={tint ? 18 : 20} />
					</span>
				)}
				<div className='st-card-text'>
					<h3>{title}</h3>
					{description && <p>{description}</p>}
				</div>
				{control && <div className='st-card-control'>{control}</div>}
			</div>
			{children && <div className='st-card-extra'>{children}</div>}
		</section>
	);
}
