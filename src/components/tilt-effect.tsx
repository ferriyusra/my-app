'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const MAX_TILT = 6;

export default function TiltEffect() {
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (shouldReduceMotion) return;

		let lastCard: HTMLElement | null = null;

		const onMove = (e: MouseEvent) => {
			const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null;

			if (lastCard && lastCard !== card) {
				lastCard.style.setProperty('--tilt-x', '0deg');
				lastCard.style.setProperty('--tilt-y', '0deg');
			}

			lastCard = card;
			if (!card) return;

			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;
			card.style.setProperty('--tilt-x', `${(0.5 - y) * MAX_TILT * 2}deg`);
			card.style.setProperty('--tilt-y', `${(x - 0.5) * MAX_TILT * 2}deg`);
		};

		document.addEventListener('mousemove', onMove, { passive: true });

		return () => {
			document.removeEventListener('mousemove', onMove);
			if (lastCard) {
				lastCard.style.setProperty('--tilt-x', '0deg');
				lastCard.style.setProperty('--tilt-y', '0deg');
			}
		};
	}, [shouldReduceMotion]);

	return null;
}
