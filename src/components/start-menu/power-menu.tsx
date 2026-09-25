'use client';

import { useEffect, useRef } from 'react';
import { LogOut, RotateCw } from 'lucide-react';
import { LiMoon, LiPower } from '@/components/icons/line-icons';
import ModeLink from '@/components/ui/mode-link';

/**
 * The little sheet that flies up from Start's power button. Sleep and Restart
 * both do something visible rather than sitting inert: sleep blanks the
 * screen, restart replays the boot.
 *
 * The last item leaves the desktop for the portfolio page. Windows keeps Sign
 * out under the account button rather than here, but that button is the
 * mail link on this Start, and a visitor who arrived straight at /desktop
 * needs a way to the story that does not depend on the back button.
 */
export default function PowerMenu({
	onClose,
	onShutdown,
	onRestart,
	onSleep,
}: {
	onClose: () => void;
	onShutdown: () => void;
	onRestart: () => void;
	onSleep: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		ref.current?.querySelector('button')?.focus();
		const onDown = (e: PointerEvent) => {
			const t = e.target as HTMLElement;
			if (!ref.current?.contains(t) && !t.closest('.start-power')) onClose();
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	}, [onClose]);

	return (
		<div ref={ref} className='power-menu' role='menu' aria-label='Power'>
			<button type='button' role='menuitem' onClick={onSleep}>
				<LiMoon size={16} aria-hidden='true' /> Sleep
			</button>
			<button type='button' role='menuitem' onClick={onRestart}>
				<RotateCw size={16} aria-hidden='true' /> Restart
			</button>
			<button type='button' role='menuitem' onClick={onShutdown}>
				<LiPower size={16} aria-hidden='true' /> Shut down
			</button>
			<span className='power-sep' role='separator' />
			<ModeLink href='/' role='menuitem'>
				<LogOut size={16} aria-hidden='true' /> Back to the portfolio
			</ModeLink>
		</div>
	);
}
