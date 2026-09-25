import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Story from '@/components/story/story';
import { profile } from '@/data/profile';
import './story.css';

/**
 * The mono face the story labels, indices and code are set in. Declared here
 * rather than in the root layout so only this route preloads it — the desktop
 * has Cascadia on Windows and needs nothing more.
 */
const mono = JetBrains_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-mono',
});

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

/* The story is dark until a visitor says otherwise, so the browser chrome is too. */
export const viewport: Viewport = {
	themeColor: '#0a0e14',
};

/* Tenures and "months in role" are computed from ISO dates at render time. A
   page prerendered once would freeze them at the day of the build; this
   regenerates it daily, so they stay true without anyone redeploying. */
export const revalidate = 86400;

export default function Home() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Story className={mono.variable} />
		</>
	);
}
