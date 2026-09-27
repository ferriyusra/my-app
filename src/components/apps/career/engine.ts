/**
 * One step of the character's physics, as a pure function.
 *
 * It lived inside the component's animation frame, where nothing could test
 * it — so `reachable()` was checked against a formula, and the loop that
 * actually moved the character was trusted to agree. Here the loop and the
 * tests run the same code: `engine.test.ts` simulates a jump at 60Hz and holds
 * every ledge in the world to what that jump really reaches.
 *
 * Nothing is allocated per frame. The body is mutated in place and the frame's
 * events are written into an `out` object the caller keeps.
 */

import {
	GRAVITY,
	HAZARD_H,
	HAZARD_W,
	HERO_H,
	HERO_W,
	JUMP_V,
	SPEED,
	hazardX,
	type Hazard,
	type Ledge,
} from './world.ts';

/** Shift runs. It covers a 6,400px world without changing how it plays. */
export const RUN = 1.75;
/** A jump pressed this soon after walking off an edge still counts. */
export const COYOTE_S = 0.1;
/** A jump pressed this long before landing fires on landing. */
export const BUFFER_S = 0.12;
/** Letting go of jump on the way up caps the rise here: tap for a hop. */
export const JUMP_CUT_V = 260;
/** Landing on a bug fixes it and bounces you this high... */
export const STOMP_V = 460;
/** ...and counts a landing this far above its top, for a descent between frames. */
export const STOMP_SLACK = 10;
/** Walking into one pushes you back — never further than this, never to death. */
export const KNOCK_VX = 300;
export const KNOCK_VY = 280;
export const KNOCK_DRAG = 1400;
/** How long a knock takes the controls away. Short, so it reads as a bump. */
export const STUN_S = 0.22;
/** How long after a knock nothing can knock you again. */
export const INVULN_S = 1.2;

export type Body = {
	x: number;
	y: number;
	vy: number;
	/** Knockback's horizontal speed, decaying. */
	kx: number;
	facing: 1 | -1;
	onGround: boolean;
	/** Clock time the character last stood on something — for coyote time. */
	groundAt: number;
	/** Clock time jump was last pressed — for the buffer. */
	jumpAt: number;
	/** Whether the current rise came from a jump, which is all the cut applies to. */
	jumping: boolean;
	hurtUntil: number;
	stunUntil: number;
};

export type Input = { dir: -1 | 0 | 1; run: boolean; jumpHeld: boolean };

export type StepOut = {
	landed: boolean;
	jumped: boolean;
	/** The id of a bug landed on this frame. */
	stomped: string | null;
	hurt: boolean;
};

export function newBody(x: number): Body {
	return {
		x,
		y: 0,
		vy: 0,
		kx: 0,
		facing: 1,
		onGround: true,
		groundAt: 0,
		jumpAt: -Infinity,
		jumping: false,
		hurtUntil: 0,
		stunUntil: 0,
	};
}

export function newOut(): StepOut {
	return { landed: false, jumped: false, stomped: null, hurt: false };
}

/**
 * Advance the character by `dt` seconds at game time `clock`.
 *
 * The order matters and is the whole design:
 * 1. walk, and any knockback;
 * 2. jump, if one is buffered and the character is (or was just) standing;
 * 3. gravity, and the cut that makes a tapped jump short;
 * 4. bugs — landed on from above fixes one, anything else knocks back;
 * 5. one-way ledges and the ground;
 * 6. the edges of the world.
 * Bugs come before ledges so a bounce off a bug on a ledge is not caught by
 * the ledge on the same frame.
 */
export function step(
	b: Body,
	input: Input,
	dt: number,
	clock: number,
	ledges: readonly Ledge[],
	hazards: readonly Hazard[],
	fixed: ReadonlySet<string>,
	worldW: number,
	out: StepOut,
): StepOut {
	out.landed = false;
	out.jumped = false;
	out.stomped = null;
	out.hurt = false;

	/* 1. Walk, unless a knock has the controls. */
	if (clock >= b.stunUntil && input.dir !== 0) {
		b.x += input.dir * SPEED * (input.run ? RUN : 1) * dt;
		b.facing = input.dir;
	}
	if (b.kx !== 0) {
		b.x += b.kx * dt;
		const drag = KNOCK_DRAG * dt;
		b.kx = Math.abs(b.kx) <= drag ? 0 : b.kx - Math.sign(b.kx) * drag;
	}

	/* 2. Jump: buffered, so a press just before landing is not lost, and with
	   coyote time, so one just after walking off an edge still counts. Both
	   are consumed, so holding the key cannot jump twice. */
	const standing = b.onGround || clock - b.groundAt <= COYOTE_S;
	if (clock - b.jumpAt <= BUFFER_S && standing && clock >= b.stunUntil) {
		b.vy = JUMP_V;
		b.onGround = false;
		b.jumping = true;
		b.jumpAt = -Infinity;
		b.groundAt = -Infinity;
		out.jumped = true;
	}

	/* 3. Gravity, and the cut: let go on the way up and the rise stops short. */
	const wasAt = b.y;
	b.vy -= GRAVITY * dt;
	if (b.jumping && !input.jumpHeld && b.vy > JUMP_CUT_V) b.vy = JUMP_CUT_V;
	b.y += b.vy * dt;
	if (b.vy <= 0) b.jumping = false;

	/* 4. Bugs. */
	const left = b.x;
	const right = b.x + HERO_W;
	for (const h of hazards) {
		if (fixed.has(h.id)) continue;
		const hx = hazardX(h, clock);
		if (right <= hx - HAZARD_W / 2 || left >= hx + HAZARD_W / 2) continue;
		const top = h.y + HAZARD_H;
		/* Landed on from above: the feet crossed its top this frame. */
		if (b.vy < 0 && wasAt >= top - STOMP_SLACK && b.y <= top) {
			b.y = top;
			b.vy = input.jumpHeld ? JUMP_V : STOMP_V;
			b.jumping = false;
			b.onGround = false;
			b.hurtUntil = Math.max(b.hurtUntil, clock + 0.15);
			out.stomped = h.id;
			break;
		}
		/* Anything else: a bump, never a death. */
		const overlapsY = b.y < top && b.y + HERO_H > h.y;
		if (overlapsY && clock >= b.hurtUntil) {
			const away = b.x + HERO_W / 2 >= hx ? 1 : -1;
			b.kx = away * KNOCK_VX;
			b.vy = KNOCK_VY;
			b.jumping = false;
			b.onGround = false;
			b.hurtUntil = clock + INVULN_S;
			b.stunUntil = clock + STUN_S;
			out.hurt = true;
			break;
		}
	}

	/* 5. Standing is re-earned every frame: step off the end of a ledge and
	   nothing holds you up, which is what makes walking off one work without a
	   separate check. One-way ledges catch only a *descent* that crossed their
	   surface, so the character passes up through one and lands on top. */
	const wasOn = b.onGround;
	b.onGround = false;
	if (b.vy <= 0) {
		for (const l of ledges) {
			if (b.x + HERO_W <= l.x || b.x >= l.x + l.w) continue;
			if (wasAt >= l.y && b.y <= l.y) {
				b.y = l.y;
				b.vy = 0;
				b.onGround = true;
				break;
			}
		}
	}
	if (b.y <= 0) {
		b.y = 0;
		b.vy = 0;
		b.onGround = true;
	}
	if (b.onGround) {
		b.groundAt = clock;
		b.jumping = false;
		if (!wasOn) out.landed = true;
	}

	/* 6. The world's edges. */
	b.x = Math.max(0, Math.min(b.x, worldW - HERO_W));
	return out;
}
