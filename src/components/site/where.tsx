import { profile } from '@/data/profile';
import { prose } from '@/lib/text';

/**
 * Where and when, straight after the first sheet, as a hire page answers it
 * (anatomy.md, hire): a register of four keylined cells, every value from
 * `profile.ts`. The close does not repeat them.
 */
export default function Where() {
	const openTo = profile.now.find((n) => n.label === 'Open to');
	const [terms, ...rest] = (openTo?.text ?? profile.openTo).split('. ');
	/* "GMT+7 overlaps most of the EU morning and all of APAC." */
	const hours = rest.join('. ');

	return (
		<section className='where' aria-label='Where and when'>
			<div className='container'>
				<dl className='register where__cells'>
					<div data-reveal>
						<dt>Based</dt>
						<dd>{profile.location}</dd>
					</div>
					<div data-reveal>
						<dt>Open to</dt>
						<dd>{prose(terms.replace(/\.$/, '') + '.')}</dd>
					</div>
					{hours && (
						<div data-reveal>
							<dt>Hours</dt>
							<dd>{prose(hours)}</dd>
						</div>
					)}
					<div data-reveal>
						<dt>Status</dt>
						<dd>{profile.availability}</dd>
					</div>
				</dl>
			</div>
		</section>
	);
}
