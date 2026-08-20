'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from 'react';

export type AppId =
	| 'about'
	| 'experience'
	| 'projects'
	| 'skills'
	| 'contact';

export type WindowState = {
	id: AppId;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	minimised: boolean;
	maximised: boolean;
	/** Position before maximising, so restore puts it back. */
	restore?: { x: number; y: number; w: number; h: number };
};

/** The zones Windows 11 offers from its Snap Layouts flyout. */
export type SnapZone = 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br' | 'max';

function zoneRect(zone: SnapZone, b: { w: number; h: number }) {
	const halfW = Math.round(b.w / 2);
	const halfH = Math.round(b.h / 2);
	switch (zone) {
		case 'left':  return { x: 0, y: 0, w: halfW, h: b.h };
		case 'right': return { x: halfW, y: 0, w: b.w - halfW, h: b.h };
		case 'tl':    return { x: 0, y: 0, w: halfW, h: halfH };
		case 'tr':    return { x: halfW, y: 0, w: b.w - halfW, h: halfH };
		case 'bl':    return { x: 0, y: halfH, w: halfW, h: b.h - halfH };
		case 'br':    return { x: halfW, y: halfH, w: b.w - halfW, h: b.h - halfH };
		case 'max':   return { x: 0, y: 0, w: b.w, h: b.h };
	}
}

type State = { windows: WindowState[]; nextZ: number };

type Action =
	| { type: 'open'; id: AppId; w: number; h: number }
	| { type: 'close'; id: AppId }
	| { type: 'focus'; id: AppId }
	| { type: 'minimise'; id: AppId }
	| { type: 'toggleMax'; id: AppId; bounds: { w: number; h: number } }
	| { type: 'snap'; id: AppId; zone: SnapZone; bounds: { w: number; h: number } }
	| { type: 'move'; id: AppId; x: number; y: number }
	| { type: 'resize'; id: AppId; w: number; h: number };

/* Cascade each new window so a second one never lands exactly on the first. */
function spawn(index: number, w: number, h: number, vw: number, vh: number) {
	const step = 32;
	const baseX = Math.max(24, (vw - w) / 2 - 80);
	const baseY = Math.max(24, (vh - h) / 2 - 60);
	return {
		x: Math.min(baseX + index * step, Math.max(24, vw - w - 24)),
		y: Math.min(baseY + index * step, Math.max(24, vh - h - 96)),
	};
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'open': {
			const existing = state.windows.find((win) => win.id === action.id);
			if (existing) {
				return {
					...state,
					nextZ: state.nextZ + 1,
					windows: state.windows.map((win) =>
						win.id === action.id
							? { ...win, minimised: false, z: state.nextZ }
							: win,
					),
				};
			}
			const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
			const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
			const w = Math.min(action.w, vw - 48);
			const h = Math.min(action.h, vh - 120);
			// Cascade from however many windows are already open.
			const { x, y } = spawn(state.windows.length, w, h, vw, vh);
			return {
				nextZ: state.nextZ + 1,
				windows: [
					...state.windows,
					{ id: action.id, x, y, w, h, z: state.nextZ, minimised: false, maximised: false },
				],
			};
		}
		case 'close':
			return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
		case 'focus':
			return {
				...state,
				nextZ: state.nextZ + 1,
				windows: state.windows.map((w) =>
					w.id === action.id ? { ...w, z: state.nextZ, minimised: false } : w,
				),
			};
		case 'minimise':
			return {
				...state,
				windows: state.windows.map((w) =>
					w.id === action.id ? { ...w, minimised: true } : w,
				),
			};
		case 'toggleMax':
			return {
				...state,
				nextZ: state.nextZ + 1,
				windows: state.windows.map((w) => {
					if (w.id !== action.id) return w;
					if (w.maximised && w.restore) {
						return { ...w, ...w.restore, maximised: false, z: state.nextZ };
					}
					return {
						...w,
						restore: { x: w.x, y: w.y, w: w.w, h: w.h },
						x: 0,
						y: 0,
						w: action.bounds.w,
						h: action.bounds.h,
						maximised: true,
						z: state.nextZ,
					};
				}),
			};
		case 'snap': {
			const rect = zoneRect(action.zone, action.bounds);
			return {
				...state,
				nextZ: state.nextZ + 1,
				windows: state.windows.map((w) =>
					w.id === action.id
						? {
								...w,
								restore: w.maximised ? w.restore : { x: w.x, y: w.y, w: w.w, h: w.h },
								...rect,
								maximised: action.zone === 'max',
								z: state.nextZ,
							}
						: w,
				),
			};
		}
		case 'move':
			return {
				...state,
				windows: state.windows.map((w) =>
					w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
				),
			};
		case 'resize':
			return {
				...state,
				windows: state.windows.map((w) =>
					w.id === action.id ? { ...w, w: action.w, h: action.h } : w,
				),
			};
	}
}

type Ctx = {
	windows: WindowState[];
	open: (id: AppId, w?: number, h?: number) => void;
	close: (id: AppId) => void;
	focus: (id: AppId) => void;
	minimise: (id: AppId) => void;
	toggleMax: (id: AppId, bounds: { w: number; h: number }) => void;
	snap: (id: AppId, zone: SnapZone, bounds: { w: number; h: number }) => void;
	move: (id: AppId, x: number, y: number) => void;
	resize: (id: AppId, w: number, h: number) => void;
	topZ: number;
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
		(id: AppId, w = 880, h = 600) => dispatch({ type: 'open', id, w, h }),
		[],
	);

	const value = useMemo<Ctx>(
		() => ({
			windows: state.windows,
			open,
			close: (id) => dispatch({ type: 'close', id }),
			focus: (id) => dispatch({ type: 'focus', id }),
			minimise: (id) => dispatch({ type: 'minimise', id }),
			toggleMax: (id, bounds) => dispatch({ type: 'toggleMax', id, bounds }),
			snap: (id, zone, bounds) => dispatch({ type: 'snap', id, zone, bounds }),
			move: (id, x, y) => dispatch({ type: 'move', id, x, y }),
			resize: (id, w, h) => dispatch({ type: 'resize', id, w, h }),
			topZ: state.nextZ - 1,
		}),
		[state.windows, state.nextZ, open],
	);

	return <WindowCtx.Provider value={value}>{children}</WindowCtx.Provider>;
}
