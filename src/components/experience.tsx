'use client';

import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Trophy, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '@/components/text-reveal';
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

const COLLAPSED_COUNT = 2;

const experiences = [
	{
		role: 'Backend Engineer',
		company: 'PT. Teknologi Pamadya Analitika (Meditap)',
		period: 'July 2025 — Present',
		startISO: '2025-07',
		badge: 'Present' as const,
		location: 'Jakarta, Indonesia',
		color: '#6366f1',
		glow: '#818cf8',
		initial: 'MT',
		description:
			'Designed and developed backend systems for finance-related platforms using Go (Gin Framework) and PostgreSQL, delivering core services (ASO Database, ASO Notification Below Threshold) that replaced manual spreadsheet-based tracking and became the single source of truth for finance operations.',
		achievements: [
			'Built and maintained RESTful API services powering financial workflows for ~160 ASO entities, enabling the Finance Team to manage and monitor structured, real-time data used directly for billing and payment collection.',
			'Automated threshold-based financial notifications and scheduled billing processes with an event-driven architecture using Google Pub/Sub and Cloud Scheduler, eliminating recurring manual monitoring tasks previously done by the Finance Team.',
			'Configured and managed KrakenD API Gateway and Keycloak IAM with role-based access control across multiple internal services and user roles, centralizing access management and reducing security-misconfiguration risk.',
			'Developed internal CMS tools using React and Material UI, giving non-technical stakeholders direct visibility into financial data and streamlining workflows that previously required engineering support.',
			'Accelerated feature delivery and improved code consistency by integrating AI-assisted coding and review tools (Anthropic Claude) into daily refactoring, documentation, and implementation workflows — ~20–30% productivity gain on routine engineering tasks.',
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
		startISO: '2024-01',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#10b981',
		glow: '#34d399',
		initial: 'ID',
		description:
			"Primary backend engineer on multiple health data products under SATUSEHAT — Indonesia's national health data interoperability platform — collaborating with Product Managers, Technical Program Managers, and cross-functional stakeholders to deliver backend systems supporting national-scale health data initiatives.",
		achievements: [
			'Maintained and extended API services for the SATUSEHAT Data Product in Node.js (NestJS) and PostgreSQL, developing new endpoints and improvements to ensure reliable data exchange and support evolving requirements for nationwide health data integration.',
			'Built dedicated API layers in Go (Gin Framework) integrating PostgreSQL, Google BigQuery, MongoDB, and Redis caching to power web-based dashboards for the Business Intelligence team, enabling near real-time access to large-scale health datasets.',
			"Continued the migration of legacy Tableau dashboards into fully native, API-driven solutions by developing the backend services that replaced Tableau's data layer, further reducing third-party licensing costs and improving dashboard performance.",
			'Developed and maintained backend services in Go and Node.js powering native dashboards — including Penyakit Tidak Menular and Pemantauan Aliran Data SATUSEHAT — working alongside frontend engineers to deliver dashboards used by stakeholders to monitor and analyze national health data flows.',
			"Implemented Datadog monitoring for backend services following the company's observability standards, enabling API performance and error-rate tracking to support proactive issue detection.",
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
		startISO: '2023-07',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#3b82f6',
		glow: '#60a5fa',
		initial: 'HT',
		description:
			'Primary backend engineer on multiple data-driven products under the Health Technology Transformation initiative, collaborating with Product Managers, Data Analysts, and frontend engineers to deliver internal web-based dashboard solutions for operational teams.',
		achievements: [
			'Designed and developed scalable API services in Go (Gin Framework) integrating PostgreSQL, Google BigQuery, and MongoDB to power interactive dashboards used by analysts and operational stakeholders, complemented by a Next.js API endpoint built to proxy requests to an external data source.',
			"Contributed to the initial migration of legacy Tableau dashboards into fully native, in-house dashboard solutions by developing the backend services that replaced Tableau's data layer — reducing Tableau dependency, lowering licensing costs, and improving performance and long-term maintainability.",
			'Developed and maintained backend services for key dashboard deliveries — including Gerakan Anak Sehat, Covid-19 Vaksin, Morbiditas Pasien, Kualitas Internet Survey & Monitoring, and the initial release of Monitoring Implementasi SATUSEHAT — working alongside frontend engineers to deliver dashboards used by Ministry of Health stakeholders.',
			"Implemented Datadog monitoring for backend services following the company's observability standards, enabling API performance and error-rate tracking to support proactive issue detection.",
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
		startISO: '2022-03',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#f59e0b',
		glow: '#fbbf24',
		initial: 'MD',
		description:
			'Implemented backend systems alongside Engineering Managers and Senior Software Engineers, translating technical designs and product requirements into reliable and scalable engineering solutions across multiple product lines.',
		achievements: [
			'Contributed to backend API services across multiple core product lines — including Crash Program, Referral Program, Survey Program, Academy Program, Banner Program, Second Inspection Program, and Open Production Issue Tools — using Node.js (Express.js) and Go with MySQL, PostgreSQL, and MongoDB integrations to support diverse business and operational workflows.',
			'Improved system reliability and maintainability by increasing test coverage and implementing unit tests using Mocha, Chai, and Jest for Express-based services, helping reduce regressions across backend services.',
			'Built Kafka producers and consumers leveraging the existing Apache Kafka infrastructure to enable event-driven, asynchronous processing across backend services and improve system decoupling.',
			'Served on weekly on-call rotation, performing bug triage, troubleshooting, and root-cause analysis across backend services to maintain production stability and resolve incidents promptly.',
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
	{
		role: 'Backend Engineer',
		company: 'PT Jojonomic Indonesia',
		period: 'October 2021 — January 2022',
		startISO: '2021-10',
		badge: 'Previous Role' as const,
		location: 'Jakarta, Indonesia',
		color: '#ec4899',
		glow: '#f472b6',
		initial: 'JN',
		description:
			'Implemented backend systems alongside System Analysts based on technical designs and business processes defined by the Product Team, contributing to backend development for banking-related web applications.',
		achievements: [
			'Developed RESTful API services using PHP (Lumen framework) with MySQL for data persistence, supporting core application workflows.',
			'Contributed minor Go-based features during system integration tasks, gaining early hands-on experience with Go that supported later backend development in subsequent roles.',
		],
		tech: ['PHP', 'Lumen', 'MySQL', 'Go'],
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
				borderRadius: RADIUS.full,
				fontSize: FONT.micro,
				fontWeight: 700,
				fontFamily: SANS,
				background: isPresent ? 'var(--accent)' : 'var(--surface-chip)',
				color: isPresent ? 'var(--accent-ink)' : 'var(--ink-secondary)',
				whiteSpace: 'nowrap' as const,
				boxShadow: isPresent ? '0 2px 12px rgba(99,102,241,0.25)' : 'none',
				border: isPresent
					? 'none'
					: `1px solid var(--line-soft)`,
			}}>
			<span
				className={isPresent ? 'present-dot' : ''}
				style={{
					width: 6,
					height: 6,
					borderRadius: '50%',
					background: isPresent ? 'var(--accent-ink)' : 'var(--ink-muted)',
					display: 'inline-block',
				}}
			/>
			{label}
		</span>
	);
}

function Card({ exp }: { exp: Exp }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(cardRef, { once: true, margin: '-60px' });
	const shouldReduceMotion = useReducedMotion();
	const [expanded, setExpanded] = useState(false);

	const collapsible = exp.achievements.length > COLLAPSED_COUNT;
	const visible = expanded
		? exp.achievements
		: exp.achievements.slice(0, COLLAPSED_COUNT);
	const hiddenCount = exp.achievements.length - COLLAPSED_COUNT;

	return (
		<article
			ref={cardRef}
			className='card card-lift'
			aria-label={`${exp.role} at ${exp.company}`}
			style={CARD}>
			{/* ── Illustration header ── */}
			<header
				style={{
					background: 'var(--surface-header)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					padding: '20px 24px',
					minHeight: 120,
					borderBottom: `${BORDER.hard} solid var(--line)`,
				}}>
				<div
					style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
					<div
						aria-hidden='true'
						style={{
							width: 56,
							height: 56,
							borderRadius: RADIUS.md,
							background: 'var(--surface)',
							border: `${BORDER.hard} solid var(--line)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: 'var(--sh-1-hi)',
							flexShrink: 0,
						}}>
						<span
							style={{
								fontSize: FONT.lg,
								fontWeight: 800,
								fontFamily: SANS,
								color: exp.color,
								letterSpacing: '-0.02em',
							}}>
							{exp.initial}
						</span>
					</div>
					<Badge label={exp.badge} />
				</div>

				{/* Period chip — top-right for fast scanning */}
				<time
					dateTime={exp.startISO}
					style={{
						fontSize: FONT.micro,
						fontFamily: MONO,
						color: 'var(--ink-secondary)',
						background: 'var(--surface)',
						border: `${BORDER.soft} solid var(--line)`,
						padding: '5px 10px',
						borderRadius: RADIUS.sm,
						fontVariantNumeric: 'tabular-nums',
						letterSpacing: '0.01em',
						whiteSpace: 'nowrap',
						flexShrink: 0,
					}}>
					{exp.period}
				</time>
			</header>

			{/* ── Content ── */}
			<div style={{ padding: '24px 28px 28px' }}>
				<h3
					style={{
						fontSize: 'clamp(20px, 2.4vw, 24px)',
						fontWeight: 800,
						fontFamily: SANS,
						letterSpacing: '-0.02em',
						lineHeight: 1.2,
						marginBottom: 8,
						color: exp.color,
					}}>
					{exp.role}
				</h3>

				{/* Company + location */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						marginBottom: 4,
						flexWrap: 'wrap',
					}}>
					<MapPin
						size={13}
						style={{ color: exp.color, flexShrink: 0 }}
						aria-hidden='true'
					/>
					<span
						style={{
							fontSize: FONT.sm,
							fontWeight: 700,
							color: 'var(--ink)',
							fontFamily: SANS,
						}}>
						{exp.company}
					</span>
				</div>
				<div
					style={{
						fontSize: FONT.micro,
						color: 'var(--ink-muted)',
						fontFamily: MONO,
						marginBottom: 18,
						letterSpacing: '0.01em',
					}}>
					{exp.location}
				</div>

				{/* Description */}
				<p
					style={{
						color: 'var(--ink-secondary)',
						fontSize: FONT.sm,
						lineHeight: 1.65,
						fontFamily: SANS,
						marginBottom: 22,
					}}>
					{exp.description}
				</p>

				{/* Key achievements */}
				<div style={{ marginBottom: collapsible ? 14 : 22 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 7,
							marginBottom: 12,
						}}>
						<Trophy size={14} style={{ color: exp.glow }} aria-hidden='true' />
						<span
							style={{
								fontSize: FONT.sm,
								fontWeight: 700,
								color: 'var(--ink)',
								fontFamily: SANS,
							}}>
							Key Achievements
						</span>
					</div>
					<ul
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 8,
							listStyle: 'none',
							padding: 0,
							margin: 0,
						}}>
						{visible.map((a, j) => (
							<motion.li
								key={j}
								initial={{ opacity: 0, x: -16 }}
								animate={
									isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }
								}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.4,
									ease: EASE,
									delay: shouldReduceMotion ? 0 : 0.3 + j * 0.1,
								}}
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									gap: 10,
									padding: '10px 14px',
									background: 'var(--surface-subtle)',
									border: `1px solid var(--line-subtle)`,
									borderRadius: RADIUS.sm,
								}}>
								<span
									aria-hidden='true'
									style={{
										width: 7,
										height: 7,
										borderRadius: '50%',
										background: exp.color,
										flexShrink: 0,
										marginTop: 5,
										boxShadow: `0 0 8px ${exp.color}40`,
									}}
								/>
								<span
									style={{
										fontSize: FONT.sm,
										color: 'var(--ink-secondary)',
										lineHeight: 1.55,
										fontFamily: SANS,
									}}>
									{a}
								</span>
							</motion.li>
						))}
					</ul>
				</div>

				{/* Expand toggle */}
				{collapsible && (
					<button
						type='button'
						className='exp-toggle'
						onClick={() => setExpanded((v) => !v)}
						aria-expanded={expanded}
						aria-label={
							expanded
								? 'Show fewer achievements'
								: `Show ${hiddenCount} more achievements`
						}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							padding: '8px 12px',
							marginBottom: 18,
							background: 'transparent',
							border: `${BORDER.soft} solid var(--line)`,
							borderRadius: RADIUS.sm,
							fontSize: FONT.micro,
							fontWeight: 700,
							fontFamily: SANS,
							color: 'var(--ink)',
							letterSpacing: '0.01em',
						}}>
						{expanded ? 'Show less' : `Show ${hiddenCount} more`}
						<ChevronDown
							size={14}
							aria-hidden='true'
							style={{
								transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: shouldReduceMotion ? 'none' : 'transform 0.2s ease',
							}}
						/>
					</button>
				)}

				{/* Tech tags */}
				<div
					role='list'
					aria-label='Technologies used'
					style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
					{exp.tech.map((t, k) => (
						<motion.span
							key={t}
							role='listitem'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
							}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.3,
								ease: EASE,
								delay: shouldReduceMotion ? 0 : 0.5 + k * 0.04,
							}}
							style={{
								padding: '3px 10px',
								background: 'var(--surface-chip)',
								border: `1px solid var(--line-soft)`,
								borderRadius: RADIUS.full,
								fontSize: FONT.micro,
								fontFamily: MONO,
								color: 'var(--ink-secondary)',
							}}>
							{t}
						</motion.span>
					))}
				</div>
			</div>
		</article>
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
			aria-hidden='true'
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
				background: 'var(--surface)',
				border: `${BORDER.hard} solid var(--line)`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: 'var(--sh-2)',
				position: 'relative',
				zIndex: 1,
				flexShrink: 0,
				marginTop: 20,
			}}>
			<span
				style={{
					fontSize: FONT.micro,
					fontWeight: 800,
					fontFamily: SANS,
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
	const lineRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const line = lineRef.current;
			const container = timelineRef.current;
			if (!line || !container) return;

			if (shouldReduceMotion) {
				gsap.set(line, { scaleY: 1, opacity: 1 });
				return;
			}

			gsap.set(line, { scaleY: 0, opacity: 1 });

			gsap.to(line, {
				scaleY: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: container,
					start: 'top 60%',
					end: 'bottom 80%',
					scrub: 0.5,
				},
			});
		},
		{ scope: timelineRef, dependencies: [shouldReduceMotion] },
	);

	return (
		<section id='experience' style={{ background: 'var(--section-a)' }}>
			<div style={CONTAINER}>
				<TextReveal
					parts={[
						{ text: "Where I've " },
						{ text: 'Worked', color: 'var(--accent)' },
					]}
					as='h2'
					style={{ ...H2, marginBottom: 64 }}
				/>

				<div ref={timelineRef} className='exp-timeline'>
					{/* Vertical spine — GSAP scroll-linked draw.
					    Position lives in CSS so it can track the dot column
					    when the grid collapses on mobile. */}
					<div ref={lineRef} className='exp-line' aria-hidden='true' />

					<ol
						aria-label='Work experience, most recent first'
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 48,
							listStyle: 'none',
							padding: 0,
							margin: 0,
						}}>
						{experiences.map((exp, i) => {
							const isLeft = i % 2 === 0;
							const delay = shouldReduceMotion ? 0 : 0.15 + i * 0.1;
							return (
								<li key={i} className='exp-row'>
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

									<div className='exp-slot-mid'>
										<TimelineDot
											exp={exp}
											delay={delay + 0.1}
											shouldReduceMotion={shouldReduceMotion}
										/>
									</div>

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
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}
