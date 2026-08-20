'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWindows } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { APP_BY_ID } from '@/components/apps/registry';
import type { AppId, Bounds } from '@/types/windows';

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
	const { play, closeFlyout, pushRecent } = useShell();
	const { open, close, minimise, focus, windows } = ctx;

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
		},
		[open, play, pushRecent, closeFlyout],
	);

	const closeWindow = useCallback(
		(id: AppId) => {
			close(id);
			play('close');
		},
		[close, play],
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
		toggleFromTaskbar,
	};
}

/**
 * Snapped windows hold pixel geometry, so a browser resize would leave them
 * straddling the new edge. Re-deriving each zone on resize keeps a snapped
 * layout aligned exactly the way Windows re-flows one when the display changes.
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
					if (w.snapped && w.snapped !== 'max') snap(w.id, w.snapped, b);
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
