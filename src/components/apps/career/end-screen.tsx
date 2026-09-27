'use client';

import type { Chapter } from './world';
import type { Run } from './save';

/** "2:05" from seconds. */
export function clockLabel(s: number): string {
	const m = Math.floor(s / 60);
	const r = Math.round(s % 60);
	return `${m}:${String(r).padStart(2, '0')}`;
}

/**
 * The end of a run: what was collected, how long it took against the best,
 * and three ways on — again, keep walking, or read it as a list.
 *
 * "Keep exploring" is there because a finished world is still a world: the
 * signposts still open, and the bugs not fixed are still out there.
 */
export default function EndScreen({
	chapters,
	run,
	bugs,
	rows,
	onAgain,
	onStay,
	onRead,
}: {
	chapters: Chapter[];
	run: Run;
	bugs: number;
	rows: number;
	onAgain: () => void;
	onStay: () => void;
	onRead?: () => void;
}) {
	const tokens = chapters.reduce((n, c) => n + c.tokens.length, 0);
	const best = run.best !== null && run.time !== null && run.best === run.time;

	return (
		<div className='cx-win' role='status'>
			<strong>
				All {tokens} skills and {chapters.length} objectives
			</strong>
			<ul className='cx-win-stats'>
				{run.time !== null && (
					<li>
						<b>{clockLabel(run.time)}</b>
						<span>{best ? 'a new best' : `best ${clockLabel(run.best ?? run.time)}`}</span>
					</li>
				)}
				<li>
					<b>
						{run.fixed.length}/{bugs}
					</b>
					<span>bugs fixed</span>
				</li>
				<li>
					<b>
						{run.firstTry.length}/{rows}
					</b>
					<span>decide() right first time</span>
				</li>
			</ul>
			<div className='cx-win-actions'>
				<button type='button' onClick={onAgain}>
					Play again
				</button>
				<button type='button' data-secondary onClick={onStay}>
					Keep exploring
				</button>
				{onRead && (
					<button type='button' data-secondary onClick={onRead}>
						Read it as a summary
					</button>
				)}
			</div>
			<ul className='cx-win-wall'>
				{chapters.map((c) => (
					<li key={c.exp.company}>
						<span className='cx-win-role'>{c.exp.short}</span>
						<span className='cx-win-skills'>
							{c.unlocked.map((u) => (
								<b key={u}>{u}</b>
							))}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
