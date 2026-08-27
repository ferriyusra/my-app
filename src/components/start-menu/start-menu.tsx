'use client';

import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { LiPower, LiSearch } from '@/components/icons/line-icons';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { APPS, APP_BY_ID, SHORTCUTS, START_PINNED } from '@/components/apps/registry';
import Flyout from '@/components/ui/flyout';
import StartApp from './start-app';
import RecommendedSection from './recommended-section';
import PowerMenu from './power-menu';
import { profile } from '@/data/profile';
import { excerpt, search, type Hit } from '@/lib/search';

type Entry = {
	key: string;
	title: string;
	blurb: string;
	tile: (typeof APPS)[number]['tile'];
	/** Set on entries that leave the page rather than opening a window. */
	href?: string;
	open: () => void;
};

export default function StartMenu({ onClose }: { onClose: () => void }) {
	const { launch, closeAll } = useWindowManager();
	const { setPower, replayBoot } = useShell();
	const [query, setQuery] = useState('');
	const [allApps, setAllApps] = useState(false);
	const [powerOpen, setPowerOpen] = useState(false);

	/* Apps and web shortcuts search as one list, the way Start does. */
	const entries = useMemo<Entry[]>(
		() => [
			...APPS.map((a) => ({
				key: a.id,
				title: a.title,
				blurb: a.blurb,
				tile: a.tile,
				open: () => launch(a.id),
			})),
			...SHORTCUTS.map((s) => ({
				key: s.id,
				title: s.title,
				blurb: s.blurb,
				tile: s.tile,
				href: s.href,
				open: () => {},
			})),
		],
		[launch],
	);

	const q = query.trim().toLowerCase();
	const results = q
		? entries.filter(
				(e) =>
					e.title.toLowerCase().includes(q) || e.blurb.toLowerCase().includes(q),
			)
		: [];

	/* Apps answer "what can I open"; content answers "where did they use Go".
	   Start shows both, apps first, because a name match is the stronger
	   intent when someone types one. */
	const hits = useMemo<Hit[]>(() => (q ? search(query) : []), [q, query]);
	const total = results.length + hits.length;

	/* Start pins the apps first, then the three web shortcuts. */
	const pinned = useMemo<Entry[]>(
		() => [
			...START_PINNED.map((id) => {
				const a = APP_BY_ID[id];
				return {
					key: id,
					title: a.title,
					blurb: a.blurb,
					tile: a.tile,
					open: () => launch(id),
				};
			}),
			...entries.filter((e) => e.href),
		],
		[entries, launch],
	);

	const listed = useMemo(
		() => [...entries].sort((a, b) => a.title.localeCompare(b.title)),
		[entries],
	);

	return (
		<Flyout
			className='start'
			label='Start menu'
			anchor='centre'
			onClose={onClose}
			ignoreSelector='.tb-start'>
			<label className='start-search'>
				<LiSearch size={16} aria-hidden='true' />
				<input
					type='search'
					value={query}
					autoFocus
					placeholder='Search apps, projects and links'
					aria-label='Search apps'
					onChange={(e) => setQuery(e.target.value)}
				/>
			</label>

			{q ? (
				<section className='start-section'>
					<p className='start-label'>
						{total} result{total === 1 ? '' : 's'}
					</p>
					{total === 0 ? (
						<p className='start-empty'>
							Nothing matches &ldquo;{query}&rdquo;. Try &ldquo;Meditap&rdquo;,
							&ldquo;Pub/Sub&rdquo; or &ldquo;Kafka&rdquo;.
						</p>
					) : (
						<>
							{results.length > 0 && (
								<div className='start-rows'>
									{results.map((e) => (
										<StartApp
											key={e.key}
											variant='row'
											title={e.title}
											blurb={e.blurb}
											tile={e.tile}
											href={e.href}
											onSelect={() => {
												e.open();
												onClose();
											}}
										/>
									))}
								</div>
							)}

							{hits.length > 0 && (
								<>
									<p className='start-label start-label-sub'>In your work</p>
									<div className='start-hits'>
										{hits.map((h) => {
											const quote = excerpt(h, query);
											return (
												<button
													key={h.id}
													type='button'
													className='start-hit'
													onClick={() => {
														launch(h.app);
														onClose();
													}}>
													<span className='start-hit-kind'>{h.kind}</span>
													<span className='start-hit-body'>
														<strong>{h.title}</strong>
														<span>{quote ?? h.subtitle}</span>
													</span>
													<ChevronRight size={14} aria-hidden='true' />
												</button>
											);
										})}
									</div>
								</>
							)}
						</>
					)}
				</section>
			) : allApps ? (
				<section className='start-section'>
					<header className='start-head'>
						<p className='start-label'>All apps</p>
						<button
							type='button'
							className='start-more'
							onClick={() => setAllApps(false)}>
							Back
						</button>
					</header>
					<div className='start-rows'>
						{listed.map((e) => (
							<StartApp
								key={e.key}
								variant='row'
								title={e.title}
								blurb={e.blurb}
								tile={e.tile}
								href={e.href}
								onSelect={() => {
									e.open();
									onClose();
								}}
							/>
						))}
					</div>
				</section>
			) : (
				<>
					<section className='start-section'>
						<header className='start-head'>
							<p className='start-label'>Pinned</p>
							<button
								type='button'
								className='start-more'
								onClick={() => setAllApps(true)}>
								All apps <ChevronRight size={14} aria-hidden='true' />
							</button>
						</header>
						<div className='start-grid'>
							{pinned.map((e) => (
								<StartApp
									key={e.key}
									title={e.title}
									tile={e.tile}
									href={e.href}
									onSelect={() => {
										e.open();
										onClose();
									}}
								/>
							))}
						</div>
					</section>

					<section className='start-section'>
						<header className='start-head'>
							<p className='start-label'>Recommended</p>
						</header>
						<RecommendedSection onClose={onClose} />
					</section>
				</>
			)}

			<footer className='start-foot'>
				<a
					className='start-user'
					href={`mailto:${profile.email}`}
					aria-label={`Email ${profile.name}`}>
					<span className='start-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					{profile.name}
				</a>

				<span className='start-power-wrap'>
					<button
						type='button'
						className='start-power'
						aria-label='Power'
						aria-expanded={powerOpen}
						aria-haspopup='menu'
						onClick={() => setPowerOpen((v) => !v)}>
						<LiPower size={16} aria-hidden='true' />
					</button>
					{powerOpen && (
						<PowerMenu
							onClose={() => setPowerOpen(false)}
							onShutdown={() => setPower('off')}
							onRestart={() => {
								closeAll();
								replayBoot();
							}}
							onSleep={() => setPower('sleep')}
						/>
					)}
				</span>
			</footer>
		</Flyout>
	);
}
