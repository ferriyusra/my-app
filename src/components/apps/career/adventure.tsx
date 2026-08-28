'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { evidenceFor, monthsLabel } from '@/lib/skill-evidence';
import HeroArt, { HERO_H, HERO_W } from './hero-art';
import SkillMark, { skillByName } from './token-mark';
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

/**
 * Camera smoothing, expressed as "fraction of the remaining distance covered in
 * one 60Hz frame".
 *
 * It is converted to a real, time-based rate below rather than applied per
 * frame. Multiplying by a constant each frame silently assumes every frame is
 * the same length; they are not, so the camera moved a different amount for the
 * same elapsed time and the character's screen position wobbled about a quarter
 * of a pixel back and forth — 19 direction reversals in 119 frames, measured.
 */
const CAM_EASE = 0.12;
/** How quickly the look-ahead itself eases in, in the same units. */
const LEAD_EASE = 0.06;
/** How far ahead the camera looks, in the direction of travel. */
const CAM_LEAD = 90;
/** How close to a signpost counts as standing at it. */
const SIGN_REACH = 150;
/** Holding shift covers the 4,700px world without changing how it plays. */
const RUN = 1.75;
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
	/* Flattened once: the collision step walks this every frame. */
	const [ledges] = useState(() => buildChapters().flatMap((c) => c.ledges));
	const worldW = chapters.length * CHAPTER_W;

	const { play } = useShell();
	const { launch } = useWindowManager();

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
		/* Eased separately from the camera so it ramps in rather than snaps. */
		lead: 0,
	});
	const held = useRef({ left: false, right: false, run: false });
	const gotRef = useRef<Set<string>>(new Set());
	/* Stamps the loop reads instead of setting timers. */
	const marks = useRef({ landedAt: -1, stillSince: 0 });
	/* Which gates have already been sounded, so the cue fires once each. */
	const chimed = useRef<Set<number>>(new Set());

	const [got, setGot] = useState<string[]>([]);
	const [chapter, setChapter] = useState(0);
	const [moved, setMoved] = useState(false);
	const [finished, setFinished] = useState(false);
	/* Stamped when the last token lands, never read during render. */
	const [elapsed, setElapsed] = useState(0);
	/* Which signpost the character is standing at. Computed every frame, but
	   only published when it actually changes. */
	const [atSign, setAtSign] = useState<number | null>(null);
	/* The last thing picked up, so the world can say what it was. Never
	   cleared: the card animates itself out, and remounting on a new id
	   replays it — the same trick the cat's hearts use. */
	const [lastPick, setLastPick] = useState<{ id: string; skill: string } | null>(
		null,
	);

	const chapterRef = useRef(0);
	const movedRef = useRef(false);
	const finishedRef = useRef(false);
	const atSignRef = useRef<number | null>(null);
	/* Started on the first step, so the finish can say how long it took. */
	const startedAt = useRef(0);

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

	/**
	 * Keys are read from `window`, but only while this app's own window is the
	 * focused one.
	 *
	 * Binding them to the stage element was wrong in practice: opening the app
	 * leaves focus on the window frame, not on the stage inside it, so arrows
	 * and space did nothing until the playfield itself was clicked — which
	 * reads as "the keyboard is broken", because it was.
	 *
	 * Listening globally without the guard would be the opposite mistake: an
	 * app inside a fake desktop must not swallow the arrow keys of the page it
	 * sits in, or of another window that happens to be on top.
	 */
	const focused = useCallback(() => {
		const win = stageRef.current?.closest('.win');
		/* No window frame at all (a test harness, a future embed): fall back to
		   asking whether focus is somewhere inside the game. */
		if (!win) return stageRef.current?.contains(document.activeElement) ?? false;
		return win.getAttribute('data-focused') === 'true';
	}, []);

	useEffect(() => {
		/* A control that does something with the key already owns it — Space on
		   the Summary tab must switch mode, not make the character jump. */
		const typing = (t: EventTarget | null) =>
			t instanceof HTMLElement &&
			(t.closest('button, a, input, textarea, select') !== null ||
				t.isContentEditable);

		const down = (e: KeyboardEvent) => {
			if (!focused() || typing(e.target)) return;
			const k = e.key;
			if (k === 'Shift') { held.current.run = true; return; }
			if (LEFT_KEYS.has(k)) held.current.left = true;
			else if (RIGHT_KEYS.has(k)) held.current.right = true;
			else if (JUMP_KEYS.has(k)) jump();
			else if ((k === 'e' || k === 'E') && atSignRef.current !== null) {
				/* Hand off to the real window rather than reprinting the CV
				   inside the game — the move the Terminal's `open` makes. */
				launch('experience');
			} else return;
			e.preventDefault();
			if (!movedRef.current) {
				movedRef.current = true;
				startedAt.current = performance.now();
				setMoved(true);
			}
		};

		const up = (e: KeyboardEvent) => {
			const k = e.key;
			if (k === 'Shift') held.current.run = false;
			else if (LEFT_KEYS.has(k)) held.current.left = false;
			else if (RIGHT_KEYS.has(k)) held.current.right = false;
		};

		/* Let go of everything if the window loses focus mid-stride, or the
		   character walks on for ever with nobody holding the key. */
		const release = () => {
			held.current.left = false;
			held.current.right = false;
			held.current.run = false;
		};

		window.addEventListener('keydown', down);
		window.addEventListener('keyup', up);
		window.addEventListener('blur', release);
		return () => {
			window.removeEventListener('keydown', down);
			window.removeEventListener('keyup', up);
			window.removeEventListener('blur', release);
		};
	}, [focused, jump, launch]);

	/* Touch and mouse get the same three verbs the keyboard has. */
	const press = useCallback(
		(dir: 'left' | 'right', on: boolean) => {
			held.current[dir] = on;
			if (on && !movedRef.current) {
				movedRef.current = true;
				startedAt.current = performance.now();
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
			/* Two frames' worth at most. The old 50ms cap let a hitch move the
			   character 12px in one step, which reads as a stutter; capping
			   tighter makes a dropped frame slow time down instead. */
			const dt = Math.min((now - last) / 1000, 0.034);
			last = now;

			const b = body.current;

			/* Walk */
			const dir = (held.current.right ? 1 : 0) - (held.current.left ? 1 : 0);
			if (dir !== 0) {
				b.x += dir * SPEED * (held.current.run ? RUN : 1) * dt;
				b.facing = dir;
			}

			/* Jump and fall. The landing is the transition, not the state —
			   `onGround` is true on every grounded frame, so testing it alone
			   would squash the character for as long as it stood still. */
			const wasAt = b.y;
			b.vy -= GRAVITY * dt;
			b.y += b.vy * dt;

			/* Standing is re-earned every frame: step off the end of a ledge and
			   nothing holds you up, which is what makes walking off one work
			   without a separate check. */
			const wasOn = b.onGround;
			b.onGround = false;

			/* One-way platforms. Only catch a *descent* that crossed the surface,
			   so the character passes up through a ledge and lands on top of it
			   rather than bumping its underside. */
			if (b.vy <= 0) {
				for (const l of ledges) {
					if (b.x + HERO_W <= l.x || b.x >= l.x + l.w) continue;
					if (wasAt >= l.y && b.y <= l.y) {
						b.y = l.y;
						b.vy = 0;
						b.onGround = true;
						if (!wasOn) marks.current.landedAt = now;
						break;
					}
				}
			}

			if (b.y <= 0) {
				if (!wasOn) marks.current.landedAt = now;
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
						setLastPick({ id: t.id, skill: t.skill });

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

			/* Camera trails the character rather than snapping to it, and leads
			   in the direction of travel so the player sees where they are
			   going instead of sitting dead centre.

			   Both eases are converted from "per 60Hz frame" to a real rate for
			   this frame's dt. Without that the smoothing is only correct when
			   frames happen to be 16.7ms, and every other frame length pulls the
			   camera a different distance for the same elapsed time — which is
			   the wobble, not any noise in the input. */
			const rate = (perFrame: number) => 1 - Math.pow(1 - perFrame, dt * 60);

			const view = stageRef.current?.clientWidth ?? 600;
			/* The look-ahead eases in too. Snapping it 90px the instant a key
			   went down made the camera lurch at the start of every step. */
			const wantLead =
				held.current.left || held.current.right ? b.facing * CAM_LEAD : 0;
			b.lead += (wantLead - b.lead) * rate(LEAD_EASE);

			const want = Math.max(
				0,
				Math.min(b.x + HERO_W / 2 - view / 2 + b.lead, worldW - view),
			);
			b.cam += (want - b.cam) * rate(CAM_EASE);

			if (camRef.current) {
				/* Deliberately *not* rounded to whole pixels. Snapping the camera
				   to the pixel grid steadies the hairlines behind the character
				   but moves the character itself in 1px steps — measured as a
				   -0.9px jolt every fifth frame or so, which is worse than the
				   crawl it fixes. Sub-pixel everywhere; the GPU interpolates. */
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

			/* Near enough to a signpost to read it. The sign sits 28px into the
			   chapter and is 168px wide; anywhere across it counts. */
			const signMid = here * CHAPTER_W + 28 + 84;
			const near =
				Math.abs(b.x + HERO_W / 2 - signMid) < SIGN_REACH ? here : null;
			if (near !== atSignRef.current) {
				atSignRef.current = near;
				setAtSign(near);
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
				setElapsed(
					startedAt.current ? Math.round((now - startedAt.current) / 1000) : 0,
				);
				setFinished(true);
			}
		};

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [chapters, ledges, clearedLive, play, worldW]);

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
				style={{ height: WORLD_H }}>
				<div
					className='cx-cam'
					ref={camRef}
					style={{ width: worldW, height: WORLD_H }}>
					{/* Depth, done by the browser rather than by us. These sit behind
					    the action on the Z axis; because the stage has a perspective,
					    the one camera translate makes them parallax at the right rate
					    on their own — no second transform, nothing extra per frame. */}
					<div className='cx-far' style={{ width: worldW }} aria-hidden='true' />
					<div className='cx-mid' style={{ width: worldW }} aria-hidden='true' />

					{chapters.map((c) => (
						<section
							key={c.exp.company}
							className='cx-chapter'
							data-cleared={clearedIn(c.index, have) || undefined}
							style={{
								left: c.x,
								width: CHAPTER_W,
								['--era' as string]: c.era,
							}}>
							{/* Walking up to a sign is how the CV gets read here: the
							    numbers are the ones the Experience window shows, from
							    the same data. */}
							<div
								className='cx-sign'
								data-open={atSign === c.index || undefined}>
								<span className='cx-sign-lv'>LV.{c.level}</span>
								<strong>{c.exp.short}</strong>
								<span className='cx-sign-quest'>{c.quest}</span>

								{atSign === c.index && (
									<div className='cx-sign-more'>
										<ul className='cx-sign-stats'>
											{c.exp.stats.map((st) => (
												<li key={st.label}>
													<strong>{st.value}</strong>
													<span>{st.label}</span>
												</li>
											))}
										</ul>
										<span className='cx-sign-key'>
											<kbd>E</kbd> open this role
										</span>
									</div>
								)}
							</div>

							{/* One-way ledges. The world was a flat line before them:
							    the jump existed but nothing ever asked for it, and the
							    raised tokens hung in mid-air with nothing underneath. */}
							{c.ledges.map((l) => (
								<span
									key={l.id}
									className='cx-ledge'
									style={{
										left: l.x - c.x,
										bottom: GROUND + l.y,
										width: l.w,
									}}
									aria-hidden='true'
								/>
							))}

							{c.tokens.map((t) => {
								const skill = skillByName(t.skill);
								return (
									<span
										key={t.id}
										className='cx-token'
										data-got={have.has(t.id) || undefined}
										style={{ left: t.x - c.x, bottom: GROUND + t.y }}>
										{/* The tool's own mark, so a wall of tokens is 26
										    recognisable things rather than 26 squares. Falls
										    back to a lettered plate exactly as the Skills
										    window does. */}
										<i aria-hidden='true'>
											{/* Seven of the 26 are named by a role but are not
											    in the curated skills list, so there is no record
											    to look a mark up from. They get the same lettered
											    plate rather than an empty tile. */}
											{skill ? (
												<SkillMark
													skill={skill}
													size={17}
													className='cx-token-mark'
												/>
											) : (
												<span className='cx-token-mark cx-token-mark-letter'>
													{t.skill.slice(0, 2)}
												</span>
											)}
										</i>
										<b>{t.skill}</b>
										{/* Lies on the tilted floor, so the token reads as an
										    object standing in the world. */}
										<u
											className='cx-token-shadow'
											style={{ ['--lift' as string]: `${t.y}px` }}
											aria-hidden='true'
										/>
									</span>
								);
							})}

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

					<div className='cx-ground' style={{ height: GROUND }}>
						<span className='cx-floor' aria-hidden='true' />
					</div>

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

				{/* Crossing into a new era is the one thing the gates already make
				    significant; remounting on the chapter replays the wash. */}
				{moved && <span key={chapter} className='cx-threshold' aria-hidden='true' />}

				{lastPick && (() => {
					const ev = evidenceFor(lastPick.skill);
					return (
						<div className='cx-pick' key={lastPick.id} aria-hidden='true'>
							<strong>{lastPick.skill}</strong>
							<span>
								{ev.roles.length
									? `${ev.roles.map((r) => r.short).join(', ')} · ${monthsLabel(ev.months)}`
									: 'not named in a role on record'}
							</span>
						</div>
					);
				})()}

				{!moved && (
					<p className='cx-hint'>
						<kbd>←</kbd> <kbd>→</kbd> walk · <kbd>↑</kbd> jump · <kbd>shift</kbd>{' '}
						run · <kbd>E</kbd> at a sign
					</p>
				)}

				{finished && (
					<div className='cx-win' role='status'>
						<strong>All {total} skills collected</strong>
						<span>
							{chapters.length} roles walked
							{elapsed ? ` in ${elapsed}s` : ''}, one spreadsheet retired.
						</span>
						<ul className='cx-win-wall'>
							{chapters.map((c) => (
								<li key={c.exp.company}>
									<span className='cx-win-role'>{c.exp.short}</span>
									<span className='cx-win-skills'>
										{c.unlocked.map((u) => (
											<b key={u}>{u}</b>
										))}
									</span>
								</li>
							))}
						</ul>
						{onDone && (
							<button type='button' onClick={onDone}>
								Read it as a summary
							</button>
						)}
					</div>
				)}
			</div>

			{/* Pointer-only, and aria-hidden — so they are kept out of the tab
			    order rather than being focusable things a screen reader cannot
			    see. The keyboard has its own path above. */}
			<div className='cx-pad' aria-hidden='true'>
				<button
					type='button'
					tabIndex={-1}
					onPointerDown={() => press('left', true)}
					onPointerUp={() => press('left', false)}
					onPointerLeave={() => press('left', false)}>
					←
				</button>
				<button type='button' tabIndex={-1} onPointerDown={jump}>
					Jump
				</button>
				<button
					type='button'
					tabIndex={-1}
					onPointerDown={() => press('right', true)}
					onPointerUp={() => press('right', false)}
					onPointerLeave={() => press('right', false)}>
					→
				</button>
			</div>
		</div>
	);
}
