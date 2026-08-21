'use client';

import { useEffect } from 'react';

/**
 * Opens every collapsed section before the browser prints, and closes them
 * again afterwards.
 *
 * The sections are `<details>`, so a closed one contributes nothing to a
 * printout — someone saving the page as a PDF would get the headings and
 * none of the work. CSS cannot force one open, so this listens for the print
 * event instead.
 */
export default function PrintExpander() {
	useEffect(() => {
		/* Only sections this opened are closed again, so anything the reader
		   had already expanded stays expanded. */
		let opened: HTMLDetailsElement[] = [];

		const expand = () => {
			opened = [
				...document.querySelectorAll<HTMLDetailsElement>('.doc details:not([open])'),
			];
			for (const d of opened) d.open = true;
		};
		const restore = () => {
			for (const d of opened) d.open = false;
			opened = [];
		};

		window.addEventListener('beforeprint', expand);
		window.addEventListener('afterprint', restore);
		return () => {
			window.removeEventListener('beforeprint', expand);
			window.removeEventListener('afterprint', restore);
		};
	}, []);

	return null;
}
