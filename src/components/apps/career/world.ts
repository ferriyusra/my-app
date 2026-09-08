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
/**
 * Ground sits this far up from the bottom of the world.
 *
 * Tall enough for the receding floor plane to actually read: at 46px the
 * projected grid came out 72px and was mostly clipped, so the perspective was
 * there and invisible. The character's baseline and its shadow hang off this.
 */
export const GROUND = 64;
/** How close the character must be to a token to pick it up. */
export const PICKUP_R = 26;

/* Movement, kept here rather than in the component so the reachability of a
   raised token is something a test can check against the actual physics. */
export const SPEED = 250;
export const GRAVITY = 1900;
export const JUMP_V = 640;
/* The character's box. Here rather than beside its artwork because
   `reachable()` is computed from it and `world.test.ts` has to be able to
   load it — importing the art would pull JSX into `node --test`. */
export const HERO_W = 30;
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

/** A one-way platform: you can jump up through it and land on top. */
export type Ledge = {
	id: string;
	chapter: number;
	/** Absolute left edge in world space, and how wide it is. */
	x: number;
	w: number;
	/** Height of its top surface above the ground line. */
	y: number;
};

export type Chapter = Level & {
	index: number;
	x: number;
	tokens: Token[];
	ledges: Ledge[];
	/** The era's light, as a neutral the CSS mixes into the accent. */
	era: string;
};

/**
 * One neutral per chapter, running cool to warm across the five.
 *
 * Deliberately *not* five hues. The shell offers six accents and this game
 * follows whichever is chosen; hardcoding era colours would quietly break that.
 * These are mixed into `--accent` in CSS, so the accent stays the through-line
 * and the era only shifts the temperature — early morning at the first role,
 * full daylight at the current one. Every accent × era pair keeps working
 * because none of it is a fixed colour.
 */
const ERA_LIGHT = [
	'#8fa6c4', // 2021 — cold, early
	'#93b0c9',
	'#a8bcc6',
	'#c3bfb4',
	'#d8c3a2', // 2025 — warm, now
] as const;

/**
 * Two ledges per chapter, the second only reachable from the first.
 *
 * Before these the world was one flat line: the jump existed but nothing ever
 * asked for it, and the raised tokens hung in mid-air with nothing under them.
 * A climb gives the jump a job and gives the chapter a shape.
 *
 * Heights are chosen against the real `maxJump()`, and `world.test.ts` checks
 * them rather than trusting the numbers here — the low ledge must clear from
 * the ground, the high one from the low.
 */
function ledgesFor(index: number): Ledge[] {
	const left = index * CHAPTER_W;
	return [
		{ id: `${index}-low`, chapter: index, x: left + 292, w: 148, y: 76 },
		/* The gap is deliberately short. Tokens stand on these ledges, so a
		   climb that only worked from the last 40px of the low ledge would put
		   part of a role out of reach for anyone who is not precise with a
		   jump. Reachable from most of the run-up, not from a pixel. */
		{ id: `${index}-high`, chapter: index, x: left + 455, w: 200, y: 150 },
	];
}

/**
 * Spread a chapter's tokens across its floor.
 *
 * Height is not a rule about which token it is — it is where the token lands.
 * One standing over a ledge stands on it, and everything else sits on the
 * ground. So the jump is asked for wherever the ledges are, and `world.test.ts`
 * checks the result rather than the intent: every token reachable, the first of
 * a chapter never needing a jump, and at least one somewhere that does.
 */
function place(level: Level, index: number, ledges: Ledge[]): Token[] {
	const n = level.unlocked.length;
	const left = index * CHAPTER_W;
	/* Keep clear of the banner on the left and the era post on the right. */
	const from = left + 210;
	const to = left + CHAPTER_W - 150;
	const step = n > 1 ? (to - from) / (n - 1) : 0;

	return level.unlocked.map((skill, i) => {
		const x = n > 1 ? from + step * i : (from + to) / 2;
		/* A token standing over a ledge stands *on* it, rather than floating at
		   an arbitrary height beside it. */
		const under = ledges.find((l) => x >= l.x + 12 && x <= l.x + l.w - 12);
		return {
			id: `${level.exp.short}-${skill}`,
			skill,
			chapter: index,
			x,
			y: under ? under.y + 24 : 22,
		};
	});
}

export function chapters(): Chapter[] {
	return levels().map((level, index) => {
		const ledges = ledgesFor(index);
		return {
			...level,
			index,
			x: index * CHAPTER_W,
			ledges,
			tokens: place(level, index, ledges),
			era: ERA_LIGHT[Math.min(index, ERA_LIGHT.length - 1)],
		};
	});
}

/**
 * Can a surface at `to` be reached by jumping from one at `from`?
 *
 * The character has to clear the height difference, not merely touch it, so
 * this is stricter than `reachable()` — that one asks whether a *token* comes
 * within arm's reach, this asks whether a *floor* can be stood on.
 */
export function canClimb(from: number, to: number): boolean {
	return to - from < maxJump();
}

/** How much of one chapter has been picked up. Counts that chapter only. */
export function chapterProgress(
	chapter: Chapter,
	have: Set<string>,
): { done: number; total: number } {
	return {
		done: chapter.tokens.filter((t) => have.has(t.id)).length,
		total: chapter.tokens.length,
	};
}

/**
 * Where a token sits along its own chapter, 0–100.
 *
 * Pips never share an axis across chapters, because each role owns its own
 * segment of the track — so this maps within one chapter and stays there. That
 * is also what lets the position marker sit inside the active segment and use
 * `heroPct` unchanged.
 */
export function pipPct(token: Token, chapter: Chapter): number {
	const local = token.x - chapter.x;
	return Math.max(0, Math.min(100, (local / CHAPTER_W) * 100));
}

/** Same mapping for the character, so the marker and the pips agree. */
export function heroPct(heroX: number, chapter: Chapter): number {
	return Math.max(0, Math.min(100, ((heroX - chapter.x) / CHAPTER_W) * 100));
}
