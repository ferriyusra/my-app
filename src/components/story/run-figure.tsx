import { runFigure, runSteps, type RunNode } from '@/lib/story';

/**
 * The case study's figure, drawn for the story: the run as a spine, top to
 * bottom, with what the service reads and writes hanging off the box that does
 * the reading and writing — the way the write-up's own diagram draws it.
 *
 * The same `caseStudy.figure` the windows draw as rows of boxes, so every label
 * and detail is a phrase `case-study.test.ts` has already checked against the
 * write-up. An `<ol>` carries the order to a screen reader and each set is a
 * list inside the box it branches from, so the structure is in the markup, not
 * only in the lines between boxes.
 *
 * Every box carries a `data-node` id. With scripting on, the scroll observer
 * uses them to light the box whose step is on screen; without it — or under
 * reduced motion — every box is simply lit, which is what the HTML says.
 *
 * The step track beside it is what the reader scrolls through on a wide
 * screen: one card per step of `runSteps()`, each quoting only the figure's
 * own words. It repeats what the boxes already say, so it is hidden from
 * assistive tech, and CSS only shows it where the run is told step by step.
 */
function Box({ node, as: Tag = 'span' }: { node: RunNode; as?: 'span' | 'li' }) {
	return (
		<Tag className='sy-node' data-node={node.id}>
			<span className='sy-node-label'>{node.label}</span>
			{node.detail && <span className='sy-node-detail'>{node.detail}</span>}
		</Tag>
	);
}

export default function RunFigure() {
	const fig = runFigure();
	const steps = runSteps(fig);
	const pad = (n: number) => String(n).padStart(2, '0');
	return (
		<figure className='sy-run' data-sy-run>
			<div className='sy-run-stage'>
				<p className='sy-run-name'>The run</p>
				<ol className='sy-run-path'>
					{fig.path.map((n) => {
						const sets = fig.sets.filter((s) => s.after === n.label);
						return (
							<li key={n.id} className='sy-run-stop' data-branches={sets.length || undefined}>
								<Box node={n} />
								{sets.length > 0 && (
									<div className='sy-run-sets'>
										{sets.map((s) => (
											<div key={s.name} className='sy-run-set'>
												<p className='sy-run-set-name'>{s.name}</p>
												<ul>
													{s.nodes.map((sn) => (
														<Box key={sn.id} node={sn} as='li' />
													))}
												</ul>
											</div>
										))}
									</div>
								)}
							</li>
						);
					})}
				</ol>
			</div>
			<ol className='sy-run-track' aria-hidden='true'>
				{steps.map((s, i) => (
					<li key={s.title} data-sy-step={i} data-lights={s.lights.join(' ')}>
						<span className='sy-step-n'>
							{pad(i + 1)} / {pad(steps.length)}
						</span>
						<span className='sy-step-title'>{s.title}</span>
						{s.detail && <span className='sy-step-detail'>{s.detail}</span>}
					</li>
				))}
			</ol>
			<figcaption className='sy-run-cap'>{fig.caption}</figcaption>
		</figure>
	);
}
