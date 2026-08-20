'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { playSound, type SoundName } from '@/lib/sounds';
import { DEFAULT_WALLPAPER, FALLBACK_WALLPAPER } from '@/lib/shell-defaults';
import type { AppId, ShellNotification, SnapZone } from '@/types/windows';

/** Which single overlay owns the screen. Only one may be open at a time. */
export type Flyout = 'start' | 'taskview' | 'quick' | 'notifications' | null;

/** The four drawn in CSS, plus anything found in `public/background`. */
export type BuiltInWallpaper = 'bloom' | 'flow' | 'dusk' | 'solid';
export type WallpaperId = BuiltInWallpaper | `custom:${string}`;

/** `custom:sunset.jpg` → `sunset.jpg`, or null for a built-in. */
export function customWallpaperFile(id: string): string | null {
	return id.startsWith('custom:') ? id.slice('custom:'.length) : null;
}

/**
 * `sunset-cliffs.jpg` → `Sunset cliffs`.
 *
 * The filename is the only name a dropped-in image has, so it is what the
 * picker shows. Nothing in the UI mentions where the file came from — a
 * visitor cannot add one, and telling them how would be documentation
 * addressed to the wrong person.
 */
export function wallpaperLabel(file: string): string {
	const base = file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
	return base ? base[0].toUpperCase() + base.slice(1) : file;
}
export type AccentId = 'blue' | 'teal' | 'violet' | 'orange' | 'green' | 'plum';

export const WALLPAPERS: { id: BuiltInWallpaper; label: string }[] = [
	{ id: 'bloom', label: 'Bloom' },
	{ id: 'flow', label: 'Flow' },
	{ id: 'dusk', label: 'Dusk' },
	{ id: 'solid', label: 'Solid colour' },
];

export const ACCENTS: { id: AccentId; label: string; swatch: string }[] = [
	{ id: 'blue', label: 'Windows blue', swatch: '#0f6cbd' },
	{ id: 'teal', label: 'Teal', swatch: '#038387' },
	{ id: 'violet', label: 'Violet', swatch: '#8764b8' },
	{ id: 'plum', label: 'Plum', swatch: '#b146c2' },
	{ id: 'orange', label: 'Orange', swatch: '#ca5010' },
	{ id: 'green', label: 'Green', swatch: '#0b6a0b' },
];

type ShellCtx = {
	/* ── Overlays ── */
	flyout: Flyout;
	openFlyout: (f: Flyout) => void;
	toggleFlyout: (f: Exclude<Flyout, null>) => void;
	closeFlyout: () => void;

	/* ── Notifications ── */
	notifications: ShellNotification[];
	/** The one currently showing as a toast, if any. */
	toast: ShellNotification | null;
	notify: (n: Omit<ShellNotification, 'id' | 'at'>) => void;
	dismissToast: () => void;
	clearNotifications: () => void;

	/** Apps opened this session, most recent first — Start's Recommended row. */
	recents: AppId[];
	pushRecent: (id: AppId) => void;

	/**
	 * Set while Windows' Snap Assist is offering to fill the other half of the
	 * screen: the zone still free, and the window that just claimed its
	 * neighbour (which is therefore not a candidate).
	 */
	snapAssist: { zone: SnapZone; source: AppId } | null;
	offerSnapAssist: (source: AppId, zone: SnapZone) => void;
	dismissSnapAssist: () => void;

	/** Apps pinned to the taskbar, whether or not they are running. */
	pinned: AppId[];
	togglePin: (id: AppId) => void;
	isPinned: (id: AppId) => boolean;

	/* ── Personalisation, persisted to localStorage ── */
	sound: boolean;
	setSound: (on: boolean) => void;
	/** Cue loudness, 0–1. Driven by the Quick Settings volume slider. */
	volume: number;
	setVolume: (v: number) => void;
	/** Screen dimming, 0.35–1. Driven by the Quick Settings brightness slider. */
	brightness: number;
	setBrightness: (v: number) => void;
	play: (name: SoundName) => void;
	wallpaper: WallpaperId;
	setWallpaper: (w: WallpaperId) => void;
	/** Image files found in `public/background`, in name order. */
	customWallpapers: string[];

	/**
	 * Whether this "copy of Windows" is activated. It is not, to begin with,
	 * which is what puts the watermark over the desktop — and Settings is
	 * where the watermark's own instruction actually leads.
	 */
	activated: boolean;
	activate: () => void;

	/** The desktop cat. Off means it is in its house, and it walks there. */
	catOn: boolean;
	setCatOn: (on: boolean) => void;
	/**
	 * Where the cat is between those two states. Going in or coming out takes
	 * a walk and an animation, and the switch stays disabled until it lands —
	 * otherwise a second click mid-walk leaves the cat in two places at once.
	 */
	catPhase: CatPhase;
	catBusy: boolean;
	/** The cat reports it has finished going in or coming out. */
	catSettled: () => void;
	/** Bumped whenever something puts food down; the cat watches the count. */
	feedTick: number;
	feedCat: () => void;
	accent: AccentId;
	setAccent: (a: AccentId) => void;

	/* ── Power ── */
	power: PowerState;
	setPower: (p: PowerState) => void;

	/**
	 * False while the boot / lock / sign-in sequence is on screen. The desktop
	 * mounts behind it either way, so this only gates the things that would be
	 * wasted on a visitor who cannot see them yet — the first window opening
	 * and the welcome toast.
	 */
	booted: boolean;
	finishBoot: () => void;
	/** Replays the sequence. Start's Restart is the only caller. */
	replayBoot: () => void;
};

/** What the screen is doing: running, asleep, or off. */
export type PowerState = 'on' | 'sleep' | 'off';

/** Out and about, walking home, tucked up inside, or coming back out. */
export type CatPhase = 'out' | 'leaving' | 'home' | 'arriving';

const Ctx = createContext<ShellCtx | null>(null);

export function useShell() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error('useShell must be used inside <ShellProvider>');
	return ctx;
}

const KEY = {
	sound: 'shell:sound',
	volume: 'shell:volume',
	brightness: 'shell:brightness',
	wallpaper: 'shell:wallpaper',
	accent: 'shell:accent',
	pinned: 'shell:pinned',
	cat: 'shell:cat',
	/* Session, not local: the boot sequence should play once per visit, not
	   once per machine, and not on every in-session reload. */
	booted: 'shell:booted',
	activated: 'shell:activated',
} as const;

/**
 * Reads a persisted 0–1 slider value, falling back when absent or corrupt.
 *
 * The null check matters: `Number(null)` is 0, which is a legitimate volume,
 * so without it an unset key would read as "muted" for every first visitor.
 */
function readNumber(key: string, fallback: number, min: number): number {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		if (raw === null || raw === '') return fallback;
		const n = Number(raw);
		return Number.isFinite(n) && n >= min && n <= 1 ? n : fallback;
	} catch {
		return fallback;
	}
}

function read<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const v = localStorage.getItem(key);
		return allowed.includes(v as T) ? (v as T) : fallback;
	} catch {
		return fallback;
	}
}

const WALLPAPER_IDS = WALLPAPERS.map((w) => w.id);
const ACCENT_IDS = ACCENTS.map((a) => a.id);

/** Taskbar pins before the visitor has changed any. */
const DEFAULT_PINNED: AppId[] = ['explorer', 'edge', 'vscode', 'about'];
const PINNABLE: AppId[] = [
	'about',
	'explorer',
	'skills',
	'experience',
	'contact',
	'media',
	'settings',
	'edge',
	'vscode',
	'recycle',
];

/** Restores pins, discarding anything that is no longer a known app. */
function readPins(): AppId[] {
	if (typeof window === 'undefined') return DEFAULT_PINNED;
	try {
		const raw = localStorage.getItem(KEY.pinned);
		if (!raw) return DEFAULT_PINNED;
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return DEFAULT_PINNED;
		const clean = parsed.filter((id): id is AppId =>
			PINNABLE.includes(id as AppId),
		);
		return clean.length ? clean : DEFAULT_PINNED;
	} catch {
		return DEFAULT_PINNED;
	}
}

export function ShellProvider({
	children,
	customWallpapers = [],
}: {
	children: React.ReactNode;
	customWallpapers?: string[];
}) {
	const [flyout, setFlyout] = useState<Flyout>(null);
	/* Stable identities: `closeFlyout` ends up in the dependency array of
	   `launch`, which in turn gates the shell's one-shot boot effect. An
	   inline arrow here would re-create that chain on every state change and
	   the boot effect would cancel its own timer before it ever fired. */
	const openFlyout = useCallback((f: Flyout) => setFlyout(f), []);
	const toggleFlyout = useCallback(
		(f: Exclude<Flyout, null>) => setFlyout((cur) => (cur === f ? null : f)),
		[],
	);
	const closeFlyout = useCallback(() => setFlyout(null), []);
	const [notifications, setNotifications] = useState<ShellNotification[]>([]);
	const [toast, setToast] = useState<ShellNotification | null>(null);
	const dismissToast = useCallback(() => setToast(null), []);
	const clearNotifications = useCallback(() => setNotifications([]), []);
	const [power, setPowerState] = useState<PowerState>('on');
	const [booted, setBooted] = useState(() => {
		if (typeof window === 'undefined') return false;
		try {
			return sessionStorage.getItem(KEY.booted) === '1';
		} catch {
			return false;
		}
	});

	const finishBoot = useCallback(() => {
		setBooted(true);
		try {
			sessionStorage.setItem(KEY.booted, '1');
		} catch {
			/* Private mode — the sequence simply plays again next reload. */
		}
	}, []);

	const replayBoot = useCallback(() => {
		setFlyout(null);
		setBooted(false);
	}, []);
	const [recents, setRecents] = useState<AppId[]>([]);
	const [snapAssist, setSnapAssist] =
		useState<ShellCtx['snapAssist']>(null);

	const offerSnapAssist = useCallback(
		(source: AppId, zone: SnapZone) => setSnapAssist({ source, zone }),
		[],
	);
	const dismissSnapAssist = useCallback(() => setSnapAssist(null), []);
	const [pinned, setPinned] = useState<AppId[]>(readPins);

	const pushRecent = useCallback(
		(id: AppId) => setRecents((r) => [id, ...r.filter((x) => x !== id)].slice(0, 6)),
		[],
	);

	/* Personalisation is read straight out of storage by each lazy
	   initialiser. Every reader falls back on the server, and none of these
	   values reaches the DOM before the desktop mounts, so there is no
	   hydration mismatch to paper over — and no cascading render from an
	   effect that only ever runs once. */
	const [sound, setSoundState] = useState(
		() => read(KEY.sound, 'off', ['on', 'off'] as const) === 'on',
	);
	const [volume, setVolumeState] = useState(() => readNumber(KEY.volume, 0.7, 0));
	const [brightness, setBrightnessState] = useState(() =>
		readNumber(KEY.brightness, 1, 0.35),
	);
	const [wallpaper, setWallpaperState] = useState<WallpaperId>(() => {
		/* A custom id is only honoured if that file is still in the listing —
		   otherwise a since-deleted image would leave a blank desktop. That
		   applies to the default too, so removing it from public/background
		   degrades to the drawn fallback instead of breaking. */
		const usable = (id: string): WallpaperId | null => {
			const file = customWallpaperFile(id);
			if (file) return customWallpapers.includes(file) ? (id as WallpaperId) : null;
			return (WALLPAPER_IDS as string[]).includes(id) ? (id as WallpaperId) : null;
		};
		const fallback = () =>
			usable(DEFAULT_WALLPAPER) ?? (FALLBACK_WALLPAPER as WallpaperId);

		if (typeof window === 'undefined') return fallback();
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(KEY.wallpaper);
		} catch {
			return fallback();
		}
		return (stored && usable(stored)) || fallback();
	});
	const [accent, setAccentState] = useState<AccentId>(() =>
		read(KEY.accent, 'blue', ACCENT_IDS),
	);
	const [catOn, setCatOnState] = useState(
		() => read(KEY.cat, 'on', ['on', 'off'] as const) === 'on',
	);
	/* A reload puts the cat straight into whichever state it was left in —
	   no walking home on arrival. */
	const [catPhase, setCatPhase] = useState<CatPhase>(() =>
		read(KEY.cat, 'on', ['on', 'off'] as const) === 'on' ? 'out' : 'home',
	);
	const [feedTick, setFeedTick] = useState(0);
	const [activated, setActivated] = useState(
		() => read(KEY.activated, 'no', ['yes', 'no'] as const) === 'yes',
	);


	/* Dimming is one custom property on <html>; the overlay that reads it sits
	   above the whole shell, so windows dim with the wallpaper as they would. */
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--screen-dim',
			String(Math.round((1 - brightness) * 100) / 100),
		);
	}, [brightness]);

	/* Wallpaper and accent are pure CSS switches: one attribute on <html>
	   swaps every token, so nothing re-renders to repaint the shell. */
	useEffect(() => {
		const root = document.documentElement;
		const file = customWallpaperFile(wallpaper);
		if (file) {
			/* One attribute for the stylesheet, one property for the image —
			   the filename cannot be hard-coded in CSS. */
			root.dataset.wallpaper = 'custom';
			root.style.setProperty(
				'--wp-custom',
				`url("/background/${encodeURIComponent(file)}")`,
			);
		} else {
			root.dataset.wallpaper = wallpaper;
			root.style.removeProperty('--wp-custom');
		}
	}, [wallpaper]);

	useEffect(() => {
		document.documentElement.dataset.accent = accent;
	}, [accent]);

	const persist = (key: string, value: string) => {
		try {
			localStorage.setItem(key, value);
		} catch {
			/* Private mode — the setting still applies for this session. */
		}
	};

	/* `play` is read through refs so it keeps a stable identity — it is called
	   from deep inside memoised windows, and a new function each render would
	   invalidate every one of them. Writing the refs in an effect rather than
	   during render keeps the component pure; every caller is an event handler
	   that runs after the commit, so it never sees a stale value. */
	const soundRef = useRef(sound);
	const volumeRef = useRef(volume);
	useEffect(() => {
		soundRef.current = sound;
		volumeRef.current = volume;
	}, [sound, volume]);

	const play = useCallback((name: SoundName) => {
		if (soundRef.current) playSound(name, volumeRef.current);
	}, []);

	const setSound = useCallback((on: boolean) => {
		setSoundState(on);
		persist(KEY.sound, on ? 'on' : 'off');
		if (on) playSound('notify', volumeRef.current);
	}, []);

	const setVolume = useCallback((v: number) => {
		setVolumeState(v);
		persist(KEY.volume, String(v));
	}, []);

	const setBrightness = useCallback((v: number) => {
		setBrightnessState(v);
		persist(KEY.brightness, String(v));
	}, []);

	const setWallpaper = useCallback((w: WallpaperId) => {
		setWallpaperState(w);
		persist(KEY.wallpaper, w);
	}, []);

	const setCatOn = useCallback((on: boolean) => {
		setCatOnState(on);
		persist(KEY.cat, on ? 'on' : 'off');
		setCatPhase(on ? 'arriving' : 'leaving');
	}, []);

	const catSettled = useCallback(() => {
		setCatPhase((p) =>
			p === 'leaving' ? 'home' : p === 'arriving' ? 'out' : p,
		);
	}, []);

	const feedCat = useCallback(() => setFeedTick((n) => n + 1), []);

	const activate = useCallback(() => {
		setActivated(true);
		persist(KEY.activated, 'yes');
	}, []);

	const setAccent = useCallback((a: AccentId) => {
		setAccentState(a);
		persist(KEY.accent, a);
	}, []);

	/* The write stays out of the updater: React may run an updater during the
	   render phase, and in development runs it twice, so a side effect in
	   there is neither pure nor run once. */
	const togglePin = useCallback(
		(id: AppId) => {
			const next = pinned.includes(id)
				? pinned.filter((p) => p !== id)
				: [...pinned, id];
			setPinned(next);
			persist(KEY.pinned, JSON.stringify(next));
		},
		[pinned],
	);

	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const seq = useRef(0);

	const notify = useCallback(
		(n: Omit<ShellNotification, 'id' | 'at'>) => {
			const full: ShellNotification = {
				...n,
				id: `n${++seq.current}`,
				at: Date.now(),
			};
			setNotifications((list) => [full, ...list].slice(0, 20));
			setToast(full);
			play('notify');
			if (toastTimer.current) clearTimeout(toastTimer.current);
			toastTimer.current = setTimeout(() => setToast(null), 6000);
		},
		[play],
	);

	useEffect(
		() => () => {
			if (toastTimer.current) clearTimeout(toastTimer.current);
		},
		[],
	);

	const value = useMemo<ShellCtx>(
		() => ({
			flyout,
			openFlyout,
			toggleFlyout,
			closeFlyout,

			notifications,
			toast,
			notify,
			dismissToast,
			clearNotifications,

			recents,
			pushRecent,
			snapAssist,
			offerSnapAssist,
			dismissSnapAssist,
			pinned,
			togglePin,
			isPinned: (id) => pinned.includes(id),

			sound,
			setSound,
			volume,
			setVolume,
			brightness,
			setBrightness,
			play,
			wallpaper,
			setWallpaper,
			customWallpapers,
			accent,
			setAccent,
			activated,
			activate,

			catOn,
			setCatOn,
			catPhase,
			catBusy: catPhase === 'leaving' || catPhase === 'arriving',
			catSettled,
			feedTick,
			feedCat,

			booted,
			finishBoot,
			replayBoot,

			power,
			setPower: (p) => {
				if (p !== 'on') setFlyout(null);
				setPowerState(p);
			},
		}),
		[
			flyout,
			openFlyout,
			toggleFlyout,
			closeFlyout,
			dismissToast,
			clearNotifications,
			notifications,
			toast,
			notify,
			recents,
			pushRecent,
			snapAssist,
			offerSnapAssist,
			dismissSnapAssist,
			pinned,
			togglePin,
			sound,
			setSound,
			volume,
			setVolume,
			brightness,
			setBrightness,
			play,
			wallpaper,
			setWallpaper,
			customWallpapers,
			accent,
			setAccent,
			activated,
			activate,
			catOn,
			setCatOn,
			catPhase,
			catSettled,
			feedTick,
			feedCat,
			booted,
			finishBoot,
			replayBoot,
			power,
		],
	);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
