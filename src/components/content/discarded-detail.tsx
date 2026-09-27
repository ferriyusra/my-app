import type { Discarded } from '@/data/discarded';
import { profile } from '@/data/profile';

/**
 * No 'use client' on purpose: the Recycle Bin renders this, Explorer renders
 * it from Documents ▸ Decisions reversed, and the server document renders it
 * into the response body. One implementation, so the three never drift.
 *
 * This is the same rule case-study-body.tsx follows, and for the same reason —
 * these entries are the most load-bearing prose in the repository, and a
 * second copy of them is a second thing to keep true.
 */

/** "2026-08" → "August 2026", for the Date deleted column. */
export function when(iso: string): string {
	const [y, m] = iso.split('-').map(Number);
	return new Date(y, m - 1, 1).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});
}

export default function DiscardedDetail({ item }: { item: Discarded }) {
	return (
		<>
			<h3>{item.name}</h3>
			<p className='rb-summary'>{item.summary}</p>
			<dl className='rb-meta'>
				<div>
					<dt>Original location</dt>
					<dd>{item.origin}</dd>
				</div>
				<div>
					<dt>Removed by</dt>
					<dd>
						{/* A link, so "checkable" is one click rather than a hash
						    typed into GitHub by someone who guessed the repository. */}
						{item.commit ? (
							<a
								href={`${profile.repo}/commit/${item.commit}`}
								target='_blank'
								rel='noopener noreferrer'
								aria-label={`Commit ${item.commit} on GitHub`}>
								<code>{item.commit}</code>
							</a>
						) : (
							/* The one entry that never reached a commit; saying so is
							   more honest than a hash. */
							<span className='rb-nocommit'>reverted before commit</span>
						)}
					</dd>
				</div>
			</dl>
			<p className='rb-reason'>{item.reason}</p>
		</>
	);
}
