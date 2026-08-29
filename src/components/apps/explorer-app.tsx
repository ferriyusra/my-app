'use client';

import { useCallback, useMemo, useState } from 'react';
import {
	DocumentIcon,
	FolderIcon,
	RecycleIcon,
} from '@/components/icons/app-icons';
import { LiBriefcase, LiLayers } from '@/components/icons/line-icons';
import ExplorerSidebar, {
	LOCATION_LABEL,
	PARENT,
	type NavKey,
} from '@/components/explorer/explorer-sidebar';
import ExplorerToolbar, {
	type SortKey,
	type ViewMode,
} from '@/components/explorer/explorer-toolbar';
import Breadcrumb from '@/components/explorer/breadcrumb';
import FolderCard from '@/components/explorer/folder-card';
import FileRow from '@/components/explorer/file-row';
import ProjectDetail from '@/components/explorer/project-detail';
import RoleDetail from '@/components/explorer/role-detail';
import CaseStudyBody from '@/components/content/case-study-body';
import DiscardedDetail, { when } from '@/components/content/discarded-detail';
import type { FsEntry } from '@/components/explorer/types';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { experiences, tenureLabel } from '@/data/experience';
import { caseStudy } from '@/data/case-study';
import { discarded } from '@/data/discarded';

type Loc = { nav: NavKey; item?: string };

/** A tinted folder for a project, so a grid of them is scannable by colour. */
function ProjectFolder({ colour }: { colour: string }) {
	return (
		<span className='xp-folder-mark' style={{ ['--fold' as string]: colour }}>
			<FolderIcon size={40} />
			<span className='xp-folder-dot' aria-hidden='true' />
		</span>
	);
}

/**
 * Projects and documents, presented as Windows 11's File Explorer.
 *
 * Every folder here is real data. Three of them used to hold applications
 * wearing file icons — which is worse than an empty folder, because it teaches
 * the visitor the file metaphor is a costume and then the one folder that was
 * genuine gets no credit for it either.
 */
export default function ExplorerApp() {
	const [history, setHistory] = useState<Loc[]>([{ nav: 'portfolio' }]);
	const [index, setIndex] = useState(0);
	const [view, setView] = useState<ViewMode>('grid');
	const [sort, setSort] = useState<SortKey>('default');
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState<string | null>(null);

	const loc = history[index];

	const go = useCallback(
		(next: Loc) => {
			setHistory((h) => [...h.slice(0, index + 1), next]);
			setIndex((i) => i + 1);
			setSelected(null);
			setQuery('');
		},
		[index],
	);

	/* Featured first — the order the folder is in, which `sort: 'default'`
	   preserves. It used to be computed here and then discarded by an
	   alphabetical sort that could not be turned off. */
	const ordered = useMemo(
		() => [
			...projects.filter((p) => p.featured),
			...projects.filter((p) => !p.featured),
		],
		[],
	);

	/* Newest first, the way a CV reads. */
	const roles = useMemo(
		() => [...experiences].sort((a, b) => b.startISO.localeCompare(a.startISO)),
		[],
	);

	/* ── Folder contents ─────────────────────────────────────── */

	const entries = useMemo<FsEntry[]>(() => {
		const resume: FsEntry = {
			id: 'resume',
			name: 'Ferri-Yusra-CV.pdf',
			type: 'PDF document',
			meta: 'Opens in a new tab',
			icon: <DocumentIcon size={40} />,
			href: profile.cvView,
			onOpen: () =>
				window.open(profile.cvView, '_blank', 'noopener,noreferrer'),
		};

		const folder = (
			nav: NavKey,
			name: string,
			meta: string,
			icon: FsEntry['icon'],
		): FsEntry => ({
			id: nav,
			name,
			type: 'File folder',
			meta,
			icon,
			onOpen: () => go({ nav }),
		});

		switch (loc.nav) {
			case 'portfolio':
				return ordered.map((p) => ({
					id: p.id,
					name: p.name,
					type: p.type === 'real' ? 'Production project' : 'Case study',
					meta: p.tech.slice(0, 3).join(' · '),
					icon: <ProjectFolder colour={p.color} />,
					onOpen: () => go({ nav: 'portfolio', item: p.id }),
				}));

			case 'roles':
				return roles.map((r) => ({
					id: r.short,
					name: `${r.short} — ${r.role}`,
					type: r.current ? 'Current role' : 'Previous role',
					meta: `${r.period} · ${tenureLabel(r)}`,
					icon: (
						<span className='xp-file-mark' style={{ background: '#0e7c70' }} aria-hidden='true'>
							<LiBriefcase size={20} color='#fff' strokeWidth={2.1} />
						</span>
					),
					onOpen: () => go({ nav: 'roles', item: r.short }),
				}));

			case 'case-study':
				return [
					{
						id: caseStudy.slug,
						name: caseStudy.title,
						type: 'Case study',
						meta: `${caseStudy.at} · ${caseStudy.period}`,
						icon: (
							<span className='xp-file-mark' style={{ background: '#6d3fd4' }} aria-hidden='true'>
								<LiLayers size={20} color='#fff' strokeWidth={2.1} />
							</span>
						),
						onOpen: () => go({ nav: 'case-study', item: caseStudy.slug }),
					},
				];

			case 'decisions':
				return discarded.map((d) => ({
					id: d.name,
					name: d.name,
					type: d.commit ? 'Removed in a commit' : 'Reverted before commit',
					meta: `${d.origin} · ${when(d.date)}`,
					icon: <DocumentIcon size={40} />,
					onOpen: () => go({ nav: 'decisions', item: d.name }),
				}));

			case 'documents':
				return [
					folder(
						'roles',
						'Roles',
						`${roles.length} roles since 2021`,
						<FolderIcon size={40} />,
					),
					folder(
						'case-study',
						'Case study',
						caseStudy.title,
						<FolderIcon size={40} />,
					),
					folder(
						'decisions',
						'Decisions reversed',
						`${discarded.length} things built and thrown away`,
						<RecycleIcon size={40} />,
					),
					resume,
				];

			case 'home':
			default:
				return [
					folder(
						'portfolio',
						'Portfolio',
						`${ordered.length} projects`,
						<FolderIcon size={40} />,
					),
					folder('documents', 'Documents', '4 items', <FolderIcon size={40} />),
					resume,
				];
		}
	}, [loc.nav, ordered, roles, go]);

	/* ── What is open, if anything ───────────────────────────── */

	const openProject =
		loc.nav === 'portfolio' && loc.item
			? (ordered.find((p) => p.id === loc.item) ?? null)
			: null;
	const openRole =
		loc.nav === 'roles' && loc.item
			? (roles.find((r) => r.short === loc.item) ?? null)
			: null;
	const openDecision =
		loc.nav === 'decisions' && loc.item
			? (discarded.find((d) => d.name === loc.item) ?? null)
			: null;
	const openCase = loc.nav === 'case-study' && !!loc.item;
	const openItem = openProject || openRole || openDecision || openCase;

	/* ── Filter and sort ─────────────────────────────────────── */

	const shown = useMemo(() => {
		const q = query.trim().toLowerCase();
		const filtered = q
			? entries.filter(
					(e) =>
						e.name.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q),
				)
			: entries;
		if (sort === 'default') return filtered;
		return [...filtered].sort((a, b) =>
			sort === 'type'
				? a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
				: a.name.localeCompare(b.name),
		);
	}, [entries, query, sort]);

	/* ── Chrome ──────────────────────────────────────────────── */

	/* Walk up the parents so a folder three deep still says where it is. */
	const ancestors = useMemo(() => {
		const chain: NavKey[] = [];
		for (let key: NavKey | null = loc.nav; key; key = PARENT[key]) {
			chain.unshift(key);
		}
		return chain;
	}, [loc.nav]);

	const openName =
		openProject?.name ??
		(openRole ? `${openRole.short} — ${openRole.role}` : null) ??
		openDecision?.name ??
		(openCase ? caseStudy.title : null);

	const trail = [
		{ label: 'This PC', onSelect: () => go({ nav: 'home' }) },
		...ancestors
			.filter((k) => k !== 'home')
			.map((k) => ({ label: LOCATION_LABEL[k], onSelect: () => go({ nav: k }) })),
		...(openName ? [{ label: openName }] : []),
	];

	const here = LOCATION_LABEL[loc.nav];
	const selectedEntry = shown.find((e) => e.id === selected);

	return (
		<div className='xp-shell'>
			<ExplorerSidebar
				active={loc.nav}
				githubHref={profile.github}
				onSelect={(nav) => go({ nav })}
			/>

			<div className='xp-main'>
				<ExplorerToolbar
					canBack={index > 0}
					canForward={index < history.length - 1}
					canUp={!!openItem || loc.nav !== 'home'}
					onBack={() => {
						setIndex((i) => Math.max(0, i - 1));
						setSelected(null);
					}}
					onForward={() => {
						setIndex((i) => Math.min(history.length - 1, i + 1));
						setSelected(null);
					}}
					/* Up leaves an open item for its folder, then walks the parent
					   chain. It used to jump straight to Home from any depth, which
					   was right while the tree was two levels and is not now. */
					onUp={() =>
						go(
							openItem
								? { nav: loc.nav }
								: { nav: PARENT[loc.nav] ?? 'home' },
						)
					}
					onRefresh={() => {
						setSelected(null);
						setQuery('');
					}}
					view={view}
					onView={setView}
					sort={sort}
					onSort={setSort}
					query={query}
					onQuery={setQuery}
					searchLabel={`Search ${openName ?? here}`}
				/>

				<div className='xp-bar'>
					<Breadcrumb trail={trail} />
				</div>

				<div className='xp-body'>
					{openProject ? (
						<ProjectDetail project={openProject} />
					) : openRole ? (
						<RoleDetail role={openRole} />
					) : openDecision ? (
						<article className='xp-detail'>
							<DiscardedDetail item={openDecision} />
						</article>
					) : openCase ? (
						<article className='xp-detail'>
							<CaseStudyBody />
						</article>
					) : shown.length === 0 ? (
						<p className='xp-empty'>
							{query
								? `Nothing in ${here} matches “${query}”.`
								: 'This folder is empty.'}
						</p>
					) : view === 'grid' ? (
						<div className='xp-grid'>
							{shown.map((e) => (
								<FolderCard
									key={e.id}
									entry={e}
									selected={selected === e.id}
									onSelect={() => setSelected(e.id)}
								/>
							))}
						</div>
					) : (
						<div
							className={`xp-rows${view === 'details' ? ' xp-rows-details' : ''}`}
							role='table'
							aria-label={here}>
							{view === 'details' && (
								<div className='xp-rows-head' role='row'>
									<span role='columnheader'>Name</span>
									<span role='columnheader'>Type</span>
									<span role='columnheader'>Details</span>
								</div>
							)}
							{shown.map((e) => (
								<FileRow
									key={e.id}
									entry={e}
									details={view === 'details'}
									selected={selected === e.id}
									onSelect={() => setSelected(e.id)}
								/>
							))}
						</div>
					)}
				</div>

				<footer className='xp-status'>
					<span>
						{openProject
							? `${openProject.name} · ${openProject.tech.length} technologies`
							: openRole
								? `${openRole.short} · ${openRole.achievements.length} outcomes`
								: openDecision
									? `${openDecision.name} · ${openDecision.commit ?? 'never committed'}`
									: openCase
										? `${caseStudy.at} · ${caseStudy.sections.length} sections`
										: `${shown.length} item${shown.length === 1 ? '' : 's'}`}
					</span>
					{selectedEntry && !openItem && (
						<span className='xp-status-sel'>
							1 selected · {selectedEntry.type} — double-click to open
						</span>
					)}
				</footer>
			</div>
		</div>
	);
}
