import type { Metadata } from 'next';
import Desktop from '@/components/desktop/desktop';
import { listCustomWallpapers } from '@/lib/wallpapers';
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
			<Desktop customWallpapers={customWallpapers} />
		</>
	);
}
