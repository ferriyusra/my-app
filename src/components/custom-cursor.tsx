'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(pointer: fine)').matches) {
			setVisible(true);
		}
	}, []);

	useEffect(() => {
		if (!visible) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		const label = labelRef.current;
		if (!dot || !ring || !label) return;

		document.documentElement.classList.add('custom-cursor-active');

		// GSAP quickTo — GPU-accelerated, buttery smooth
		const dotX = gsap.quickTo(dot, 'x', {
			duration: 0.12,
			ease: 'power3',
		});
		const dotY = gsap.quickTo(dot, 'y', {
			duration: 0.12,
			ease: 'power3',
		});
		const ringX = gsap.quickTo(ring, 'x', {
			duration: 0.45,
			ease: 'power3',
		});
		const ringY = gsap.quickTo(ring, 'y', {
			duration: 0.45,
			ease: 'power3',
		});
		const labelX = gsap.quickTo(label, 'x', {
			duration: 0.4,
			ease: 'power3',
		});
		const labelY = gsap.quickTo(label, 'y', {
			duration: 0.4,
			ease: 'power3',
		});

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
			if (
				el.closest(
					'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]',
				)
			) {
				ring.classList.add('cursor-hover');
			}
		};

		const onMouseOut = (e: MouseEvent) => {
			const el = e.target as HTMLElement;
			if (el.closest('[data-cursor="view"]')) {
				ring.classList.remove('cursor-expanded');
				label.classList.remove('cursor-label-visible');
			}
			if (
				el.closest(
					'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]',
				)
			) {
				ring.classList.remove('cursor-hover');
			}
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
	}, [visible]);

	if (!visible) return null;

	return (
		<>
			<div
				ref={dotRef}
				style={{
					position: 'fixed',
					top: -4,
					left: -4,
					width: 8,
					height: 8,
					borderRadius: '50%',
					background: '#6366f1',
					pointerEvents: 'none',
					zIndex: 99999,
					willChange: 'transform',
				}}
			/>
			<div
				ref={ringRef}
				className='cursor-ring'
				style={{
					position: 'fixed',
					top: -20,
					left: -20,
					width: 40,
					height: 40,
					borderRadius: '50%',
					border: '2px solid #6366f1',
					pointerEvents: 'none',
					zIndex: 99998,
					willChange: 'transform',
					transition:
						'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease',
				}}
			/>
			{/* "View" label */}
			<div
				ref={labelRef}
				className='cursor-label'
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
						fontSize: 11,
						fontWeight: 700,
						fontFamily: "'JetBrains Mono', monospace",
						color: '#ffffff',
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
