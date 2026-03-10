'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5, ease: EASE, delay },
});

// Floating decoration component — floats up/down continuously
function FloatingIcon({
	children,
	style,
	floatDuration,
	floatDelay,
}: {
	children: React.ReactNode;
	style: React.CSSProperties;
	floatDuration: number;
	floatDelay: number;
}) {
	return (
		<motion.div
			style={{
				position: 'absolute',
				width: 56,
				height: 56,
				background: '#111113',
				border: '1px solid rgba(255,255,255,0.08)',
				borderRadius: 12,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 22,
				color: '#a1a1aa',
				...style,
			}}
			animate={{ y: [0, -8, 0] }}
			transition={{
				duration: floatDuration,
				repeat: Infinity,
				ease: 'easeInOut',
				delay: floatDelay,
			}}>
			{children}
		</motion.div>
	);
}

export default function Hero() {
	return (
		<section
			id='hero'
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				paddingTop: 80,
				position: 'relative',
				overflow: 'hidden',
				background: '#09090b',
			}}>
			{/* Radial teal glow behind hero */}
			<div
				style={{
					position: 'absolute',
					top: '20%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					width: 600,
					height: 600,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
					pointerEvents: 'none',
					zIndex: 0,
				}}
			/>

			{/* Floating decorations — each with different duration & delay */}
			<FloatingIcon
				style={{ top: 120, left: 40, transform: 'rotate(-8deg)' }}
				floatDuration={3}
				floatDelay={0}>
				{'</>'}
			</FloatingIcon>
			<FloatingIcon
				style={{
					top: 200,
					right: 60,
					transform: 'rotate(6deg)',
					fontSize: 18,
				}}
				floatDuration={4}
				floatDelay={0.7}>
				{'{ }'}
			</FloatingIcon>
			<FloatingIcon
				style={{ bottom: 200, left: 80, transform: 'rotate(5deg)' }}
				floatDuration={3.5}
				floatDelay={0.3}>
				🗄️
			</FloatingIcon>
			<FloatingIcon
				style={{
					bottom: 160,
					right: 100,
					transform: 'rotate(-6deg)',
					fontSize: 16,
				}}
				floatDuration={4.5}
				floatDelay={1.1}>
				{'_>'}
			</FloatingIcon>

			{/* All content wrapped in relative z-1 div */}
			<div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
				<div
					style={{
						maxWidth: 1200,
						margin: '0 auto',
						padding: '0 24px',
						width: '100%',
					}}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 64,
							alignItems: 'center',
						}}
						className='grid-cols-1 md:grid-cols-2'>
						{/* Left: Text */}
						<div>
							{/* Badge */}
							<motion.div
								{...fadeUp(0)}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									padding: '6px 14px',
									background: '#7c3aed',
									borderRadius: 100,
									marginBottom: 32,
								}}>
								<span
									style={{
										fontSize: 11,
										color: '#ffffff',
										fontFamily: "'JetBrains Mono', monospace",
										fontWeight: 600,
										letterSpacing: '0.08em',
										textTransform: 'uppercase',
									}}>
									✦ Full Stack Engineer
								</span>
							</motion.div>

							{/* Heading */}
							<motion.h1
								{...fadeUp(0.1)}
								style={{
									fontSize: 'clamp(40px, 6vw, 72px)',
									fontWeight: 800,
									lineHeight: 1.05,
									marginBottom: 24,
									fontFamily: "'Inter', sans-serif",
									color: '#fafafa',
									letterSpacing: '-0.02em',
								}}>
								Building{' '}
								<span
									style={{
										background:
											'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}>
									Fast & Scalable
								</span>{' '}
								Web Apps.
							</motion.h1>

							{/* Tagline */}
							<motion.p
								{...fadeUp(0.2)}
								style={{
									fontSize: 'clamp(16px, 2vw, 18px)',
									color: '#a1a1aa',
									lineHeight: 1.7,
									maxWidth: 480,
									marginBottom: 40,
									fontFamily: "'Inter', sans-serif",
								}}>
								Hi, I&apos;m{' '}
								<strong style={{ color: '#fafafa' }}>Ferri Yusra</strong>. I build
								production-grade applications with React, Node.js, and Golang.
								Fast, clean, and people{' '}
								<span style={{ color: '#10b981', fontWeight: 600 }}>
									love to use
								</span>
								.
							</motion.p>

							{/* CTA buttons */}
							<motion.div
								{...fadeUp(0.3)}
								style={{
									display: 'flex',
									gap: 12,
									flexWrap: 'wrap',
									marginBottom: 48,
								}}>
								<a
									href='#projects'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										padding: '13px 28px',
										background: '#10b981',
										borderRadius: 8,
										color: 'white',
										fontSize: 15,
										fontWeight: 700,
										textDecoration: 'none',
										fontFamily: "'Inter', sans-serif",
										transition: 'background 0.2s ease, transform 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = '#059669';
										e.currentTarget.style.transform = 'translateY(-2px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = '#10b981';
										e.currentTarget.style.transform = 'translateY(0)';
									}}>
									View Projects <ArrowRight size={16} />
								</a>
								<a
									href='#contact'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										padding: '13px 28px',
										background: 'transparent',
										border: '1.5px solid rgba(255,255,255,0.12)',
										borderRadius: 8,
										color: '#fafafa',
										fontSize: 15,
										fontWeight: 700,
										textDecoration: 'none',
										fontFamily: "'Inter', sans-serif",
										transition: 'all 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
										e.currentTarget.style.transform = 'translateY(-2px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
										e.currentTarget.style.transform = 'translateY(0)';
									}}>
									Contact Me <Mail size={16} />
								</a>
								<a
									href='/resume.pdf'
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										padding: '13px 28px',
										background: 'transparent',
										border: '1.5px solid rgba(255,255,255,0.12)',
										borderRadius: 8,
										color: '#a1a1aa',
										fontSize: 15,
										fontWeight: 600,
										textDecoration: 'none',
										fontFamily: "'Inter', sans-serif",
										transition: 'all 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.color = '#fafafa';
										e.currentTarget.style.borderColor = '#10b981';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.color = '#a1a1aa';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
									}}>
									Resume <Download size={16} />
								</a>
							</motion.div>

							{/* Social + status */}
							<motion.div
								{...fadeUp(0.4)}
								style={{
									display: 'flex',
									gap: 16,
									alignItems: 'center',
									marginBottom: 32,
								}}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										padding: '6px 12px',
										background: 'rgba(16,185,129,0.08)',
										border: '1px solid rgba(16,185,129,0.25)',
										borderRadius: 100,
									}}>
									{/* "Open to work" pulsing dot */}
									<motion.span
										style={{
											width: 7,
											height: 7,
											borderRadius: '50%',
											background: '#10b981',
											display: 'inline-block',
										}}
										animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
										transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
									/>
									<span
										style={{
											fontSize: 12,
											color: '#10b981',
											fontFamily: "'JetBrains Mono', monospace",
											fontWeight: 600,
										}}>
										Open to work
									</span>
								</div>
								{[
									{ href: 'https://github.com', icon: Github },
									{ href: 'https://linkedin.com', icon: Linkedin },
									{ href: 'mailto:ferri@example.com', icon: Mail },
								].map(({ href, icon: Icon }) => (
									<a
										key={href}
										href={href}
										style={{
											width: 38,
											height: 38,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											background: '#18181b',
											border: '1px solid rgba(255,255,255,0.08)',
											borderRadius: 8,
											color: '#71717a',
											textDecoration: 'none',
											transition: 'all 0.2s ease',
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = '#10b981';
											e.currentTarget.style.color = '#10b981';
											e.currentTarget.style.transform = 'translateY(-2px)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
											e.currentTarget.style.color = '#71717a';
											e.currentTarget.style.transform = 'translateY(0)';
										}}>
										<Icon size={17} />
									</a>
								))}
							</motion.div>
						</div>

						{/* Right: Code block + floating metric */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
							style={{
								position: 'relative',
								display: 'flex',
								justifyContent: 'center',
							}}
							className='hidden md:flex'>
							{/* Terminal card */}
							<div
								style={{
									width: '100%',
									maxWidth: 440,
									background: '#080810',
									borderRadius: 16,
									overflow: 'hidden',
									boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
									border: '1px solid rgba(255,255,255,0.08)',
								}}>
								{/* Terminal titlebar */}
								<div
									style={{
										padding: '12px 16px',
										borderBottom: '1px solid rgba(255,255,255,0.06)',
										display: 'flex',
										alignItems: 'center',
										gap: 6,
									}}>
									<span
										style={{
											width: 12,
											height: 12,
											borderRadius: '50%',
											background: '#ef4444',
											display: 'inline-block',
										}}
									/>
									<span
										style={{
											width: 12,
											height: 12,
											borderRadius: '50%',
											background: '#f59e0b',
											display: 'inline-block',
										}}
									/>
									<span
										style={{
											width: 12,
											height: 12,
											borderRadius: '50%',
											background: '#10b981',
											display: 'inline-block',
										}}
									/>
									<span
										style={{
											fontFamily: "'JetBrains Mono', monospace",
											fontSize: 12,
											color: '#52525b',
											marginLeft: 8,
										}}>
										portfolio.ts
									</span>
								</div>
								{/* Code content */}
								<div
									style={{
										padding: '24px',
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: 13,
										lineHeight: 1.8,
									}}>
									<div>
										<span style={{ color: '#52525b' }}>
											Ferri Yusra — Full Stack Engineer
										</span>
									</div>
									<div style={{ marginTop: 8 }}>
										<span style={{ color: '#7c3aed' }}>const</span>
										<span style={{ color: '#e2e8f0' }}> stack </span>
										<span style={{ color: '#52525b' }}>=</span>
										<span style={{ color: '#e2e8f0' }}> [</span>
									</div>
									{['React', 'Next.js', 'Node.js', 'Golang', 'PostgreSQL'].map(
										(s, i) => (
											<motion.div
												key={s}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{
													duration: 0.4,
													ease: EASE,
													delay: 0.5 + i * 0.05,
												}}
												style={{ paddingLeft: 16 }}>
												<span style={{ color: '#10b981' }}>&quot;{s}&quot;</span>
												<span style={{ color: '#52525b' }}>,</span>
											</motion.div>
										),
									)}
									<div>
										<span style={{ color: '#e2e8f0' }}>];</span>
									</div>
									<div style={{ marginTop: 12 }}>
										<span style={{ color: '#52525b' }}>// Ready to ship 🚀</span>
									</div>
									<div style={{ marginTop: 4 }}>
										<span style={{ color: '#3b82f6' }}>export default</span>
										<span style={{ color: '#e2e8f0' }}> FerriYusra;</span>
									</div>
								</div>
							</div>

							{/* Floating metric badge — spring pop */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.6 }}
								style={{
									position: 'absolute',
									bottom: -16,
									right: -16,
									background: '#111113',
									border: '1px solid rgba(255,255,255,0.08)',
									borderRadius: 12,
									padding: '14px 18px',
									boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
									display: 'flex',
									alignItems: 'center',
									gap: 12,
								}}>
								<div
									style={{
										width: 36,
										height: 36,
										background: 'rgba(16,185,129,0.12)',
										borderRadius: 8,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 18,
									}}>
									🚀
								</div>
								<div>
									<div
										style={{
											fontSize: 20,
											fontWeight: 800,
											color: '#fafafa',
											fontFamily: "'Inter', sans-serif",
											lineHeight: 1,
										}}>
										30+
									</div>
									<div
										style={{
											fontSize: 11,
											color: '#a1a1aa',
											fontFamily: "'Inter', sans-serif",
											marginTop: 2,
										}}>
										Projects Shipped
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
