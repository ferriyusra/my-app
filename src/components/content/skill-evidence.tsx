import { evidenceFor, monthsLabel } from '@/lib/skill-evidence';
import type { Skill } from '@/data/skills';

/**
 * The answer to "used where, and for how long" — computed from the roles and
 * projects that name the tool, so it cannot drift from `experience.ts`.
 *
 * A tool that no role names says so. Nine of them are in that position, and
 * padding them with plausible-sounding evidence would be the wrong fix.
 *
 * No 'use client': the Skills window renders it inside the shell, and the story
 * renders it into the response body. One implementation, so the two answers
 * cannot differ — the rule `DiscardedDetail` and `CaseStudyBody` follow.
 */
export default function SkillEvidence({ skill }: { skill: Skill }) {
	const { roles, projects: built, months, since } = evidenceFor(skill.name);

	if (!roles.length && !built.length) {
		return (
			<div className='sk-evidence'>
				<p className='sk-evidence-none'>
					Used, but not named in any role or project on record — so there is
					nothing here to show you.
				</p>
			</div>
		);
	}

	return (
		<div className='sk-evidence'>
			{roles.length > 0 && (
				<>
					<p className='sk-evidence-lead'>
						<strong>{monthsLabel(months)}</strong> across {roles.length} role
						{roles.length > 1 ? 's' : ''}
						{since && <span className='sk-since'>since {since}</span>}
					</p>
					<ul className='sk-evidence-roles'>
						{roles.map((r) => (
							<li key={r.company}>
								<strong>{r.short}</strong>
								<span>{r.period}</span>
							</li>
						))}
					</ul>
				</>
			)}
			{built.length > 0 && (
				<p className='sk-evidence-built'>
					Shipped in {built.map((b) => b.name).join(', ')}
				</p>
			)}
		</div>
	);
}
