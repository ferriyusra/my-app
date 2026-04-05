'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function SmoothScrollWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		ScrollSmoother.create({
			wrapper: wrapperRef.current!,
			content: contentRef.current!,
			smooth: 1.2,
			effects: true,
			smoothTouch: false,
		});
	});

	return (
		<div ref={wrapperRef} id='smooth-wrapper'>
			<div ref={contentRef} id='smooth-content'>
				{children}
			</div>
		</div>
	);
}
