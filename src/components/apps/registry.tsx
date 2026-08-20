'use client';

import {
	User,
	Briefcase,
	Layers,
	Mail,
	Settings as SettingsGlyph,
	Github,
	Linkedin,
} from 'lucide-react';
import {
	BrowserIcon,
	CodeIcon,
	DocumentIcon,
	FolderIcon,
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
		tile: {
			kind: 'glyph',
			Icon: User,
			grad: 'linear-gradient(140deg, #4cc2ff 0%, #0f6cbd 100%)',
		},
		w: 860,
		h: 580,
		Content: AboutApp,
	},
	{
		id: 'explorer',
		title: 'File Explorer',
		blurb: 'Projects and documents',
		tile: { kind: 'art', Art: FolderIcon },
		w: 1000,
		h: 640,
		Content: ExplorerApp,
	},
	{
		id: 'skills',
		title: 'Skills',
		blurb: 'Tech stack by category',
		tile: {
			kind: 'glyph',
			Icon: Layers,
			grad: 'linear-gradient(140deg, #b18cff 0%, #6d3fd4 100%)',
		},
		w: 900,
		h: 600,
		Content: SkillsApp,
	},
	{
		id: 'experience',
		title: 'Experience',
		blurb: 'Roles and outcomes',
		tile: {
			kind: 'glyph',
			Icon: Briefcase,
			grad: 'linear-gradient(140deg, #4ad7c7 0%, #0e7c70 100%)',
		},
		w: 920,
		h: 640,
		Content: ExperienceApp,
	},
	{
		id: 'contact',
		title: 'Mail',
		blurb: 'Send me a message',
		tile: {
			kind: 'glyph',
			Icon: Mail,
			grad: 'linear-gradient(140deg, #59b4f0 0%, #1454a8 100%)',
		},
		w: 940,
		h: 620,
		Content: ContactApp,
	},
	{
		id: 'vscode',
		title: 'VS Code',
		blurb: 'Read this site’s source',
		tile: { kind: 'art', Art: CodeIcon },
		w: 980,
		h: 620,
		Content: EditorApp,
	},
	{
		id: 'edge',
		title: 'Browser',
		blurb: 'Live demos and profiles',
		tile: { kind: 'art', Art: BrowserIcon },
		w: 960,
		h: 620,
		Content: BrowserApp,
	},
	{
		id: 'settings',
		title: 'Settings',
		blurb: 'Personalise this desktop',
		tile: {
			kind: 'glyph',
			Icon: SettingsGlyph,
			grad: 'linear-gradient(140deg, #8d99a6 0%, #4a5563 100%)',
		},
		w: 900,
		h: 600,
		Content: SettingsApp,
	},
	{
		id: 'recycle',
		title: 'Recycle Bin',
		blurb: 'Empty',
		tile: { kind: 'art', Art: RecycleIcon },
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
		tile: { kind: 'art', Art: DocumentIcon },
		href: profile.cvView,
	},
	{
		id: 'github',
		title: 'GitHub',
		blurb: profile.github.replace('https://', ''),
		tile: {
			kind: 'glyph',
			Icon: Github,
			grad: 'linear-gradient(140deg, #5b636d 0%, #1c2128 100%)',
		},
		href: profile.github,
	},
	{
		id: 'linkedin',
		title: 'LinkedIn',
		blurb: profile.linkedin.replace('https://', ''),
		tile: {
			kind: 'glyph',
			Icon: Linkedin,
			grad: 'linear-gradient(140deg, #4aa3f0 0%, #0a66c2 100%)',
		},
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
