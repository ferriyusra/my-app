import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bootScript } from './boot.ts';
import { DEFAULT_WALLPAPER } from './shell-defaults.ts';

/**
 * Runs the real boot string against stand-ins for the four browser globals it
 * touches, and reports what it did to <html>.
 *
 * The script is the one piece of this site that runs before anything can catch
 * it, and a mistake in it shows up as the wrong page on a phone or a wallpaper
 * that can inject CSS — so it is executed here, not just pattern-matched.
 */
function boot(
	path: string,
	{
		search = '',
		wide = true,
		darkOs = false,
		stored = {} as Record<string, string>,
		storageThrows = false,
	} = {},
) {
	const attrs: Record<string, string> = {};
	const style: Record<string, string> = {};
	let replaced: string | null = null;

	const documentElement = {
		setAttribute: (k: string, v: string) => {
			attrs[k] = v;
		},
		style: {
			setProperty: (k: string, v: string) => {
				style[k] = v;
			},
		},
	};
	const localStorage = {
		getItem: (k: string) => {
			if (storageThrows) throw new Error('SecurityError');
			return stored[k] ?? null;
		},
	};
	const matchMedia = (q: string) => ({
		matches: q.includes('min-width') ? wide : q.includes('dark') ? darkOs : false,
	});
	const location = {
		pathname: path,
		search,
		replace: (url: string) => {
			replaced = url;
		},
	};

	new Function('document', 'localStorage', 'matchMedia', 'location', bootScript())(
		{ documentElement },
		localStorage,
		matchMedia,
		location,
	);
	return { attrs, style, replaced: replaced as string | null };
}

test('a wide /desktop gets the shell, its accent and the default wallpaper', () => {
	const { attrs, style, replaced } = boot('/desktop');
	assert.equal(replaced, null);
	assert.equal(attrs['data-shell'], 'desktop');
	assert.equal(attrs['data-accent'], 'blue');
	assert.ok(DEFAULT_WALLPAPER.startsWith('custom:'), 'the test assumes a custom default');
	assert.equal(attrs['data-wallpaper'], 'custom');
	assert.equal(
		style['--wp-custom'],
		`url("/background/${encodeURIComponent(DEFAULT_WALLPAPER.slice(7))}")`,
	);
});

test('a trailing slash is still the desktop', () => {
	assert.equal(boot('/desktop/').attrs['data-shell'], 'desktop');
});

test('a narrow /desktop hands over to the story, at the section the app lives in', () => {
	assert.equal(boot('/desktop', { wide: false, search: '?app=experience' }).replaced, '/#career');
	assert.equal(boot('/desktop', { wide: false, search: '?app=recycle' }).replaced, '/#decisions');
});

test('an app that only exists on the desktop sends a phone to the top of the story', () => {
	assert.equal(boot('/desktop', { wide: false, search: '?app=media' }).replaced, '/');
	assert.equal(boot('/desktop', { wide: false }).replaced, '/');
});

test('a pasted ?app= cannot reach up the prototype chain', () => {
	for (const app of ['__proto__', 'constructor', 'toString']) {
		assert.equal(boot('/desktop', { wide: false, search: `?app=${app}` }).replaced, '/');
	}
});

test('a narrow /desktop never shows the black holding screen', () => {
	assert.notEqual(boot('/desktop', { wide: false }).attrs['data-shell'], 'desktop');
});

test('a stored wallpaper name that could close the CSS quote is refused', () => {
	const { attrs, style } = boot('/desktop', {
		stored: { 'shell:wallpaper': 'custom:evil")}body{display:none' },
	});
	assert.equal(attrs['data-wallpaper'], 'bloom');
	assert.equal(style['--wp-custom'], undefined);
});

test('brightness is clamped, so a stored value cannot black the screen out', () => {
	assert.equal(boot('/desktop', { stored: { 'shell:brightness': '0' } }).style['--screen-dim'], '0.65');
	assert.equal(boot('/desktop', { stored: { 'shell:brightness': '1' } }).style['--screen-dim'], '0');
});

test('the story never raises the desktop, whatever the width', () => {
	for (const wide of [true, false]) {
		const { attrs, replaced } = boot('/', { wide });
		assert.notEqual(attrs['data-shell'], 'desktop');
		assert.equal(replaced, null);
	}
});

test('a stored theme wins on both routes', () => {
	assert.equal(boot('/', { stored: { theme: 'dark' } }).attrs['data-theme'], 'dark');
	assert.equal(boot('/desktop', { stored: { theme: 'dark' } }).attrs['data-theme'], 'dark');
	assert.equal(boot('/desktop', { stored: { theme: 'light' }, darkOs: true }).attrs['data-theme'], undefined);
});

test('storage that throws still leaves a working page', () => {
	const { attrs } = boot('/desktop', { storageThrows: true });
	assert.equal(attrs['data-shell'], 'desktop');
	assert.equal(attrs['data-accent'], 'blue');
});
