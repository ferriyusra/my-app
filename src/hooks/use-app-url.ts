'use client';

import { useEffect, useRef } from 'react';
import { useWindows } from '@/context/window-context';
import { useShell } from '@/context/shell-context';
import { useWindowManager, placementBounds } from '@/hooks/use-window-manager';
import { isAppId } from '@/components/apps/registry';
import { sendIntent } from '@/hooks/use-app-intent';
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
 * Below this desktop width About's two thirds would be under 800px and Tips'
 * third under 400px, so the pair cascades instead.
 */
const SIDE_BY_SIDE_MIN = 1200;

/**
 * Where inside the front window the reader is, as the address bar's `at`.
 *
 * Only one place is worth a URL today: Experience's case study, which is the
 * thing the owner sends a link to. `?app=experience&at=case` lands on it,
 * on the desktop and — through DocDeepLink — on a phone.
 *
 * An app announces its place rather than writing the address bar itself, so
 * this hook stays the only writer of it.
 */
const AT = 'at';
const PLACE_EVENT = 'shell:app-place';
type Place = { app: AppId; at: string | null };

/** Say where in `app` the reader now is; `null` for its front page. */
export function announcePlace(app: AppId, at: string | null) {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new CustomEvent<Place>(PLACE_EVENT, { detail: { app, at } }));
}

/** The app named in the current URL, if it names a real one. */
function appFromUrl(): AppId | null {
	if (typeof window === 'undefined') return null;
	const id = new URLSearchParams(window.location.search).get(PARAM);
	return id && isAppId(id) ? id : null;
}

export function useAppUrl() {
	const { windows, topZ } = useWindows();
	const { launch, focus, snap } = useWindowManager();
	const { booted, arrival } = useShell();

	/** What the URL last said, so a sync does not fight a user action. */
	const shown = useRef<AppId | null>(null);
	const started = useRef(false);
	/** Which apps were open last time round, to tell opening from raising. */
	const wasOpen = useRef<AppId[]>([]);
	/** The last place an app announced, kept while that app is in front. */
	const place = useRef<Place | null>(null);

	/* Arrival: open what was asked for, or About when nothing was. A shared
	   ?app= link wins, because it is read first.

	   A visitor's very first arrival used to open Tips alone — the first thing
	   anybody did here was drag, snap and close the window that says windows
	   drag, snap and close. Clever, and the wrong opening for a hiring manager
	   checking a claim: a manual with no evidence in it, and a desktop with no
	   name on it once the manual was closed. Now About opens in front, and
	   Tips opens beside it, snapped to the other half — which demonstrates
	   snapping without anyone reading about it. Where the desktop is too
	   narrow for two panes, Tips sits behind About in the cascade instead.

	   The split is two thirds and one third, not halves. At half of a 1280px
	   screen About was 640px wide, a third of it nav rail, and the evidence
	   sat in a column narrower than the phone view with its CV buttons
	   stacked three high, beside a manual of the same width. The reader came
	   for About; Tips is the aside. Both are laid out clear of the floor, as
	   a launched window is, so the cat, its house and the watermark walk
	   under neither on arrival. A snap the visitor makes still uses the whole
	   desktop. */
	useEffect(() => {
		if (!booted || started.current) return;
		started.current = true;
		const asked = appFromUrl();
		shown.current = asked;
		const at = new URLSearchParams(window.location.search).get(AT);
		if (asked === 'experience' && at === 'case') sendIntent('experience', 'case');
		if (asked || arrival !== 'first') {
			launch(asked ?? 'about');
			return;
		}
		/* Tips first so About, launched second, is the one in front. The
		   context's own `snap` rather than the manager's: this is a layout,
		   not a gesture, and must not have Snap Assist offer to fill a half
		   that is already full. */
		const b = placementBounds();
		launch('tips');
		launch('about');
		if (b.w >= SIDE_BY_SIDE_MIN) {
			snap('tips', 'third-r', b);
			snap('about', 'wide-l', b);
		}
	}, [booted, arrival, launch, snap]);

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
		/* A place belongs to one app; raising another drops it. */
		if (place.current?.app === front && place.current.at) url.searchParams.set(AT, place.current.at);
		else url.searchParams.delete(AT);

		/* An app that was not open a moment ago is a navigation; one that was
		   is merely being raised, and rewrites the entry instead of adding to
		   the back stack. */
		const opening = !!front && !previously.includes(front);
		shown.current = front;
		window.history[opening ? 'pushState' : 'replaceState']({}, '', url);
	}, [windows, topZ]);

	/* An app moving within itself rewrites the current entry — a place is not
	   a navigation, and the back button should not step through pages of one
	   window. */
	useEffect(() => {
		const onPlace = (e: Event) => {
			const next = (e as CustomEvent<Place>).detail;
			place.current = next;
			if (!started.current || shown.current !== next.app) return;
			const url = new URL(window.location.href);
			if (next.at) url.searchParams.set(AT, next.at);
			else url.searchParams.delete(AT);
			window.history.replaceState({}, '', url);
		};
		window.addEventListener(PLACE_EVENT, onPlace);
		return () => window.removeEventListener(PLACE_EVENT, onPlace);
	}, []);

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
