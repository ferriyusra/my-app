/**
 * A Fluent progress bar used as a read-only meter.
 *
 * `value` and `max` are the real quantity — years of hands-on use, not a
 * self-scored percentage — so the accessible name says what the bar measures
 * rather than leaving a screen reader to announce a bare number.
 */
export default function Meter({
	value,
	max,
	label,
	unit,
}: {
	value: number;
	max: number;
	label: string;
	unit: string;
}) {
	const pct = Math.max(4, Math.min(100, Math.round((value / max) * 100)));
	return (
		<span
			className='meter'
			role='meter'
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuetext={`${value} ${unit}`}
			aria-label={label}>
			<span className='meter-fill' style={{ width: `${pct}%` }} />
		</span>
	);
}
