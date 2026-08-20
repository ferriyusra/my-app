'use client';

import { useEffect, useState } from 'react';

export type Clock = {
	/** 12-hour time, as the taskbar shows it. */
	time: string;
	/** Short date, dd/mm/yyyy — the Windows default outside the US. */
	date: string;
	/** Long date for the notification centre header. */
	longDate: string;
	/** Current time in Jakarta, for the availability widget. */
	jakarta: string;
	/** Live Date, for the calendar grid. */
	now: Date | null;
};

const EMPTY: Clock = { time: '', date: '', longDate: '', jakarta: '', now: null };

/**
 * A shared ticking clock.
 *
 * Renders empty on the server and on the first client pass so the markup
 * matches; the first tick lands in an effect, after hydration. Consumers pair
 * this with `suppressHydrationWarning` on the text node.
 */
export function useClock(intervalMs = 15_000): Clock {
	const [clock, setClock] = useState<Clock>(EMPTY);

	useEffect(() => {
		const tick = () => {
			const d = new Date();
			setClock({
				time: d.toLocaleTimeString('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
				}),
				date: d.toLocaleDateString('en-GB'),
				longDate: d.toLocaleDateString('en-GB', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				}),
				jakarta: d.toLocaleTimeString('en-GB', {
					timeZone: 'Asia/Jakarta',
					hour: '2-digit',
					minute: '2-digit',
				}),
				now: d,
			});
		};
		tick();
		const t = setInterval(tick, intervalMs);
		return () => clearInterval(t);
	}, [intervalMs]);

	return clock;
}
