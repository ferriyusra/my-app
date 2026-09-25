import DiscardedDetail, { when } from '@/components/content/discarded-detail';
import { discarded } from '@/data/discarded';
import SectionHead from './section-head';

/**
 * The decisions this repository reversed, open and in full.
 *
 * PRODUCT.md calls these the thing a neighbouring portfolio cannot truthfully
 * copy. They render through `DiscardedDetail`, the component the Recycle Bin
 * and Explorer use, so the three cannot disagree about what was cut or why.
 * "Decisions reversed" rather than a word like "judgement": the entries show
 * the judgement; the heading should not claim it.
 */
export default function Decisions() {
	const hashed = discarded.filter((d) => d.commit).length;
	return (
		<section id='decisions' className='sy-section' aria-labelledby='decisions-title'>
			<div className='sy-wrap'>
				<SectionHead
					id='decisions'
					title='Built, then thrown away'
					meta={`${discarded.length} decisions this site reversed · ${hashed} with the commit that removed them`}
				/>
				<ol className='sy-decisions'>
					{discarded.map((d) => (
						<li key={d.name} className='sy-decision'>
							<DiscardedDetail item={d} />
							<p className='sy-decision-when'>{when(d.date)}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
