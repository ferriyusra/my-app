import type { Metadata, Viewport } from 'next';
import { Radio_Canada, Radio_Canada_Big } from 'next/font/google';
import './globals.css';
import { profile } from '@/data/profile';
import { color } from '@/lib/palette';
import Reveal from '@/components/content/reveal';
import { REVEAL_GATE } from '@/components/content/reveal-gate';

/**
 * The Grid system's one neo-grotesque in its two optical cuts, self-hosted by
 * next/font so there is no request to Google at runtime and no layout shift.
 * Radio Canada Big sets heads, figures and the index; Radio Canada sets the
 * body and labels. Each exposes a CSS variable that `tokens.css` puts first in
 * --font-display and --font-body, so no component ever names a family.
 */
const rcBig = Radio_Canada_Big({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-rcbig',
	weight: ['400', '700'],
});
const rc = Radio_Canada({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-rc',
	weight: ['400', '500'],
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
		<html lang='en' className={`${rcBig.variable} ${rc.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: REVEAL_GATE }} />
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
