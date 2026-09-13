'use client';

import { useState } from 'react';
import { NotesIcon } from '@/components/icons/app-icons';
import NoteBody from '@/components/content/note-body';
import { when } from '@/components/content/discarded-detail';
import { useAppIntent } from '@/hooks/use-app-intent';
import {
	STATUS_LABEL,
	TOPICS,
	noteMonth,
	notes,
	plannedNotes,
	writtenNotes,
	type Note,
	type NoteTopic,
} from '@/data/notes';

/**
 * Learning notes, and the plan for the ones not written yet.
 *
 * The window shows the whole list — written and not — because the plan is the
 * point of it on a site whose author is mid-course. Everywhere else derives
 * from the written notes alone: Explorer grows a folder and the document grows
 * a section when there is something in them, and an unwritten note is not
 * indexed, because a search result that opens onto "not written yet" answers
 * nothing.
 *
 * The detail pane is a shared component, so a note reads the same here, in
 * Explorer and in the server document a phone or a crawler gets.
 */

/** Topic order: the list is grouped, and a group with nothing in it is skipped. */
const ORDER: NoteTopic[] = ['dsa', 'system-design'];

/** What an unwritten note's pane says, in place of a body it does not have. */
function Planned({ note }: { note: Note & { status: 'studying' | 'planned' } }) {
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

			{/* Said plainly rather than dressed as a teaser. The month is the
			    whole difference between a study plan and a "Coming soon" page,
			    and a test fails when one of these dates goes stale. */}
			<p className='nt-soon-note'>
				{note.status === 'studying'
					? 'Being worked through now. The write-up lands here when it is mine to write rather than the course’s to lend.'
					: 'On the plan, not yet started. It appears here written up in my own words, or the date above moves.'}
			</p>
		</div>
	);
}

export default function NotesApp() {
	const [selected, setSelected] = useState(notes[0]?.slug ?? '');
	useAppIntent('notes', (slug) => {
		if (notes.some((n) => n.slug === slug)) setSelected(slug);
	});

	const note = notes.find((n) => n.slug === selected) ?? notes[0];
	const written = writtenNotes().length;
	const planned = plannedNotes().length;

	return (
		<div className='nt'>
			<div className='nt-head'>
				<NotesIcon size={20} />
				<div>
					<h2>Notes</h2>
					<p>
						{written > 0
							? `${written} written, ${planned} on the plan — algorithms and system design, in my own words`
							: `${planned} on the plan — algorithms and system design, written up as I go`}
					</p>
				</div>
			</div>

			<div className='nt-body'>
				<div className='nt-list' role='listbox' aria-label='Notes'>
					{ORDER.map((topic) => {
						const rows = notes.filter((n) => n.topic === topic);
						if (rows.length === 0) return null;
						return (
							<div key={topic} className='nt-group'>
								<p className='nt-group-name' aria-hidden='true'>
									{TOPICS[topic]}
								</p>
								{rows.map((n) => (
									<button
										key={n.slug}
										type='button'
										role='option'
										aria-selected={n.slug === note?.slug}
										className='nt-row'
										data-on={n.slug === note?.slug || undefined}
										data-status={n.status}
										onClick={() => setSelected(n.slug)}>
										<span className='nt-row-title'>{n.title}</span>
										<span className='nt-row-meta'>
											<span className='nt-dot' aria-hidden='true' />
											{STATUS_LABEL[n.status]} · {when(noteMonth(n))}
										</span>
									</button>
								))}
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
		</div>
	);
}
