/**
 * One question and its answer, the page's one composition: the question hung
 * from column 1 at the section size, the answer from column 6, so every
 * section of the interview reads the same way and the depth sits in
 * disclosures rather than on the page.
 */
export default function Question({
	id,
	question,
	answer,
	tone,
	children,
}: {
	id: string;
	question: string;
	/** One or two short sentences, the answer as it would be said. */
	answer?: React.ReactNode;
	/** The red field, if the section is printed on it. The ultramarine tone
	    went with the case section on 2026-11-06. */
	tone?: 'mark';
	children?: React.ReactNode;
}) {
	return (
		<section
			id={id}
			className='q'
			data-tone={tone}
			aria-labelledby={`${id}-q`}>
			<div className='container q__grid'>
				<h2 id={`${id}-q`} className='q__head' data-reveal>
					{question}
				</h2>
				<div className='q__body'>
					{answer && (
						<p className='q__answer' data-reveal>
							{answer}
						</p>
					)}
					{children}
				</div>
			</div>
		</section>
	);
}
