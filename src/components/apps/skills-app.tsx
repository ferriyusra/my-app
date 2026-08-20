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
	/** Years of hands-on use, which is what the meter actually measures. */
	years: number;
};

/** Longest tenure on the list sets the full bar. */
const MAX_YEARS = 4;

const skills: Skill[] = [
	{ name: 'Go', category: 'Backend', icon: '/icons/go.svg', years: 3 },
	{ name: 'Node.js', category: 'Backend', icon: '/icons/nodedotjs.svg', years: 4 },
	{ name: 'NestJS', category: 'Backend', icon: '/icons/nestjs.svg', years: 2 },
	{ name: 'Express.js', category: 'Backend', icon: '/icons/express.svg', adaptive: true, years: 3 },
	{ name: 'PostgreSQL', category: 'Database', icon: '/icons/postgresql.svg', years: 4 },
	{ name: 'MySQL', category: 'Database', icon: '/icons/mysql.svg', years: 3 },
	{ name: 'MongoDB', category: 'Database', icon: '/icons/mongodb.svg', years: 3 },
	{ name: 'Redis', category: 'Database', icon: '/icons/redis.svg', years: 3 },
	{ name: 'Docker', category: 'Infrastructure', icon: '/icons/docker.svg', years: 3 },
	{ name: 'GCP', category: 'Infrastructure', icon: '/icons/googlecloud.svg', years: 3 },
	{ name: 'Pub/Sub', category: 'Infrastructure', icon: '/icons/googlepubsub.svg', years: 1 },
	{ name: 'Cloud Scheduler', category: 'Infrastructure', icon: '/icons/cloudscheduler.svg', years: 1 },
	{ name: 'AWS', category: 'Infrastructure', icon: '/icons/aws.svg', years: 2 },
	{ name: 'Git', category: 'Infrastructure', icon: '/icons/git.svg', years: 4 },
	{ name: 'TypeScript', category: 'Frontend', icon: '/icons/typescript.svg', years: 4 },
	{ name: 'React', category: 'Frontend', icon: '/icons/react.svg', years: 3 },
	{ name: 'Next.js', category: 'Frontend', icon: '/icons/nextdotjs.svg', adaptive: true, years: 2 },
	{ name: 'JavaScript', category: 'Frontend', icon: '/icons/javascript.svg', years: 4 },
	{ name: 'TailwindCSS', category: 'Frontend', icon: '/icons/tailwindcss.svg', years: 2 },
	{ name: 'Claude', category: 'AI Tools', icon: '/icons/anthropic.svg', years: 2 },
	{ name: 'ChatGPT', category: 'AI Tools', icon: '/icons/openai.svg', years: 2 },
	{ name: 'GitHub Copilot', category: 'AI Tools', icon: '/icons/githubcopilot.svg', adaptive: true, years: 2 },
	{ name: 'Cursor', category: 'AI Tools', icon: '/icons/cursor.svg', years: 1 },
];

export default function SkillsApp() {
	const [active, setActive] = useState<Category>('All');
	const shown = active === 'All' ? skills : skills.filter((s) => s.category === active);

	return (
		<div className='app-pad'>
			<h2 className='app-h2'>Tech stack</h2>
			<p className='app-sub' style={{ marginBottom: 18 }}>
				Backend and data first — the frontend work is real but supporting.
				Bars show years of hands-on use, not a self-scored percentage.
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

			<ul className='sk-list' aria-live='polite'>
				{shown.map((s) => {
					const pct = Math.round((s.years / MAX_YEARS) * 100);
					return (
						<li key={s.name} className='sk-row'>
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
							<span className='sk-name'>{s.name}</span>
							<span
								className='sk-meter'
								role='meter'
								aria-valuenow={s.years}
								aria-valuemin={0}
								aria-valuemax={MAX_YEARS}
								aria-label={`${s.name}: ${s.years} years`}>
								<span className='sk-meter-fill' style={{ width: `${pct}%` }} />
							</span>
							<span className='sk-years'>
								{s.years} {s.years === 1 ? 'yr' : 'yrs'}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
