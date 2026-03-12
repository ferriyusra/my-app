'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
	Mail,
	Github,
	Linkedin,
	Twitter,
	Send,
	ArrowUpRight,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const navLinks = [
	{ label: 'Home', href: '#' },
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Contact', href: '#contact' },
];

const socials = [
	{ icon: Github, href: 'https://github.com/ferriyusra', label: 'GitHub' },
	{
		icon: Linkedin,
		href: 'https://linkedin.com/in/ferriyusra',
		label: 'LinkedIn',
	},
	{ icon: Mail, href: 'mailto:feriyusra1616@gmail.com', label: 'Email' },
];

export default function Footer() {
	const [email, setEmail] = useState('');
	const [subscribed, setSubscribed] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		setSubscribed(true);
		setEmail('');
		setTimeout(() => setSubscribed(false), 3000);
	};

	return (
		<footer style={{ background: '#f0ece8', position: 'relative' }}>
			{/* ── Newsletter CTA strip ── */}
			<div style={{ padding: '0 24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-40px' }}
						transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: EASE }}
						style={{
							background: '#ffffff',
							border: '2px solid #0a0a0a',
							borderRadius: 20,
							boxShadow: '6px 6px 0px #0a0a0a',
							padding: '28px 36px',
							display: 'flex',
							alignItems: 'center',
							gap: 24,
							flexWrap: 'wrap',
							marginBottom: -1 /* visually bridge into dark footer */,
						}}>
						{/* Icon */}
						<div
							style={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								background: '#6366f1',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
								border: '2px solid #0a0a0a',
							}}>
							<Mail size={26} color='#ffffff' />
						</div>

						{/* Text */}
						<div style={{ flex: '1 1 180px' }}>
							<div
								style={{
									fontFamily: "'Inter', sans-serif",
									fontWeight: 800,
									fontSize: 18,
									color: '#0a0a0a',
									letterSpacing: '-0.01em',
								}}>
								Subscribe to my newsletter
							</div>
							<div
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: 13,
									color: '#525252',
									marginTop: 3,
								}}>
								Get updates on new projects and articles.
							</div>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubscribe}
							style={{
								display: 'flex',
								gap: 10,
								flex: '1 1 320px',
								maxWidth: 440,
							}}>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Enter your email address'
								style={{
									flex: 1,
									padding: '11px 16px',
									border: '1.5px solid #d4d4d4',
									borderRadius: 10,
									fontSize: 14,
									fontFamily: "'Inter', sans-serif",
									color: '#0a0a0a',
									outline: 'none',
									background: '#ffffff',
								}}
								onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
								onBlur={(e) => (e.currentTarget.style.borderColor = '#d4d4d4')}
							/>
							<button
								type='submit'
								style={{
									padding: '11px 22px',
									background: subscribed ? '#10b981' : '#0a0a0a',
									color: '#ffffff',
									border: '2px solid #0a0a0a',
									borderRadius: 10,
									fontSize: 14,
									fontWeight: 700,
									cursor: 'pointer',
									fontFamily: "'Inter', sans-serif",
									whiteSpace: 'nowrap',
									transition: 'background 0.2s ease',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}>
								{subscribed ? (
									'Subscribed!'
								) : (
									<>
										<Send size={14} /> Subscribe
									</>
								)}
							</button>
						</form>
					</motion.div>
				</div>
			</div>

			{/* ── Dark footer body ── */}
			<div
				style={{
					background: '#0a0a0a',
					marginTop: 48,
					paddingTop: 64,
					paddingBottom: 40,
				}}>
				<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
					{/* 3-column grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
							gap: 48,
							marginBottom: 56,
						}}>
						{/* Col 1: Brand */}
						<div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									marginBottom: 16,
								}}>
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: 10,
										background: '#6366f1',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<span
										style={{
											color: '#fff',
											fontSize: 14,
											fontWeight: 800,
											fontFamily: "'Inter', sans-serif",
										}}>
										FY
									</span>
								</div>
								<span
									style={{
										color: '#ffffff',
										fontFamily: "'Inter', sans-serif",
										fontWeight: 700,
										fontSize: 16,
										letterSpacing: '-0.01em',
									}}>
									Ferri Yusra
								</span>
							</div>
							<p
								style={{
									color: '#71717a',
									fontSize: 14,
									fontFamily: "'Inter', sans-serif",
									lineHeight: 1.7,
									marginBottom: 24,
									maxWidth: 240,
								}}>
								Backend engineer building scalable systems in Go & Node.js.
								Based in Tangerang, Indonesia
							</p>
							{/* Social icons */}
							<div style={{ display: 'flex', gap: 10 }}>
								{socials.map(({ icon: Icon, href, label }) => (
									<a
										key={label}
										href={href}
										aria-label={label}
										style={{
											width: 36,
											height: 36,
											borderRadius: '50%',
											border: '1.5px solid #3f3f46',
											background: 'transparent',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#71717a',
											textDecoration: 'none',
											transition:
												'border-color 0.2s ease, color 0.2s ease, background 0.2s ease',
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = '#6366f1';
											e.currentTarget.style.color = '#6366f1';
											e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = '#3f3f46';
											e.currentTarget.style.color = '#71717a';
											e.currentTarget.style.background = 'transparent';
										}}>
										<Icon size={15} />
									</a>
								))}
							</div>
						</div>

						{/* Col 2: Navigation */}
						<div>
							<div
								style={{
									color: '#ffffff',
									fontFamily: "'Inter', sans-serif",
									fontWeight: 700,
									fontSize: 14,
									marginBottom: 20,
									letterSpacing: '-0.01em',
								}}>
								Navigation
							</div>
							<ul
								style={{
									listStyle: 'none',
									padding: 0,
									margin: 0,
									display: 'flex',
									flexDirection: 'column',
									gap: 12,
								}}>
								{navLinks.map(({ label, href }) => (
									<li key={label}>
										<a
											href={href}
											style={{
												color: '#71717a',
												textDecoration: 'none',
												fontSize: 14,
												fontFamily: "'Inter', sans-serif",
												transition: 'color 0.2s ease',
												display: 'inline-flex',
												alignItems: 'center',
												gap: 4,
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.color = '#ffffff';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.color = '#71717a';
											}}>
											{label}
										</a>
									</li>
								))}
							</ul>
						</div>

						{/* Col 3: Contact */}
						<div>
							<div
								style={{
									color: '#ffffff',
									fontFamily: "'Inter', sans-serif",
									fontWeight: 700,
									fontSize: 14,
									marginBottom: 20,
									letterSpacing: '-0.01em',
								}}>
								Contact us
							</div>
							<div
								style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
								{[
									{
										icon: Mail,
										text: 'feriyusra1616@gmail.com',
										href: 'mailto:feriyusra1616@gmail.com',
									},
									{
										icon: Linkedin,
										text: 'linkedin.com/in/ferriyusra',
										href: 'https://linkedin.com/in/ferriyusra',
									},
									{
										icon: Github,
										text: 'github.com/ferriyusra',
										href: 'https://github.com/ferriyusra',
									},
								].map(({ icon: Icon, text, href }) => (
									<a
										key={text}
										href={href}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 12,
											textDecoration: 'none',
											color: '#71717a',
											fontSize: 14,
											fontFamily: "'Inter', sans-serif",
											transition: 'color 0.2s ease',
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = '#ffffff';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = '#71717a';
										}}>
										<div
											style={{
												width: 32,
												height: 32,
												borderRadius: '50%',
												border: '1.5px solid #3f3f46',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}>
											<Icon size={14} />
										</div>
										{text}
									</a>
								))}
							</div>

							{/* Hire me CTA */}
							<a
								href='#contact'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
									marginTop: 28,
									padding: '14px 24px',
									background: '#6366f1',
									color: '#ffffff',
									border: '2px solid rgba(255,255,255,0.3)',
									borderRadius: 14,
									textDecoration: 'none',
									fontSize: 15,
									fontWeight: 700,
									fontFamily: "'Inter', sans-serif",
									boxShadow: '3px 3px 0px rgba(255,255,255,0.15)',
									transition: 'all 0.2s ease',
									width: '100%',
									boxSizing: 'border-box' as const,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translate(-1px, -1px)';
									e.currentTarget.style.boxShadow =
										'4px 4px 0px rgba(255,255,255,0.15)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0, 0)';
									e.currentTarget.style.boxShadow =
										'3px 3px 0px rgba(255,255,255,0.15)';
								}}>
								<Send size={15} /> Hire Me
							</a>
						</div>
					</div>

					{/* Divider + copyright */}
					<div
						style={{
							borderTop: '1px solid #1f1f1f',
							paddingTop: 24,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							gap: 12,
						}}>
						<p
							style={{
								color: '#3f3f46',
								fontSize: 13,
								fontFamily: "'JetBrains Mono', monospace",
								margin: 0,
							}}>
							&copy; {new Date().getFullYear()} Ferri Yusra. All rights
							reserved.
						</p>
						<p
							style={{
								color: '#3f3f46',
								fontSize: 13,
								fontFamily: "'JetBrains Mono', monospace",
								margin: 0,
							}}>
							{'</>'} built with Claude Code and Skill.sh :D
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
