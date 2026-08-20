'use client';

import { Trash2 } from 'lucide-react';

export default function RecycleBinApp() {
	return (
		<div className='app-pad recycle-empty'>
			<Trash2 size={44} aria-hidden='true' />
			<p className='app-h2'>Recycle Bin is empty</p>
			<p className='app-sub'>
				Nothing thrown away yet. The abandoned ideas live in a notebook.
			</p>
		</div>
	);
}
