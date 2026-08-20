'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, Star } from 'lucide-react';
import { projects, type Project } from '@/data/projects';
import TextReveal from '@/components/text-reveal';
import {
	BORDER,
	CARD,
	CONTAINER,
	FONT,
	H2,
	MONO,
	RADIUS,
	SANS,
} from '@/lib/theme';

gsap.registerPlugin(ScrollTrigger);

const TYPE_BADGE = {
	real: {
		label: 'Production',
		bg: '#dcfce7',
		color: '#166534',
		border: '#86efac',
	},
	'case-study': {
		label: 'Case Study',
		bg: '#ede9fe',
		color: '#5b21b6',
		border: '#c4b5fd',
	},
} as const;

const LINK_BASE: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 6,
	padding: '8px 16px',
	border: `${BORDER.soft} solid var(--line)`,
	borderRadius: RADIUS.sm,
	fontSize: FONT.sm,
	fontWeight: 700,
	textDecoration: 'none',
	fontFamily: SANS,
	boxShadow: 'var(--sh-1)',
	transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

function liftOn(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translate(-1px,-1px)';
	e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
}
function liftOff(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translate(0,0)';
	e.currentTarget.style.boxShadow = 'var(--sh-1)';
}

/* ── Generated Placeholder ────────────────────────── */
function CoverPlaceholder({ project }: { project: Project }) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: `linear-gradient(135deg, ${project.color}18 0%, var(--surface-header) 50%, ${project.color}10 100%)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 14,
			}}>
			<div
				style={{
					width: 72,
					height: 72,
					borderRadius: RADIUS.lg,
					background: 'var(--surface)',
					border: `${BORDER.hard} solid var(--line)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: 'var(--sh-2)',
				}}>
				<span
					style={{
						fontSize: 24,
						fontWeight: 800,
						fontFamily: SANS,
						color: project.color,
						letterSpacing: '-0.02em',
					}}>
					{project.initial}
				</span>
			</div>
			<div
				style={{
					display: 'flex',
					gap: 6,
					flexWrap: 'wrap',
					justifyContent: 'center',
					padding: '0 20px',
				}}>
				{project.tech.slice(0, 3).map((t) => (
					<span
						key={t}
						style={{
							padding: '2px 8px',
							background: 'var(--surface)',
							border: `1px solid var(--line-soft)`,
							borderRadius: RADIUS.full,
							fontSize: FONT.micro,
							fontFamily: MONO,
							color: 'var(--ink-secondary)',
						}}>
						{t}
					</span>
				))}
			</div>
		</div>
	);
}

/* ── Bento Card ───────────────────────────────────── */
function BentoCard({ project }: { project: Project }) {
	const badge = TYPE_BADGE[project.type];
	const [imgError, setImgError] = useState(false);

	return (
		<div
			className='project-card card'
			data-cursor='view'
			style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
			{/* Cover */}
			<div
				style={{
					position: 'relative',
					height: 200,
					overflow: 'hidden',
					background: 'var(--surface-header)',
				}}>
				{!project.cover || imgError ? (
					<CoverPlaceholder project={project} />
				) : (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={project.cover}
						alt={`${project.name} preview`}
						loading='lazy'
						onError={() => setImgError(true)}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				)}

				<div
					style={{
						position: 'absolute',
						top: 12,
						left: 12,
						padding: '4px 12px',
						background: badge.bg,
						border: `${BORDER.soft} solid ${badge.border}`,
						borderRadius: RADIUS.full,
						fontSize: FONT.micro,
						fontFamily: MONO,
						color: badge.color,
						fontWeight: 700,
					}}>
					{badge.label}
				</div>

				{project.featured && (
					<div
						style={{
							position: 'absolute',
							top: 12,
							right: 12,
							padding: '4px 12px',
							background: 'var(--surface)',
							border: `${BORDER.soft} solid var(--line)`,
							borderRadius: RADIUS.full,
							fontSize: FONT.micro,
							fontFamily: MONO,
							color: project.color,
							fontWeight: 700,
							boxShadow: 'var(--sh-1)',
						}}>
						featured
					</div>
				)}
			</div>

			{/* Content */}
			<div
				style={{
					padding: '20px 24px 24px',
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						marginBottom: 8,
					}}>
					<h3
						style={{
							fontSize: FONT.lg,
							fontWeight: 800,
							fontFamily: SANS,
							color: 'var(--ink)',
							letterSpacing: '-0.02em',
							margin: 0,
						}}>
						{project.name}
					</h3>
					{project.stars > 0 && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 4,
								color: 'var(--warn)',
								fontSize: FONT.micro,
								fontFamily: MONO,
								flexShrink: 0,
								marginLeft: 12,
							}}>
							<Star size={12} fill='currentColor' aria-hidden='true' />
							<span aria-label={`${project.stars} GitHub stars`}>
								{project.stars}
							</span>
						</div>
					)}
				</div>

				<p
					style={{
						color: 'var(--ink-secondary)',
						fontSize: FONT.sm,
						lineHeight: 1.65,
						marginBottom: 16,
						fontFamily: SANS,
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
					}}>
					{project.description}
				</p>

				{/* Tech tags */}
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 6,
						marginBottom: 18,
					}}>
					{project.tech.slice(0, 4).map((t) => (
						<span
							key={t}
							style={{
								padding: '3px 10px',
								background: 'var(--surface-header)',
								border: `${BORDER.soft} solid var(--line)`,
								borderRadius: RADIUS.full,
								fontSize: FONT.micro,
								fontFamily: MONO,
								color: 'var(--ink)',
								boxShadow: '1px 1px 0 var(--shadow-ink)',
							}}>
							{t}
						</span>
					))}
				</div>

				{/* Links */}
				{(project.github || project.demo) && (
					<div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
						{project.github && (
							<a
								href={project.github}
								target='_blank'
								rel='noopener noreferrer'
								aria-label={`${project.name} source code on GitHub`}
								style={{
									...LINK_BASE,
									background: 'var(--surface)',
									color: 'var(--ink)',
								}}
								onMouseEnter={liftOn}
								onMouseLeave={liftOff}>
								<Github size={14} aria-hidden='true' /> Code
							</a>
						)}
						{project.demo && (
							<a
								href={project.demo}
								target='_blank'
								rel='noopener noreferrer'
								aria-label={`${project.name} live demo`}
								style={{
									...LINK_BASE,
									background: 'var(--accent)',
									color: 'var(--accent-ink)',
								}}
								onMouseEnter={liftOn}
								onMouseLeave={liftOff}>
								<ExternalLink size={14} aria-hidden='true' /> Live Demo
							</a>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

/* ── Projects Section — Bento Grid ────────────────── */
export default function Projects() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			gsap.from('.project-card', {
				y: 60,
				opacity: 0,
				duration: 0.7,
				stagger: 0.1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top 70%',
					toggleActions: 'play none none none',
				},
			});
		},
		{ scope: sectionRef },
	);

	const ordered = [
		...projects.filter((p) => p.featured),
		...projects.filter((p) => !p.featured),
	];

	return (
		<section
			id='projects'
			ref={sectionRef}
			style={{ background: 'var(--section-b)' }}>
			<div style={CONTAINER}>
				<TextReveal
					parts={[{ text: "Things I've " }, { text: 'Built', color: 'var(--accent)' }]}
					as='h2'
					style={{ ...H2, marginBottom: 48 }}
				/>

				<div className='bento-grid'>
					{ordered.map((project) => (
						<BentoCard key={project.id} project={project} />
					))}
				</div>
			</div>
		</section>
	);
}
