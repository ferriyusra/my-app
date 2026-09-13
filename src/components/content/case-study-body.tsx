import { caseStudy, caseStudyLength, type CaseBlock } from '@/data/case-study';
import CaseStudyNav from './case-study-nav';
import ProseBlock from './prose';

/**
 * No 'use client' on purpose: the server document renders this into the
 * response body, and the Experience window renders the same component inside
 * the shell. One implementation, so the two never drift.
 */

/** An id for a heading: "The problem" → "the-problem". */
function slug(heading: string): string {
	return heading
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Section numbers come from the data, not from a CSS counter.
 *
 * `.cs` is a CSS container, and `container-type` brings style containment with
 * it, which scopes counters — every heading rendered "01". Numbering here also
 * means the contents list and the headings cannot disagree.
 */
const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * The shape of the system as boxes, from `caseStudy.figure` — the write-up's
 * own diagram, redrawn.
 *
 * DOM text and CSS, not an image: it renders with scripting off, recolours
 * with the theme, prints, and reflows from two columns to one inside a narrow
 * window or on a phone (`.cs` is a container; see globals.css). A path row
 * draws arrows between its boxes and `<ol>` carries the order for a screen
 * reader; a set row stands its boxes side by side with nothing between them.
 * The arrow is an empty, hidden element rather than a glyph so nothing is
 * announced twice.
 */
function CaseStudyFigure() {
	const { rows, caption } = caseStudy.figure;
	return (
		<figure className='cs-fig' data-rows={rows.length}>
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
										{n.detail && <span className='cs-fig-detail'>{n.detail}</span>}
									</span>
								</li>
							))}
						</List>
					</div>
				);
			})}
			<figcaption className='cs-fig-cap'>{caption}</figcaption>
		</figure>
	);
}

/**
 * One block of a section.
 *
 * Paragraphs, lists, code and tables are shared with the learning notes and
 * rendered by ProseBlock. The figure is the one block only this write-up has,
 * so it is the one block this file still draws.
 */
function Block({ block }: { block: CaseBlock }) {
	if (typeof block !== 'string' && block.kind === 'figure') return <CaseStudyFigure />;
	return <ProseBlock block={block} />;
}

/**
 * `level` is the heading level of the write-up's own sections.
 *
 * It defaults to 4, which is right where a window renders the case study under
 * an `h3` title. The document nests it one deeper — the write-up lives inside
 * the Meditap role there, under that role's `h3` and its own `h4` title — so
 * without this the title and the sections it introduces would be siblings.
 *
 * `idPrefix` keeps the section ids unique on a page that holds the write-up
 * twice: the desktop renders the server document (hidden) and a window.
 */
export default function CaseStudyBody({
	level = 4,
	idPrefix = 'cs',
}: {
	level?: 4 | 5;
	idPrefix?: string;
}) {
	const H = (level === 5 ? 'h5' : 'h4') as 'h4' | 'h5';
	const length = caseStudyLength();
	const sections = caseStudy.sections.map((s) => ({ ...s, id: `${idPrefix}-${slug(s.heading)}` }));
	const openId = `${idPrefix}-open-questions`;

	return (
		<div className='cs'>
			{/* The write-up's front matter, plus its size: a reader deciding
			    whether to start wants to know how long the thing is. */}
			<p className='cs-meta'>
				<span>{caseStudy.role}</span>
				<span>{caseStudy.domain}</span>
				<span>{caseStudy.year}</span>
				<span>
					{length.sections} sections · about {length.minutes} min
				</span>
			</p>
			<p className='cs-summary'>{caseStudy.summary}</p>

			<ul className='cs-stack'>
				{caseStudy.stack.map((t) => (
					<li key={t}>{t}</li>
				))}
			</ul>

			<CaseStudyNav
				items={[
					...sections.map((s, i) => ({ id: s.id, num: num(i), label: s.heading })),
					{ id: openId, num: num(sections.length), label: 'What it does not answer' },
				]}
			/>

			{sections.map((s, i) => (
				<section key={s.heading} id={s.id} className='cs-section'>
					<H>
						<span className='cs-num' aria-hidden='true'>
							{num(i)}
						</span>
						{s.heading}
					</H>
					{s.body.map((b, j) => (
						<Block key={j} block={b} />
					))}
				</section>
			))}

			<section id={openId} className='cs-section cs-open'>
				<H>
					<span className='cs-num' aria-hidden='true'>
						{num(sections.length)}
					</span>
					What this write-up does not answer
				</H>
				<p>
					These are the questions a reader with production experience would ask
					next. They are listed rather than glossed over, because a case study
					with no visible edges is a brochure.
				</p>
				<ul>
					{caseStudy.openQuestions.map((q) => (
						<li key={q}>{q}</li>
					))}
				</ul>
			</section>
		</div>
	);
}
