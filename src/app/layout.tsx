import type { Metadata } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

/* Self-hosted by Next — no render-blocking request to Google, no layout shift. */
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	weight: ['400', '500', '600', '700', '800'],
});

/* Display face. Inter everywhere was the single most generic choice on the
   page; a serif for headings against a neutral sans for body is what makes a
   layout read as set rather than generated. */
const instrumentSerif = Instrument_Serif({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-display',
	weight: ['400'],
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-jetbrains',
	weight: ['400', '500', '600', '700'],
});

const TITLE = 'Ferri Yusra — Backend Engineer';
const DESCRIPTION =
	'Backend engineer with 4+ years building scalable API systems across fintech, GovTech health, and automotive. Specialising in Go, Node.js, and PostgreSQL.';

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}`,
					}}
				/>
			</head>
			<body className='antialiased'>
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
