import { TOPICS, noteLength, type WrittenNote } from '@/data/notes';
import { when } from './discarded-detail';
import ProseBlock from './prose';

/**
 * One written note, rendered.
 *
 * No 'use client' on purpose: the Notes window, Explorer's Documents ▸ Notes
 * and the server document all render this, so a note reads the same on a
 * desktop, in a folder, on a phone and with scripting off.
 *
 * Headings are fixed rather than a prop. Every host puts a note under an `h2`
 * of its own — the window's head, Explorer's detail title, the document's fold
 * — so the note's title is always an `h3` and its sections `h4`. The case study
 * needs the prop because the document nests it one deeper, inside a role.
 *
 * It borrows the `cs-` classes rather than growing a set of its own. They are
 * declared once, they describe a typed write-up rather than the case study in
 * particular, and a second identical block under another prefix is the kind of
 * duplication `repo.test.ts` exists to catch.
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
					{length.sections} {length.sections === 1 ? 'section' : 'sections'} ·
					about {length.minutes} min
				</span>
			</p>
			<p className='cs-summary'>{note.summary}</p>

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
