/**
 * The career laid out as ground to walk across.
 *
 * One chapter per role, oldest on the left, so walking right is moving forward
 * in time. The skills scattered through a chapter are exactly the ones that
 * role unlocked — the computation in `career-game.ts`, not a decorative list —
 * and beside them stand the stops of that role's objective, whose names come
 * from its record (`career-objectives.ts`). So a chapter can be "complete" at
 * all: there is a real, finite set to pick up and a real thing to do.
 *
 * Each role has its own layout: a width, ledges, and the bugs that patrol it.
 * They used to share one 940px template, which is part of why every chapter
 * played the same.
 */

/* Relative rather than the `@/` alias so `node --test` can load this without
   a resolver — the layout below is logic, and it is covered by tests. */
import { levels, type Level } from '../../../data/career-game.ts';
import { goals, type Goal, type Stop } from '../../../data/career-objectives.ts';

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
/** How close counts as standing at something you press E on. */
export const USE_R = 40;

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
/** Where the character stands when the page opens. */
export const SPAWN_X = 60;

/* The middle of a signpost within its chapter — `.cx-sign` is `left: 28px`
   and 168px wide. CSS geometry restated in JS, which is a duplication, but it
   is stated once: the proximity test, the walk-to-a-role and the tests that
   keep bugs away from it all share it. */
export const SIGN_MID = 28 + 84;
/** How close to a signpost counts as standing at it. */
export const SIGN_REACH = 150;

/** A bug's box. Low enough to jump over from anywhere. */
export const HAZARD_W = 28;
export const HAZARD_H = 22;
/** The closest two things in a chapter's spread may stand. */
export const MIN_GAP = 92;

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

/** A stop of the role's objective, placed in the world. */
export type Spot = Stop & {
	goal: string;
	chapter: number;
	x: number;
	/** A touch spot floats like a token; a use spot stands on its surface. */
	y: number;
};

/**
 * Generic engineering bugs. They stand for no incident on record — the names
 * are the kind every backend has seen, which is the joke, and none of them is
 * attached to a role's history.
 */
export type BugName = '500' | 'timeout' | 'null' | '404' | 'NaN';

export type Hazard = {
	id: string;
	chapter: number;
	name: BugName;
	/** The surface it walks on. */
	y: number;
	/** Absolute range its centre patrols, and how fast. */
	from: number;
	to: number;
	speed: number;
	/** An offset along the patrol, so two bugs do not march in step. */
	phase: number;
};

export type Chapter = Level & {
	index: number;
	x: number;
	/** This chapter's own width. */
	w: number;
	tokens: Token[];
	ledges: Ledge[];
	spots: Spot[];
	hazards: Hazard[];
	goal: Goal;
	/** Floor plates that teach the controls, first chapter only. */
	teach: { x: number; text: string }[];
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

type Layout = {
	w: number;
	/** Chapter-local [x, width, height]. */
	ledges: readonly (readonly [number, number, number])[];
	/** `on` is a ledge index; absent means the floor. From/to are local centres. */
	bugs: readonly { name: BugName; on?: number; from: number; to: number; speed: number }[];
	teach?: readonly { x: number; text: string }[];
};

/**
 * Each role's ground.
 *
 * Ledges come in climbs — a low one reachable from the floor, a high one only
 * from the low — so the jump has a job. Heights are chosen against the real
 * jump and `world.test.ts` checks them rather than trusting these numbers, as
 * it checks that no bug patrols the spawn, the signpost's reading spot, or a
 * thing you have to stand still at to press E.
 */
const LAYOUT: Record<string, Layout> = {
	/* The tutorial: one climb, one slow bug, and the controls on the floor. */
	Jojonomic: {
		w: 1100,
		ledges: [
			[450, 148, 76],
			[615, 200, 150],
		],
		bugs: [{ name: '500', from: 620, to: 830, speed: 40 }],
		teach: [
			{ x: 300, text: 'Walk into the API to carry it' },
			{ x: 540, text: '↑ jump · hold it for higher' },
			{ x: 740, text: 'Land on a bug to fix it' },
			{ x: 920, text: 'E to deliver' },
		],
	},
	/* Seven product lines: the widest chapter, and two climbs. */
	Moladin: {
		w: 1700,
		ledges: [
			[300, 150, 76],
			[465, 200, 150],
			[1000, 150, 76],
			[1165, 200, 150],
		],
		bugs: [
			{ name: 'timeout', from: 700, to: 950, speed: 60 },
			{ name: 'null', on: 1, from: 490, to: 640, speed: 35 },
			{ name: '500', from: 1330, to: 1520, speed: 70 },
		],
	},
	'GovTech Health': {
		w: 1350,
		ledges: [
			[450, 150, 76],
			[615, 200, 150],
		],
		bugs: [
			{ name: 'null', on: 1, from: 640, to: 790, speed: 30 },
			{ name: 'timeout', from: 1165, to: 1290, speed: 50 },
		],
	},
	'INA Digital': {
		w: 1000,
		ledges: [
			[400, 150, 76],
			[560, 200, 150],
		],
		bugs: [{ name: '404', from: 300, to: 540, speed: 55 }],
	},
	Meditap: {
		w: 1250,
		ledges: [
			[520, 150, 76],
			[680, 200, 150],
		],
		bugs: [
			{ name: 'NaN', on: 0, from: 545, to: 645, speed: 30 },
			{ name: '404', from: 760, to: 1050, speed: 70 },
		],
	},
};

/** For a role added later without a layout: the old template, and no bugs. */
const FALLBACK: Layout = {
	w: 940,
	ledges: [
		[292, 148, 76],
		[455, 200, 150],
	],
	bugs: [],
};

/** Whether a role has a layout of its own. The test wants every one to. */
export function hasLayout(role: string): boolean {
	return role in LAYOUT;
}

/** The surface under an x: the ledge a thing standing there would be on. */
function surfaceUnder(x: number, ledges: Ledge[]): Ledge | undefined {
	return ledges.find((l) => x >= l.x + 12 && x <= l.x + l.w - 12);
}

/**
 * Where a thing stands, given what it is.
 *
 * Something you walk into floats like a token — on a ledge if it is over
 * one, otherwise at the height the first token of a chapter sits at, so it
 * never needs a jump. Something you press E at stands *on* its surface, so
 * the character can stand beside it.
 */
function heightAt(x: number, ledges: Ledge[], floats: boolean): number {
	const under = surfaceUnder(x, ledges);
	if (floats) return under ? under.y + 24 : 22;
	return under ? under.y : 0;
}

/**
 * Spread a chapter's tokens and objective stops across its floor.
 *
 * Height is not a rule about which thing it is — it is where the thing lands.
 * One standing over a ledge stands on it, and everything else sits on the
 * ground. So the jump is asked for wherever the ledges are, and `world.test.ts`
 * checks the result rather than the intent.
 *
 * Tokens and stops share one even spread, interleaved so the stops are dealt
 * through the chapter rather than bunched, and slot 0 is always a token — the
 * first thing in a chapter is picked up by walking.
 */
function place(
	level: Level,
	goal: Goal,
	index: number,
	left: number,
	w: number,
	ledges: Ledge[],
): { tokens: Token[]; spots: Spot[] } {
	const mid = goal.stops.filter((s) => !s.at);
	const start = goal.stops.filter((s) => s.at === 'start');
	const end = goal.stops.filter((s) => s.at === 'end');

	/* Keep clear of the banner on the left and the era post on the right, and
	   of the stops pinned to either end. */
	const from = left + (start.length ? 400 : 210);
	const to = left + w - (end.length ? 290 : 150);

	const n = level.unlocked.length;
	const k = mid.length;
	const m = n + k;
	const spotAt = new Map<number, Stop>();
	mid.forEach((s, j) => spotAt.set(Math.round(((j + 1) * m) / (k + 1)), s));

	const tokens: Token[] = [];
	const spots: Spot[] = [];
	const spot = (s: Stop, x: number): Spot => ({
		...s,
		goal: goal.role,
		chapter: index,
		x,
		y: heightAt(x, ledges, s.act === 'touch'),
	});

	let t = 0;
	for (let i = 0; i < m; i++) {
		const x = m > 1 ? from + ((to - from) * i) / (m - 1) : (from + to) / 2;
		const s = spotAt.get(i);
		if (s) {
			spots.push(spot(s, x));
		} else {
			const skill = level.unlocked[t++];
			tokens.push({
				id: `${level.exp.short}-${skill}`,
				skill,
				chapter: index,
				x,
				y: heightAt(x, ledges, true),
			});
		}
	}
	start.forEach((s, i) => spots.unshift(spot(s, left + 300 + i * 60)));
	end.forEach((s, i) => spots.push(spot(s, left + w - 180 - i * 60)));
	return { tokens, spots };
}

export function chapters(): Chapter[] {
	const all = goals();
	let left = 0;
	return levels().map((level, index) => {
		const layout = LAYOUT[level.exp.short] ?? FALLBACK;
		const x = left;
		left += layout.w;
		const goal = all.find((g) => g.role === level.exp.short)!;

		const ledges: Ledge[] = layout.ledges.map(([lx, lw, ly], j) => ({
			id: `${index}-${j}`,
			chapter: index,
			x: x + lx,
			w: lw,
			y: ly,
		}));
		const hazards: Hazard[] = layout.bugs.map((b, j) => ({
			id: `${level.exp.short}-bug-${j}`,
			chapter: index,
			name: b.name,
			y: b.on === undefined ? 0 : ledges[b.on].y,
			from: x + b.from,
			to: x + b.to,
			speed: b.speed,
			phase: (index * 97 + j * 53) % Math.max(1, b.to - b.from),
		}));
		const { tokens, spots } = place(level, goal, index, x, layout.w, ledges);

		return {
			...level,
			index,
			x,
			w: layout.w,
			ledges,
			tokens,
			spots,
			hazards,
			goal,
			teach: (layout.teach ?? []).map((p) => ({ x: x + p.x, text: p.text })),
			era: ERA_LIGHT[Math.min(index, ERA_LIGHT.length - 1)],
		};
	});
}

/** The whole world's width. */
export function worldWidth(all: Chapter[]): number {
	const last = all[all.length - 1];
	return last ? last.x + last.w : 0;
}

/** Which chapter an x falls in, clamped to the first and last. */
export function chapterAt(x: number, all: Chapter[]): number {
	for (let i = all.length - 1; i >= 0; i--) if (x >= all[i].x) return i;
	return 0;
}

/**
 * Where a bug's centre is at time `t`, in seconds: a triangle wave along its
 * patrol. A pure function of time, so it needs no state, a pause freezes it,
 * and a test can ask where it will be.
 */
export function hazardX(h: Hazard, t: number): number {
	const span = h.to - h.from;
	if (span <= 0) return h.from;
	const p = (((t * h.speed + h.phase) % (2 * span)) + 2 * span) % (2 * span);
	return p < span ? h.from + p : h.to - (p - span);
}

/** Which way a bug is walking at time `t`: 1 right, -1 left. */
export function hazardDir(h: Hazard, t: number): 1 | -1 {
	const span = h.to - h.from;
	if (span <= 0) return 1;
	const p = (((t * h.speed + h.phase) % (2 * span)) + 2 * span) % (2 * span);
	return p < span ? 1 : -1;
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

/** How much of one chapter's skills has been picked up. Counts that chapter only. */
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
 * Where a point sits along its own chapter, 0–100.
 *
 * Pips never share an axis across chapters, because each role owns its own
 * segment of the track — so this maps within one chapter and stays there. That
 * is also what lets the position marker sit inside the active segment and use
 * `heroPct` unchanged.
 */
export function pipPct(point: { x: number }, chapter: Chapter): number {
	const local = point.x - chapter.x;
	return Math.max(0, Math.min(100, (local / chapter.w) * 100));
}

/** Same mapping for the character, so the marker and the pips agree. */
export function heroPct(heroX: number, chapter: Chapter): number {
	return Math.max(0, Math.min(100, ((heroX - chapter.x) / chapter.w) * 100));
}
