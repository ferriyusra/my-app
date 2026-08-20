'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useShell } from '@/context/shell-context';
import CatArt, { CAT_W } from './cat-art';

/**
 * A cat that lives on the desktop.
 *
 * It wanders the floor above the taskbar, sits, grooms and falls asleep on its
 * own; clicking pets it and the desktop menu can put food down for it, which
 * it will walk over and eat.
 *
 * Position never touches React. The same rule the window frame follows applies
 * here for the same reason — a transform written sixty times a second through
 * state would re-render the shell's whole context tree. Only the mood changes
 * are state, and those happen every few seconds.
 */

type Mode = 'walk' | 'sit' | 'groom' | 'sleep' | 'toFood' | 'eat' | 'pet';

/**
 * Pace in pixels per second. A wandering cat is in no hurry; a cat that has
 * heard a bowl go down is a different animal.
 */
const SPEED_WANDER = 52;
const SPEED_FOOD = 125;
/** Food lands within reach rather than anywhere, so dinner is not a hike. */
const FOOD_REACH = 420;
const MARGIN = 14;
/** How close is close enough to have arrived. */
const REACH = 3;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function DesktopCat() {
	const { catOn, feedTick } = useShell();
	const reduce = useReducedMotion();

	const rootRef = useRef<HTMLButtonElement>(null);
	const pos = useRef({ x: 160, target: 160, facing: 1 });
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [mode, setMode] = useState<Mode>('sit');
	const [food, setFood] = useState<number | null>(null);
	/** Bumped on each pet so the hearts remount and replay. */
	const [purr, setPurr] = useState(0);

	const modeRef = useRef(mode);
	useEffect(() => {
		modeRef.current = mode;
	}, [mode]);

	/* Feeding arrives as a counter from elsewhere in the shell. The loop
	   compares what has been asked for against what it has served. */
	const asked = useRef(0);
	const served = useRef(0);
	useEffect(() => {
		asked.current = feedTick;
	}, [feedTick]);

	const floorRange = () => ({
		min: MARGIN,
		max: Math.max(MARGIN + 40, window.innerWidth - CAT_W - MARGIN),
	});

	const later = useCallback((ms: number, fn: () => void) => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(fn, ms);
	}, []);

	/* `decide` schedules itself, so the recursion goes through a ref rather
	   than the callback capturing a copy of itself that can never update. */
	const decideRef = useRef<() => void>(() => {});

	/** Pick something to do next: wander, or settle in for a while. */
	const decide = useCallback(() => {
		const roll = Math.random();
		if (!reduce && roll < 0.5) {
			const { min, max } = floorRange();
			pos.current.target = rand(min, max);
			setMode('walk');
			return;
		}
		if (roll < 0.7) {
			setMode('groom');
			later(rand(2200, 4000), () => decideRef.current());
		} else if (roll < 0.88) {
			setMode('sit');
			later(rand(2500, 5000), () => decideRef.current());
		} else {
			setMode('sleep');
			later(rand(6000, 11000), () => decideRef.current());
		}
	}, [later, reduce]);

	useEffect(() => {
		decideRef.current = decide;
	}, [decide]);

	/* ── The movement loop ───────────────────────────────────── */

	useEffect(() => {
		if (!catOn) return;
		let raf = 0;
		let last = performance.now();

		const frame = (now: number) => {
			/* Clamp the delta so a backgrounded tab does not teleport the cat
			   across the screen when it comes back. */
			const dt = Math.min(64, now - last) / 1000;
			last = now;
			const p = pos.current;
			let m = modeRef.current;

			if (asked.current !== served.current) {
				served.current = asked.current;
				const { min, max } = floorRange();
				/* Reduced motion means no trip across the desktop, so the bowl
				   lands within a whisker of where the cat already is. */
				const at = reduce
					? Math.min(Math.max(p.x + 44, min), max)
					: Math.min(
							Math.max(p.x + rand(-FOOD_REACH, FOOD_REACH), min),
							max,
						);
				setFood(at);
				p.target = at;
				m = reduce ? 'eat' : 'toFood';
				modeRef.current = m;
				setMode(m);
				if (reduce) {
					later(2600, () => {
						setFood(null);
						setMode('sit');
						later(1200, () => decideRef.current());
					});
				}
			}

			if (m === 'walk' || m === 'toFood') {
				const dx = p.target - p.x;
				if (Math.abs(dx) <= REACH) {
					p.x = p.target;
					if (m === 'toFood') {
						setMode('eat');
						later(2600, () => {
							setFood(null);
							setMode('sit');
							later(1400, decide);
						});
					} else {
						decide();
					}
				} else {
					const dir = Math.sign(dx);
					p.x += dir * (m === 'toFood' ? SPEED_FOOD : SPEED_WANDER) * dt;
					p.facing = dir;
				}
			}

			const el = rootRef.current;
			if (el) {
				el.style.transform = `translate3d(${Math.round(p.x)}px, 0, 0)`;
				el.dataset.facing = String(p.facing);
			}
			raf = requestAnimationFrame(frame);
		};

		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [catOn, decide, later, reduce]);

	/* Start the loop of moods once, and stop every timer on the way out. */
	useEffect(() => {
		if (!catOn) return;
		later(1200, decide);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [catOn, later, decide]);

	/* Keep the cat on screen when the window is resized under it. */
	useEffect(() => {
		if (!catOn) return;
		const onResize = () => {
			const { min, max } = floorRange();
			pos.current.x = Math.min(Math.max(pos.current.x, min), max);
			pos.current.target = Math.min(Math.max(pos.current.target, min), max);
		};
		window.addEventListener('resize', onResize, { passive: true });
		return () => window.removeEventListener('resize', onResize);
	}, [catOn]);

	/* ── Petting ─────────────────────────────────────────────── */

	const petCat = () => {
		if (modeRef.current === 'eat' || modeRef.current === 'toFood') return;
		setPurr((n) => n + 1);
		setMode('pet');
		later(2400, decide);
	};

	if (!catOn) return null;

	const label =
		mode === 'sleep'
			? 'The desktop cat is asleep. Activate to wake and pet it'
			: mode === 'eat'
				? 'The desktop cat is eating'
				: mode === 'pet'
					? 'The desktop cat is purring'
					: 'Pet the desktop cat';

	return (
		<>
			{food !== null && (
				<span
					className='cat-food'
					aria-hidden='true'
					style={{ transform: `translate3d(${Math.round(food)}px, 0, 0)` }}>
					<svg viewBox='0 0 28 18' width='28' height='18'>
						<ellipse cx='14' cy='13.5' rx='11' ry='4' fill='#5b6673' />
						<path d='M3 12.5a11 4 0 0 0 22 0v-1a11 4 0 0 1-22 0Z' fill='#8d99a6' />
						<ellipse cx='14' cy='11' rx='9' ry='3' fill='#c8794a' />
						<circle cx='11' cy='10.4' r='1.5' fill='#a85f37' />
						<circle cx='16' cy='11.2' r='1.5' fill='#a85f37' />
					</svg>
				</span>
			)}

			<button
				ref={rootRef}
				type='button'
				className='cat'
				data-mode={mode}
				aria-label={label}
				onClick={petCat}>
				<CatArt />

				{mode === 'sleep' && (
					<span className='cat-zzz' aria-hidden='true'>
						<i>z</i>
						<i>z</i>
						<i>z</i>
					</span>
				)}

				{mode === 'pet' && (
					<span className='cat-hearts' key={purr} aria-hidden='true'>
						<i />
						<i />
						<i />
					</span>
				)}
			</button>
		</>
	);
}
