'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { sendIntent } from '@/hooks/use-app-intent';
import { evidenceFor, monthsLabel } from '@/lib/skill-evidence';
import { INA_PANEL, decisionRows, type DecisionRow } from '@/data/career-objectives';
import HeroArt from './hero-art';
import BugArt from './bug-art';
import CareerTrack from './track';
import SkillMark, { skillByName } from './token-mark';
import Decision from './decision';
import EndScreen, { clockLabel } from './end-screen';
import { newBody, newOut, step } from './engine';
import { complete, type Known, type Live, type Run } from './save';
import {
	GROUND,
	HAZARD_W,
	HERO_H,
	HERO_W,
	PICKUP_R,
	SIGN_MID,
	SIGN_REACH,
	SPAWN_X,
	USE_R,
	WORLD_H,
	chapterAt,
	chapters as buildChapters,
	hazardDir,
	hazardX,
	heroPct,
	worldWidth,
	type Chapter,
	type Spot,
} from './world';

/**
 * The career, walked.
 *
 * Position never touches React — the same rule the window frame and the desktop
 * cat follow, for the same reason: a transform written sixty times a second
 * through state would re-render this whole tree every frame. The loop writes
 * `translate3d` straight onto the character, the bugs and the camera, and only
 * rarely changing things are allowed to be state: the run (owned by
 * career-app.tsx and published on events), which chapter you are in, what you
 * are standing at, and the one-shots the cards and the end screen need. Every
 * one of them is edge-triggered against a ref mirror.
 *
 * The physics is `engine.ts`, a pure step the tests run too. This file is the
 * loop around it: input, pickups, the objectives, the camera, and the DOM.
 *
 * Nothing is gated. A chapter can be left with its skills and its objective
 * undone — a gate shut out anyone who could not or would not platform, which
 * in a portfolio means shut out of the CV — and the bugs knock you back but
 * never end the run.
 */

/**
 * Camera smoothing, expressed as "fraction of the remaining distance covered in
 * one 60Hz frame", converted to a real, time-based rate below rather than
 * applied per frame — multiplying by a constant each frame silently assumes
 * every frame is the same length, and the character's screen position wobbled.
 */
const CAM_EASE = 0.12;
/** How quickly the look-ahead itself eases in, in the same units. */
const LEAD_EASE = 0.06;
/** How far ahead the camera looks, in the direction of travel. */
const CAM_LEAD = 90;
/** Ceiling on camera speed, px/s. Only long flights from the track reach it. */
const PAN_MAX = 2600;
/** How long the landing squash is held, in seconds. Cleared by the loop. */
const SQUASH_S = 0.17;
/** Standing still this long starts the idle breath. */
const IDLE_S = 1.8;
/** After a flight from the track, a moment in which nothing can bump you. */
const ARRIVE_S = 0.8;

const LEFT_KEYS = new Set(['ArrowLeft', 'a', 'A']);
const RIGHT_KEYS = new Set(['ArrowRight', 'd', 'D']);
const JUMP_KEYS = new Set(['ArrowUp', 'w', 'W', ' ', 'Spacebar']);

/** What E says it will do, by kind of stop. */
const USE_VERB: Record<Spot['kind'], string> = {
	package: 'pick up',
	endpoint: 'deliver',
	line: 'carry',
	switch: 'ship',
	store: 'connect',
	console: 'decide',
};

type Card = { id: string; title: string; detail: string };

export default function Adventure({
	onDone,
	run,
	liveRef,
	known,
	publish,
	reset,
}: {
	onDone?: () => void;
	/** The last published snapshot of the run — what render may read. */
	run: Run;
	/** The run as the loop mutates it. Owned by career-app.tsx. */
	liveRef: RefObject<Live>;
	known: Known;
	publish: () => void;
	reset: () => void;
}) {
	/* Built once, never mutated. A lazy initialiser rather than a ref, because
	   a ref read during render is exactly what the lint rule is there to stop. */
	const [world] = useState(() => {
		const chapters = buildChapters();
		return {
			chapters,
			ledges: chapters.flatMap((c) => c.ledges),
			hazards: chapters.flatMap((c) => c.hazards),
			spots: new Map(chapters.flatMap((c) => c.spots.map((s) => [s.id, s] as const))),
			width: worldWidth(chapters),
		};
	});
	const [rows] = useState<DecisionRow[]>(decisionRows);
	const { chapters, width: worldW } = world;

	const { play } = useShell();
	const { launch } = useWindowManager();

	const stageRef = useRef<HTMLDivElement>(null);
	const camRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const shadowRef = useRef<HTMLDivElement>(null);
	const markRef = useRef<HTMLDivElement>(null);
	const bugEls = useRef(new Map<string, HTMLElement>());

	/* Everything the loop mutates lives here, never in state. */
	const body = useRef(newBody(SPAWN_X));
	const view = useRef({ cam: 0, lead: 0 });
	const held = useRef({ left: false, right: false, run: false, jump: false });
	const out = useRef(newOut());
	/** Game time in seconds. Stops while paused, so the bugs freeze with it. */
	const clock = useRef(0);
	const paused = useRef(false);
	const marks = useRef({ landedAt: -1, stillSince: 0 });
	/** Where a bug was when it was fixed, so it stays there. */
	const frozen = useRef(new Map<string, number>());

	const [chapter, setChapter] = useState(0);
	const [moved, setMoved] = useState(false);
	/** What the character is standing at: `spot:<id>` or `sign:<index>`. */
	const [near, setNear] = useState<string | null>(null);
	/** The last thing that happened, so the world can say what it was. The
	    card animates itself out, and remounting on a new id replays it. */
	const [last, setLast] = useState<Card | null>(null);
	const [deciding, setDeciding] = useState(false);
	/** "Keep exploring" hides the end screen for the rest of this visit. */
	const [stayed, setStayed] = useState(false);

	const chapterRef = useRef(0);
	const movedRef = useRef(false);
	const nearRef = useRef<string | null>(null);
	/* Chapters whose clearing has been sounded, seeded with the ones already
	   clear so coming back to a saved run does not replay them. */
	const [clearAtMount] = useState(() => {
		const tokens = new Set(run.tokens);
		const stops = new Set(run.stops);
		return chapters
			.filter((c) => c.tokens.every((t) => tokens.has(t.id)) && c.spots.every((s) => stops.has(s.id)))
			.map((c) => c.index);
	});
	const chimed = useRef(new Set<number>(clearAtMount));

	const [reduced] = useState(
		() =>
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches,
	);

	const firstMove = useCallback(() => {
		if (movedRef.current) return;
		movedRef.current = true;
		setMoved(true);
	}, []);

	/** Is this chapter's objective done? Asked of the live run or a snapshot. */
	const goalDone = useCallback(
		(c: Chapter, stops: ReadonlySet<string>) => c.goal.stops.every((s) => stops.has(s.id)),
		[],
	);

	/** Win, if everything is in. Bugs are optional; the time is play time. */
	const checkWin = useCallback(() => {
		const live = liveRef.current;
		if (live.time !== null || !complete(live, known)) return;
		live.time = Math.round(live.played);
		live.best = live.best === null ? live.time : Math.min(live.best, live.time);
		play('unlock');
	}, [liveRef, known, play]);

	/** Sound a chapter's clearing once: every skill, and its objective. */
	const chimeIfClear = useCallback(
		(c: Chapter) => {
			const live = liveRef.current;
			if (chimed.current.has(c.index)) return;
			if (!c.tokens.every((t) => live.tokens.has(t.id)) || !goalDone(c, live.stops)) return;
			chimed.current.add(c.index);
			play('unlock');
		},
		[liveRef, goalDone, play],
	);

	/** A stop of an objective, done: by walking into it, E, or decide(). */
	const finishStop = useCallback(
		(s: Spot) => {
			const live = liveRef.current;
			if (live.stops.has(s.id)) return;
			live.stops.add(s.id);
			const c = chapters[s.chapter];
			const done = c.goal.stops.filter((x) => live.stops.has(x.id)).length;
			play(s.act === 'touch' ? 'pickup' : 'use', (done - 1) * 150);
			if (done === c.goal.stops.length) play('quest');
			setLast({
				id: `stop-${s.id}`,
				title: s.name,
				detail:
					done === c.goal.stops.length
						? `${c.goal.verb}: done`
						: `${c.goal.verb} · ${done}/${c.goal.stops.length}`,
			});
			chimeIfClear(c);
			checkWin();
			publish();
		},
		[liveRef, chapters, play, chimeIfClear, checkWin, publish],
	);

	const release = useCallback(() => {
		held.current.left = false;
		held.current.right = false;
		held.current.run = false;
		held.current.jump = false;
	}, []);

	const openDecide = useCallback(() => {
		paused.current = true;
		release();
		setDeciding(true);
	}, [release]);

	const closeDecide = useCallback(() => {
		paused.current = false;
		setDeciding(false);
		stageRef.current?.focus();
	}, []);

	/** One decide() case answered. Returns whether the table agrees. */
	const answer = useCallback(
		(row: DecisionRow, a: 'Yes' | 'No') => {
			const live = liveRef.current;
			const right = a === row.email;
			if (!live.tried.has(row.id) && right) live.firstTry.add(row.id);
			live.tried.add(row.id);
			if (right) live.solved.add(row.id);
			play(right ? 'pickup' : 'miss', right ? live.solved.size * 100 : 0);
			const decide = [...world.spots.values()].find((s) => s.act === 'decide');
			if (decide && live.solved.size === rows.length) finishStop(decide);
			else publish();
			return right;
		},
		[liveRef, play, world.spots, rows.length, finishStop, publish],
	);

	/** E, or the pad's Use: whatever the character is standing at. */
	const act = useCallback(() => {
		const key = nearRef.current;
		if (!key) return;
		if (key.startsWith('sign:')) {
			/* Hand off to the real window rather than reprinting the CV inside
			   the game — the move the Terminal's `open` makes. */
			launch('experience');
			return;
		}
		const s = world.spots.get(key.slice(5));
		if (!s) return;
		if (s.act === 'decide') openDecide();
		else finishStop(s);
	}, [launch, world.spots, openDecide, finishStop]);

	/**
	 * Walk to a place, from the track above.
	 *
	 * It moves the *character*, not the camera: `want` is computed from `b.x`
	 * every frame, so the follow camera that already exists becomes the
	 * flight. Nothing is collected on the way — pickup is a per-frame
	 * proximity test — and a moment of grace on arrival means a bug standing
	 * there does not greet you with a knock.
	 */
	const walkTo = useCallback(
		(centreX: number) => {
			const b = body.current;
			b.x = centreX - HERO_W / 2;
			b.y = 0;
			b.vy = 0;
			b.kx = 0;
			b.onGround = true;
			b.facing = 1;
			b.stunUntil = 0;
			b.hurtUntil = clock.current + ARRIVE_S;

			if (reduced) {
				const w = stageRef.current?.clientWidth ?? 600;
				view.current.cam = Math.max(0, Math.min(b.x + HERO_W / 2 - w / 2, worldW - w));
			}
			firstMove();
			/* The keydown guard stands down when the event target is a button,
			   and after this click that is exactly where focus is. */
			stageRef.current?.focus();
		},
		[firstMove, reduced, worldW],
	);

	/** Walk to a role's signpost, so its numbers are open on arrival. */
	const jumpTo = useCallback(
		(index: number) => walkTo(chapters[index].x + SIGN_MID),
		[walkTo, chapters],
	);

	/** Walk to one token, stopping short: the track navigates, it does not collect. */
	const jumpToToken = useCallback((t: { x: number }) => walkTo(t.x - 45), [walkTo]);

	/**
	 * Keys are read from `window`, but only while this app's own window is the
	 * focused one — opening the app leaves focus on the frame, not the stage,
	 * and listening without the guard would swallow another window's arrows.
	 */
	const focused = useCallback(() => {
		const win = stageRef.current?.closest('.win');
		if (!win) return stageRef.current?.contains(document.activeElement) ?? false;
		return win.getAttribute('data-focused') === 'true';
	}, []);

	useEffect(() => {
		/* A control that does something with the key already owns it. */
		const typing = (t: EventTarget | null) =>
			t instanceof HTMLElement &&
			(t.closest('button, a, input, textarea, select') !== null || t.isContentEditable);

		const down = (e: KeyboardEvent) => {
			if (paused.current || !focused() || typing(e.target)) return;
			const k = e.key;
			if (k === 'Shift') {
				held.current.run = true;
				return;
			}
			if (LEFT_KEYS.has(k)) held.current.left = true;
			else if (RIGHT_KEYS.has(k)) held.current.right = true;
			else if (JUMP_KEYS.has(k)) {
				/* A held key repeats; only the press is a jump. The engine keeps
				   it for a moment, so one pressed just before landing still fires. */
				if (!e.repeat) body.current.jumpAt = clock.current;
				held.current.jump = true;
			} else if (k === 'e' || k === 'E') act();
			else return;
			e.preventDefault();
			firstMove();
		};

		const up = (e: KeyboardEvent) => {
			const k = e.key;
			if (k === 'Shift') held.current.run = false;
			else if (LEFT_KEYS.has(k)) held.current.left = false;
			else if (RIGHT_KEYS.has(k)) held.current.right = false;
			else if (JUMP_KEYS.has(k)) held.current.jump = false;
		};

		window.addEventListener('keydown', down);
		window.addEventListener('keyup', up);
		window.addEventListener('blur', release);
		return () => {
			window.removeEventListener('keydown', down);
			window.removeEventListener('keyup', up);
			window.removeEventListener('blur', release);
		};
	}, [focused, firstMove, act, release]);

	/* Touch and mouse get the same verbs the keyboard has. */
	const press = useCallback(
		(dir: 'left' | 'right', on: boolean) => {
			held.current[dir] = on;
			if (on) firstMove();
		},
		[firstMove],
	);

	useEffect(() => {
		let raf = 0;
		let lastT = performance.now();
		const byId = new Map(world.hazards.map((h) => [h.id, h]));

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			/* Two frames' worth at most: a hitch slows time rather than
			   teleporting the character. */
			const dt = Math.min((now - lastT) / 1000, 0.034);
			lastT = now;
			if (paused.current) return;

			clock.current += dt;
			const t = clock.current;
			const b = body.current;
			const h = held.current;
			const live = liveRef.current;
			const dir = ((h.right ? 1 : 0) - (h.left ? 1 : 0)) as -1 | 0 | 1;

			const o = step(
				b,
				{ dir, run: h.run, jumpHeld: h.jump },
				dt,
				t,
				world.ledges,
				world.hazards,
				live.fixed,
				worldW,
				out.current,
			);
			if (o.landed) marks.current.landedAt = t;
			if (o.hurt) play('hurt');
			if (o.stomped) {
				const bug = byId.get(o.stomped)!;
				live.fixed.add(bug.id);
				frozen.current.set(bug.id, hazardX(bug, t));
				play('stomp');
				setLast({ id: `fix-${bug.id}`, title: `${bug.name} fixed`, detail: 'landed on, and gone quiet' });
				publish();
			}
			if (movedRef.current && live.time === null) live.played += dt;

			const cx = b.x + HERO_W / 2;
			const cy = b.y + HERO_H / 2;
			const here = chapterAt(cx, chapters);

			/* Pick up anything within reach, in this chapter and its neighbours. */
			for (let i = Math.max(0, here - 1); i <= Math.min(chapters.length - 1, here + 1); i++) {
				const ch = chapters[i];
				for (const tk of ch.tokens) {
					if (live.tokens.has(tk.id)) continue;
					const dx = tk.x - cx;
					const dy = tk.y - cy;
					if (dx * dx + dy * dy >= PICKUP_R * PICKUP_R) continue;
					live.tokens.add(tk.id);
					/* Climb a whole tone per token within a chapter — a run of
					   eight reads as a phrase rather than the same blip. */
					const done = ch.tokens.filter((x) => live.tokens.has(x.id)).length;
					play('pickup', (done - 1) * 200);
					setLast({ id: tk.id, title: tk.skill, detail: '' });
					chimeIfClear(ch);
					checkWin();
					publish();
				}
				for (const s of ch.spots) {
					if (s.act !== 'touch' || live.stops.has(s.id)) continue;
					if (s.needs && !live.stops.has(s.needs)) continue;
					const dx = s.x - cx;
					const dy = s.y - cy;
					if (dx * dx + dy * dy < PICKUP_R * PICKUP_R) finishStop(s);
				}
			}

			/* Camera trails the character, leading in the direction of travel. */
			const rate = (perFrame: number) => 1 - Math.pow(1 - perFrame, dt * 60);
			const w = stageRef.current?.clientWidth ?? 600;
			const v = view.current;
			const wantLead = h.left || h.right ? b.facing * CAM_LEAD : 0;
			v.lead += (wantLead - v.lead) * rate(LEAD_EASE);
			const want = Math.max(0, Math.min(cx - w / 2 + v.lead, worldW - w));
			const move = (want - v.cam) * rate(CAM_EASE);
			v.cam += Math.min(Math.abs(move), PAN_MAX * dt) * Math.sign(move);

			if (camRef.current) camRef.current.style.transform = `translate3d(${-v.cam}px,0,0)`;
			if (heroRef.current) {
				const el = heroRef.current;
				el.style.transform = `translate3d(${b.x}px,${-b.y}px,0) scaleX(${b.facing})`;
				/* Attributes rather than state: these flip constantly. */
				const set = (k: string, on: boolean) => {
					if (on !== (el.dataset[k] === 'true')) el.dataset[k] = String(on);
				};
				set('walking', dir !== 0 && b.onGround && t >= b.stunUntil);
				set('air', !b.onGround);
				set('land', t - marks.current.landedAt < SQUASH_S);
				if (!b.onGround || dir !== 0) marks.current.stillSince = t;
				set('idle', t - marks.current.stillSince > IDLE_S);
				/* The blink after a knock. A stomp's short grace does not blink. */
				set('hurt', b.hurtUntil - t > 0.2);
			}
			if (shadowRef.current) {
				const lift = Math.min(1, b.y / 110);
				shadowRef.current.style.transform = `translate3d(${b.x}px,0,0) scale(${1 - lift * 0.45})`;
				shadowRef.current.style.opacity = String(0.28 - lift * 0.2);
			}
			/* The bugs, walked by time. A fixed one stays where it was fixed. */
			for (const bug of world.hazards) {
				const el = bugEls.current.get(bug.id);
				if (!el) continue;
				const isFixed = live.fixed.has(bug.id);
				const x = isFixed ? (frozen.current.get(bug.id) ?? bug.from) : hazardX(bug, t);
				el.style.transform = `translate3d(${x - HAZARD_W / 2}px,0,0)`;
				const d = isFixed ? '1' : String(hazardDir(bug, t));
				if (el.dataset.dir !== d) el.dataset.dir = d;
			}
			if (markRef.current) markRef.current.style.left = `${heroPct(cx, chapters[here])}%`;

			/* What the character is standing at: a press-E stop wins over the
			   signpost, and the tests keep the two apart anyway. */
			let at: string | null = null;
			for (const s of chapters[here].spots) {
				if (s.act === 'touch') continue;
				if (s.act === 'use' && live.stops.has(s.id)) continue;
				if (s.needs && !live.stops.has(s.needs)) continue;
				if (b.onGround && Math.abs(cx - s.x) < USE_R && Math.abs(b.y - s.y) < 6) at = `spot:${s.id}`;
			}
			if (!at && Math.abs(cx - (chapters[here].x + SIGN_MID)) < SIGN_REACH) at = `sign:${here}`;
			if (at !== nearRef.current) {
				nearRef.current = at;
				setNear(at);
			}
			if (here !== chapterRef.current) {
				chapterRef.current = here;
				setChapter(here);
			}
		};

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [world, chapters, worldW, liveRef, play, publish, chimeIfClear, checkWin, finishStop]);

	/* What render is allowed to see: the snapshot, not the live sets. */
	const have = new Set(run.tokens);
	const stops = new Set(run.stops);
	const fixed = new Set(run.fixed);
	const solved = new Set(run.solved);
	const firstTry = new Set(run.firstTry);

	const cur = chapters[chapter];
	const decideStop = cur.goal.stops.find((s) => s.act === 'decide');
	const goalCount = decideStop
		? `${solved.size}/${rows.length} cases`
		: `${cur.goal.stops.filter((s) => stops.has(s.id)).length}/${cur.goal.stops.length}`;
	const goalLabel = /^\d+ /.test(cur.goal.title) ? cur.goal.title.replace(/^\d+ /, '') : cur.goal.title;

	/* The package rides on the character between pick-up and delivery. */
	const carrying = chapters.some((c) =>
		c.spots.some((s) => s.needs && stops.has(s.needs) && !stops.has(s.id)),
	);

	return (
		<div className='cx-game'>
			{/* The whole career, before a step is taken. */}
			<CareerTrack
				chapters={chapters}
				here={chapter}
				have={have}
				onPick={jumpTo}
				onPickToken={jumpToToken}
				markRef={markRef}
			/>

			{/* The playfield. tabIndex so it can take the keys it listens for. */}
			<div
				className='cx-stage'
				ref={stageRef}
				tabIndex={0}
				role='application'
				aria-label='Career adventure. Arrow keys to walk, up to jump, E to use.'
				style={{ height: WORLD_H }}>
				<div className='cx-cam' ref={camRef} style={{ width: worldW, height: WORLD_H }}>
					{/* Depth, done by the browser: these sit behind on the Z axis, so
					    the one camera translate parallaxes them on its own. */}
					<div className='cx-far' style={{ width: worldW }} aria-hidden='true' />
					<div className='cx-mid' style={{ width: worldW }} aria-hidden='true' />

					{chapters.map((c) => {
						const clear = c.tokens.every((t) => have.has(t.id)) && goalDone(c, stops);
						const missingTokens = c.tokens.filter((t) => !have.has(t.id));
						const missingStops = c.goal.stops.filter((s) => !stops.has(s.id)).length;
						return (
							<section
								key={c.exp.company}
								className='cx-chapter'
								style={{ left: c.x, width: c.w, ['--era' as string]: c.era }}>
								{/* Walking up to a sign is how the CV gets read here: the
								    numbers are the ones the Experience window shows. */}
								<div className='cx-sign' data-open={near === `sign:${c.index}` || undefined}>
									<span className='cx-sign-lv'>LV.{c.level}</span>
									<strong>{c.exp.short}</strong>
									<span className='cx-sign-quest'>{c.quest}</span>
									<span className='cx-sign-goal'>
										◆ {c.goal.verb}: {c.goal.title}
									</span>

									{near === `sign:${c.index}` && (
										<div className='cx-sign-more'>
											<ul className='cx-sign-stats'>
												{[
													...c.exp.stats,
													...c.exp.highlights.map((hl) => ({ value: '', label: hl })),
												].map((st) => (
													<li key={st.label}>
														{st.value && <strong>{st.value}</strong>}
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

								{/* INA Digital's stores light what the record says they
								    powered, and only that. */}
								{c.exp.short === 'INA Digital' && (
									<span className='cx-panel' data-on={goalDone(c, stops) || undefined}>
										{INA_PANEL}
									</span>
								)}

								{c.ledges.map((l) => (
									<span
										key={l.id}
										className='cx-ledge'
										style={{ left: l.x - c.x, bottom: GROUND + l.y, width: l.w }}
										aria-hidden='true'
									/>
								))}

								{c.tokens.map((tk) => {
									const skill = skillByName(tk.skill);
									return (
										<span
											key={tk.id}
											className='cx-token'
											data-got={have.has(tk.id) || undefined}
											style={{ left: tk.x - c.x, bottom: GROUND + tk.y }}>
											<i aria-hidden='true'>
												{skill ? (
													<SkillMark skill={skill} size={17} className='cx-token-mark' />
												) : (
													<span className='cx-token-mark cx-token-mark-letter'>
														{tk.skill.slice(0, 2)}
													</span>
												)}
											</i>
											<b>{tk.skill}</b>
											<u
												className='cx-token-shadow'
												style={{ ['--lift' as string]: `${tk.y}px` }}
												aria-hidden='true'
											/>
										</span>
									);
								})}

								{/* The objective's stops, named from the record. */}
								{c.spots.map((s) => {
									const done =
										s.act === 'decide' ? solved.size === rows.length : stops.has(s.id);
									const locked = !!s.needs && !stops.has(s.needs);
									const isNear = near === `spot:${s.id}`;
									return (
										<span
											key={s.id}
											className='cx-spot'
											data-kind={s.kind}
											data-act={s.act}
											data-done={done || undefined}
											data-locked={locked || undefined}
											data-near={isNear || undefined}
											style={{ left: s.x - c.x, bottom: GROUND + s.y }}>
											<i aria-hidden='true' />
											<b>{s.name}</b>
											{isNear && (
												<span className='cx-spot-key'>
													<kbd>E</kbd> {USE_VERB[s.kind]}
												</span>
											)}
										</span>
									);
								})}

								{c.teach.map((p) => (
									<span key={p.text} className='cx-teach' style={{ left: p.x - c.x }}>
										{p.text}
									</span>
								))}

								{/* The post at the right edge of every chapter but the last
								    reports what is left. It has stopped nobody since 0832051. */}
								{c.index < chapters.length - 1 && (
									<span className='cx-post' data-open={clear || undefined} style={{ bottom: GROUND }}>
										<span className='cx-post-plate'>
											{clear
												? 'CLEARED'
												: [
														missingTokens.length === 0
															? ''
															: missingTokens.length <= 2
																? missingTokens.map((tk) => tk.skill).join(', ')
																: `${missingTokens.length} skills`,
														missingStops ? `${missingStops} to ${c.goal.verb.toLowerCase()}` : '',
													]
														.filter(Boolean)
														.join(' · ') + ' still out there'}
										</span>
									</span>
								)}
							</section>
						);
					})}

					<div className='cx-ground' style={{ height: GROUND }}>
						<span className='cx-floor' aria-hidden='true' />
					</div>

					{/* The bugs, placed by the loop. Generic names, no incident on record. */}
					{world.hazards.map((bug) => (
						<span
							key={bug.id}
							ref={(el) => {
								if (el) bugEls.current.set(bug.id, el);
								else bugEls.current.delete(bug.id);
							}}
							className='cx-bug'
							data-fixed={fixed.has(bug.id) || undefined}
							style={{ bottom: GROUND + bug.y }}
							aria-hidden='true'>
							<BugArt />
							<b className='cx-bug-name'>{bug.name}</b>
						</span>
					))}

					<div
						className='cx-shadow'
						ref={shadowRef}
						style={{ bottom: GROUND - 3, width: HERO_W }}
						aria-hidden='true'
					/>

					<div
						className='cx-hero'
						ref={heroRef}
						data-carry={carrying || undefined}
						style={{ bottom: GROUND, width: HERO_W, height: HERO_H }}>
						<HeroArt />
					</div>
				</div>

				{moved && <span key={chapter} className='cx-threshold' aria-hidden='true' />}

				{/* The objective here, always in view: what to do, and how far along. */}
				<p className='cx-goal-hud' aria-live='polite'>
					<span aria-hidden='true'>◆</span> {cur.goal.verb} · {goalCount} {goalLabel}
				</p>

				{last &&
					(() => {
						if (last.detail) {
							return (
								<div className='cx-pick' key={last.id} aria-hidden='true'>
									<strong>{last.title}</strong>
									<span>{last.detail}</span>
								</div>
							);
						}
						const ev = evidenceFor(last.title);
						return (
							<div className='cx-pick' key={last.id} aria-hidden='true'>
								<strong>{last.title}</strong>
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
						<kbd>←</kbd> <kbd>→</kbd> walk · <kbd>↑</kbd> jump, hold for higher · <kbd>E</kbd> use ·
						land on a bug to fix it
					</p>
				)}

				{run.time !== null && !stayed && (
					<EndScreen
						chapters={chapters}
						run={run}
						bugs={world.hazards.length}
						rows={rows.length}
						onAgain={reset}
						onStay={() => {
							setStayed(true);
							stageRef.current?.focus();
						}}
						onRead={onDone}
					/>
				)}

				{deciding && (
					<Decision
						rows={rows}
						solved={solved}
						firstTry={firstTry}
						onAnswer={answer}
						onClose={closeDecide}
						onReadCase={() => {
							closeDecide();
							sendIntent('experience', 'case');
							launch('experience');
						}}
					/>
				)}
			</div>

			{run.time !== null && stayed && (
				<p className='cx-done-line'>
					Finished in {clockLabel(run.time)}
					{run.best !== null ? ` · best ${clockLabel(run.best)}` : ''} ·{' '}
					<button type='button' onClick={reset}>
						Play again
					</button>
				</p>
			)}

			{/* Pointer-only and aria-hidden, kept out of the tab order; the
			    keyboard has its own path above. preventDefault on press, or a
			    click leaves focus on the button and the arrow keys stop. */}
			<div className='cx-pad' aria-hidden='true'>
				<button
					type='button'
					tabIndex={-1}
					onPointerDown={(e) => {
						e.preventDefault();
						press('left', true);
					}}
					onPointerUp={() => press('left', false)}
					onPointerLeave={() => press('left', false)}
					onPointerCancel={() => press('left', false)}>
					←
				</button>
				<button
					type='button'
					tabIndex={-1}
					onPointerDown={(e) => {
						e.preventDefault();
						body.current.jumpAt = clock.current;
						held.current.jump = true;
						firstMove();
					}}
					onPointerUp={() => (held.current.jump = false)}
					onPointerLeave={() => (held.current.jump = false)}
					onPointerCancel={() => (held.current.jump = false)}>
					Jump
				</button>
				<button
					type='button'
					tabIndex={-1}
					data-ready={near !== null || undefined}
					onPointerDown={(e) => {
						e.preventDefault();
						act();
					}}>
					Use
				</button>
				<button
					type='button'
					tabIndex={-1}
					onPointerDown={(e) => {
						e.preventDefault();
						press('right', true);
					}}
					onPointerUp={() => press('right', false)}
					onPointerLeave={() => press('right', false)}
					onPointerCancel={() => press('right', false)}>
					→
				</button>
			</div>
		</div>
	);
}
