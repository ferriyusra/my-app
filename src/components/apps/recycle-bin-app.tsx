'use client';

import { RecycleIcon } from '@/components/icons/app-icons';

/** An empty bin, and an honest reason why. */
export default function RecycleBinApp() {
	return (
		<div className='rb-empty'>
			<RecycleIcon size={72} />
			<h2>Recycle Bin is empty</h2>
			<p>
				Nothing thrown away yet. The abandoned ideas live in a notebook, and the
				dead branches live in Git.
			</p>
		</div>
	);
}
