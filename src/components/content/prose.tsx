import { Fragment } from 'react';
import type { CaseBlock } from '@/data/case-study';
import { isHighlighted, tokenize } from '@/lib/highlight';

/**
 * The blocks a typed write-up is made of, rendered.
 *
 * No 'use client' on purpose, and no dependency on any one dataset: the case
 * study and the learning notes are both paragraphs, lists, code and tables, and
 * both are rendered into the response body by the server document and into a
 * window by the shell. One implementation, so the renderings cannot drift.
 *
 * The class names stay `cs-` rather than moving to a neutral prefix. They are
 * declared once in globals.css, `repo.test.ts` only polices duplicate class
 * names across `components/apps`, and renaming a dozen live rules to say the
 * same thing would be churn a reader of the diff could not tell from a fix.
 */

/** Everything except the case study's own figure, which only it can draw. */
export type ProseBlockKind = Exclude<CaseBlock, { kind: 'figure' }>;

/** A paragraph that opens with a bold lead-in reads as a run-in heading. */
const LEAD = /^\*\*[^*]+\*\*\s/;

/** True when a paragraph should render as a run-in heading. */
export const isLead = (block: string) => LEAD.test(block);

/**
 * Prose carries **bold** for lead-ins, *italics* for stress and `code` for a
 * name the reader could type. The case study uses the first two; the notes use
 * all three, because a note about a data structure names its operations.
 */
export function emphasise(text: string) {
	return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
		if (part.startsWith('**') && part.endsWith('**')) {
			return <strong key={i}>{part.slice(2, -2)}</strong>;
		}
		if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
			return (
				<code key={i} className='cs-ic'>
					{part.slice(1, -1)}
				</code>
			);
		}
		if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
			return <em key={i}>{part.slice(1, -1)}</em>;
		}
		return part;
	});
}

/**
 * What the code box says in its corner.
 *
 * A language the highlighter has no grammar for is a formula or pseudocode;
 * naming it would claim more than the box can show, so the corner stays empty.
 */
const LANG_LABEL: Record<string, string> = {
	go: 'Go',
	ts: 'TypeScript',
	typescript: 'TypeScript',
	js: 'JavaScript',
	javascript: 'JavaScript',
	python: 'Python',
	sql: 'SQL',
};

/**
 * Highlighting is per line, because a line comment runs to the end of its own
 * line and nowhere further. The newlines are put back between them, so what the
 * reader selects and copies is exactly what the author wrote.
 */
function Code({ lang, text }: { lang: string; text: string }) {
	const label = LANG_LABEL[lang.toLowerCase()];
	const lines = text.split('\n');
	return (
		<div className='cs-code-box'>
			{/* In the box's own bar, not floating over the code: the code
			    scrolls sideways and would have run under it. */}
			{label && (
				<span className='cs-code-lang' aria-hidden='true'>
					{label}
				</span>
			)}
			<pre className='cs-code' data-lang={lang}>
				<code>
					{isHighlighted(lang)
						? lines.map((line, i) => (
								<Fragment key={i}>
									{tokenize(line, lang).map((t, j) =>
										t.cls ? (
											<span key={j} className={t.cls}>
												{t.text}
											</span>
										) : (
											<Fragment key={j}>{t.text}</Fragment>
										),
									)}
									{i < lines.length - 1 ? '\n' : ''}
								</Fragment>
							))
						: text}
				</code>
			</pre>
		</div>
	);
}

/** One block of a section: a paragraph, a list, a code block or a table. */
export default function ProseBlock({ block }: { block: ProseBlockKind }) {
	if (typeof block === 'string') {
		return (
			<p className={isLead(block) ? 'cs-lead' : undefined}>{emphasise(block)}</p>
		);
	}
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
			return <Code lang={block.lang} text={block.text} />;
		case 'table':
			return (
				/* The one wide thing a write-up carries: it scrolls in its own box
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
	}
}
