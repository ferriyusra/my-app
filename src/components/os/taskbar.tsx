'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, Sun, Moon } from 'lucide-react';
import { useWindows } from './window-store';
import { APPS } from './apps/registry';
import { useTheme } from '../theme-provider';

/**
 * Windows 11 taskbar: centred cluster, acrylic sheet, and a running
 * indicator under each open app.
 */
export default function Taskbar({
	startOpen,
	onToggleStart,
}: {
	startOpen: boolean;
	onToggleStart: () => void;
}) {
	const { windows, open, focus, minimise } = useWindows();
	const { theme, toggle, mounted } = useTheme();
	const [clock, setClock] = useState('');

	useEffect(() => {
		const tick = () => {
			const d = new Date();
			setClock(
				`${d.getHours().toString().padStart(2, '0')}:${d
					.getMinutes()
					.toString()
					.padStart(2, '0')}`,
			);
		};
		tick();
		const t = setInterval(tick, 30_000);
		return () => clearInterval(t);
	}, []);

	const topZ = Math.max(0, ...windows.map((w) => w.z));

	return (
		<div className='taskbar'>
			<div className='taskbar-centre'>
				<button
					type='button'
					className='tb-btn tb-start'
					aria-label='Start'
					aria-expanded={startOpen}
					onClick={onToggleStart}>
					<LayoutGrid size={20} aria-hidden='true' />
				</button>

				{APPS.map(({ id, title, Icon, tint }) => {
					const win = windows.find((w) => w.id === id);
					const isTop = !!win && !win.minimised && win.z === topZ;
					return (
						<button
							key={id}
							type='button'
							className='tb-btn'
							data-running={!!win}
							data-active={isTop}
							aria-label={win ? `${title} — open` : `Open ${title}`}
							aria-pressed={!!win}
							onClick={() => {
								if (!win) return open(id);
								if (isTop) return minimise(id);
								focus(id);
							}}>
							<Icon size={19} aria-hidden='true' style={{ color: tint }} />
							<span className='tb-indicator' aria-hidden='true' />
						</button>
					);
				})}
			</div>

			<div className='taskbar-right'>
				<button
					type='button'
					className='tb-tray'
					aria-label={
						mounted
							? theme === 'dark'
								? 'Switch to light mode'
								: 'Switch to dark mode'
							: 'Toggle colour theme'
					}
					onClick={toggle}>
					{mounted ? (
						theme === 'dark' ? (
							<Sun size={16} aria-hidden='true' />
						) : (
							<Moon size={16} aria-hidden='true' />
						)
					) : null}
				</button>
				<span className='tb-clock' suppressHydrationWarning>
					{clock}
				</span>
			</div>
		</div>
	);
}
