'use client';

import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '@/components/text-reveal';
import {
	CONTAINER,
	EASE,
	EYEBROW,
	FONT,
	H2,
	RADIUS,
	SANS,
} from '@/lib/theme';

gsap.registerPlugin(ScrollTrigger);

const COLLAPSED_COUNT = 2;

/* The five entries used to carry a per-company colour (indigo, emerald, blue,
   amber, pink — Tailwind's defaults). Five unrelated hues in one column read
   as decoration. Hierarchy here comes from type and rules instead. */
const experiences = [
	{
		role: 'Backend Engineer',
		company: 'PT. Teknologi Pamadya Analitika (Meditap)',
		period: 'Jul 2025 — Present',
		years: '2025 —',
		startISO: '2025-07',
		current: true,
		location: 'Jakarta, Indonesia',
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
		period: 'Jan 2024 — Mar 2025',
		years: '2024 — 2025',
		startISO: '2024-01',
		current: false,
		location: 'Jakarta, Indonesia',
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
		period: 'Jul 2023 — Dec 2023',
		years: '2023',
		startISO: '2023-07',
		current: false,
		location: 'Jakarta, Indonesia',
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
		period: 'Mar 2022 — Feb 2023',
		years: '2022 — 2023',
		startISO: '2022-03',
		current: false,
		location: 'Jakarta, Indonesia',
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
		period: 'Oct 2021 — Jan 2022',
		years: '2021 — 2022',
		startISO: '2021-10',
		current: false,
		location: 'Jakarta, Indonesia',
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

function Entry({ exp, index }: { exp: Exp; index: number }) {
	const ref = useRef<HTMLLIElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-60px' });
	const shouldReduceMotion = useReducedMotion();
	const [expanded, setExpanded] = useState(false);

	const collapsible = exp.achievements.length > COLLAPSED_COUNT;
	const visible = expanded
		? exp.achievements
		: exp.achievements.slice(0, COLLAPSED_COUNT);
	const hiddenCount = exp.achievements.length - COLLAPSED_COUNT;

	return (
		<motion.li
			ref={ref}
			className='exp-row'
			initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={{
				duration: shouldReduceMotion ? 0 : 0.5,
				ease: EASE,
				delay: shouldReduceMotion ? 0 : Math.min(index, 2) * 0.06,
			}}
			style={{ paddingBottom: 64 }}>
			{/* ── Gutter: period, sticky while the entry is on screen ── */}
			<div className='exp-gutter' style={{ position: 'relative' }}>
				<span className='exp-marker' aria-hidden='true' />
				<time
					dateTime={exp.startISO}
					style={{
						display: 'block',
						fontFamily: SANS,
						fontSize: FONT.sm,
						fontWeight: 500,
						color: 'var(--ink)',
						fontVariantNumeric: 'tabular-nums',
					}}>
					{exp.years}
				</time>
				<span
					style={{
						display: 'block',
						marginTop: 4,
						fontFamily: SANS,
						fontSize: FONT.micro,
						color: 'var(--ink-muted)',
					}}>
					{exp.period}
				</span>
				{exp.current && (
					<span
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							marginTop: 10,
							padding: '3px 10px',
							borderRadius: RADIUS.full,
							background: 'var(--accent-soft)',
							border: `1px solid var(--accent-ring)`,
							fontFamily: SANS,
							fontSize: FONT.micro,
							fontWeight: 600,
							color: 'var(--accent)',
						}}>
						<span
							className='present-dot'
							aria-hidden='true'
							style={{
								width: 5,
								height: 5,
								borderRadius: '50%',
								background: 'var(--accent)',
							}}
						/>
						Current
					</span>
				)}
			</div>

			{/* ── Entry body ── */}
			<div className='exp-body'>
				<h3
					style={{
						fontSize: 'clamp(20px, 2.2vw, 26px)',
						fontWeight: 500,
						fontFamily: SANS,
						lineHeight: 1.25,
						margin: '0 0 4px',
						color: 'var(--ink)',
					}}>
					{exp.role}
				</h3>

				<p
					style={{
						margin: '0 0 18px',
						fontSize: FONT.base,
						color: 'var(--ink-secondary)',
						fontFamily: SANS,
					}}>
					{exp.company}
					<span style={{ color: 'var(--ink-muted)' }}> · {exp.location}</span>
				</p>

				<p
					style={{
						color: 'var(--ink-secondary)',
						fontSize: FONT.base,
						lineHeight: 1.75,
						fontFamily: SANS,
						margin: '0 0 22px',
						maxWidth: '68ch',
					}}>
					{exp.description}
				</p>

				<ul
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
						listStyle: 'none',
						padding: 0,
						margin: '0 0 16px',
						maxWidth: '70ch',
					}}>
					{visible.map((a, j) => (
						<li
							key={j}
							style={{
								display: 'flex',
								alignItems: 'flex-start',
								gap: 12,
							}}>
							<span
								aria-hidden='true'
								style={{
									width: 14,
									height: 1,
									background: 'var(--line-strong)',
									flexShrink: 0,
									marginTop: 12,
									opacity: 0.45,
								}}
							/>
							<span
								style={{
									fontSize: FONT.sm,
									color: 'var(--ink-secondary)',
									lineHeight: 1.7,
									fontFamily: SANS,
								}}>
								{a}
							</span>
						</li>
					))}
				</ul>

				{collapsible && (
					<button
						type='button'
						className='exp-toggle'
						onClick={() => setExpanded((v) => !v)}
						aria-expanded={expanded}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							padding: '6px 0',
							marginBottom: 18,
							background: 'transparent',
							border: 'none',
							borderBottom: `1px solid var(--line-soft)`,
							fontSize: FONT.sm,
							fontWeight: 500,
							fontFamily: SANS,
							color: 'var(--accent)',
						}}>
						{expanded ? 'Show less' : `${hiddenCount} more`}
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

				<p
					style={{
						margin: 0,
						fontFamily: SANS,
						fontSize: FONT.micro,
						color: 'var(--ink-muted)',
						lineHeight: 1.9,
						maxWidth: '70ch',
					}}>
					{exp.tech.join('  ·  ')}
				</p>
			</div>
		</motion.li>
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
				gsap.set(line, { scaleY: 1 });
				return;
			}

			gsap.set(line, { scaleY: 0 });
			gsap.to(line, {
				scaleY: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: container,
					start: 'top 70%',
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
				<p style={{ ...EYEBROW, marginBottom: 14 }}>Experience</p>
				<TextReveal
					parts={[
						{ text: "Where I've " },
						{ text: 'Worked', color: 'var(--accent)' },
					]}
					as='h2'
					style={{ ...H2, marginBottom: 64 }}
				/>

				<div ref={timelineRef} className='exp-timeline'>
					{/* Scroll-drawn spine — the one signature motion left on the page. */}
					<div ref={lineRef} className='exp-line' aria-hidden='true' />

					<ol
						aria-label='Work experience, most recent first'
						style={{ listStyle: 'none', padding: 0, margin: 0 }}>
						{experiences.map((exp, i) => (
							<Entry key={exp.company} exp={exp} index={i} />
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
