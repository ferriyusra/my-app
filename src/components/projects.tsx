'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, Star } from 'lucide-react';
import { projects, type Project } from '@/data/projects';
import TextReveal from '@/components/text-reveal';

gsap.registerPlugin(ScrollTrigger);

const TYPE_BADGE = {
	real: {
		label: 'Production',
		bg: '#dcfce7',
		color: '#16a34a',
		border: '#bbf7d0',
	},
	'case-study': {
		label: 'Case Study',
		bg: '#ede9fe',
		color: '#7c3aed',
		border: '#ddd6fe',
	},
} as const;

const HEADING_STYLE: React.CSSProperties = {
	fontSize: 'clamp(28px, 5vw, 48px)',
	fontWeight: 800,
	fontFamily: "'Inter', sans-serif",
	color: '#0a0a0a',
	letterSpacing: '-0.02em',
	marginBottom: 48,
};

/* ── Generated Placeholder ────────────────────────── */
function CoverPlaceholder({ project }: { project: Project }) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: `linear-gradient(135deg, ${project.color}18 0%, #f0ece8 50%, ${project.color}10 100%)`,
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
					borderRadius: 20,
					background: '#ffffff',
					border: '2px solid #0a0a0a',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '4px 4px 0px #0a0a0a',
				}}>
				<span
					style={{
						fontSize: 24,
						fontWeight: 800,
						fontFamily: "'Inter', sans-serif",
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
							background: '#ffffff',
							border: '1px solid #d4d4d4',
							borderRadius: 100,
							fontSize: 9,
							fontFamily: "'JetBrains Mono', monospace",
							color: '#525252',
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
	const isFeatured = project.featured;

	return (
		<div
			className='project-card card'
			data-cursor='view'
			style={{
				background: '#ffffff',
				border: '2px solid #0a0a0a',
				borderRadius: 20,
				boxShadow: '6px 6px 0px #0a0a0a',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}>
			{/* Cover */}
			<div
				style={{
					position: 'relative',
					height: 200,
					overflow: 'hidden',
					background: '#f0ece8',
				}}>
				{!project.cover || imgError ? (
					<CoverPlaceholder project={project} />
				) : (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={project.cover}
						alt={project.name}
						onError={() => setImgError(true)}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				)}
				{/* Type badge */}
				<div
					style={{
						position: 'absolute',
						top: 12,
						left: 12,
						padding: '4px 12px',
						background: badge.bg,
						border: `1.5px solid ${badge.border}`,
						borderRadius: 100,
						fontSize: 11,
						fontFamily: "'JetBrains Mono', monospace",
						color: badge.color,
						fontWeight: 700,
					}}>
					{badge.label}
				</div>
				{isFeatured && (
					<div
						style={{
							position: 'absolute',
							top: 12,
							right: 12,
							padding: '4px 12px',
							background: '#ffffff',
							border: '1.5px solid #0a0a0a',
							borderRadius: 100,
							fontSize: 11,
							fontFamily: "'JetBrains Mono', monospace",
							color: project.color,
							fontWeight: 700,
							boxShadow: '2px 2px 0px #0a0a0a',
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
							fontSize: 17,
							fontWeight: 800,
							fontFamily: "'Inter', sans-serif",
							color: '#0a0a0a',
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
								color: '#f59e0b',
								fontSize: 12,
								fontFamily: "'JetBrains Mono', monospace",
								flexShrink: 0,
								marginLeft: 12,
							}}>
							<Star size={12} fill='#f59e0b' />
							{project.stars}
						</div>
					)}
				</div>

				<p
					style={{
						color: '#525252',
						fontSize: 13,
						lineHeight: 1.65,
						marginBottom: 16,
						fontFamily: "'Inter', sans-serif",
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
								background: '#f0ece8',
								border: '1.5px solid #0a0a0a',
								borderRadius: 100,
								fontSize: 11,
								fontFamily: "'JetBrains Mono', monospace",
								color: '#0a0a0a',
								boxShadow: '1px 1px 0px #0a0a0a',
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
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									padding: '8px 16px',
									background: '#ffffff',
									border: '1.5px solid #0a0a0a',
									borderRadius: 10,
									fontSize: 13,
									fontWeight: 700,
									color: '#0a0a0a',
									textDecoration: 'none',
									fontFamily: "'Inter', sans-serif",
									boxShadow: '2px 2px 0px #0a0a0a',
									transition: 'all 0.2s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform =
										'translate(-1px,-1px)';
									e.currentTarget.style.boxShadow =
										'3px 3px 0px #0a0a0a';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0,0)';
									e.currentTarget.style.boxShadow =
										'2px 2px 0px #0a0a0a';
								}}>
								<Github size={14} /> Code
							</a>
						)}
						{project.demo && (
							<a
								href={project.demo}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									padding: '8px 16px',
									background: '#6366f1',
									border: '1.5px solid #0a0a0a',
									borderRadius: 10,
									fontSize: 13,
									fontWeight: 700,
									color: '#ffffff',
									textDecoration: 'none',
									fontFamily: "'Inter', sans-serif",
									boxShadow: '2px 2px 0px #0a0a0a',
									transition: 'all 0.2s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform =
										'translate(-1px,-1px)';
									e.currentTarget.style.boxShadow =
										'3px 3px 0px #0a0a0a';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0,0)';
									e.currentTarget.style.boxShadow =
										'2px 2px 0px #0a0a0a';
								}}>
								<ExternalLink size={14} /> Live Demo
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

	// GSAP staggered entrance
	useGSAP(
		() => {
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
				return;

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
			style={{ background: '#faf9f7', padding: '96px 0' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				<TextReveal
					parts={[
						{ text: "Things I've " },
						{ text: 'Built', color: '#6366f1' },
					]}
					as='h2'
					style={HEADING_STYLE}
				/>

				{/* Bento Grid */}
				<div className='bento-grid'>
					{ordered.map((project) => (
						<BentoCard key={project.id} project={project} />
					))}
				</div>
			</div>
		</section>
	);
}
