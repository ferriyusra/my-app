/**
 * The career laid out as ground to walk across.
 *
 * One chapter per role, oldest on the left, so walking right is moving forward
 * in time. The skills scattered through a chapter are exactly the ones that
 * role unlocked — the computation in `career-game.ts`, not a decorative list —
 * which is why a chapter can be "complete" at all: there is a real, finite set
 * to pick up.
 */

/* Relative rather than the `@/` alias so `node --test` can load this without
   a resolver — the layout below is logic, and it is covered by tests. */
import { levels, type Level } from '../../../data/career-game.ts';

export const CHAPTER_W = 940;
export const WORLD_H = 300;
/** Ground sits this far up from the bottom of the world. */
export const GROUND = 46;
/** How close the character must be to a token to pick it up. */
export const PICKUP_R = 26;

/* Movement, kept here rather than in the component so the reachability of a
   raised token is something a test can check against the actual physics. */
export const SPEED = 250;
export const GRAVITY = 1900;
export const JUMP_V = 640;
export const HERO_H = 52;

/** Peak of a jump from standing, in px above the ground. */
export const maxJump = () => (JUMP_V * JUMP_V) / (2 * GRAVITY);

/**
 * Whether a token at height `y` can be touched during a jump.
 *
 * Pickup is measured centre to centre, so the character's midpoint has to pass
 * within PICKUP_R of it — reachable across a band, not only at the apex.
 */
export function reachable(y: number): boolean {
	const lowestUseful = y - PICKUP_R - HERO_H / 2;
	return lowestUseful < maxJump();
}

export type Token = {
	id: string;
	skill: string;
	chapter: number;
	/** Absolute position in world space. */
	x: number;
	/** Height above the ground line. High ones need a jump. */
	y: number;
};

export type Chapter = Level & {
	index: number;
	x: number;
	tokens: Token[];
};

/**
 * Spread a chapter's tokens across its floor.
 *
 * Every third one is lifted out of reach of a walk, so the jump is used rather
 * than decorative — but never the first, so the opening of a chapter is always
 * collectable by someone who has not worked out the controls yet.
 */
function place(level: Level, index: number): Token[] {
	const n = level.unlocked.length;
	const left = index * CHAPTER_W;
	/* Keep clear of the banner on the left and the gate on the right. */
	const from = left + 210;
	const to = left + CHAPTER_W - 150;
	const step = n > 1 ? (to - from) / (n - 1) : 0;

	return level.unlocked.map((skill, i) => ({
		id: `${level.exp.short}-${skill}`,
		skill,
		chapter: index,
		x: n > 1 ? from + step * i : (from + to) / 2,
		y: i > 0 && i % 3 === 0 ? 96 : 22,
	}));
}

export function chapters(): Chapter[] {
	return levels().map((level, index) => ({
		...level,
		index,
		x: index * CHAPTER_W,
		tokens: place(level, index),
	}));
}

export const WORLD_W = () => chapters().length * CHAPTER_W;
