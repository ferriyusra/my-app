'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function ArticlesPage() {
	return (
		<main id='main' className='sheet'>
			<div className='sheet-card'>
				<span className='sheet-icon' aria-hidden='true'>
					<BookOpen size={26} />
				</span>
				<h1>Articles</h1>
				<p>
					I&rsquo;m writing about backend engineering, Go, system design, and
					lessons learned in production. Nothing published yet.
				</p>
				<Link href='/' className='fl-btn fl-btn-accent'>
					<ArrowLeft size={15} aria-hidden='true' />
					Back to desktop
				</Link>
			</div>
		</main>
	);
}
