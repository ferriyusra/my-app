'use client';

import { useEffect, useRef, useState } from 'react';
import { career, levels } from '@/data/career-game';
import { profile } from '@/data/profile';
import { tenureLabel } from '@/data/experience';

/**
 * Career.exe — the work history as a progression.
 *
 * It exists as its own window rather than as a redesign of Experience, because
 * the Experience window is the surface a recruiter needs to work quickly. This
 * one can afford to be slow and playful; nothing is lost if it is never opened.
 *
 * The XP bar animates through a CSS custom property rather than React state,
 * for the same reason the window frame keeps geometry out of the reducer: a
 * value that changes every frame should not be publishing a new render.
 */
export default function CareerApp() {
	const all = levels();
	const totals = career();
	const barRef = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(0);

	/* Fill the bar and deal the levels out one at a time. Under
	   prefers-reduced-motion the CSS drops the transitions and this just
	   arrives, which is why the end state is set the same way either path. */
	useEffect(() => {
		const bar = barRef.current;
		if (bar) requestAnimationFrame(() => bar.style.setProperty('--fill', '100%'));

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			setRevealed(all.length);
			return;
		}
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
