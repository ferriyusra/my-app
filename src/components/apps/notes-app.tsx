'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NotesIcon, RecycleIcon } from '@/components/icons/app-icons';
import { LiBriefcase } from '@/components/icons/line-icons';
import NoteBody from '@/components/content/note-body';
import { when } from '@/components/content/discarded-detail';
import { sendIntent, useAppIntent } from '@/hooks/use-app-intent';
import { useWindowManager } from '@/hooks/use-window-manager';
import { caseStudy } from '@/data/case-study';
import { discarded } from '@/data/discarded';
import {
	STATUS_LABEL,
	TOPICS,
	noteMonth,
	notes,
	plannedNotes,
	writtenNotes,
	type Note,
	type NoteTopic,
	type PlannedNote,
} from '@/data/notes';

/**
 * Learning notes: algorithms and system design, written up in the author's own
 * words.
 *
 * The window shows written notes and anything actually being worked on. It
 * shows nothing else — see the empty state below, which is the state it is in.
 *
 * The detail pane is a shared component, so a note reads the same here, in
 * Explorer and in the server document a phone or a crawler gets.
 */

/** Topic order. A group with nothing in it is not drawn. */
const ORDER: NoteTopic[] = ['dsa', 'system-design'];

/**
 * What the window says when there is nothing in it.
 *
 * Not a teaser, and not a date. A list of topics nobody has started is the
 * promise `/articles` was deleted for, and this desktop carries that reversal
 * where a visitor can read it. So the window says it is empty, says why, and —
 * rather than dead-ending — points at the writing on this site that does exist.
 * Mail's Sent folder and the editor's disabled source control answer the same
 * way: filling any of them would mean inventing content.
 */
function Empty() {
	const { launch } = useWindowManager();

	return (
		<div className='nt-empty'>
			<span className='nt-empty-art' aria-hidden='true'>
				<NotesIcon size={34} />
			</span>

			<h3>Nothing written up yet</h3>
			<p>
				This is where notes on algorithms and system design will go, in my own
				words rather than a course’s.
			</p>
			<p className='nt-empty-why'>
				A list of topics nobody has started is a promise rather than a note, and
				the Recycle Bin on this desktop holds the last promise this site made
				and deleted. Filling this window early would mean inventing it.
			</p>

			<p className='nt-empty-label'>Already written</p>
			<div className='nt-empty-links'>
				<button
					type='button'
					className='nt-empty-link'
					onClick={() => {
						sendIntent('experience', 'case');
						launch('experience');
					}}>
					<span className='nt-empty-link-art' aria-hidden='true'>
						<LiBriefcase size={16} />
					</span>
					<span>
						<strong>{caseStudy.title}</strong>
						<small>
							A write-up of the {caseStudy.at} work, at more than bullet-point
							depth
						</small>
					</span>
				</button>

				<button
					type='button'
					className='nt-empty-link'
					onClick={() => launch('recycle')}>
					<span className='nt-empty-link-art' aria-hidden='true'>
						<RecycleIcon size={16} />
					</span>
					<span>
						<strong>Decisions reversed</strong>
						<small>
							{discarded.length} things this project built and then threw away,
							with the commit that did it
						</small>
					</span>
				</button>
			</div>
		</div>
	);
}

/** The pane for a note being worked on, in place of a body it does not have. */
function Planned({ note }: { note: PlannedNote }) {
	return (
		<div className='nt-soon'>
			<h3>{note.title}</h3>
			<p className='nt-soon-meta'>
				<span>{TOPICS[note.topic]}</span>
				<span>{STATUS_LABEL[note.status]}</span>
				<span>{when(note.target)}</span>
			</p>
			<p className='nt-soon-summary'>{note.summary}</p>

			{note.applies && note.applies.length > 0 && (
				<ul className='cs-stack'>
					{note.applies.map((name) => (
						<li key={name}>{name}</li>
					))}
				</ul>
			)}

			{/* Said plainly rather than dressed as a teaser. A test fails once the
			    month above is in the past, so this cannot go stale in silence. */}
			<p className='nt-soon-note'>
				{note.status === 'studying'
					? 'Being worked through now. The write-up lands here when it is mine to write rather than the course’s to lend.'
					: 'Started, not finished. It appears here written up in my own words, or the date above moves.'}
			</p>
		</div>
	);
}

export default function NotesApp() {
	const [selected, setSelected] = useState(notes[0]?.slug ?? '');
	const listRef = useRef<HTMLDivElement>(null);

	useAppIntent('notes', (slug) => {
		if (notes.some((n) => n.slug === slug)) setSelected(slug);
	});

	/* One flat list in the order the rows are drawn, so the arrow keys and the
	   groups cannot disagree about what "next" means. */
	const rows = useMemo(
		() => ORDER.flatMap((topic) => notes.filter((n) => n.topic === topic)),
		[],
	);
	const note: Note | undefined =
		rows.find((n) => n.slug === selected) ?? rows[0];

	/* Selecting from Start's search can land on a row below the fold. */
	useEffect(() => {
		listRef.current
			?.querySelector<HTMLElement>('[data-on]')
			?.scrollIntoView({ block: 'nearest' });
	}, [selected]);

	/**
	 * A listbox is expected to move with the arrow keys, and a row that is only
	 * reachable by pointer is a row a keyboard cannot read. Roving tabindex, so
	 * Tab crosses the list in one step rather than once per note.
	 */
	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const i = rows.findIndex((n) => n.slug === note?.slug);
			if (i < 0) return;
			const to =
				e.key === 'ArrowDown'
					? Math.min(i + 1, rows.length - 1)
					: e.key === 'ArrowUp'
						? Math.max(i - 1, 0)
						: e.key === 'Home'
							? 0
							: e.key === 'End'
								? rows.length - 1
								: -1;
			if (to < 0) return;
			e.preventDefault();
			setSelected(rows[to].slug);
			/* Move the caret with the selection: the row that answers the next
			   arrow key has to be the row that has focus. */
			listRef.current
				?.querySelectorAll<HTMLElement>('.nt-row')
				[to]?.focus();
		},
		[rows, note],
	);

	const written = writtenNotes().length;
	const planned = plannedNotes().length;

	return (
		<div className='nt' data-empty={rows.length === 0 || undefined}>
			<div className='nt-head'>
				<NotesIcon size={20} />
				<div>
					<h2>Notes</h2>
					<p>
						{rows.length === 0
							? 'Algorithms and system design, written up in my own words'
							: [
									written && `${written} written`,
									planned && `${planned} in progress`,
								]
									.filter(Boolean)
									.join(', ') +
								' — algorithms and system design, in my own words'}
					</p>
				</div>
			</div>

			{rows.length === 0 ? (
				<Empty />
			) : (
				<div className='nt-body'>
					<div
						className='nt-list'
						role='listbox'
						aria-label='Notes'
						ref={listRef}
						onKeyDown={onKeyDown}>
						{ORDER.map((topic) => {
							const group = notes.filter((n) => n.topic === topic);
							if (group.length === 0) return null;
							return (
								<div key={topic} className='nt-group'>
									<p className='nt-group-name' aria-hidden='true'>
										{TOPICS[topic]}
										<span>{group.length}</span>
									</p>
									{group.map((n) => {
										const on = n.slug === note?.slug;
										return (
											<button
												key={n.slug}
												type='button'
												role='option'
												aria-selected={on}
												tabIndex={on ? 0 : -1}
												className='nt-row'
												data-on={on || undefined}
												data-status={n.status}
												onClick={() => setSelected(n.slug)}>
												<span className='nt-row-title'>{n.title}</span>
												<span className='nt-row-meta'>
													<span className='nt-dot' aria-hidden='true' />
													{STATUS_LABEL[n.status]} · {when(noteMonth(n))}
												</span>
											</button>
										);
									})}
								</div>
							);
						})}
					</div>

					<div className='nt-detail'>
						{note &&
							(note.status === 'written' ? (
								<NoteBody note={note} />
							) : (
								<Planned note={note} />
							))}
					</div>
				</div>
			)}
		</div>
	);
}
