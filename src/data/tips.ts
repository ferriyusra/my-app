/**
 * What the shell can do, and why it was built the way it was.
 *
 * This is data rather than markup because it has to reach four places: the
 * Tips window, Start's search index, the Terminal's `tips` command, and the
 * server document — which is the only one a phone or a crawler ever sees. A
 * Tips app with its strings inlined would be the first surface here to keep a
 * second copy of something.
 *
 * Nothing in here may describe behaviour the shell does not have. Every entry
 * names the window that proves it.
 */

export type Tip = {
	title: string;
	body: string;
	/** The window or surface that demonstrates it. */
	where?: string;
};

export type TipPage = {
	key: string;
	label: string;
	title: string;
	subtitle: string;
	tips: Tip[];
};

export const TIP_PAGES: TipPage[] = [
	{
		key: 'start',
		label: 'Get started',
		title: 'Get started',
		subtitle: 'Six things this desktop does that a page cannot',
		tips: [
			{
				title: 'Double-click a desktop icon',
				body: 'Single click selects, double click opens — the same as the desktop it is imitating. Arrow keys walk the grid and Enter opens, so nothing here needs a mouse.',
				where: 'Desktop',
			},
			{
				title: 'Drag a window to an edge',
				body: 'A plate shows where it will land before you let go: an edge fills half, a corner fills a quarter, the top maximises. Drag a maximised window back down and it tears off at the point you grabbed it.',
				where: 'Any window',
			},
			{
				title: 'Hover the maximise button',
				body: 'Snap Layouts opens after a moment, with four arrangements and thirteen zones. Pick one and Snap Assist offers to fill the space beside it with whatever else is open.',
				where: 'Any window title bar',
			},
			{
				title: 'Drag across empty desktop',
				body: 'A marquee selects icons, and icons can be dragged into a new order that survives a reload and a resize — the arrangement is stored as an order, not as pixels.',
				where: 'Desktop',
			},
			{
				title: 'Right-click almost anything',
				body: 'The desktop, a desktop icon, a taskbar button and a window title bar each have their own menu, with the entries Windows puts there and the keyboard shortcuts beside them.',
				where: 'Desktop, taskbar, title bar',
			},
			{
				title: 'Click the cat',
				body: 'It wanders, sits, grooms and naps on its own. Petting it, feeding it from the desktop menu and sending it home all work; it walks to the bowl and to the door rather than teleporting.',
				where: 'Above the taskbar',
			},
		],
	},
	{
		key: 'built',
		label: "How it's built",
		title: "How it's built",
		subtitle: 'Five decisions, each with the window that demonstrates it',
		tips: [
			{
				title: 'A pointer gesture never dispatches',
				body: 'Window position and size live in motion values, not React state. Dragging one window used to re-render every other open window once per frame: 653ms of scripting over four seconds of dragging with five windows open, against 87ms now. The desktop icons and the cat follow the same rule.',
				where: 'Drag any window',
			},
			{
				title: 'One typed dataset, four ways in',
				body: 'Roles, projects, skills, the case study and the reversed decisions are typed data with no second copy. Start searches 51 entries built from it, the Terminal answers from it, and the Skills window computes "used where, for how long" by walking the roles that name each tool rather than claiming a number.',
				where: 'Start, Terminal, Skills',
			},
			{
				title: 'The editor reads the real files',
				body: 'Its excerpts are pulled from this repository at build time, not pasted. They were copies once, and three of five had quietly stopped matching. A manifest names a file and a symbol, and a missing symbol fails the build instead of shipping a window that lies about where its code lives.',
				where: 'VS Code',
			},
			{
				title: 'The Recycle Bin holds real reversals',
				body: 'Every entry is something this repository built and then removed, with the commit that removed it and the reasoning that led there. The hashes are in the history and can be checked. A portfolio shows what shipped; that window shows what was cut.',
				where: 'Recycle Bin',
			},
			{
				title: 'The whole portfolio is in the HTML',
				body: 'Turn JavaScript off, or read the response body, and the portfolio is still there as plain semantic markup — the same data, rendered by server components. Below 900px that document is the entire experience, because a windowing metaphor needs a pointer and room to overlap.',
				where: 'View source',
			},
		],
	},
	{
		key: 'missing',
		label: "What's not here",
		title: "What's not here",
		subtitle: 'Omissions worth naming, so they read as decisions',
		tips: [
			{
				title: 'One desktop, not several',
				body: 'Task View lists open windows and offers Show desktop. Real virtual desktops would need a second window partition, per-desktop z-ordering and a taskbar that filters by it — the largest piece of state work available here, for something nobody visiting a portfolio switches between.',
			},
			{
				title: 'Taskbar previews are text, not thumbnails',
				body: 'A live thumbnail means rasterising a DOM subtree on every hover, of a window already visible behind the taskbar. The card names the app and what it holds instead.',
			},
			{
				title: 'Explorer has no Skills folder',
				body: 'Twenty-eight names in a flat list is worse than the Skills window, which groups them and shows where each was actually used. Not every dataset deserves every route.',
			},
			{
				title: 'Mail has no sent items, the editor has no source control',
				body: 'An empty Sent folder is what an empty Sent folder looks like, and a disabled Source Control icon is honest about a window that reads six files. Filling either would mean inventing content.',
			},
			{
				title: 'There is no browser window',
				body: 'There was one. A browser inside a browser can only be a launcher, and there were already three; its search box matched app titles only, so "Kafka" found nothing there while Start found the role that used it. It was removed rather than patched.',
			},
		],
	},
];

/**
 * The keyboard map.
 *
 * `alt` exists because the ⊞ combinations are claimed by Windows itself
 * before the browser is ever told about them — on the operating system this
 * shell imitates, they do nothing. Both columns are always shown; the
 * platform only decides which is named first.
 */
export type Shortcut = {
	chord: string;
	/** A second binding that works where ⊞ is taken. */
	alt?: string;
	does: string;
};

export const SHORTCUTS: Shortcut[] = [
	{ chord: 'F1', does: 'Open this window' },
	{ chord: '⊞', does: 'Open Start, with the cursor in its search box' },
	{ chord: '⊞ ←', alt: 'Ctrl Alt ←', does: 'Snap the top window to the left half' },
	{ chord: '⊞ →', alt: 'Ctrl Alt →', does: 'Snap the top window to the right half' },
	{ chord: '⊞ ↑', alt: 'Ctrl Alt ↑', does: 'Maximise the top window' },
	{ chord: '⊞ ↓', alt: 'Ctrl Alt ↓', does: 'Restore it, or minimise if it is already floating' },
	{ chord: '⊞ D', does: 'Show the desktop, and put everything back on a second press' },
	{ chord: '⊞ E', does: 'Open File Explorer' },
	{ chord: 'Alt F4', does: 'Close the top window' },
	{ chord: 'Esc', does: 'Close the open menu, flyout or window' },
	{ chord: 'F5', does: 'Refresh the desktop and clear the selection' },
	{ chord: '↑ ↓ ← →', does: 'Walk the desktop icon grid; Enter opens' },
];

/** Why only the arrows have an alternate. */
export const SHORTCUT_NOTE =
	'Windows claims the ⊞ combinations before the browser sees them, so on Windows itself they do nothing — Ctrl Alt covers the arrows there. The letter chords are deliberately not aliased: Ctrl Alt is AltGr on many keyboard layouts, where Ctrl Alt E types €. Everything without a ⊞ works everywhere.';

/**
 * Two sentences for the server document, where the desktop is described to
 * someone who cannot open it. Drawn from the "How it's built" page so the two
 * cannot drift.
 */
export const BUILT_SUMMARY =
	'On a wider screen this is a Windows 11 desktop: draggable, resizable, snappable windows over a real taskbar, Start, Quick Settings and a File Explorer. Window geometry is kept out of React entirely so a drag never re-renders the apps behind it, the editor window quotes code read from this repository at build time rather than pasted, and the Recycle Bin holds decisions this project reversed with the commits that reversed them.';
