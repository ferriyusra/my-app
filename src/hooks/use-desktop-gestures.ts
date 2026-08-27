'use client';

import { useCallback, useState } from 'react';

/**
 * The two gestures a fake desktop is judged on: dragging an icon somewhere
 * else, and dragging a box around several.
 *
 * Both follow the rule the window frame and the cat already follow — **a
 * pointer gesture must not dispatch.** The marquee rectangle and the dragged
 * icon are written straight to the DOM sixty times a second; React only hears
 * about it once, on pointer-up. Publishing a new context value per frame would
 * re-render every open window and its content, which is the cost this shell was
 * arranged to avoid in the first place.
 *
 * Placement is stored as an index per icon — where it sits in the column-first
 * flow — rather than as pixels, so the arrangement survives a resize, a change
 * of icon size, and the switch between one column and three.
 */

const KEY = 'shell:desk-order';
/** Pointer travel before a press becomes a drag rather than a click. */
const DRAG_SLOP = 5;

type Metrics = { cellW: number; cellH: number };

function readOrder(): string[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		return Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')
			? parsed
			: [];
	} catch {
		return [];
	}
}

/**
 * The stored order, minus anything gone, plus anything new, in flow order.
 * Pure, so the desktop can memoise on `(order, ids)` without depending on the
 * hook object identity.
 */
export function arrange(order: string[], list: string[]): string[] {
	const known = order.filter((id) => list.includes(id));
	return [...known, ...list.filter((id) => !known.includes(id))];
}

export function useDesktopGestures({
	ids,
	rows,
	metrics,
	onSelectMany,
}: {
	ids: string[];
	rows: number;
	metrics: Metrics;
	onSelectMany: (picked: string[]) => void;
}) {
	/* Lazy initialiser, not an effect: the arrangement must be right on the
	   first paint or the icons visibly jump. */
	const [order, setOrder] = useState<string[]>(readOrder);
	/* Looked up rather than handed down. Passing refs between components trips
	   `react-hooks/refs` (reading one during render), and these are only ever
	   needed inside a pointer handler, which runs long after mount. */
	const grid = () => document.querySelector<HTMLElement>('.desk-icons');
	const band = () => document.querySelector<HTMLElement>('.desk-band');

	/* Pruning happens here rather than in an effect: a stale id simply does not
	   survive the filter, and the cleaned list is written back the next time
	   something moves. Setting state from an effect to tidy it would cascade a
	   render for no visible change. */

	const persist = useCallback((next: string[]) => {
		setOrder(next);
		try {
			localStorage.setItem(KEY, JSON.stringify(next));
		} catch {
			/* Private mode: the arrangement simply does not outlive the tab. */
		}
	}, []);

	const reset = useCallback(() => {
		setOrder([]);
		try {
			localStorage.removeItem(KEY);
		} catch {}
	}, []);

	/** Which flow slot a point falls in, given the column-first layout. */
	const slotAt = useCallback(
		(clientX: number, clientY: number) => {
			const el = grid();
			if (!el) return 0;
			const box = el.getBoundingClientRect();
			const col = Math.max(0, Math.floor((clientX - box.left) / metrics.cellW));
			const row = Math.max(
				0,
				Math.min(rows - 1, Math.floor((clientY - box.top) / metrics.cellH)),
			);
			return col * rows + row;
		},
		[metrics.cellW, metrics.cellH, rows],
	);

	/** Move one icon into a slot, closing the gap it left behind. */
	const moveTo = useCallback(
		(id: string, slot: number, list: string[]) => {
			const cur = arrange(order, list);
			const from = cur.indexOf(id);
			if (from === -1) return;
			const without = cur.filter((x) => x !== id);
			const to = Math.max(0, Math.min(slot, without.length));
			persist([...without.slice(0, to), id, ...without.slice(to)]);
		},
		[order, persist],
	);

	/* ── Marquee ─────────────────────────────────────────────────────────── */
	const marquee = useCallback(
		(e: React.PointerEvent) => {
			const box0 = band();
			const gridEl = grid();
			if (!box0 || !gridEl || e.button !== 0) return;

			const x0 = e.clientX;
			const y0 = e.clientY;
			let live = false;

			const draw = (x: number, y: number) => {
				const left = Math.min(x0, x);
				const top = Math.min(y0, y);
				box0.style.transform = `translate3d(${left}px,${top}px,0)`;
				box0.style.width = `${Math.abs(x - x0)}px`;
				box0.style.height = `${Math.abs(y - y0)}px`;
			};

			const move = (ev: PointerEvent) => {
				if (!live) {
					if (Math.abs(ev.clientX - x0) < DRAG_SLOP && Math.abs(ev.clientY - y0) < DRAG_SLOP) return;
					live = true;
					box0.dataset.on = 'true';
				}
				draw(ev.clientX, ev.clientY);
			};

			const up = (ev: PointerEvent) => {
				window.removeEventListener('pointermove', move);
				window.removeEventListener('pointerup', up);
				box0.dataset.on = 'false';
				if (!live) return;
				/* One dispatch, at the end — never per frame. */
				const box = {
					left: Math.min(x0, ev.clientX),
					right: Math.max(x0, ev.clientX),
					top: Math.min(y0, ev.clientY),
					bottom: Math.max(y0, ev.clientY),
				};
				const picked: string[] = [];
				for (const el of gridEl.querySelectorAll<HTMLElement>('[data-icon-id]')) {
					const r = el.getBoundingClientRect();
					if (r.right > box.left && r.left < box.right && r.bottom > box.top && r.top < box.bottom) {
						picked.push(el.dataset.iconId!);
					}
				}
				onSelectMany(picked);
			};

			window.addEventListener('pointermove', move);
			window.addEventListener('pointerup', up);
		},
		[onSelectMany],
	);

	/* ── Dragging one icon ───────────────────────────────────────────────── */
	const dragIcon = useCallback(
		(e: React.PointerEvent, id: string) => {
			if (e.button !== 0) return;
			const el = (e.currentTarget as HTMLElement).closest<HTMLElement>('.desk-icons > li');
			if (!el) return;

			const x0 = e.clientX;
			const y0 = e.clientY;
			let live = false;

			const move = (ev: PointerEvent) => {
				if (!live) {
					if (Math.abs(ev.clientX - x0) < DRAG_SLOP && Math.abs(ev.clientY - y0) < DRAG_SLOP) return;
					live = true;
					el.dataset.dragging = 'true';
				}
				el.style.transform = `translate3d(${ev.clientX - x0}px,${ev.clientY - y0}px,0)`;
			};

			const up = (ev: PointerEvent) => {
				window.removeEventListener('pointermove', move);
				window.removeEventListener('pointerup', up);
				if (!live) return;
				el.style.transform = '';
				delete el.dataset.dragging;
				moveTo(id, slotAt(ev.clientX, ev.clientY), ids);
			};

			window.addEventListener('pointermove', move);
			window.addEventListener('pointerup', up);
		},
		[ids, moveTo, slotAt],
	);

	return { order, marquee, dragIcon, reset, rearranged: order.length > 0 };
}
