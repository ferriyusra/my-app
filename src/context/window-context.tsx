'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';
import type { AppId, Bounds, Rect, SnapZone, WindowState } from '@/types/windows';

/** Smallest a window may be dragged down to, in CSS pixels. */
export const MIN_W = 380;
export const MIN_H = 260;

/** Geometry for each Snap Layouts zone, derived from the desktop area. */
export function zoneRect(zone: SnapZone, b: Bounds): Rect {
	const halfW = Math.round(b.w / 2);
	const halfH = Math.round(b.h / 2);
	const third = Math.round(b.w / 3);
	const twoThirds = Math.round((b.w * 2) / 3);
	switch (zone) {
		case 'left':     return { x: 0, y: 0, w: halfW, h: b.h };
		case 'right':    return { x: halfW, y: 0, w: b.w - halfW, h: b.h };
		case 'tl':       return { x: 0, y: 0, w: halfW, h: halfH };
		case 'tr':       return { x: halfW, y: 0, w: b.w - halfW, h: halfH };
		case 'bl':       return { x: 0, y: halfH, w: halfW, h: b.h - halfH };
		case 'br':       return { x: halfW, y: halfH, w: b.w - halfW, h: b.h - halfH };
		case 'third-l':  return { x: 0, y: 0, w: third, h: b.h };
		case 'third-c':  return { x: third, y: 0, w: third, h: b.h };
		case 'third-r':  return { x: third * 2, y: 0, w: b.w - third * 2, h: b.h };
		case 'wide-l':   return { x: 0, y: 0, w: twoThirds, h: b.h };
		case 'stack-tr': return { x: twoThirds, y: 0, w: b.w - twoThirds, h: halfH };
		case 'stack-br': return { x: twoThirds, y: halfH, w: b.w - twoThirds, h: b.h - halfH };
		case 'max':      return { x: 0, y: 0, w: b.w, h: b.h };
	}
}

type State = { windows: WindowState[]; nextZ: number };

type Action =
	| { type: 'open'; id: AppId; w: number; h: number; bounds: Bounds }
	| { type: 'close'; id: AppId }
	| { type: 'closeAll' }
	| { type: 'focus'; id: AppId }
	| { type: 'minimise'; id: AppId }
	| { type: 'minimiseAll' }
	| { type: 'toggleMax'; id: AppId; bounds: Bounds }
	| { type: 'snap'; id: AppId; zone: SnapZone; bounds: Bounds }
	| { type: 'setRect'; id: AppId; rect: Rect }
	/* Dragging a maximised or snapped window pops it back to floating size,
	   re-anchored under the cursor — exactly what Windows does. */
	| { type: 'tearOff'; id: AppId; x: number; y: number };

/** Cascade each new window so a second one never lands exactly on the first. */
function spawn(index: number, w: number, h: number, b: Bounds): Rect {
	const step = 28;
	const baseX = Math.max(24, Math.round((b.w - w) / 2) - 60);
	const baseY = Math.max(20, Math.round((b.h - h) / 2) - 30);
	/* Wrap the cascade after six windows so it never walks off-screen. */
	const n = index % 6;
	return {
		x: Math.min(baseX + n * step, Math.max(16, b.w - w - 16)),
		y: Math.min(baseY + n * step, Math.max(16, b.h - h - 16)),
		w,
		h,
	};
}

/** Apply a patch to one window, leaving the rest untouched. */
function patch(
	state: State,
	id: AppId,
	fn: (w: WindowState) => WindowState,
): WindowState[] {
	return state.windows.map((w) => (w.id === id ? fn(w) : w));
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'open': {
			const existing = state.windows.find((win) => win.id === action.id);
			/* Re-opening a running app raises and un-minimises it. */
			if (existing) {
				return {
					nextZ: state.nextZ + 1,
					windows: patch(state, action.id, (w) => ({
						...w,
						minimised: false,
						z: state.nextZ,
					})),
				};
			}
			const b = action.bounds;
			const w = Math.min(action.w, b.w - 32);
			const h = Math.min(action.h, b.h - 32);
			return {
				nextZ: state.nextZ + 1,
				windows: [
					...state.windows,
					{
						id: action.id,
						...spawn(state.windows.length, w, h, b),
						z: state.nextZ,
						minimised: false,
						maximised: false,
						snapped: null,
					},
				],
			};
		}

		case 'close':
			return {
				...state,
				windows: state.windows.filter((w) => w.id !== action.id),
			};

		case 'closeAll':
			return { ...state, windows: [] };

		case 'focus':
			/* Raising an already-top window must not bump nextZ, or every
			   pointer-down on a focused window re-renders the whole stack. */
			if (
				state.windows.find((w) => w.id === action.id)?.z === state.nextZ - 1 &&
				!state.windows.find((w) => w.id === action.id)?.minimised
			) {
				return state;
			}
			return {
				nextZ: state.nextZ + 1,
				windows: patch(state, action.id, (w) => ({
					...w,
					z: state.nextZ,
					minimised: false,
				})),
			};

		case 'minimise':
			return {
				...state,
				windows: patch(state, action.id, (w) => ({ ...w, minimised: true })),
			};

		case 'minimiseAll':
			return {
				...state,
				windows: state.windows.map((w) => ({ ...w, minimised: true })),
			};

		case 'toggleMax':
			return {
				nextZ: state.nextZ + 1,
				windows: patch(state, action.id, (w) => {
					if ((w.maximised || w.snapped) && w.restore) {
						return {
							...w,
							...w.restore,
							maximised: false,
							snapped: null,
							z: state.nextZ,
						};
					}
					return {
						...w,
						restore: { x: w.x, y: w.y, w: w.w, h: w.h },
						...zoneRect('max', action.bounds),
						maximised: true,
						snapped: 'max',
						z: state.nextZ,
					};
				}),
			};

		case 'snap':
			return {
				nextZ: state.nextZ + 1,
				windows: patch(state, action.id, (w) => ({
					...w,
					/* Keep the original floating geometry across successive snaps,
					   so restore always returns to where the window really was. */
					restore: w.snapped ? w.restore : { x: w.x, y: w.y, w: w.w, h: w.h },
					...zoneRect(action.zone, action.bounds),
					maximised: action.zone === 'max',
					snapped: action.zone,
					z: state.nextZ,
				})),
			};

		case 'setRect':
			return {
				...state,
				windows: patch(state, action.id, (w) => ({ ...w, ...action.rect })),
			};

		case 'tearOff':
			return {
				...state,
				windows: patch(state, action.id, (w) => {
					if (!w.maximised && !w.snapped) return w;
					const r = w.restore ?? { x: action.x, y: action.y, w: w.w, h: w.h };
					return {
						...w,
						w: r.w,
						h: r.h,
						x: action.x,
						y: action.y,
						maximised: false,
						snapped: null,
						restore: undefined,
					};
				}),
			};
	}
}

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
