import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

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
const DESCRIPTION =
	'Backend engineer building scalable API systems across fintech, GovTech health and automotive. Go, Node.js and PostgreSQL — presented as a Windows 11 desktop.';

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
 * Applies theme, accent, wallpaper — and which shell is in charge — before
 * first paint.
 *
 * All four are plain attributes on <html> that the stylesheet keys off, so
 * running this ahead of hydration is what stops a stored dark desktop from
 * flashing light.
 *
 * `data-shell` is the one that matters most: the portfolio document is in the
 * server HTML, and on a wide screen it has to be out of the way before
 * anything paints. Setting it here rather than in React also means it is only
 * ever set when scripting is on — so a visitor without JavaScript keeps the
 * document, and never sees the black holding screen meant for the desktop.
 */
const BOOT = `try{var d=document.documentElement,g=function(k,f){try{return localStorage.getItem(k)||f}catch(e){return f}};
var t=g('theme',null);if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))d.setAttribute('data-theme','dark');
d.setAttribute('data-accent',g('shell:accent','blue'));
d.setAttribute('data-wallpaper',g('shell:wallpaper','bloom'));
d.setAttribute('data-shell',matchMedia('(min-width: 900px)').matches?'desktop':'document');
var b=g('shell:brightness','1');if(b)d.style.setProperty('--screen-dim',String(Math.max(0,Math.min(0.65,1-parseFloat(b)||0))));}catch(e){}`;

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
