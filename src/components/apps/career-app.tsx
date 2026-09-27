'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { List } from 'lucide-react';
import { LiGamepad2 } from '@/components/icons/line-icons';
import { decisionRows } from '@/data/career-objectives';
import Adventure from './career/adventure';
import CareerSummary from './career/summary';
import { chapters } from './career/world';
import { loadRun, resetRun, saveRun, toLive, toRun, type Known } from './career/save';

/**
 * Career.exe — the same work history in two registers.
 *
 * **Adventure** is a small side-scroller: you walk a character left to right
 * through five chapters, one per role. Each asks for the skills that role was
 * the first to use, and for something that role actually did — carry seven
 * product lines, ship five dashboards, connect four data stores, play the
 * case study's own alerting policy — while generic bugs patrol the floor. A
 * track above the world carries all five, so the career is legible before a
 * step is taken and any role is one click away.
 *
 * **The run outlives the tab, and the window.** Progress lives here rather
 * than inside Adventure, because the switch below is a plain ternary:
 * Adventure unmounts, and component-local state goes with it. That once meant
 * reading the summary threw away everything collected. It is saved to the
 * browser now as well, so closing the window does not either.
 *
 * **Summary** is the same content as a list, and it is the default when the
 * visitor has asked for reduced motion. That is the rule this window is built
 * on: nothing is only reachable by playing. The Experience window remains the
 * surface for anyone who came here to read a CV quickly — this one is allowed
 * to be slow, because nothing is lost if it is never opened.
 */

type Mode = 'play' | 'read';

/** Every id the world has, so a stored run can be filtered through it. */
function knownIds(): Known {
	const all = chapters();
	return {
		tokens: new Set(all.flatMap((c) => c.tokens.map((t) => t.id))),
		stops: new Set(all.flatMap((c) => c.spots.map((s) => s.id))),
		rows: new Set(decisionRows().map((r) => r.id)),
		bugs: new Set(all.flatMap((c) => c.hazards.map((h) => h.id))),
	};
}

export default function CareerApp() {
	const [mode, setMode] = useState<Mode>(() =>
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'read'
			: 'play',
	);

	/* Read once, through a lazy initialiser: the loop mutates `liveRef` every
	   frame, and render only ever sees the `run` snapshot `publish` takes. */
	const [boot] = useState(() => {
		const known = knownIds();
		const run = loadRun(known);
		return { known, run, live: toLive(run) };
	});
	const liveRef = useRef(boot.live);
	const [run, setRun] = useState(boot.run);
	/* Bumped by Play again, so the adventure remounts where it started. */
	const [round, setRound] = useState(0);

	const publish = useCallback(() => {
		const next = toRun(liveRef.current);
		saveRun(next);
		setRun(next);
	}, []);

	const reset = useCallback(() => {
		liveRef.current = toLive(resetRun(liveRef.current.best));
		publish();
		setRound((n) => n + 1);
	}, [publish]);

	/* Play time accrues every frame but is only published on events; keep it
	   when the page goes away mid-walk. */
	useEffect(() => {
		const flush = () => saveRun(toRun(liveRef.current));
		const onHide = () => {
			if (document.visibilityState === 'hidden') flush();
		};
		window.addEventListener('pagehide', flush);
		document.addEventListener('visibilitychange', onHide);
		return () => {
			flush();
			window.removeEventListener('pagehide', flush);
			document.removeEventListener('visibilitychange', onHide);
		};
	}, []);

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
					key={round}
					onDone={() => setMode('read')}
					run={run}
					liveRef={liveRef}
					known={boot.known}
					publish={publish}
					reset={reset}
				/>
			) : (
				<CareerSummary />
			)}
		</div>
	);
}
