import type { Metadata } from 'next';
import Desktop from '@/components/desktop/desktop';
import DesktopNote from '@/components/desktop/desktop-note';
import { listCustomWallpapers } from '@/lib/wallpapers';
import { loadSources } from '@/lib/source';
import { profile } from '@/data/profile';

/**
 * The Windows 11 desktop, one click from the story.
 *
 * It was the front door until the story took `/`; everything it did there it
 * still does here, including `?app=` deep links — `/?app=…` redirects to this
 * route (next.config.ts), so links shared before the move still open the
 * window they named.
 *
 * Not indexed: the story is the page a search engine should send people to,
 * and this is the same content behind a window manager. It is not given a
 * canonical pointing at `/` either — noindex plus a cross-canonical is a mixed
 * signal, and the two are not duplicates.
 */
export const metadata: Metadata = {
	title: `Desktop — ${profile.name}`,
	robots: { index: false, follow: true },
};

export default async function DesktopPage() {
	/* Read here rather than from the client: this page is a server component
	   and is prerendered, so the listing costs nothing at runtime. */
	const customWallpapers = await listCustomWallpapers();
	/* Read from the real files for the same reason, and at the same moment: if
	   one of these declarations has been renamed away, the build stops here
	   rather than shipping an editor that labels code with a path it is not
	   in. */
	const sources = await loadSources();

	return (
		<>
			{/* The words live at `/` now; without scripting, and on paper, this
			    route says so rather than showing a black screen. A narrowed
			    window gets the same note from the desktop itself. */}
			<noscript>
				<DesktopNote reason='script' />
			</noscript>
			<div className='dk-print'>
				<DesktopNote reason='print' landmark={false} />
			</div>
			<Desktop customWallpapers={customWallpapers} sources={sources} />
		</>
	);
}
