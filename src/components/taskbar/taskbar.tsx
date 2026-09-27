'use client';

import { useMemo, useState } from 'react';
import { LayoutGrid, Pin, PinOff, SquareStack, X } from 'lucide-react';
import { LiSearch } from '@/components/icons/line-icons';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { APP_BY_ID, APPS, SHORTCUT_BY_ID } from '@/components/apps/registry';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import WindowsLogo from '@/components/ui/windows-logo';
import TaskbarItem, { TaskbarLink } from './taskbar-item';
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
	   how Windows orders the strip. The CV and GitHub are pinned too, so they
	   sit with the pins, ahead of the running apps: they used to come last and
	   drift one slot right every time a window opened. */
	const extra = useMemo(() => {
		const running = windows.map((w) => w.id);
		return APPS.filter((a) => running.includes(a.id) && !pinned.includes(a.id)).map(
			(a) => a.id,
		);
	}, [windows, pinned]);

	const item = (id: AppId) => {
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
	};

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
			{/* Windows puts a weather widget here. Ours says whose desktop this
			    is and what I am open to, with the time where I am: the two lines
			    a visitor needs first, on the one surface no window covers. It
			    used to say only the time and "Available", which was the whole of
			    the person on the desktop once the first window was closed. */}
			<button
				type='button'
				className='tb-widget'
				onClick={() => launch('contact')}
				suppressHydrationWarning>
				<span className='tb-widget-dot' aria-hidden='true' />
				<span className='tb-widget-text'>
					<strong>
						{profile.name} · {profile.role}
					</strong>
					{profile.workType} · {jakarta || '--:--'} in Jakarta
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
					aria-label='Search apps'
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

				{pinned.map(item)}

				{/* The CV is the one real file on this desktop and the action a
				    visit succeeds in. It sits on the strip for the same reason
				    GitHub does: a destination, always one click away. Both are
				    real destinations, not apps — they leave the page. */}
				<TaskbarLink
					shortcut={SHORTCUT_BY_ID.resume}
					label='Resume — PDF, opens in a new tab'
				/>
				<TaskbarLink
					shortcut={SHORTCUT_BY_ID.github}
					label='GitHub profile — opens in a new tab'
				/>

				{extra.map(item)}
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
