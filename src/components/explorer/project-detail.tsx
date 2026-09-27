'use client';

import { useState } from 'react';
import { ExternalLink, FileCode2 } from 'lucide-react';
import { LiGithub, LiStar } from '@/components/icons/line-icons';
import { projectKind, type Project } from '@/data/projects';
import { caseStudy } from '@/data/case-study';

/** The pane Explorer shows once a project folder is opened. */
export default function ProjectDetail({
	project,
	onReadCase,
}: {
	project: Project;
	/** Explorer has the write-up as a location of its own, so this navigates
	    there instead of launching a second window from inside the first. */
	onReadCase: () => void;
}) {
	const [failed, setFailed] = useState(false);
	const hasCover = !!project.cover && !failed;
	/* One project has a write-up at depth; its card says so and opens it. */
	const hasCase = project.id === caseStudy.project;

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
						{projectKind(project)}
					</span>
				</div>
				{project.stars > 0 && (
					<span className='xp-stars'>
						<LiStar size={13} aria-hidden='true' />
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
					<dd>{projectKind(project, true)}</dd>
				</div>
				<div>
					<dt>Source</dt>
					<dd>{project.github ? 'Public on GitHub' : 'Private — client work'}</dd>
				</div>
			</dl>

			{(project.github || project.demo || hasCase) && (
				<div className='xp-detail-links'>
					{hasCase && (
						<button
							type='button'
							className='fl-btn fl-btn-accent'
							onClick={onReadCase}>
							<FileCode2 size={14} aria-hidden='true' /> Read the case study
						</button>
					)}
					{project.github && (
						<a
							href={project.github}
							target='_blank'
							rel='noopener noreferrer'
							className='fl-btn fl-btn-standard'>
							<LiGithub size={14} aria-hidden='true' /> Code
						</a>
					)}
					{project.demo && (
						<a
							href={project.demo}
							target='_blank'
							rel='noopener noreferrer'
							className='fl-btn fl-btn-accent'>
							<ExternalLink size={14} aria-hidden='true' /> {project.demoLabel ?? 'Live demo'}
						</a>
					)}
				</div>
			)}
		</article>
	);
}
