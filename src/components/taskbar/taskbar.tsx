'use client';

import { useEffect, useState } from 'react';
import {
	Sun,
	Moon,
	Wifi,
	Volume2,
	BatteryFull,
	ChevronUp,
	Search,
	Copy,
} from 'lucide-react';
import { useWindows } from '@/context/window-context';
import { APPS } from '@/components/apps/registry';
import { useTheme } from '@/components/theme-provider';
import AppTile from '@/components/ui/app-tile';
import WindowsLogo from '@/components/ui/windows-logo';
import { profile } from '@/data/profile';

/** Windows 11 taskbar: a left widget, a centred cluster, and the tray. */
export default function Taskbar({
	startOpen,
	onToggleStart,
	taskViewOpen,
	onToggleTaskView,
	onSearch,
}: {
	startOpen: boolean;
	onToggleStart: () => void;
	taskViewOpen: boolean;
	onToggleTaskView: () => void;
	onSearch: () => void;
}) {
	const { windows, open, focus, minimise } = useWindows();
	const { theme, toggle, mounted } = useTheme();
	const [clock, setClock] = useState({ time: '', date: '', jakarta: '' });

	useEffect(() => {
		const tick = () => {
			const d = new Date();
			setClock({
				/* Windows shows a 12-hour clock over a short date, stacked. */
				time: d.toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
				}),
				date: d.toLocaleDateString('en-GB'),
				jakarta: d.toLocaleTimeString('en-US', {
					timeZone: 'Asia/Jakarta',
					hour: 'numeric',
					minute: '2-digit',
				}),
			});
		};
		tick();
		const t = setInterval(tick, 30_000);
		return () => clearInterval(t);
	}, []);

	const topZ = Math.max(0, ...windows.map((w) => w.z));

	return (
		<div className='taskbar'>
			{/* Windows puts a weather widget here. Ours carries something a
			    visitor can act on: what time it is where I am. */}
			<div className='tb-widget' suppressHydrationWarning>
				<span className='tb-widget-dot' aria-hidden='true' />
				<span>
					<strong>{clock.jakarta} in Jakarta</strong>
					{profile.availability}
				</span>
			</div>

			<div className='taskbar-centre'>
				<button
					type='button'
					className='tb-btn tb-start'
					aria-label='Start'
					aria-expanded={startOpen}
					onClick={onToggleStart}>
					<WindowsLogo size={19} />
				</button>

				<button
					type='button'
					className='tb-btn'
					aria-label='Search apps'
					onClick={onSearch}>
					<Search size={19} aria-hidden='true' />
				</button>

				<button
					type='button'
					className='tb-btn'
					aria-label='Task view'
					aria-expanded={taskViewOpen}
					data-active={taskViewOpen}
					onClick={onToggleTaskView}>
					<Copy size={18} aria-hidden='true' />
				</button>

				<span className='tb-sep' aria-hidden='true' />

				{APPS.map((app) => {
					const { id, title } = app;
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
							<AppTile app={app} size={26} />
							<span className='tb-indicator' aria-hidden='true' />
						</button>
					);
				})}
			</div>

			<div className='taskbar-right'>
				<span className='tb-chevron' aria-hidden='true'>
					<ChevronUp size={14} />
				</span>
				{/* Decorative: labelled as such rather than posing as controls. */}
				<span className='tb-trayicons' aria-hidden='true'>
					<Wifi size={15} />
					<Volume2 size={15} />
					<BatteryFull size={15} />
				</span>
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
					<span>{clock.time}</span>
					<span>{clock.date}</span>
				</span>
			</div>
		</div>
	);
}
