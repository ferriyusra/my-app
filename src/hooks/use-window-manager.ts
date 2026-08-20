'use client';

import { useCallback } from 'react';
import { useWindows } from '@/context/window-context';
import { APP_BY_ID } from '@/components/apps/registry';
import type { AppId, Bounds } from '@/types/windows';

const TASKBAR_H = 56;

/**
 * Window operations that need to know about the viewport or the app registry,
 * kept out of the context so the reducer stays a pure state machine.
 */
export function useWindowManager() {
	const ctx = useWindows();

	/** The desktop area, i.e. the viewport minus the taskbar. */
	const bounds = useCallback(
		(): Bounds => ({
			w: typeof window === 'undefined' ? 1440 : window.innerWidth,
			h: (typeof window === 'undefined' ? 900 : window.innerHeight) - TASKBAR_H,
		}),
		[],
	);

	/** Open an app at the size its registry entry asks for. */
	const launch = useCallback(
		(id: AppId) => {
			const app = APP_BY_ID[id];
			ctx.open(id, app?.w ?? 880, app?.h ?? 600);
		},
		[ctx],
	);

	/** Taskbar click: open, minimise if it is already on top, else raise. */
	const toggleFromTaskbar = useCallback(
		(id: AppId) => {
			const win = ctx.windows.find((w) => w.id === id);
			if (!win) return launch(id);
			const topZ = Math.max(0, ...ctx.windows.map((w) => w.z));
			if (!win.minimised && win.z === topZ) return ctx.minimise(id);
			ctx.focus(id);
		},
		[ctx, launch],
	);

	const topZ = Math.max(0, ...ctx.windows.map((w) => w.z));

	return { ...ctx, bounds, launch, toggleFromTaskbar, topZ, TASKBAR_H };
}
