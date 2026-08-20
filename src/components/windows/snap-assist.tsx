'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { zoneRect } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { APP_BY_ID } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';

/**
 * Snap Assist: the panel Windows fills the free half with once a window has
 * been snapped to the other one, offering the rest of your windows to sit
 * beside it.
 *
 * It is the interaction Windows snapping is best known for, and the one thing
 * that makes snapping feel like a layout tool rather than a resize shortcut.
 */
export default function SnapAssist() {
	const { snapAssist, dismissSnapAssist } = useShell();
	const { windows, snap, focus, bounds } = useWindowManager();
	const reduce = useReducedMotion();

	/* Escape dismisses, as does anything that changes the layout underneath. */
	useEffect(() => {
		if (!snapAssist) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') dismissSnapAssist();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [snapAssist, dismissSnapAssist]);

	if (!snapAssist) return null;

	const candidates = windows.filter(
		(w) => w.id !== snapAssist.source && !w.minimised,
	);
	if (!candidates.length) return null;

	const r = zoneRect(snapAssist.zone, bounds());

	return (
		<motion.div
			className='sa'
			role='dialog'
			aria-label='Snap another window beside this one'
			initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
			style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
			onPointerDown={(e) => {
				if (e.target === e.currentTarget) dismissSnapAssist();
			}}>
			<div className='sa-inner'>
				<p className='sa-head'>Snap another window beside it</p>
				<ul className='sa-grid'>
					{candidates.map((w) => {
						const app = APP_BY_ID[w.id];
						return (
							<li key={w.id}>
								<button
									type='button'
									className='sa-card'
									onClick={() => {
										/* Plain `snap`, not `snapWindow`: filling the second
										   half completes the layout, so offering assist again
										   for the half we just filled would be a loop. */
										snap(w.id, snapAssist.zone, bounds());
										focus(w.id);
										dismissSnapAssist();
									}}>
									<span className='sa-thumb' aria-hidden='true'>
										<AppTile tile={app.tile} size={38} />
									</span>
									<span className='sa-name'>
										<AppTile tile={app.tile} size={16} />
										{app.title}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
				<button type='button' className='sa-skip' onClick={dismissSnapAssist}>
					Not now
				</button>
			</div>
		</motion.div>
	);
}
