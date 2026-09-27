'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { DecisionRow } from '@/data/career-objectives';

/**
 * Meditap's objective: play the alerting policy.
 *
 * The case study's decision is a state machine over a client's last recorded
 * state and today's reading, and its write-up lists the behaviour as a table
 * of nine rows. Here each row is a case to decide: email the client today, or
 * not? The answer is checked against the table, and the table's own "Why" is
 * shown either way — verbatim, from `caseStudy`, never rewritten.
 *
 * A wrong answer is not a failure. The row comes round again after the rest,
 * and the objective is done when all nine match — so the one thing a player
 * leaves with is the policy, which is the point of the write-up. What they
 * got right first time is kept as the score.
 *
 * The game is paused underneath. Escape closes this and not the window: it is
 * marked handled, and `window.tsx` stands down on a handled Escape.
 */
export default function Decision({
	rows,
	solved,
	firstTry,
	onAnswer,
	onClose,
	onReadCase,
}: {
	rows: DecisionRow[];
	solved: ReadonlySet<string>;
	firstTry: ReadonlySet<string>;
	/** Records the answer and says whether the table agrees. */
	onAnswer: (row: DecisionRow, answer: 'Yes' | 'No') => boolean;
	onClose: () => void;
	onReadCase: () => void;
}) {
	/* The rows still to match, in table order, starting where the player is. */
	const open = useMemo(() => rows.filter((r) => !solved.has(r.id)), [rows, solved]);
	const [current, setCurrent] = useState<string | null>(() => open[0]?.id ?? null);
	const [result, setResult] = useState<{ answer: 'Yes' | 'No'; right: boolean } | null>(null);
	const root = useRef<HTMLDivElement>(null);

	const row = rows.find((r) => r.id === current) ?? null;
	const done = open.length === 0 && !result;

	/* Focus moves in, so the keys that follow belong to the decision and not
	   to the character standing behind it. */
	useEffect(() => {
		root.current?.querySelector<HTMLButtonElement>('button')?.focus();
	}, [current, result, done]);

	const answer = (a: 'Yes' | 'No') => {
		if (!row || result) return;
		setResult({ answer: a, right: onAnswer(row, a) });
	};

	const next = () => {
		if (!row) return;
		/* The next unmatched row after this one, wrapping round to the misses. */
		const after = rows.slice(rows.indexOf(row) + 1).concat(rows.slice(0, rows.indexOf(row) + 1));
		const upcoming = after.find((r) => !solved.has(r.id) && r.id !== row.id) ??
			(result?.right ? null : row);
		setResult(null);
		setCurrent(upcoming?.id ?? null);
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			onClose();
			return;
		}
		/* Y and N answer, as the buttons are labelled. */
		if (!result && row && (e.key === 'y' || e.key === 'Y')) answer('Yes');
		else if (!result && row && (e.key === 'n' || e.key === 'N')) answer('No');
		else return;
		e.preventDefault();
	};

	const matched = solved.size;

	return (
		<div
			className='cx-decide'
			ref={root}
			role='dialog'
			aria-modal='true'
			aria-labelledby='cx-decide-title'
			onKeyDown={onKeyDown}>
			<div className='cx-decide-card'>
				<p className='cx-decide-kicker'>
					<code>decide()</code> · Meditap&rsquo;s alerting policy
				</p>
				<h3 id='cx-decide-title'>
					{done ? 'All nine match the table' : 'Email this client today?'}
				</h3>
				<p className='cx-decide-count' aria-live='polite'>
					{matched} of {rows.length} matched · {firstTry.size} right first time
				</p>

				{done || !row ? (
					<>
						<p className='cx-decide-body'>
							That is the policy the service runs: suppress a repeat, never swallow an escalation, a
							threshold edit or a top-up.
						</p>
						<div className='cx-decide-actions'>
							<button type='button' onClick={onClose}>
								Back to the walk
							</button>
							<button type='button' data-secondary onClick={onReadCase}>
								Read it in the case study
							</button>
						</div>
					</>
				) : (
					<>
						<dl className='cx-decide-case'>
							<div>
								<dt>Last state</dt>
								<dd>{row.last}</dd>
							</div>
							<div>
								<dt>Today&rsquo;s reading</dt>
								<dd>{row.today}</dd>
							</div>
						</dl>

						{result ? (
							<>
								<p className='cx-decide-why' data-right={result.right || undefined}>
									<strong>
										{result.right ? 'Matches the table' : 'The table says otherwise'} — email:{' '}
										{row.email.toLowerCase()}.
									</strong>{' '}
									{row.why}.
								</p>
								<div className='cx-decide-actions'>
									<button type='button' onClick={next}>
										Next case
									</button>
								</div>
							</>
						) : (
							<div className='cx-decide-actions'>
								<button type='button' onClick={() => answer('Yes')}>
									Email <kbd>Y</kbd>
								</button>
								<button type='button' onClick={() => answer('No')}>
									Don&rsquo;t email <kbd>N</kbd>
								</button>
							</div>
						)}
					</>
				)}

				<button type='button' className='cx-decide-close' aria-label='Close' onClick={onClose}>
					Esc
				</button>
			</div>
		</div>
	);
}
