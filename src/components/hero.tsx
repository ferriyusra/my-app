'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import MagneticButton from '@/components/magnetic-button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { profile } from '@/data/profile';
import { BORDER, EASE, FONT, MONO, RADIUS, SANS } from '@/lib/theme';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const greetings = [
	{ lang: 'English', text: "Hi, I'm Ferri", dir: 'ltr' as const },
	{ lang: 'Indonesian', text: 'Halo, Saya Ferri', dir: 'ltr' as const },
	{ lang: 'Japanese', text: 'こんにちは、フェリです', dir: 'ltr' as const },
	{ lang: 'Arabic', text: 'مرحبا، أنا فيري', dir: 'rtl' as const },
	{ lang: 'German', text: 'Hallo, ich bin Ferri', dir: 'ltr' as const },
];

const GEO_SIZES = [180, 300, 420, 540];
const CYCLE_DELAY = 3400;

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
	transition: 'box-shadow 0.2s ease',
};

export default function Hero() {
	const [index, setIndex] = useState(0);
	const shouldReduceMotion = useReducedMotion();
	const textRef = useRef<HTMLSpanElement>(null);
	const heroRef = useRef<HTMLElement>(null);
	const scrambleTweenRef = useRef<gsap.core.Tween | null>(null);

	// Auto-cycle greetings
	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((i) => (i + 1) % greetings.length);
		}, CYCLE_DELAY);
		return () => clearInterval(timer);
	}, []);

	// GSAP ScrambleText
	useEffect(() => {
		const el = textRef.current;
		if (!el) return;

		if (shouldReduceMotion) {
			el.textContent = greetings[index].text;
			return;
		}

		scrambleTweenRef.current?.kill();
		scrambleTweenRef.current = gsap.to(el, {
			duration: 1.2,
			scrambleText: {
				text: greetings[index].text,
				chars: '!<>-_\\/[]{}—=+*^?#01',
				speed: 0.5,
			},
		});
	}, [index, shouldReduceMotion]);

	// GSAP: ring rotation + scroll parallax
	useGSAP(
		() => {
			if (shouldReduceMotion === null || shouldReduceMotion) return;

			GEO_SIZES.forEach((_, i) => {
				const el = `.hero-ring-${i}`;

				gsap.to(el, {
					rotation: i % 2 === 0 ? 360 : -360,
					duration: 18 + i * 6,
					repeat: -1,
					ease: 'none',
				});

				gsap.to(el, {
					y: -(60 + i * 50),
					ease: 'none',
					scrollTrigger: {
						trigger: heroRef.current,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				});
			});
		},
		{ scope: heroRef, dependencies: [shouldReduceMotion] },
	);

	const current = greetings[index];

	return (
		<section
			id='hero'
			ref={heroRef}
			style={{
				/* svh tracks the visible viewport, so mobile browser chrome
				   no longer pushes the CTAs below the fold. */
				minHeight: '100svh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				background: 'var(--hero-bg)',
				paddingTop: 80,
			}}>
			{/* ── Geometric rings — GSAP rotation + parallax ── */}
			{GEO_SIZES.map((size, i) => (
				<div
					key={size}
					className={`hero-ring-${i}`}
					aria-hidden='true'
					style={{
						position: 'absolute',
						width: size,
						height: size,
						border: `${BORDER.soft} solid color-mix(in srgb, var(--ink) ${12 - i * 2}%, transparent)`,
						borderRadius: 28,
						pointerEvents: 'none',
						willChange: 'transform',
					}}
				/>
			))}

			{/* Radial ambient glow */}
			<div
				aria-hidden='true'
				style={{
					position: 'absolute',
					width: 700,
					height: 700,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
					pointerEvents: 'none',
				}}
			/>

			{/* ── Content ── */}
			<div
				style={{
					textAlign: 'center',
					position: 'relative',
					zIndex: 1,
					padding: '0 20px',
					maxWidth: 760,
					width: '100%',
				}}>
				{/* Availability badge — single source of truth in profile.ts */}
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: EASE, delay: 0 }}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8,
						padding: '7px 16px',
						background: 'var(--surface)',
						border: `${BORDER.soft} solid var(--line)`,
						borderRadius: RADIUS.full,
						boxShadow: 'var(--sh-1-hi)',
						marginBottom: 32,
						cursor: 'default',
					}}>
					<span
						style={{
							position: 'relative',
							display: 'inline-flex',
							width: 8,
							height: 8,
						}}>
						<motion.span
							animate={
								shouldReduceMotion ? {} : { scale: [1, 2], opacity: [0.6, 0] }
							}
							transition={{
								duration: 1.4,
								repeat: Infinity,
								ease: 'easeOut',
							}}
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: '50%',
								background: 'var(--success)',
							}}
						/>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: 'var(--success)',
								display: 'block',
							}}
						/>
					</span>
					<span
						style={{
							fontSize: FONT.micro,
							fontWeight: 700,
							color: 'var(--ink)',
							fontFamily: SANS,
							letterSpacing: '-0.01em',
						}}>
						{profile.availabilityShort}
					</span>
				</motion.div>

				{/* Greeting — GSAP ScrambleText */}
				<div
					style={{
						minHeight: 'clamp(56px, 12vw, 112px)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 20,
					}}>
					<h1
						dir={current.dir}
						style={{
							fontSize: 'clamp(36px, 8vw, 88px)',
							fontWeight: 800,
							fontFamily: SANS,
							letterSpacing: '-0.03em',
							lineHeight: 1.1,
							margin: 0,
							color: 'var(--ink)',
							wordBreak: 'keep-all',
							overflowWrap: 'break-word',
						}}>
						<span ref={textRef}>{greetings[0].text}</span>
						<span
							aria-hidden='true'
							className='cursor-blink'
							style={{
								display: 'inline-block',
								width: '0.08em',
								height: '0.85em',
								background: 'var(--accent)',
								borderRadius: 2,
								marginLeft: '0.06em',
								verticalAlign: 'middle',
							}}
						/>
					</h1>
				</div>

				{/* Language switcher.
				    Plain buttons, not tabs — there is no tabpanel to control.
				    Each has a 24px hit area (WCAG 2.5.8) with a smaller visual pill. */}
				<div
					role='group'
					aria-label='Greeting language'
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
						marginBottom: 36,
						flexWrap: 'nowrap',
					}}>
					{greetings.map((g, i) => {
						const isActive = i === index;
						return (
							<button
								key={g.lang}
								type='button'
								onClick={() => setIndex(i)}
								aria-label={`Show greeting in ${g.lang}`}
								aria-current={isActive ? 'true' : undefined}
								style={{
									width: 32,
									height: 32,
									minWidth: 32,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: 'transparent',
									border: 'none',
									borderRadius: RADIUS.sm,
									cursor: 'pointer',
									padding: 0,
									flexShrink: 0,
								}}>
								<span
									aria-hidden='true'
									style={{
										display: 'block',
										width: isActive ? 22 : 6,
										height: 6,
										borderRadius: 3,
										background: isActive ? 'var(--accent)' : 'var(--line-soft)',
										transition: shouldReduceMotion
											? 'none'
											: 'width 0.3s ease, background 0.3s ease',
									}}
								/>
							</button>
						);
					})}
				</div>

				{/* Role */}
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
					style={{
						fontSize: 'clamp(18px, 3vw, 24px)',
						fontWeight: 700,
						color: 'var(--ink)',
						fontFamily: SANS,
						marginBottom: 16,
						letterSpacing: '-0.02em',
					}}>
					{profile.role} — {profile.roleDetail}
				</motion.p>

				{/* Tagline */}
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
					style={{
						fontSize: FONT.base,
						color: 'var(--ink-secondary)',
						lineHeight: 1.75,
						maxWidth: 520,
						margin: '0 auto 44px',
						fontFamily: SANS,
					}}>
					{profile.tagline}
				</motion.p>

				{/* CTA buttons */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
					style={{
						display: 'flex',
						gap: 12,
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}>
					<MagneticButton strength={0.3}>
						<a
							href={profile.cvDownload}
							download
							style={{
								...CTA_BASE,
								background: 'var(--accent)',
								color: 'var(--accent-ink)',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.boxShadow = 'var(--sh-2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
							}}>
							<Download size={16} aria-hidden='true' />
							Download CV
						</a>
					</MagneticButton>

					<MagneticButton strength={0.3}>
						<a
							href='#contact'
							style={{
								...CTA_BASE,
								background: 'var(--surface)',
								color: 'var(--ink)',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.boxShadow = 'var(--sh-2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
							}}>
							<ArrowRight size={16} aria-hidden='true' />
							Let&apos;s Build Together
						</a>
					</MagneticButton>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: shouldReduceMotion ? 0 : 1.1,
						duration: 0.6,
					}}
					style={{
						marginTop: 72,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 10,
					}}>
					<span
						style={{
							fontSize: FONT.micro,
							color: 'var(--ink-muted)',
							fontFamily: MONO,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
						}}>
						Scroll to explore
					</span>
					<div
						style={{
							width: 26,
							height: 42,
							border: `${BORDER.soft} solid var(--line)`,
							borderRadius: 13,
							display: 'flex',
							alignItems: 'flex-start',
							justifyContent: 'center',
							padding: 5,
							background: 'var(--surface)',
						}}>
						<motion.div
							animate={
								shouldReduceMotion ? {} : { y: [0, 14, 0], opacity: [1, 0.2, 1] }
							}
							transition={{
								duration: 1.6,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
							style={{
								width: 4,
								height: 8,
								borderRadius: 2,
								background: 'var(--accent)',
							}}
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
