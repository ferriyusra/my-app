'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function TextReveal({
	parts,
	as: Tag = 'h2',
	style,
	className,
	id,
}: TextRevealProps) {
	const ref = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;

			const chars = el.querySelectorAll('.tr-char');

			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				gsap.set(chars, { opacity: 1, y: 0, rotateX: 0 });
				return;
			}

			gsap.set(chars, { opacity: 0, y: 50, rotateX: -80 });

			gsap.to(chars, {
				opacity: 1,
				y: 0,
				rotateX: 0,
				duration: 0.7,
				stagger: 0.025,
				ease: 'back.out(2)',
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
			});
		},
		{ scope: ref },
	);

	return (
		<Tag
			ref={ref as React.Ref<HTMLHeadingElement> & React.Ref<HTMLParagraphElement>}
			className={className}
			id={id}
			style={{ ...style, perspective: 600, overflow: 'hidden' }}>
			{parts.map((part, pi) => {
				const words = part.text.split(' ');
				return words.map((word, wi) => (
					<span
						key={`${pi}-${wi}`}
						style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
						{word.split('').map((char, ci) => (
							<span
								key={ci}
								className='tr-char'
								style={{
									display: 'inline-block',
									color: part.color,
									willChange: 'transform, opacity',
									transformStyle: 'preserve-3d',
								}}>
								{char}
							</span>
						))}
						{(wi < words.length - 1 || pi < parts.length - 1) && (
							<span
								className='tr-char'
								style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
								&nbsp;
							</span>
						)}
					</span>
				));
			})}
		</Tag>
	);
}
