'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		const bar = barRef.current;
		if (!bar) return;

		ScrollTrigger.create({
			start: 'top top',
			end: 'max',
			onUpdate: (self) => {
				gsap.set(bar, { scaleX: self.progress });
			},
		});
	});

	return (
		<div
			ref={barRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: 3,
				background: '#6366f1',
				transformOrigin: '0%',
				transform: 'scaleX(0)',
				zIndex: 100,
				pointerEvents: 'none',
			}}
		/>
	);
}
