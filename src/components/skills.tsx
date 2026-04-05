'use client';

import { useState, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Code2, Zap, Globe, Briefcase, Layers } from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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
		color: '#0a0a0a',
		bg: '#0a0a0a10',
		icon: 'https://cdn.simpleicons.org/nextdotjs/0a0a0a',
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
		color: '#525252',
		bg: '#52525210',
		icon: 'https://cdn.simpleicons.org/express/525252',
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
	{
		name: 'Cloud Scheduler',
		category: 'Tools' as Category,
		color: '#34A853',
		bg: '#34A85318',
		icon: 'https://cdn.simpleicons.org/googlecloud/34A853',
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
		color: '#525252',
		bg: '#52525210',
		icon: 'https://cdn.simpleicons.org/githubcopilot/525252',
	},
	{
		name: 'Cursor',
		category: 'AI Tools' as Category,
		color: '#7c3aed',
		bg: '#7c3aed18',
		icon: 'https://cdn.simpleicons.org/cursor/7c3aed',
	},
	// {
	// 	name: 'Hugging Face',
	// 	category: 'AI Tools' as Category,
	// 	color: '#FFD21E',
	// 	bg: '#FFD21E18',
	// 	icon: 'https://cdn.simpleicons.org/huggingface/FFD21E',
	// },
	// {
	// 	name: 'LangChain',
	// 	category: 'AI Tools' as Category,
	// 	color: '#525252',
	// 	bg: '#52525210',
	// 	icon: 'https://cdn.simpleicons.org/langchain/525252',
	// },
];

// Icons shown inside the bento "Tech Stack" card
const stackIcons = [
	{ name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/0a0a0a' },
	{ name: 'React', icon: 'https://cdn.simpleicons.org/react/0ea5e9' },
	{ name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
	{ name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/16a34a' },
	{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/00ADD8' },
	{ name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
	{ name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
	{ name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D' },
];

const CARD_BASE: React.CSSProperties = {
	background: '#ffffff',
	border: '2px solid #0a0a0a',
	borderRadius: 20,
	boxShadow: '6px 6px 0px #0a0a0a',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
};


export default function Skills() {
	const [active, setActive] = useState<Category>('All');
	const [interacted, setInteracted] = useState(false);
	const shouldReduceMotion = useReducedMotion();
	const gridRef = useRef<HTMLDivElement>(null);
	const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	return (
		<section id='skills' style={{ background: '#faf9f7' }}>
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
						color: '#a3a3a3',
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
						color: '#0a0a0a',
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
						color: '#525252',
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
						gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
						gap: 20,
						marginBottom: 64,
					}}>
					{/* Card 1 — Clean Code First */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.1)}
						className="card" style={CARD_BASE}
>
						<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
							<div style={{ width: 80, height: 80, borderRadius: 20, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a' }}>
								<Code2 size={36} style={{ color: '#10b981' }} aria-hidden='true' />
							</div>
						</div>
						<div style={{ padding: '24px 24px 28px' }}>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 10, letterSpacing: '-0.02em' }}>
								Clean Code First
							</h3>
							<p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0 }}>
								Writing maintainable, scalable code with engineering excellence at every layer of the stack.
							</p>
						</div>
					</motion.div>

					{/* Card 2 — Modern Tech Stack */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.18)}
						className="card" style={CARD_BASE}
>
						<div style={{ background: '#f0ece8', padding: '24px 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
							{stackIcons.map((s) => (
								<div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
									<div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffffff', border: '1.5px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #0a0a0a' }}>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={s.icon} alt={s.name} width={22} height={22} />
									</div>
									<span style={{ fontSize: 9, color: '#525252', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', lineHeight: 1.2 }}>{s.name}</span>
								</div>
							))}
						</div>
						<div style={{ padding: '20px 24px 28px' }}>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 10, letterSpacing: '-0.02em' }}>
								Modern Tech Stack
							</h3>
							<p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0 }}>
								Technologies and tools I use to build innovative solutions.
							</p>
						</div>
					</motion.div>

					{/* Card 3 — Full Stack Expertise */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.26)}
						className="card" style={CARD_BASE}
>
						<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
							<div style={{ width: 80, height: 80, borderRadius: 20, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a' }}>
								<Layers size={36} style={{ color: '#3b82f6' }} aria-hidden='true' />
							</div>
						</div>
						<div style={{ padding: '24px 24px 28px' }}>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 10, letterSpacing: '-0.02em' }}>
								Full Stack Expertise
							</h3>
							<p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0 }}>
								From React frontends to Golang backends — end-to-end ownership across every layer.
							</p>
						</div>
					</motion.div>

					{/* Card 4 — Remote Ready */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.34)}
						className="card" style={CARD_BASE}
>
						<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
							<div style={{ width: 80, height: 80, borderRadius: 20, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a' }}>
								<Globe size={36} style={{ color: '#0ea5e9' }} aria-hidden='true' />
							</div>
						</div>
						<div style={{ padding: '24px 24px 28px' }}>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 10, letterSpacing: '-0.02em' }}>
								Remote Ready
							</h3>
							<p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0 }}>
								Available across time zones for seamless worldwide collaboration, hybrid or remote.
							</p>
						</div>
					</motion.div>

					{/* Card 5 — Performance at Scale */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.42)}
						className="card" style={CARD_BASE}
>
						<div style={{ background: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
							<div style={{ width: 80, height: 80, borderRadius: 20, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a' }}>
								<Zap size={36} style={{ color: '#f59e0b' }} aria-hidden='true' />
							</div>
						</div>
						<div style={{ padding: '24px 24px 28px' }}>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 10, letterSpacing: '-0.02em' }}>
								Performance at Scale
							</h3>
							<p style={{ fontSize: 14, color: '#525252', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", margin: 0 }}>
								Optimizing APIs and services to handle high-throughput workloads reliably.
							</p>
						</div>
					</motion.div>

					{/* Card 6 — Get in Touch (amber CTA) */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.5)}
						className="card card-accent" style={{ ...CARD_BASE, background: '#fbbf24', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}
>
						{/* Pulsing light glow */}
						<motion.div
							aria-hidden='true'
							animate={shouldReduceMotion ? {} : {
								opacity: [0.3, 0.65, 0.3],
								scale:   [1, 1.3, 1],
							}}
							transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
							style={{
								position: 'absolute',
								top: '10%',
								left: '50%',
								transform: 'translateX(-50%)',
								width: 220,
								height: 220,
								borderRadius: '50%',
								background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
								pointerEvents: 'none',
							}}
						/>
						{/* Content */}
						<div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<div style={{ width: 72, height: 72, borderRadius: 20, background: '#ffffff', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px #0a0a0a', marginBottom: 20 }}>
								<Briefcase size={32} style={{ color: '#0a0a0a' }} aria-hidden='true' />
							</div>
							<h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', fontFamily: "'Inter', sans-serif", marginBottom: 12, letterSpacing: '-0.02em' }}>
								Get in touch
							</h3>
							<p style={{ fontSize: 14, color: '#78350f', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
								Looking for a backend engineer? There&apos;s a high chance I&apos;ll be able to help!
							</p>
							<a
								href='#contact'
								style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#0a0a0a', color: '#ffffff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", border: '2px solid #0a0a0a', boxShadow: '3px 3px 0px rgba(0,0,0,0.25)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
								onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.25)'; }}
								onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '3px 3px 0px rgba(0,0,0,0.25)'; }}>
								Get in touch
							</a>
						</div>
					</motion.div>
				</div>

				{/* ── Filter header row ───────────────────────────── */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.35, 0)}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 16,
						marginBottom: 28,
					}}>
					{/* Left label */}
					<div>
						<p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#a3a3a3', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 4px' }}>
							all technologies
						</p>
						<p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#525252', margin: 0 }}>
							Filter by category to explore the stack
						</p>
					</div>

					{/* Right: Paperfolio chip filters */}
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{categories.map((cat) => {
							const isActive = active === cat;
							return (
								<button
									key={cat}
									onClick={() => { setActive(cat); setInteracted(true); }}
									style={{
										padding: '8px 18px',
										borderRadius: 10,
										border: '1.5px solid #0a0a0a',
										cursor: 'pointer',
										fontSize: 13,
										fontWeight: 600,
										fontFamily: "'Inter', sans-serif",
										transition: 'transform 0.15s ease, box-shadow 0.15s ease',
										background: isActive ? '#6366f1' : '#ffffff',
										color: isActive ? '#ffffff' : '#0a0a0a',
										boxShadow: isActive ? '3px 3px 0px #0a0a0a' : '2px 2px 0px #0a0a0a',
										transform: isActive ? 'translate(-1px,-1px)' : 'translate(0,0)',
									}}
									onMouseEnter={(e) => {
										if (!isActive) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }
									}}
									onMouseLeave={(e) => {
										if (!isActive) { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }
									}}>
									{cat}
								</button>
							);
						})}
					</div>
				</motion.div>

				{/* Skill Tags Grid */}
				<div
					ref={gridRef}
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 10,
						padding: '32px 0 40px',
						minHeight: 200,
					}}>
					{skills.map((skill, i) => {
						const isMatch = active === 'All' || skill.category === active;
						const entranceDelay = shouldReduceMotion ? 0 : (interacted ? 0 : i * 0.028);
						return (
							<motion.div
								key={skill.name}
								initial={{ opacity: 0, y: 12, scale: 0.92 }}
								animate={gridInView ? {
									opacity: isMatch ? 1 : 0.18,
									y: 0,
									scale: isMatch ? 1 : 0.93,
								} : { opacity: 0, y: 12, scale: 0.92 }}
								whileHover={isMatch ? { x: -1, y: -1 } : {}}
								transition={{
									opacity: { duration: shouldReduceMotion ? 0 : 0.3, ease: EASE, delay: entranceDelay },
									y:       { duration: shouldReduceMotion ? 0 : 0.3, ease: EASE, delay: entranceDelay },
									scale:   { duration: shouldReduceMotion ? 0 : 0.3, ease: EASE, delay: entranceDelay },
									x:       { duration: 0.15, ease: EASE },
								}}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									padding: '10px 16px',
									background: '#ffffff',
									border: '1.5px solid #0a0a0a',
									borderRadius: 12,
									boxShadow: '2px 2px 0px #0a0a0a',
									transition: 'box-shadow 0.2s ease',
									cursor: 'default',
								}}
								onMouseEnter={(e) => {
									if (isMatch) e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a';
								}}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={skill.icon} alt={skill.name} width={18} height={18} />
								<span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
									{skill.name}
								</span>
								<span style={{ fontSize: 10, fontWeight: 600, color: skill.color, fontFamily: "'JetBrains Mono', monospace", background: skill.bg, padding: '2px 6px', borderRadius: 4 }}>
									{skill.category}
								</span>
							</motion.div>
						);
					})}
				</div>

			</div>
		</section>
	);
}
