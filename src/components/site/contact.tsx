import { profile } from '@/data/profile';
import { LiDownload } from '@/components/icons/line-icons';
import { monthLong } from '@/lib/dates';
import { prose } from '@/lib/text';

/**
 * The close, as a hire page ends (anatomy.md, hire): the address to write to
 * set large, the CV, the places elsewhere, and what is being done this month.
 * The head carries the two facts a remote reader needs before writing: the
 * city and the time zone, both from `profile.ts`. Where the owner is and when
 * they can talk in full sit in the register after the first sheet; the name
 * and the role are in the title block beneath.
 */
export default function Contact() {
	const openTo = profile.now.find((n) => n.label === 'Open to');
	const doing = profile.now.filter((n) => n.label !== 'Open to');
	const city = profile.location.split(',')[0];
	/* "GMT+7", from "…remote. GMT+7 overlaps most of the EU morning…" */
	const zone = openTo?.text.match(/GMT[+-]\d+/)?.[0];

	return (
		<section id='contact' className='q q--close' aria-labelledby='contact-q'>
			<div className='container q__grid'>
				<div className='q__top'>
					<h2 id='contact-q' className='q__head' data-reveal>
						Contact in {city}
						{zone ? `, ${zone}` : ''}
					</h2>
				</div>
				<div className='q__body'>
					<a className='close__mail' href={`mailto:${profile.email}`} data-reveal>
						{profile.email}
					</a>
					<div className='actions' data-reveal>
						<a
							className='btn btn--primary'
							href={profile.cvView}
							target='_blank'
							rel='noopener noreferrer'>
							Open my CV
						</a>
						<a
							className='btn btn--secondary'
							href={profile.cvDownload}
							target='_blank'
							rel='noopener noreferrer'>
							<LiDownload size={16} aria-hidden='true' />
							Download the PDF
						</a>
					</div>
					<p className='close__elsewhere' data-reveal>
						Elsewhere:{' '}
						<a href={profile.github} target='_blank' rel='noopener noreferrer'>
							GitHub
						</a>
						{', '}
						<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
							LinkedIn
						</a>
					</p>
					<details className='more' data-reveal>
						{/* One span, so the line and its date wrap as one sentence
						    beside the chevron rather than as two ragged columns. */}
						<summary>
							<span>
								What I am doing now, as of{' '}
								<time dateTime={profile.nowUpdated}>{monthLong(profile.nowUpdated)}</time>
							</span>
						</summary>
						<dl className='more__dl'>
							{doing.map((n) => (
								<div key={n.label}>
									<dt>{n.label}</dt>
									<dd>{prose(n.text)}</dd>
								</div>
							))}
						</dl>
					</details>
				</div>
			</div>
		</section>
	);
}
