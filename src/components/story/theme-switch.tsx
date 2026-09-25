'use client';

import type { ReactNode } from 'react';
import { useTheme } from '@/components/theme-provider';

/**
 * The story's light/dark switch — one of its few interactive islands.
 *
 * The two glyphs arrive as props, rendered on the server, so the icon module
 * stays out of the client bundle for the sake of two paths.
 *
 * Before hydration it assumes dark, because that is what the story is until a
 * visitor says otherwise; the label the server writes and the one the client
 * first renders therefore agree. Hidden with scripting off (`sy-js`): a
 * switch that cannot switch anything should not be there.
 */
export default function ThemeSwitch({ sun, moon }: { sun: ReactNode; moon: ReactNode }) {
	const { theme, toggle, mounted } = useTheme();
	const dark = mounted ? theme === 'dark' : true;
	return (
		<button
			type='button'
			className='sy-icon-btn sy-js'
			aria-label={dark ? 'Switch to the light theme' : 'Switch to the dark theme'}
			onClick={toggle}>
			{dark ? sun : moon}
		</button>
	);
}
