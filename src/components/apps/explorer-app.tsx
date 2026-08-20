'use client';

import { useCallback, useMemo, useState } from 'react';
import { Briefcase, Layers, Mail, User } from 'lucide-react';
import {
	DocumentIcon,
	FolderIcon,
	ThisPcIcon,
} from '@/components/icons/app-icons';
import ExplorerSidebar, {
	NAV,
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
import type { FsEntry } from '@/components/explorer/types';
import { useWindowManager } from '@/hooks/use-window-manager';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import type { AppId } from '@/types/windows';

type Loc = { nav: NavKey; project?: string };

const LABEL: Record<NavKey, string> = Object.fromEntries(
	NAV.map((n) => [n.key, n.label]),
) as Record<NavKey, string>;

/** A tinted folder for a project, so a grid of them is scannable by colour. */
function ProjectFolder({ colour }: { colour: string }) {
	return (
		<span className='xp-folder-mark' style={{ ['--fold' as string]: colour }}>
			<FolderIcon size={40} />
			<span className='xp-folder-dot' aria-hidden='true' />
		</span>
	);
}

/** Projects and documents, presented as Windows 11's File Explorer. */
export default function ExplorerApp() {
	const { launch } = useWindowManager();

	const [history, setHistory] = useState<Loc[]>([{ nav: 'portfolio' }]);
	const [index, setIndex] = useState(0);
	const [view, setView] = useState<ViewMode>('grid');
	const [sort, setSort] = useState<SortKey>('name');
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

	const openApp = useCallback((id: AppId) => launch(id), [launch]);

	const ordered = useMemo(
		() => [
			...projects.filter((p) => p.featured),
			...projects.filter((p) => !p.featured),
		],
		[],
	);

	const current = loc.project
		? (ordered.find((p) => p.id === loc.project) ?? null)
		: null;

	/* ── Folder contents ─────────────────────────────────────── */

	const entries = useMemo<FsEntry[]>(() => {
		const resume: FsEntry = {
			id: 'resume',
			name: 'Ferri-Yusra-CV.pdf',
			type: 'PDF document',
			meta: 'Opens in a new tab',
			icon: <DocumentIcon size={40} />,
			href: profile.cvView,
			onOpen: () => window.open(profile.cvView, '_blank', 'noopener,noreferrer'),
		};

		const appFile = (
			id: AppId,
			name: string,
			type: string,
			meta: string,
			Icon: typeof User,
			tint: string,
		): FsEntry => ({
			id,
			name,
			type,
			meta,
			icon: (
				<span className='xp-file-mark' style={{ background: tint }} aria-hidden='true'>
					<Icon size={20} color='#fff' strokeWidth={2.1} />
				</span>
			),
			onOpen: () => openApp(id),
		});

		switch (loc.nav) {
			case 'portfolio':
				return ordered.map((p) => ({
					id: p.id,
					name: p.name,
					type: p.type === 'real' ? 'Production project' : 'Case study',
					meta: p.tech.slice(0, 3).join(' · '),
					icon: <ProjectFolder colour={p.color} />,
					onOpen: () => go({ nav: 'portfolio', project: p.id }),
				}));

			case 'documents':
				return [
					resume,
					appFile('about', 'About-Me', 'Profile', 'Bio and specifications', User, '#0f6cbd'),
					appFile(
						'experience',
						'Experience',
						'Work history',
						`${experiences.length} roles since 2021`,
						Briefcase,
						'#0e7c70',
					),
					appFile('skills', 'Skills', 'Tech stack', `${skills.length} tools by category`, Layers, '#6d3fd4'),
				];

			case 'downloads':
				return [resume];

			case 'desktop':
				return [
					appFile('about', 'About Me', 'Application', 'System properties', User, '#0f6cbd'),
					{
						id: 'portfolio',
						name: 'Projects',
						type: 'File folder',
						meta: `${ordered.length} items`,
						icon: <FolderIcon size={40} />,
						onOpen: () => go({ nav: 'portfolio' }),
					},
					appFile('skills', 'Skills', 'Application', 'Tech stack', Layers, '#6d3fd4'),
					appFile('experience', 'Experience', 'Application', 'Roles and outcomes', Briefcase, '#0e7c70'),
					appFile('contact', 'Contact', 'Application', 'Send a message', Mail, '#1454a8'),
				];

			case 'home':
			default:
				return [
					{
						id: 'portfolio',
						name: 'Portfolio',
						type: 'File folder',
						meta: `${ordered.length} projects`,
						icon: <FolderIcon size={40} />,
						onOpen: () => go({ nav: 'portfolio' }),
					},
					{
						id: 'documents',
						name: 'Documents',
						type: 'File folder',
						meta: '4 items',
						icon: <FolderIcon size={40} />,
						onOpen: () => go({ nav: 'documents' }),
					},
					{
						id: 'downloads',
						name: 'Downloads',
						type: 'File folder',
						meta: '1 item',
						icon: <FolderIcon size={40} />,
						onOpen: () => go({ nav: 'downloads' }),
					},
					{
						id: 'pc',
						name: 'Local Disk (C:)',
						type: 'Local disk',
						meta: 'Everything on this desktop',
						icon: <ThisPcIcon size={40} />,
						onOpen: () => go({ nav: 'desktop' }),
					},
					resume,
				];
		}
	}, [loc.nav, ordered, go, openApp]);

	/* ── Filter and sort ─────────────────────────────────────── */

	const shown = useMemo(() => {
		const q = query.trim().toLowerCase();
		const filtered = q
			? entries.filter(
					(e) =>
						e.name.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q),
				)
			: entries;
		return [...filtered].sort((a, b) =>
			sort === 'type'
				? a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
				: a.name.localeCompare(b.name),
		);
	}, [entries, query, sort]);

	/* ── Chrome ──────────────────────────────────────────────── */

	const trail = [
		{ label: 'This PC', onSelect: () => go({ nav: 'home' }) },
		{ label: LABEL[loc.nav], onSelect: () => go({ nav: loc.nav }) },
		...(current ? [{ label: current.name }] : []),
	];

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
					canUp={!!current || loc.nav !== 'home'}
					onBack={() => {
						setIndex((i) => Math.max(0, i - 1));
						setSelected(null);
					}}
					onForward={() => {
						setIndex((i) => Math.min(history.length - 1, i + 1));
						setSelected(null);
					}}
					onUp={() =>
						go(current ? { nav: loc.nav } : { nav: 'home' })
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
					searchLabel={`Search ${current ? current.name : LABEL[loc.nav]}`}
				/>

				<div className='xp-bar'>
					<Breadcrumb trail={trail} />
				</div>

				<div className='xp-body'>
					{current ? (
						<ProjectDetail project={current} />
					) : shown.length === 0 ? (
						<p className='xp-empty'>
							{query
								? `Nothing in ${LABEL[loc.nav]} matches “${query}”.`
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
							aria-label={LABEL[loc.nav]}>
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
						{current
							? `${current.name} · ${current.tech.length} technologies`
							: `${shown.length} item${shown.length === 1 ? '' : 's'}`}
					</span>
					{selectedEntry && !current && (
						<span className='xp-status-sel'>
							1 selected · {selectedEntry.type} — double-click to open
						</span>
					)}
				</footer>
			</div>
		</div>
	);
}
