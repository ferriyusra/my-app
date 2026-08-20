'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
	MapPin,
	Clock,
	Briefcase,
	Download,
	Zap,
	Server,
	Building2,
	Activity,
} from 'lucide-react';
import TextReveal from '@/components/text-reveal';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '@/data/profile';
import {
	BORDER,
	CARD,
	CONTAINER,
	EASE,
	FONT,
	H2,
	MONO,
	RADIUS,
	SANS,
} from '@/lib/theme';

gsap.registerPlugin(ScrollTrigger);

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
	const wrapRef = useRef<HTMLSpanElement>(null);
	const numRef = useRef<HTMLSpanElement>(null);
	const shouldReduceMotion = useReducedMotion();

	useGSAP(
		() => {
			const numEl = numRef.current;
			if (!numEl) return;

			const obj = { val: 0 };
			gsap.to(obj, {
				val: to,
				duration: shouldReduceMotion ? 0 : 1.8,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: wrapRef.current,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
				onUpdate: () => {
					numEl.textContent = Math.round(obj.val).toString();
				},
			});
		},
		{ scope: wrapRef },
	);

	return (
		<span
			ref={wrapRef}
			style={{ display: 'inline', fontVariantNumeric: 'tabular-nums' }}>
			<span ref={numRef}>0</span>
			{suffix}
		</span>
	);
}

const stats = [
	{
		label: 'Years Experience',
		value: 4,
		suffix: '+',
		color: 'var(--success)',
		icon: Zap,
	},
	{
		label: 'APIs Built',
		value: 30,
		suffix: '+',
		color: 'var(--accent)',
		icon: Server,
	},
	{
		label: 'Industries',
		value: 3,
		suffix: '',
		color: 'var(--warn)',
		icon: Building2,
	},
	{
		label: 'Monthly API Reqs',
		value: 40,
		suffix: 'K+',
		color: 'var(--info)',
		icon: Activity,
	},
];

/* Availability is stated once, by the badge below — these are the facts
   the badge does not cover. */
const infoItems = [
	{ icon: MapPin, text: profile.locationDetail, label: 'Location' },
	{ icon: Clock, text: 'GMT+7 (WIB) — overlaps EU & APAC', label: 'Timezone' },
	{ icon: Briefcase, text: profile.workType, label: 'Work type' },
];

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 };

export default function About() {
	const shouldReduceMotion = useReducedMotion();

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	return (
		<section
			id='about'
			aria-labelledby='about-heading'
			style={{ background: 'var(--section-a)' }}>
			<div style={CONTAINER}>
				<TextReveal
					id='about-heading'
					parts={[{ text: 'Who I ' }, { text: 'Am', color: 'var(--accent)' }]}
					as='h2'
					style={{ ...H2, marginBottom: 64 }}
				/>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
						gap: 24,
						alignItems: 'start',
					}}>
					{/* ── Profile card ── */}
					<motion.div
						initial={{ opacity: 0, x: -24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.12)}
						className='card'
						style={CARD}>
						{/* Illustration header */}
						<div
							style={{
								background: 'var(--surface-header)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								minHeight: 140,
								gap: 20,
							}}>
							<motion.div
								whileHover={
									shouldReduceMotion ? {} : { scale: 1.06, rotate: 3 }
								}
								transition={SPRING}
								aria-hidden='true'
								style={{
									width: 72,
									height: 72,
									borderRadius: RADIUS.lg,
									flexShrink: 0,
									background: 'var(--accent)',
									border: `${BORDER.hard} solid var(--line)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: 'var(--sh-2)',
									position: 'relative',
									overflow: 'hidden',
								}}>
								{!shouldReduceMotion && (
									<motion.div
										animate={{ x: ['-100%', '220%'] }}
										transition={{
											duration: 3.5,
											repeat: Infinity,
											ease: 'easeInOut',
											repeatDelay: 2.5,
										}}
										style={{
											position: 'absolute',
											inset: 0,
											background:
												'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
											pointerEvents: 'none',
										}}
									/>
								)}
								<span
									style={{
										color: 'var(--accent-ink)',
										fontSize: FONT.xl,
										fontWeight: 800,
										fontFamily: SANS,
									}}>
									{profile.initials}
								</span>
							</motion.div>
							<div>
								<div
									style={{
										fontWeight: 800,
										fontSize: FONT.xl,
										color: 'var(--ink)',
										fontFamily: SANS,
										marginBottom: 4,
										letterSpacing: '-0.02em',
									}}>
									{profile.name}
								</div>
								<div
									style={{
										color: 'var(--accent)',
										fontSize: FONT.sm,
										fontFamily: MONO,
										fontWeight: 500,
									}}>
									{profile.role}
								</div>
							</div>
						</div>

						{/* Content */}
						<div style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
							<p
								style={{
									color: 'var(--ink-secondary)',
									lineHeight: 1.8,
									marginBottom: 12,
									fontFamily: SANS,
									fontSize: FONT.base,
								}}>
								{profile.bio} I specialize in{' '}
								<span style={{ color: 'var(--ink)', fontWeight: 600 }}>Go</span>{' '}
								and{' '}
								<span style={{ color: 'var(--ink)', fontWeight: 600 }}>
									Node.js
								</span>{' '}
								— from RESTful APIs to event-driven architectures.
							</p>
							<p
								style={{
									color: 'var(--ink-secondary)',
									lineHeight: 1.8,
									marginBottom: 24,
									fontFamily: SANS,
									fontSize: FONT.base,
								}}>
								I care deeply about clean architecture, system reliability, and
								writing code that teams can maintain and scale confidently.
							</p>

							<ul
								aria-label='Personal information'
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 8,
									marginBottom: 24,
									listStyle: 'none',
									padding: 0,
								}}>
								{infoItems.map(({ icon: Icon, text, label }, i) => (
									<motion.li
										key={label}
										initial={{ opacity: 0, x: -10 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={t(0.3, 0.32 + i * 0.05)}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 12,
											padding: '10px 14px',
											borderRadius: RADIUS.md,
											background: 'var(--surface-subtle)',
											border: `1px solid var(--line-subtle)`,
										}}>
										<div
											style={{
												width: 32,
												height: 32,
												borderRadius: RADIUS.sm,
												flexShrink: 0,
												background: 'var(--surface)',
												border: `${BORDER.soft} solid var(--line)`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												boxShadow: 'var(--sh-1)',
											}}>
											<Icon
												size={14}
												style={{ color: 'var(--accent)' }}
												aria-hidden='true'
											/>
										</div>
										<div>
											<div
												style={{
													fontSize: FONT.micro,
													color: 'var(--ink-muted)',
													fontFamily: MONO,
													textTransform: 'uppercase',
													letterSpacing: '0.12em',
													marginBottom: 1,
													fontWeight: 600,
												}}>
												{label}
											</div>
											<div
												style={{
													fontSize: FONT.sm,
													color: 'var(--ink)',
													fontFamily: SANS,
													fontWeight: 500,
												}}>
												{text}
											</div>
										</div>
									</motion.li>
								))}
							</ul>

							<div
								style={{
									display: 'flex',
									gap: 10,
									alignItems: 'center',
									flexWrap: 'wrap',
								}}>
								<div
									role='status'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 7,
										padding: '7px 14px',
										background: 'var(--accent-soft)',
										border: `1px solid var(--accent-ring)`,
										borderRadius: RADIUS.full,
									}}>
									<motion.span
										animate={
											shouldReduceMotion
												? {}
												: { scale: [1, 1.45, 1], opacity: [1, 0.35, 1] }
										}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
										aria-hidden='true'
										style={{
											width: 7,
											height: 7,
											borderRadius: '50%',
											background: 'var(--accent)',
											display: 'inline-block',
											flexShrink: 0,
										}}
									/>
									<span
										style={{
											fontSize: FONT.micro,
											color: 'var(--accent)',
											fontFamily: MONO,
											fontWeight: 600,
										}}>
										{profile.availability}
									</span>
								</div>
								<a
									href={profile.cvView}
									target='_blank'
									rel='noopener noreferrer'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 6,
										padding: '7px 16px',
										borderRadius: RADIUS.full,
										border: `${BORDER.soft} solid var(--line)`,
										background: 'transparent',
										color: 'var(--ink-secondary)',
										fontSize: FONT.micro,
										textDecoration: 'none',
										fontFamily: SANS,
										fontWeight: 600,
										transition:
											'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = 'var(--accent)';
										e.currentTarget.style.color = 'var(--accent)';
										if (!shouldReduceMotion)
											e.currentTarget.style.transform = 'translateY(-1px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = 'var(--line)';
										e.currentTarget.style.color = 'var(--ink-secondary)';
										e.currentTarget.style.transform = 'translateY(0)';
									}}>
									<Download size={13} aria-hidden='true' />
									Download CV
								</a>
							</div>
						</div>
					</motion.div>

					{/* ── Right column ── */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
						{/* Stats 2×2 */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: 14,
							}}>
							{stats.map(({ label, value, suffix, color, icon: Icon }, i) => (
								<motion.div
									key={label}
									initial={{ opacity: 0, scale: 0.88, y: 12 }}
									whileInView={{ opacity: 1, scale: 1, y: 0 }}
									viewport={{ once: true, margin: '-80px' }}
									transition={{
										...SPRING,
										delay: shouldReduceMotion ? 0 : 0.18 + i * 0.05,
									}}
									className='card'
									style={{ ...CARD, cursor: 'default' }}>
									<div
										style={{
											background: 'var(--surface-header)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											minHeight: 90,
										}}>
										<div
											style={{
												width: 52,
												height: 52,
												borderRadius: RADIUS.md,
												background: 'var(--surface)',
												border: `${BORDER.hard} solid var(--line)`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												boxShadow: 'var(--sh-1-hi)',
											}}>
											<Icon size={22} style={{ color }} aria-hidden='true' />
										</div>
									</div>
									<div
										style={{
											padding: '16px 16px 20px',
											textAlign: 'center' as const,
										}}>
										<div
											style={{
												fontSize: FONT.stat,
												fontWeight: 800,
												fontFamily: SANS,
												color,
												marginBottom: 4,
												lineHeight: 1,
											}}>
											<CountUp to={value} suffix={suffix} />
										</div>
										<div
											style={{
												color: 'var(--ink-muted)',
												fontSize: FONT.micro,
												fontFamily: SANS,
												fontWeight: 500,
											}}>
											{label}
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* Approach card */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.5)}
							className='card'
							style={CARD}>
							<div
								style={{
									background: 'var(--surface-header)',
									padding: '18px 28px',
									display: 'flex',
									alignItems: 'center',
									gap: 10,
								}}>
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: RADIUS.sm,
										background: 'var(--surface)',
										border: `${BORDER.soft} solid var(--line)`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: 'var(--sh-1)',
										flexShrink: 0,
									}}>
									<span
										style={{
											fontSize: FONT.lg,
											fontFamily: MONO,
											fontWeight: 800,
											color: 'var(--accent)',
										}}>
										&ldquo;
									</span>
								</div>
								<div
									style={{
										fontFamily: MONO,
										fontSize: FONT.micro,
										color: 'var(--accent)',
										letterSpacing: '0.15em',
										textTransform: 'uppercase' as const,
										fontWeight: 600,
									}}>
									my approach
								</div>
							</div>
							<div style={{ padding: '24px 28px' }}>
								<blockquote style={{ margin: 0 }}>
									<p
										style={{
											color: 'var(--ink-secondary)',
											fontSize: FONT.base,
											lineHeight: 1.8,
											fontFamily: SANS,
											fontWeight: 400,
											margin: '0 0 16px',
										}}>
										&ldquo;Great backend systems are invisible — they just work.
										I build for{' '}
										<span style={{ color: 'var(--success)', fontWeight: 600 }}>
											reliability
										</span>
										,{' '}
										<span style={{ color: 'var(--accent)', fontWeight: 600 }}>
											scalability
										</span>
										, and the{' '}
										<span style={{ color: 'var(--warn)', fontWeight: 600 }}>
											engineers
										</span>{' '}
										who maintain them.&rdquo;
									</p>
								</blockquote>
								<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
									{[
										'Clean Architecture',
										'API Design',
										'Performance',
										'Observability',
									].map((tag, i) => (
										<motion.span
											key={tag}
											initial={{ opacity: 0, scale: 0.8, y: 8 }}
											whileInView={{ opacity: 1, scale: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.35,
												ease: EASE,
												delay: shouldReduceMotion ? 0 : 0.6 + i * 0.07,
											}}
											style={{
												fontSize: FONT.micro,
												padding: '4px 10px',
												borderRadius: RADIUS.full,
												background: 'var(--surface-chip)',
												border: `1px solid var(--line-subtle)`,
												color: 'var(--ink-secondary)',
												fontFamily: MONO,
												letterSpacing: '0.04em',
											}}>
											{tag}
										</motion.span>
									))}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
