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
	/** Accent behind the icon, mirroring how Windows tiles brand their apps. */
	tint: string;
	w: number;
	h: number;
	Content: () => React.ReactElement;
};

export const APPS: AppDef[] = [
	{
		id: 'about',
		title: 'About Me',
		Icon: User,
		tint: '#0f6cbd',
		w: 760,
		h: 560,
		Content: AboutApp,
	},
	{
		id: 'experience',
		title: 'Experience',
		Icon: Briefcase,
		tint: '#0e700e',
		w: 900,
		h: 620,
		Content: ExperienceApp,
	},
	{
		id: 'projects',
		title: 'Projects',
		Icon: FolderGit2,
		tint: '#8764b8',
		w: 940,
		h: 640,
		Content: ProjectsApp,
	},
	{
		id: 'skills',
		title: 'Tech Stack',
		Icon: Layers,
		tint: '#bc4b09',
		w: 780,
		h: 540,
		Content: SkillsApp,
	},
	{
		id: 'contact',
		title: 'Contact',
		Icon: Mail,
		tint: '#c239b3',
		w: 720,
		h: 620,
		Content: ContactApp,
	},
];

export const APP_BY_ID = Object.fromEntries(
	APPS.map((a) => [a.id, a]),
) as Record<AppId, AppDef>;
