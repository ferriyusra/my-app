'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useShell } from '@/context/shell-context';
import HeroArt, { HERO_H, HERO_W } from './hero-art';
import {
	CHAPTER_W,
	GRAVITY,
	GROUND,
	JUMP_V,
	PICKUP_R,
	SPEED,
	WORLD_H,
	chapterProgress,
	chapters as buildChapters,
	heroPct,
	pipPct,
} from './world';

/**
 * The career, walked.
 *
 * Position never touches React — the same rule the window frame and the desktop
 * cat follow, for the same reason: a transform written sixty times a second
 * through state would re-render this whole tree every frame. The loop writes
 * `translate3d` straight onto the character and the camera, and only three
 * things are allowed to be state, because only they change rarely: which skills
 * have been collected, which chapter you are standing in, and whether the
 * controls have been discovered yet.
 *
 * A gate closes each chapter until its skills are collected. That is what makes
 * it a game rather than a scrolling list: you cannot reach 2025 without having
 * walked through 2021.
 */

const CAM_EASE = 0.12;
/** How long the landing squash is held, in ms. Cleared by the loop, not a timer. */
const SQUASH_MS = 170;
/** Standing still this long starts the idle breath. */
const IDLE_MS = 1800;

const LEFT_KEYS = new Set(['ArrowLeft', 'a', 'A']);
const RIGHT_KEYS = new Set(['ArrowRight', 'd', 'D']);
const JUMP_KEYS = new Set(['ArrowUp', 'w', 'W', ' ', 'Spacebar']);

export default function Adventure({ onDone }: { onDone?: () => void }) {
	/* Built once, never mutated. A lazy initialiser rather than a ref, because
	   a ref read during render is exactly what the lint rule is there to stop. */
	const [chapters] = useState(buildChapters);
	const worldW = chapters.length * CHAPTER_W;

	const { play } = useShell();

	const stageRef = useRef<HTMLDivElement>(null);
	const camRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const shadowRef = useRef<HTMLDivElement>(null);
	/* The marker moves every frame, so it is written to the DOM like the
	   character and the camera rather than rendered from state. */
	const markRef = useRef<HTMLDivElement>(null);

	/* Everything the loop mutates lives here, never in state. */
	const body = useRef({
		x: 60,
		y: 0,
		vy: 0,
		facing: 1,
		onGround: true,
		cam: 0,
	});
	const held = useRef({ left: false, right: false });
	const gotRef = useRef<Set<string>>(new Set());
	/* Stamps the loop reads instead of setting timers. */
	const marks = useRef({ landedAt: -1, stillSince: 0 });
	/* Which gates have already been sounded, so the cue fires once each. */
	const chimed = useRef<Set<number>>(new Set());

	const [got, setGot] = useState<string[]>([]);
	const [chapter, setChapter] = useState(0);
	const [moved, setMoved] = useState(false);
	const [finished, setFinished] = useState(false);

	const chapterRef = useRef(0);
	const movedRef = useRef(false);
	const finishedRef = useRef(false);

	/** A chapter is passable once everything in it has been picked up. */
	const clearedIn = useCallback(
		(i: number, have: Set<string>) =>
			chapters[i].tokens.every((t) => have.has(t.id)),
		[chapters],
	);
	/* The loop asks the ref; render asks the state. Same question, two sources,
	   because only one of them is allowed to be read during a render. */
	const clearedLive = useCallback(
		(i: number) => clearedIn(i, gotRef.current),
		[clearedIn],
	);

	const jump = useCallback(() => {
		if (body.current.onGround) {
			body.current.vy = JUMP_V;
			body.current.onGround = false;
		}
	}, []);

	/* Keys are bound to the stage, not the window: an app inside a fake desktop
	   has no business swallowing the arrow keys of the page it sits in. */
	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const k = e.key;
			if (LEFT_KEYS.has(k)) held.current.left = true;
			else if (RIGHT_KEYS.has(k)) held.current.right = true;
			else if (JUMP_KEYS.has(k)) jump();
			else return;
			e.preventDefault();
			if (!movedRef.current) {
				movedRef.current = true;
				setMoved(true);
			}
		},
		[jump],
	);

	const onKeyUp = useCallback((e: React.KeyboardEvent) => {
		const k = e.key;
		if (LEFT_KEYS.has(k)) held.current.left = false;
		else if (RIGHT_KEYS.has(k)) held.current.right = false;
		else return;
		e.preventDefault();
	}, []);

	/* Touch and mouse get the same three verbs the keyboard has. */
	const press = useCallback(
		(dir: 'left' | 'right', on: boolean) => {
			held.current[dir] = on;
			if (on && !movedRef.current) {
				movedRef.current = true;
				setMoved(true);
			}
		},
		[],
	);

	useEffect(() => {
		let raf = 0;
		let last = performance.now();

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;

			const b = body.current;

			/* Walk */
			const dir = (held.current.right ? 1 : 0) - (held.current.left ? 1 : 0);
			if (dir !== 0) {
				b.x += dir * SPEED * dt;
				b.facing = dir;
			}

			/* Jump and fall. The landing is the transition, not the state —
			   `onGround` is true on every grounded frame, so testing it alone
			   would squash the character for as long as it stood still. */
			b.vy -= GRAVITY * dt;
			b.y += b.vy * dt;
			if (b.y <= 0) {
				if (!b.onGround) marks.current.landedAt = now;
				b.y = 0;
				b.vy = 0;
				b.onGround = true;
			}

			/* The gate: you cannot leave a chapter you have not finished. */
			const here = Math.min(
				chapters.length - 1,
				Math.max(0, Math.floor((b.x + HERO_W / 2) / CHAPTER_W)),
			);
			const wall = (here + 1) * CHAPTER_W - HERO_W - 26;
			if (!clearedLive(here) && b.x > wall) b.x = wall;
			b.x = Math.max(0, Math.min(b.x, worldW - HERO_W));

			/* Pick up anything within reach */
			for (const ch of chapters) {
				for (const t of ch.tokens) {
					if (gotRef.current.has(t.id)) continue;
					const dx = t.x - (b.x + HERO_W / 2);
					const dy = t.y - (b.y + HERO_H / 2);
					if (dx * dx + dy * dy < PICKUP_R * PICKUP_R) {
						gotRef.current.add(t.id);
						/* Climb a whole tone per token within a chapter, then
						   reset — a run of eight reads as a phrase rather than
						   the same blip eight times. */
						const done = ch.tokens.filter((x) =>
							gotRef.current.has(x.id),
						).length;
						play('pickup', (done - 1) * 200);
						setGot([...gotRef.current]);

						if (
							!chimed.current.has(ch.index) &&
							done === ch.tokens.length
						) {
							chimed.current.add(ch.index);
							play('unlock');
						}
					}
				}
			}

			/* Camera trails the character rather than snapping to it. */
			const view = stageRef.current?.clientWidth ?? 600;
			const want = Math.max(
				0,
				Math.min(b.x + HERO_W / 2 - view / 2, worldW - view),
			);
			b.cam += (want - b.cam) * CAM_EASE;

			if (camRef.current) {
				camRef.current.style.transform = `translate3d(${-b.cam}px,0,0)`;
			}
			if (heroRef.current) {
				const el = heroRef.current;
				el.style.transform = `translate3d(${b.x}px,${-b.y}px,0) scaleX(${b.facing})`;
				/* Written as attributes rather than state: these flip constantly. */
				const walking = dir !== 0 && b.onGround;
				if (walking !== (el.dataset.walking === 'true')) {
					el.dataset.walking = String(walking);
				}
				if (b.onGround === (el.dataset.air === 'true')) {
					el.dataset.air = String(!b.onGround);
				}

				const squashing = now - marks.current.landedAt < SQUASH_MS;
				if (squashing !== (el.dataset.land === 'true')) {
					el.dataset.land = String(squashing);
				}

				/* Idle only counts while standing on the ground doing nothing. */
				if (!b.onGround || dir !== 0) marks.current.stillSince = now;
				const idling = now - marks.current.stillSince > IDLE_MS;
				if (idling !== (el.dataset.idle === 'true')) {
					el.dataset.idle = String(idling);
				}
			}

			/* The shadow stays on the ground and shrinks as the character
			   rises — without it there is no way to judge where a jump lands. */
			if (shadowRef.current) {
				const lift = Math.min(1, b.y / 110);
				shadowRef.current.style.transform =
					`translate3d(${b.x}px,0,0) scale(${1 - lift * 0.45})`;
				shadowRef.current.style.opacity = String(0.28 - lift * 0.2);
			}

			/* Marker on the minimap, in the chapter's own coordinates. */
			if (markRef.current) {
				markRef.current.style.left = `${heroPct(b.x + HERO_W / 2, chapters[here])}%`;
			}

			if (here !== chapterRef.current) {
				chapterRef.current = here;
				setChapter(here);
			}
			if (
				!finishedRef.current &&
				here === chapters.length - 1 &&
				clearedLive(here)
			) {
				finishedRef.current = true;
				setFinished(true);
			}
		};

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [chapters, clearedLive, play, worldW]);

	const total = chapters.reduce((n, c) => n + c.tokens.length, 0);
	const ch = chapters[chapter];
	/* What render is allowed to see: the state list, not the live ref. */
	const have = new Set(got);
	const here = chapterProgress(ch, have);

	return (
		<div className='cx-game'>
			<div className='cx-hud'>
				<span className='cx-hud-ch'>
					CH.{chapter + 1}/{chapters.length}
				</span>
				<div className='cx-hud-name'>
					<strong>{ch.exp.short}</strong>
					<span>{ch.exp.period}</span>
				</div>
				<span className='cx-hud-score'>
					{/* Remounted on every pickup so the CSS bump replays — the
					    same trick the desktop cat's hearts use. */}
					<b key={got.length}>
						{here.done}/{here.total}
					</b>{' '}
					here · {got.length}/{total} total
				</span>
			</div>

			{/* One chapter's worth of pips. A chapter is wider than the stage can
			    show, so without this a missed token means walking back and forth
			    with nothing to aim at. */}
			<div className='cx-map' aria-hidden='true'>
				<span className='cx-map-line' />
				{ch.tokens.map((t) => (
					<span
						key={t.id}
						className='cx-map-pip'
						data-got={have.has(t.id) || undefined}
						data-high={t.y > PICKUP_R || undefined}
						style={{ left: `${pipPct(t, ch)}%` }}
						title={t.skill}
					/>
				))}
				<div className='cx-map-you' ref={markRef} />
			</div>

			{/* The playfield. tabIndex so it can take the keys it listens for. */}
			<div
				className='cx-stage'
				ref={stageRef}
				tabIndex={0}
				role='application'
				aria-label='Career adventure. Arrow keys to walk, up to jump.'
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				style={{ height: WORLD_H }}>
				<div
					className='cx-cam'
					ref={camRef}
					style={{ width: worldW, height: WORLD_H }}>
					{chapters.map((c) => (
						<section
							key={c.exp.company}
							className='cx-chapter'
							data-cleared={clearedIn(c.index, have) || undefined}
							style={{ left: c.x, width: CHAPTER_W }}>
							<div className='cx-sign'>
								<span className='cx-sign-lv'>LV.{c.level}</span>
								<strong>{c.exp.short}</strong>
								<span className='cx-sign-quest'>{c.quest}</span>
							</div>

							{c.tokens.map((t) => (
								<span
									key={t.id}
									className='cx-token'
									data-got={have.has(t.id) || undefined}
									style={{ left: t.x - c.x, bottom: GROUND + t.y }}>
									<i aria-hidden='true' />
									<b>{t.skill}</b>
								</span>
							))}

							{/* The gate at the right edge of every chapter but the last */}
							{c.index < chapters.length - 1 && (
								<span
									className='cx-gate'
									data-open={clearedIn(c.index, have) || undefined}
									style={{ bottom: GROUND }}>
									<span className='cx-gate-lock'>
										{(() => {
											const p = chapterProgress(c, have);
											return p.done === p.total
												? 'OPEN'
												: `LOCKED — ${p.total - p.done} left`;
										})()}
									</span>
								</span>
							)}
						</section>
					))}

					<div className='cx-ground' style={{ height: GROUND }} />

					<div
						className='cx-shadow'
						ref={shadowRef}
						style={{ bottom: GROUND - 3, width: HERO_W }}
						aria-hidden='true'
					/>

					<div
						className='cx-hero'
						ref={heroRef}
						style={{ bottom: GROUND, width: HERO_W, height: HERO_H }}>
						<HeroArt />
					</div>
				</div>

				{!moved && (
					<p className='cx-hint'>
						Click here, then <kbd>←</kbd> <kbd>→</kbd> to walk and{' '}
						<kbd>↑</kbd> to jump for the high ones
					</p>
				)}

				{finished && (
					<div className='cx-win' role='status'>
						<strong>All {total} skills collected</strong>
						<span>Four years, five roles, one spreadsheet retired.</span>
						{onDone && (
							<button type='button' onClick={onDone}>
								Read it as a summary
							</button>
						)}
					</div>
				)}
			</div>

			<div className='cx-pad' aria-hidden='true'>
				<button
					type='button'
					onPointerDown={() => press('left', true)}
					onPointerUp={() => press('left', false)}
					onPointerLeave={() => press('left', false)}>
					←
				</button>
				<button type='button' onPointerDown={jump}>
					Jump
				</button>
				<button
					type='button'
					onPointerDown={() => press('right', true)}
					onPointerUp={() => press('right', false)}
					onPointerLeave={() => press('right', false)}>
					→
				</button>
			</div>
		</div>
	);
}
