'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TextReveal from '@/components/text-reveal';
import { BORDER, CONTAINER, EASE, FONT, H2, RADIUS, SANS } from '@/lib/theme';

type Category =
	| 'All'
	| 'Frontend'
	| 'Backend'
	| 'Database'
	| 'Infrastructure'
	| 'AI Tools';

const categories: Category[] = [
	'All',
	'Backend',
	'Database',
	'Infrastructure',
	'Frontend',
	'AI Tools',
];

/* Coloured by category, not by brand: the near-black logos (Next.js, Express,
   Copilot) were unreadable, and per-brand colour made the row look arbitrary. */
const CATEGORY_COLOR: Record<Exclude<Category, 'All'>, string> = {
	Backend: 'var(--success)',
	Database: 'var(--info)',
	Infrastructure: 'var(--warn)',
	Frontend: 'var(--accent)',
	'AI Tools': 'var(--ink-muted)',
};

/* `adaptive` marks near-black logos that need inverting on dark surfaces. */
type Skill = {
	name: string;
	category: Exclude<Category, 'All'>;
	icon: string;
	adaptive?: boolean;
};

const skills: Skill[] = [
	// Backend — listed first because that is the job
	{ name: 'Go', category: 'Backend', icon: '/icons/go.svg' },
	{ name: 'Node.js', category: 'Backend', icon: '/icons/nodedotjs.svg' },
	{ name: 'NestJS', category: 'Backend', icon: '/icons/nestjs.svg' },
	{
		name: 'Express.js',
		category: 'Backend',
		icon: '/icons/express.svg',
		adaptive: true,
	},
	// Database
	{ name: 'PostgreSQL', category: 'Database', icon: '/icons/postgresql.svg' },
	{ name: 'MySQL', category: 'Database', icon: '/icons/mysql.svg' },
	{ name: 'MongoDB', category: 'Database', icon: '/icons/mongodb.svg' },
	{ name: 'Redis', category: 'Database', icon: '/icons/redis.svg' },
	// Infrastructure
	{ name: 'Docker', category: 'Infrastructure', icon: '/icons/docker.svg' },
	{ name: 'GCP', category: 'Infrastructure', icon: '/icons/googlecloud.svg' },
	{
		name: 'Pub/Sub',
		category: 'Infrastructure',
		icon: '/icons/googlepubsub.svg',
	},
	{
		name: 'Cloud Scheduler',
		category: 'Infrastructure',
		icon: '/icons/cloudscheduler.svg',
	},
	{ name: 'AWS', category: 'Infrastructure', icon: '/icons/aws.svg' },
	{ name: 'Git', category: 'Infrastructure', icon: '/icons/git.svg' },
	// Frontend
	{ name: 'TypeScript', category: 'Frontend', icon: '/icons/typescript.svg' },
	{ name: 'React', category: 'Frontend', icon: '/icons/react.svg' },
	{
		name: 'Next.js',
		category: 'Frontend',
		icon: '/icons/nextdotjs.svg',
		adaptive: true,
	},
	{ name: 'JavaScript', category: 'Frontend', icon: '/icons/javascript.svg' },
	{ name: 'TailwindCSS', category: 'Frontend', icon: '/icons/tailwindcss.svg' },
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

export default function Skills() {
	const [active, setActive] = useState<Category>('All');
	const shouldReduceMotion = useReducedMotion();

	const shown =
		active === 'All' ? skills : skills.filter((s) => s.category === active);

	return (
		<section id='skills' style={{ background: 'var(--section-a)' }}>
			<div style={CONTAINER}>
				<TextReveal
					parts={[{ text: 'Tech ' }, { text: 'Stack', color: 'var(--accent)' }]}
					as='h2'
					style={{ ...H2, marginBottom: 12 }}
				/>
				<motion.p
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{
						duration: shouldReduceMotion ? 0 : 0.4,
						ease: EASE,
						delay: shouldReduceMotion ? 0 : 0.1,
					}}
					style={{
						color: 'var(--ink-secondary)',
						fontSize: FONT.base,
						marginBottom: 36,
						maxWidth: '58ch',
						lineHeight: 1.7,
						fontFamily: SANS,
					}}>
					What I reach for day to day. Backend and data first — the frontend
					work is real but supporting.
				</motion.p>

				{/* Filter */}
				<div
					role='group'
					aria-label='Filter skills by category'
					style={{
						display: 'flex',
						gap: 8,
						flexWrap: 'wrap',
						marginBottom: 28,
					}}>
					{categories.map((cat) => {
						const isActive = active === cat;
						return (
							<button
								key={cat}
								type='button'
								onClick={() => setActive(cat)}
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
								}}>
								{cat}
							</button>
						);
					})}
				</div>

				{/* Tags. `layout` handles the reflow, replacing the GSAP Flip plugin. */}
				<motion.div
					aria-live='polite'
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 10,
						minHeight: 160,
						alignContent: 'flex-start',
					}}>
					{shown.map((skill) => (
						<motion.div
							key={skill.name}
							layout={!shouldReduceMotion}
							initial={{ opacity: 0, scale: 0.94 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: shouldReduceMotion ? 0 : 0.25,
								ease: EASE,
							}}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 8,
								padding: '9px 14px',
								background: 'var(--surface)',
								border: `${BORDER.soft} solid var(--line)`,
								borderRadius: RADIUS.md,
								boxShadow: 'var(--sh-1)',
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
							{active === 'All' && (
								<span
									style={{
										fontSize: FONT.micro,
										fontWeight: 600,
										color: CATEGORY_COLOR[skill.category],
										fontFamily: SANS,
									}}>
									{skill.category}
								</span>
							)}
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
