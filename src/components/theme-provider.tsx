'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
	theme: 'light',
	toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem('theme') as Theme | null;
		const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
		const initial = stored || preferred;
		setTheme(initial);
		document.documentElement.setAttribute('data-theme', initial);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme, mounted]);

	const toggle = useCallback(
		() => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
		[],
	);

	return (
		<ThemeContext.Provider value={{ theme, toggle }}>
			{children}
		</ThemeContext.Provider>
	);
}
