'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { FAILSAFE_MS } from './reveal-gate';

/**
 * The page's one reveal: each block marked `data-reveal` rises once, the
 * first time it comes into view. Blocks that arrive together (the first
 * screen after a refresh, a section's head and its answer) are staggered in
 * the order they sit in the page.
 *
 * Runs again on every route change, because the masthead and the case link
 * navigate client-side and the next page's blocks start hidden too.
 */
export default function Reveal() {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.documentElement;
		if (root.dataset.js === undefined) return;

		/* The failsafe has already shown the page: what is on screen stays put
		   rather than vanishing to arrive a second time. */
		const late = root.dataset.js === 'pending' && performance.now() >= FAILSAFE_MS;

		const io = new IntersectionObserver(
			(entries) => {
				let i = 0;
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					const el = e.target as HTMLElement;
					el.style.setProperty('--i', String(Math.min(i++, 5)));
					el.classList.add('is-in');
					io.unobserve(el);
				}
			},
			{ rootMargin: '0px 0px -8% 0px' },
		);

		for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in, .is-seen)')) {
			const r = el.getBoundingClientRect();
			/* Above the screen already (a refresh restores the scroll), or shown
			   by the failsafe: it does not move. */
			if (r.bottom <= 0 || (late && r.top < window.innerHeight)) el.classList.add('is-seen');
			else io.observe(el);
		}
		root.dataset.js = 'on';

		return () => io.disconnect();
	}, [pathname]);

	return null;
}
