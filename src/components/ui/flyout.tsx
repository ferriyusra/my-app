'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A taskbar flyout: the acrylic sheet that Start, Quick Settings and the
 * notification centre all rise out of. Windows anchors each one just above
 * the taskbar and slides it up over ~200ms.
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
	const reduce = useReducedMotion();

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
			initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
			transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}>
			{children}
		</motion.div>
	);
}
