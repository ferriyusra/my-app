'use client';

import { motion, useReducedMotion } from 'framer-motion';

const WAVES = [
	'M0,40 C320,70 640,10 960,40 C1120,55 1280,30 1440,45 L1440,80 L0,80 Z',
	'M0,55 C180,20 360,70 600,30 C840,-5 1080,65 1440,35 L1440,80 L0,80 Z',
	'M0,20 C360,70 720,5 1080,50 C1260,65 1380,35 1440,45 L1440,80 L0,80 Z',
];

interface WaveDividerProps {
	type: 'hero-to-a' | 'a-to-b' | 'b-to-a' | 'a-to-footer';
	variant?: number;
	flip?: boolean;
}

export default function WaveDivider({
	type,
	variant = 0,
	flip = false,
}: WaveDividerProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			className={`wave-divider wave-${type}`}
			aria-hidden='true'
			initial={shouldReduceMotion ? false : { scaleY: 0, opacity: 0 }}
			whileInView={{ scaleY: 1, opacity: 1 }}
			viewport={{ once: true, margin: '-10px' }}
			transition={{
				duration: shouldReduceMotion ? 0 : 0.8,
				ease: [0.25, 0.1, 0.25, 1],
			}}
			style={{
				lineHeight: 0,
				overflow: 'hidden',
				marginTop: -1,
				marginBottom: -1,
				transformOrigin: flip ? 'bottom' : 'top',
			}}>
			<svg
				viewBox='0 0 1440 80'
				preserveAspectRatio='none'
				style={{
					width: '100%',
					height: 'clamp(30px, 5vw, 60px)',
					display: 'block',
					transform: flip ? 'scaleY(-1)' : undefined,
				}}>
				<path d={WAVES[variant % WAVES.length]} />
			</svg>
		</motion.div>
	);
}
