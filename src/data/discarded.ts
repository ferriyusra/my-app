/**
 * Things that were built and then thrown away, with the reason.
 *
 * Every entry is real: the commit hashes are in this repository's history, and
 * the two without one were reverted before they were ever committed. A
 * portfolio shows what shipped; this shows what was cut, which is the half of
 * engineering judgement a finished product hides.
 */

export type Discarded = {
	/** Named like the file or feature it actually was. */
	name: string;
	/** Where it lived, in the Recycle Bin's "Original location" idiom. */
	origin: string;
	/** Commit that removed it, or null if it never reached a commit. */
	commit: string | null;
	/** Roughly when, for the "Date deleted" column. */
	date: string;
	/** One line in the list. */
	summary: string;
	/** The full reason, shown when the row is selected. */
	reason: string;
};

export const discarded: Discarded[] = [
	{
		name: 'YouTube full-track playback',
		origin: 'src/app/api/music/resolve',
		commit: null,
		date: '2026-08',
		summary: 'Whole songs instead of 30-second previews.',
		reason:
			'The Media Player streams Apple’s 30-second previews because that is all the public API serves. Playing whole tracks was researched properly: Spotify’s Web Playback SDK now caps an unapproved app at five allowlisted users, and Audius is free and unlimited but indie-only — searching for a song you already have in mind returns somebody else’s remix. YouTube had the catalogue and would have worked, but it needs a Google Cloud project and an API key with a daily quota. Binding a portfolio’s music player to billable infrastructure to avoid a 30-second limit was the wrong trade. The previews stayed.',
	},
	{
		name: 'meter.tsx',
		origin: 'src/components/ui',
		commit: '72f1ef1',
		date: '2026-08',
		summary: 'Progress bars on the Skills list.',
		reason:
			'A progress bar implies a scale, and there is no honest scale for “how much do you know Go”. The bars were drawn from years of hands-on use — a real figure, but not the one a filled bar reads as. Windows Settings, which the Skills window imitates, never draws them for a list like this. The year labels went with them: in smaller type they were making exactly the same claim. What is left is the mark, the name, and where the tool was actually used. The `years` figure stays in the data, where it orders each category without pretending to be a score.',
	},
	{
		name: 'Glyph tiles',
		origin: 'src/components/icons',
		commit: '9b493ee',
		date: '2026-08',
		summary: 'Lucide outlines on tinted gradient squares.',
		reason:
			'Half the app icons were free-form artwork — the folder, the bin, the browser, the editor — and half were a line-art glyph centred on a coloured square. Sitting in one column on the desktop, that split was the loudest thing on screen. Windows 11 ships no line-art app icons; its icons are shaped compositions. So the remaining six were drawn: a figure on a disc, three isometric plates, a briefcase with a clasp, a folded envelope, an eight-tooth gear. `TileArt` deliberately has no glyph variant now, so a new app cannot quietly reintroduce one.',
	},
	{
		name: 'custom-cursor.tsx',
		origin: 'src/components',
		commit: 'f3c0cf1',
		date: '2026-04',
		summary: 'A trailing ring that replaced the system pointer.',
		reason:
			'It hid the OS pointer to draw a ring that added nothing, and it lagged the real cursor on any frame the page was busy. It went out with magnetic-button.tsx and tilt-effect.tsx in the same pass — flourish without function. Ten separate motion systems were running on one page at that point; three remain.',
	},
	{
		name: 'smooth-scroll.tsx',
		origin: 'src/components',
		commit: '134cde6',
		date: '2026-04',
		summary: 'GSAP ScrollSmoother over the whole page.',
		reason:
			'Intercepting the scroll wheel to re-implement scrolling introduced jitter and a rubber-band bounce at the end of the page, and it fought every browser that already scrolls well. Native scroll is more predictable, and it is what an assistive technology or a trackpad gesture expects. Removing it also let the projects grid drop CSS columns for a real grid, which fixed the empty slots featured cards left in a row.',
	},
	{
		name: 'mobile-shell.tsx',
		origin: 'src/components/desktop',
		commit: '02397b6',
		date: '2026-08',
		summary: 'A separate client component for narrow screens.',
		reason:
			'Below 900px the shell swapped to a stacked reading view rendered by its own client component. That meant the entire portfolio existed only after ~266KB of JavaScript had run — the server response body was an empty div, so anything that does not execute scripts saw a blank page: ATS scrapers, social preview bots, LLM crawlers. It was replaced by portfolio-document.tsx, a server component holding the whole portfolio as semantic HTML with native `<details>` sections. Same reading view, but it now ships in the response body and works with scripting off entirely.',
	},
	{
		name: '/articles',
		origin: 'src/app/articles',
		commit: '9f30192',
		date: '2026-08',
		summary: 'A route with nothing behind it.',
		reason:
			'A “Coming soon” page in a navigation bar is a promise with a date attached, and the date had passed. An empty section makes a portfolio look abandoned in a way that having no section at all does not. The route was deleted rather than filled, because writing articles is a decision to make on its own terms and not one to be forced by a nav link.',
	},
	{
		name: 'tech-globe.tsx',
		origin: 'src/components',
		commit: 'ef32151',
		date: '2026-04',
		summary: 'A rotating 3D sphere of technology logos.',
		reason:
			'It was the most-looked-at thing on the page and said the least. A sphere of logos communicates “I have used many tools”, which the Skills list says more precisely and in less time, and it cost a continuous animation frame budget to say it. It went out alongside wave-divider.tsx in the pass that moved the page onto design tokens.',
	},
];
