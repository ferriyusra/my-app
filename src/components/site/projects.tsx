import Image from 'next/image';
import Link from 'next/link';
import { projects, type Project } from '@/data/projects';
import { caseStudy } from '@/data/case-study';
import { satusehat } from '@/data/satusehat';
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

/** A project with a capture to show: its `coverSize` lets the browser reserve
    the space and the two frames share one height. */
type Shot = Project & { coverSize: { w: number; h: number } };

/** The description's last sentence, the fact a capture's caption states. */
function fact(description: string): string {
	const parts = description.split('. ');
	const last = parts[parts.length - 1];
	return last.endsWith('.') ? last : last + '.';
}

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
	const shots = list.filter((p): p is Shot => p.type === 'real' && !!p.coverSize);
	const learning = list.filter((p) => p.type !== 'real');

	return (
		<Question
			id='projects'
			question='In production at SATUSEHAT'
			answer={`${countWord(shots.length)} live systems, and ${countWord(learning.length).toLowerCase()} projects built to learn.`}>
			<div
				className='shots'
				style={{
					gridTemplateColumns: shots
						.map((p) => `minmax(0, ${(p.coverSize.w / p.coverSize.h).toFixed(3)}fr)`)
						.join(' '),
				}}>
				{shots.map((p) => (
					<figure key={p.id} className='shot' data-reveal>
						<div
							className='shot__frame'
							data-slot={p.id}
							data-kind='product'
							style={{ aspectRatio: `${p.coverSize.w} / ${p.coverSize.h}` }}>
							<Image
								src={p.cover}
								width={p.coverSize.w}
								height={p.coverSize.h}
								sizes='(min-width: 60rem) 30rem, 100vw'
								alt=''
							/>
						</div>
						<figcaption>
							<details className='row__details'>
								<summary className='row__sum'>
									<h3 className='row__name'>{p.name}</h3>
									<span className='row__meta'>{prose(fact(p.description))}</span>
								</summary>
								<Detail p={p} />
							</details>
						</figcaption>
					</figure>
				))}
			</div>

			{/* The two captures are the SATUSEHAT case study's subject. */}
			<div className='q__links' data-reveal>
				<Link className='btn btn--secondary' href={`/${satusehat.slug}`}>
					Read the SATUSEHAT case study
				</Link>
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
