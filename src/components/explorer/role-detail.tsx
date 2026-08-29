'use client';

import { tenureLabel, type Experience } from '@/data/experience';

/**
 * The pane Explorer shows once a role is opened, in the same chrome a project
 * gets. The prose is not copied — every string here is read from
 * `experience.ts`, which is also what the Experience window and the server
 * document read.
 */
export default function RoleDetail({ role }: { role: Experience }) {
	return (
		<article className='xp-detail'>
			<header className='xp-detail-head'>
				<div>
					<h3>{role.role}</h3>
					{role.current && (
						<span className='xp-badge' data-type='real'>
							Current
						</span>
					)}
				</div>
			</header>

			<p className='xp-detail-body'>{role.description}</p>

			<dl className='xp-detail-props'>
				<div>
					<dt>Company</dt>
					<dd>{role.company}</dd>
				</div>
				<div>
					<dt>Period</dt>
					<dd>
						{role.period} · {tenureLabel(role)}
					</dd>
				</div>
				<div>
					<dt>Location</dt>
					<dd>{role.location}</dd>
				</div>
				<div>
					<dt>Stack</dt>
					<dd>{role.tech.join(' · ')}</dd>
				</div>
			</dl>

			<ul className='ex-points'>
				{role.achievements.map((a) => (
					<li key={a}>{a}</li>
				))}
			</ul>
		</article>
	);
}
