'use client';

import { useEffect, useRef, useState } from 'react';
import { career, levels } from '@/data/career-game';
import { profile } from '@/data/profile';
import { tenureLabel } from '@/data/experience';

/**
 * The career as a list — the plain reading of what Career.exe's adventure
 * mode makes you walk through.
 *
 * It is not a consolation prize: it is the whole content, and it is what the
 * window shows when motion is unwelcome. Anything the game says must be
 * sayable here, or the game is hiding something.
 */

function prefersReducedMotion(): boolean {
	return (
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

export default function CareerSummary() {
	const all = levels();
	const totals = career();
	const barRef = useRef<HTMLDivElement>(null);

	/* Start fully revealed when motion is unwelcome, rather than revealing from
	   an effect — a lazy initialiser keeps the first paint correct and keeps
	   this off the set-state-in-effect path the rest of the shell avoids. */
	const [revealed, setRevealed] = useState(() =>
		prefersReducedMotion() ? levels().length : 0,
	);

	/* Fill the bar, then deal the levels out one at a time. */
	useEffect(() => {
		const bar = barRef.current;
		if (bar) requestAnimationFrame(() => bar.style.setProperty('--fill', '100%'));
		if (prefersReducedMotion()) return;

		let n = 0;
		const id = setInterval(() => {
			n += 1;
			setRevealed(n);
			if (n >= all.length) clearInterval(id);
		}, 180);
		return () => clearInterval(id);
	}, [all.length]);

	const years = Math.floor(totals.months / 12);
	const months = totals.months % 12;

	return (
		<div className='cx'>
			<header className='cx-head'>
				<div className='cx-id'>
					<span className='cx-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					<div>
						<h2>{profile.name}</h2>
						<p>{profile.role}</p>
					</div>
					<span className='cx-lv'>LV.{all.length}</span>
				</div>

				<div className='cx-xp'>
					<div className='cx-xp-track'>
						<div className='cx-xp-fill' ref={barRef} />
					</div>
					<div className='cx-xp-meta'>
						<span>
							{years} yrs {months ? `${months} mos` : ''} served
						</span>
						<span>
							{totals.skills} skills · {totals.roles} roles
						</span>
					</div>
				</div>
			</header>

			<ol className='cx-levels'>
				{all.map((l, i) => (
					<li
						key={l.exp.company}
						className='cx-level'
						data-in={i < revealed || undefined}
						data-current={l.exp.current || undefined}
						style={{ ['--i' as string]: i }}>
						<div className='cx-level-head'>
							<span className='cx-badge'>LV.{l.level}</span>
							<div className='cx-level-name'>
								<strong>{l.exp.short}</strong>
								<span>
									{l.exp.period} · {tenureLabel(l.exp)}
								</span>
							</div>
							{l.exp.current && <span className='cx-active'>ACTIVE</span>}
						</div>

						<p className='cx-quest'>
							<span aria-hidden='true'>◈</span> {l.quest}
						</p>

						<div className='cx-unlock'>
							<span className='cx-unlock-n'>
								+{l.unlocked.length} unlocked
							</span>
							<ul>
								{l.unlocked.map((t) => (
									<li key={t}>{t}</li>
								))}
							</ul>
						</div>
					</li>
				))}
			</ol>

			<p className='cx-foot'>
				Levels are the roles in{' '}
				<code>src/data/experience.ts</code>, oldest first. A skill unlocks at
				the earliest role that used it — computed, not written down, so the
				shape of it is real.
			</p>
		</div>
	);
}
