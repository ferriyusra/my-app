'use client';

import { useEffect } from 'react';

/**
 * Makes the desktop's links work on the document.
 *
 * A link is shared as `/?app=experience` or `/?app=experience&at=case`,
 * and on a phone the window manager that reads it never mounts — so every
 * such link landed at the top of a 15,000px page. This reads the same two
 * parameters and scrolls to the section they name, opening it if it is a
 * folded `<details>`. It renders nothing, and does nothing on the desktop.
 */
const SECTION: Record<string, string> = {
	experience: 'experience',
	career: 'experience',
	skills: 'skills',
	explorer: 'projects',
	recycle: 'decisions',
	contact: 'contact',
	notes: 'notes',
};

export default function DocDeepLink() {
	useEffect(() => {
		if (document.documentElement.dataset.shell === 'desktop') return;
		const q = new URLSearchParams(window.location.search);
		const id = q.get('at') === 'case' ? 'case-study' : SECTION[q.get('app') ?? ''];
		const target = id ? document.getElementById(id) : null;
		if (!target) return;
		if (target instanceof HTMLDetailsElement) target.open = true;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
	}, []);

	return null;
}
