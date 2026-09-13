'use client';

import { Clock, FileCode2, FileText, FolderGit2 } from 'lucide-react';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { sendIntent } from '@/hooks/use-app-intent';
import { APP_BY_ID } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { caseStudy } from '@/data/case-study';

/**
 * Start's Recommended strip. Windows fills it with recently opened files;
 * this fills it with what was actually opened this session, then the case
 * study, the two featured projects and the CV, so the row is never empty and
 * the strongest document on the site is one click from Start.
 */
export default function RecommendedSection({ onClose }: { onClose: () => void }) {
	const { recents } = useShell();
	const { launch } = useWindowManager();
	/* The case study's own card is left out: it is the item above it. */
	const featured = projects
		.filter((p) => p.featured && p.id !== caseStudy.project)
		.slice(0, 2);

	return (
		<div className='start-reco'>
			{recents.slice(0, 2).map((id) => {
				const app = APP_BY_ID[id];
				return (
					<button
						key={id}
						type='button'
						className='start-reco-item'
						onClick={() => {
							launch(id);
							onClose();
						}}>
						<AppTile tile={app.tile} size={28} />
						<span>
							<strong>{app.title}</strong>
							<small>
								<Clock size={11} aria-hidden='true' /> Recently opened
							</small>
						</span>
					</button>
				);
			})}

			<button
				type='button'
				className='start-reco-item'
				onClick={() => {
					sendIntent('experience', 'case');
					launch('experience');
					onClose();
				}}>
				<span
					className='start-reco-swatch'
					aria-hidden='true'
					style={{ background: 'linear-gradient(140deg, #4a8a6c 0%, #1f4d38 100%)' }}>
					<FileCode2 size={15} color='#fff' strokeWidth={2.1} />
				</span>
				<span>
					<strong>Case study</strong>
					<small>{caseStudy.title}</small>
				</span>
			</button>

			{featured.map((p) => (
				<button
					key={p.id}
					type='button'
					className='start-reco-item'
					onClick={() => {
						launch('explorer');
						onClose();
					}}>
					<span
						className='start-reco-swatch'
						aria-hidden='true'
						style={{ background: p.color }}>
						<FolderGit2 size={15} color='#fff' strokeWidth={2.1} />
					</span>
					<span>
						<strong>{p.name}</strong>
						<small>{p.tech.slice(0, 2).join(' · ')}</small>
					</span>
				</button>
			))}

			<a
				className='start-reco-item'
				href={profile.cvView}
				target='_blank'
				rel='noopener noreferrer'
				onClick={onClose}>
				<span
					className='start-reco-swatch'
					aria-hidden='true'
					style={{ background: 'linear-gradient(140deg, #ff8a65 0%, #b3300f 100%)' }}>
					<FileText size={15} color='#fff' strokeWidth={2.1} />
				</span>
				<span>
					<strong>Resume</strong>
					<small>PDF · opens in a new tab</small>
				</span>
			</a>
		</div>
	);
}
