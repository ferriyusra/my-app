'use client';

import { useEffect, useRef, useState } from 'react';
/* The title bar stays entirely Lucide. LineIcons has no minimise or restore
   glyph, so mixing families here put a heavy LineIcons X beside a light Lucide
   minus — the three controls sit 4px apart and read as one set, or they read as
   a mistake. */
import { Copy, Minus, Square, X } from 'lucide-react';
import SnapFlyout from './snap-flyout';
import type { SnapZone } from '@/types/windows';

/**
 * The caption buttons. Windows opens Snap Layouts when the pointer rests on
 * maximise, so the flyout is owned here rather than by the frame.
 *
 * From the keyboard it opens on ↓ while maximise has focus, not on focus
 * itself. Opening on focus meant the second Tab in any window popped a
 * 250×170 panel over the content, put its twelve cells in the Tab order
 * ahead of Close — View CV went from Tab 7 to Tab 19 — and left it open; and
 * Escape, the obvious way out, closed the whole window instead.
 */
export default function WindowControls({
	title,
	maximised,
	onMinimise,
	onToggleMax,
	onSnap,
	onClose,
}: {
	title: string;
	maximised: boolean;
	onMinimise: () => void;
	onToggleMax: () => void;
	onSnap: (zone: SnapZone) => void;
	onClose: () => void;
}) {
	const [snapOpen, setSnapOpen] = useState(false);
	/* Whether the flyout was opened from the keyboard, and so should take
	   focus; a hover must not move it. */
	const [fromKeys, setFromKeys] = useState(false);
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const maxBtn = useRef<HTMLButtonElement>(null);

	/* Windows waits a beat before the flyout appears, so a pointer merely
	   crossing the button on its way to Close never triggers it. */
	const armOpen = () => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		hoverTimer.current = setTimeout(() => {
			setFromKeys(false);
			setSnapOpen(true);
		}, 320);
	};
	const cancelOpen = () => {
		if (hoverTimer.current) clearTimeout(hoverTimer.current);
		setSnapOpen(false);
	};

	useEffect(
		() => () => {
			if (hoverTimer.current) clearTimeout(hoverTimer.current);
		},
		[],
	);

	return (
		<div className='win-caption'>
			<button
				type='button'
				className='win-cap-btn'
				aria-label={`Minimise ${title}`}
				onClick={onMinimise}>
				<Minus size={14} aria-hidden='true' />
			</button>

			<span
				className='win-max-wrap'
				onPointerEnter={armOpen}
				onPointerLeave={cancelOpen}
				onBlur={(e) => {
					/* Focus leaving the button and its flyout closes the flyout;
					   moving between them does not. */
					if (!e.currentTarget.contains(e.relatedTarget as Node)) setSnapOpen(false);
				}}>
				<button
					ref={maxBtn}
					type='button'
					className='win-cap-btn'
					aria-label={maximised ? `Restore ${title}` : `Maximise ${title}`}
					aria-expanded={snapOpen}
					aria-haspopup='true'
					aria-keyshortcuts='ArrowDown'
					onKeyDown={(e) => {
						if (e.key !== 'ArrowDown') return;
						e.preventDefault();
						setFromKeys(true);
						setSnapOpen(true);
					}}
					onClick={() => {
						cancelOpen();
						onToggleMax();
					}}>
					{maximised ? (
						<Copy size={12} aria-hidden='true' />
					) : (
						<Square size={11} aria-hidden='true' />
					)}
				</button>
				{snapOpen && (
					<SnapFlyout
						takeFocus={fromKeys}
						onSnap={onSnap}
						onDismiss={() => setSnapOpen(false)}
						onEscape={() => {
							setSnapOpen(false);
							maxBtn.current?.focus();
						}}
					/>
				)}
			</span>

			<button
				type='button'
				className='win-cap-btn win-close'
				aria-label={`Close ${title}`}
				onClick={onClose}>
				<X size={15} aria-hidden='true' />
			</button>
		</div>
	);
}
