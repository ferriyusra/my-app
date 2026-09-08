'use client';

import { useRef, useState } from 'react';
import { List } from 'lucide-react';
import { LiGamepad2 } from '@/components/icons/line-icons';
import Adventure from './career/adventure';
import CareerSummary from './career/summary';

/**
 * Career.exe — the same work history in two registers.
 *
 * **Adventure** is a small side-scroller: you walk a character left to right
 * through five chapters, one per role, collecting the skills that role was the
 * first to use. A track above the world carries all five, so the career is
 * legible before a step is taken and any role is one click away.
 *
 * **The run outlives the tab.** Progress lives here rather than inside
 * Adventure, because the switch below is a plain ternary: Adventure unmounts,
 * and component-local state goes with it. That meant reading the summary threw
 * away everything collected — including when the win screen's own "Read it as
 * a summary" button did it, one click after congratulating you. The character's
 * position is not kept, which is a smaller loss now that the track walks you
 * back to any role in one click.
 *
 * **Summary** is the same content as a list, and it is the default when the
 * visitor has asked for reduced motion. That is the rule this window is built
 * on: nothing is only reachable by playing. The Experience window remains the
 * surface for anyone who came here to read a CV quickly — this one is allowed
 * to be slow, because nothing is lost if it is never opened.
 */

type Mode = 'play' | 'read';

export default function CareerApp() {
	const [mode, setMode] = useState<Mode>(() =>
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'read'
			: 'play',
	);

	/* The mirrored pair the loop needs: the ref is what a frame reads and
	   writes, the array is what render is allowed to see. */
	const gotRef = useRef<Set<string>>(new Set());
	const [got, setGot] = useState<string[]>([]);
	const [finished, setFinished] = useState(false);
	const [elapsed, setElapsed] = useState(0);

	return (
		<div className='cx-app'>
			<div className='cx-modes' role='tablist' aria-label='Career.exe mode'>
				<button
					type='button'
					role='tab'
					aria-selected={mode === 'play'}
					data-on={mode === 'play' || undefined}
					onClick={() => setMode('play')}>
					<LiGamepad2 size={14} aria-hidden='true' /> Adventure
				</button>
				<button
					type='button'
					role='tab'
					aria-selected={mode === 'read'}
					data-on={mode === 'read' || undefined}
					onClick={() => setMode('read')}>
					<List size={14} aria-hidden='true' /> Summary
				</button>
			</div>

			{mode === 'play' ? (
				<Adventure
					onDone={() => setMode('read')}
					got={got}
					gotRef={gotRef}
					setGot={setGot}
					finished={finished}
					setFinished={setFinished}
					elapsed={elapsed}
					setElapsed={setElapsed}
				/>
			) : (
				<CareerSummary />
			)}
		</div>
	);
}
