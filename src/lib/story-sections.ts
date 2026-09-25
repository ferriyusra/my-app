/**
 * The story's sections, and where each desktop app lands when the story is
 * asked for it instead.
 *
 * One list, read by the nav, the section heads, the hero terminal's `open`,
 * and the boot script that sends a phone following a `/desktop?app=` link to
 * the matching place on the story. A section renamed here moves all four.
 *
 * No JSX and no `@/` value imports, so `node --test` loads it directly.
 */

import type { AppId } from '../types/windows.ts';

export type SectionId =
	| 'top'
	| 'career'
	| 'case-study'
	| 'projects'
	| 'stack'
	| 'decisions'
	| 'contact';

export type StorySection = {
	id: SectionId;
	/** The mono index a section head shows, "01". The hero has none. */
	index: string | null;
	/** What the section head calls it. */
	title: string;
	/** What the nav calls it, where the title is too long for a bar. */
	nav: string | null;
};

export const STORY_SECTIONS: readonly StorySection[] = [
	{ id: 'top', index: null, title: 'Ferri Yusra', nav: null },
	{ id: 'career', index: '01', title: 'Career', nav: 'Career' },
	{ id: 'case-study', index: '02', title: 'Case study', nav: 'Case study' },
	{ id: 'projects', index: '03', title: 'Projects', nav: 'Projects' },
	{ id: 'stack', index: '04', title: 'Stack', nav: 'Stack' },
	{ id: 'decisions', index: '05', title: 'Decisions reversed', nav: 'Decisions' },
	{ id: 'contact', index: '06', title: 'Contact', nav: 'Contact' },
];

/** The section a given id names; throws on a typo rather than rendering a blank head. */
export function section(id: SectionId): StorySection {
	const s = STORY_SECTIONS.find((x) => x.id === id);
	if (!s) throw new Error(`No story section "${id}"`);
	return s;
}

/**
 * Where each app's content lives on the story, or null when it only exists on
 * the desktop.
 *
 * A `Record` over the whole union, so adding an app to `AppId` fails the type
 * check until someone decides where it lands. Media, Settings, VS Code and the
 * Terminal are the desktop's own furniture; Tips explains the desktop; Notes
 * has nothing to show until a note is written.
 */
export const APP_SECTION: Record<AppId, SectionId | null> = {
	tips: null,
	about: 'top',
	explorer: 'projects',
	skills: 'stack',
	experience: 'career',
	contact: 'contact',
	media: null,
	settings: null,
	vscode: null,
	recycle: 'decisions',
	notes: null,
	career: 'career',
	terminal: null,
};

/**
 * The story section for an app id read from a URL or typed at a prompt.
 *
 * Takes any string, because that is what arrives: `?app=` is whatever someone
 * pasted. An own-property check, so `__proto__` or `constructor` is just an
 * unknown app rather than a walk up the prototype chain.
 */
export function sectionForApp(id: string | null | undefined): SectionId | null {
	if (!id || !Object.prototype.hasOwnProperty.call(APP_SECTION, id)) return null;
	return APP_SECTION[id as AppId];
}
