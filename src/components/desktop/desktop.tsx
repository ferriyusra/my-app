'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WindowProvider, useWindows } from '@/context/window-context';
import { useTheme } from '@/components/theme-provider';
import WindowFrame from '@/components/windows/window';
import Taskbar from '@/components/taskbar/taskbar';
import StartMenu from '@/components/start-menu/start-menu';
import TaskView from '@/components/windows/task-view';
import { APPS, APP_BY_ID, RECYCLE, SHORTCUTS } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';
import DesktopIcon from './desktop-icon';
import ContextMenu, { MENU_ICONS, type MenuItem } from './context-menu';
import { profile } from '@/data/profile';

function DesktopIcons({
	selected,
	setSelected,
}: {
	selected: string | null;
	setSelected: (id: string | null) => void;
}) {
	const { open } = useWindows();
	return (
		<ul className='desk-icons'>
			{APPS.map((app) => (
				<li key={app.id}>
					<DesktopIcon
						title={app.title}
						selected={selected === app.id}
						onSelect={() => setSelected(app.id)}
						onOpen={() => open(app.id)}
						tile={<AppTile app={app} size={46} />}
					/>
				</li>
			))}
			{SHORTCUTS.map((sc) => (
				<li key={sc.id}>
					<DesktopIcon
						title={sc.title}
						href={sc.href}
						selected={selected === sc.id}
						onSelect={() => setSelected(sc.id)}
						onOpen={() => window.open(sc.href, '_blank', 'noopener')}
						tile={<AppTile app={sc} size={46} />}
					/>
				</li>
			))}
			<li>
				<DesktopIcon
					title={RECYCLE.title}
					selected={selected === RECYCLE.id}
					onSelect={() => setSelected(RECYCLE.id)}
					onOpen={() => open(RECYCLE.id)}
					tile={<AppTile app={RECYCLE} size={46} />}
				/>
			</li>
		</ul>
	);
}

function Windows() {
	const { windows } = useWindows();
	const topZ = Math.max(0, ...windows.map((w) => w.z));

	return (
		/* AnimatePresence lets a window play its exit animation when it is
		   closed or minimised, instead of vanishing. */
		<AnimatePresence>
			{windows.map((w) => {
				const app = APP_BY_ID[w.id];
				const { Content } = app;
				if (w.minimised) return null;
				return (
					<WindowFrame
						key={w.id}
						id={w.id}
						title={app.title}
						icon={<AppTile app={app} size={16} />}
						x={w.x}
						y={w.y}
						w={w.w}
						h={w.h}
						z={w.z}
						maximised={w.maximised}
						focused={w.z === topZ}>
						<Content />
					</WindowFrame>
				);
			})}
		</AnimatePresence>
	);
}

/** Below this width a windowing metaphor stops being usable. */
const DESKTOP_MIN = 900;

function Shell() {
	const { open, windows } = useWindows();
	const { toggle: toggleTheme } = useTheme();
	const [startOpen, setStartOpen] = useState(false);
	const [taskView, setTaskView] = useState(false);
	const [narrow, setNarrow] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);
	const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

	/* Windows' desktop context menu. Every entry does something real —
	   a menu of inert labels is worse than no menu. */
	const menuItems: MenuItem[] = [
		{
			kind: 'item',
			label: 'Open About Me',
			Icon: MENU_ICONS.FolderOpen,
			shortcut: 'Enter',
			onSelect: () => open('about'),
		},
		{
			kind: 'item',
			label: 'Browse Projects',
			Icon: MENU_ICONS.Pin,
			onSelect: () => open('projects'),
		},
		{ kind: 'separator' },
		{
			kind: 'item',
			label: 'Refresh',
			Icon: MENU_ICONS.RefreshCw,
			shortcut: 'F5',
			onSelect: () => setSelected(null),
		},
		{
			kind: 'item',
			label: 'Personalise',
			Icon: MENU_ICONS.Paintbrush,
			onSelect: toggleTheme,
		},
		{ kind: 'separator' },
		{
			kind: 'item',
			label: 'About this portfolio',
			Icon: MENU_ICONS.Info,
			onSelect: () => open('about'),
		},
	];

	useEffect(() => {
		const check = () => setNarrow(window.innerWidth < DESKTOP_MIN);
		check();
		window.addEventListener('resize', check, { passive: true });
		return () => window.removeEventListener('resize', check);
	}, []);

	/* Open About once on first load so the desktop is never blank. */
	useEffect(() => {
		open('about');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (narrow) {
		return (
			<div className='mobile-shell' id='main'>
				<header className='mobile-head'>
					<span className='desk-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					<div>
						<h1>{profile.name}</h1>
						<p>
							{profile.role} — {profile.location}
						</p>
					</div>
				</header>
				<p className='mobile-intro'>{profile.headline}</p>
				{APPS.map((app) => (
					<section key={app.id} className='mobile-card' aria-label={app.title}>
						<h2>
							<AppTile app={app} size={22} />
							{app.title}
						</h2>
						<app.Content />
					</section>
				))}
			</div>
		);
	}

	return (
		<div
			className='desktop'
			id='main'
			onPointerDown={() => {
				setSelected(null);
				setMenu(null);
			}}
			onContextMenu={(e) => {
				e.preventDefault();
				setStartOpen(false);
				setMenu({ x: e.clientX, y: e.clientY });
			}}>
			<DesktopIcons selected={selected} setSelected={setSelected} />
			<Windows />
			{menu && (
				<ContextMenu
					x={menu.x}
					y={menu.y}
					items={menuItems}
					onClose={() => setMenu(null)}
				/>
			)}
			{taskView && <TaskView onClose={() => setTaskView(false)} />}
			{startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
			<Taskbar
				startOpen={startOpen}
				onToggleStart={() => {
					setTaskView(false);
					setStartOpen((v) => !v);
				}}
				taskViewOpen={taskView}
				onToggleTaskView={() => {
					setStartOpen(false);
					setTaskView((v) => !v);
				}}
				onSearch={() => {
					setTaskView(false);
					setStartOpen(true);
				}}
			/>
			<p className='desk-hint' aria-hidden='true'>
				{windows.length === 0
					? 'Double-click an icon, or press Start'
					: 'Drag a title bar to move · Esc closes'}
			</p>
		</div>
	);
}

export default function Desktop() {
	return (
		<WindowProvider>
			<Shell />
		</WindowProvider>
	);
}
