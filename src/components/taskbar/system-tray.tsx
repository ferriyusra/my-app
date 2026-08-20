'use client';

import {
	Battery,
	BatteryCharging,
	BatteryFull,
	Bell,
	ChevronUp,
	Volume1,
	Volume2,
	VolumeX,
	Wifi,
	WifiOff,
} from 'lucide-react';
import { useShell } from '@/context/shell-context';
import { useSystemStatus } from '@/hooks/use-system-status';
import { useClock } from '@/hooks/use-clock';

/**
 * The right end of the taskbar: hidden-icons chevron, the grouped
 * network/sound/battery button that opens Quick Settings, the clock that
 * opens the notification centre, and the "show desktop" sliver at the very
 * edge — all four of the things Windows 11 puts there.
 */
export default function SystemTray({ onShowDesktop }: { onShowDesktop: () => void }) {
	const { flyout, toggleFlyout, sound, volume, notifications } = useShell();
	const { online, battery, charging } = useSystemStatus();
	const { time, date } = useClock();

	const pct = battery === null ? null : Math.round(battery * 100);
	const BatteryGlyph = charging
		? BatteryCharging
		: pct !== null && pct < 25
			? Battery
			: BatteryFull;
	const VolumeGlyph = !sound || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

	return (
		<div className='taskbar-right'>
			<button
				type='button'
				className='tb-tray tb-chevron'
				aria-label='Show hidden icons'
				onClick={() => toggleFlyout('quick')}>
				<ChevronUp size={14} aria-hidden='true' />
			</button>

			<button
				type='button'
				className='tb-tray tb-tray-group'
				aria-label={`Network, sound and battery${
					pct !== null ? ` — battery ${pct}%` : ''
				}`}
				aria-expanded={flyout === 'quick'}
				data-active={flyout === 'quick' || undefined}
				onClick={() => toggleFlyout('quick')}>
				{online ? (
					<Wifi size={15} aria-hidden='true' />
				) : (
					<WifiOff size={15} aria-hidden='true' />
				)}
				<VolumeGlyph size={15} aria-hidden='true' />
				<BatteryGlyph size={17} aria-hidden='true' />
			</button>

			<button
				type='button'
				className='tb-tray tb-clock'
				aria-label='Notifications and calendar'
				aria-expanded={flyout === 'notifications'}
				data-active={flyout === 'notifications' || undefined}
				onClick={() => toggleFlyout('notifications')}
				suppressHydrationWarning>
				<span>{time}</span>
				<span>{date}</span>
			</button>

			<span className='tb-bell' aria-hidden='true' data-has={notifications.length > 0 || undefined}>
				<Bell size={14} />
			</span>

			{/* Windows keeps a sliver at the far edge that minimises everything. */}
			<button
				type='button'
				className='tb-showdesktop'
				aria-label='Show desktop'
				title='Show desktop'
				onClick={onShowDesktop}
			/>
		</div>
	);
}
