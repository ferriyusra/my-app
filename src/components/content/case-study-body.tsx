import type { CaseBlock, CaseSection, FigureRow } from '@/data/case-study';
import CaseStudyNav from './case-study-nav';
import ProseBlock from './prose';
import { prose } from '@/lib/text';

/**
 * A case study's sections, rendered: the contents list, every section, the
 * figure where the document has one, and the questions it does not answer.
 * Both case pages use it, `/deposit-alerting` and `/satusehat`.
 *
 * No 'use client': it renders into the response body, which is what a
 * crawler, a printer and a phone all read. The page owns the front matter
 * (title, summary, role, stack); this owns the body.
 */

type Figure = { rows: readonly FigureRow[]; caption: string };

/** What the closing section is called, and how it introduces its list. */
export type OpenEdge = { nav: string; heading: string; intro: string };

/** The deposit-alerting write-up's own closing section. */
const WRITE_UP_EDGE: OpenEdge = {
	nav: 'What it does not answer',
	heading: 'What this write-up does not answer',
	intro:
		'These are the questions a reader with production experience would ask next. They are listed rather than glossed over, because a case study with no visible edges is a brochure.',
};

/** An id for a heading: "The problem" → "the-problem". */
function slug(heading: string): string {
	return heading
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Section numbers for the contents list come from the data, so the list and
 * the order of the sections cannot disagree. The headings carry no number:
 * a numeral set apart in front of a head reads as a label announcing it.
 */
const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The shape of the system as boxes, from a document's `figure`: the
 * write-up's own diagram, redrawn.
 *
 * DOM text and CSS, not an image: it renders with scripting off, recolours
 * with the theme, prints, and reflows from two columns to one in a narrow
 * column or on a phone (`.cs` is a container). A path row draws arrows between
 * its boxes and `<ol>` carries the order for a screen reader; a set row stands
 * its boxes side by side. The arrow is an empty, hidden element rather than a
 * glyph so nothing is announced twice.
 */
function CaseStudyFigure({ figure }: { figure: Figure }) {
	const { rows, caption } = figure;
	return (
		<figure className='cs-fig' data-rows={rows.length} aria-label='System diagram'>
			{rows.map((row) => {
				const List = row.kind === 'path' ? 'ol' : 'ul';
				return (
					<div key={row.name} className='cs-fig-row' data-kind={row.kind}>
						<p className='cs-fig-name'>{row.name}</p>
						<List className='cs-fig-nodes'>
							{row.nodes.map((n, i) => (
								<li key={n.label} className='cs-fig-node'>
									{row.kind === 'path' && i > 0 && (
										<span className='cs-fig-arrow' aria-hidden='true' />
									)}
									<span className='cs-fig-box'>
										<span className='cs-fig-label'>{n.label}</span>
										{/* The data joins a box's phrases with a middle dot; drawn,
										    each phrase takes its own line. */}
										{n.detail?.split(' · ').map((d) => (
											<span key={d} className='cs-fig-detail'>
												{d}
											</span>
										))}
									</span>
								</li>
							))}
						</List>
					</div>
				);
			})}
			<figcaption className='cs-fig-cap'>{prose(caption)}</figcaption>
		</figure>
	);
}

/** One block: the figure is drawn here, everything else by ProseBlock. */
function Block({ block, figure }: { block: CaseBlock; figure?: Figure }) {
	if (typeof block !== 'string' && block.kind === 'figure') {
		return figure ? <CaseStudyFigure figure={figure} /> : null;
	}
	return <ProseBlock block={block} />;
}

/**
 * A heading as the contents list names it: the part after a colon, so "The
 * interesting part: deciding when to speak" lists as "Deciding when to speak"
 * and a link never wraps on a phone. The heading itself is untouched.
 */
function navLabel(heading: string): string {
	const tail = heading.split(': ').pop() ?? heading;
	return tail.charAt(0).toUpperCase() + tail.slice(1);
}

export default function CaseStudyBody({
	doc,
	edge = WRITE_UP_EDGE,
}: {
	doc: {
		sections: readonly CaseSection[];
		openQuestions: readonly string[];
		figure?: Figure;
	};
	edge?: OpenEdge;
}) {
	const sections = doc.sections.map((s) => ({ ...s, id: slug(s.heading) }));
	const openId = 'open-questions';

	return (
		<div className='cs-doc'>
			<CaseStudyNav
				items={[
					...sections.map((s, i) => ({ id: s.id, num: num(i), label: navLabel(s.heading) })),
					/* Unnumbered: the page counts the document's own sections, and the
					   questions it leaves open are not one of them. */
					{ id: openId, num: '', label: edge.nav },
				]}
			/>

			<div className='cs-body'>
				{sections.map((s) => (
					<section key={s.heading} id={s.id} className='cs-section'>
						<h2>{s.heading}</h2>
						{s.body.map((b, j) => (
							<Block key={j} block={b} figure={doc.figure} />
						))}
					</section>
				))}

				<section id={openId} className='cs-section cs-open'>
					<h2>{edge.heading}</h2>
					<p>{prose(edge.intro)}</p>
					<ul className='cs-list'>
						{doc.openQuestions.map((q) => (
							<li key={q}>{prose(q)}</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
