'use client';

import { useState } from 'react';
import { Gamepad2, List } from 'lucide-react';
import Adventure from './career/adventure';
import CareerSummary from './career/summary';

/**
 * Career.exe — the same work history in two registers.
 *
 * **Adventure** is a small side-scroller: you walk a character left to right
 * through five chapters, one per role, collecting the skills that role was the
 * first to use. A gate holds each chapter shut until its skills are picked up,
 * so you cannot arrive at 2025 without having walked through 2021.
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

	return (
		<div className='cx-app'>
			<div className='cx-modes' role='tablist' aria-label='Career.exe mode'>
				<button
					type='button'
					role='tab'
					aria-selected={mode === 'play'}
					data-on={mode === 'play' || undefined}
					onClick={() => setMode('play')}>
					<Gamepad2 size={14} aria-hidden='true' /> Adventure
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
				<Adventure onDone={() => setMode('read')} />
			) : (
				<CareerSummary />
			)}
		</div>
	);
}
