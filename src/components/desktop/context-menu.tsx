'use client';

import { useEffect, useRef } from 'react';
import {
	FolderOpen,
	RefreshCw,
	Pin,
	Paintbrush,
	Info,
	type LucideIcon,
} from 'lucide-react';

export type MenuItem =
	| { kind: 'item'; label: string; Icon: LucideIcon; shortcut?: string; onSelect: () => void }
	| { kind: 'separator' };

/**
 * The Windows 11 desktop context menu: a small acrylic sheet of icon-and-label
 * rows, flipped back on-screen when it would overflow the viewport.
 */
export default function ContextMenu({
	x,
	y,
	items,
	onClose,
}: {
	x: number;
	y: number;
	items: MenuItem[];
	onClose: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.focus({ preventScroll: true });
		// Keep the sheet inside the viewport, as Windows does.
		const r = el.getBoundingClientRect();
		if (r.right > window.innerWidth - 8) {
			el.style.left = `${Math.max(8, window.innerWidth - r.width - 8)}px`;
		}
		if (r.bottom > window.innerHeight - 64) {
			el.style.top = `${Math.max(8, window.innerHeight - r.height - 64)}px`;
		}
	}, []);

	useEffect(() => {
		const dismiss = () => onClose();
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		document.addEventListener('pointerdown', dismiss);
		window.addEventListener('blur', dismiss);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', dismiss);
			window.removeEventListener('blur', dismiss);
			window.removeEventListener('keydown', onKey);
		};
	}, [onClose]);

	return (
		<div
			ref={ref}
			className='ctxmenu'
			role='menu'
			tabIndex={-1}
			style={{ left: x, top: y }}
			onPointerDown={(e) => e.stopPropagation()}
			onContextMenu={(e) => e.preventDefault()}>
			{items.map((item, i) =>
				item.kind === 'separator' ? (
					<span key={i} className='ctxmenu-sep' role='separator' />
				) : (
					<button
						key={item.label}
						type='button'
						role='menuitem'
						className='ctxmenu-item'
						onClick={() => {
							item.onSelect();
							onClose();
						}}>
						<item.Icon size={16} aria-hidden='true' />
						{item.label}
						{item.shortcut && <kbd>{item.shortcut}</kbd>}
					</button>
				),
			)}
		</div>
	);
}

export const MENU_ICONS = { FolderOpen, RefreshCw, Pin, Paintbrush, Info };
