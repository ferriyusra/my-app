'use client';

import { useShell } from '@/context/shell-context';

/**
 * The notice an unactivated copy of Windows leaves in the corner.
 *
 * Two lines of pale grey over everything, drawn above the windows rather than
 * on the desktop behind them — being impossible to cover is the whole
 * character of it.
 *
 * Unlike the real one it can be dismissed, because its own second line says
 * how: Settings ▸ System ▸ Activation actually activates it. A portfolio that
 * permanently blocks a corner of itself for a joke is a worse portfolio, and
 * making the instruction lead somewhere is funnier than making it a dead end.
 */
export default function ActivateWatermark() {
	const { activated } = useShell();
	if (activated) return null;

	return (
		<div className='activate' aria-hidden='true'>
			<p className='activate-head'>Activate Windows</p>
			<p className='activate-sub'>Go to Settings to activate Windows.</p>
		</div>
	);
}
