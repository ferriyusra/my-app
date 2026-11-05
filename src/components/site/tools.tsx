import { SKILL_CATEGORIES, skills } from '@/data/skills';
import { prose } from '@/lib/text';
import Question from './question';

/**
 * What I build with: one row per category, the tools in it by name, ordered
 * by years of use. Where each was used folds into one disclosure, so the
 * answer is a list a reader can take in at a glance.
 */
export default function Tools() {
	const byCategory = SKILL_CATEGORIES.map((c) => ({
		...c,
		tools: skills.filter((s) => s.category === c.key).sort((a, b) => b.years - a.years),
	}));

	return (
		<Question id='tools' question='Which tools, and where were they used?'>
			<dl className='shortlist'>
				{byCategory.map((c) => (
					<div key={c.key} data-reveal>
						<dt>{c.key}</dt>
						<dd>{c.tools.map((t) => t.name).join(', ')}</dd>
					</div>
				))}
			</dl>
			<details className='more' data-reveal>
				<summary>Where I used each</summary>
				<dl className='more__dl'>
					{byCategory.flatMap((c) =>
						c.tools.map((t) => (
							<div key={t.name}>
								<dt>{t.name}</dt>
								<dd>{prose(t.note)}</dd>
							</div>
						)),
					)}
				</dl>
			</details>
		</Question>
	);
}
