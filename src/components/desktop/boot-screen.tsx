'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useShell } from '@/context/shell-context';
import { useClock } from '@/hooks/use-clock';
import WindowsLogo from '@/components/ui/windows-logo';
import Wallpaper from './wallpaper';
import { profile } from '@/data/profile';

/**
 * The Windows 11 startup sequence: firmware logo, lock screen, sign-in.
 *
 * It doubles as the shell's loading state. The desktop mounts and hydrates
 * *behind* this overlay rather than after it, so the sequence is spending
 * time the browser needed anyway — and the moment it lifts, everything under
 * it is already live.
 *
 * It plays once per browser session, and any key or click walks it forward
 * the way a real lock screen does. A portfolio that makes you sit through a
 * four-second animation on every reload is a portfolio nobody reloads.
 */

type Phase = 'boot' | 'lock' | 'welcome';

const ORDER: Phase[] = ['boot', 'lock', 'welcome'];

/** How long each phase holds if the visitor does nothing, in ms. */
const HOLD: Record<Phase, number> = { boot: 900, lock: 1600, welcome: 900 };

/** Dots in the orbiting spinner Windows shows under the boot logo. */
const DOTS = [0, 1, 2, 3, 4];

function Spinner({ small = false }: { small?: boolean }) {
	return (
		<span className='bt-spinner' data-small={small || undefined} aria-hidden='true'>
			{DOTS.map((i) => (
				/* One rotating wrapper per dot, staggered into the same non-linear
				   orbit — which is what makes the ring bunch and spread rather
				   than turn like a wheel. */
				<i key={i} style={{ animationDelay: `${i * -0.17}s` }} />
			))}
		</span>
	);
}

export default function BootScreen() {
	const { finishBoot } = useShell();
	const { time, longDate } = useClock(30_000);
	const reduce = useReducedMotion();
	const [phase, setPhase] = useState<Phase>('boot');

	/* No reset is needed when Restart replays the sequence: the overlay is
	   mounted only while `booted` is false, so a replay mounts a fresh one
	   that starts at 'boot' on its own. */

	/**
	 * Move to the next phase, or off the screen if this was the last.
	 *
	 * Both branches have to sit outside a `setPhase` updater. React may run an
	 * updater during the render phase, so it must stay pure — calling
	 * `finishBoot` from inside one updates the shell context mid-render, which
	 * React rightly refuses.
	 */
	const advance = useCallback(() => {
		const next = ORDER[ORDER.indexOf(phase) + 1];
		if (next) setPhase(next);
		else finishBoot();
	}, [phase, finishBoot]);

	/* Someone who asked for less motion has asked not to watch this. */
	useEffect(() => {
		if (!reduce) return;
		const t = setTimeout(finishBoot, 320);
		return () => clearTimeout(t);
	}, [reduce, finishBoot]);

	useEffect(() => {
		if (reduce) return;
		const t = setTimeout(advance, HOLD[phase]);
		return () => clearTimeout(t);
	}, [phase, advance, reduce]);

	/* Any key or click walks the sequence forward, as a lock screen does.
	   The Skip control is exempt — it ends the sequence outright. */
	useEffect(() => {
		const onInput = (e: Event) => {
			if ((e.target as HTMLElement | null)?.closest?.('.bt-skip')) return;
			if (e instanceof KeyboardEvent && e.key === 'Escape') return finishBoot();
			advance();
		};
		window.addEventListener('keydown', onInput);
		window.addEventListener('pointerdown', onInput);
		return () => {
			window.removeEventListener('keydown', onInput);
			window.removeEventListener('pointerdown', onInput);
		};
	}, [advance, finishBoot]);

	return (
		<motion.div
			className='bootscreen'
			data-phase={phase}
			role='status'
			aria-live='polite'
			aria-label={
				phase === 'boot'
					? 'Starting'
					: phase === 'lock'
						? 'Lock screen'
						: 'Signing in'
			}
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			/* Windows lifts the sign-in screen away rather than cross-fading it,
			   so the desktop underneath is revealed instead of blended into. */
			exit={
				reduce
					? { opacity: 0 }
					: { opacity: 0, scale: 1.06, filter: 'blur(6px)' }
			}
			transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}>
			{phase !== 'boot' && (
				<>
					<Wallpaper />
					<span className='bt-scrim' aria-hidden='true' />
				</>
			)}

			{phase === 'boot' && (
				<div className='bt-stage'>
					<WindowsLogo size={58} />
					<Spinner />
				</div>
			)}

			{phase === 'lock' && (
				<>
					<div className='bt-stage bt-lock' suppressHydrationWarning>
						<p className='bt-time'>{time || ' '}</p>
						<p className='bt-date'>{longDate || ' '}</p>
					</div>
					<p className='bt-hint'>Press any key to sign in</p>
				</>
			)}

			{phase === 'welcome' && (
				<div className='bt-stage bt-signin'>
					<span className='bt-avatar' aria-hidden='true'>
						{profile.initials}
					</span>
					<p className='bt-name'>{profile.name}</p>
					<Spinner small />
					<p className='bt-welcome'>Welcome</p>
				</div>
			)}

			{phase !== 'boot' && (
				<button type='button' className='bt-skip' onClick={finishBoot}>
					Skip
				</button>
			)}
		</motion.div>
	);
}
