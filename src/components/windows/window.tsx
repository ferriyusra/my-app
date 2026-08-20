'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
import { useWindowManager, TASKBAR_H } from '@/hooks/use-window-manager';
import ContextMenu, { type MenuEntry } from '@/components/ui/context-menu';
import WindowHeader from './window-header';
import WindowControls from './window-controls';
import type { AppDef } from '@/components/apps/registry';
import type { ResizeEdge, SnapZone, WindowState } from '@/types/windows';

/** Distance from a screen edge that arms a snap while dragging. */
const EDGE = 10;
/** Pointer travel before a maximised window tears loose. */
const TEAR = 8;

const EDGES: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

/** Which snap a drag at this pointer position would land on, if any. */
function edgeZone(cx: number, cy: number, b: { w: number; h: number }): SnapZone | null {
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
	moved: boolean;
};

type SizeState = {
	edge: ResizeEdge;
	px: number;
	py: number;
	rect: { x: number; y: number; w: number; h: number };
};

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
		setRect,
		tearOff,
		closeWindow,
		bounds,
	} = useWindowManager();

	const { id, x, y, w, h, z, maximised, snapped } = win;
	const { flyout } = useShell();
	const reduce = useReducedMotion();
	const frameRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<DragState | null>(null);
	const sizeRef = useRef<SizeState | null>(null);
	const [preview, setPreview] = useState<SnapZone | null>(null);
	const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
	const titleId = `win-${id}-title`;

	/* ── Drag ────────────────────────────────────────────────── */

	const onTitleDown = (e: React.PointerEvent) => {
		if (e.button !== 0) return;
		if ((e.target as HTMLElement).closest('button')) return;
		focus(id);
		dragRef.current = {
			offX: e.clientX - x,
			offY: e.clientY - y,
			startX: e.clientX,
			startY: e.clientY,
			fracX: w > 0 ? (e.clientX - x) / w : 0.5,
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
		if (maximised || snapped) {
			if (Math.abs(e.clientY - d.startY) + Math.abs(e.clientX - d.startX) < TEAR)
				return;
			const rw = win.restore?.w ?? Math.round(b.w / 2);
			const nx = Math.round(e.clientX - rw * d.fracX);
			const ny = Math.max(0, e.clientY - d.offY);
			d.offX = Math.round(rw * d.fracX);
			d.moved = true;
			tearOff(id, nx, ny);
			return;
		}

		d.moved = true;
		setRect(id, {
			/* Keep at least a strip of the title bar reachable on every side. */
			x: Math.min(Math.max(e.clientX - d.offX, -w + 140), b.w - 140),
			y: Math.min(Math.max(e.clientY - d.offY, 0), b.h - 36),
			w,
			h,
		});
		setPreview(edgeZone(e.clientX, e.clientY, b));
	};

	const onTitleUp = (e: React.PointerEvent) => {
		const d = dragRef.current;
		dragRef.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		const zone = preview;
		setPreview(null);
		if (d?.moved && zone) snap(id, zone, bounds());
	};

	/* ── Resize ──────────────────────────────────────────────── */

	const onGripDown = (edge: ResizeEdge) => (e: React.PointerEvent) => {
		if (e.button !== 0) return;
		e.stopPropagation();
		focus(id);
		sizeRef.current = { edge, px: e.clientX, py: e.clientY, rect: { x, y, w, h } };
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

		setRect(id, {
			x: nx,
			y: ny,
			w: Math.min(Math.max(MIN_W, nw), b.w + 200),
			h: Math.min(Math.max(MIN_H, nh), b.h),
		});
	};

	const onGripUp = (e: React.PointerEvent) => {
		sizeRef.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	};

	/* ── Keyboard ────────────────────────────────────────────── */

	/* Escape closes the focused window — but only when it is the outermost
	   thing on screen. Start, Quick Settings, the window menu and any text
	   field all own Escape first, so a visitor dismissing a menu never loses
	   the window underneath it. */
	useEffect(() => {
		if (!focused || flyout || menu) return;
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
	}, [focused, flyout, menu, closeWindow, id]);

	/* Move focus into the window when it is raised, but never steal it from a
	   control the visitor is already using inside that window. */
	useEffect(() => {
		if (!focused) return;
		const el = frameRef.current;
		if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
	}, [focused]);

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
			onSelect: () => minimise(id),
		},
		{
			kind: 'item',
			label: 'Maximise',
			Icon: Maximize2 as LucideIcon,
			disabled: maximised,
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

	const ghost = preview ? zoneRect(preview, bounds()) : null;
	const { Content } = app;

	return (
		<>
			{/* The translucent plate Windows paints where a drag would land. */}
			{ghost && (
				<motion.div
					className='snap-ghost'
					aria-hidden='true'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.12 }}
					style={{ left: ghost.x, top: ghost.y, width: ghost.w, height: ghost.h, zIndex: z - 1 }}
				/>
			)}

			<motion.div
				ref={frameRef}
				className='win'
				role='dialog'
				aria-labelledby={titleId}
				aria-modal='false'
				tabIndex={-1}
				data-focused={focused}
				data-maximised={maximised}
				data-snapped={snapped ?? undefined}
				/* Windows scales a window up as it opens and drops it toward the
				   taskbar as it closes or minimises. Only transform and opacity
				   animate, so this never fights the left/top the drag writes. */
				initial={reduce ? false : { opacity: 0, scale: 0.92, y: 10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 26 }}
				transition={{
					duration: reduce ? 0 : 0.22,
					ease: [0.16, 1, 0.3, 1],
				}}
				style={{
					left: maximised ? 0 : x,
					top: maximised ? 0 : y,
					width: maximised ? '100%' : w,
					height: maximised ? `calc(100% - ${TASKBAR_H}px)` : h,
					zIndex: z,
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
							onSnap={(zone) => snap(id, zone, bounds())}
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

/* Every window re-renders when any window's geometry changes unless the list
   items are memoised — this shell can have eight open at once. */
export default memo(WindowFrame);
