'use client';

import { useState } from 'react';
import { DocumentIcon, RecycleIcon } from '@/components/icons/app-icons';
import DiscardedDetail, { when } from '@/components/content/discarded-detail';
import { discarded } from '@/data/discarded';

/**
 * The Recycle Bin, holding what was actually thrown away.
 *
 * An empty bin was the honest state until there was something real to put in
 * it. Every row is a decision this repository reversed, and the commit that
 * did it — so the reasoning is checkable rather than claimed.
 *
 * The detail pane is a shared component: Explorer opens the same entries from
 * Documents ▸ Decisions reversed, and the server document prints them.
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
					<DiscardedDetail item={item} />
				</div>
			</div>
		</div>
	);
}
