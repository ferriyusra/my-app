import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Ferri Yusra — Full Stack Engineer',
	description:
		'Professional portfolio of Ferri Yusra, Full Stack Engineer specializing in React, Next.js, and Node.js',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='antialiased'>{children}</body>
		</html>
	);
}
