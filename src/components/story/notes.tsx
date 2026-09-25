import NoteBody from '@/components/content/note-body';
import { writtenNotes } from '@/data/notes';

/**
 * Written notes, and only when there are some.
 *
 * Today there are none, so this renders nothing — and that is the design: a
 * section of promised topics is the "Coming soon" page this repository
 * deleted, and it is still in the Recycle Bin. The first `written` entry in
 * `notes.ts` turns this on by itself.
 *
 * No index in the kicker: the numbered sections are the fixed spine of the
 * story, and this one comes and goes with the data.
 */
export default function Notes() {
	const written = writtenNotes();
	if (!written.length) return null;
	return (
		<section id='notes' className='sy-section' aria-labelledby='notes-title'>
			<div className='sy-wrap'>
				<header className='sy-head'>
					<p className='sy-kicker'>Notes</p>
					<h2 id='notes-title'>Written up in my own words</h2>
					<p className='sy-head-meta'>{written.length} written</p>
				</header>
				<ol className='sy-notes'>
					{written.map((n) => (
						<li key={n.slug}>
							<NoteBody note={n} />
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
