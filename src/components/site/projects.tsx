import Image from 'next/image';
import { projects, type Project } from '@/data/projects';
import { caseStudy } from '@/data/case-study';
import { countWord } from '@/lib/dates';
import { prose } from '@/lib/text';
import Question from './question';

/**
 * The rest of the work, in two compositions. The two production systems with
 * real screenshots are the section: each capture uncropped at its own shape,
 * the two set side by side at one height, with the project's disclosure as its
 * caption. The six built to learn follow as one compact list of names under a
 * single label, each opening to its description. The case study's own card is
 * left out: it is the question above.
 */

/* Pixel sizes of the captures, so the browser reserves their space and the
   two frames can share one height. */
const SHOTS: Record<string, { w: number; h: number }> = {
	'/projects/ssd/ssd-1.png': { w: 1256, h: 1163 },
	'/projects/native/native-1.png': { w: 825, h: 1197 },
};

function Detail({ p }: { p: Project }) {
	return (
		<div className='row__body'>
			<p>{prose(p.description)}</p>
			<p className='row__stack'>Stack: {p.tech.join(', ')}</p>
			{(p.github || p.demo) && (
				<p className='row__links'>
					{p.github && (
						<a href={p.github} target='_blank' rel='noopener noreferrer'>
							Code
						</a>
					)}
					{p.demo && (
						<a href={p.demo} target='_blank' rel='noopener noreferrer'>
							Live
						</a>
					)}
				</p>
			)}
		</div>
	);
}

export default function Projects() {
	const list = projects.filter((p) => p.id !== caseStudy.project);
	const shots = list.filter((p) => p.type === 'real' && SHOTS[p.cover]);
	const learning = list.filter((p) => p.type !== 'real');

	return (
		<Question
			id='projects'
			question='What did you ship for SATUSEHAT?'
			answer={`${countWord(shots.length)} in production at SATUSEHAT, and ${countWord(learning.length).toLowerCase()} projects built to learn.`}>
			<div
				className='shots'
				style={{
					gridTemplateColumns: shots
						.map((p) => `minmax(0, ${(SHOTS[p.cover].w / SHOTS[p.cover].h).toFixed(3)}fr)`)
						.join(' '),
				}}>
				{shots.map((p) => (
					<figure key={p.id} className='shot' data-reveal>
						<div
							className='shot__frame'
							data-slot={p.id}
							data-kind='product'
							style={{ aspectRatio: `${SHOTS[p.cover].w} / ${SHOTS[p.cover].h}` }}>
							<Image
								src={p.cover}
								width={SHOTS[p.cover].w}
								height={SHOTS[p.cover].h}
								sizes='(min-width: 60rem) 30rem, 100vw'
								alt=''
							/>
						</div>
						<figcaption>
							<details className='row__details'>
								<summary className='row__sum'>
									<h3 className='row__name'>{p.name}</h3>
								</summary>
								<Detail p={p} />
							</details>
						</figcaption>
					</figure>
				))}
			</div>

			<div className='learnt'>
				<h3 className='learnt__head' data-reveal>
					{countWord(learning.length)} built to learn
				</h3>
				<ul className='learnt__list'>
					{learning.map((p) => (
						<li key={p.id} data-reveal>
							<details className='row__details'>
								<summary className='row__sum'>
									<h4 className='row__name'>{p.name}</h4>
								</summary>
								<Detail p={p} />
							</details>
						</li>
					))}
				</ul>
			</div>
		</Question>
	);
}
