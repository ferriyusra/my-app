'use client';

import { useEffect, useRef } from 'react';
import { Moon, Power, RotateCw } from 'lucide-react';

/**
 * The little sheet that flies up from Start's power button. Sleep and Restart
 * both do something visible rather than sitting inert: sleep blanks the
 * screen, restart replays the boot.
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
				<Moon size={16} aria-hidden='true' /> Sleep
			</button>
			<button type='button' role='menuitem' onClick={onRestart}>
				<RotateCw size={16} aria-hidden='true' /> Restart
			</button>
			<button type='button' role='menuitem' onClick={onShutdown}>
				<Power size={16} aria-hidden='true' /> Shut down
			</button>
		</div>
	);
}
