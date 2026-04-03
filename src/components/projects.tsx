'use client';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Star } from 'lucide-react';
import { projects } from '@/data/projects';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const TYPE_BADGE = {
	real:         { label: 'Production', bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
	'case-study': { label: 'Case Study', bg: '#ede9fe', color: '#7c3aed', border: '#ddd6fe' },
} as const;

const CARD_BASE: React.CSSProperties = {
	background: '#ffffff',
	border: '2px solid #0a0a0a',
	borderRadius: 20,
	boxShadow: '6px 6px 0px #0a0a0a',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
	e.currentTarget.style.transform = 'translate(-2px, -2px)';
	e.currentTarget.style.boxShadow = '8px 8px 0px #0a0a0a';
};
const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
	e.currentTarget.style.transform = 'translate(0, 0)';
	e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a';
};

function StaggerTags({ tags, style: tagStyle, shouldReduceMotion }: { tags: string[]; style: React.CSSProperties; shouldReduceMotion: boolean | null }) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-40px' });
	return (
		<div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
			{tags.map((tech, k) => (
				<motion.span
					key={tech}
					initial={{ opacity: 0, scale: 0.8, y: 6 }}
					animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 6 }}
					transition={{
						duration: shouldReduceMotion ? 0 : 0.3,
						ease: EASE,
						delay: shouldReduceMotion ? 0 : k * 0.05,
					}}
					style={tagStyle}>
					{tech}
				</motion.span>
			))}
		</div>
	);
}

export default function Projects() {
	const shouldReduceMotion = useReducedMotion();
	const featured = projects.filter((p) => p.featured);
	const others = projects.filter((p) => !p.featured);

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	return (
		<section id='projects' style={{ background: '#f0ece8' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 12,
						color: '#a3a3a3',
						letterSpacing: '0.15em',
						textTransform: 'uppercase',
						marginBottom: 16,
					}}></motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.45, 0.08)}
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 48,
						fontFamily: "'Inter', sans-serif",
						color: '#0a0a0a',
						letterSpacing: '-0.02em',
					}}>
					Things I&apos;ve{' '}
					<span style={{ color: '#6366f1' }}>Built</span>
				</motion.h2>

				{/* Featured projects */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
						gap: 24,
						marginBottom: 24,
					}}>
					{featured.map((project, i) => (
						<motion.div
							key={project.name}
							initial={{ opacity: 0, y: 28 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.14 + i * 0.1)}
							className="card" style={CARD_BASE}
							onMouseEnter={hoverIn}
							onMouseLeave={hoverOut}>

							{/* Illustration header — image */}
							<div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f0ece8' }}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={project.cover}
									alt={project.name}
									style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
								/>
								{/* Featured badge */}
								<div style={{
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
								{/* Type badge */}
								<div style={{
									position: 'absolute',
									top: 12,
									left: 12,
									padding: '4px 12px',
									background: TYPE_BADGE[project.type].bg,
									border: `1.5px solid ${TYPE_BADGE[project.type].border}`,
									borderRadius: 100,
									fontSize: 11,
									fontFamily: "'JetBrains Mono', monospace",
									color: TYPE_BADGE[project.type].color,
									fontWeight: 700,
								}}>
									{TYPE_BADGE[project.type].label}
								</div>
							</div>

							{/* Content */}
							<div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
									<h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: '#0a0a0a', letterSpacing: '-0.02em' }}>
										{project.name}
									</h3>
									<div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginLeft: 12 }}>
										<Star size={12} fill='#f59e0b' />
										{project.stars}
									</div>
								</div>
								<p style={{ color: '#525252', fontSize: 14, lineHeight: 1.7, marginBottom: 18, fontFamily: "'Inter', sans-serif" }}>
									{project.description}
								</p>
								<div style={{ marginBottom: 22 }}>
									<StaggerTags
										tags={project.tech}
										shouldReduceMotion={shouldReduceMotion}
										style={{
											padding: '3px 10px',
											background: '#f0ece8',
											border: '1.5px solid #0a0a0a',
											borderRadius: 100,
											fontSize: 11,
											fontFamily: "'JetBrains Mono', monospace",
											color: '#0a0a0a',
											boxShadow: '1px 1px 0px #0a0a0a',
										}}
									/>
								</div>
								{(project.github || project.demo) && (
									<div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
										{project.github && (
											<a href={project.github} style={{
												display: 'inline-flex', alignItems: 'center', gap: 6,
												padding: '8px 16px',
												background: '#ffffff',
												border: '1.5px solid #0a0a0a',
												borderRadius: 10,
												fontSize: 13, fontWeight: 700,
												color: '#0a0a0a',
												textDecoration: 'none',
												fontFamily: "'Inter', sans-serif",
												boxShadow: '2px 2px 0px #0a0a0a',
												transition: 'all 0.2s ease',
											}}
											onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
											onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
												<Github size={14} /> Code
											</a>
										)}
										{project.demo && (
											<a href={project.demo} style={{
												display: 'inline-flex', alignItems: 'center', gap: 6,
												padding: '8px 16px',
												background: project.color,
												border: '1.5px solid #0a0a0a',
												borderRadius: 10,
												fontSize: 13, fontWeight: 700,
												color: '#ffffff',
												textDecoration: 'none',
												fontFamily: "'Inter', sans-serif",
												boxShadow: '2px 2px 0px #0a0a0a',
												transition: 'all 0.2s ease',
											}}
											onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
											onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
												<ExternalLink size={14} /> Live Demo
											</a>
										)}
									</div>
								)}
							</div>
						</motion.div>
					))}
				</div>

				{/* Other projects */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
						gap: 20,
					}}>
					{others.map((project, i) => (
						<motion.div
							key={project.name}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.45, 0.1 + i * 0.09)}
							className="card" style={CARD_BASE}
							onMouseEnter={hoverIn}
							onMouseLeave={hoverOut}>

							{/* Illustration header */}
							<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 120, padding: '20px 24px' }}>
								<div style={{
									width: 64, height: 64, borderRadius: 16,
									background: '#ffffff', border: '2px solid #0a0a0a',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									boxShadow: '3px 3px 0px #0a0a0a', flexShrink: 0,
								}}>
									<span style={{ fontSize: 16, fontWeight: 800, color: project.color, fontFamily: "'Inter', sans-serif" }}>
										{project.initial}
									</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
										<Star size={12} fill='#f59e0b' /> {project.stars}
									</div>
									{(project.github || project.demo) && (
										<div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
											{project.github && (
												<a href={project.github} style={{ width: 32, height: 32, borderRadius: 8, background: '#ffffff', border: '1.5px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', textDecoration: 'none', boxShadow: '2px 2px 0px #0a0a0a', transition: 'all 0.2s ease' }}
													onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
													onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
													<Github size={14} />
												</a>
											)}
											{project.demo && (
												<a href={project.demo} style={{ width: 32, height: 32, borderRadius: 8, background: project.color, border: '1.5px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', boxShadow: '2px 2px 0px #0a0a0a', transition: 'all 0.2s ease' }}
													onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
													onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
													<ExternalLink size={14} />
												</a>
											)}
										</div>
									)}
								</div>
							</div>

							{/* Content */}
							<div style={{ padding: '20px 24px 24px' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
									<h3 style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
										{project.name}
									</h3>
									<span style={{
										padding: '2px 9px',
										background: TYPE_BADGE[project.type].bg,
										border: `1px solid ${TYPE_BADGE[project.type].border}`,
										borderRadius: 100,
										fontSize: 10,
										fontFamily: "'JetBrains Mono', monospace",
										color: TYPE_BADGE[project.type].color,
										fontWeight: 700,
										flexShrink: 0,
									}}>
										{TYPE_BADGE[project.type].label}
									</span>
								</div>
								<p style={{ color: '#525252', fontSize: 13, lineHeight: 1.65, marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
									{project.description}
								</p>
								<StaggerTags
									tags={project.tech.slice(0, 3)}
									shouldReduceMotion={shouldReduceMotion}
									style={{
										padding: '2px 9px',
										background: '#f0ece8',
										border: '1.5px solid #0a0a0a',
										borderRadius: 100,
										fontSize: 11,
										fontFamily: "'JetBrains Mono', monospace",
										color: '#0a0a0a',
										boxShadow: '1px 1px 0px #0a0a0a',
									}}
								/>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
