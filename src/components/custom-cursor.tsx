'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function CustomCursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);
	const pos = useRef({ x: -100, y: -100 });
	const target = useRef({ x: -100, y: -100 });
	const raf = useRef<number>(0);
	const [visible, setVisible] = useState(false);

	const lerp = (a: number, b: number, n: number) => a + (a - b) * -n;

	const animate = useCallback(() => {
		pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
		pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

		if (dotRef.current) {
			dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
		}
		if (ringRef.current) {
			ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
		}
		if (labelRef.current) {
			labelRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
		}

		raf.current = requestAnimationFrame(animate);
	}, []);

	useEffect(() => {
		// Only show on devices with a fine pointer (no touch)
		const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
		if (!hasFinePointer) return;

		setVisible(true);
		document.documentElement.classList.add('custom-cursor-active');

		const onMouseMove = (e: MouseEvent) => {
			target.current = { x: e.clientX, y: e.clientY };
		};

		const onMouseOver = (e: MouseEvent) => {
			const el = e.target as HTMLElement;

			// Check for project card
			const projectCard = el.closest('[data-cursor="view"]');
			if (projectCard) {
				ringRef.current?.classList.add('cursor-expanded');
				labelRef.current?.classList.add('cursor-label-visible');
				return;
			}

			// Check for interactive elements
			const interactive = el.closest('a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]');
			if (interactive) {
				ringRef.current?.classList.add('cursor-hover');
				return;
			}
		};

		const onMouseOut = (e: MouseEvent) => {
			const el = e.target as HTMLElement;
			const projectCard = el.closest('[data-cursor="view"]');
			const interactive = el.closest('a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]');

			if (projectCard) {
				ringRef.current?.classList.remove('cursor-expanded');
				labelRef.current?.classList.remove('cursor-label-visible');
			}
			if (interactive) {
				ringRef.current?.classList.remove('cursor-hover');
			}
		};

		const onMouseDown = () => {
			ringRef.current?.classList.add('cursor-click');
		};
		const onMouseUp = () => {
			ringRef.current?.classList.remove('cursor-click');
		};

		window.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseover', onMouseOver);
		document.addEventListener('mouseout', onMouseOut);
		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);

		raf.current = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseover', onMouseOver);
			document.removeEventListener('mouseout', onMouseOut);
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mouseup', onMouseUp);
			cancelAnimationFrame(raf.current);
			document.documentElement.classList.remove('custom-cursor-active');
		};
	}, [animate]);

	if (!visible) return null;

	return (
		<>
			{/* Inner dot */}
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
			{/* Outer ring */}
			<div
				ref={ringRef}
				className="cursor-ring"
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
					transition: 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease',
				}}
			/>
			{/* "View" label */}
			<div
				ref={labelRef}
				className="cursor-label"
				style={{
					position: 'fixed',
					top: -10,
					left: -10,
					pointerEvents: 'none',
					zIndex: 99997,
					opacity: 0,
					willChange: 'transform',
					transition: 'opacity 0.3s ease',
				}}
			>
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
					}}
				>
					View
				</span>
			</div>
		</>
	);
}
