'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWindows } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { APP_BY_ID } from '@/components/apps/registry';
import type { AppId, Bounds, SnapZone } from '@/types/windows';

/** The half a snapped window leaves free, for Snap Assist to offer. */
const COMPLEMENT = { left: 'right', right: 'left' } as const;

/** Taskbar height in CSS pixels; mirrors `--taskbar-h` in globals.css. */
export const TASKBAR_H = 48;

/** The desktop area, i.e. the viewport minus the taskbar. */
export function desktopBounds(): Bounds {
	if (typeof window === 'undefined') return { w: 1440, h: 900 - TASKBAR_H };
	return { w: window.innerWidth, h: window.innerHeight - TASKBAR_H };
}

/**
 * Window operations that need the viewport, the app registry or the shell's
 * sound setting — kept out of the context so the reducer stays a pure state
 * machine that is trivial to reason about.
 */
export function useWindowManager() {
	const ctx = useWindows();
	const { play, closeFlyout, pushRecent, offerSnapAssist, dismissSnapAssist } =
		useShell();
	const { open, close, minimise, focus, snap, windows } = ctx;

	/* The running set is read through a ref so `launch` keeps a stable
	   identity. It ends up in the dependency array of the desktop's one-shot
	   boot effect, and a `launch` that changed whenever a window moved would
	   make that effect cancel its own timer before it ever fired. */
	const runningRef = useRef(windows);
	useEffect(() => {
		runningRef.current = windows;
	}, [windows]);

	/** Open an app at the size its registry entry asks for. */
	const launch = useCallback(
		(id: AppId) => {
			const app = APP_BY_ID[id];
			/* Re-raising an app that is already open should not chime. */
			const running = runningRef.current.some((w) => w.id === id);
			open(id, { w: app.w, h: app.h }, desktopBounds());
			if (!running) play('open');
			pushRecent(id);
			closeFlyout();
			/* Opening something else answers Snap Assist's question. */
			dismissSnapAssist();
		},
		[open, play, pushRecent, closeFlyout, dismissSnapAssist],
	);

	const closeWindow = useCallback(
		(id: AppId) => {
			close(id);
			play('close');
		},
		[close, play],
	);

	/**
	 * Snap, then offer Snap Assist for the half that is now free — the
	 * interaction Windows is best known for. Only the two halves qualify:
	 * offering to fill three thirds or four quadrants one window at a time
	 * turns a convenience into a chore, which is why Windows does not either.
	 */
	const snapWindow = useCallback(
		(id: AppId, zone: SnapZone, b: Bounds) => {
			snap(id, zone, b);
			const other = COMPLEMENT[zone as keyof typeof COMPLEMENT];
			const candidates = runningRef.current.filter(
				(win) => win.id !== id && !win.minimised,
			);
			if (other && candidates.length) offerSnapAssist(id, other);
			else dismissSnapAssist();
		},
		[snap, offerSnapAssist, dismissSnapAssist],
	);

	/** Taskbar click: launch, minimise if it is already on top, else raise. */
	const toggleFromTaskbar = useCallback(
		(id: AppId) => {
			const win = windows.find((w) => w.id === id);
			if (!win) return launch(id);
			if (!win.minimised && win.z === ctx.topZ) return minimise(id);
			focus(id);
		},
		[windows, ctx.topZ, launch, minimise, focus],
	);

	return {
		...ctx,
		bounds: desktopBounds,
		launch,
		closeWindow,
		snapWindow,
		toggleFromTaskbar,
	};
}

/**
 * Snapped and maximised windows hold pixel geometry, so a browser resize would
 * leave them straddling the new edge. Re-deriving each zone on resize keeps the
 * layout aligned the way Windows re-flows one when the display changes.
 */
export function useSnapReflow() {
	const { windows, snap } = useWindows();
	/* The window list is read through a ref so the resize listener is
	   installed once rather than on every geometry change. */
	const ref = useRef(windows);
	useEffect(() => {
		ref.current = windows;
	}, [windows]);

	useEffect(() => {
		let frame = 0;
		const onResize = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const b = desktopBounds();
				for (const w of ref.current) {
					if (w.snapped) snap(w.id, w.snapped, b);
				}
			});
		};
		window.addEventListener('resize', onResize, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', onResize);
		};
	}, [snap]);
}
