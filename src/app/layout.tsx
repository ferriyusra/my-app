import type { Metadata, Viewport } from 'next';
import { Chakra_Petch, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { profile } from '@/data/profile';
import { color } from '@/lib/palette';
import Reveal from '@/components/content/reveal';
import { REVEAL_GATE } from '@/components/content/reveal-gate';
import { MENU_CLOSE } from '@/components/site/menu-close';

/**
 * The Blueprint system's three faces, self-hosted by next/font so there is no
 * request to Google at runtime and no layout shift: Chakra Petch, the drafted
 * capitals, for every head; IBM Plex Sans for prose, labels and controls; IBM
 * Plex Mono only for a measurement, a date on a dimension string or code.
 * Each exposes a CSS variable that `tokens.css` puts first in --font-display,
 * --font-body and --font-outlier, so no component ever names a family.
 */
const chakra = Chakra_Petch({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-chakra',
	weight: ['600'],
});
const plex = IBM_Plex_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-plex',
	weight: ['400', '500'],
});
const plexMono = IBM_Plex_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-plexmono',
	weight: ['500'],
});

const TITLE = `${profile.name}, ${profile.role}`;
const DESCRIPTION = profile.bio;

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	metadataBase: new URL(profile.site),
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: profile.site,
		siteName: profile.name,
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: TITLE,
		description: DESCRIPTION,
	},
	robots: { index: true, follow: true },
};

/* The paper, as hex: browser chrome cannot read a CSS variable. */
export const viewport: Viewport = {
	themeColor: color('paper'),
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		/* The gate script sets data-js on <html> before React hydrates it, so
		   that one attribute is expected to differ. */
		<html lang='en' className={`${chakra.variable} ${plex.variable} ${plexMono.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: REVEAL_GATE }} />
				<script dangerouslySetInnerHTML={{ __html: MENU_CLOSE }} />
			</head>
			<body>
				<a href='#main' className='skip'>
					Skip to content
				</a>
				{children}
				<Reveal />
			</body>
		</html>
	);
}
