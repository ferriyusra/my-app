'use client';

import {
	BriefcaseIcon,
	BrowserIcon,
	CodeIcon,
	DocumentIcon,
	FolderIcon,
	GearIcon,
	GitHubIcon,
	LayersIcon,
	LinkedInIcon,
	MailIcon,
	PersonIcon,
	RecycleIcon,
} from '@/components/icons/app-icons';
import type { TileArt } from '@/components/ui/app-tile';
import type { AppId, ShortcutId } from '@/types/windows';
import { profile } from '@/data/profile';

import AboutApp from './about-app';
import ExplorerApp from './explorer-app';
import SkillsApp from './skills-app';
import ExperienceApp from './experience-app';
import ContactApp from './contact-app';
import SettingsApp from './settings-app';
import BrowserApp from './browser-app';
import EditorApp from './editor-app';
import RecycleBinApp from './recycle-bin-app';

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
	Content: () => React.ReactElement;
};

export const APPS: AppDef[] = [
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
		id: 'vscode',
		title: 'VS Code',
		blurb: 'Read this site’s source',
		tile: { Art: CodeIcon },
		w: 980,
		h: 620,
		Content: EditorApp,
	},
	{
		id: 'edge',
		title: 'Browser',
		blurb: 'Live demos and profiles',
		tile: { Art: BrowserIcon },
		w: 960,
		h: 620,
		Content: BrowserApp,
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
		blurb: 'Empty',
		tile: { Art: RecycleIcon },
		w: 720,
		h: 440,
		Content: RecycleBinApp,
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
	{ id: 'about', label: 'About Me' },
	{ id: 'explorer', label: 'Projects' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'contact', label: 'Contact' },
	{ id: 'resume', label: 'Resume' },
	{ id: 'github', label: 'GitHub' },
	{ id: 'linkedin', label: 'LinkedIn' },
	{ id: 'recycle', label: 'Recycle Bin' },
];

/** Apps pinned to Start, in grid order. */
export const START_PINNED: AppId[] = [
	'about',
	'explorer',
	'skills',
	'experience',
	'contact',
	'vscode',
	'edge',
	'settings',
];

export function isAppId(id: string): id is AppId {
	return id in APP_BY_ID;
}
