'use client';

import { useState } from 'react';

type Category =
	| 'All'
	| 'Backend'
	| 'Database'
	| 'Infrastructure'
	| 'Frontend'
	| 'AI Tools';

const categories: Category[] = [
	'All',
	'Backend',
	'Database',
	'Infrastructure',
	'Frontend',
	'AI Tools',
];

type Skill = {
	name: string;
	category: Exclude<Category, 'All'>;
	icon: string;
	adaptive?: boolean;
};

const skills: Skill[] = [
	{ name: 'Go', category: 'Backend', icon: '/icons/go.svg' },
	{ name: 'Node.js', category: 'Backend', icon: '/icons/nodedotjs.svg' },
	{ name: 'NestJS', category: 'Backend', icon: '/icons/nestjs.svg' },
	{ name: 'Express.js', category: 'Backend', icon: '/icons/express.svg', adaptive: true },
	{ name: 'PostgreSQL', category: 'Database', icon: '/icons/postgresql.svg' },
	{ name: 'MySQL', category: 'Database', icon: '/icons/mysql.svg' },
	{ name: 'MongoDB', category: 'Database', icon: '/icons/mongodb.svg' },
	{ name: 'Redis', category: 'Database', icon: '/icons/redis.svg' },
	{ name: 'Docker', category: 'Infrastructure', icon: '/icons/docker.svg' },
	{ name: 'GCP', category: 'Infrastructure', icon: '/icons/googlecloud.svg' },
	{ name: 'Pub/Sub', category: 'Infrastructure', icon: '/icons/googlepubsub.svg' },
	{ name: 'Cloud Scheduler', category: 'Infrastructure', icon: '/icons/cloudscheduler.svg' },
	{ name: 'AWS', category: 'Infrastructure', icon: '/icons/aws.svg' },
	{ name: 'Git', category: 'Infrastructure', icon: '/icons/git.svg' },
	{ name: 'TypeScript', category: 'Frontend', icon: '/icons/typescript.svg' },
	{ name: 'React', category: 'Frontend', icon: '/icons/react.svg' },
	{ name: 'Next.js', category: 'Frontend', icon: '/icons/nextdotjs.svg', adaptive: true },
	{ name: 'JavaScript', category: 'Frontend', icon: '/icons/javascript.svg' },
	{ name: 'TailwindCSS', category: 'Frontend', icon: '/icons/tailwindcss.svg' },
	{ name: 'Claude', category: 'AI Tools', icon: '/icons/anthropic.svg' },
	{ name: 'ChatGPT', category: 'AI Tools', icon: '/icons/openai.svg' },
	{ name: 'GitHub Copilot', category: 'AI Tools', icon: '/icons/githubcopilot.svg', adaptive: true },
	{ name: 'Cursor', category: 'AI Tools', icon: '/icons/cursor.svg' },
];

export default function SkillsApp() {
	const [active, setActive] = useState<Category>('All');
	const shown = active === 'All' ? skills : skills.filter((s) => s.category === active);

	return (
		<div className='app-pad'>
			<h2 className='app-h2'>Tech stack</h2>
			<p className='app-sub' style={{ marginBottom: 18 }}>
				Backend and data first — the frontend work is real but supporting.
			</p>

			<div className='sk-filter' role='group' aria-label='Filter by category'>
				{categories.map((c) => (
					<button
						key={c}
						type='button'
						className='sk-chip'
						data-active={active === c}
						aria-pressed={active === c}
						onClick={() => setActive(c)}>
						{c}
					</button>
				))}
			</div>

			<div className='sk-grid' aria-live='polite'>
				{shown.map((s) => (
					<div key={s.name} className='sk-tile'>
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
						<span>{s.name}</span>
					</div>
				))}
			</div>
		</div>
	);
}
