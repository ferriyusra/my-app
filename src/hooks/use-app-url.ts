'use client';

import { useEffect, useRef } from 'react';
import { useWindows } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { isAppId } from '@/components/apps/registry';
import type { AppId } from '@/types/windows';

/**
 * Puts the frontmost window in the address bar, and opens whatever the address
 * bar names on arrival.
 *
 * Without this every link to the portfolio lands on About, so there is no way
 * to send someone straight to the projects — which is most of what sharing a
 * portfolio is for. It also gives the back button something to do inside a
 * shell that is otherwise a single route.
 *
 * `history` is driven directly rather than through the router: this only ever
 * changes a query string, and a real navigation would tear down and remount
 * the whole desktop.
 */

const PARAM = 'app';

/**
 * Below this desktop width the two first-arrival windows would each get less
 * than 600px, which is too narrow for a Settings-style pane with a rail.
 */
const SIDE_BY_SIDE_MIN = 1200;

/** The app named in the current URL, if it names a real one. */
function appFromUrl(): AppId | null {
	if (typeof window === 'undefined') return null;
	const id = new URLSearchParams(window.location.search).get(PARAM);
	return id && isAppId(id) ? id : null;
}

export function useAppUrl() {
	const { windows, topZ } = useWindows();
	const { launch, focus, snap, bounds } = useWindowManager();
	const { booted, arrival } = useShell();

	/** What the URL last said, so a sync does not fight a user action. */
	const shown = useRef<AppId | null>(null);
	const started = useRef(false);
	/** Which apps were open last time round, to tell opening from raising. */
	const wasOpen = useRef<AppId[]>([]);

	/* Arrival: open what was asked for, or About when nothing was. A shared
	   ?app= link wins, because it is read first.

	   A visitor's very first arrival used to open Tips alone — the first thing
	   anybody did here was drag, snap and close the window that says windows
	   drag, snap and close. Clever, and the wrong opening for a hiring manager
	   checking a claim: a manual with no evidence in it, and a desktop with no
	   name on it once the manual was closed. Now About opens in front, and
	   Tips opens beside it, snapped to the other half — which demonstrates
	   snapping without anyone reading about it. Where the desktop is too
	   narrow for two panes, Tips sits behind About in the cascade instead. */
	useEffect(() => {
		if (!booted || started.current) return;
		started.current = true;
		const asked = appFromUrl();
		shown.current = asked;
		if (asked || arrival !== 'first') {
			launch(asked ?? 'about');
			return;
		}
		/* Tips first so About, launched second, is the one in front. The
		   context's own `snap` rather than the manager's: this is a layout,
		   not a gesture, and must not have Snap Assist offer to fill a half
		   that is already full. */
		const b = bounds();
		launch('tips');
		launch('about');
		if (b.w >= SIDE_BY_SIDE_MIN) {
			snap('tips', 'right', b);
			snap('about', 'left', b);
		}
	}, [booted, arrival, launch, snap, bounds]);

	/* Keep the address bar pointed at whatever is in front. Opening an app is
	   a navigation and gets a history entry; merely raising one that is
	   already open only rewrites the current entry, so clicking between two
	   open windows does not fill the back stack. */
	useEffect(() => {
		if (!started.current) return;
		const previously = wasOpen.current;
		wasOpen.current = windows.map((w) => w.id);

		/* The frontmost window you can actually see. `topZ` may belong to a
		   minimised one, which is not what the address bar should name. */
		const visible = windows.filter((w) => !w.minimised);
		const front = visible.length
			? visible.reduce((a, b) => (a.z > b.z ? a : b)).id
			: null;
		if (front === shown.current) return;

		const url = new URL(window.location.href);
		if (front) url.searchParams.set(PARAM, front);
		else url.searchParams.delete(PARAM);

		/* An app that was not open a moment ago is a navigation; one that was
		   is merely being raised, and rewrites the entry instead of adding to
		   the back stack. */
		const opening = !!front && !previously.includes(front);
		shown.current = front;
		window.history[opening ? 'pushState' : 'replaceState']({}, '', url);
	}, [windows, topZ]);

	/* Back and forward move between the apps that were opened. */
	useEffect(() => {
		const onPop = () => {
			const asked = appFromUrl();
			shown.current = asked;
			if (!asked) return;
			/* Focus rather than launch when it is already open, so going back
			   does not re-run the open animation. */
			if (windows.some((w) => w.id === asked)) focus(asked);
			else launch(asked);
		};
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, [windows, focus, launch]);
}
