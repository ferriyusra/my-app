'use client';

import {
	User,
	Briefcase,
	FolderGit2,
	Layers,
	Mail,
	Trash2,
	FileText,
	Github,
	Linkedin,
	type LucideIcon,
} from 'lucide-react';
import { profile } from '@/data/profile';
import RecycleBinApp from './recycle-bin-app';
import type { AppId } from '@/types/windows';
import AboutApp from '@/components/apps/about-app';
import ExperienceApp from '@/components/apps/experience-app';
import ProjectsApp from '@/components/apps/projects-app';
import SkillsApp from '@/components/apps/skills-app';
import ContactApp from '@/components/apps/contact-app';

export type AppDef = {
	id: AppId;
	title: string;
	Icon: LucideIcon;
	/**
	 * Windows app icons are solid coloured tiles with a white glyph, not line
	 * art on a translucent plate. `grad` fills the tile; `tint` is the flat
	 * colour for places too small for a gradient.
	 */
	tint: string;
	grad: string;
	w: number;
	h: number;
	Content: () => React.ReactElement;
};

export const APPS: AppDef[] = [
	{
		id: 'about',
		title: 'About Me',
		Icon: User,
		tint: '#3b82f6',
		grad: 'linear-gradient(140deg, #4cc2ff 0%, #0f6cbd 100%)',
		w: 760,
		h: 500,
		Content: AboutApp,
	},
	{
		id: 'experience',
		title: 'Experience',
		Icon: Briefcase,
		tint: '#12a594',
		grad: 'linear-gradient(140deg, #4ad7c7 0%, #0e7c70 100%)',
		w: 900,
		h: 620,
		Content: ExperienceApp,
	},
	{
		id: 'projects',
		title: 'Projects',
		Icon: FolderGit2,
		tint: '#f7b32b',
		grad: 'linear-gradient(140deg, #ffd45e 0%, #e39b0b 100%)',
		w: 940,
		h: 640,
		Content: ProjectsApp,
	},
	{
		id: 'skills',
		title: 'Tech Stack',
		Icon: Layers,
		tint: '#8b5cf6',
		grad: 'linear-gradient(140deg, #b18cff 0%, #6d3fd4 100%)',
		w: 780,
		h: 540,
		Content: SkillsApp,
	},
	{
		id: 'contact',
		title: 'Contact',
		Icon: Mail,
		tint: '#0f6cbd',
		grad: 'linear-gradient(140deg, #59b4f0 0%, #1454a8 100%)',
		w: 720,
		h: 620,
		Content: ContactApp,
	},
];

/* Recycle Bin ships with every Windows desktop, so the shell has one too. */
export const RECYCLE: AppDef = {
	id: 'recycle',
	title: 'Recycle Bin',
	Icon: Trash2,
	tint: '#8a8886',
	grad: 'linear-gradient(140deg, #cfd4d9 0%, #8a8f96 100%)',
	w: 560,
	h: 340,
	Content: RecycleBinApp,
};

export const ALL_APPS: AppDef[] = [...APPS, RECYCLE];

export const APP_BY_ID = Object.fromEntries(
	ALL_APPS.map((a) => [a.id, a]),
) as Record<AppId, AppDef>;

/** Desktop shortcuts that leave the page rather than opening a window. */
export type ShortcutDef = {
	id: 'resume' | 'github' | 'linkedin';
	title: string;
	Icon: LucideIcon;
	tint: string;
	grad: string;
	href: string;
};

export const SHORTCUTS: ShortcutDef[] = [
	{
		id: 'resume',
		title: 'Resume',
		Icon: FileText,
		tint: '#c43e1c',
		grad: 'linear-gradient(140deg, #ff8a65 0%, #b3300f 100%)',
		href: profile.cvView,
	},
	{
		id: 'github',
		title: 'GitHub',
		Icon: Github,
		tint: '#24292f',
		grad: 'linear-gradient(140deg, #5b636d 0%, #1c2128 100%)',
		href: profile.github,
	},
	{
		id: 'linkedin',
		title: 'LinkedIn',
		Icon: Linkedin,
		tint: '#0a66c2',
		grad: 'linear-gradient(140deg, #4aa3f0 0%, #0a66c2 100%)',
		href: profile.linkedin,
	},
];
