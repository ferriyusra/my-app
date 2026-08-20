'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useShell } from '@/context/shell-context';
import WindowsLogo from '@/components/ui/windows-logo';

/** How long a reboot takes before the desktop comes back. */
const RESTART_MS = 2400;

/**
 * What the screen shows once Start's power button has been used: asleep,
 * rebooting, or shut down. Every state has a way back, because a portfolio
 * that can be bricked by its own Start menu is a broken portfolio.
 */
export default function PowerScreen() {
	const { power, setPower } = useShell();

	/* Sleep wakes on any input, exactly as a real machine does. */
	useEffect(() => {
		if (power !== 'sleep') return;
		const wake = () => setPower('on');
		window.addEventListener('keydown', wake);
		window.addEventListener('pointerdown', wake);
		return () => {
			window.removeEventListener('keydown', wake);
			window.removeEventListener('pointerdown', wake);
		};
	}, [power, setPower]);

	useEffect(() => {
		if (power !== 'restart') return;
		const t = setTimeout(() => setPower('on'), RESTART_MS);
		return () => clearTimeout(t);
	}, [power, setPower]);

	if (power === 'on') return null;

	return (
		<motion.div
			className='power-screen'
			role='alertdialog'
			aria-label={
				power === 'sleep'
					? 'Sleeping'
					: power === 'restart'
						? 'Restarting'
						: 'Shut down'
			}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45 }}>
			{power === 'sleep' && (
				<p className='power-hint'>Press any key to wake</p>
			)}

			{power === 'restart' && (
				<>
					<WindowsLogo size={44} />
					<span className='power-spinner' aria-hidden='true' />
					<p className='power-hint'>Restarting…</p>
				</>
			)}

			{power === 'off' && (
				<>
					<WindowsLogo size={44} />
					<p className='power-title'>It&rsquo;s now safe to close this tab.</p>
					<button
						type='button'
						className='power-btn'
						onClick={() => setPower('restart')}>
						<Power size={18} aria-hidden='true' />
						Turn on
					</button>
				</>
			)}
		</motion.div>
	);
}
