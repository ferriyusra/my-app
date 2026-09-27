import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { LiArrowLeft } from '@/components/icons/line-icons';
import { profile } from '@/data/profile';

export default function NotFound() {
	return (
		<main id='main' className='sheet'>
			<div className='sheet-card'>
				<span className='sheet-icon' aria-hidden='true'>
					<AlertTriangle size={26} />
				</span>
				<h1>Page not found</h1>
				{/* Worded for both renderings: on a phone there is no desktop to
				    go back to, and "Back to desktop" pointed at one. */}
				<p>That page doesn&rsquo;t exist or has moved.</p>
				<div className='sheet-actions'>
					<Link href='/' className='fl-btn fl-btn-accent'>
						<LiArrowLeft size={15} aria-hidden='true' />
						Back to the portfolio
					</Link>
					<a href={profile.cvView} className='fl-btn fl-btn-standard' target='_blank' rel='noopener noreferrer'>
						View CV
					</a>
				</div>
			</div>
		</main>
	);
}
