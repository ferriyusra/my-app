import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import ScrollProgress from '@/components/scroll-progress';

export const metadata: Metadata = {
	title: 'Ferri Yusra — Full Stack Engineer',
	description:
		'Backend engineer with 4+ years building scalable API systems across fintech, GovTech health, and automotive industries. Specializing in Go, Node.js, React, and Next.js.',
	metadataBase: new URL('https://ferriyusra.com'),
	openGraph: {
		title: 'Ferri Yusra — Full Stack Engineer',
		description:
			'Backend engineer building scalable systems in Go & Node.js. 4+ years across fintech, GovTech, and automotive.',
		url: 'https://ferriyusra.com',
		siteName: 'Ferri Yusra',
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Ferri Yusra — Full Stack Engineer',
		description:
			'Backend engineer building scalable systems in Go & Node.js.',
	},
	robots: { index: true, follow: true },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark')}catch(e){}`,
					}}
				/>
			</head>
			<body className='antialiased'>
				<ThemeProvider>
					<ScrollProgress />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
