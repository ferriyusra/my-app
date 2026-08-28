import { skills } from '@/data/skills';
import type { Skill } from '@/data/skills';

/**
 * A tool's brand mark, or a lettered plate where none ships.
 *
 * Lifted out of the Skills window so Career.exe can use the same thing: 23 of
 * the 28 tools have a mark in `public/icons`, and the rest fall back to their
 * first two letters rather than a broken image. Two implementations of that
 * rule would have drifted the first time a mark was added.
 *
 * `size` is a prop because the two callers want different ones — 22px in the
 * Skills list, smaller on a token out in the world.
 */
export default function SkillMark({
	skill,
	size = 22,
	className = 'sk-mark',
}: {
	skill: Skill;
	size?: number;
	className?: string;
}) {
	if (!skill.icon)
		return (
			<span
				className={`${className} ${className}-letter`}
				style={{ width: size, height: size }}
				aria-hidden='true'>
				{skill.name.slice(0, 2)}
			</span>
		);
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={`${className}${skill.adaptive ? ' icon-adaptive' : ''}`}
			src={skill.icon}
			alt=''
			aria-hidden='true'
			width={size}
			height={size}
			loading='lazy'
		/>
	);
}

/** Look a tool up by the name the game and the roles both use. */
export function skillByName(name: string): Skill | undefined {
	return skills.find((s) => s.name === name);
}
