'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Code2, Zap, Globe, Briefcase, Layers, type LucideIcon } from 'lucide-react';
import TextReveal from '@/components/text-reveal';
import gsap from 'gsap';
import { Flip } from 'gsap/all';
import {
	BORDER,
	CARD,
	CONTAINER,
	EASE,
	FONT,
	H2,
	MONO,
	RADIUS,
	SANS,
} from '@/lib/theme';

gsap.registerPlugin(Flip);

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

/* Chips are coloured by category rather than by brand. Brand colours were
   unreadable for the near-black logos (Next.js, Express, Copilot) and made
   the filter row look arbitrary. */
const CATEGORY_COLOR: Record<Exclude<Category, 'All'>, string> = {
	Frontend: 'var(--info)',
	Backend: 'var(--success)',
	Database: '#8b5cf6',
	Tools: 'var(--warn)',
	'AI Tools': '#ec4899',
};

/* `adaptive` marks near-black logos that need inverting on dark surfaces. */
type Skill = {
	name: string;
	category: Exclude<Category, 'All'>;
	icon: string;
	adaptive?: boolean;
};

const skills: Skill[] = [
	// Frontend
	{ name: 'JavaScript', category: 'Frontend', icon: '/icons/javascript.svg' },
	{ name: 'TypeScript', category: 'Frontend', icon: '/icons/typescript.svg' },
	{ name: 'React', category: 'Frontend', icon: '/icons/react.svg' },
	{
		name: 'Next.js',
		category: 'Frontend',
		icon: '/icons/nextdotjs.svg',
		adaptive: true,
	},
	{ name: 'TailwindCSS', category: 'Frontend', icon: '/icons/tailwindcss.svg' },
	// Backend
	{ name: 'Node.js', category: 'Backend', icon: '/icons/nodedotjs.svg' },
	{
		name: 'Express.js',
		category: 'Backend',
		icon: '/icons/express.svg',
		adaptive: true,
	},
	{ name: 'NestJS', category: 'Backend', icon: '/icons/nestjs.svg' },
	{ name: 'Golang', category: 'Backend', icon: '/icons/go.svg' },
	// Database
	{ name: 'PostgreSQL', category: 'Database', icon: '/icons/postgresql.svg' },
	{ name: 'MySQL', category: 'Database', icon: '/icons/mysql.svg' },
	{ name: 'MongoDB', category: 'Database', icon: '/icons/mongodb.svg' },
	{ name: 'Redis', category: 'Database', icon: '/icons/redis.svg' },
	// Tools
	{ name: 'Docker', category: 'Tools', icon: '/icons/docker.svg' },
	{ name: 'Git', category: 'Tools', icon: '/icons/git.svg' },
	{ name: 'AWS', category: 'Tools', icon: '/icons/aws.svg' },
	{ name: 'GCP', category: 'Tools', icon: '/icons/googlecloud.svg' },
	{
		name: 'Google Pub/Sub',
		category: 'Tools',
		icon: '/icons/googlepubsub.svg',
	},
	{
		name: 'Cloud Scheduler',
		category: 'Tools',
		icon: '/icons/cloudscheduler.svg',
	},
	// AI Tools
	{ name: 'Claude', category: 'AI Tools', icon: '/icons/anthropic.svg' },
	{ name: 'ChatGPT', category: 'AI Tools', icon: '/icons/openai.svg' },
	{
		name: 'GitHub Copilot',
		category: 'AI Tools',
		icon: '/icons/githubcopilot.svg',
		adaptive: true,
	},
	{ name: 'Cursor', category: 'AI Tools', icon: '/icons/cursor.svg' },
];

/* Icons shown inside the bento "Tech Stack" card */
const stackIcons = [
	{ name: 'Next.js', icon: '/icons/nextdotjs.svg', adaptive: true },
	{ name: 'React', icon: '/icons/react.svg' },
	{ name: 'TypeScript', icon: '/icons/typescript.svg' },
	{ name: 'Node.js', icon: '/icons/nodedotjs.svg' },
	{ name: 'Golang', icon: '/icons/go.svg' },
	{ name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
	{ name: 'Docker', icon: '/icons/docker.svg' },
	{ name: 'Redis', icon: '/icons/redis.svg' },
];

/* The four cards that share one shape — previously copy-pasted four times. */
const bentoCards: { icon: LucideIcon; color: string; title: string; body: string }[] = [
	{
		icon: Code2,
		color: 'var(--success)',
		title: 'Clean Code First',
		body: 'Writing maintainable, scalable code with engineering excellence at every layer of the stack.',
	},
	{
		icon: Layers,
		color: 'var(--info)',
		title: 'Full Stack Expertise',
		body: 'From React frontends to Golang backends — end-to-end ownership across every layer.',
	},
	{
		icon: Globe,
		color: '#0ea5e9',
		title: 'Remote Ready',
		body: 'Available across time zones for seamless worldwide collaboration, hybrid or remote.',
	},
	{
		icon: Zap,
		color: 'var(--warn)',
		title: 'Performance at Scale',
		body: 'Optimizing APIs and services to handle high-throughput workloads reliably.',
	},
];

const CARD_TITLE: React.CSSProperties = {
	fontSize: FONT.xl,
	fontWeight: 800,
	color: 'var(--ink)',
	fontFamily: SANS,
	marginBottom: 10,
	letterSpacing: '-0.02em',
};

const CARD_BODY: React.CSSProperties = {
	fontSize: FONT.sm,
	color: 'var(--ink-secondary)',
	lineHeight: 1.65,
	fontFamily: SANS,
	margin: 0,
};

const ICON_TILE: React.CSSProperties = {
	width: 80,
	height: 80,
	borderRadius: RADIUS.lg,
	background: 'var(--surface)',
	border: `${BORDER.hard} solid var(--line)`,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxShadow: 'var(--sh-2)',
};

const HEADER_PANEL: React.CSSProperties = {
	background: 'var(--surface-header)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: 160,
};

/* ── Bento icon hover — GSAP powered ─────────────── */
function handleBentoEnter(e: React.MouseEvent) {
	const icon = (e.currentTarget as HTMLElement).querySelector('.bento-icon');
	if (icon)
		gsap.to(icon, { scale: 1.18, rotate: 8, duration: 0.4, ease: 'back.out(2)' });
}
function handleBentoLeave(e: React.MouseEvent) {
	const icon = (e.currentTarget as HTMLElement).querySelector('.bento-icon');
	if (icon)
		gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
}

export default function Skills() {
	const [active, setActive] = useState<Category>('All');
	const [interacted, setInteracted] = useState(false);
	const shouldReduceMotion = useReducedMotion();
	const gridRef = useRef<HTMLDivElement>(null);
	const gridInView = useInView(gridRef, { once: true, margin: '-80px' });
	const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

	const handleFilter = (cat: Category) => {
		flipStateRef.current = Flip.getState('.skill-tag');
		setActive(cat);
		setInteracted(true);
	};

	useLayoutEffect(() => {
		if (!flipStateRef.current || shouldReduceMotion) {
			flipStateRef.current = null;
			return;
		}

		Flip.from(flipStateRef.current, {
			duration: 0.5,
			ease: 'power2.inOut',
			stagger: 0.02,
			absolute: true,
			scale: true,
			onEnter: (elements: Element[]) =>
				gsap.fromTo(
					elements,
					{ opacity: 0, scale: 0.8 },
					{ opacity: 1, scale: 1, duration: 0.4, stagger: 0.02 },
				),
			onLeave: (elements: Element[]) =>
				gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.3 }),
		});

		flipStateRef.current = null;
	}, [active, shouldReduceMotion]);

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	const shown = active === 'All' ? skills : skills.filter((s) => s.category === active);

	return (
		<section id='skills' style={{ background: 'var(--section-b)' }}>
			<div style={CONTAINER}>
				<TextReveal
					parts={[{ text: 'Tech ' }, { text: 'Stack', color: 'var(--accent)' }]}
					as='h2'
					style={{ ...H2, marginBottom: 12 }}
				/>
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={t(0.4, 0.16)}
					style={{
						color: 'var(--ink-secondary)',
						fontSize: FONT.base,
						marginBottom: 56,
						maxWidth: 480,
						lineHeight: 1.6,
						fontFamily: SANS,
					}}>
					Tools and technologies I use to ship production-grade software.
				</motion.p>

				{/* ── Bento grid ───────────────────────────────────── */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
						gap: 20,
						marginBottom: 64,
					}}>
					{/* Tech Stack card — icon wall */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.1)}
						className='card'
						style={{ ...CARD, display: 'flex', flexDirection: 'column' }}
						onMouseEnter={handleBentoEnter}
						onMouseLeave={handleBentoLeave}>
						<div
							style={{
								background: 'var(--surface-header)',
								padding: '24px 20px 20px',
								display: 'grid',
								gridTemplateColumns: 'repeat(4, 1fr)',
								gap: 10,
							}}>
							{stackIcons.map((s) => (
								<div
									key={s.name}
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 6,
									}}>
									<div
										style={{
											width: 44,
											height: 44,
											borderRadius: RADIUS.md,
											background: 'var(--surface)',
											border: `${BORDER.soft} solid var(--line)`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: 'var(--sh-1)',
										}}>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={s.icon}
											alt=''
											aria-hidden='true'
											width={22}
											height={22}
											loading='lazy'
											className={s.adaptive ? 'icon-adaptive' : undefined}
										/>
									</div>
									<span
										style={{
											fontSize: FONT.micro,
											color: 'var(--ink-secondary)',
											fontFamily: MONO,
											textAlign: 'center',
											lineHeight: 1.2,
										}}>
										{s.name}
									</span>
								</div>
							))}
						</div>
						<div style={{ padding: '20px 24px 28px' }}>
							<h3 style={CARD_TITLE}>Modern Tech Stack</h3>
							<p style={CARD_BODY}>
								Technologies and tools I use to build innovative solutions.
							</p>
						</div>
					</motion.div>

					{/* The four uniform cards */}
					{bentoCards.map(({ icon: Icon, color, title, body }, i) => (
						<motion.div
							key={title}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.18 + i * 0.08)}
							className='card'
							style={{ ...CARD, display: 'flex', flexDirection: 'column' }}
							onMouseEnter={handleBentoEnter}
							onMouseLeave={handleBentoLeave}>
							<div style={HEADER_PANEL}>
								<div className='bento-icon' style={ICON_TILE}>
									<Icon size={36} style={{ color }} aria-hidden='true' />
								</div>
							</div>
							<div style={{ padding: '24px 24px 28px' }}>
								<h3 style={CARD_TITLE}>{title}</h3>
								<p style={CARD_BODY}>{body}</p>
							</div>
						</motion.div>
					))}

					{/* CTA card (amber) — keeps its own literal colours: it is a fixed
					    light surface in both themes by design. */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.5, 0.5)}
						className='card'
						style={{
							...CARD,
							background: '#fbbf24',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '40px 28px',
							textAlign: 'center' as const,
							position: 'relative',
						}}>
						<motion.div
							aria-hidden='true'
							animate={
								shouldReduceMotion
									? {}
									: { opacity: [0.3, 0.65, 0.3], scale: [1, 1.3, 1] }
							}
							transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
							style={{
								position: 'absolute',
								top: '10%',
								left: '50%',
								transform: 'translateX(-50%)',
								width: 220,
								height: 220,
								borderRadius: '50%',
								background:
									'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
								pointerEvents: 'none',
							}}
						/>
						<div
							style={{
								position: 'relative',
								zIndex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}>
							<div
								style={{
									width: 72,
									height: 72,
									borderRadius: RADIUS.lg,
									background: '#ffffff',
									border: `${BORDER.hard} solid #0a0a0a`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '4px 4px 0 #0a0a0a',
									marginBottom: 20,
								}}>
								<Briefcase size={32} style={{ color: '#0a0a0a' }} aria-hidden='true' />
							</div>
							<h3 style={{ ...CARD_TITLE, color: '#0a0a0a', marginBottom: 12 }}>
								Let&apos;s work together
							</h3>
							<p
								style={{
									...CARD_BODY,
									color: '#78350f',
									marginBottom: 24,
								}}>
								Looking for a backend engineer? There&apos;s a high chance
								I&apos;ll be able to help!
							</p>
							<a
								href='#contact'
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									padding: '12px 28px',
									background: '#0a0a0a',
									color: '#ffffff',
									borderRadius: RADIUS.md,
									textDecoration: 'none',
									fontSize: FONT.sm,
									fontWeight: 700,
									fontFamily: SANS,
									border: `${BORDER.hard} solid #0a0a0a`,
									boxShadow: '3px 3px 0 rgba(0,0,0,0.25)',
									transition: 'transform 0.15s ease, box-shadow 0.15s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translate(-1px,-1px)';
									e.currentTarget.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.25)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translate(0,0)';
									e.currentTarget.style.boxShadow = '3px 3px 0 rgba(0,0,0,0.25)';
								}}>
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
					<div>
						<p
							style={{
								fontSize: FONT.micro,
								fontFamily: MONO,
								color: 'var(--ink-muted)',
								letterSpacing: '0.15em',
								textTransform: 'uppercase',
								fontWeight: 600,
								margin: '0 0 4px',
							}}>
							all technologies
						</p>
						<p
							style={{
								fontSize: FONT.sm,
								fontFamily: SANS,
								color: 'var(--ink-secondary)',
								margin: 0,
							}}>
							Filter by category to explore the stack
						</p>
					</div>

					<div
						role='group'
						aria-label='Filter skills by category'
						style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{categories.map((cat) => {
							const isActive = active === cat;
							return (
								<button
									key={cat}
									type='button'
									onClick={() => handleFilter(cat)}
									aria-pressed={isActive}
									style={{
										padding: '8px 18px',
										borderRadius: RADIUS.sm,
										border: `${BORDER.soft} solid var(--line)`,
										cursor: 'pointer',
										fontSize: FONT.sm,
										fontWeight: 600,
										fontFamily: SANS,
										transition: 'transform 0.15s ease, box-shadow 0.15s ease',
										background: isActive ? 'var(--accent)' : 'var(--surface)',
										color: isActive ? 'var(--accent-ink)' : 'var(--ink)',
										boxShadow: isActive ? 'var(--sh-1-hi)' : 'var(--sh-1)',
										transform: isActive
											? 'translate(-1px,-1px)'
											: 'translate(0,0)',
									}}
									onMouseEnter={(e) => {
										if (!isActive) {
											e.currentTarget.style.transform = 'translate(-1px,-1px)';
											e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
										}
									}}
									onMouseLeave={(e) => {
										if (!isActive) {
											e.currentTarget.style.transform = 'translate(0,0)';
											e.currentTarget.style.boxShadow = 'var(--sh-1)';
										}
									}}>
									{cat}
								</button>
							);
						})}
					</div>
				</motion.div>

				{/* Skill tags — GSAP Flip */}
				<div
					ref={gridRef}
					aria-live='polite'
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 10,
						padding: '32px 0 40px',
						minHeight: 200,
					}}>
					{shown.map((skill, i) => {
						const entranceDelay = shouldReduceMotion
							? 0
							: interacted
								? 0
								: i * 0.028;
						return (
							<motion.div
								key={skill.name}
								data-flip-id={skill.name}
								className='skill-tag'
								initial={{ opacity: 0, y: 12, scale: 0.92 }}
								animate={
									gridInView
										? { opacity: 1, y: 0, scale: 1 }
										: { opacity: 0, y: 12, scale: 0.92 }
								}
								whileHover={{ x: -1, y: -1 }}
								transition={{
									opacity: {
										duration: shouldReduceMotion ? 0 : 0.3,
										ease: EASE,
										delay: entranceDelay,
									},
									y: {
										duration: shouldReduceMotion ? 0 : 0.3,
										ease: EASE,
										delay: entranceDelay,
									},
									scale: {
										duration: shouldReduceMotion ? 0 : 0.3,
										ease: EASE,
										delay: entranceDelay,
									},
									x: { duration: 0.15, ease: EASE },
								}}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									padding: '10px 16px',
									background: 'var(--surface)',
									border: `${BORDER.soft} solid var(--line)`,
									borderRadius: RADIUS.md,
									boxShadow: 'var(--sh-1)',
									transition: 'box-shadow 0.2s ease',
									cursor: 'default',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.boxShadow = 'var(--sh-1)';
								}}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={skill.icon}
									alt=''
									aria-hidden='true'
									width={18}
									height={18}
									loading='lazy'
									className={skill.adaptive ? 'icon-adaptive' : undefined}
								/>
								<span
									style={{
										fontSize: FONT.sm,
										fontWeight: 600,
										color: 'var(--ink)',
										fontFamily: SANS,
									}}>
									{skill.name}
								</span>
								<span
									style={{
										fontSize: FONT.micro,
										fontWeight: 600,
										color: CATEGORY_COLOR[skill.category],
										fontFamily: MONO,
										background: 'var(--surface-chip)',
										padding: '2px 6px',
										borderRadius: 4,
									}}>
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
