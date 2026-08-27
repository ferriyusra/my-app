'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, Pin, PinOff, SquareStack, X } from 'lucide-react';
import { LiSearch } from '@/components/icons/line-icons';
import { GitHubIcon } from '@/components/icons/app-icons';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { APP_BY_ID, APPS } from '@/components/apps/registry';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import WindowsLogo from '@/components/ui/windows-logo';
import TaskbarItem from './taskbar-item';
import SystemTray from './system-tray';
import { useClock } from '@/hooks/use-clock';
import { profile } from '@/data/profile';
import type { AppId } from '@/types/windows';

/** Windows 11 taskbar: a left widget, a centred cluster, and the tray. */
export default function Taskbar() {
	const { flyout, toggleFlyout, openFlyout, pinned, togglePin } = useShell();
	const { windows, topZ, toggleFromTaskbar, closeWindow, launch, minimiseAll } =
		useWindowManager();
	const { jakarta } = useClock();
	const [menu, setMenu] = useState<{ x: number; y: number; id: AppId } | null>(null);

	/* Pinned apps first, then anything else that is running — which is exactly
	   how Windows orders the strip. */
	const shown = useMemo(() => {
		const running = windows.map((w) => w.id);
		const extra = APPS.filter(
			(a) => running.includes(a.id) && !pinned.includes(a.id),
		).map((a) => a.id);
		return [...pinned, ...extra];
	}, [windows, pinned]);

	const itemMenu = (id: AppId): MenuEntry[] => {
		const app = APP_BY_ID[id];
		const running = windows.some((w) => w.id === id);
		const isPinned = pinned.includes(id);
		return [
			{ kind: 'label', label: app.title },
			{
				kind: 'item',
				label: running ? 'Bring to front' : 'Open',
				Icon: LayoutGrid,
				onSelect: () => launch(id),
			},
			{
				kind: 'item',
				label: isPinned ? 'Unpin from taskbar' : 'Pin to taskbar',
				Icon: isPinned ? PinOff : Pin,
				/* Unpinning the last pin would leave an empty strip. */
				disabled: isPinned && pinned.length === 1,
				onSelect: () => togglePin(id),
			},
			{ kind: 'separator' },
			{
				kind: 'item',
				label: 'Close window',
				Icon: X,
				danger: true,
				disabled: !running,
				onSelect: () => closeWindow(id),
			},
		];
	};

	return (
		<div className='taskbar'>
			{/* Windows puts a weather widget here. Ours carries something a
			    visitor can act on: what time it is where I am. */}
			<button
				type='button'
				className='tb-widget'
				onClick={() => launch('contact')}
				suppressHydrationWarning>
				<span className='tb-widget-dot' aria-hidden='true' />
				<span className='tb-widget-text'>
					<strong>{jakarta || '--:--'} in Jakarta</strong>
					{profile.availability}
				</span>
			</button>

			<div className='taskbar-centre'>
				<button
					type='button'
					className='tb-btn tb-start'
					aria-label='Start'
					aria-expanded={flyout === 'start'}
					data-active={flyout === 'start' || undefined}
					onClick={() => toggleFlyout('start')}>
					<WindowsLogo size={20} />
				</button>

				<button
					type='button'
					className='tb-btn'
					aria-label='LiSearch apps'
					onClick={() => openFlyout('start')}>
					<LiSearch size={19} aria-hidden='true' />
				</button>

				<button
					type='button'
					className='tb-btn'
					aria-label='Task view'
					aria-expanded={flyout === 'taskview'}
					data-active={flyout === 'taskview' || undefined}
					onClick={() => toggleFlyout('taskview')}>
					<SquareStack size={19} aria-hidden='true' />
				</button>

				<span className='tb-sep' aria-hidden='true' />

				{shown.map((id) => {
					const win = windows.find((w) => w.id === id);
					return (
						<TaskbarItem
							key={id}
							app={APP_BY_ID[id]}
							running={!!win}
							active={!!win && !win.minimised && win.z === topZ}
							onActivate={() => toggleFromTaskbar(id)}
							onContextMenu={(e) => {
								e.preventDefault();
								setMenu({ x: e.clientX, y: e.clientY, id });
							}}
						/>
					);
				})}

				{/* GitHub is a real destination, not an app — it leaves the page. */}
				<a
					className='tb-btn tb-link'
					href={profile.github}
					target='_blank'
					rel='noopener noreferrer'
					aria-label='GitHub profile — opens in a new tab'>
					{/* Its own mark, like every other app icon on the strip. The
					    Start, LiSearch and Task view glyphs stay line art because
					    those are system controls, which is what Windows does. */}
					<GitHubIcon size={22} />
				</a>
			</div>

			<SystemTray onShowDesktop={minimiseAll} />

			{menu && (
				<ContextMenu
					x={menu.x}
					y={menu.y}
					items={itemMenu(menu.id)}
					label='Taskbar app menu'
					onClose={() => setMenu(null)}
				/>
			)}
		</div>
	);
}
