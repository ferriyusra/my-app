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
 * The press is remembered from `pointerdown`, because a click that no pointer
 * preceded is precisely the assistive-technology case — and `pointerType` on
 * the click itself is not reported by every browser.
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
			press.current = e.pointerType;
			last.current = e.pointerType;
		},
		onClick: (e: React.MouseEvent) => {
			const type = press.current;
			press.current = null;
			if (type === 'mouse') {
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
