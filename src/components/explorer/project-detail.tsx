'use client';

import { useState } from 'react';
import { ExternalLink, Github, Star } from 'lucide-react';
import type { Project } from '@/data/projects';

/** The pane Explorer shows once a project folder is opened. */
export default function ProjectDetail({ project }: { project: Project }) {
	const [failed, setFailed] = useState(false);
	const hasCover = !!project.cover && !failed;

	return (
		<article className='xp-detail'>
			{hasCover ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					className='xp-detail-cover'
					src={project.cover}
					alt={`${project.name} interface`}
					loading='lazy'
					onError={() => setFailed(true)}
				/>
			) : (
				<div
					className='xp-detail-cover xp-detail-fallback'
					aria-hidden='true'
					style={{ background: `${project.color}1f`, color: project.color }}>
					{project.initial}
				</div>
			)}

			<header className='xp-detail-head'>
				<div>
					<h3>{project.name}</h3>
					<span className='xp-badge' data-type={project.type}>
						{project.type === 'real' ? 'Production' : 'Case study'}
					</span>
				</div>
				{project.stars > 0 && (
					<span className='xp-stars'>
						<Star size={13} fill='currentColor' aria-hidden='true' />
						<span aria-label={`${project.stars} GitHub stars`}>{project.stars}</span>
					</span>
				)}
			</header>

			<p className='xp-detail-body'>{project.description}</p>

			<dl className='xp-detail-props'>
				<div>
					<dt>Stack</dt>
					<dd>{project.tech.join(' · ')}</dd>
				</div>
				<div>
					<dt>Type</dt>
					<dd>
						{project.type === 'real' ? 'Production work' : 'Personal case study'}
					</dd>
				</div>
				<div>
					<dt>Source</dt>
					<dd>{project.github ? 'Public on GitHub' : 'Private — client work'}</dd>
				</div>
			</dl>

			{(project.github || project.demo) && (
				<div className='xp-detail-links'>
					{project.github && (
						<a
							href={project.github}
							target='_blank'
							rel='noopener noreferrer'
							className='fl-btn fl-btn-standard'>
							<Github size={14} aria-hidden='true' /> Code
						</a>
					)}
					{project.demo && (
						<a
							href={project.demo}
							target='_blank'
							rel='noopener noreferrer'
							className='fl-btn fl-btn-accent'>
							<ExternalLink size={14} aria-hidden='true' /> Live demo
						</a>
					)}
				</div>
			)}
		</article>
	);
}
