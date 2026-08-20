'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WindowProvider, useWindows } from './window-store';
import WindowFrame from './window-frame';
import Taskbar from './taskbar';
import StartMenu from './start-menu';
import { APPS, APP_BY_ID } from './apps/registry';
import AppTile from './app-tile';
import { profile } from '@/data/profile';

function DesktopIcons() {
	const { open } = useWindows();
	const [selected, setSelected] = useState<string | null>(null);
	return (
		<ul className='desk-icons' onPointerDown={() => setSelected(null)}>
			{APPS.map((app) => (
				<li key={app.id}>
					<button
						type='button'
						className='desk-icon'
						data-selected={selected === app.id}
						onPointerDown={(e) => {
							e.stopPropagation();
							setSelected(app.id);
						}}
						onDoubleClick={() => open(app.id)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								open(app.id);
							}
						}}
						aria-label={`Open ${app.title}`}>
						<AppTile app={app} size={46} />
						{app.title}
					</button>
				</li>
			))}
		</ul>
	);
}

function Windows() {
	const { windows } = useWindows();
	const topZ = Math.max(0, ...windows.map((w) => w.z));

	return (
		/* AnimatePresence lets a window play its exit animation when it is
		   closed or minimised, instead of vanishing. */
		<AnimatePresence>
			{windows.map((w) => {
				const app = APP_BY_ID[w.id];
				const { Content } = app;
				if (w.minimised) return null;
				return (
					<WindowFrame
						key={w.id}
						id={w.id}
						title={app.title}
						icon={<AppTile app={app} size={16} />}
						x={w.x}
						y={w.y}
						w={w.w}
						h={w.h}
						z={w.z}
						maximised={w.maximised}
						focused={w.z === topZ}>
						<Content />
					</WindowFrame>
				);
			})}
		</AnimatePresence>
	);
}

/** Below this width a windowing metaphor stops being usable. */
const DESKTOP_MIN = 900;

function Shell() {
	const { open, windows } = useWindows();
	const [startOpen, setStartOpen] = useState(false);
	const [narrow, setNarrow] = useState(false);

	useEffect(() => {
		const check = () => setNarrow(window.innerWidth < DESKTOP_MIN);
		check();
		window.addEventListener('resize', check, { passive: true });
		return () => window.removeEventListener('resize', check);
	}, []);

	/* Open About once on first load so the desktop is never blank. */
	useEffect(() => {
		open('about');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (narrow) {
		return (
			<div className='mobile-shell' id='main'>
				<header className='mobile-head'>
					<span className='desk-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					<div>
						<h1>{profile.name}</h1>
						<p>
							{profile.role} — {profile.location}
						</p>
					</div>
				</header>
				<p className='mobile-intro'>{profile.headline}</p>
				{APPS.map((app) => (
					<section key={app.id} className='mobile-card' aria-label={app.title}>
						<h2>
							<AppTile app={app} size={22} />
							{app.title}
						</h2>
						<app.Content />
					</section>
				))}
			</div>
		);
	}

	return (
		<div className='desktop' id='main'>
			<DesktopIcons />
			<Windows />
			{startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
			<Taskbar
				startOpen={startOpen}
				onToggleStart={() => setStartOpen((v) => !v)}
			/>
			<p className='desk-hint' aria-hidden='true'>
				{windows.length === 0
					? 'Double-click an icon, or press Start'
					: 'Drag a title bar to move · Esc closes'}
			</p>
		</div>
	);
}

export default function Desktop() {
	return (
		<WindowProvider>
			<Shell />
		</WindowProvider>
	);
}
