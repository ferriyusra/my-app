'use client';

import { useState } from 'react';
import { Github, ExternalLink, Star } from 'lucide-react';
import { projects, type Project } from '@/data/projects';

function Cover({ project }: { project: Project }) {
	const [failed, setFailed] = useState(false);
	if (!project.cover || failed) {
		return (
			<div className='pj-cover pj-cover-fallback'>
				<span style={{ color: project.color }}>{project.initial}</span>
			</div>
		);
	}
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className='pj-cover'
			src={project.cover}
			alt={`${project.name} preview`}
			loading='lazy'
			onError={() => setFailed(true)}
		/>
	);
}

export default function ProjectsApp() {
	const ordered = [
		...projects.filter((p) => p.featured),
		...projects.filter((p) => !p.featured),
	];

	return (
		<div className='app-pad'>
			<h2 className='app-h2'>Things I&rsquo;ve built</h2>
			<p className='app-sub' style={{ marginBottom: 20 }}>
				{ordered.length} projects — production work and case studies.
			</p>

			<div className='pj-grid'>
				{ordered.map((p) => (
					<article key={p.id} className='pj-card'>
						<Cover project={p} />
						<div className='pj-body'>
							<div className='pj-titlerow'>
								<h3 className='pj-name'>{p.name}</h3>
								{p.stars > 0 && (
									<span className='pj-stars'>
										<Star size={12} fill='currentColor' aria-hidden='true' />
										<span aria-label={`${p.stars} GitHub stars`}>{p.stars}</span>
									</span>
								)}
							</div>
							<span className='pj-badge' data-type={p.type}>
								{p.type === 'real' ? 'Production' : 'Case study'}
							</span>
							<p className='pj-desc'>{p.description}</p>
							<p className='pj-tech'>{p.tech.slice(0, 4).join(' · ')}</p>
							{(p.github || p.demo) && (
								<div className='pj-links'>
									{p.github && (
										<a
											href={p.github}
											target='_blank'
											rel='noopener noreferrer'
											className='fl-btn fl-btn-standard'
											aria-label={`${p.name} source on GitHub`}>
											<Github size={14} aria-hidden='true' /> Code
										</a>
									)}
									{p.demo && (
										<a
											href={p.demo}
											target='_blank'
											rel='noopener noreferrer'
											className='fl-btn fl-btn-accent'
											aria-label={`${p.name} live demo`}>
											<ExternalLink size={14} aria-hidden='true' /> Demo
										</a>
									)}
								</div>
							)}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
