'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
	useSyncExternalStore,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeValue = {
	theme: Theme;
	toggle: () => void;
	/** False until hydration completes — gate theme-dependent markup on this. */
	mounted: boolean;
};

const ThemeContext = createContext<ThemeValue>({
	theme: 'light',
	toggle: () => {},
	mounted: false,
});

export const useTheme = () => useContext(ThemeContext);

const noopSubscribe = () => () => {};

function readTheme(): Theme {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.getAttribute('data-theme') === 'dark'
		? 'dark'
		: 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	/* The inline <head> script applies data-theme before React hydrates, so
	   reading it here gets the right value on the first client render — no
	   flash, and no setState-in-effect cascade. */
	const [theme, setTheme] = useState<Theme>(readTheme);

	/* Canonical "has hydrated" signal. Server snapshot is false, client is
	   true, so consumers can avoid rendering theme-dependent markup during
	   hydration without an effect writing state. */
	const mounted = useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme, mounted]);

	/* Stored only when the visitor chooses, never on mount. Writing it on mount
	   saved whatever the page defaulted to as if it were a choice: the story
	   defaults to dark and the desktop to the system setting, and one visit to
	   either would have pinned the other to it. */
	const toggle = useCallback(() => {
		const next: Theme = theme === 'light' ? 'dark' : 'light';
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Private mode / storage disabled — theme still applies for this session.
		}
		setTheme(next);
	}, [theme]);

	const value = useMemo(
		() => ({ theme, toggle, mounted }),
		[theme, toggle, mounted],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
