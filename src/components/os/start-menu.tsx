'use client';

import { useEffect, useRef, useState } from 'react';
import { Power, FileText, Search } from 'lucide-react';
import { profile } from '@/data/profile';
import { useWindows } from './window-store';
import { APPS } from './apps/registry';
import AppTile from './app-tile';

export default function StartMenu({ onClose }: { onClose: () => void }) {
	const { open } = useWindows();
	const ref = useRef<HTMLDivElement>(null);
	const [q, setQ] = useState('');
	const matches = APPS.filter((a) =>
		a.title.toLowerCase().includes(q.trim().toLowerCase()),
	);

	/* Click-away and Escape both dismiss, as in Windows. */
	useEffect(() => {
		const onDown = (e: PointerEvent) => {
			const t = e.target as HTMLElement;
			if (!ref.current?.contains(t) && !t.closest('.tb-start')) onClose();
		};
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		document.addEventListener('pointerdown', onDown);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onDown);
			window.removeEventListener('keydown', onKey);
		};
	}, [onClose]);

	return (
		<div className='start' ref={ref} role='dialog' aria-label='Start menu'>
			{/* Windows 11 opens Start with search focused. It also makes the
			    menu usable from the keyboard without tabbing the whole grid. */}
			<label className='start-search'>
				<Search size={16} aria-hidden='true' />
				<input
					type='search'
					value={q}
					autoFocus
					placeholder='Search apps'
					aria-label='Search apps'
					onChange={(e) => setQ(e.target.value)}
				/>
			</label>

			<p className='start-label'>{q ? 'Results' : 'Pinned'}</p>
			<div className='start-grid'>
				{matches.map((app) => (
					<button
						key={app.id}
						type='button'
						className='start-tile'
						onClick={() => {
							open(app.id);
							onClose();
						}}>
						<AppTile app={app} size={38} />
						{app.title}
					</button>
				))}
				{!q && (
				<a
					className='start-tile'
					href={profile.cvView}
					target='_blank'
					rel='noopener noreferrer'
					onClick={onClose}>
					<span
						className='app-tile'
						aria-hidden='true'
						style={{
							width: 38,
							height: 38,
							borderRadius: 8,
							background: 'linear-gradient(140deg, #9aa4b2 0%, #5b6673 100%)',
						}}>
						<FileText size={20} color='#fff' strokeWidth={2.1} />
					</span>
					Resume
				</a>
				)}
				{q && matches.length === 0 && (
					<p className='start-empty'>No apps match &ldquo;{q}&rdquo;.</p>
				)}
			</div>

			<footer className='start-foot'>
				<span className='start-user'>
					<span className='start-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					{profile.name}
				</span>
				<a
					href={`mailto:${profile.email}`}
					className='start-power'
					aria-label='Email me'>
					<Power size={16} aria-hidden='true' />
				</a>
			</footer>
		</div>
	);
}
