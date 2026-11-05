import Link from 'next/link';
import { caseStudy, type CaseBlock } from '@/data/case-study';
import ProseBlock, { emphasise } from '@/components/content/prose';
import { prose } from '@/lib/text';
import Question from './question';

type Code = Extract<CaseBlock, { kind: 'code' }>;
type Table = Extract<CaseBlock, { kind: 'table' }>;

/** '**Yes**' → 'Yes': the table marks its sends in bold. */
const plain = (cell: string) => prose(cell.replace(/\*/g, ''));

/**
 * The case, on an ultramarine field, as a control rather than a table: pick
 * what a client looked like last time and today, and the decision the
 * write-up's state machine makes is set at poster scale, with its reason.
 *
 * Radios and `:has()`, no script: each choice is a label wrapping its own
 * input (in flow, so focusing it never jumps the page), and the answer that
 * follows the checked one is shown. Every value comes from the write-up's own
 * behaviour table in `case-study.ts`; the function itself folds beneath.
 */
export default function CasePreview() {
	const blocks = caseStudy.sections.flatMap((s) => s.body);
	const code = blocks.find((b): b is Code => typeof b !== 'string' && b.kind === 'code' && b.lang === 'go');
	const table = blocks.find((b): b is Table => typeof b !== 'string' && b.kind === 'table');
	/* "Working out **whether to email them today** is the actual design problem." */
	const problem = blocks.find(
		(b): b is string => typeof b === 'string' && b.includes('is the actual design problem'),
	);
	const answer = problem?.split('. ')[0];
	/* The escalation row, the one a naive filter would swallow, is chosen first. */
	const start = Math.max(0, table?.rows.findIndex((r) => /increased/i.test(r[3])) ?? 0);

	return (
		<Question
			id='case'
			tone='field'
			question='When should an alert go out?'
			answer={answer ? emphasise(answer.replace(/\.$/, '') + '.') : undefined}>
			{table && (
				<div className='decide' data-reveal>
					<p id='decide-label' className='decide__label-group'>
						{table.head[0]}, then {table.head[1].toLowerCase()}
					</p>
					<div className='decide__choices' role='radiogroup' aria-labelledby='decide-label'>
						{table.rows.map((r, i) => (
							<div key={r.join('|')} className='decide__pair'>
								<label className='decide__choice'>
									<input type='radio' name='case' defaultChecked={i === start} />
									<span className='decide__last'>{plain(r[0])}</span>
									<span className='decide__today'>{plain(r[1])}</span>
								</label>
								<output className='decide__result'>
									<span className='decide__label'>{table.head[2]}</span>
									<span className='decide__value'>{plain(r[2])}</span>
									<span className='decide__why'>{plain(r[3])}</span>
								</output>
							</div>
						))}
					</div>
				</div>
			)}

			<div className='q__links' data-reveal>
				<Link className='btn btn--secondary' href='/deposit-alerting'>
					Read the write-up
				</Link>
			</div>

			{code && (
				<details className='more' data-reveal>
					<summary>The function that decides, in Go</summary>
					<ProseBlock block={code} />
				</details>
			)}
		</Question>
	);
}
