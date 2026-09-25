import SkillMark from '@/components/apps/career/token-mark';
import SkillEvidence from '@/components/content/skill-evidence';
import { SKILL_CATEGORIES, skills, type SkillCategory } from '@/data/skills';
import { evidenceFor, monthsLabel } from '@/lib/skill-evidence';
import SectionHead from './section-head';

/** Backend first: this is a backend engineer's stack, read in that order. */
const ORDER: SkillCategory[] = ['Backend', 'Database', 'Cloud', 'DevOps', 'Frontend', 'AI Tools'];

/** "Node.js" → "skill-node-js". */
const skillId = (name: string) => `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

/**
 * Every tool, and where it was actually used.
 *
 * Each row answers with a computed figure — the months across the roles that
 * name it — and opens to the roles themselves. Nine tools are named by no role;
 * they say so rather than being padded.
 *
 * Rows run by that same figure, most first. `years` in `skills.ts` only breaks
 * ties: it is typed by hand and has drifted from the roles (it ranks Node.js
 * above Go, which the roles do not), so it is never shown and never outranks
 * what the record computes. The Recycle Bin holds the bars that tried to show it.
 *
 * Native `<details>`, one per tool, so it works with scripting off. Not a named
 * group: exclusive accordions cannot all be opened, and printing opens them all.
 */
export default function Stack() {
	return (
		<section id='stack' className='sy-section' aria-labelledby='stack-title'>
			<div className='sy-wrap'>
				<SectionHead
					id='stack'
					title='Where each tool was actually used'
					meta={`${skills.length} tools · months computed from the roles that name them`}
				/>
				<div className='sy-stack'>
					{ORDER.map((cat) => {
						const blurb = SKILL_CATEGORIES.find((c) => c.key === cat)?.blurb;
						const items = skills
							.filter((s) => s.category === cat)
							.map((s) => ({ s, ev: evidenceFor(s.name) }))
							.sort((a, b) => b.ev.months - a.ev.months || b.ev.projects.length - a.ev.projects.length || b.s.years - a.s.years);
						return (
							<div key={cat} className='sy-cat'>
								<h3>{cat}</h3>
								{blurb && <p className='sy-cat-blurb'>{blurb}</p>}
								<ul className='sy-skills'>
									{items.map(({ s, ev }) => {
										const figure = ev.roles.length
											? monthsLabel(ev.months)
											: ev.projects.length
												? 'in a project'
												: 'no role on record';
										return (
											<li key={s.name} id={skillId(s.name)}>
												<details className='sy-skill'>
													<summary>
														<SkillMark skill={s} size={18} className='sy-mark' />
														<span className='sy-skill-name'>{s.name}</span>
														<span className='sy-skill-fig' data-none={!ev.roles.length || undefined}>
															{figure}
														</span>
													</summary>
													<div className='sy-skill-body'>
														<p className='sy-skill-note'>{s.note}</p>
														<SkillEvidence skill={s} />
													</div>
												</details>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
