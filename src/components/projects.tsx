'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const projects = [
	{
		name: 'ShipFast SaaS',
		description:
			'A production-ready SaaS boilerplate with auth, payments, and multi-tenancy. Used by 500+ developers to ship faster.',
		image:
			'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
		tech: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Tailwind'],
		github: 'https://github.com',
		demo: 'https://example.com',
		featured: true,
		color: '#10b981',
		stars: 423,
	},
	{
		name: 'DevMetrics Dashboard',
		description:
			'Real-time engineering metrics platform. Tracks deploy frequency, lead time, MTTR, and change failure rate for dev teams.',
		image:
			'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
		tech: ['React', 'Node.js', 'ClickHouse', 'WebSockets', 'Redis'],
		github: 'https://github.com',
		demo: 'https://example.com',
		featured: true,
		color: '#7c3aed',
		stars: 187,
	},
	{
		name: 'AICodeReview',
		description:
			'GitHub App that performs automated code reviews using Claude AI. Detects bugs, security issues, and suggests improvements.',
		image:
			'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
		tech: ['TypeScript', 'Claude API', 'GitHub API', 'Octokit'],
		github: 'https://github.com',
		demo: 'https://example.com',
		featured: false,
		color: '#3b82f6',
		stars: 342,
	},
	{
		name: 'Nomad Finance',
		description:
			'Multi-currency expense tracker for digital nomads. Supports 150+ currencies with real-time conversion and tax reports.',
		image:
			'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
		tech: ['React Native', 'Expo', 'Supabase', 'Edge Functions'],
		github: 'https://github.com',
		demo: 'https://example.com',
		featured: false,
		color: '#f59e0b',
		stars: 98,
	},
];

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
		<section id='projects' style={{ background: '#0f0f11' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 12,
						color: '#10b981',
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
						color: '#fafafa',
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
							style={{
								background: '#111113',
								border: '1px solid rgba(255,255,255,0.07)',
								borderRadius: 16,
								overflow: 'hidden',
								borderTop: `3px solid ${project.color}`,
								boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
								transition:
									'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-4px)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
								e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4)`;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
								e.currentTarget.style.boxShadow =
									'0 0 0 1px rgba(255,255,255,0.05)';
							}}>
							<div
								style={{
									position: 'relative',
									overflow: 'hidden',
									height: 200,
								}}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={project.image}
									alt={project.name}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										transition: 'transform 0.3s ease',
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.transform = 'scale(1.05)')
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.transform = 'scale(1)')
									}
								/>
								<div
									style={{
										position: 'absolute',
										top: 12,
										right: 12,
										padding: '4px 10px',
										background: 'rgba(0,0,0,0.7)',
										border: `1px solid ${project.color}50`,
										borderRadius: 100,
										fontSize: 11,
										fontFamily: "'JetBrains Mono', monospace",
										color: project.color,
									}}>
									featured
								</div>
							</div>
							<div style={{ padding: 24 }}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
										marginBottom: 10,
									}}>
									<h3
										style={{
											fontSize: 18,
											fontWeight: 700,
											fontFamily: "'Inter', sans-serif",
											color: '#fafafa',
										}}>
										{project.name}
									</h3>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 4,
											color: '#f59e0b',
											fontSize: 12,
											fontFamily: "'JetBrains Mono', monospace",
										}}>
										<Star size={12} fill='#f59e0b' />
										{project.stars}
									</div>
								</div>
								<p
									style={{
										color: '#a1a1aa',
										fontSize: 14,
										lineHeight: 1.7,
										marginBottom: 16,
										fontFamily: "'Inter', sans-serif",
									}}>
									{project.description}
								</p>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 6,
										marginBottom: 20,
									}}>
									{project.tech.map((t) => (
										<span
											key={t}
											style={{
												padding: '3px 10px',
												background: `${project.color}15`,
												border: `1px solid ${project.color}30`,
												borderRadius: 100,
												fontSize: 11,
												fontFamily: "'JetBrains Mono', monospace",
												color: project.color,
											}}>
											{t}
										</span>
									))}
								</div>
								<div style={{ display: 'flex', gap: 16 }}>
									<a
										href={project.github}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 6,
											color: '#71717a',
											textDecoration: 'none',
											fontSize: 13,
											transition: 'color 0.2s ease',
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.color = '#fafafa')
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = '#71717a')
										}>
										<Github size={14} /> Code
									</a>
									<a
										href={project.demo}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 6,
											color: project.color,
											textDecoration: 'none',
											fontSize: 13,
											fontWeight: 600,
										}}>
										<ExternalLink size={14} /> Live Demo
									</a>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Other projects */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
						gap: 20,
					}}>
					{others.map((project, i) => (
						<motion.div
							key={project.name}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.45, 0.1 + i * 0.09)}
							style={{
								padding: 24,
								background: '#111113',
								border: '1px solid rgba(255,255,255,0.07)',
								borderRadius: 16,
								borderLeft: `3px solid ${project.color}`,
								boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
								transition:
									'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
								e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
								e.currentTarget.style.boxShadow =
									'0 0 0 1px rgba(255,255,255,0.05)';
							}}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'flex-start',
									marginBottom: 10,
								}}>
								<h3
									style={{
										fontSize: 16,
										fontWeight: 700,
										fontFamily: "'Inter', sans-serif",
										color: '#fafafa',
									}}>
									{project.name}
								</h3>
								<div style={{ display: 'flex', gap: 12 }}>
									<a
										href={project.github}
										style={{
											color: '#71717a',
											textDecoration: 'none',
											transition: 'color 0.2s ease',
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.color = '#fafafa')
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.color = '#71717a')
										}>
										<Github size={16} />
									</a>
									<a
										href={project.demo}
										style={{ color: project.color, textDecoration: 'none' }}>
										<ExternalLink size={16} />
									</a>
								</div>
							</div>
							<p
								style={{
									color: '#a1a1aa',
									fontSize: 13,
									lineHeight: 1.6,
									marginBottom: 16,
									fontFamily: "'Inter', sans-serif",
								}}>
								{project.description}
							</p>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
								{project.tech.slice(0, 3).map((t) => (
									<span
										key={t}
										style={{
											padding: '2px 8px',
											background: 'rgba(255,255,255,0.06)',
											borderRadius: 100,
											fontSize: 11,
											fontFamily: "'JetBrains Mono', monospace",
											color: '#71717a',
										}}>
										{t}
									</span>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
