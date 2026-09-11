'use client';

import { useEffect, useRef } from 'react';
import type { AppId } from '@/types/windows';

/**
 * A one-line note from one window to another, delivered with the launch.
 *
 * About and Start both open Experience *at the case study*, and the window
 * manager only knows how to open an app, not where in it. Threading a page
 * through the reducer would put one app's vocabulary into the shell's state
 * for a single reader, so the note travels beside the launch instead: the
 * sender leaves it here and announces it; the receiver collects it when it
 * mounts, or at once if it is already open.
 *
 * Nothing persists. A note nobody collects goes with the page.
 */

const EVENT = 'shell:app-intent';
const pending = new Map<AppId, string>();

/** Leave a note for `app`. Launch it afterwards; order does not matter. */
export function sendIntent(app: AppId, value: string) {
	pending.set(app, value);
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent<AppId>(EVENT, { detail: app }));
	}
}

/** Collect the note addressed to `app`: now, and whenever another arrives. */
export function useAppIntent(app: AppId, onIntent: (value: string) => void) {
	const handler = useRef(onIntent);
	useEffect(() => {
		handler.current = onIntent;
	}, [onIntent]);

	useEffect(() => {
		const take = () => {
			const value = pending.get(app);
			if (value === undefined) return;
			pending.delete(app);
			handler.current(value);
		};
		take();
		const listen = (e: Event) => {
			if ((e as CustomEvent<AppId>).detail === app) take();
		};
		window.addEventListener(EVENT, listen);
		return () => window.removeEventListener(EVENT, listen);
	}, [app]);
}
