'use client';

import { useWindowManager } from '@/hooks/use-window-manager';
import { useShell } from '@/context/shell-context';
import { APP_BY_ID } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';
import { X } from 'lucide-react';

/**
 * Task View: the overview Windows opens from the taskbar, listing every open
 * window so one can be raised or dismissed. Real behaviour rather than a
 * decorative button — the taskbar already has enough of those.
 */
export default function TaskView({ onClose }: { onClose: () => void }) {
	const { windows, focus, closeWindow, minimiseAll } = useWindowManager();
	const { closeFlyout } = useShell();

	return (
		<div
			className='taskview'
			role='dialog'
			aria-label='Task view'
			onPointerDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className='taskview-inner'>
				{windows.length === 0 ? (
					<p className='taskview-empty'>
						No open windows. Double-click a desktop icon to start, or press F1
						for what this desktop does.
					</p>
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
											<AppTile tile={app.tile} size={44} />
											<em>{app.blurb}</em>
										</span>
										<span className='taskview-name'>
											<AppTile tile={app.tile} size={16} />
											{app.title}
										</span>
									</button>
									<button
										type='button'
										className='taskview-close'
										aria-label={`Close ${app.title}`}
										onClick={() => closeWindow(w.id)}>
										<X size={13} aria-hidden='true' />
									</button>
								</li>
							);
						})}
					</ul>
				)}

				{/* One desktop, named as one. Real virtual desktops would need a
				    second window partition, per-desktop z-ordering and a taskbar that
				    filtered by it — and a portfolio visitor switches between them
				    exactly never. A group of one was announcing a set that does not
				    exist; this is Show desktop, where Windows puts it. */}
				<div className='taskview-desktops'>
					<button
						type='button'
						className='taskview-desktop'
						onClick={() => {
							minimiseAll();
							closeFlyout();
						}}>
						<span aria-hidden='true' />
						Desktop
					</button>
				</div>
			</div>
		</div>
	);
}
