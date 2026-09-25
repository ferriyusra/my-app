import ModeLink, { type ModeHref } from '@/components/ui/mode-link';
import WindowsLogo from '@/components/ui/windows-logo';
import { DESKTOP_MIN_WIDTH } from '@/lib/shell-defaults';

const WHY = {
	script: 'The desktop is built in JavaScript, and it is switched off in this browser.',
	narrow: `The desktop needs a screen at least ${DESKTOP_MIN_WIDTH}px wide — a windowing metaphor needs room for windows to overlap.`,
	print: 'This is the desktop version of the site, which does not print.',
} as const;

/**
 * What `/desktop` shows when it cannot be a desktop: no scripting, a window
 * narrowed below the width a desktop needs, or a printer.
 *
 * It used to have the whole portfolio document hidden underneath for these
 * cases. That document is the story at `/` now, so this points there instead —
 * at the section that holds what the visitor asked for, when the URL says.
 *
 * No `'use client'` of its own: the server renders it for `<noscript>` and
 * print, and the desktop renders it when the viewport narrows. Only one of
 * those is ever the page, so only that one is the `main` landmark — the print
 * copy is a plain block that screens never show.
 */
export default function DesktopNote({
	reason,
	href = '/',
	landmark = true,
}: {
	reason: keyof typeof WHY;
	href?: ModeHref;
	landmark?: boolean;
}) {
	const Root = landmark ? 'main' : 'div';
	return (
		<Root id={landmark ? 'main' : undefined} className='sheet dk-note' data-reason={reason}>
			<div className='sheet-card'>
				<span className='sheet-icon' aria-hidden='true'>
					<WindowsLogo size={24} />
				</span>
				<h1>The portfolio is on the main page</h1>
				<p>{WHY[reason]}</p>
				<ModeLink className='fl-btn fl-btn-accent' href={href}>
					Read the portfolio
				</ModeLink>
			</div>
		</Root>
	);
}
