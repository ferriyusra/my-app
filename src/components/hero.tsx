'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { profile } from '@/data/profile';
import { BORDER, CONTAINER, EASE, FONT, MONO, RADIUS, SANS } from '@/lib/theme';

const CTA_BASE: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 8,
	padding: '14px 28px',
	border: `${BORDER.hard} solid var(--line)`,
	borderRadius: RADIUS.md,
	fontSize: FONT.base,
	fontWeight: 700,
	textDecoration: 'none',
	fontFamily: SANS,
	boxShadow: 'var(--sh-1-hi)',
	transition: 'box-shadow 0.2s ease, transform 0.2s ease',
};

function lift(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translate(-1px, -1px)';
	e.currentTarget.style.boxShadow = 'var(--sh-2)';
}
function drop(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translate(0, 0)';
	e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
}

export default function Hero() {
	const shouldReduceMotion = useReducedMotion();

	/* One entrance, staggered by index. The hero previously ran a scramble
	   tween, a five-language carousel, four rotating rings and a parallax
	   scrub — all competing for attention with the actual message. */
	const step = (i: number) => ({
		initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
		animate: { opacity: 1, y: 0 },
		transition: {
			duration: shouldReduceMotion ? 0 : 0.5,
			ease: EASE,
			delay: shouldReduceMotion ? 0 : i * 0.08,
		},
	});

	return (
		<section
			id='hero'
			style={{
				minHeight: '100svh',
				display: 'flex',
				alignItems: 'center',
				position: 'relative',
				overflow: 'hidden',
				background: 'var(--hero-bg)',
				paddingTop: 120,
				paddingBottom: 80,
			}}>
			<div style={{ ...CONTAINER, width: '100%' }}>
				<div style={{ maxWidth: 780 }}>
					{/* Eyebrow */}
					<motion.div
						{...step(0)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							flexWrap: 'wrap',
							marginBottom: 24,
						}}>
						<span
							style={{
								fontFamily: MONO,
								fontSize: FONT.micro,
								fontWeight: 600,
								letterSpacing: '0.18em',
								textTransform: 'uppercase',
								color: 'var(--ink-muted)',
							}}>
							{profile.name} — {profile.location}
						</span>
						<span
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 7,
								padding: '5px 12px',
								background: 'var(--accent-soft)',
								border: `1px solid var(--accent-ring)`,
								borderRadius: RADIUS.full,
								fontFamily: MONO,
								fontSize: FONT.micro,
								fontWeight: 600,
								color: 'var(--accent)',
							}}>
							<span
								aria-hidden='true'
								style={{
									width: 6,
									height: 6,
									borderRadius: '50%',
									background: 'var(--accent)',
								}}
							/>
							{profile.availability}
						</span>
					</motion.div>

					{/* The statement carries the page — left-aligned, not centred. */}
					<motion.h1
						{...step(1)}
						style={{
							fontSize: 'clamp(34px, 6vw, 62px)',
							fontWeight: 800,
							fontFamily: SANS,
							letterSpacing: '-0.035em',
							lineHeight: 1.08,
							margin: '0 0 24px',
							color: 'var(--ink)',
							/* Caps line length so the statement breaks well at any size */
							maxWidth: '20ch',
						}}>
						{profile.headline}
					</motion.h1>

					<motion.p
						{...step(2)}
						style={{
							fontSize: 'clamp(16px, 1.6vw, 19px)',
							color: 'var(--ink-secondary)',
							lineHeight: 1.7,
							maxWidth: '62ch',
							margin: '0 0 40px',
							fontFamily: SANS,
						}}>
						{profile.proof}
					</motion.p>

					{/* CTAs */}
					<motion.div
						{...step(3)}
						style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						<a
							href='#contact'
							style={{
								...CTA_BASE,
								background: 'var(--accent)',
								color: 'var(--accent-ink)',
							}}
							onMouseEnter={lift}
							onMouseLeave={drop}>
							Get in touch
							<ArrowRight size={16} aria-hidden='true' />
						</a>

						<a
							href={profile.cvDownload}
							download
							style={{
								...CTA_BASE,
								background: 'var(--surface)',
								color: 'var(--ink)',
							}}
							onMouseEnter={lift}
							onMouseLeave={drop}>
							<Download size={16} aria-hidden='true' />
							Download CV
						</a>
					</motion.div>

					{/* Primary stack, stated plainly rather than as a "Tech Stack" card */}
					<motion.p
						{...step(4)}
						style={{
							marginTop: 40,
							fontFamily: MONO,
							fontSize: FONT.sm,
							color: 'var(--ink-muted)',
							letterSpacing: '0.02em',
						}}>
						Go · Node.js · PostgreSQL · Google Cloud
					</motion.p>
				</div>
			</div>
		</section>
	);
}
