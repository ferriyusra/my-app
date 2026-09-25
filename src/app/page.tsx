import type { Metadata } from 'next';
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
			{/* The portfolio as plain HTML, whole in the response. The desktop
			    that used to cover it on a wide screen lives at /desktop now. */}
			<PortfolioDocument />
		</>
	);
}
