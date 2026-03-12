'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const greetings = [
	{ lang: 'English', text: "Hi, I'm Ferri", dir: 'ltr' as const },
	{ lang: 'Indonesian', text: 'Halo, Saya Ferri', dir: 'ltr' as const },
	{ lang: 'Japanese', text: 'こんにちは、フェリです', dir: 'ltr' as const },
	{ lang: 'Arabic', text: 'مرحبا، أنا فيري', dir: 'rtl' as const },
	{ lang: 'German', text: 'Hallo, ich bin Ferri', dir: 'ltr' as const },
];

const GEO_SIZES = [180, 300, 420, 540];
const TYPING_SPEED = 55; // ms per character
const CYCLE_DELAY = 3400; // ms before switching language

export default function Hero() {
	const [index, setIndex] = useState(0);
	const [displayed, setDisplayed] = useState('');
	const [typing, setTyping] = useState(true);
	const shouldReduceMotion = useReducedMotion();

	// Auto-cycle
	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((i) => (i + 1) % greetings.length);
		}, CYCLE_DELAY);
		return () => clearInterval(timer);
	}, []);

	// Typing effect — reruns whenever index changes
	useEffect(() => {
		const text = greetings[index].text;

		if (shouldReduceMotion) {
			setDisplayed(text);
			setTyping(false);
			return;
		}

		setDisplayed('');
		setTyping(true);
		let i = 0;
		const timer = setInterval(() => {
			i++;
			setDisplayed(text.slice(0, i));
			if (i >= text.length) {
				clearInterval(timer);
				setTyping(false);
			}
		}, TYPING_SPEED);
		return () => clearInterval(timer);
	}, [index, shouldReduceMotion]);

	const current = greetings[index];

	return (
		<section
			id='hero'
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				background: '#09090b',
				paddingTop: 80,
			}}>
			{/* ── Geometric rotating rings ─────────────────────── */}
			{GEO_SIZES.map((size, i) => (
				<motion.div
					key={size}
					aria-hidden='true'
					animate={
						shouldReduceMotion ? {} : { rotate: i % 2 === 0 ? 360 : -360 }
					}
					transition={{
						duration: 18 + i * 6,
						repeat: Infinity,
						ease: 'linear',
					}}
					style={{
						position: 'absolute',
						width: size,
						height: size,
						border: `1px solid rgba(99,102,241,${0.15 - i * 0.028})`,
						borderRadius: 28,
						rotate: 45,
						pointerEvents: 'none',
					}}
				/>
			))}

			{/* Radial purple ambient glow */}
			<div
				aria-hidden='true'
				style={{
					position: 'absolute',
					width: 700,
					height: 700,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
					pointerEvents: 'none',
				}}
			/>

			{/* ── Content ──────────────────────────────────────── */}
			<div
				style={{
					textAlign: 'center',
					position: 'relative',
					zIndex: 1,
					padding: '0 20px',
					maxWidth: 760,
					width: '100%',
				}}>
				{/* Typing greeting */}
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
							fontFamily: "'Inter', sans-serif",
							letterSpacing: '-0.03em',
							lineHeight: 1.1,
							margin: 0,
							color: '#a5b4fc',
							wordBreak: 'keep-all',
							overflowWrap: 'break-word',
						}}>
						{displayed}
						{/* Blinking cursor */}
						<span
							aria-hidden='true'
							className={typing ? 'cursor-blink' : 'cursor-hidden'}
							style={{
								display: 'inline-block',
								width: '0.08em',
								height: '0.85em',
								background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
								borderRadius: 2,
								marginLeft: '0.06em',
								verticalAlign: 'middle',
							}}
						/>
					</h1>
				</div>

				{/* Language indicator dots */}
				<div
					role='tablist'
					aria-label='Language selector'
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 6,
						marginBottom: 44,
						flexWrap: 'nowrap',
					}}>
					{greetings.map((g, i) => (
						<button
							key={g.lang}
							role='tab'
							aria-selected={i === index}
							aria-label={`Switch to ${g.lang}`}
							onClick={() => setIndex(i)}
							style={{
								width: i === index ? 22 : 6,
								height: 6,
								minWidth: i === index ? 22 : 6,
								borderRadius: 3,
								background: i === index ? '#6366f1' : 'rgba(255,255,255,0.12)',
								border: 'none',
								cursor: 'pointer',
								padding: 0,
								flexShrink: 0,
								transition:
									'width 0.3s ease, min-width 0.3s ease, background 0.3s ease',
							}}
						/>
					))}
				</div>

				{/* Role */}
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
					style={{
						fontSize: 'clamp(18px, 3vw, 24px)',
						fontWeight: 700,
						color: '#fafafa',
						fontFamily: "'Inter', sans-serif",
						marginBottom: 16,
						letterSpacing: '-0.02em',
					}}>
					Backend With Former Learning Full Stack Engineer
				</motion.p>

				{/* Tagline */}
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
					style={{
						fontSize: 16,
						color: '#a1a1aa',
						lineHeight: 1.75,
						maxWidth: 500,
						margin: '0 auto 44px',
						fontFamily: "'Inter', sans-serif",
					}}>
					Building production-grade web applications with React, Node.js, and
					Golang. Fast, clean, and people love to use.
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
					<a
						href='/resume.pdf'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '13px 28px',
							background: '#6366f1',
							borderRadius: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 700,
							textDecoration: 'none',
							fontFamily: "'Inter', sans-serif",
							transition: 'background 0.2s ease, transform 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = '#4f46e5';
							if (!shouldReduceMotion)
								e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = '#6366f1';
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						<Download size={16} aria-hidden='true' />
						Download CV
					</a>

					<a
						href='#contact'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '13px 28px',
							background: 'transparent',
							border: '1.5px solid rgba(255,255,255,0.15)',
							borderRadius: 12,
							color: '#fafafa',
							fontSize: 15,
							fontWeight: 700,
							textDecoration: 'none',
							fontFamily: "'Inter', sans-serif",
							transition: 'border-color 0.2s ease, transform 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
							if (!shouldReduceMotion)
								e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						<ArrowRight size={16} aria-hidden='true' />
						Let&apos;s Build Together
					</a>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: shouldReduceMotion ? 0 : 1.1, duration: 0.6 }}
					style={{
						marginTop: 72,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 10,
					}}>
					<span
						style={{
							fontSize: 11,
							color: '#52525b',
							fontFamily: "'JetBrains Mono', monospace",
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
						}}>
						Scroll to explore
					</span>

					{/* Mouse scroll widget */}
					<div
						style={{
							width: 26,
							height: 42,
							border: '1.5px solid rgba(255,255,255,0.10)',
							borderRadius: 13,
							display: 'flex',
							alignItems: 'flex-start',
							justifyContent: 'center',
							padding: 5,
						}}>
						<motion.div
							animate={
								shouldReduceMotion
									? {}
									: { y: [0, 14, 0], opacity: [1, 0.2, 1] }
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
								background: '#6366f1',
							}}
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
