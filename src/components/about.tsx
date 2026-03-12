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
	{ icon: Calendar, text: 'Available from April 2026', label: 'Availability' },
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
			style={{ background: '#0f0f11' }}>
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
						color: '#10b981',
						fontWeight: 600,
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						marginBottom: 12,
					}}
				/>

				{/* Heading */}
				<motion.h2
					id='about-heading'
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.45, 0.08)}
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 64,
						fontFamily: "'Inter', sans-serif",
						color: '#fafafa',
						letterSpacing: '-0.02em',
					}}>
					Who I <span style={{ color: '#6366f1' }}>Am</span>
				</motion.h2>

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
						style={{
							background: '#111113',
							border: '1px solid rgba(255,255,255,0.07)',
							borderRadius: 20,
							padding: 'clamp(20px, 4vw, 32px)',
							cursor: 'default',
						}}>
						{/* Avatar + name */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								marginBottom: 24,
							}}>
							<motion.div
								whileHover={
									shouldReduceMotion ? {} : { scale: 1.06, rotate: 3 }
								}
								transition={SPRING}
								aria-hidden='true'
								style={{
									width: 64,
									height: 64,
									borderRadius: 18,
									flexShrink: 0,
									background: '#10b981',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
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
										fontSize: 20,
										fontWeight: 800,
										fontFamily: "'Inter', sans-serif",
									}}>
									FY
								</span>
							</motion.div>

							<div>
								<div
									style={{
										fontWeight: 700,
										fontSize: 18,
										color: '#fafafa',
										fontFamily: "'Inter', sans-serif",
										marginBottom: 4,
									}}>
									Ferri Yusra
								</div>
								<div
									style={{
										color: '#10b981',
										fontSize: 13,
										fontFamily: "'JetBrains Mono', monospace",
										fontWeight: 500,
									}}>
									Backend Engineer
								</div>
							</div>
						</div>

						{/* Bio */}
						<p
							style={{
								color: '#a1a1aa',
								lineHeight: 1.8,
								marginBottom: 12,
								fontFamily: "'Inter', sans-serif",
								fontSize: 15,
							}}>
							Backend engineer with 4+ years building scalable API systems
							across fintech, GovTech health, and automotive industries. I
							specialize in{' '}
							<span style={{ color: '#d4d4d8', fontWeight: 500 }}>Go</span> and{' '}
							<span style={{ color: '#d4d4d8', fontWeight: 500 }}>Node.js</span>{' '}
							— from RESTful APIs to event-driven architectures.
						</p>
						<p
							style={{
								color: '#a1a1aa',
								lineHeight: 1.8,
								marginBottom: 24,
								fontFamily: "'Inter', sans-serif",
								fontSize: 15,
							}}>
							I care deeply about clean architecture, system reliability, and
							writing code that teams can maintain and scale confidently.
						</p>

						{/* Info rows */}
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
										background: 'rgba(255,255,255,0.03)',
										border: '1px solid rgba(255,255,255,0.06)',
									}}>
									<div
										style={{
											width: 32,
											height: 32,
											borderRadius: 9,
											flexShrink: 0,
											background: '#18181b',
											border: '1px solid rgba(255,255,255,0.08)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<Icon
											size={14}
											style={{ color: '#10b981' }}
											aria-hidden='true'
										/>
									</div>
									<div>
										<div
											style={{
												fontSize: 10,
												color: '#52525b',
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
												color: '#d4d4d8',
												fontFamily: "'Inter', sans-serif",
												fontWeight: 500,
											}}>
											{text}
										</div>
									</div>
								</motion.li>
							))}
						</ul>

						{/* Actions */}
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
									background: 'rgba(16,185,129,0.08)',
									border: '1px solid rgba(16,185,129,0.2)',
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
										background: '#10b981',
										display: 'inline-block',
										flexShrink: 0,
									}}
								/>
								<span
									style={{
										fontSize: 12,
										color: '#10b981',
										fontFamily: "'JetBrains Mono', monospace",
										fontWeight: 600,
									}}>
									Available April 2026
								</span>
							</div>

							<a
								href='/resume.pdf'
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									padding: '7px 16px',
									borderRadius: 100,
									border: '1px solid rgba(255,255,255,0.10)',
									background: 'transparent',
									color: '#a1a1aa',
									fontSize: 12,
									textDecoration: 'none',
									fontFamily: "'Inter', sans-serif",
									fontWeight: 600,
									transition:
										'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
									cursor: 'pointer',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = '#10b981';
									e.currentTarget.style.color = '#10b981';
									if (!shouldReduceMotion)
										e.currentTarget.style.transform = 'translateY(-1px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
									e.currentTarget.style.color = '#a1a1aa';
									e.currentTarget.style.transform = 'translateY(0)';
								}}>
								<Download size={13} aria-hidden='true' />
								Download CV
							</a>
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
							{stats.map(
								({ label, value, suffix, color, icon: Icon, bg }, i) => (
									<motion.div
										key={label}
										initial={{ opacity: 0, scale: 0.88, y: 12 }}
										whileInView={{ opacity: 1, scale: 1, y: 0 }}
										viewport={{ once: true, margin: '-80px' }}
										transition={{
											...SPRING,
											delay: shouldReduceMotion ? 0 : 0.18 + i * 0.05,
										}}
										whileHover={
											shouldReduceMotion ? {} : { y: -4, scale: 1.02 }
										}
										style={{
											background: '#111113',
											border: '1px solid rgba(255,255,255,0.07)',
											borderRadius: 16,
											padding: '20px 16px',
											textAlign: 'center',
											cursor: 'default',
											overflow: 'hidden',
											position: 'relative',
										}}>
										{/* Top accent bar */}
										<motion.div
											initial={{ scaleX: 0 }}
											whileInView={{ scaleX: 1 }}
											viewport={{ once: true }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.45,
												ease: EASE,
												delay: shouldReduceMotion ? 0 : 0.38 + i * 0.06,
											}}
											aria-hidden='true'
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												right: 0,
												height: 2,
												background: color,
												transformOrigin: 'left',
												borderRadius: '16px 16px 0 0',
											}}
										/>

										{/* Icon */}
										<div
											style={{
												width: 38,
												height: 38,
												borderRadius: 11,
												background: bg,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												margin: '4px auto 12px',
											}}>
											<Icon size={17} style={{ color }} aria-hidden='true' />
										</div>

										{/* Number */}
										<div
											style={{
												fontSize: 34,
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
												color: '#52525b',
												fontSize: 11,
												fontFamily: "'Inter', sans-serif",
												fontWeight: 500,
											}}>
											{label}
										</div>

										{/* Subtle bg glow */}
										<div
											aria-hidden='true'
											style={{
												position: 'absolute',
												bottom: -20,
												right: -20,
												width: 64,
												height: 64,
												borderRadius: '50%',
												background: color,
												opacity: 0.05,
												pointerEvents: 'none',
											}}
										/>
									</motion.div>
								),
							)}
						</div>

						{/* Approach card */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.5)}
							style={{
								background: '#111113',
								borderRadius: 20,
								padding: '24px 28px',
								border: '1px solid rgba(255,255,255,0.07)',
								borderLeft: '3px solid #10b981',
							}}>
							<div
								style={{
									fontFamily: "'JetBrains Mono', monospace",
									fontSize: 11,
									color: '#10b981',
									letterSpacing: '0.15em',
									textTransform: 'uppercase',
									marginBottom: 14,
									fontWeight: 600,
								}}>
								{'my approach'}
							</div>

							<blockquote style={{ margin: 0 }}>
								<p
									style={{
										color: '#d4d4d8',
										fontSize: 15,
										lineHeight: 1.8,
										fontFamily: "'Inter', sans-serif",
										fontWeight: 400,
										margin: '0 0 16px',
									}}>
									&ldquo;Great backend systems are invisible — they just work. I
									build for{' '}
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
								].map((tag) => (
									<span
										key={tag}
										style={{
											fontSize: 11,
											padding: '4px 10px',
											borderRadius: 100,
											background: 'rgba(255,255,255,0.05)',
											border: '1px solid rgba(255,255,255,0.10)',
											color: '#71717a',
											fontFamily: "'JetBrains Mono', monospace",
											letterSpacing: '0.04em',
										}}>
										{tag}
									</span>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
