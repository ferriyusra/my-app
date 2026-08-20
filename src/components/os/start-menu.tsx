'use client';

import { useEffect, useRef } from 'react';
import { Power, FileText } from 'lucide-react';
import { profile } from '@/data/profile';
import { useWindows } from './window-store';
import { APPS } from './apps/registry';

export default function StartMenu({ onClose }: { onClose: () => void }) {
	const { open } = useWindows();
	const ref = useRef<HTMLDivElement>(null);

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
			<p className='start-label'>Pinned</p>
			<div className='start-grid'>
				{APPS.map(({ id, title, Icon, tint }) => (
					<button
						key={id}
						type='button'
						className='start-tile'
						onClick={() => {
							open(id);
							onClose();
						}}>
						<span className='start-tile-icon' style={{ background: `${tint}1f` }}>
							<Icon size={22} aria-hidden='true' style={{ color: tint }} />
						</span>
						{title}
					</button>
				))}
				<a
					className='start-tile'
					href={profile.cvView}
					target='_blank'
					rel='noopener noreferrer'
					onClick={onClose}>
					<span className='start-tile-icon' style={{ background: '#6161611f' }}>
						<FileText size={22} aria-hidden='true' />
					</span>
					Resume
				</a>
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
