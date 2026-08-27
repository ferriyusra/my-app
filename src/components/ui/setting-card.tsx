'use client';

import type { IconLike } from '@/components/icons/line-icons';


/**
 * One Settings row: a tinted glyph, a title over a description, and whatever
 * control belongs on the right. Fluent's card, not a generic list item.
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
	/** Background for the glyph plate. Defaults to the accent. */
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
						style={tint ? { background: tint } : undefined}>
						<Icon size={18} />
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
