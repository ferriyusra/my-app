import type { Metadata } from 'next';
import Desktop from '@/components/desktop/desktop';
import PortfolioDocument from '@/components/content/portfolio-document';
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
			{/* Still underneath for now: it is what a narrow window, a printer
			    and a browser without scripting get on this route until the
			    story takes over that job. */}
			<PortfolioDocument />
			<Desktop customWallpapers={customWallpapers} sources={sources} />
		</>
	);
}
