import type { Metadata } from 'next';
import Desktop from '@/components/desktop/desktop';
import { listCustomWallpapers } from '@/lib/wallpapers';
import { loadSources } from '@/lib/source';
import PortfolioDocument from '@/components/content/portfolio-document';
import { profile } from '@/data/profile';

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: profile.name,
	url: profile.site,
	jobTitle: profile.role,
	description: profile.bio,
	email: profile.email,
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Jakarta',
		addressCountry: 'ID',
	},
	sameAs: [profile.github, profile.linkedin],
};

export const metadata: Metadata = {
	title: `${profile.name} — ${profile.role}`,
};

export default async function Home() {
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
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			{/* The document ships in the HTML and is the whole experience on a
			    narrow screen. On a wide one the desktop shell covers it — see
			    the `data-shell` switch in layout.tsx. */}
			<PortfolioDocument />
			<Desktop customWallpapers={customWallpapers} sources={sources} />
		</>
	);
}
