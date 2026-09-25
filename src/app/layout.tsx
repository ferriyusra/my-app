import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { bootScript } from '@/lib/boot';
import { profile } from '@/data/profile';

/**
 * Segoe UI Variable is the Windows 11 system face, so a Windows visitor gets
 * the real thing with no download at all. Inter is the fallback everywhere
 * else — the closest widely available neo-grotesque — self-hosted by next/font
 * so there is no render-blocking request to Google and no layout shift.
 *
 * The previous serif display face and monospace pair have gone: a Windows
 * desktop has exactly two type roles, UI text and code, and Cascadia covers
 * the second natively.
 */
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	weight: ['400', '500', '600', '700'],
});

const TITLE = 'Ferri Yusra — Backend Engineer';
const DESCRIPTION = `${profile.bio} Go, Node.js and PostgreSQL — and a Windows 11 desktop to explore.`;

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	metadataBase: new URL('https://ferriyusra.com'),
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: 'https://ferriyusra.com',
		siteName: 'Ferri Yusra',
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

export const viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f3f3f3' },
		{ media: '(prefers-color-scheme: dark)', color: '#202020' },
	],
};

/**
 * Sets what the stylesheet keys off — theme, and on `/desktop` the accent,
 * wallpaper and `data-shell` — before first paint. See `src/lib/boot.ts`,
 * where it lives as a string so it can be tested by running it.
 *
 * `data-shell` is only ever set by this script, so its absence means scripting
 * is off: the page then shows what the server rendered, and never the black
 * holding screen meant for the desktop.
 */
const BOOT = bootScript();

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en' className={inter.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: BOOT }} />
			</head>
			<body>
				<ThemeProvider>
					<a href='#main' className='skip-link'>
						Skip to content
					</a>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
