'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const MAX_TILT = 6;

export default function TiltEffect() {
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (shouldReduceMotion) return;

		let lastCard: HTMLElement | null = null;
		let isScrolling = false;
		let scrollTimer: number | null = null;

		const resetLast = () => {
			if (lastCard) {
				lastCard.style.setProperty('--tilt-x', '0deg');
				lastCard.style.setProperty('--tilt-y', '0deg');
				lastCard.classList.remove('is-tilting');
			}
		};

		const onScroll = () => {
			if (!isScrolling) {
				isScrolling = true;
				resetLast();
			}
			if (scrollTimer) window.clearTimeout(scrollTimer);
			scrollTimer = window.setTimeout(() => {
				isScrolling = false;
			}, 120);
		};

		const onMove = (e: MouseEvent) => {
			if (isScrolling) return;

			const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null;

			if (lastCard && lastCard !== card) {
				lastCard.style.setProperty('--tilt-x', '0deg');
				lastCard.style.setProperty('--tilt-y', '0deg');
				lastCard.classList.remove('is-tilting');
			}

			lastCard = card;
			if (!card) return;

			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;
			card.classList.add('is-tilting');
			card.style.setProperty('--tilt-x', `${(0.5 - y) * MAX_TILT * 2}deg`);
			card.style.setProperty('--tilt-y', `${(x - 0.5) * MAX_TILT * 2}deg`);
		};

		document.addEventListener('mousemove', onMove, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			document.removeEventListener('mousemove', onMove);
			window.removeEventListener('scroll', onScroll);
			if (scrollTimer) window.clearTimeout(scrollTimer);
			resetLast();
		};
	}, [shouldReduceMotion]);

	return null;
}
