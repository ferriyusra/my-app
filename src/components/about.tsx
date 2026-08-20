'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Clock, Briefcase, Download, CircleDot } from 'lucide-react';
import TextReveal from '@/components/text-reveal';
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

/* The stat grid that used to live here ("30+ APIs Built", "40K+ Monthly API
   Reqs") is gone. 40K/month is roughly one request a minute — quoting it as a
   headline undersold work on a national health-data platform, and the numbers
   existed to fill four boxes rather than to inform. The real figures are in
   the Experience entries, where they have context. */

const facts = [
	{ icon: MapPin, label: 'Based in', value: profile.locationDetail },
	{ icon: Clock, label: 'Timezone', value: 'GMT+7 (WIB) — overlaps EU & APAC' },
	{ icon: Briefcase, label: 'Open to', value: profile.workType },
	{ icon: CircleDot, label: 'Availability', value: profile.availability },
];

export default function About() {
	const shouldReduceMotion = useReducedMotion();

	const t = (delay: number) => ({
		duration: shouldReduceMotion ? 0 : 0.5,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	return (
		<section
			id='about'
			aria-labelledby='about-heading'
			style={{ background: 'var(--section-b)' }}>
			<div style={CONTAINER}>
				<TextReveal
					id='about-heading'
					parts={[{ text: 'Who I ' }, { text: 'Am', color: 'var(--accent)' }]}
					as='h2'
					style={{ ...H2, marginBottom: 48 }}
				/>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
						gap: 32,
						alignItems: 'start',
					}}>
					{/* ── Narrative ── */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0)}>
						<p
							style={{
								color: 'var(--ink-secondary)',
								lineHeight: 1.8,
								marginBottom: 20,
								fontFamily: SANS,
								fontSize: 'clamp(16px, 1.5vw, 18px)',
							}}>
							{profile.bio} I specialise in{' '}
							<span style={{ color: 'var(--ink)', fontWeight: 600 }}>Go</span> and{' '}
							<span style={{ color: 'var(--ink)', fontWeight: 600 }}>
								Node.js
							</span>{' '}
							— from RESTful APIs to event-driven architectures.
						</p>
						<p
							style={{
								color: 'var(--ink-secondary)',
								lineHeight: 1.8,
								marginBottom: 20,
								fontFamily: SANS,
								fontSize: FONT.base,
							}}>
							Most of what I have shipped replaced something manual: spreadsheet
							tracking that became a billing source of truth, Tableau dashboards
							that became API-driven services, monitoring that a person used to
							do by hand.
						</p>
						<p
							style={{
								color: 'var(--ink-secondary)',
								lineHeight: 1.8,
								marginBottom: 28,
								fontFamily: SANS,
								fontSize: FONT.base,
							}}>
							Good backend systems are invisible — they just work. I build for
							reliability, for scale, and for the engineers who maintain them
							after I have moved on.
						</p>

						<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
							{[
								'Clean Architecture',
								'API Design',
								'Event-Driven',
								'Observability',
							].map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: FONT.micro,
										padding: '5px 12px',
										borderRadius: RADIUS.full,
										background: 'var(--surface-chip)',
										border: `1px solid var(--line-subtle)`,
										color: 'var(--ink-secondary)',
										fontFamily: MONO,
										letterSpacing: '0.04em',
									}}>
									{tag}
								</span>
							))}
						</div>
					</motion.div>

					{/* ── Facts panel ── */}
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.12)}
						className='card'
						style={CARD}>
						<div
							style={{
								background: 'var(--surface-header)',
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								padding: '20px 24px',
								borderBottom: `${BORDER.hard} solid var(--line)`,
							}}>
							<div
								aria-hidden='true'
								style={{
									width: 52,
									height: 52,
									borderRadius: RADIUS.md,
									flexShrink: 0,
									background: 'var(--accent)',
									border: `${BORDER.hard} solid var(--line)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: 'var(--sh-1-hi)',
									color: 'var(--accent-ink)',
									fontSize: FONT.lg,
									fontWeight: 800,
									fontFamily: SANS,
								}}>
								{profile.initials}
							</div>
							<div>
								<div
									style={{
										fontWeight: 800,
										fontSize: FONT.lg,
										color: 'var(--ink)',
										fontFamily: SANS,
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

						<dl style={{ margin: 0, padding: '8px 24px 20px' }}>
							{facts.map(({ icon: Icon, label, value }) => (
								<div
									key={label}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										gap: 12,
										padding: '14px 0',
										borderBottom: `1px solid var(--line-subtle)`,
									}}>
									<Icon
										size={15}
										aria-hidden='true'
										style={{
											color: 'var(--accent)',
											flexShrink: 0,
											marginTop: 2,
										}}
									/>
									<div>
										<dt
											style={{
												fontSize: FONT.micro,
												color: 'var(--ink-muted)',
												fontFamily: MONO,
												textTransform: 'uppercase',
												letterSpacing: '0.12em',
												fontWeight: 600,
												marginBottom: 3,
											}}>
											{label}
										</dt>
										<dd
											style={{
												margin: 0,
												fontSize: FONT.sm,
												color: 'var(--ink)',
												fontFamily: SANS,
												fontWeight: 500,
												lineHeight: 1.5,
											}}>
											{value}
										</dd>
									</div>
								</div>
							))}
						</dl>

						<div style={{ padding: '0 24px 24px' }}>
							<a
								href={profile.cvView}
								target='_blank'
								rel='noopener noreferrer'
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
									width: '100%',
									padding: '11px 16px',
									borderRadius: RADIUS.sm,
									border: `${BORDER.soft} solid var(--line)`,
									background: 'var(--surface)',
									color: 'var(--ink)',
									fontSize: FONT.sm,
									textDecoration: 'none',
									fontFamily: SANS,
									fontWeight: 700,
									boxShadow: 'var(--sh-1)',
									transition: 'transform 0.2s ease, box-shadow 0.2s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translate(-1px,-1px)';
									e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0,0)';
									e.currentTarget.style.boxShadow = 'var(--sh-1)';
								}}>
								<Download size={14} aria-hidden='true' />
								View CV
							</a>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
