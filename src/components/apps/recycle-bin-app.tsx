'use client';

import { useState } from 'react';
import { DocumentIcon, RecycleIcon } from '@/components/icons/app-icons';
import { discarded } from '@/data/discarded';

/** "2026-08" → "August 2026", for the Date deleted column. */
function when(iso: string): string {
	const [y, m] = iso.split('-').map(Number);
	return new Date(y, m - 1, 1).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
	});
}

/**
 * The Recycle Bin, holding what was actually thrown away.
 *
 * An empty bin was the honest state until there was something real to put in
 * it. Every row is a decision this repository reversed, and the commit that
 * did it — so the reasoning is checkable rather than claimed.
 */
export default function RecycleBinApp() {
	const [selected, setSelected] = useState(0);
	const item = discarded[selected];

	return (
		<div className='rb'>
			<div className='rb-head'>
				<RecycleIcon size={20} />
				<div>
					<h2>Recycle Bin</h2>
					<p>
						{discarded.length} items — decisions this project reversed, and why
					</p>
				</div>
			</div>

			<div className='rb-body'>
				<div className='rb-list' role='listbox' aria-label='Discarded decisions'>
					<div className='rb-cols' aria-hidden='true'>
						<span>Name</span>
						<span>Original location</span>
						<span>Date deleted</span>
					</div>
					{discarded.map((d, i) => (
						<button
							key={d.name}
							type='button'
							role='option'
							aria-selected={i === selected}
							className='rb-row'
							data-on={i === selected || undefined}
							onClick={() => setSelected(i)}
						>
							<span className='rb-name'>
								<DocumentIcon size={18} />
								<span>{d.name}</span>
							</span>
							<span className='rb-origin'>{d.origin}</span>
							<span className='rb-date'>{when(d.date)}</span>
						</button>
					))}
				</div>

				<div className='rb-detail'>
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
								{item.commit ? (
									<code>{item.commit}</code>
								) : (
									/* Two of these were reverted before they were ever
									   committed; saying so is more honest than a hash. */
									<span className='rb-nocommit'>reverted before commit</span>
								)}
							</dd>
						</div>
					</dl>
					<p className='rb-reason'>{item.reason}</p>
				</div>
			</div>
		</div>
	);
}
