'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Zap, Globe, Briefcase, Layers } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const TechGlobe = dynamic(() => import('./tech-globe'), { ssr: false });

type Category =
	| 'All'
	| 'Frontend'
	| 'Backend'
	| 'Database'
	| 'Tools'
	| 'AI Tools';

const categories: Category[] = [
	'All',
	'Frontend',
	'Backend',
	'Database',
	'Tools',
	'AI Tools',
];

const skills = [
	// Frontend
	{
		name: 'JavaScript',
		category: 'Frontend' as Category,
		color: '#eab308',
		bg: '#eab30818',
		icon: 'https://cdn.simpleicons.org/javascript/eab308',
	},
	{
		name: 'TypeScript',
		category: 'Frontend' as Category,
		color: '#3178C6',
		bg: '#3178C618',
		icon: 'https://cdn.simpleicons.org/typescript/3178C6',
	},
	{
		name: 'React',
		category: 'Frontend' as Category,
		color: '#0ea5e9',
		bg: '#0ea5e918',
		icon: 'https://cdn.simpleicons.org/react/0ea5e9',
	},
	{
		name: 'Next.js',
		category: 'Frontend' as Category,
		color: '#fafafa',
		bg: '#fafafa10',
		icon: 'https://cdn.simpleicons.org/nextdotjs/fafafa',
	},
	{
		name: 'TailwindCSS',
		category: 'Frontend' as Category,
		color: '#06B6D4',
		bg: '#06B6D418',
		icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
	},
	// Backend
	{
		name: 'Node.js',
		category: 'Backend' as Category,
		color: '#16a34a',
		bg: '#16a34a18',
		icon: 'https://cdn.simpleicons.org/nodedotjs/16a34a',
	},
	{
		name: 'Express.js',
		category: 'Backend' as Category,
		color: '#a1a1aa',
		bg: '#a1a1aa10',
		icon: 'https://cdn.simpleicons.org/express/a1a1aa',
	},
	{
		name: 'NestJS',
		category: 'Backend' as Category,
		color: '#E0234E',
		bg: '#E0234E18',
		icon: 'https://cdn.simpleicons.org/nestjs/E0234E',
	},
	{
		name: 'Golang',
		category: 'Backend' as Category,
		color: '#00ADD8',
		bg: '#00ADD818',
		icon: 'https://cdn.simpleicons.org/go/00ADD8',
	},
	// Database
	{
		name: 'PostgreSQL',
		category: 'Database' as Category,
		color: '#4169E1',
		bg: '#4169E118',
		icon: 'https://cdn.simpleicons.org/postgresql/4169E1',
	},
	{
		name: 'MySQL',
		category: 'Database' as Category,
		color: '#4479A1',
		bg: '#4479A118',
		icon: 'https://cdn.simpleicons.org/mysql/4479A1',
	},
	{
		name: 'MongoDB',
		category: 'Database' as Category,
		color: '#47A248',
		bg: '#47A24818',
		icon: 'https://cdn.simpleicons.org/mongodb/47A248',
	},
	{
		name: 'Redis',
		category: 'Database' as Category,
		color: '#DC382D',
		bg: '#DC382D18',
		icon: 'https://cdn.simpleicons.org/redis/DC382D',
	},
	// Tools
	{
		name: 'Docker',
		category: 'Tools' as Category,
		color: '#2496ED',
		bg: '#2496ED18',
		icon: 'https://cdn.simpleicons.org/docker/2496ED',
	},
	{
		name: 'Git',
		category: 'Tools' as Category,
		color: '#F05032',
		bg: '#F0503218',
		icon: 'https://cdn.simpleicons.org/git/F05032',
	},
	{
		name: 'AWS',
		category: 'Tools' as Category,
		color: '#FF9900',
		bg: '#FF990018',
		icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
	},
	{
		name: 'GCP',
		category: 'Tools' as Category,
		color: '#4285F4',
		bg: '#4285F418',
		icon: 'https://cdn.simpleicons.org/googlecloud/4285F4',
	},
	{
		name: 'Google Pub/Sub',
		category: 'Tools' as Category,
		color: '#FBBC04',
		bg: '#FBBC0418',
		icon: 'https://cdn.simpleicons.org/googlepubsub/FBBC04',
	},
	// AI Tools
	{
		name: 'Claude',
		category: 'AI Tools' as Category,
		color: '#D97706',
		bg: '#D9770618',
		icon: 'https://cdn.simpleicons.org/anthropic/D97706',
	},
	{
		name: 'ChatGPT',
		category: 'AI Tools' as Category,
		color: '#10a37f',
		bg: '#10a37f18',
		icon: '/icons/openai.svg',
	},
	{
		name: 'GitHub Copilot',
		category: 'AI Tools' as Category,
		color: '#a1a1aa',
		bg: '#a1a1aa10',
		icon: 'https://cdn.simpleicons.org/githubcopilot/a1a1aa',
	},
	{
		name: 'Cursor',
		category: 'AI Tools' as Category,
		color: '#7c3aed',
		bg: '#7c3aed18',
		icon: 'https://cdn.simpleicons.org/cursor/7c3aed',
	},
	{
		name: 'Hugging Face',
		category: 'AI Tools' as Category,
		color: '#FFD21E',
		bg: '#FFD21E18',
		icon: 'https://cdn.simpleicons.org/huggingface/FFD21E',
	},
	{
		name: 'LangChain',
		category: 'AI Tools' as Category,
		color: '#a1a1aa',
		bg: '#a1a1aa10',
		icon: 'https://cdn.simpleicons.org/langchain/a1a1aa',
	},
];

// Icons shown inside the bento "Tech Stack" card
const stackIcons = [
	{ name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/fafafa' },
	{ name: 'React', icon: 'https://cdn.simpleicons.org/react/0ea5e9' },
	{ name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
	{ name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/16a34a' },
	{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/00ADD8' },
	{ name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
	{ name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
	{ name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D' },
];

const CARD_BASE: React.CSSProperties = {
	background: '#111113',
	border: '1px solid rgba(255,255,255,0.07)',
	borderRadius: 20,
	padding: 28,
	boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
};

const ICON_BOX: React.CSSProperties = {
	width: 44,
	height: 44,
	borderRadius: 12,
	background: 'rgba(255,255,255,0.05)',
	border: '1px solid rgba(255,255,255,0.08)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginBottom: 20,
};

export default function Skills() {
	const [active, setActive] = useState<Category>('All');
	const shouldReduceMotion = useReducedMotion();

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	return (
		<section id='skills' style={{ background: '#09090b' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				{/* Section label */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 11,
						color: '#7c3aed',
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						marginBottom: 12,
						fontWeight: 600,
					}}></motion.div>
				<motion.h2
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.45, 0.08)}
					style={{
						fontSize: 'clamp(28px, 5vw, 48px)',
						fontWeight: 800,
						marginBottom: 12,
						fontFamily: "'Inter', sans-serif",
						color: '#fafafa',
						letterSpacing: '-0.02em',
					}}>
					Tech{' '}
					<span style={{ color: '#6366f1' }}>Stack</span>
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.4, 0.16)}
					style={{
						color: '#a1a1aa',
						fontSize: 16,
						marginBottom: 56,
						maxWidth: 480,
						lineHeight: 1.6,
						fontFamily: "'Inter', sans-serif",
					}}>
					Tools and technologies I use to ship production-grade software.
				</motion.p>

				{/* ── Bento grid ───────────────────────────────────── */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gridTemplateRows: 'auto auto',
						gap: 16,
						marginBottom: 64,
					}}>
					{/* Card 1 — Clean Code First (row 1, col 1) */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.22)}
						style={{ ...CARD_BASE, gridColumn: '1', gridRow: '1' }}>
						<div style={ICON_BOX}>
							<Code2
								size={20}
								style={{ color: '#10b981' }}
								aria-hidden='true'
							/>
						</div>
						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: '#fafafa',
								fontFamily: "'Inter', sans-serif",
								marginBottom: 10,
								letterSpacing: '-0.01em',
							}}>
							Clean Code First
						</h3>
						<p
							style={{
								fontSize: 14,
								color: '#a1a1aa',
								lineHeight: 1.65,
								fontFamily: "'Inter', sans-serif",
								margin: 0,
							}}>
							Writing maintainable, scalable code with engineering excellence at
							every layer of the stack.
						</p>
					</motion.div>

					{/* Card 2 — Modern Tech Stack (row 1–2, col 2) — tall center card */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.3)}
						style={{ ...CARD_BASE, gridColumn: '2', gridRow: '1 / 3' }}>
						<div style={ICON_BOX}>
							<Layers
								size={20}
								style={{ color: '#3b82f6' }}
								aria-hidden='true'
							/>
						</div>
						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: '#fafafa',
								fontFamily: "'Inter', sans-serif",
								marginBottom: 10,
								letterSpacing: '-0.01em',
							}}>
							Modern Tech Stack
						</h3>
						<p
							style={{
								fontSize: 14,
								color: '#a1a1aa',
								lineHeight: 1.65,
								fontFamily: "'Inter', sans-serif",
								marginBottom: 28,
							}}>
							Technologies and tools I use to build innovative solutions
						</p>
						{/* Icon grid */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(4, 1fr)',
								gap: 12,
							}}>
							{stackIcons.map((s) => (
								<div
									key={s.name}
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 8,
									}}>
									<div
										style={{
											width: 48,
											height: 48,
											borderRadius: 12,
											background: 'rgba(255,255,255,0.05)',
											border: '1px solid rgba(255,255,255,0.08)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={s.icon} alt={s.name} width={24} height={24} />
									</div>
									<span
										style={{
											fontSize: 10,
											color: '#71717a',
											fontFamily: "'JetBrains Mono', monospace",
											textAlign: 'center',
										}}>
										{s.name}
									</span>
								</div>
							))}
						</div>
					</motion.div>

					{/* Card 3 — Full Stack (row 1, col 3) */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.38)}
						style={{ ...CARD_BASE, gridColumn: '3', gridRow: '1' }}>
						<div style={ICON_BOX}>
							<Zap size={20} style={{ color: '#f59e0b' }} aria-hidden='true' />
						</div>
						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: '#fafafa',
								fontFamily: "'Inter', sans-serif",
								marginBottom: 10,
								letterSpacing: '-0.01em',
							}}>
							Full Stack Expertise
						</h3>
						<p
							style={{
								fontSize: 14,
								color: '#a1a1aa',
								lineHeight: 1.65,
								fontFamily: "'Inter', sans-serif",
								margin: 0,
							}}>
							From React frontends to Golang backends — end-to-end ownership
							across every layer.
						</p>
					</motion.div>

					{/* Card 4 — Remote Ready (row 2, col 1) */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.46)}
						style={{ ...CARD_BASE, gridColumn: '1', gridRow: '2' }}>
						<div style={ICON_BOX}>
							<Globe
								size={20}
								style={{ color: '#0ea5e9' }}
								aria-hidden='true'
							/>
						</div>
						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: '#fafafa',
								fontFamily: "'Inter', sans-serif",
								marginBottom: 10,
								letterSpacing: '-0.01em',
							}}>
							Remote Ready
						</h3>
						<p
							style={{
								fontSize: 14,
								color: '#a1a1aa',
								lineHeight: 1.65,
								fontFamily: "'Inter', sans-serif",
								margin: 0,
							}}>
							Available across time zones for seamless worldwide collaboration,
							hybrid or remote.
						</p>
					</motion.div>

					{/* Card 5 — Ready to Build (row 2, col 3) — animated rainbow border */}
					<motion.div
						className='rainbow-border'
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.54)}
						style={{ gridColumn: '3', gridRow: '2' }}>
						<div
							style={{
								...CARD_BASE,
								border: 'none',
								boxShadow: 'none',
								borderRadius: 20,
								height: '100%',
							}}>
							<div
								style={{
									...ICON_BOX,
									border: '1px solid rgba(255,255,255,0.10)',
								}}>
								<Briefcase
									size={20}
									style={{ color: '#a5b4fc' }}
									aria-hidden='true'
								/>
							</div>
							<h3
								style={{
									fontSize: 18,
									fontWeight: 700,
									color: '#fafafa',
									fontFamily: "'Inter', sans-serif",
									marginBottom: 10,
									letterSpacing: '-0.01em',
								}}>
								Ready to Build
							</h3>
							<p
								style={{
									fontSize: 14,
									color: '#a1a1aa',
									lineHeight: 1.65,
									fontFamily: "'Inter', sans-serif",
									margin: 0,
								}}>
								Open to new opportunities. Let&apos;s create something amazing
								together.
							</p>
						</div>
					</motion.div>
				</div>

				{/* ── Tech Globe ───────────────────────────────────── */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 11,
						color: '#52525b',
						letterSpacing: '0.15em',
						textTransform: 'uppercase',
						marginBottom: 20,
						fontWeight: 600,
					}}>
					{'all technologies'}
				</motion.div>

				{/* Hint */}
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.4, 0.1)}
					style={{
						fontSize: 12,
						color: '#3f3f46',
						fontFamily: "'JetBrains Mono', monospace",
						marginBottom: 20,
					}}>
					drag to rotate · filter by category
				</motion.p>

				{/* Category filter tabs */}
				<div
					style={{
						display: 'flex',
						gap: 6,
						flexWrap: 'wrap',
						marginBottom: 0,
						padding: '6px',
						background: 'rgba(255,255,255,0.03)',
						border: '1px solid rgba(255,255,255,0.07)',
						borderRadius: 14,
						width: 'fit-content',
					}}>
					{categories.map((cat) => {
						const isActive = active === cat;
						return (
							<button
								key={cat}
								onClick={() => setActive(cat)}
								style={{
									padding: '8px 18px',
									borderRadius: 10,
									border: 'none',
									cursor: 'pointer',
									fontSize: 13,
									fontWeight: 600,
									fontFamily: "'Inter', sans-serif",
									transition:
										'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
									background: isActive
										? 'linear-gradient(135deg, #6366f1, #3b82f6)'
										: 'transparent',
									color: isActive ? '#ffffff' : '#71717a',
									boxShadow: isActive
										? '0 4px 15px rgba(99,102,241,0.25)'
										: 'none',
								}}
								onMouseEnter={(e) => {
									if (!isActive) e.currentTarget.style.color = '#fafafa';
								}}
								onMouseLeave={(e) => {
									if (!isActive) e.currentTarget.style.color = '#71717a';
								}}>
								{cat}
							</button>
						);
					})}
				</div>

				{/* 3-D Globe */}
				<TechGlobe skills={skills} activeCategory={active} />

				{/* Stats bar */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
						gap: 1,
						background: 'rgba(255,255,255,0.06)',
						border: '1px solid rgba(255,255,255,0.07)',
						borderRadius: 16,
						overflow: 'hidden',
					}}>
					{[
						{
							label: 'Frontend',
							count: skills.filter((s) => s.category === 'Frontend').length,
							color: '#10b981',
						},
						{
							label: 'Backend',
							count: skills.filter((s) => s.category === 'Backend').length,
							color: '#7c3aed',
						},
						{
							label: 'Database',
							count: skills.filter((s) => s.category === 'Database').length,
							color: '#3b82f6',
						},
						{
							label: 'Tools',
							count: skills.filter((s) => s.category === 'Tools').length,
							color: '#f59e0b',
						},
						{
							label: 'AI Tools',
							count: skills.filter((s) => s.category === 'AI Tools').length,
							color: '#D97706',
						},
					].map(({ label, count, color }, i) => (
						<div
							key={label}
							style={{
								padding: '20px 20px',
								background: '#111113',
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
								borderRight:
									i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
							}}>
							<div
								style={{
									fontSize: 26,
									fontWeight: 800,
									fontFamily: "'Inter', sans-serif",
									color,
								}}>
								{count}
							</div>
							<div
								style={{
									fontSize: 11,
									color: '#52525b',
									fontFamily: "'JetBrains Mono', monospace",
								}}>
								{label.toLowerCase()} tools
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
