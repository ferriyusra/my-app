import type { ReactNode } from 'react';
import { section, type SectionId } from '@/lib/story-sections';

/**
 * The top of a story section: its index and name in mono, then the headline.
 *
 * The index and name come from `STORY_SECTIONS`, so the nav, this head and the
 * anchors a phone is sent to cannot disagree. The headline is the section's
 * own sentence — plain, and only ever a restatement of what the section shows.
 */
export default function SectionHead({
	id,
	title,
	meta,
}: {
	id: SectionId;
	title: ReactNode;
	meta?: ReactNode;
}) {
	const s = section(id);
	return (
		<header className='sy-head'>
			<p className='sy-kicker'>
				{s.index && (
					<span className='sy-kicker-index' aria-hidden='true'>
						{s.index}
					</span>
				)}
				{s.title}
			</p>
			<h2 id={`${id}-title`}>{title}</h2>
			{meta && <p className='sy-head-meta'>{meta}</p>}
		</header>
	);
}
