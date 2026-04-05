'use client';

import { useRef, useEffect } from 'react';
import {
	motion,
	useMotionValue,
	useTransform,
	animate,
	useInView,
	useReducedMotion,
} from 'framer-motion';
import {
	MapPin,
	Calendar,
	Briefcase,
	Download,
	Zap,
	Server,
	Building2,
	Activity,
} from 'lucide-react';
import TextReveal from '@/components/text-reveal';

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionVal = useMotionValue(0);
	const rounded = useTransform(motionVal, (v) => Math.round(v));
	const isInView = useInView(ref, { once: true, margin: '-80px' });
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (isInView) {
			if (shouldReduceMotion) {
				motionVal.set(to);
			} else {
				animate(motionVal, to, { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] });
			}
		}
	}, [isInView, motionVal, to, shouldReduceMotion]);

	return (
		<span
			ref={ref}
			style={{ display: 'inline', fontVariantNumeric: 'tabular-nums' }}>
			<motion.span>{rounded}</motion.span>
			{suffix}
		</span>
	);
}

const stats = [
	{
		label: 'Years Experience',
		value: 4,
		suffix: '+',
		color: '#10b981',
		icon: Zap,
		bg: 'rgba(16,185,129,0.10)',
	},
	{
		label: 'APIs Built',
		value: 30,
		suffix: '+',
		color: '#6366f1',
		icon: Server,
		bg: 'rgba(99,102,241,0.10)',
	},
	{
		label: 'Industries',
		value: 3,
		suffix: '',
		color: '#f59e0b',
		icon: Building2,
		bg: 'rgba(245,158,11,0.10)',
	},
	{
		label: 'Monthly API Reqs',
		value: 40,
		suffix: 'K+',
		color: '#3b82f6',
		icon: Activity,
		bg: 'rgba(59,130,246,0.10)',
	},
];

const infoItems = [
	{
		icon: MapPin,
		text: 'Jakarta, Indonesia (Hybrid / Remote)',
		label: 'Location',
	},
	{ icon: Calendar, text: 'Available', label: 'Availability' },
	{ icon: Briefcase, text: 'Freelance & Full-time roles', label: 'Work type' },
];

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 };
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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
			style={{ background: '#f0ece8' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				{/* Section label */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 11,
						color: '#a3a3a3',
						fontWeight: 600,
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						marginBottom: 12,
					}}
				/>

				{/* Heading */}
				<TextReveal
					id='about-heading'
					parts={[
						{ text: 'Who I ' },
						{ text: 'Am', color: '#6366f1' },
					]}
					as='h2'
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 64,
						fontFamily: "'Inter', sans-serif",
						color: '#0a0a0a',
						letterSpacing: '-0.02em',
					}}
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
						className="card"
						style={{
							background: '#ffffff',
							border: '2px solid #0a0a0a',
							borderRadius: 20,
							boxShadow: '6px 6px 0px #0a0a0a',
							overflow: 'hidden',
						}}>
						{/* Illustration header */}
						<div
							style={{
								background: '#f0ece8',
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
									borderRadius: 18,
									flexShrink: 0,
									background: '#6366f1',
									border: '2px solid #0a0a0a',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '4px 4px 0px #0a0a0a',
									cursor: 'pointer',
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
										color: '#fff',
										fontSize: 22,
										fontWeight: 800,
										fontFamily: "'Inter', sans-serif",
									}}>
									FY
								</span>
							</motion.div>
							<div>
								<div
									style={{
										fontWeight: 800,
										fontSize: 20,
										color: '#0a0a0a',
										fontFamily: "'Inter', sans-serif",
										marginBottom: 4,
										letterSpacing: '-0.02em',
									}}>
									Ferri Yusra
								</div>
								<div
									style={{
										color: '#6366f1',
										fontSize: 13,
										fontFamily: "'JetBrains Mono', monospace",
										fontWeight: 500,
									}}>
									Backend Engineer
								</div>
							</div>
						</div>
						{/* Content */}
						<div style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
							<p
								style={{
									color: '#525252',
									lineHeight: 1.8,
									marginBottom: 12,
									fontFamily: "'Inter', sans-serif",
									fontSize: 15,
								}}>
								Backend engineer with 4+ years building scalable API systems
								across fintech, GovTech health, and automotive industries. I
								specialize in{' '}
								<span style={{ color: '#0a0a0a', fontWeight: 500 }}>Go</span>{' '}
								and{' '}
								<span style={{ color: '#0a0a0a', fontWeight: 500 }}>
									Node.js
								</span>{' '}
								— from RESTful APIs to event-driven architectures.
							</p>
							<p
								style={{
									color: '#525252',
									lineHeight: 1.8,
									marginBottom: 24,
									fontFamily: "'Inter', sans-serif",
									fontSize: 15,
								}}>
								I care deeply about clean architecture, system reliability, and
								writing code that teams can maintain and scale confidently.
							</p>
							<ul
								role='list'
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
											borderRadius: 12,
											background: '#f9f9f7',
											border: '1px solid #e5e5e5',
										}}>
										<div
											style={{
												width: 32,
												height: 32,
												borderRadius: 9,
												flexShrink: 0,
												background: '#ffffff',
												border: '1.5px solid #0a0a0a',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												boxShadow: '2px 2px 0px #0a0a0a',
											}}>
											<Icon
												size={14}
												style={{ color: '#6366f1' }}
												aria-hidden='true'
											/>
										</div>
										<div>
											<div
												style={{
													fontSize: 10,
													color: '#a3a3a3',
													fontFamily: "'JetBrains Mono', monospace",
													textTransform: 'uppercase',
													letterSpacing: '0.12em',
													marginBottom: 1,
													fontWeight: 600,
												}}>
												{label}
											</div>
											<div
												style={{
													fontSize: 13,
													color: '#0a0a0a',
													fontFamily: "'Inter', sans-serif",
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
										background: 'rgba(99,102,241,0.08)',
										border: '1px solid rgba(99,102,241,0.2)',
										borderRadius: 100,
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
											background: '#6366f1',
											display: 'inline-block',
											flexShrink: 0,
										}}
									/>
									<span
										style={{
											fontSize: 12,
											color: '#6366f1',
											fontFamily: "'JetBrains Mono', monospace",
											fontWeight: 600,
										}}>
										Availble from April 2026
									</span>
								</div>
								<a
									href='/https://drive.google.com/file/d/1ZK5ogVbmyrK95M6KYBz4w53dDJsmaQ8I/view?usp=sharing'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 6,
										padding: '7px 16px',
										borderRadius: 100,
										border: '1.5px solid #0a0a0a',
										background: 'transparent',
										color: '#525252',
										fontSize: 12,
										textDecoration: 'none',
										fontFamily: "'Inter', sans-serif",
										fontWeight: 600,
										transition:
											'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
										cursor: 'pointer',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.color = '#6366f1';
										if (!shouldReduceMotion)
											e.currentTarget.style.transform = 'translateY(-1px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = '#0a0a0a';
										e.currentTarget.style.color = '#525252';
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
									className="card"
									style={{
										background: '#ffffff',
										border: '2px solid #0a0a0a',
										borderRadius: 16,
										boxShadow: '4px 4px 0px #0a0a0a',
										overflow: 'hidden',
										cursor: 'default',
									}}>
									{/* Icon header */}
									<div
										style={{
											background: '#f0ece8',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											minHeight: 90,
										}}>
										<div
											style={{
												width: 52,
												height: 52,
												borderRadius: 14,
												background: '#ffffff',
												border: '2px solid #0a0a0a',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												boxShadow: '3px 3px 0px #0a0a0a',
											}}>
											<Icon size={22} style={{ color }} aria-hidden='true' />
										</div>
									</div>
									{/* Number + label */}
									<div
										style={{
											padding: '16px 16px 20px',
											textAlign: 'center' as const,
										}}>
										<div
											style={{
												fontSize: 32,
												fontWeight: 800,
												fontFamily: "'Inter', sans-serif",
												color,
												marginBottom: 4,
												lineHeight: 1,
											}}>
											<CountUp to={value} suffix={suffix} />
										</div>
										<div
											style={{
												color: '#a3a3a3',
												fontSize: 11,
												fontFamily: "'Inter', sans-serif",
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
							className="card"
							style={{
								background: '#ffffff',
								border: '2px solid #0a0a0a',
								borderRadius: 20,
								boxShadow: '6px 6px 0px #0a0a0a',
								overflow: 'hidden',
							}}>
							{/* Header */}
							<div
								style={{
									background: '#f0ece8',
									padding: '18px 28px',
									display: 'flex',
									alignItems: 'center',
									gap: 10,
								}}>
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: 10,
										background: '#ffffff',
										border: '1.5px solid #0a0a0a',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '2px 2px 0px #0a0a0a',
										flexShrink: 0,
									}}>
									<span
										style={{
											fontSize: 16,
											fontFamily: "'JetBrains Mono', monospace",
											fontWeight: 800,
											color: '#6366f1',
										}}>
										&ldquo;
									</span>
								</div>
								<div
									style={{
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: 11,
										color: '#6366f1',
										letterSpacing: '0.15em',
										textTransform: 'uppercase' as const,
										fontWeight: 600,
									}}>
									my approach
								</div>
							</div>
							{/* Content */}
							<div style={{ padding: '24px 28px' }}>
								<blockquote style={{ margin: 0 }}>
									<p
										style={{
											color: '#525252',
											fontSize: 15,
											lineHeight: 1.8,
											fontFamily: "'Inter', sans-serif",
											fontWeight: 400,
											margin: '0 0 16px',
										}}>
										&ldquo;Great backend systems are invisible — they just work.
										I build for{' '}
										<span style={{ color: '#10b981', fontWeight: 600 }}>
											reliability
										</span>
										,{' '}
										<span style={{ color: '#6366f1', fontWeight: 600 }}>
											scalability
										</span>
										, and the{' '}
										<span style={{ color: '#f59e0b', fontWeight: 600 }}>
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
												fontSize: 11,
												padding: '4px 10px',
												borderRadius: 100,
												background: '#f4f4f5',
												border: '1px solid #e4e4e7',
												color: '#71717a',
												fontFamily: "'JetBrains Mono', monospace",
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
