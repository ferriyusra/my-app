'use client';

import type { RefObject } from 'react';
import {
	chapterProgress,
	pipPct,
	PICKUP_R,
	type Chapter,
	type Token,
} from './world';

/**
 * The whole career, above the world.
 *
 * Career.exe used to open with the character at x=60 of a 4700px world: you
 * could not see the career, you had to walk to find it. The minimap did not
 * help — it maps the chapter you are standing in, which is a different problem.
 *
 * Segment width grows with the months a role lasted, so the shape of five years
 * reads before a word of it does. The same `months` the Experience window's bar
 * uses, from the same place, so the two cannot draw different shapes.
 *
 * Not strictly to scale: a four-month role would come out too narrow to label,
 * so segments carry a floor in CSS. The ordering and the rough proportions are
 * the honest part; do not read exact durations off the widths.
 *
 * Interactive in Adventure, static in Summary. The optional props are what
 * separates the two — no mode flag.
 *
 * The segment is a div wrapping a button rather than being one, because the
 * pips sit on top and are clickable in their own right: a button inside a
 * button is not markup a browser will accept.
 */
export default function CareerTrack({
	chapters,
	here,
	have,
	onPick,
	onPickToken,
	markRef,
}: {
	chapters: Chapter[];
	/** Which chapter the character is standing in. */
	here?: number;
	/** Token ids collected so far. */
	have?: Set<string>;
	/** Absent in Summary, which is what makes the segments static there. */
	onPick?: (index: number) => void;
	/** Walk to one token rather than to the role's signpost. */
	onPickToken?: (token: Token) => void;
	/** The loop writes `left` onto this every frame; see below. */
	markRef?: RefObject<HTMLDivElement | null>;
}) {
	const playing = !!onPick;
	const total = chapters.reduce((n, c) => n + c.tokens.length, 0);

	return (
		<div className='cx-track'>
			<div
				className='cx-track-bar'
				role={playing ? 'group' : undefined}
				aria-label={playing ? 'Career timeline' : undefined}>
				{chapters.map((c) => {
					const done = have ? chapterProgress(c, have) : null;
					const cleared = done ? done.done === done.total : false;
					const label = `${c.exp.short}, ${c.exp.period}${
						done ? `, ${done.done} of ${done.total} skills` : ''
					}`;

					return (
						<div
							key={c.exp.company}
							className='cx-track-seg'
							style={{ flexGrow: c.months, ['--era' as string]: c.era }}
							data-on={here === c.index || undefined}
							data-done={cleared || undefined}>
							{playing ? (
								<button
									type='button'
									className='cx-track-open'
									aria-label={label}
									title={label}
									onClick={() => onPick(c.index)}>
									<span className='cx-track-name'>{c.exp.short}</span>
									<span className='cx-track-when'>{c.exp.years}</span>
								</button>
							) : (
								<span className='cx-track-open' title={label}>
									<span className='cx-track-name'>{c.exp.short}</span>
									<span className='cx-track-when'>{c.exp.years}</span>
								</span>
							)}

							{have &&
								c.tokens.map((t) =>
									onPickToken ? (
										/* Pointer-only, like the on-screen d-pad: twenty-six of
										   these in the tab order would bury the five segments
										   that are the keyboard route through the career. */
										<button
											key={t.id}
											type='button'
											tabIndex={-1}
											aria-hidden='true'
											className='cx-track-pip'
											data-got={have.has(t.id) || undefined}
											data-high={t.y > PICKUP_R || undefined}
											style={{ left: `${pipPct(t, c)}%` }}
											title={`Walk to ${t.skill}`}
											onPointerDown={(e) => e.preventDefault()}
											onClick={() => onPickToken(t)}
										/>
									) : (
										<span
											key={t.id}
											className='cx-track-pip'
											data-got={have.has(t.id) || undefined}
											data-high={t.y > PICKUP_R || undefined}
											style={{ left: `${pipPct(t, c)}%` }}
											title={t.skill}
										/>
									),
								)}

							{/* Rendered inside the active segment rather than on the track,
							    so the loop's existing `heroPct` write needs no change: a
							    segment *is* one chapter, which is exactly what heroPct
							    measures. A track-level marker would need a layout read
							    every frame to find the segment's box.

							    It re-parents on a chapter change, so React remounts it and
							    the imperative `left` is lost for one frame. Walking right
							    that is invisible — the boundary is where heroPct is 0, and
							    the CSS default is 0. Walking left it flashes once at the
							    segment's left edge, which is cheaper than the layout read. */}
							{markRef && here === c.index && (
								<div className='cx-track-you' ref={markRef} />
							)}
						</div>
					);
				})}
			</div>

			{have && (
				<span className='cx-track-total'>
					{/* Remounted on every pickup so the CSS bump replays — the same
					    trick the HUD score used before it moved here. */}
					<b key={have.size}>{have.size}</b>/{total}
				</span>
			)}
		</div>
	);
}
