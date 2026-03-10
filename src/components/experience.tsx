'use client';

const experiences = [
	{
		role: 'Senior Full Stack Engineer',
		company: 'TechCorp Inc.',
		period: '2022 — Present',
		location: 'Tangerang, Indonesia (Hybrid / Remote)',
		color: '#10b981',
		description:
			'Lead engineer on the core platform team. Architected and shipped the new multi-tenant SaaS infrastructure serving 10k+ customers.',
		achievements: [
			'Reduced API response times by 60% through query optimization and caching',
			'Led migration from monolith to microservices, reducing deploy time from 45min to 4min',
			'Mentored 4 junior engineers, 3 of whom were promoted within 18 months',
		],
		tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
	},
	{
		role: 'Full Stack Engineer',
		company: 'StartupXYZ',
		period: '2020 — 2022',
		location: 'New York, NY',
		color: '#7c3aed',
		description:
			'Early engineer (employee #8) at a Series A fintech startup. Built core product features from 0 to 1.',
		achievements: [
			'Built real-time transaction processing system handling $2M/day',
			'Implemented PCI-DSS compliant payment flows with Stripe Connect',
			'Grew engineering team from 2 to 12 engineers as technical hiring lead',
		],
		tech: ['React', 'Python', 'Django', 'PostgreSQL', 'Stripe', 'GCP'],
	},
	{
		role: 'Frontend Engineer',
		company: 'Digital Agency Co.',
		period: '2019 — 2020',
		location: 'Austin, TX',
		color: '#3b82f6',
		description:
			'Built performant marketing sites and web apps for Fortune 500 clients.',
		achievements: [
			'Delivered 15+ client projects on time and budget',
			'Improved average Lighthouse score across projects from 62 to 94',
			'Created component library used across all agency projects',
		],
		tech: ['React', 'Vue.js', 'WordPress', 'GSAP', 'Figma'],
	},
];

export default function Experience() {
	return (
		<section id='experience' style={{ background: '#09090b' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				<div
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 12,
						color: '#f59e0b',
						letterSpacing: '0.15em',
						textTransform: 'uppercase',
						marginBottom: 16,
					}}>
					// 04. experience
				</div>
				<h2
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 48,
						fontFamily: "'Inter', sans-serif",
						color: '#fafafa',
						letterSpacing: '-0.02em',
					}}>
					Where I&apos;ve{' '}
					<span
						style={{
							background: 'linear-gradient(135deg, #10b981, #3b82f6)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}>
						Worked
					</span>
				</h2>

				<div style={{ position: 'relative' }}>
					<div
						style={{
							position: 'absolute',
							left: 20,
							top: 8,
							bottom: 8,
							width: 2,
							background:
								'linear-gradient(to bottom, #10b981, #7c3aed, #3b82f6)',
							opacity: 0.4,
						}}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 32,
							paddingLeft: 56,
						}}>
						{experiences.map((exp, i) => (
							<div key={i} style={{ position: 'relative' }}>
								<div
									style={{
										position: 'absolute',
										left: -44,
										top: 24,
										width: 12,
										height: 12,
										borderRadius: '50%',
										background: exp.color,
										boxShadow: `0 0 0 3px ${exp.color}25`,
									}}
								/>
								<div
									style={{
										background: '#111113',
										border: '1px solid rgba(255,255,255,0.07)',
										borderRadius: 16,
										padding: 28,
										boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
										transition: 'all 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-2px)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
										e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
										e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.05)';
									}}>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											justifyContent: 'space-between',
											gap: 8,
											marginBottom: 4,
										}}>
										<div>
											<h3
												style={{
													fontSize: 18,
													fontWeight: 700,
													fontFamily: "'Inter', sans-serif",
													marginBottom: 4,
													color: '#fafafa',
												}}>
												{exp.role}
											</h3>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: 8,
												}}>
												<span
													style={{
														color: exp.color,
														fontWeight: 600,
														fontSize: 14,
														fontFamily: "'Inter', sans-serif",
													}}>
													{exp.company}
												</span>
												<span style={{ color: '#27272a' }}>·</span>
												<span
													style={{
														color: '#52525b',
														fontSize: 13,
														fontFamily: "'Inter', sans-serif",
													}}>
													{exp.location}
												</span>
											</div>
										</div>
										<span
											style={{
												padding: '4px 12px',
												background: `${exp.color}15`,
												border: `1px solid ${exp.color}30`,
												borderRadius: 100,
												fontSize: 12,
												fontFamily: "'JetBrains Mono', monospace",
												color: exp.color,
												height: 'fit-content',
											}}>
											{exp.period}
										</span>
									</div>
									<p
										style={{
											color: '#a1a1aa',
											fontSize: 14,
											lineHeight: 1.7,
											margin: '16px 0',
											fontFamily: "'Inter', sans-serif",
										}}>
										{exp.description}
									</p>
									<ul
										style={{
											margin: '0 0 16px',
											paddingLeft: 20,
											display: 'flex',
											flexDirection: 'column',
											gap: 6,
										}}>
										{exp.achievements.map((a, j) => (
											<li
												key={j}
												style={{
													color: '#a1a1aa',
													fontSize: 13,
													lineHeight: 1.6,
													fontFamily: "'Inter', sans-serif",
												}}>
												<span style={{ color: exp.color, fontWeight: 600 }}>
													{a.split(' ')[0]}
												</span>{' '}
												{a.split(' ').slice(1).join(' ')}
											</li>
										))}
									</ul>
									<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
										{exp.tech.map((t) => (
											<span
												key={t}
												style={{
													padding: '3px 10px',
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
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
