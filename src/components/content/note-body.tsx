import { TOPICS, noteLength, type WrittenNote } from '@/data/notes';
import { monthLong as when } from '@/lib/dates';
import ProseBlock from './prose';
import { prose } from '@/lib/text';

/**
 * One written note, rendered.
 *
 * No 'use client' on purpose: the home page renders it into the response
 * body, so a note reads the same on a phone, in print and with scripting off.
 * The host puts it under an `h2` of its own, so the title is an `h3` and its
 * sections `h4`. It borrows the `cs-` prose classes the case study uses
 * rather than growing a set of its own.
 */
export default function NoteBody({ note }: { note: WrittenNote }) {
	const length = noteLength(note);

	return (
		<div className='cs'>
			<h3>{note.title}</h3>

			{/* Front matter, plus the size of the thing: a reader deciding whether
			    to start wants to know how long it is. */}
			<p className='cs-meta'>
				<span>{TOPICS[note.topic]}</span>
				<span>{when(note.date)}</span>
				<span>
					{length.sections} {length.sections === 1 ? 'section' : 'sections'}, about{' '}
					{length.minutes} min
				</span>
			</p>
			<p className='cs-summary'>{prose(note.summary)}</p>

			{note.applies && note.applies.length > 0 && (
				<ul className='cs-stack'>
					{note.applies.map((name) => (
						<li key={name}>{name}</li>
					))}
				</ul>
			)}

			{note.sections.map((s) => (
				<section key={s.heading} className='cs-section'>
					<h4>{s.heading}</h4>
					{s.body.map((b, i) => (
						<ProseBlock key={i} block={b} />
					))}
				</section>
			))}

			{/* Attribution, on the page rather than in a commit message: what this
			    was studied from, and whose words the write-up is in. */}
			<p className='cs-source'>
				Studied from {note.source.name}. {note.source.note}
			</p>
		</div>
	);
}
