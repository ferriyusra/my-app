'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import type { AppId, Bounds, Rect, SnapZone, WindowState } from '@/types/windows';
import { reducer } from './window-reducer';

/* Re-exported so existing imports keep working; the logic itself lives in
   window-reducer.ts, where it can be tested without React. */
export { MIN_W, MIN_H, zoneRect } from './window-reducer';

type Ctx = {
	windows: WindowState[];
	/** Highest z currently assigned — the focused window. */
	topZ: number;
	open: (id: AppId, size: { w: number; h: number }, bounds: Bounds) => void;
	close: (id: AppId) => void;
	closeAll: () => void;
	focus: (id: AppId) => void;
	minimise: (id: AppId) => void;
	minimiseAll: () => void;
	toggleMax: (id: AppId, bounds: Bounds) => void;
	snap: (id: AppId, zone: SnapZone, bounds: Bounds) => void;
	setRect: (id: AppId, rect: Rect) => void;
	tearOff: (id: AppId, x: number, y: number) => void;
};

const WindowCtx = createContext<Ctx | null>(null);

export function useWindows() {
	const ctx = useContext(WindowCtx);
	if (!ctx) throw new Error('useWindows must be used inside <WindowProvider>');
	return ctx;
}

export function WindowProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, { windows: [], nextZ: 1 });

	const open = useCallback(
		(id: AppId, size: { w: number; h: number }, bounds: Bounds) =>
			dispatch({ type: 'open', id, w: size.w, h: size.h, bounds }),
		[],
	);

	const value = useMemo<Ctx>(
		() => ({
			windows: state.windows,
			topZ: state.nextZ - 1,
			open,
			close: (id) => dispatch({ type: 'close', id }),
			closeAll: () => dispatch({ type: 'closeAll' }),
			focus: (id) => dispatch({ type: 'focus', id }),
			minimise: (id) => dispatch({ type: 'minimise', id }),
			minimiseAll: () => dispatch({ type: 'minimiseAll' }),
			toggleMax: (id, bounds) => dispatch({ type: 'toggleMax', id, bounds }),
			snap: (id, zone, bounds) => dispatch({ type: 'snap', id, zone, bounds }),
			setRect: (id, rect) => dispatch({ type: 'setRect', id, rect }),
			tearOff: (id, x, y) => dispatch({ type: 'tearOff', id, x, y }),
		}),
		[state.windows, state.nextZ, open],
	);

	return <WindowCtx.Provider value={value}>{children}</WindowCtx.Provider>;
}
