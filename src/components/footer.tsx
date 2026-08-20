'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '@/data/profile';
import { BORDER, FONT, MONO, RADIUS, SANS } from '@/lib/theme';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
	{ label: 'Home', href: '#hero' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'About', href: '#about' },
	{ label: 'Contact', href: '#contact' },
];

const socials = [
	{ icon: Github, href: profile.github, label: 'GitHub', external: true },
	{ icon: Linkedin, href: profile.linkedin, label: 'LinkedIn', external: true },
	{
		icon: Mail,
		href: `mailto:${profile.email}`,
		label: 'Email',
		external: false,
	},
];

const contactRows = [
	{ icon: Mail, text: profile.email, href: `mailto:${profile.email}`, external: false },
	{
		icon: Linkedin,
		text: profile.linkedin.replace('https://', ''),
		href: profile.linkedin,
		external: true,
	},
	{
		icon: Github,
		text: profile.github.replace('https://', ''),
		href: profile.github,
		external: true,
	},
];

const COL_HEADING: React.CSSProperties = {
	color: 'var(--on-dark)',
	fontFamily: SANS,
	fontWeight: 700,
	fontSize: FONT.sm,
	marginBottom: 20,
	letterSpacing: '-0.01em',
};

/* The footer body is a fixed dark slab in both themes, so it uses the
   dedicated --on-dark tokens rather than --ink. */
const DARK_LINK: React.CSSProperties = {
	color: 'var(--on-dark-muted)',
	textDecoration: 'none',
	fontSize: FONT.sm,
	fontFamily: SANS,
	transition: 'color 0.2s ease',
};

export default function Footer() {
	const shouldReduceMotion = useReducedMotion();
	const footerBodyRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (shouldReduceMotion) return;

			gsap.from('.footer-col', {
				y: 40,
				opacity: 0,
				duration: 0.6,
				stagger: 0.15,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: footerBodyRef.current,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
			});
		},
		{ scope: footerBodyRef, dependencies: [shouldReduceMotion] },
	);


	return (
		<footer style={{ background: 'var(--section-a)', position: 'relative' }}>
			{/* ── Dark footer body ── */}
			<div
				ref={footerBodyRef}
				style={{
					background: 'var(--footer-bg)',
					paddingTop: 64,
					paddingBottom: 40,
				}}>
				<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
							gap: 48,
							marginBottom: 56,
						}}>
						{/* Col 1: Brand */}
						<div className='footer-col'>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									marginBottom: 16,
								}}>
								<div
									aria-hidden='true'
									style={{
										width: 36,
										height: 36,
										borderRadius: RADIUS.sm,
										background: 'var(--accent)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<span
										style={{
											color: 'var(--accent-ink)',
											fontSize: FONT.sm,
											fontWeight: 800,
											fontFamily: SANS,
										}}>
										{profile.initials}
									</span>
								</div>
								<span
									style={{
										color: 'var(--on-dark)',
										fontFamily: SANS,
										fontWeight: 700,
										fontSize: FONT.base,
										letterSpacing: '-0.01em',
									}}>
									{profile.name}
								</span>
							</div>
							<p
								style={{
									color: 'var(--on-dark-muted)',
									fontSize: FONT.sm,
									fontFamily: SANS,
									lineHeight: 1.7,
									marginBottom: 24,
									maxWidth: 240,
								}}>
								Backend engineer building scalable systems in Go &amp; Node.js.
								Based in {profile.location}.
							</p>
							<div style={{ display: 'flex', gap: 10 }}>
								{socials.map(({ icon: Icon, href, label, external }) => (
									<a
										key={label}
										href={href}
										aria-label={label}
										{...(external
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {})}
										style={{
											width: 36,
											height: 36,
											borderRadius: '50%',
											border: `${BORDER.soft} solid var(--on-dark-line)`,
											background: 'transparent',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'var(--on-dark-muted)',
											textDecoration: 'none',
											transition:
												'border-color 0.2s ease, color 0.2s ease, background 0.2s ease',
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = 'var(--accent)';
											e.currentTarget.style.color = 'var(--accent)';
											e.currentTarget.style.background = 'var(--accent-soft)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = 'var(--on-dark-line)';
											e.currentTarget.style.color = 'var(--on-dark-muted)';
											e.currentTarget.style.background = 'transparent';
										}}>
										<Icon size={15} aria-hidden='true' />
									</a>
								))}
							</div>
						</div>

						{/* Col 2: Navigation */}
						<nav className='footer-col' aria-label='Footer'>
							<div style={COL_HEADING}>Navigation</div>
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
												...DARK_LINK,
												display: 'inline-flex',
												alignItems: 'center',
												gap: 4,
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.color = 'var(--on-dark)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.color = 'var(--on-dark-muted)';
											}}>
											{label}
										</a>
									</li>
								))}
							</ul>
						</nav>

						{/* Col 3: Contact */}
						<div className='footer-col'>
							<div style={COL_HEADING}>Contact</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
								{contactRows.map(({ icon: Icon, text, href, external }) => (
									<a
										key={text}
										href={href}
										{...(external
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {})}
										style={{
											...DARK_LINK,
											display: 'flex',
											alignItems: 'center',
											gap: 12,
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = 'var(--on-dark)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = 'var(--on-dark-muted)';
										}}>
										<span
											aria-hidden='true'
											style={{
												width: 32,
												height: 32,
												borderRadius: '50%',
												border: `${BORDER.soft} solid var(--on-dark-line)`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}>
											<Icon size={14} />
										</span>
										{text}
									</a>
								))}
							</div>

							<a
								href='#contact'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
									marginTop: 28,
									padding: '14px 24px',
									background: 'var(--accent)',
									color: 'var(--accent-ink)',
									border: `${BORDER.hard} solid rgba(255,255,255,0.3)`,
									borderRadius: RADIUS.md,
									textDecoration: 'none',
									fontSize: FONT.base,
									fontWeight: 700,
									fontFamily: SANS,
									boxShadow: '3px 3px 0 rgba(255,255,255,0.15)',
									transition: 'transform 0.2s ease, box-shadow 0.2s ease',
									width: '100%',
									boxSizing: 'border-box' as const,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translate(-1px, -1px)';
									e.currentTarget.style.boxShadow =
										'4px 4px 0 rgba(255,255,255,0.15)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0, 0)';
									e.currentTarget.style.boxShadow =
										'3px 3px 0 rgba(255,255,255,0.15)';
								}}>
								<Send size={15} aria-hidden='true' /> Hire Me
							</a>
						</div>
					</div>

					{/* Divider + copyright */}
					<div
						style={{
							borderTop: `1px solid var(--on-dark-line)`,
							paddingTop: 24,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							gap: 12,
						}}>
						<p
							style={{
								color: 'var(--on-dark-muted)',
								fontSize: FONT.sm,
								fontFamily: MONO,
								margin: 0,
							}}>
							&copy; {new Date().getFullYear()} {profile.name}. All rights
							reserved.
						</p>
						<p
							style={{
								color: 'var(--on-dark-muted)',
								fontSize: FONT.sm,
								fontFamily: MONO,
								margin: 0,
							}}>
							Built with Next.js, and a lot of Claude Code.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
