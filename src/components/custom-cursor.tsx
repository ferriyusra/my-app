'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { FONT, MONO } from '@/lib/theme';

/* The custom cursor hides the OS pointer, which is a real accessibility cost.
   It is therefore limited to fine pointers where the user has *not* asked for
   reduced motion — the same condition guards `cursor: none` in globals.css. */
const QUERY = '(pointer: fine) and (prefers-reduced-motion: no-preference)';

function subscribe(onChange: () => void) {
	const mq = window.matchMedia(QUERY);
	mq.addEventListener('change', onChange);
	return () => mq.removeEventListener('change', onChange);
}

const INTERACTIVE =
	'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';

export default function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	const enabled = useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false,
	);

	useEffect(() => {
		if (!enabled) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		const label = labelRef.current;
		if (!dot || !ring || !label) return;

		document.documentElement.classList.add('custom-cursor-active');

		// GSAP quickTo — GPU-accelerated, buttery smooth
		const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
		const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
		const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
		const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
		const labelX = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3' });
		const labelY = gsap.quickTo(label, 'y', { duration: 0.4, ease: 'power3' });

		const onMouseMove = (e: MouseEvent) => {
			dotX(e.clientX);
			dotY(e.clientY);
			ringX(e.clientX);
			ringY(e.clientY);
			labelX(e.clientX);
			labelY(e.clientY);
		};

		const onMouseOver = (e: MouseEvent) => {
			const el = e.target as HTMLElement;
			if (el.closest('[data-cursor="view"]')) {
				ring.classList.add('cursor-expanded');
				label.classList.add('cursor-label-visible');
				return;
			}
			if (el.closest(INTERACTIVE)) ring.classList.add('cursor-hover');
		};

		const onMouseOut = (e: MouseEvent) => {
			const el = e.target as HTMLElement;
			if (el.closest('[data-cursor="view"]')) {
				ring.classList.remove('cursor-expanded');
				label.classList.remove('cursor-label-visible');
			}
			if (el.closest(INTERACTIVE)) ring.classList.remove('cursor-hover');
		};

		const onMouseDown = () => ring.classList.add('cursor-click');
		const onMouseUp = () => ring.classList.remove('cursor-click');

		window.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseover', onMouseOver);
		document.addEventListener('mouseout', onMouseOut);
		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseover', onMouseOver);
			document.removeEventListener('mouseout', onMouseOut);
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mouseup', onMouseUp);
			gsap.killTweensOf([dot, ring, label]);
			document.documentElement.classList.remove('custom-cursor-active');
		};
	}, [enabled]);

	if (!enabled) return null;

	return (
		<>
			<div
				ref={dotRef}
				aria-hidden='true'
				style={{
					position: 'fixed',
					top: -4,
					left: -4,
					width: 8,
					height: 8,
					borderRadius: '50%',
					background: 'var(--accent)',
					pointerEvents: 'none',
					zIndex: 99999,
					willChange: 'transform',
				}}
			/>
			<div
				ref={ringRef}
				className='cursor-ring'
				aria-hidden='true'
				style={{
					position: 'fixed',
					top: -20,
					left: -20,
					width: 40,
					height: 40,
					borderRadius: '50%',
					border: '2px solid var(--accent)',
					pointerEvents: 'none',
					zIndex: 99998,
					willChange: 'transform',
					transition:
						'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease',
				}}
			/>
			<div
				ref={labelRef}
				className='cursor-label'
				aria-hidden='true'
				style={{
					position: 'fixed',
					top: -10,
					left: -10,
					pointerEvents: 'none',
					zIndex: 99997,
					opacity: 0,
					willChange: 'transform',
					transition: 'opacity 0.3s ease',
				}}>
				<span
					style={{
						display: 'block',
						fontSize: FONT.micro,
						fontWeight: 700,
						fontFamily: MONO,
						color: 'var(--on-dark)',
						letterSpacing: '0.1em',
						textTransform: 'uppercase',
						whiteSpace: 'nowrap',
						textAlign: 'center',
					}}>
					View
				</span>
			</div>
		</>
	);
}
