'use client';

import { useEffect } from 'react';

/**
 * The story's one watcher. It renders nothing; it marks where the reader is.
 *
 * - the nav link of the section on screen (`aria-current`);
 * - the career bar's segment for the role being read (`data-on`);
 * - the case study's contents entry for the part being read;
 * - the run: which step is being told (`data-step` on the figure), and each
 *   box as `done`, `current` or `next` (`data-state`).
 *
 * Every one of those is an attribute the CSS already knows, written onto
 * server-rendered markup — so without scripting nothing is hidden and nothing
 * is missing, the figure is simply fully lit. Position never touches React: an
 * observer fires as a block crosses a line, the handful of rectangles it needs
 * are read then, and an attribute is written only when its value changes.
 *
 * "Where the reader is" means the last block whose top has passed a line
 * across the viewport — 40% down for sections, the middle for the run. Taking
 * the last one that has passed, rather than whichever intersects, keeps the
 * mark steady across the gaps between blocks.
 */
export default function StoryObserver() {
	useEffect(() => {
		const stops: (() => void)[] = [];

		const set = (el: Element, name: string, value: string | null) => {
			if (value === null) {
				if (el.hasAttribute(name)) el.removeAttribute(name);
			} else if (el.getAttribute(name) !== value) {
				el.setAttribute(name, value);
			}
		};

		/** Calls `update` whenever any of `els` crosses the line `at` (0–1 down the viewport). */
		const watch = (els: Element[], at: number, update: () => void) => {
			if (!els.length) return;
			const pct = `${Math.round(at * 100)}%`;
			const io = new IntersectionObserver(update, {
				rootMargin: `-${pct} 0px -${Math.round((1 - at) * 100)}% 0px`,
			});
			els.forEach((el) => io.observe(el));
			stops.push(() => io.disconnect());
		};

		/** Index of the last element whose top is above the line, or -1. */
		const passed = (els: Element[], at: number) => {
			const line = window.innerHeight * at;
			let last = -1;
			els.forEach((el, i) => {
				if (el.getBoundingClientRect().top <= line) last = i;
			});
			return last;
		};

		/* ── Sections → the nav, and whether the career bar is live ── */
		const sections = [...document.querySelectorAll<HTMLElement>('.sy-main > section[id]')];
		const navLinks = [...document.querySelectorAll('.sy-links a[data-sy-link]')];
		let inCareer = false;

		/* ── Roles → the career bar ── */
		const roles = [...document.querySelectorAll<HTMLElement>('.sy-roles > li[id]')];
		const segs = [...document.querySelectorAll<HTMLElement>('.sy-tl li[data-sy-seg]')];
		const markRole = () => {
			const i = inCareer ? passed(roles, 0.45) : -1;
			const id = i >= 0 ? roles[i].id : null;
			for (const seg of segs) {
				const on = seg.dataset.sySeg === id;
				set(seg, 'data-on', on ? '' : null);
				const link = seg.querySelector('a');
				if (link) set(link, 'aria-current', on ? 'true' : null);
			}
		};

		const markSection = () => {
			const i = passed(sections, 0.4);
			const id = i >= 0 ? sections[i].id : null;
			for (const a of navLinks) set(a, 'aria-current', a.getAttribute('data-sy-link') === id ? 'true' : null);
			const wasInCareer = inCareer;
			inCareer = id === 'career';
			if (inCareer !== wasInCareer) markRole();
		};
		watch(sections, 0.4, markSection);
		watch(roles, 0.45, markRole);

		/* ── The write-up's parts → its contents list ── */
		const parts = [...document.querySelectorAll<HTMLElement>('.sy .cs > .cs-section[id]')];
		const toc = [...document.querySelectorAll<HTMLAnchorElement>('.sy .cs-nav-list a')];
		const markPart = () => {
			const i = passed(parts, 0.35);
			const href = i >= 0 ? `#${parts[i].id}` : null;
			for (const a of toc) set(a, 'aria-current', a.getAttribute('href') === href ? 'true' : null);
		};
		watch(parts, 0.35, markPart);

		/* ── The run: which step is being told, and what that lights ── */
		const run = document.querySelector<HTMLElement>('[data-sy-run]');
		const steps = run ? [...run.querySelectorAll<HTMLElement>('[data-sy-step]')] : [];
		const boxes = run ? [...run.querySelectorAll<HTMLElement>('[data-node]')] : [];
		const lights = steps.map((s) => (s.dataset.lights ?? '').split(' ').filter(Boolean));
		const markStep = () => {
			if (!run) return;
			/* The track is only shown where the run is told step by step; when
			   it is hidden (narrow, reduced motion) the figure stays fully lit. */
			if (!steps.length || steps[0].offsetParent === null) {
				set(run, 'data-step', null);
				for (const b of boxes) set(b, 'data-state', null);
				return;
			}
			const k = passed(steps, 0.5);
			if (k < 0) {
				set(run, 'data-step', null);
				for (const b of boxes) set(b, 'data-state', null);
				steps.forEach((s) => set(s, 'data-on', null));
				return;
			}
			const done = new Set(lights.slice(0, k).flat());
			const now = new Set(lights[k]);
			set(run, 'data-step', String(k));
			steps.forEach((s, i) => set(s, 'data-on', i === k ? '' : null));
			for (const b of boxes) {
				const id = b.dataset.node ?? '';
				set(b, 'data-state', now.has(id) ? 'current' : done.has(id) ? 'done' : 'next');
			}
		};
		watch(steps, 0.5, markStep);
		/* The track's visibility follows the viewport, so a resize can turn the
		   telling on or off. */
		const onResize = () => markStep();
		window.addEventListener('resize', onResize);
		stops.push(() => window.removeEventListener('resize', onResize));

		/* ── The phone menu closes once a section is picked ── */
		const menu = document.querySelector<HTMLDetailsElement>('.sy-menu');
		const onPick = (e: Event) => {
			if ((e.target as Element).closest('.sy-menu-panel a') && menu) menu.open = false;
		};
		document.addEventListener('click', onPick);
		stops.push(() => document.removeEventListener('click', onPick));

		markSection();
		markPart();
		markStep();
		return () => stops.forEach((stop) => stop());
	}, []);

	return null;
}
