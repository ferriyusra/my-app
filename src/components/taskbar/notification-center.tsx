'use client';

import { useMemo } from 'react';
import { LiBell } from '@/components/icons/line-icons';
import { useShell } from '@/context/shell-context';
import { useWindowManager } from '@/hooks/use-window-manager';
import { APP_BY_ID } from '@/components/apps/registry';
import AppTile from '@/components/ui/app-tile';
import Flyout from '@/components/ui/flyout';
import { useClock } from '@/hooks/use-clock';
import { X } from 'lucide-react';

const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** Days of the current month, padded so the 1st lands under its weekday. */
function monthGrid(now: Date) {
	const first = new Date(now.getFullYear(), now.getMonth(), 1);
	const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	/* getDay() is Sunday-first; Windows in en-GB starts the week on Monday. */
	const lead = (first.getDay() + 6) % 7;
	return [
		...Array.from({ length: lead }, () => null),
		...Array.from({ length: days }, (_, i) => i + 1),
	];
}

/** "3 min ago" — relative stamps, as the notification centre uses. */
function ago(at: number, now: number) {
	const s = Math.max(0, Math.round((now - at) / 1000));
	if (s < 60) return 'just now';
	const m = Math.round(s / 60);
	if (m < 60) return `${m} min ago`;
	return `${Math.round(m / 60)} h ago`;
}

/**
 * The panel behind the taskbar clock: notifications on top, this month's
 * calendar underneath.
 */
export default function NotificationCenter({ onClose }: { onClose: () => void }) {
	const { notifications, clearNotifications } = useShell();
	const { launch } = useWindowManager();
	const { longDate, now } = useClock(30_000);

	const cells = useMemo(() => (now ? monthGrid(now) : []), [now]);
	const today = now?.getDate();
	const stamp = now?.getTime() ?? 0;

	return (
		<Flyout
			className='nc'
			label='Notifications and calendar'
			anchor='right'
			onClose={onClose}
			ignoreSelector='.tb-clock'>
			<div className='nc-head'>
				<h2>Notifications</h2>
				{notifications.length > 0 && (
					<button type='button' className='nc-clear' onClick={clearNotifications}>
						Clear all
					</button>
				)}
			</div>

			{notifications.length === 0 ? (
				<p className='nc-empty'>
					<LiBell size={22} aria-hidden='true' />
					No new notifications
				</p>
			) : (
				<ul className='nc-list'>
					{notifications.map((n) => {
						const app = n.app === 'system' ? null : APP_BY_ID[n.app];
						return (
							<li key={n.id} className='nc-item'>
								<span className='nc-item-icon' aria-hidden='true'>
									{app ? <AppTile tile={app.tile} size={22} /> : <LiBell size={18} />}
								</span>
								<span className='nc-item-text'>
									<strong>{n.title}</strong>
									<span>{n.body}</span>
									{n.action && (
										<button
											type='button'
											className='nc-action'
											onClick={() => {
												launch(n.action!.appId);
												onClose();
											}}>
											{n.action.label}
										</button>
									)}
								</span>
								<time className='nc-item-time' dateTime={new Date(n.at).toISOString()}>
									{ago(n.at, stamp)}
								</time>
							</li>
						);
					})}
				</ul>
			)}

			<div className='nc-cal' suppressHydrationWarning>
				<p className='nc-cal-head'>{longDate}</p>
				<div className='nc-cal-grid' role='presentation'>
					{WEEK.map((d) => (
						<span key={d} className='nc-cal-dow'>
							{d}
						</span>
					))}
					{cells.map((d, i) => (
						<span
							key={i}
							className='nc-cal-day'
							data-today={d === today || undefined}
							aria-hidden={d === null || undefined}>
							{d ?? ''}
						</span>
					))}
				</div>
			</div>
		</Flyout>
	);
}

/** The transient toast Windows slides in above the tray. */
export function Toast() {
	const { toast, dismissToast } = useShell();
	const { launch } = useWindowManager();
	if (!toast) return null;
	const app = toast.app === 'system' ? null : APP_BY_ID[toast.app];

	return (
		<div className='toast' role='status' aria-live='polite'>
			<span className='toast-icon' aria-hidden='true'>
				{app ? <AppTile tile={app.tile} size={26} /> : <LiBell size={20} />}
			</span>
			<span className='toast-text'>
				<strong>{toast.title}</strong>
				<span>{toast.body}</span>
				{toast.action && (
					<button
						type='button'
						className='toast-action'
						onClick={() => {
							launch(toast.action!.appId);
							dismissToast();
						}}>
						{toast.action.label}
					</button>
				)}
			</span>
			<button
				type='button'
				className='toast-close'
				aria-label='Dismiss notification'
				onClick={dismissToast}>
				<X size={14} aria-hidden='true' />
			</button>
		</div>
	);
}
