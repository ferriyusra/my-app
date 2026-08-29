'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SourceFile } from '@/lib/source';
import { AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Cat, ExternalLink, Fish, Info, LayoutGrid, Lightbulb, Paintbrush, Pin, PinOff, RefreshCw, Settings as SettingsGlyph, Undo2 } from 'lucide-react';
import { LiMonitor } from '@/components/icons/line-icons';
import { WindowProvider, useWindows } from '@/context/window-context';
import { ShellProvider, useShell } from '@/context/shell-context';
import { useWindowManager, useSnapReflow } from '@/hooks/use-window-manager';
import { arrange, useDesktopGestures } from '@/hooks/use-desktop-gestures';
import { useDesktopIcons, type DeskItem } from '@/hooks/use-desktop-icons';
import { useAppUrl } from '@/hooks/use-app-url';
import { APP_BY_ID, isAppId } from '@/components/apps/registry';
import WindowFrame from '@/components/windows/window';
import SnapAssist from '@/components/windows/snap-assist';
import TaskView from '@/components/windows/task-view';
import Taskbar from '@/components/taskbar/taskbar';
import QuickSettings from '@/components/taskbar/quick-settings';
import NotificationCenter, { Toast } from '@/components/taskbar/notification-center';
import StartMenu from '@/components/start-menu/start-menu';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import DesktopIcons from './desktop-icons';
import DesktopCat from './cat/desktop-cat';
import ActivateWatermark from './activate-watermark';
import type { AppId } from '@/types/windows';
import Wallpaper from './wallpaper';
import PowerScreen from './power-screen';
import BootScreen from './boot-screen';

/** Below this width a windowing metaphor stops being usable. */
const DESKTOP_MIN = 900;

/** Everything that counts as shell furniture rather than bare wallpaper. */
const SURFACES = '.desk-icon, .win, .taskbar, .flyout, .menu, .taskview, .toast';

/** True when a pointer event landed on the wallpaper itself. */
function onBareDesktop(e: React.PointerEvent | React.MouseEvent) {
	return !(e.target as HTMLElement).closest(SURFACES);
}

/**
 * Every open window, minimised ones included.
 *
 * A minimised window stays mounted so it can shrink into its taskbar button
 * and grow back out of it; unmounting would make both halves of that gesture
 * impossible. AnimatePresence is left to handle closing, which really is an
 * unmount.
 */
function WindowLayer() {
	const { windows } = useWindows();
	/* Focus belongs to the topmost window that can actually be seen. */
	const visibleTop = Math.max(
		0,
		...windows.filter((w) => !w.minimised).map((w) => w.z),
	);
	return (
		<AnimatePresence>
			{windows.map((w) => (
				<WindowFrame
					key={w.id}
					win={w}
					app={APP_BY_ID[w.id]}
					focused={!w.minimised && w.z === visibleTop}
				/>
			))}
		</AnimatePresence>
	);
}

function Shell() {
	const {
		launch,
		windows,
		snap,
		snapWindow,
		toggleMax,
		minimise,
		minimiseAll,
		closeWindow,
		focus,
		bounds,
	} = useWindowManager();
	const {
		flyout,
		openFlyout,
		closeFlyout,
		notify,
		pinned,
		togglePin,
		power,
		booted,
		catOn,
		setCatOn,
		catBusy,
		feedCat,
		activated,
		arrival,
		snapAssist,
	} = useShell();
	const icons = useDesktopIcons();
	const [marked, setMarked] = useState<string[]>([]);
	const gestures = useDesktopGestures({
		ids: icons.items.map((i) => i.id),
		rows: icons.rows,
		metrics: icons.metrics,
		onSelectMany: setMarked,
	});
	/* Destructured rather than passed whole: both are stable, and putting the
	   gestures object in the menu's dependency array would rebuild it on
	   every render. */
	const { reset: resetIcons, rearranged } = gestures;
	/* The stored arrangement reorders the flow; everything else about the grid
	   is unchanged, so the arrow keys still walk it column-first. */
	const ordered = useMemo(() => {
		const by = arrange(gestures.order, icons.items.map((i) => i.id));
		return [...icons.items].sort((a, b) => by.indexOf(a.id) - by.indexOf(b.id));
	}, [gestures.order, icons.items]);
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
				label: 'Desktop cat',
				Icon: Cat,
				submenu: [
					{
						kind: 'item',
						label: 'Feed the cat',
						Icon: Fish,
						disabled: !catOn || catBusy,
						onSelect: feedCat,
					},
					{ kind: 'separator' },
					{
						kind: 'item',
						/* Disabled until it has finished walking in or out —
						   a second click mid-walk would strand it. */
						label: catBusy
							? catOn
								? 'Coming out…'
								: 'Heading home…'
							: catOn
								? 'Send it home'
								: 'Let it out',
						Icon: Cat,
						checked: catOn,
						disabled: catBusy,
						onSelect: () => setCatOn(!catOn),
					},
				],
			},
			{
				kind: 'item',
				/* useDesktopGestures has returned this since it was written and
				   nothing called it, so a visitor who scrambled the grid had no way
				   back. "Put it back" means the order too, not just the positions. */
				label: 'Reset icon positions',
				Icon: Undo2,
				disabled: !rearranged,
				onSelect: () => {
					resetIcons();
					icons.setSort('default');
				},
			},
			{ kind: 'separator' },
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
				Icon: LiMonitor,
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
				label: 'Tips and shortcuts',
				Icon: Lightbulb,
				shortcut: 'F1',
				onSelect: () => launch('tips'),
			},
			{
				kind: 'item',
				label: 'About this portfolio',
				Icon: Info,
				onSelect: () => launch('about'),
			},
		],
		[icons, launch, notify, catOn, setCatOn, catBusy, feedCat, resetIcons, rearranged],
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
	/* What Show desktop minimised, so pressing it again puts it all back. */
	const stashed = useRef<AppId[] | null>(null);

	useEffect(() => {
		if (!booted) return;

		/* The window a shortcut acts on is the topmost one you can see. */
		const topWindow = () =>
			windows
				.filter((w) => !w.minimised)
				.reduce<(typeof windows)[number] | null>(
					(best, w) => (best && best.z > w.z ? best : w),
					null,
				);

		const showDesktop = () => {
			const visible = windows.filter((w) => !w.minimised).map((w) => w.id);
			if (visible.length) {
				stashed.current = visible;
				minimiseAll();
			} else if (stashed.current) {
				stashed.current.forEach(focus);
				stashed.current = null;
			}
		};

		const down = (e: KeyboardEvent) => {
			if (e.key === 'Meta' || e.key === 'OS') metaAlone.current = true;
			else metaAlone.current = false;

			/* F1 is the help key on the operating system this imitates, and
			   unlike '?' it needs no guard for whether a field has focus. */
			if (e.key === 'F1') {
				e.preventDefault();
				launch('tips');
				return;
			}

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

			/* Alt+F4 closes the active window, as it has since Windows 3.0. */
			if (e.altKey && e.key === 'F4') {
				const top = topWindow();
				if (top) {
					e.preventDefault();
					closeWindow(top.id);
				}
				return;
			}

			/* The ⊞ shortcuts. On Windows itself the OS claims these before the
			   browser ever sees them, so there they do nothing at all — Ctrl+Alt
			   is bound alongside them to give that half of the audience the
			   arrows back.

			   Only the arrows. Ctrl+Alt is AltGr on many keyboard layouts, where
			   Ctrl+Alt+E types €, so D and E are deliberately left alone; both
			   already have several other routes. Tips ▸ Keyboard says all of
			   this rather than leaving it in a comment only I can read. */
			const win = e.metaKey && !e.altKey && !e.ctrlKey;
			const alt = e.ctrlKey && e.altKey && !e.metaKey;
			if (!win && !alt) return;
			const b = bounds();
			const top = topWindow();

			if (e.key === 'ArrowLeft' && top) {
				e.preventDefault();
				snapWindow(top.id, 'left', b);
			} else if (e.key === 'ArrowRight' && top) {
				e.preventDefault();
				snapWindow(top.id, 'right', b);
			} else if (e.key === 'ArrowUp' && top) {
				e.preventDefault();
				snap(top.id, 'max', b);
			} else if (e.key === 'ArrowDown' && top) {
				e.preventDefault();
				if (top.maximised || top.snapped) toggleMax(top.id, b);
				else minimise(top.id);
			} else if (alt) {
				/* Ctrl+Alt covers the arrows and stops there. */
				return;
			} else if (e.key.toLowerCase() === 'd') {
				e.preventDefault();
				showDesktop();
			} else if (e.key.toLowerCase() === 'e') {
				e.preventDefault();
				launch('explorer');
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
	}, [
		booted,
		flyout,
		openFlyout,
		closeFlyout,
		icons,
		notify,
		windows,
		snap,
		snapWindow,
		toggleMax,
		minimise,
		minimiseAll,
		closeWindow,
		focus,
		bounds,
		launch,
	]);

	/* Opens whatever `?app=` names once the visitor has signed in, falling
	   back to About so the desktop is never blank, and keeps the address bar
	   pointed at the frontmost window from then on. */
	useAppUrl();

	/**
	 * The second visit gets one line pointing at F1, and no visit after that
	 * gets anything.
	 *
	 * The first visit needs no toast: Tips opens by itself. This used to fire
	 * on every arrival, including every reload, and said the same three things
	 * for six seconds each time — while a returning visitor, who had already
	 * dismissed it once, was the only person who still had nothing to read.
	 *
	 * Deliberately not ref-guarded: React's development double-invoke tears an
	 * effect down and re-runs it, so a guard here would clear the timer on the
	 * way out and refuse to set another on the way back in.
	 */
	useEffect(() => {
		if (!booted || arrival !== 'second') return;
		const t = setTimeout(
			() =>
				notify({
					app: 'system',
					title: 'Welcome back',
					body: 'Press F1 for what this desktop does, and the keys it answers to.',
					action: { label: 'Open Tips', appId: 'tips' },
				}),
			1600,
		);
		return () => clearTimeout(t);
	}, [booted, arrival, notify]);

	return (
		<div
			className='desktop'
			data-activated={activated || undefined}
			data-dimmed={power !== 'on' || undefined}
			onPointerDown={(e) => {
				/* A press on bare wallpaper clears the selection and any menu,
				   and begins a marquee. The wallpaper is a child element, so
				   "bare" means the event did not come from any shell surface. */
				if (!onBareDesktop(e)) return;
				icons.setSelected(null);
				setMarked([]);
				setMenu(null);
				gestures.marquee(e);
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

			{/* The marquee. One node, written to directly by the gesture. */}
			<div className='desk-band' data-on='false' aria-hidden='true' />

			<DesktopIcons
				items={ordered}
				selected={icons.selected}
				marked={marked}
				onDragStart={gestures.dragIcon}
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
			<DesktopCat />
			<AnimatePresence>
				{/* Mounted only while there is an offer to make. It used to sit here
						unconditionally and return null internally, so AnimatePresence never
						saw a child leave and its exit animation never ran once. */}
				{snapAssist && <SnapAssist key='snap-assist' />}
				{flyout === 'start' && <StartMenu key='start' onClose={closeFlyout} />}
				{flyout === 'quick' && <QuickSettings key='quick' onClose={closeFlyout} />}
				{flyout === 'notifications' && (
					<NotificationCenter key='notif' onClose={closeFlyout} />
				)}
			</AnimatePresence>

			{/* Deliberately outside the block above: Task View is a full-screen
					scrim, and fading one out leaves the whole desktop washed for the
					length of the transition. It renders a plain div, so there is no
					exit animation being lost here. */}
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

			<ActivateWatermark />
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
/**
 * Decides whether the desktop shell takes over from the document underneath.
 *
 * `data-shell` on <html> is the switch, and the inline script in layout.tsx
 * has already set it before first paint — so the document is hidden and the
 * black holding screen shown without waiting for React. This effect only keeps
 * the attribute honest when the viewport changes afterwards.
 */
function Viewport() {
	const [wide, setWide] = useState<boolean | null>(null);
	const { booted } = useShell();

	useEffect(() => {
		const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
		const sync = () => {
			setWide(mq.matches);
			document.documentElement.dataset.shell = mq.matches
				? 'desktop'
				: 'document';
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);

	/* Narrow: the server-rendered document is already the page, and nothing
	   here should draw over it. A Windows sign-in in front of a plain reading
	   view would be a costume, not a shell. */
	if (wide === null) return <div className='boot' aria-hidden='true' />;
	if (!wide) return null;

	/* The desktop mounts underneath the startup sequence, not after it, so the
	   overlay is covering work the browser was doing regardless. */
	return (
		<>
			<Shell />
			<AnimatePresence>{!booted && <BootScreen key='boot' />}</AnimatePresence>
		</>
	);
}

export default function Desktop({
	customWallpapers = [],
	sources = [],
}: {
	/** Read from `public/background` by the server component that renders this. */
	customWallpapers?: string[];
	/** Read from disk at build time; the editor window renders them. */
	sources?: SourceFile[];
}) {
	return (
		<ShellProvider customWallpapers={customWallpapers} sources={sources}>
			<WindowProvider>
				<Viewport />
			</WindowProvider>
		</ShellProvider>
	);
}
