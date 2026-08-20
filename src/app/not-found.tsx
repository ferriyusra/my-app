import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
	return (
		<main id='main' className='sheet'>
			<div className='sheet-card'>
				<span className='sheet-icon' aria-hidden='true'>
					<AlertTriangle size={26} />
				</span>
				<h1>Page not found</h1>
				<p>
					That page doesn&rsquo;t exist or has moved. Everything lives on the
					desktop.
				</p>
				<Link href='/' className='fl-btn fl-btn-accent'>
					<ArrowLeft size={15} aria-hidden='true' />
					Back to desktop
				</Link>
			</div>
		</main>
	);
}
