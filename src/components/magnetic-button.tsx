'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps {
	children: ReactNode;
	strength?: number;
	className?: string;
	style?: React.CSSProperties;
}

export default function MagneticButton({
	children,
	strength = 0.35,
	className,
	style,
}: MagneticButtonProps) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			if (window.matchMedia('(pointer: coarse)').matches) return;

			const xTo = gsap.quickTo(el, 'x', {
				duration: 0.8,
				ease: 'elastic.out(1, 0.3)',
			});
			const yTo = gsap.quickTo(el, 'y', {
				duration: 0.8,
				ease: 'elastic.out(1, 0.3)',
			});

			const handleMove = (e: MouseEvent) => {
				const { left, top, width, height } = el.getBoundingClientRect();
				const x = (e.clientX - (left + width / 2)) * strength;
				const y = (e.clientY - (top + height / 2)) * strength;
				xTo(x);
				yTo(y);
			};

			const handleLeave = () => {
				xTo(0);
				yTo(0);
			};

			el.addEventListener('mousemove', handleMove);
			el.addEventListener('mouseleave', handleLeave);

			return () => {
				el.removeEventListener('mousemove', handleMove);
				el.removeEventListener('mouseleave', handleLeave);
			};
		},
		{ scope: ref },
	);

	return (
		<div
			ref={ref}
			className={className}
			style={{ display: 'inline-block', ...style }}>
			{children}
		</div>
	);
}
