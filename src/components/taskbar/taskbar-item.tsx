'use client';

import { memo, useEffect, useRef, useState } from 'react';
import AppTile from '@/components/ui/app-tile';
import type { AppDef } from '@/components/apps/registry';

/**
 * One taskbar button.
 *
 * Windows draws a short bar under a running app and widens it when that app
 * has focus, and floats a preview card after the pointer rests on it. Both
 * are what make a strip of icons read as a taskbar rather than a toolbar.
 */
function TaskbarItem({
	app,
	running,
	active,
	onActivate,
	onContextMenu,
}: {
	app: AppDef;
	running: boolean;
	active: boolean;
	onActivate: () => void;
	onContextMenu: (e: React.MouseEvent) => void;
}) {
	const [preview, setPreview] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const arm = () => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setPreview(true), 450);
	};
	const disarm = () => {
		if (timer.current) clearTimeout(timer.current);
		setPreview(false);
	};

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	return (
		<span className='tb-slot' onPointerEnter={arm} onPointerLeave={disarm}>
			<button
				type='button'
				className='tb-btn'
				/* The anchor a minimising window shrinks into. */
				data-app-id={app.id}
				data-running={running || undefined}
				data-active={active || undefined}
				aria-label={
					running
						? `${app.title} — running${active ? ', focused' : ''}`
						: `Open ${app.title}`
				}
				aria-pressed={running}
				onClick={() => {
					disarm();
					onActivate();
				}}
				onContextMenu={onContextMenu}
				onFocus={arm}
				onBlur={disarm}>
				<AppTile tile={app.tile} size={24} />
				<span className='tb-indicator' aria-hidden='true' />
			</button>

			{preview && (
				<span className='tb-preview' role='tooltip'>
					<span className='tb-preview-head'>
						<AppTile tile={app.tile} size={16} />
						{app.title}
					</span>
					<span className='tb-preview-body'>
						{running ? app.blurb : `Not running · ${app.blurb}`}
					</span>
				</span>
			)}
		</span>
	);
}

export default memo(TaskbarItem);
