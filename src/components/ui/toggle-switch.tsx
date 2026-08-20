'use client';

import { useId } from 'react';

/**
 * The Fluent toggle: a pill that slides its knob and fills with the accent
 * when on. Backed by a real checkbox so it announces state and takes Space.
 */
export default function ToggleSwitch({
	checked,
	onChange,
	label,
	description,
	disabled,
}: {
	checked: boolean;
	onChange: (next: boolean) => void;
	label: string;
	description?: string;
	/** Set while the change is still playing out and must not be re-triggered. */
	disabled?: boolean;
}) {
	const id = useId();
	return (
		<div className='sw-row' data-disabled={disabled || undefined}>
			<span className='sw-text'>
				<label htmlFor={id}>{label}</label>
				{description && <small>{description}</small>}
			</span>
			<input
				id={id}
				type='checkbox'
				role='switch'
				className='sw-input'
				checked={checked}
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<span className='sw-track' aria-hidden='true'>
				<span className='sw-knob' />
			</span>
		</div>
	);
}
