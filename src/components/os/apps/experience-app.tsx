'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experiences } from '@/data/experience';

const COLLAPSED = 2;

export default function ExperienceApp() {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	return (
		<div className='app-pad'>
			<h2 className='app-h2'>Where I&rsquo;ve worked</h2>
			<p className='app-sub' style={{ marginBottom: 20 }}>
				Five roles, most recent first.
			</p>

			<ol className='xp-list'>
				{experiences.map((exp, i) => {
					const expanded = openIdx === i;
					const shown = expanded
						? exp.achievements
						: exp.achievements.slice(0, COLLAPSED);
					const hidden = exp.achievements.length - COLLAPSED;

					return (
						<li key={exp.company} className='xp-item'>
							<div className='xp-head'>
								<div>
									<h3 className='xp-role'>{exp.role}</h3>
									<p className='xp-company'>
										{exp.company}
										<span className='xp-loc'> · {exp.location}</span>
									</p>
								</div>
								<time className='xp-period' dateTime={exp.startISO}>
									{exp.period}
									{exp.current && <span className='xp-now'>Current</span>}
								</time>
							</div>

							<p className='app-body'>{exp.description}</p>

							<ul className='xp-points'>
								{shown.map((a, j) => (
									<li key={j}>{a}</li>
								))}
							</ul>

							{hidden > 0 && (
								<button
									type='button'
									className='xp-toggle'
									aria-expanded={expanded}
									onClick={() => setOpenIdx(expanded ? null : i)}>
									{expanded ? 'Show less' : `${hidden} more`}
									<ChevronDown
										size={14}
										aria-hidden='true'
										style={{
											transform: expanded ? 'rotate(180deg)' : 'none',
										}}
									/>
								</button>
							)}

							<p className='xp-tech'>{exp.tech.join('  ·  ')}</p>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
