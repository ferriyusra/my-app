import { profile } from '@/data/profile';
import { LiDownload } from '@/components/icons/line-icons';
import { monthLong } from '@/lib/dates';
import { prose } from '@/lib/text';

/**
 * The last question, on the page's one red field, closed as a letter: the
 * address to write to set large, the CV, the one office and its hours against
 * the reader's, and a sign-off. The hire job ends on contact details.
 */
export default function Contact() {
	const openTo = profile.now.find((n) => n.label === 'Open to');
	const doing = profile.now.filter((n) => n.label !== 'Open to');
	/* "…remote. GMT+7 overlaps most of the EU morning and all of APAC." */
	const hours = openTo?.text.split('. ').slice(1).join('. ');

	return (
		<section id='contact' className='q' data-tone='mark' aria-labelledby='contact-q'>
			<div className='container q__grid'>
				<h2 id='contact-q' className='q__head' data-reveal>
					How do I reach you in Jakarta?
				</h2>
				<div className='q__body'>
					<a className='close__mail' href={`mailto:${profile.email}`} data-reveal>
						{profile.email}
					</a>
					<p className='q__answer' data-reveal>
						{profile.openTo}
					</p>
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
					<dl className='office' data-reveal>
						<div>
							<dt>Office</dt>
							<dd>{profile.location}</dd>
						</div>
						{hours && (
							<div>
								<dt>Hours</dt>
								<dd>{prose(hours)}</dd>
							</div>
						)}
						<div>
							<dt>Elsewhere</dt>
							<dd>
								<a href={profile.github} target='_blank' rel='noopener noreferrer'>
									GitHub
								</a>
								{', '}
								<a href={profile.linkedin} target='_blank' rel='noopener noreferrer'>
									LinkedIn
								</a>
							</dd>
						</div>
					</dl>
					<details className='more' data-reveal>
						<summary>
							What I am doing now, as of{' '}
							<time dateTime={profile.nowUpdated}>{monthLong(profile.nowUpdated)}</time>
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
