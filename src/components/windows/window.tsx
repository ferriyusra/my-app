'use client';

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
	Maximize2,
	Minimize2,
	Minus,
	Move,
	X,
	type LucideIcon,
} from 'lucide-react';
import { MIN_H, MIN_W, zoneRect } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import WindowHeader from './window-header';
import WindowControls from './window-controls';
import type { AppDef } from '@/components/apps/registry';
import type { Bounds, ResizeEdge, SnapZone, WindowState } from '@/types/windows';

/** Distance from a screen edge that arms a snap while dragging. */
const EDGE = 10;
/** Pointer travel before a maximised window tears loose. */
const TEAR = 8;
/** Fluent's decelerate curve, and the duration every geometry change uses. */
const EASE = [0.16, 1, 0.3, 1] as const;
const GEOMETRY = 0.24;
/** How far a window shrinks as it drops into its taskbar button. */
const MINIMISED_SCALE = 0.06;

const EDGES: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

/** Which snap a drag at this pointer position would land on, if any. */
function edgeZone(cx: number, cy: number, b: Bounds): SnapZone | null {
	const nearTop = cy <= EDGE;
	const nearLeft = cx <= EDGE;
	const nearRight = cx >= b.w - EDGE;
	if (nearTop && nearLeft) return 'tl';
	if (nearTop && nearRight) return 'tr';
	if (nearTop) return 'max';
	if (nearLeft) return cy >= b.h - b.h / 4 ? 'bl' : 'left';
	if (nearRight) return cy >= b.h - b.h / 4 ? 'br' : 'right';
	return null;
}

type DragState = {
	/** Pointer offset inside the window at grab time. */
	offX: number;
	offY: number;
	/** Where the grab started, to measure tear-off distance. */
	startX: number;
	startY: number;
	/** Horizontal grab point as a fraction of the width, for tear-off. */
	fracX: number;
	/** False until a maximised or snapped window has been pulled loose. */
	floating: boolean;
	moved: boolean;
};

type SizeState = {
	edge: ResizeEdge;
	px: number;
	py: number;
	rect: { x: number; y: number; w: number; h: number };
};

/**
 * A window frame.
 *
 * Geometry lives in motion values rather than React state. A pointer-move that
 * dispatched to the reducer would publish a new context value, and a context
 * change re-renders every consumer no matter how well memoised — so dragging
 * one window used to re-render every *other* open window and all of its app
 * content, sixty times a second. Now a drag writes to the DOM directly and the
 * reducer hears about it once, on release.
 */
function WindowFrame({
	win,
	app,
	focused,
}: {
	win: WindowState;
	app: AppDef;
	focused: boolean;
}) {
	const {
		focus,
		minimise,
		toggleMax,
		snap,
		snapWindow,
		setRect,
		tearOff,
		closeWindow,
		bounds,
	} = useWindowManager();

	const { id, z, maximised, minimised, snapped } = win;
	const { flyout } = useShell();
	const reduce = useReducedMotion();

	const frameRef = useRef<HTMLDivElement>(null);
	const ghostRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<DragState | null>(null);
	const sizeRef = useRef<SizeState | null>(null);
	const zoneRef = useRef<SnapZone | null>(null);
	/** Non-null while a pointer gesture owns the geometry. */
	const gesture = useRef<'drag' | 'resize' | null>(null);
	/** Set when the next committed geometry is already on screen. */
	const settle = useRef(false);

	const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
	const titleId = `win-${id}-title`;

	const mx = useMotionValue(win.x);
	const my = useMotionValue(win.y);
	const mw = useMotionValue(win.w);
	const mh = useMotionValue(win.h);

	/* Commited geometry drives the motion values. A snap or a maximise glides
	   into place; the end of a drag does not, because the window is already
	   exactly where the reducer has just been told it is. */
	useEffect(() => {
		if (gesture.current) return;
		if (settle.current || reduce) {
			settle.current = false;
			mx.set(win.x);
			my.set(win.y);
			mw.set(win.w);
			mh.set(win.h);
			return;
		}
		const opts = { duration: GEOMETRY, ease: EASE };
		const running = [
			animate(mx, win.x, opts),
			animate(my, win.y, opts),
			animate(mw, win.w, opts),
			animate(mh, win.h, opts),
		];
		return () => running.forEach((r) => r.stop());
	}, [win.x, win.y, win.w, win.h, mx, my, mw, mh, reduce]);

	/* ── Snap preview ────────────────────────────────────────── */

	/* The plate is mounted from the start and painted straight to the DOM, so
	   arming a snap mid-drag costs no render either. */
	const paintGhost = (zone: SnapZone | null, b: Bounds) => {
		zoneRef.current = zone;
		const el = ghostRef.current;
		if (!el) return;
		if (!zone) {
			el.style.opacity = '0';
			return;
		}
		const r = zoneRect(zone, b);
		el.style.opacity = '1';
		el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
		el.style.width = `${r.w}px`;
		el.style.height = `${r.h}px`;
	};

	/* ── Drag ────────────────────────────────────────────────── */

	const onTitleDown = (e: React.PointerEvent) => {
		if (e.button !== 0) return;
		if ((e.target as HTMLElement).closest('button')) return;
		focus(id);
		gesture.current = 'drag';
		dragRef.current = {
			offX: e.clientX - mx.get(),
			offY: e.clientY - my.get(),
			startX: e.clientX,
			startY: e.clientY,
			fracX: mw.get() > 0 ? (e.clientX - mx.get()) / mw.get() : 0.5,
			floating: !maximised && !snapped,
			moved: false,
		};
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onTitleMove = (e: React.PointerEvent) => {
		const d = dragRef.current;
		if (!d) return;
		const b = bounds();

		/* A maximised or snapped window pops back to its floating size and
		   re-anchors under the cursor, the way Windows tears one loose. */
		if (!d.floating) {
			if (Math.abs(e.clientY - d.startY) + Math.abs(e.clientX - d.startX) < TEAR)
				return;
			const rw = win.restore?.w ?? Math.round(b.w / 2);
			const rh = win.restore?.h ?? Math.round(b.h / 2);
			d.offX = Math.round(rw * d.fracX);
			d.offY = Math.min(d.offY, 24);
			const nx = Math.round(e.clientX - d.offX);
			const ny = Math.max(0, e.clientY - d.offY);
			mw.set(rw);
			mh.set(rh);
			mx.set(nx);
			my.set(ny);
			d.floating = true;
			d.moved = true;
			tearOff(id, nx, ny);
			return;
		}

		d.moved = true;
		const width = mw.get();
		/* Keep at least a strip of the title bar reachable on every side. */
		mx.set(Math.min(Math.max(e.clientX - d.offX, -width + 140), b.w - 140));
		my.set(Math.min(Math.max(e.clientY - d.offY, 0), b.h - 36));
		paintGhost(edgeZone(e.clientX, e.clientY, b), b);
	};

	const onTitleUp = (e: React.PointerEvent) => {
		const d = dragRef.current;
		dragRef.current = null;
		gesture.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		const b = bounds();
		const zone = zoneRef.current;
		paintGhost(null, b);
		if (!d?.moved) return;
		if (zone) return snapWindow(id, zone, b);
		settle.current = true;
		setRect(id, { x: mx.get(), y: my.get(), w: mw.get(), h: mh.get() });
	};

	/* ── Resize ──────────────────────────────────────────────── */

	const onGripDown = (edge: ResizeEdge) => (e: React.PointerEvent) => {
		if (e.button !== 0) return;
		e.stopPropagation();
		focus(id);
		gesture.current = 'resize';
		sizeRef.current = {
			edge,
			px: e.clientX,
			py: e.clientY,
			rect: { x: mx.get(), y: my.get(), w: mw.get(), h: mh.get() },
		};
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onGripMove = (e: React.PointerEvent) => {
		const s = sizeRef.current;
		if (!s) return;
		const b = bounds();
		const dx = e.clientX - s.px;
		const dy = e.clientY - s.py;
		let { x: nx, y: ny, w: nw, h: nh } = s.rect;

		if (s.edge.includes('e')) nw = s.rect.w + dx;
		if (s.edge.includes('s')) nh = s.rect.h + dy;
		/* Dragging a leading edge moves the origin by however much the size
		   actually changed, so the opposite edge stays pinned at the minimum. */
		if (s.edge.includes('w')) {
			nw = Math.max(MIN_W, s.rect.w - dx);
			nx = s.rect.x + (s.rect.w - nw);
		}
		if (s.edge.includes('n')) {
			nh = Math.max(MIN_H, s.rect.h - dy);
			ny = Math.max(0, s.rect.y + (s.rect.h - nh));
		}

		mx.set(nx);
		my.set(ny);
		mw.set(Math.min(Math.max(MIN_W, nw), b.w + 200));
		mh.set(Math.min(Math.max(MIN_H, nh), b.h));
	};

	const onGripUp = (e: React.PointerEvent) => {
		if (!sizeRef.current) return;
		sizeRef.current = null;
		gesture.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		settle.current = true;
		setRect(id, { x: mx.get(), y: my.get(), w: mw.get(), h: mh.get() });
	};

	/* ── Minimise ────────────────────────────────────────────── */

	/* Windows drops a window into its own taskbar button rather than fading it
	   out on the spot. Pointing the transform origin at that button turns one
	   scale animation into exactly that, with no second set of coordinates to
	   keep in step — and restoring plays it in reverse for free. */
	useLayoutEffect(() => {
		const el = frameRef.current;
		if (!el || !minimised) return;
		const btn = document
			.querySelector<HTMLElement>(`[data-app-id='${id}']`)
			?.getBoundingClientRect();
		el.style.transformOrigin = btn
			? `${btn.left + btn.width / 2 - mx.get()}px ${btn.top + btn.height / 2 - my.get()}px`
			: '50% 100%';
	}, [minimised, id, mx, my]);

	/* ── Keyboard ────────────────────────────────────────────── */

	/* Escape closes the focused window — but only when it is the outermost
	   thing on screen. Start, Quick Settings, the window menu and any text
	   field all own Escape first, so a visitor dismissing a menu never loses
	   the window underneath it. */
	useEffect(() => {
		if (!focused || minimised || flyout || menu) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Escape' || e.defaultPrevented) return;
			const el = document.activeElement;
			if (
				el instanceof HTMLElement &&
				(el.isContentEditable ||
					['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
			)
				return;
			closeWindow(id);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [focused, minimised, flyout, menu, closeWindow, id]);

	/* Move focus into the window when it is raised, but never steal it from a
	   control the visitor is already using inside that window. */
	useEffect(() => {
		if (!focused || minimised) return;
		const el = frameRef.current;
		if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
	}, [focused, minimised]);

	const openSystemMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setMenu({ x: e.clientX, y: e.clientY });
	};

	const systemMenu: MenuEntry[] = [
		{
			kind: 'item',
			label: 'Restore',
			Icon: Minimize2 as LucideIcon,
			disabled: !maximised && !snapped,
			onSelect: () => toggleMax(id, bounds()),
		},
		{
			kind: 'item',
			label: 'Move',
			Icon: Move as LucideIcon,
			disabled: true,
			shortcut: 'Drag title',
		},
		{
			kind: 'item',
			label: 'Minimise',
			Icon: Minus as LucideIcon,
			shortcut: '⊞ ↓',
			onSelect: () => minimise(id),
		},
		{
			kind: 'item',
			label: 'Maximise',
			Icon: Maximize2 as LucideIcon,
			disabled: maximised,
			shortcut: '⊞ ↑',
			onSelect: () => snap(id, 'max', bounds()),
		},
		{ kind: 'separator' },
		{
			kind: 'item',
			label: 'Close',
			Icon: X as LucideIcon,
			shortcut: 'Esc',
			danger: true,
			onSelect: () => closeWindow(id),
		},
	];

	const { Content } = app;

	return (
		<>
			{/* The translucent plate Windows paints where a drag would land. */}
			<div
				ref={ghostRef}
				className='snap-ghost'
				aria-hidden='true'
				style={{ zIndex: z - 1, opacity: 0 }}
			/>

			<motion.div
				ref={frameRef}
				className='win'
				role='dialog'
				aria-labelledby={titleId}
				aria-modal='false'
				tabIndex={-1}
				inert={minimised}
				data-focused={focused}
				data-maximised={maximised}
				data-minimised={minimised || undefined}
				data-snapped={snapped ?? undefined}
				initial={reduce ? false : { opacity: 0, scale: 0.92 }}
				animate={{
					opacity: minimised ? 0 : 1,
					scale: minimised ? MINIMISED_SCALE : 1,
				}}
				exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
				transition={{ duration: reduce ? 0 : GEOMETRY, ease: EASE }}
				/* Position and size are motion values: framer writes them to the
				   DOM without going through React at all. */
				style={{
					x: mx,
					y: my,
					width: mw,
					height: mh,
					zIndex: z,
					pointerEvents: minimised ? 'none' : undefined,
				}}
				onPointerDownCapture={() => focus(id)}>
				<WindowHeader
					titleId={titleId}
					title={app.title}
					tile={app.tile}
					onPointerDown={onTitleDown}
					onPointerMove={onTitleMove}
					onPointerUp={onTitleUp}
					onDoubleClick={() => toggleMax(id, bounds())}
					onContextMenu={openSystemMenu}
					controls={
						<WindowControls
							title={app.title}
							maximised={maximised}
							onMinimise={() => minimise(id)}
							onToggleMax={() => toggleMax(id, bounds())}
							onSnap={(zone) => snapWindow(id, zone, bounds())}
							onClose={() => closeWindow(id)}
						/>
					}
				/>

				<div className='win-body'>
					<Content />
				</div>

				{/* Eight grips. Windows lets you resize from any edge or corner. */}
				{!maximised &&
					EDGES.map((edge) => (
						<span
							key={edge}
							className='win-grip'
							data-edge={edge}
							aria-hidden='true'
							onPointerDown={onGripDown(edge)}
							onPointerMove={onGripMove}
							onPointerUp={onGripUp}
							onPointerCancel={onGripUp}
						/>
					))}

				{menu && (
					<ContextMenu
						x={menu.x}
						y={menu.y}
						items={systemMenu}
						label={`${app.title} window menu`}
						onClose={() => setMenu(null)}
					/>
				)}
			</motion.div>
		</>
	);
}

/* Geometry no longer flows through props, so a re-render here means something
   structural changed — focus, snap state, or the app itself. */
export default memo(WindowFrame);
