'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

/**
 * The one interactive island in the server-rendered document.
 *
 * Everything else on that page is static HTML so it survives without
 * JavaScript; the theme switch cannot, so it is scoped to itself rather than
 * turning the whole document into a client component.
 */
export default function ThemeToggle() {
	const { theme, toggle, mounted } = useTheme();
	const dark = mounted && theme === 'dark';
	return (
		<button
			type='button'
			className='mb-theme'
			aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
			onClick={toggle}>
			{mounted ? dark ? <Sun size={17} /> : <Moon size={17} /> : null}
		</button>
	);
}
