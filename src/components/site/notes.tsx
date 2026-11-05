import { writtenNotes } from '@/data/notes';
import NoteBody from '@/components/content/note-body';
import Question from './question';

/**
 * The learning log, once it has something in it.
 *
 * `notes.ts` is empty on purpose, and the home page renders this only when a
 * note has been written: a section of planned topics is the "Coming soon" page
 * this repository deleted once already (`/articles`, commit 9f30192). Each
 * note is a disclosure row, because a written note runs to several screens.
 */
export default function Notes() {
	const written = writtenNotes();
	return (
		<Question id='notes' question='What are you studying?'>
			<ol className='rows'>
				{written.map((n) => (
					<li key={n.slug} className='row'>
						<details className='row__details'>
							<summary className='row__sum'>
								<h3 className='row__name'>{n.title}</h3>
							</summary>
							<div className='row__body'>
								<NoteBody note={n} />
							</div>
						</details>
					</li>
				))}
			</ol>
		</Question>
	);
}
