'use client';

import { useRef } from 'react';

/**
 * Single click selects and double click opens — for a mouse. For everything
 * else, a click opens.
 *
 * Assistive technology activates a control by sending it a click, never a
 * double-click: VoiceOver, NVDA's browse mode, Voice Control's "click About
 * Me", switch access. So does a finger. The desktop grid and Explorer's items
 * answered only to a double-click, so a button named "Open About Me" did
 * nothing when a screen reader pressed it, and a tap on a touch laptop only
 * highlighted the icon. Windows itself has the same split: Folder Options
 * offers single-click-to-open, and touch opens on a tap.
 *
 * Where the click is itself a PointerEvent (Chrome, Edge), its own
 * `pointerType` says what sent it, and '' means no pointer at all — the
 * assistive-technology case. Elsewhere the last primary press stands in. Only
 * a primary press is remembered: a right-click or a drag never produces the
 * click it would be waiting for, and a stale "mouse" used to swallow the next
 * screen-reader activation.
 *
 * The second click of a double-tap is the first one's echo. It used to open
 * again — two Drive tabs from the Resume icon, and in Explorer whatever the
 * first tap had just rendered under the finger.
 *
 * `native` is for a real link: there the browser's own navigation is the
 * open, so a mouse click is stopped (it only selects) and anything else is
 * left to the browser rather than opened twice.
 */
export function useTapOpen(onOpen: () => void, native = false) {
	/* The last press, cleared by the click it belongs to. */
	const press = useRef<string | null>(null);
	/* The last press, kept, so a double-tap cannot open a second time. */
	const last = useRef<string | null>(null);

	return {
		onPointerDown: (e: React.PointerEvent) => {
			if (e.button !== 0) return;
			press.current = e.pointerType;
			last.current = e.pointerType;
		},
		onClick: (e: React.MouseEvent) => {
			const own = (e.nativeEvent as PointerEvent).pointerType;
			const type = own !== undefined ? own || null : press.current;
			press.current = null;
			if (type === 'mouse' || e.detail > 1) {
				if (native) e.preventDefault();
				return;
			}
			if (!native) onOpen();
		},
		onDoubleClick: () => {
			if (last.current && last.current !== 'mouse') return;
			onOpen();
		},
	};
}
