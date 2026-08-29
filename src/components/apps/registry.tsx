'use client';

import dynamic from 'next/dynamic';

import {
	BriefcaseIcon,
	CodeIcon,
	DocumentIcon,
	FolderIcon,
	GearIcon,
	GitHubIcon,
	LayersIcon,
	LinkedInIcon,
	MailIcon,
	MediaIcon,
	PersonIcon,
	RecycleIcon,
	TipsIcon,
	CareerIcon,
	TerminalIcon,
} from '@/components/icons/app-icons';
import type { TileArt } from '@/components/ui/app-tile';
import type { AppId, ShortcutId } from '@/types/windows';
import { profile } from '@/data/profile';

/**
 * App bodies are split out of the initial bundle.
 *
 * Every one of them used to ship on first load even though the desktop opens
 * with a single window — 802KB of script for one visible app. A window mounts
 * its content when it opens, which is exactly the moment to fetch it.
 *
 * `ssr: false` because none of this renders on the server anyway: the desktop
 * shell only mounts once the viewport has been measured on the client.
 */
const lazy = (load: () => Promise<{ default: React.ComponentType }>) =>
	dynamic(load, {
		ssr: false,
		loading: () => (
			<div className='app-loading' role='status'>
				<span className='app-loading-spinner' aria-hidden='true' />
				<span className='sr-only'>Loading</span>
			</div>
		),
	});

const TipsApp = lazy(() => import('./tips-app'));
const AboutApp = lazy(() => import('./about-app'));
const ExplorerApp = lazy(() => import('./explorer-app'));
const SkillsApp = lazy(() => import('./skills-app'));
const ExperienceApp = lazy(() => import('./experience-app'));
const ContactApp = lazy(() => import('./contact-app'));
const MediaApp = lazy(() => import('./media-app'));
const SettingsApp = lazy(() => import('./settings-app'));
const EditorApp = lazy(() => import('./editor-app'));
const RecycleBinApp = lazy(() => import('./recycle-bin-app'));
const CareerApp = lazy(() => import('./career-app'));
const TerminalApp = lazy(() => import('./terminal-app'));

export type AppDef = {
	id: AppId;
	/** Shown in the title bar, taskbar tooltip and Start. */
	title: string;
	/** One line of chrome under the title in Start's list view. */
	blurb: string;
	tile: TileArt;
	/** Default window size. Clamped to the desktop when it opens. */
	w: number;
	h: number;
	Content: React.ComponentType;
};

export const APPS: AppDef[] = [
	{
		id: 'tips',
		title: 'Tips',
		blurb: 'What this desktop does',
		tile: { Art: TipsIcon },
		w: 880,
		h: 600,
		Content: TipsApp,
	},
	{
		id: 'about',
		title: 'About Me',
		blurb: 'System properties',
		tile: { Art: PersonIcon },
		w: 860,
		h: 580,
		Content: AboutApp,
	},
	{
		id: 'explorer',
		title: 'File Explorer',
		blurb: 'Projects and documents',
		tile: { Art: FolderIcon },
		w: 1000,
		h: 640,
		Content: ExplorerApp,
	},
	{
		id: 'skills',
		title: 'Skills',
		blurb: 'Tech stack by category',
		tile: { Art: LayersIcon },
		w: 900,
		h: 600,
		Content: SkillsApp,
	},
	{
		id: 'experience',
		title: 'Experience',
		blurb: 'Roles and outcomes',
		tile: { Art: BriefcaseIcon },
		w: 920,
		h: 640,
		Content: ExperienceApp,
	},
	{
		id: 'contact',
		title: 'Mail',
		blurb: 'Send me a message',
		tile: { Art: MailIcon },
		w: 940,
		h: 620,
		Content: ContactApp,
	},
	{
		id: 'media',
		title: 'Media Player',
		blurb: 'Search and play music',
		tile: { Art: MediaIcon },
		w: 940,
		h: 620,
		Content: MediaApp,
	},
	{
		id: 'vscode',
		title: 'VS Code',
		blurb: 'Read this site’s source',
		tile: { Art: CodeIcon },
		w: 980,
		h: 620,
		Content: EditorApp,
	},
	{
		id: 'settings',
		title: 'Settings',
		blurb: 'Personalise this desktop',
		tile: { Art: GearIcon },
		w: 900,
		h: 600,
		Content: SettingsApp,
	},
	{
		id: 'recycle',
		title: 'Recycle Bin',
		blurb: 'Decisions this project reversed',
		tile: { Art: RecycleIcon },
		w: 860,
		h: 620,
		Content: RecycleBinApp,
	},
	{
		id: 'career',
		title: 'Career.exe',
		blurb: 'Walk the CV',
		tile: { Art: CareerIcon },
		w: 880,
		h: 560,
		Content: CareerApp,
	},
	{
		id: 'terminal',
		title: 'Terminal',
		blurb: 'The same work, on a prompt',
		tile: { Art: TerminalIcon },
		w: 760,
		h: 520,
		Content: TerminalApp,
	},
];

export const APP_BY_ID = Object.fromEntries(
	APPS.map((a) => [a.id, a]),
) as Record<AppId, AppDef>;

/** Desktop shortcuts that leave the page rather than opening a window. */
export type ShortcutDef = {
	id: ShortcutId;
	title: string;
	blurb: string;
	tile: TileArt;
	href: string;
};

export const SHORTCUTS: ShortcutDef[] = [
	{
		id: 'resume',
		title: 'Resume',
		blurb: 'PDF · opens in a new tab',
		tile: { Art: DocumentIcon },
		href: profile.cvView,
	},
	{
		id: 'github',
		title: 'GitHub',
		blurb: profile.github.replace('https://', ''),
		tile: { Art: GitHubIcon },
		href: profile.github,
	},
	{
		id: 'linkedin',
		title: 'LinkedIn',
		blurb: profile.linkedin.replace('https://', ''),
		tile: { Art: LinkedInIcon },
		href: profile.linkedin,
	},
];

export const SHORTCUT_BY_ID = Object.fromEntries(
	SHORTCUTS.map((s) => [s.id, s]),
) as Record<ShortcutId, ShortcutDef>;

/**
 * The desktop grid, in the order Windows would have left them: apps first in
 * the order they matter, then the web shortcuts, then the bin last.
 */
export const DESKTOP_ITEMS: { id: AppId | ShortcutId; label: string }[] = [
	{ id: 'tips', label: 'Tips' },
	{ id: 'about', label: 'About Me' },
	{ id: 'explorer', label: 'Projects' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'contact', label: 'Contact' },
	{ id: 'media', label: 'Media Player' },
	{ id: 'career', label: 'Career.exe' },
	{ id: 'terminal', label: 'Terminal' },
	{ id: 'resume', label: 'Resume' },
	{ id: 'github', label: 'GitHub' },
	{ id: 'linkedin', label: 'LinkedIn' },
	{ id: 'recycle', label: 'Recycle Bin' },
];

/** Apps pinned to Start, in grid order. */
export const START_PINNED: AppId[] = [
	'tips',
	'about',
	'explorer',
	'skills',
	'experience',
	'contact',
	'media',
	'career',
	'terminal',
	'vscode',
	'settings',
	'recycle',
];

export function isAppId(id: string): id is AppId {
	return id in APP_BY_ID;
}
