import { Fragment } from 'react';
import { caseStudy, type CaseBlock } from '@/data/case-study';

/**
 * No 'use client' on purpose: the server document renders this into the
 * response body, and the Experience window renders the same component inside
 * the shell. One implementation, so the two never drift.
 */

/** The write-up's prose uses **bold** for lead-ins and *italics* for stress. */
function emphasise(text: string) {
	return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={i}>{part.slice(2, -2)}</strong>;
		}
		if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
			return <em key={i}>{part.slice(1, -1)}</em>;
		}
		return part;
	});
}

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

/** One block of a section. The write-up has paragraphs, lists, code, one table and the figure. */
function Block({ block }: { block: CaseBlock }) {
	if (typeof block === 'string') return <p>{emphasise(block)}</p>;
	switch (block.kind) {
		case 'list':
			return (
				<ul className='cs-list'>
					{block.items.map((item) => (
						<li key={item}>{emphasise(item)}</li>
					))}
				</ul>
			);
		case 'code':
			return (
				<pre className='cs-code' data-lang={block.lang}>
					<code>{block.text}</code>
				</pre>
			);
		case 'table':
			return (
				/* The one wide thing in the write-up: it scrolls in its own box
				   on a phone rather than pushing the page sideways. */
				<div className='cs-table-wrap'>
					<table className='cs-table'>
						<thead>
							<tr>
								{block.head.map((h) => (
									<th key={h} scope='col'>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row) => (
								<tr key={row.join('|')}>
									{row.map((cell, i) => (
										<td key={i}>{emphasise(cell)}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		case 'figure':
			return <CaseStudyFigure />;
	}
}

/**
 * `level` is the heading level of the write-up's own sections.
 *
 * It defaults to 4, which is right where a window renders the case study under
 * an `h3` title. The document nests it one deeper — the write-up lives inside
 * the Meditap role there, under that role's `h3` and its own `h4` title — so
 * without this the title and the sections it introduces would be siblings.
 */
export default function CaseStudyBody({ level = 4 }: { level?: 4 | 5 }) {
	const H = (level === 5 ? 'h5' : 'h4') as 'h4' | 'h5';
	return (
		<div className='cs'>
			{/* The write-up's front matter, as one line. */}
			<p className='cs-meta'>
				<span>{caseStudy.role}</span>
				<span>{caseStudy.domain}</span>
				<span>{caseStudy.year}</span>
			</p>
			<p className='cs-summary'>{caseStudy.summary}</p>

			<ul className='cs-stack'>
				{caseStudy.stack.map((t) => (
					<li key={t}>{t}</li>
				))}
			</ul>

			{caseStudy.sections.map((s) => (
				<Fragment key={s.heading}>
					<section className='cs-section'>
						<H>{s.heading}</H>
						{s.body.map((b, i) => (
							<Block key={i} block={b} />
						))}
					</section>
				</Fragment>
			))}

			<section className='cs-section cs-open'>
				<H>What this write-up does not answer</H>
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

			{/* The record itself, one click away. A test keeps this page in step
			    with it, so a reader can check rather than trust. */}
			<p className='cs-source'>
				Transcribed from{' '}
				<a href={caseStudy.source} target='_blank' rel='noopener noreferrer'>
					the original write-up
				</a>
				, a Markdown file served as it was written; a test keeps this page in
				step with it.
			</p>
		</div>
	);
}
