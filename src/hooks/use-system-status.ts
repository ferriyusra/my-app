'use client';

import { useEffect, useState } from 'react';

type BatteryLike = {
	level: number;
	charging: boolean;
	addEventListener: (t: string, fn: () => void) => void;
	removeEventListener: (t: string, fn: () => void) => void;
};

export type SystemStatus = {
	online: boolean;
	/** 0–1, or null where the Battery Status API is unavailable. */
	battery: number | null;
	charging: boolean;
};

/**
 * Live tray state.
 *
 * The network and battery glyphs report the visitor's real machine wherever
 * the browser exposes it, which is the difference between a system tray and a
 * row of stickers. Where the Battery API is missing — Firefox and Safari — the
 * tray falls back to showing power as plugged in rather than inventing a level.
 */
export function useSystemStatus(): SystemStatus {
	const [online, setOnline] = useState(true);
	const [battery, setBattery] = useState<number | null>(null);
	const [charging, setCharging] = useState(true);

	useEffect(() => {
		const sync = () => setOnline(navigator.onLine);
		sync();
		window.addEventListener('online', sync);
		window.addEventListener('offline', sync);
		return () => {
			window.removeEventListener('online', sync);
			window.removeEventListener('offline', sync);
		};
	}, []);

	useEffect(() => {
		const nav = navigator as Navigator & {
			getBattery?: () => Promise<BatteryLike>;
		};
		if (!nav.getBattery) return;

		let cell: BatteryLike | null = null;
		let cancelled = false;
		const read = () => {
			if (!cell) return;
			setBattery(cell.level);
			setCharging(cell.charging);
		};

		nav
			.getBattery()
			.then((b) => {
				if (cancelled) return;
				cell = b;
				read();
				b.addEventListener('levelchange', read);
				b.addEventListener('chargingchange', read);
			})
			.catch(() => {
				/* Permission policy can block this; the fallback stands. */
			});

		return () => {
			cancelled = true;
			cell?.removeEventListener('levelchange', read);
			cell?.removeEventListener('chargingchange', read);
		};
	}, []);

	return { online, battery, charging };
}
