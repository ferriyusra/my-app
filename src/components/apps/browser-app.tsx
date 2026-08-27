'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, RotateCw, X } from 'lucide-react';
import { LiArrowLeft, LiArrowRight, LiLock, LiPlus, LiSearch, LiStar } from '@/components/icons/line-icons';
import { BrowserIcon } from '@/components/icons/app-icons';
import { APPS } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';
import { useWindowManager } from '@/hooks/use-window-manager';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';

/**
 * A browser window whose address bar navigates *this* desktop.
 *
 * It would be dishonest — and impossible under any sane CSP — to render
 * github.com inside a portfolio, so this does the one thing a browser here
 * can genuinely do: it is the launcher for every real URL the work points at,
 * and its search box opens the apps on this machine. Anything off-site leaves
 * in a real tab.
 */

type Tab = { id: string; title: string; url: string };

const START_TAB: Tab = {
	id: 'start',
	title: 'New tab',
	url: 'portfolio://start',
};

const BOOKMARKS = [
	{ label: 'GitHub', href: profile.github },
	{ label: 'LinkedIn', href: profile.linkedin },
	{ label: 'Resume', href: profile.cvView },
	{ label: 'ferriyusra.com', href: profile.site },
];

export default function BrowserApp() {
	const { launch } = useWindowManager();
	const [tabs, setTabs] = useState<Tab[]>([START_TAB]);
	const [activeId, setActiveId] = useState(START_TAB.id);
	const [query, setQuery] = useState('');

	const live = useMemo(
		() => projects.filter((p) => p.demo || p.github),
		[],
	);

	const q = query.trim().toLowerCase();
	const appHits = q
		? APPS.filter((a) => a.title.toLowerCase().includes(q) || a.blurb.toLowerCase().includes(q))
		: [];
	const siteHits = q
		? live.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.tech.some((t) => t.toLowerCase().includes(q)),
			)
		: [];

	const openExternal = (title: string, href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer');
		/* Windows leaves the tab it opened in the strip, so the visitor can
		   see where they have been. */
		setTabs((t) =>
			t.some((x) => x.url === href) ? t : [...t, { id: href, title, url: href }],
		);
	};

	const closeTab = (id: string) => {
		if (id === START_TAB.id) return;
		setTabs((t) => t.filter((x) => x.id !== id));
		if (activeId === id) setActiveId(START_TAB.id);
	};

	const active = tabs.find((t) => t.id === activeId) ?? START_TAB;

	return (
		<div className='br-shell'>
			<div className='br-tabs' role='tablist' aria-label='Browser tabs'>
				{tabs.map((t) => (
					<span key={t.id} className='br-tab' data-active={t.id === activeId || undefined}>
						<button
							type='button'
							role='tab'
							aria-selected={t.id === activeId}
							className='br-tab-btn'
							onClick={() => setActiveId(t.id)}>
							<BrowserIcon size={14} />
							<span className='br-tab-title'>{t.title}</span>
						</button>
						{t.id !== START_TAB.id && (
							<button
								type='button'
								className='br-tab-close'
								aria-label={`Close ${t.title}`}
								onClick={() => closeTab(t.id)}>
								<X size={12} aria-hidden='true' />
							</button>
						)}
					</span>
				))}
				<button
					type='button'
					className='br-newtab'
					aria-label='New tab'
					onClick={() => setActiveId(START_TAB.id)}>
					<LiPlus size={14} aria-hidden='true' />
				</button>
			</div>

			<div className='br-bar'>
				<button type='button' className='xp-icon-btn' aria-label='Back' disabled>
					<LiArrowLeft size={16} aria-hidden='true' />
				</button>
				<button type='button' className='xp-icon-btn' aria-label='Forward' disabled>
					<LiArrowRight size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Reload'
					onClick={() => setQuery('')}>
					<RotateCw size={15} aria-hidden='true' />
				</button>

				<label className='br-omnibox'>
					<LiLock size={13} aria-hidden='true' />
					<input
						type='search'
						value={query}
						placeholder={active.url}
						aria-label='Search this desktop or pick a link'
						onChange={(e) => {
							setQuery(e.target.value);
							setActiveId(START_TAB.id);
						}}
					/>
					<LiSearch size={14} aria-hidden='true' />
				</label>
			</div>

			<div className='br-favs'>
				<LiStar size={13} aria-hidden='true' />
				{BOOKMARKS.map((b) => (
					<button
						key={b.label}
						type='button'
						className='br-fav'
						onClick={() => openExternal(b.label, b.href)}>
						{b.label}
					</button>
				))}
			</div>

			<div className='br-page'>
				{q ? (
					<div className='br-results'>
						<h2>
							{appHits.length + siteHits.length} result
							{appHits.length + siteHits.length === 1 ? '' : 's'} for &ldquo;{query}
							&rdquo;
						</h2>
						{appHits.map((a) => (
							<button
								key={a.id}
								type='button'
								className='br-result'
								onClick={() => launch(a.id)}>
								<AppTile tile={a.tile} size={26} />
								<span>
									<strong>{a.title}</strong>
									<small>portfolio://apps/{a.id} — {a.blurb}</small>
								</span>
							</button>
						))}
						{siteHits.map((p) => (
							<button
								key={p.id}
								type='button'
								className='br-result'
								onClick={() =>
									openExternal(p.name, (p.demo ?? p.github)!)
								}>
								<span className='br-result-dot' style={{ background: p.color }} aria-hidden='true' />
								<span>
									<strong>{p.name}</strong>
									<small>{p.demo ?? p.github}</small>
								</span>
								<ExternalLink size={14} aria-hidden='true' />
							</button>
						))}
						{appHits.length + siteHits.length === 0 && (
							<p className='br-empty'>
								Nothing here matches. Try &ldquo;Go&rdquo;, &ldquo;dashboard&rdquo;
								or &ldquo;skills&rdquo;.
							</p>
						)}
					</div>
				) : (
					<div className='br-start'>
						<h2>Where would you like to go?</h2>
						<p className='br-start-sub'>
							The address bar searches this desktop. Anything off-site opens in a
							real browser tab.
						</p>

						<h3>Apps on this machine</h3>
						<div className='br-tiles'>
							{APPS.filter((a) => a.id !== 'edge').map((a) => (
								<button
									key={a.id}
									type='button'
									className='br-tile'
									onClick={() => launch(a.id)}>
									<AppTile tile={a.tile} size={30} />
									{a.title}
								</button>
							))}
						</div>

						<h3>Live work</h3>
						<div className='br-links'>
							{live.map((p) => (
								<button
									key={p.id}
									type='button'
									className='br-link'
									onClick={() => openExternal(p.name, (p.demo ?? p.github)!)}>
									<span className='br-result-dot' style={{ background: p.color }} aria-hidden='true' />
									<span>
										<strong>{p.name}</strong>
										<small>{p.demo ?? p.github}</small>
									</span>
									<ExternalLink size={14} aria-hidden='true' />
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
