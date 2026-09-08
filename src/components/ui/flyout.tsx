'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A taskbar flyout: the acrylic sheet that Start, Quick Settings and the
 * notification centre all rise out of. Windows anchors each one just above
 * the taskbar and slides it up over ~200ms.
 *
 * **It takes focus, and it gives it back.** Opening one from the keyboard used
 * to leave focus on the taskbar button behind it — Start got away with it
 * because its search box autofocuses, but Quick Settings and the notification
 * centre opened a panel nobody was standing in, and closing any of the three
 * left focus wherever it had been rather than back on the button that opened
 * it. Both halves live here rather than in the three callers.
 *
 * Not a focus trap, and `aria-modal` stays off: these are not modal in Windows
 * and Tab is allowed to walk out of them. What is fixed is arriving and
 * leaving, which is the part that was actually broken.
 */
export default function Flyout({
	children,
	className = '',
	label,
	anchor = 'centre',
	onClose,
	/** Clicks inside this selector do not dismiss — the button that opened it. */
	ignoreSelector,
}: {
	children: React.ReactNode;
	className?: string;
	label: string;
	anchor?: 'left' | 'centre' | 'right';
	onClose: () => void;
	ignoreSelector?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const returnTo = useRef<HTMLElement | null>(null);
	const reduce = useReducedMotion();

	useEffect(() => {
		const panel = ref.current;
		returnTo.current = document.activeElement as HTMLElement | null;

		/* A frame late, so a child that wants the caret — Start's search box —
		   has already claimed it and is not stolen from. */
		const id = requestAnimationFrame(() => {
			if (!panel?.contains(document.activeElement)) panel?.focus();
		});

		return () => {
			cancelAnimationFrame(id);
			const back = returnTo.current;
			const active = document.activeElement;
			/* Only hand it back if nothing else has taken it. Picking a Start
			   tile moves focus into the window that opened; dragging focus back
			   to the taskbar button afterwards would be the opposite of help. */
			const idle = !active || active === document.body || panel?.contains(active);
			if (idle && back && document.contains(back)) back.focus();
		};
	}, []);

	useEffect(() => {
		const onDown = (e: PointerEvent) => {
			const t = e.target as HTMLElement;
			if (ref.current?.contains(t)) return;
			if (ignoreSelector && t.closest(ignoreSelector)) return;
			onClose();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('pointerdown', onDown);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onDown);
			window.removeEventListener('keydown', onKey);
		};
	}, [onClose, ignoreSelector]);

	return (
		<motion.div
			ref={ref}
			className={`flyout flyout-${anchor} ${className}`.trim()}
			role='dialog'
			aria-label={label}
			tabIndex={-1}
			initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
			transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}>
			{children}
		</motion.div>
	);
}
