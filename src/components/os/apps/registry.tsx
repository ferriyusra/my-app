'use client';

import {
	User,
	Briefcase,
	FolderGit2,
	Layers,
	Mail,
	type LucideIcon,
} from 'lucide-react';
import type { AppId } from '../window-store';
import AboutApp from './about-app';
import ExperienceApp from './experience-app';
import ProjectsApp from './projects-app';
import SkillsApp from './skills-app';
import ContactApp from './contact-app';

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

export const APP_BY_ID = Object.fromEntries(
	APPS.map((a) => [a.id, a]),
) as Record<AppId, AppDef>;
