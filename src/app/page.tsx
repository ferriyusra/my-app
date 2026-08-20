import type { Metadata } from 'next';
import Desktop from '@/components/desktop/desktop';
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

export default function Home() {
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
			<Desktop />
		</>
	);
}
