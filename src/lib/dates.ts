/**
 * Month arithmetic and labels for the page.
 *
 * Every date in `src/data` is a 'YYYY-MM' string, and the page never prints a
 * range with a dash between its ends: "Jul 2025 to now" reads the same and is
 * not a typographic template. The `period` strings in experience.ts stay as
 * they are (a test pins the case study's period to its role's); the page
 * renders from the ISO months instead.
 */

const SHORT = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });
const LONG = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

/** '2025-07' → a Date on the first of that month. */
export function monthDate(iso: string): Date {
	const [y, m] = iso.split('-').map(Number);
	return new Date(y, m - 1, 1);
}

/** '2025-07' → 'Jul 2025'. */
export function monthShort(iso: string): string {
	return SHORT.format(monthDate(iso)).replace('Sept', 'Sep');
}

/** '2025-07' → 'July 2025'. */
export function monthLong(iso: string): string {
	return LONG.format(monthDate(iso));
}

/** A Date → its 'YYYY-MM'. */
export function isoMonth(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Whole months from a to b, counting both ends: Jul to Jul is 1. */
export function monthsInclusive(a: string, b: string): number {
	const [ay, am] = a.split('-').map(Number);
	const [by, bm] = b.split('-').map(Number);
	return (by - ay) * 12 + (bm - am) + 1;
}

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** 5 → 'Five', for a head that opens on a count; past twelve, the numeral. */
export function countWord(n: number): string {
	return WORDS[n] ?? String(n);
}

/**
 * A role's dates as one phrase: 'Jul 2025 to now', 'Jan 2024 to Mar 2025',
 * and within one year 'Jul to Dec 2023', so a six-month role never reads as
 * '2023 to 2023'.
 */
export function rangeLabel(startISO: string, endISO: string | null): string {
	if (!endISO) return `${monthShort(startISO)} to now`;
	if (startISO.slice(0, 4) === endISO.slice(0, 4)) {
		const month = (iso: string) => monthShort(iso).split(' ')[0];
		return `${month(startISO)} to ${month(endISO)} ${endISO.slice(0, 4)}`;
	}
	return `${monthShort(startISO)} to ${monthShort(endISO)}`;
}
