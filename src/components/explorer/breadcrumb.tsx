'use client';

import { ChevronRight } from 'lucide-react';
import { ThisPcIcon } from '@/components/icons/app-icons';

export type Crumb = { label: string; onSelect?: () => void };

/** Explorer's address bar: chevron-separated, the last segment inert. */
export default function Breadcrumb({ trail }: { trail: Crumb[] }) {
	return (
		<nav className='xp-crumbs' aria-label='Location'>
			<span className='xp-crumb-root' aria-hidden='true'>
				<ThisPcIcon size={15} />
			</span>
			{trail.map((c, i) => {
				const last = i === trail.length - 1;
				return (
					<span key={`${c.label}-${i}`} className='xp-crumb'>
						{c.onSelect && !last ? (
							<button type='button' onClick={c.onSelect}>
								{c.label}
							</button>
						) : (
							<span aria-current={last ? 'page' : undefined}>{c.label}</span>
						)}
						{!last && <ChevronRight size={14} aria-hidden='true' />}
					</span>
				);
			})}
		</nav>
	);
}
