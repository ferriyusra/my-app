'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Trophy } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const experiences = [
	{
		role: 'Backend Engineer',
		company: 'PT. Teknologi Pamadya Analitika (Meditap)',
		period: 'July 2025 — Present',
		badge: 'Present' as const,
		location: 'Jakarta, Indonesia',
		color: '#6366f1',
		glow: '#818cf8',
		initial: 'MT',
		description:
			'Designed and developed backend systems for finance-related platforms using Go (Gin Framework) and PostgreSQL, supporting finance operations and data-driven decision-making. Managed KrakenD API Gateway and Keycloak IAM for secure API routing, authentication, and RBAC.',
		achievements: [
			'Enabled the Finance Team to manage and monitor data for ~160 ASO entities, supporting billing and payment collection workflows.',
			'Implemented event-driven automation via Google Pub/Sub and Cloud Scheduler, improving service reliability and operational efficiency.',
			'Contributed to internal CMS tools with React and Material UI, streamlining workflows for non-technical stakeholders.',
		],
		tech: [
			'Go',
			'TypeScript',
			'React',
			'PostgreSQL',
			'MS SQL Server',
			'Redis',
			'Pub/Sub',
			'Cloud Scheduler',
			'KrakenD',
			'Keycloak',
		],
	},
	{
		role: 'Backend Engineer',
		company: 'INA Digital (Peruri Digital Security)',
		period: 'January 2024 — March 2025',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#10b981',
		glow: '#34d399',
		initial: 'ID',
		description:
			'Backend Engineer at GovTech Health, responsible for end-to-end development of health data products. Built API services for SATUSEHAT Data Product handling 20,000–40,000 requests/month and collaborated with BI team to deliver web-based dashboard solutions.',
		achievements: [
			'Migrated multiple Tableau dashboards into native API-driven solutions, reducing Tableau dependency and improving load performance.',
			'Delivered major dashboard revamps including Monitoring Implementasi SATUSEHAT, Penyakit Tidak Menular, and Pemantauan Aliran Data.',
			'Built and optimized backend services using NestJS and Go with clean architecture, integrating BigQuery, MongoDB, and Redis for caching.',
		],
		tech: [
			'Go',
			'Node.js',
			'NestJS',
			'PostgreSQL',
			'BigQuery',
			'MongoDB',
			'Redis',
			'Docker',
			'GCS',
			'Datadog',
		],
	},
	{
		role: 'Backend Engineer',
		company: 'Health Technology Transformation & Digitalization Team',
		period: 'July 2023 — December 2023',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#3b82f6',
		glow: '#60a5fa',
		initial: 'HT',
		description:
			'Owned end-to-end backend development for multiple data-driven products, collaborating with product managers, data analysts, and frontend engineers to design interactive web-based dashboards.',
		achievements: [
			'Delivered key dashboard migrations including Gerakan Anak Sehat, Covid-19 Vaksin, Morbiditas Pasien, and Monitoring Implementasi SATUSEHAT.',
			'Designed scalable API services using Go and TypeScript (Next.js) integrating PostgreSQL, BigQuery, and MongoDB for high-performance data visualization.',
			'Backend APIs handled 15,000–30,000 requests/month while reducing Tableau licensing costs.',
		],
		tech: [
			'Go',
			'Node.js',
			'TypeScript',
			'Next.js',
			'PostgreSQL',
			'BigQuery',
			'MongoDB',
			'Redis',
			'Docker',
			'Datadog',
		],
	},
	{
		role: 'Software Engineer Backend',
		company: 'PT Moladin Digital Indonesia',
		period: 'March 2022 — February 2023',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#f59e0b',
		glow: '#fbbf24',
		initial: 'MD',
		description:
			'Built end-to-end backend API services across multiple core product lines including Crash Program, Referral Program, Survey Program, and Academy Program, supporting 5,000–16,000 active users.',
		achievements: [
			'Integrated Apache Kafka for event-driven message publishing, enabling scalable async processing and improved system decoupling.',
			'Improved test coverage with unit tests using Mocha, Chai, and Jest for Express-based services, reducing production incidents.',
			'Actively participated in peer code reviews, upholding engineering standards and reducing technical debt across backend services.',
		],
		tech: [
			'Go',
			'Node.js',
			'Express.js',
			'MySQL',
			'PostgreSQL',
			'MongoDB',
			'Kafka',
			'Sentry',
			'Jest',
			'Mocha',
		],
	},
];

type Exp = (typeof experiences)[number];

function Badge({ label }: { label: 'Present' | 'Previous Role' }) {
	const isPresent = label === 'Present';
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				padding: '5px 14px',
				borderRadius: 100,
				fontSize: 12,
				fontWeight: 700,
				fontFamily: "'Inter', sans-serif",
				background: isPresent ? '#6366f1' : '#f4f4f5',
				color: isPresent ? '#fff' : '#52525b',
				whiteSpace: 'nowrap' as const,
				boxShadow: isPresent ? '0 2px 12px rgba(99,102,241,0.25)' : 'none',
				border: isPresent ? 'none' : '1px solid #e4e4e7',
			}}>
			<span
				style={{
					width: 6,
					height: 6,
					borderRadius: '50%',
					background: isPresent ? 'rgba(255,255,255,0.75)' : '#a1a1aa',
					display: 'inline-block',
				}}
			/>
			{label}
		</span>
	);
}

function Card({ exp }: { exp: Exp }) {
	return (
		<div
			style={{
				background: '#ffffff',
				border: '2px solid #0a0a0a',
				borderRadius: 20,
				boxShadow: '6px 6px 0px #0a0a0a',
				overflow: 'hidden',
				transition: 'transform 0.2s ease, box-shadow 0.2s ease',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translate(-2px, -2px)';
				e.currentTarget.style.boxShadow = '8px 8px 0px #0a0a0a';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translate(0, 0)';
				e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a';
			}}>

			{/* ── Illustration header ── */}
			<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140, gap: 16 }}>
				<div style={{ width: 72, height: 72, borderRadius: 18, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a', flexShrink: 0 }}>
					<span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: exp.color, letterSpacing: '-0.02em' }}>
						{exp.initial}
					</span>
				</div>
				<div>
					<Badge label={exp.badge} />
				</div>
			</div>

			{/* ── Content ── */}
			<div style={{ padding: '24px 28px 28px' }}>
				{/* Role title */}
				<h3
					style={{
						fontSize: 'clamp(18px, 2.2vw, 22px)',
						fontWeight: 800,
						fontFamily: "'Inter', sans-serif",
						letterSpacing: '-0.02em',
						lineHeight: 1.25,
						marginBottom: 10,
						color: exp.color,
					}}>
					{exp.role}
				</h3>

				{/* Company */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
					<MapPin size={12} style={{ color: exp.color, flexShrink: 0 }} aria-hidden='true' />
					<span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
						{exp.company}
					</span>
				</div>
				<div style={{ fontSize: 12, color: '#a3a3a3', fontFamily: "'JetBrains Mono', monospace", marginBottom: 18, letterSpacing: '0.01em' }}>
					{exp.location} · {exp.period}
				</div>

				{/* Description */}
				<p style={{ color: '#525252', fontSize: 14, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: 22 }}>
					{exp.description}
				</p>

				{/* Key achievements */}
				<div style={{ marginBottom: 22 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
						<Trophy size={13} style={{ color: exp.glow }} aria-hidden='true' />
						<span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
							Key Achievements
						</span>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{exp.achievements.map((a, j) => (
							<div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: '#f9f9f7', border: '1px solid #e5e5e5', borderRadius: 10 }}>
								<div style={{ width: 7, height: 7, borderRadius: '50%', background: exp.color, flexShrink: 0, marginTop: 5, boxShadow: `0 0 8px ${exp.color}40` }} />
								<span style={{ fontSize: 13, color: '#525252', lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
									{a}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Tech tags */}
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
					{exp.tech.map((t) => (
						<span key={t} style={{ padding: '3px 10px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: 100, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#52525b' }}>
							{t}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function TimelineDot({
	exp,
	delay,
	shouldReduceMotion,
}: {
	exp: Exp;
	delay: number;
	shouldReduceMotion: boolean | null;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{
				duration: shouldReduceMotion ? 0 : 0.4,
				ease: EASE,
				delay: shouldReduceMotion ? 0 : delay,
			}}
			style={{
				width: 52,
				height: 52,
				borderRadius: '50%',
				background: '#ffffff',
				border: `2px solid #0a0a0a`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: `4px 4px 0px #0a0a0a`,
				position: 'relative',
				zIndex: 1,
				flexShrink: 0,
				marginTop: 20,
			}}>
			<span
				style={{
					fontSize: 12,
					fontWeight: 800,
					fontFamily: "'Inter', sans-serif",
					color: exp.color,
					letterSpacing: '-0.01em',
				}}>
				{exp.initial}
			</span>
		</motion.div>
	);
}

export default function Experience() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<section id='experience' style={{ background: '#f0ece8' }}>
			<div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: EASE }}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 11,
						color: '#a3a3a3',
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						marginBottom: 12,
						fontWeight: 600,
					}}></motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{
						duration: shouldReduceMotion ? 0 : 0.45,
						ease: EASE,
						delay: shouldReduceMotion ? 0 : 0.08,
					}}
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 64,
						fontFamily: "'Inter', sans-serif",
						color: '#0a0a0a',
						letterSpacing: '-0.02em',
					}}>
					Where I&apos;ve{' '}
					<span style={{ color: '#6366f1' }}>Worked</span>
				</motion.h2>

				{/* Timeline container */}
				<div style={{ position: 'relative' }}>
					{/* Vertical center line (desktop) */}
					<motion.div
						aria-hidden='true'
						initial={{ scaleY: 0, opacity: 0 }}
						whileInView={{ scaleY: 1, opacity: 1 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={{
							duration: shouldReduceMotion ? 0 : 1.2,
							ease: EASE,
							delay: shouldReduceMotion ? 0 : 0.2,
						}}
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							top: 0,
							bottom: 0,
							width: 2,
							background: '#0a0a0a',
							pointerEvents: 'none',
							transformOrigin: 'top',
						}}
					/>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
						{experiences.map((exp, i) => {
							const isLeft = i % 2 === 0;
							const delay = shouldReduceMotion ? 0 : 0.15 + i * 0.1;
							return (
								<div key={i} className='exp-row'>
									{/* Left slot: card for even, spacer for odd */}
									{isLeft ? (
										<motion.div
											className='exp-slot-left'
											initial={{ opacity: 0, x: -32 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '-80px' }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.55,
												ease: EASE,
												delay,
											}}>
											<Card exp={exp} />
										</motion.div>
									) : (
										<div className='exp-slot-spacer' />
									)}

									{/* Center: timeline dot */}
									<div className='exp-slot-mid'>
										<TimelineDot
											exp={exp}
											delay={delay + 0.1}
											shouldReduceMotion={shouldReduceMotion}
										/>
									</div>

									{/* Right slot: spacer for even, card for odd */}
									{!isLeft ? (
										<motion.div
											className='exp-slot-right'
											initial={{ opacity: 0, x: 32 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true, margin: '-80px' }}
											transition={{
												duration: shouldReduceMotion ? 0 : 0.55,
												ease: EASE,
												delay,
											}}>
											<Card exp={exp} />
										</motion.div>
									) : (
										<div className='exp-slot-spacer' />
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
