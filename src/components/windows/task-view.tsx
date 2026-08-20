'use client';

import { X } from 'lucide-react';
import { useWindows } from '@/context/window-context';
import { APP_BY_ID } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';

/**
 * Task View: the overview Windows 11 opens from the taskbar, listing every
 * open window so one can be picked or dismissed. Real behaviour rather than
 * a decorative button — the taskbar already has enough of those.
 */
export default function TaskView({ onClose }: { onClose: () => void }) {
	const { windows, focus, close } = useWindows();

	return (
		<div
			className='taskview'
			role='dialog'
			aria-label='Task view'
			onPointerDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			{windows.length === 0 ? (
				<p className='taskview-empty'>No open windows</p>
			) : (
				<ul className='taskview-grid'>
					{windows.map((w) => {
						const app = APP_BY_ID[w.id];
						return (
							<li key={w.id}>
								<button
									type='button'
									className='taskview-card'
									onClick={() => {
										focus(w.id);
										onClose();
									}}>
									<span className='taskview-preview' aria-hidden='true'>
										<AppTile app={app} size={40} />
									</span>
									<span className='taskview-name'>
										<AppTile app={app} size={16} />
										{app.title}
									</span>
								</button>
								<button
									type='button'
									className='taskview-close'
									aria-label={`Close ${app.title}`}
									onClick={() => close(w.id)}>
									<X size={13} aria-hidden='true' />
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
