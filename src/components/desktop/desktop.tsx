'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
	ArrowUpDown,
	ExternalLink,
	Info,
	LayoutGrid,
	Monitor,
	Paintbrush,
	Pin,
	PinOff,
	RefreshCw,
	Settings as SettingsGlyph,
} from 'lucide-react';
import { WindowProvider, useWindows } from '@/context/window-context';
import { ShellProvider, useShell } from '@/context/shell-context';
import { useWindowManager, useSnapReflow } from '@/hooks/use-window-manager';
import { useDesktopIcons, type DeskItem } from '@/hooks/use-desktop-icons';
import { APP_BY_ID, isAppId } from '@/components/apps/registry';
import WindowFrame from '@/components/windows/window';
import TaskView from '@/components/windows/task-view';
import Taskbar from '@/components/taskbar/taskbar';
import QuickSettings from '@/components/taskbar/quick-settings';
import NotificationCenter, { Toast } from '@/components/taskbar/notification-center';
import StartMenu from '@/components/start-menu/start-menu';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import DesktopIcons from './desktop-icons';
import Wallpaper from './wallpaper';
import PowerScreen from './power-screen';
import BootScreen from './boot-screen';
import MobileShell from './mobile-shell';

/** Below this width a windowing metaphor stops being usable. */
const DESKTOP_MIN = 900;

/** Everything that counts as shell furniture rather than bare wallpaper. */
const SURFACES = '.desk-icon, .win, .taskbar, .flyout, .menu, .taskview, .toast';

/** True when a pointer event landed on the wallpaper itself. */
function onBareDesktop(e: React.PointerEvent | React.MouseEvent) {
	return !(e.target as HTMLElement).closest(SURFACES);
}

/** Every open window, each memoised so a drag only re-renders its own frame. */
function WindowLayer() {
	const { windows, topZ } = useWindows();
	return (
		/* AnimatePresence lets a window play its exit animation when it is
		   closed or minimised, instead of vanishing. */
		<AnimatePresence>
			{windows
				.filter((w) => !w.minimised)
				.map((w) => (
					<WindowFrame
						key={w.id}
						win={w}
						app={APP_BY_ID[w.id]}
						focused={w.z === topZ}
					/>
				))}
		</AnimatePresence>
	);
}

function Shell() {
	const { launch } = useWindowManager();
	const {
		flyout,
		openFlyout,
		closeFlyout,
		notify,
		pinned,
		togglePin,
		power,
		booted,
	} = useShell();
	const icons = useDesktopIcons();
	const [menu, setMenu] = useState<{
		x: number;
		y: number;
		items: MenuEntry[];
		label: string;
	} | null>(null);

	useSnapReflow();

	/* ── Context menus ─────────────────────────────────────── */

	const desktopMenu = useCallback(
		(): MenuEntry[] => [
			{
				kind: 'item',
				label: 'View',
				Icon: LayoutGrid,
				submenu: [
					{
						kind: 'item',
						label: 'Large icons',
						checked: icons.size === 'large',
						onSelect: () => icons.setSize('large'),
					},
					{
						kind: 'item',
						label: 'Medium icons',
						checked: icons.size === 'medium',
						onSelect: () => icons.setSize('medium'),
					},
					{
						kind: 'item',
						label: 'Small icons',
						checked: icons.size === 'small',
						onSelect: () => icons.setSize('small'),
					},
				],
			},
			{
				kind: 'item',
				label: 'Sort by',
				Icon: ArrowUpDown,
				submenu: [
					{
						kind: 'item',
						label: 'Name',
						checked: icons.sort === 'name',
						onSelect: () => icons.setSort('name'),
					},
					{
						kind: 'item',
						label: 'Item type',
						checked: icons.sort === 'type',
						onSelect: () => icons.setSort('type'),
					},
					{
						kind: 'item',
						label: 'Default',
						checked: icons.sort === 'default',
						onSelect: () => icons.setSort('default'),
					},
				],
			},
			{
				kind: 'item',
				label: 'Refresh',
				Icon: RefreshCw,
				shortcut: 'F5',
				onSelect: () => {
					icons.setSelected(null);
					notify({
						app: 'system',
						title: 'Desktop refreshed',
						body: 'Icons re-drawn and the selection cleared.',
					});
				},
			},
			{ kind: 'separator' },
			{
				kind: 'item',
				label: 'Display settings',
				Icon: Monitor,
				onSelect: () => launch('settings'),
			},
			{
				kind: 'item',
				label: 'Personalise',
				Icon: Paintbrush,
				onSelect: () => launch('settings'),
			},
			{ kind: 'separator' },
			{
				kind: 'item',
				label: 'About this portfolio',
				Icon: Info,
				onSelect: () => launch('about'),
			},
		],
		[icons, launch, notify],
	);

	const iconMenu = useCallback(
		(item: DeskItem): MenuEntry[] => {
			const app = isAppId(item.id) ? item.id : null;
			const isPinned = !!app && pinned.includes(app);
			return [
				{ kind: 'label', label: item.blurb },
				{
					kind: 'item',
					label: item.href ? 'Open in new tab' : 'Open',
					Icon: item.href ? ExternalLink : LayoutGrid,
					shortcut: 'Enter',
					onSelect: () => icons.openItem(item.id),
				},
				{
					kind: 'item',
					label: isPinned ? 'Unpin from taskbar' : 'Pin to taskbar',
					Icon: isPinned ? PinOff : Pin,
					/* Web shortcuts have no window, so there is nothing to pin. */
					disabled: !app || (isPinned && pinned.length === 1),
					onSelect: () => app && togglePin(app),
				},
				{ kind: 'separator' },
				{
					kind: 'item',
					label: 'Properties',
					Icon: SettingsGlyph,
					onSelect: () =>
						notify({
							app: app ?? 'system',
							title: item.label,
							body: item.blurb,
							...(app ? { action: { label: 'Open', appId: app } } : {}),
						}),
				},
			];
		},
		[icons, pinned, togglePin, notify],
	);

	/* ── Keyboard shortcuts ────────────────────────────────── */

	/* The Windows key opens Start — but only when pressed and released on its
	   own, never as the first half of a system combination. */
	const metaAlone = useRef(false);
	useEffect(() => {
		if (!booted) return;
		const down = (e: KeyboardEvent) => {
			if (e.key === 'Meta' || e.key === 'OS') metaAlone.current = true;
			else metaAlone.current = false;

			if (e.key === 'F5' && !e.ctrlKey) {
				e.preventDefault();
				icons.setSelected(null);
				notify({
					app: 'system',
					title: 'Desktop refreshed',
					body: 'Icons re-drawn and the selection cleared.',
				});
			}
			if (e.key === 'Escape') {
				closeFlyout();
				setMenu(null);
			}
		};
		const up = (e: KeyboardEvent) => {
			if ((e.key === 'Meta' || e.key === 'OS') && metaAlone.current) {
				metaAlone.current = false;
				openFlyout(flyout === 'start' ? null : 'start');
			}
		};
		window.addEventListener('keydown', down);
		window.addEventListener('keyup', up);
		return () => {
			window.removeEventListener('keydown', down);
			window.removeEventListener('keyup', up);
		};
	}, [booted, flyout, openFlyout, closeFlyout, icons, notify]);

	/* Open About once the visitor has signed in, so the desktop is never
	   blank — and so the window animates in where they can see it. The ref
	   resets when Restart replays the boot sequence. */
	const opened = useRef(false);
	useEffect(() => {
		if (!booted) {
			opened.current = false;
			return;
		}
		if (opened.current) return;
		opened.current = true;
		launch('about');
	}, [booted, launch]);

	/* Greet the visitor the way Windows greets a fresh sign-in.
	   Deliberately not ref-guarded: React's development double-invoke tears an
	   effect down and re-runs it, so a guard here would clear the timer on the
	   way out and then refuse to set another on the way back in — the toast
	   would simply never appear while developing. */
	useEffect(() => {
		if (!booted) return;
		const t = setTimeout(
			() =>
				notify({
					app: 'system',
					title: 'Welcome',
					body: 'Double-click a desktop icon, or press Start. Right-click anywhere.',
					action: { label: 'Browse projects', appId: 'explorer' },
				}),
			1600,
		);
		return () => clearTimeout(t);
	}, [booted, notify]);

	return (
		<div
			className='desktop'
			id='main'
			data-dimmed={power !== 'on' || undefined}
			onPointerDown={(e) => {
				/* A click on bare wallpaper clears the selection and any menu.
				   The wallpaper is a child element, so "bare" means the event
				   did not come from any shell surface. */
				if (!onBareDesktop(e)) return;
				icons.setSelected(null);
				setMenu(null);
			}}
			onContextMenu={(e) => {
				if (!onBareDesktop(e)) return;
				e.preventDefault();
				closeFlyout();
				icons.setSelected(null);
				setMenu({
					x: e.clientX,
					y: e.clientY,
					items: desktopMenu(),
					label: 'Desktop',
				});
			}}>
			<Wallpaper />

			<DesktopIcons
				items={icons.items}
				selected={icons.selected}
				rows={icons.rows}
				metrics={icons.metrics}
				onSelect={icons.setSelected}
				onOpen={icons.openItem}
				onStep={icons.step}
				onContextMenu={(e, item) => {
					e.preventDefault();
					e.stopPropagation();
					closeFlyout();
					icons.setSelected(item.id);
					setMenu({
						x: e.clientX,
						y: e.clientY,
						items: iconMenu(item),
						label: item.label,
					});
				}}
			/>

			<WindowLayer />

			<AnimatePresence>
				{flyout === 'start' && <StartMenu key='start' onClose={closeFlyout} />}
				{flyout === 'quick' && <QuickSettings key='quick' onClose={closeFlyout} />}
				{flyout === 'notifications' && (
					<NotificationCenter key='notif' onClose={closeFlyout} />
				)}
			</AnimatePresence>

			{flyout === 'taskview' && <TaskView onClose={closeFlyout} />}

			{menu && (
				<ContextMenu
					x={menu.x}
					y={menu.y}
					items={menu.items}
					label={menu.label}
					onClose={() => setMenu(null)}
				/>
			)}

			<Toast />
			<Taskbar />
			<PowerScreen />

			{/* The Quick Settings brightness slider dims the whole screen. */}
			<span className='screen-dim' aria-hidden='true' />
		</div>
	);
}

/**
 * Chooses between the desktop shell and the stacked mobile reading view.
 *
 * The check runs in an effect rather than a media query so the two trees never
 * both mount — a phone should not pay to hydrate a window manager it cannot
 * use. `null` on the first pass keeps the server and client markup identical.
 */
function Viewport() {
	const [wide, setWide] = useState<boolean | null>(null);
	const { booted } = useShell();

	useEffect(() => {
		const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
		const sync = () => setWide(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);

	if (wide === null) return <div className='boot' aria-hidden='true' />;
	if (!wide) return <MobileShell />;

	/* The desktop mounts underneath the startup sequence, not after it, so the
	   overlay is covering work the browser was doing regardless. The narrow
	   layout skips it: a Windows sign-in in front of a plain reading view
	   would be a costume, not a shell. */
	return (
		<>
			<Shell />
			<AnimatePresence>{!booted && <BootScreen key='boot' />}</AnimatePresence>
		</>
	);
}

export default function Desktop() {
	return (
		<ShellProvider>
			<WindowProvider>
				<Viewport />
			</WindowProvider>
		</ShellProvider>
	);
}
