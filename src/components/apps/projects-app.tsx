'use client';

import { useState } from 'react';
import { Github, ExternalLink, Star, ArrowLeft } from 'lucide-react';
import { projects, type Project } from '@/data/projects';
import { profile } from '@/data/profile';
import ExplorerSidebar, { type NavKey } from '@/components/explorer/explorer-sidebar';
import Breadcrumb from '@/components/explorer/breadcrumb';
import FolderCard from '@/components/explorer/folder-card';

/** Locations other than Portfolio hold nothing — Explorer says so plainly. */
const EMPTY_COPY: Record<Exclude<NavKey, 'portfolio'>, string> = {
	home: 'Pinned folders appear here. Open Portfolio to browse the work.',
	desktop: 'This folder is empty.',
	documents: 'This folder is empty.',
	downloads: 'This folder is empty.',
};

function Detail({ project, onBack }: { project: Project; onBack: () => void }) {
	const [failed, setFailed] = useState(false);
	return (
		<div className='xp-detail'>
			<button type='button' className='xp-back' onClick={onBack}>
				<ArrowLeft size={15} aria-hidden='true' /> Back
			</button>

			{project.cover && !failed ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					className='xp-detail-cover'
					src={project.cover}
					alt={`${project.name} preview`}
					loading='lazy'
					onError={() => setFailed(true)}
				/>
			) : (
				<div className='xp-detail-cover xp-detail-fallback' aria-hidden='true'>
					<span style={{ color: project.color }}>{project.initial}</span>
				</div>
			)}

			<div className='xp-detail-head'>
				<h3 className='app-h2'>{project.name}</h3>
				{project.stars > 0 && (
					<span className='pj-stars'>
						<Star size={13} fill='currentColor' aria-hidden='true' />
						<span aria-label={`${project.stars} GitHub stars`}>{project.stars}</span>
					</span>
				)}
			</div>

			<span className='pj-badge' data-type={project.type}>
				{project.type === 'real' ? 'Production' : 'Case study'}
			</span>

			<p className='app-body' style={{ marginTop: 12 }}>
				{project.description}
			</p>

			<dl className='xp-detail-props'>
				<div>
					<dt>Stack</dt>
					<dd>{project.tech.join(' · ')}</dd>
				</div>
				<div>
					<dt>Type</dt>
					<dd>{project.type === 'real' ? 'Production work' : 'Case study'}</dd>
				</div>
			</dl>

			{(project.github || project.demo) && (
				<div className='pj-links'>
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
		</div>
	);
}

/** Projects, presented as File Explorer: sidebar, address bar, folder grid. */
export default function ProjectsApp() {
	const [nav, setNav] = useState<NavKey>('portfolio');
	const [openId, setOpenId] = useState<string | null>(null);

	const ordered = [
		...projects.filter((p) => p.featured),
		...projects.filter((p) => !p.featured),
	];
	const current = ordered.find((p) => p.id === openId) ?? null;

	const trail = [
		{ label: 'This PC', onSelect: () => { setNav('home'); setOpenId(null); } },
		{ label: 'Portfolio', onSelect: () => { setNav('portfolio'); setOpenId(null); } },
		...(current ? [{ label: current.name }] : []),
	];

	return (
		<div className='xp-shell'>
			<ExplorerSidebar
				active={nav}
				githubHref={profile.github}
				onSelect={(k) => {
					setNav(k);
					setOpenId(null);
				}}
			/>

			<div className='xp-main'>
				<div className='xp-bar'>
					<Breadcrumb trail={nav === 'portfolio' || current ? trail : [{ label: 'This PC' }, { label: nav }]} />
					<span className='xp-count'>
						{nav === 'portfolio' && !current ? `${ordered.length} items` : ''}
					</span>
				</div>

				<div className='xp-body'>
					{current ? (
						<Detail project={current} onBack={() => setOpenId(null)} />
					) : nav === 'portfolio' ? (
						<div className='xp-grid'>
							{ordered.map((p) => (
								<FolderCard
									key={p.id}
									name={p.name}
									meta={p.tech.slice(0, 2).join(' · ')}
									colour={p.color}
									featured={p.featured}
									onOpen={() => setOpenId(p.id)}
								/>
							))}
						</div>
					) : (
						<p className='xp-empty'>{EMPTY_COPY[nav]}</p>
					)}
				</div>
			</div>
		</div>
	);
}
