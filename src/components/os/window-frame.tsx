'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { useWindows, type AppId } from './window-store';

const TASKBAR = 56;

type Props = {
	id: AppId;
	title: string;
	icon: React.ReactNode;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	maximised: boolean;
	focused: boolean;
	children: React.ReactNode;
};

/**
 * A Windows 11 app window: title bar, caption buttons, pointer drag, and a
 * resize grip. Dragging uses pointer capture so the window keeps tracking
 * even when the cursor outruns it.
 */
export default function WindowFrame({
	id,
	title,
	icon,
	x,
	y,
	w,
	h,
	z,
	maximised,
	focused,
	children,
}: Props) {
	const { close, focus, minimise, toggleMax, move, resize } = useWindows();
	const dragRef = useRef<{ dx: number; dy: number } | null>(null);
	const sizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const titleId = `win-${id}-title`;

	const bounds = useCallback(
		() => ({ w: window.innerWidth, h: window.innerHeight - TASKBAR }),
		[],
	);

	/* ── Drag ── */
	const onTitlePointerDown = (e: React.PointerEvent) => {
		if (maximised) return;
		if ((e.target as HTMLElement).closest('button')) return;
		focus(id);
		dragRef.current = { dx: e.clientX - x, dy: e.clientY - y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onTitlePointerMove = (e: React.PointerEvent) => {
		const d = dragRef.current;
		if (!d) return;
		const b = bounds();
		move(
			id,
			Math.min(Math.max(e.clientX - d.dx, -w + 120), b.w - 120),
			Math.min(Math.max(e.clientY - d.dy, 0), b.h - 40),
		);
	};

	const endDrag = (e: React.PointerEvent) => {
		dragRef.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	};

	/* ── Resize ── */
	const onGripPointerDown = (e: React.PointerEvent) => {
		e.stopPropagation();
		focus(id);
		sizeRef.current = { x: e.clientX, y: e.clientY, w, h };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onGripPointerMove = (e: React.PointerEvent) => {
		const s = sizeRef.current;
		if (!s) return;
		resize(
			id,
			Math.max(420, s.w + (e.clientX - s.x)),
			Math.max(280, s.h + (e.clientY - s.y)),
		);
	};

	const endResize = (e: React.PointerEvent) => {
		sizeRef.current = null;
		(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
	};

	/* Escape closes the focused window — the keyboard route out. */
	useEffect(() => {
		if (!focused) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close(id);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [focused, close, id]);

	/* Move focus into the window when it opens or is raised. */
	useEffect(() => {
		if (focused) frameRef.current?.focus({ preventScroll: true });
	}, [focused]);

	return (
		<div
			ref={frameRef}
			className='win'
			role='dialog'
			aria-labelledby={titleId}
			tabIndex={-1}
			data-focused={focused}
			data-maximised={maximised}
			style={{
				left: x,
				top: y,
				width: maximised ? '100%' : w,
				height: maximised ? `calc(100% - ${TASKBAR}px)` : h,
				zIndex: z,
			}}
			onPointerDownCapture={() => focus(id)}>
			<div
				className='win-title'
				onPointerDown={onTitlePointerDown}
				onPointerMove={onTitlePointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onDoubleClick={() => toggleMax(id, bounds())}>
				<span className='win-title-icon' aria-hidden='true'>
					{icon}
				</span>
				<span className='win-title-text' id={titleId}>
					{title}
				</span>

				<div className='win-caption'>
					<button
						type='button'
						aria-label={`Minimise ${title}`}
						onClick={() => minimise(id)}>
						<Minus size={14} aria-hidden='true' />
					</button>
					<button
						type='button'
						aria-label={maximised ? `Restore ${title}` : `Maximise ${title}`}
						onClick={() => toggleMax(id, bounds())}>
						{maximised ? (
							<Copy size={12} aria-hidden='true' />
						) : (
							<Square size={11} aria-hidden='true' />
						)}
					</button>
					<button
						type='button'
						className='win-close'
						aria-label={`Close ${title}`}
						onClick={() => close(id)}>
						<X size={15} aria-hidden='true' />
					</button>
				</div>
			</div>

			<div className='win-body'>{children}</div>

			{!maximised && (
				<span
					className='win-grip'
					aria-hidden='true'
					onPointerDown={onGripPointerDown}
					onPointerMove={onGripPointerMove}
					onPointerUp={endResize}
					onPointerCancel={endResize}
				/>
			)}
		</div>
	);
}
