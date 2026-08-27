'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiPower } from '@/components/icons/line-icons';
import { useShell } from '@/context/shell-context';
import WindowsLogo from '@/components/ui/windows-logo';

/**
 * What the screen shows once Start's power button has been used: asleep, or
 * shut down. Restart is not here — it replays the real boot sequence instead
 * of drawing a second, near-identical spinner.
 *
 * Every state has a way back, because a portfolio that can be bricked by its
 * own Start menu is a broken portfolio.
 */
export default function PowerScreen() {
	const { power, setPower, replayBoot } = useShell();

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

	if (power === 'on') return null;

	return (
		<motion.div
			className='power-screen'
			role='alertdialog'
			aria-label={power === 'sleep' ? 'Sleeping' : 'Shut down'}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45 }}>
			{power === 'sleep' && (
				<p className='power-hint'>Press any key to wake</p>
			)}

			{power === 'off' && (
				<>
					<WindowsLogo size={44} />
					<p className='power-title'>It&rsquo;s now safe to close this tab.</p>
					<button
						type='button'
						className='power-btn'
						onClick={() => {
							replayBoot();
							setPower('on');
						}}>
						<LiPower size={18} aria-hidden='true' />
						Turn on
					</button>
				</>
			)}
		</motion.div>
	);
}
