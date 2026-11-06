/**
 * One section of the sheet: a plain head at the section size over its body,
 * in the specification voice Blueprint asks for (the noun, not a question).
 * Until 2026-11-06 every section was a question hung beside its answer (the
 * Grid run's Conversational FAQ); the component keeps its name and props so
 * the sections that use it did not have to move.
 */
export default function Question({
	id,
	question,
	answer,
	tone,
	children,
}: {
	id: string;
	/** The section's head, plain: "Work", "Tools". */
	question: string;
	/** One short line under the head, if the section has one. */
	answer?: React.ReactNode;
	/** A band of the darker sheet, if the section is printed on one. */
	tone?: 'band';
	children?: React.ReactNode;
}) {
	return (
		<section id={id} className='q' data-tone={tone} aria-labelledby={`${id}-q`}>
			<div className='container q__grid'>
				<div className='q__top'>
					<h2 id={`${id}-q`} className='q__head' data-reveal>
						{question}
					</h2>
					{answer && (
						<p className='q__answer' data-reveal>
							{answer}
						</p>
					)}
				</div>
				<div className='q__body'>{children}</div>
			</div>
		</section>
	);
}
