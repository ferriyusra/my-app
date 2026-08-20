'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/theme';

interface TextPart {
	text: string;
	color?: string;
}

interface TextRevealProps {
	parts: TextPart[];
	as?: 'h1' | 'h2' | 'h3' | 'p';
	style?: React.CSSProperties;
	className?: string;
	id?: string;
}

/**
 * Section heading with a restrained entrance.
 *
 * This used to split every heading into per-character spans and tween each one
 * on a 3D `rotateX` — expensive, and it fought the content for attention. The
 * whole heading now moves as one, which is the point of a heading.
 */
export default function TextReveal({
	parts,
	as: Tag = 'h2',
	style,
	className,
	id,
}: TextRevealProps) {
	const shouldReduceMotion = useReducedMotion();
	const MotionTag = motion[Tag];

	return (
		<MotionTag
			id={id}
			className={className}
			initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: EASE }}
			style={style}>
			{parts.map((part, i) => (
				<span key={i} style={{ color: part.color }}>
					{part.text}
				</span>
			))}
		</MotionTag>
	);
}
