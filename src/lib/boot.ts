/**
 * The inline script that runs in <head>, before first paint.
 *
 * Everything the stylesheet keys off is a plain attribute on <html>, so setting
 * it here, ahead of hydration, is what stops a stored dark theme flashing light
 * or a wide screen flashing the wrong page. It is a string rather than a module
 * because nothing has loaded yet when it runs.
 *
 * It branches on the path, because the two routes want different things:
 *
 * - `/desktop` is the Windows shell. It gets the theme (stored, or the system's),
 *   the accent, the wallpaper, the brightness and `data-shell="desktop"`, which
 *   brings up the black holding screen the boot sequence plays over. Below
 *   `DESKTOP_MIN_WIDTH` it does not try: it replaces itself with the story, at
 *   the section that holds whatever `?app=` asked for.
 * - Everything else is the story, which only needs the theme.
 *
 * A custom wallpaper is a filename rather than a fixed id, and it reaches a CSS
 * `url()`, so it is pattern-checked before it is used — anything that could
 * close the quote is refused and the drawn default stands. This is one of the
 * three checks CLAUDE.md names; the other two are the directory listing and the
 * provider.
 *
 * Kept free of `@/` value imports so `boot.test.ts` can run the string itself.
 */

import { DEFAULT_WALLPAPER, DESKTOP_MIN_WIDTH } from './shell-defaults.ts';
import { APP_SECTION } from './story-sections.ts';

export function bootScript(): string {
	const sections = JSON.stringify(APP_SECTION);
	const wallpaper = JSON.stringify(DEFAULT_WALLPAPER);

	return [
		'try{',
		'var d=document.documentElement,',
		'g=function(k,f){try{return localStorage.getItem(k)||f}catch(e){return f}},',
		"t=g('theme',null),",
		"dark=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);",
		"if(/^\\/desktop\\/?$/.test(location.pathname)){",
		`if(!matchMedia('(min-width: ${DESKTOP_MIN_WIDTH}px)').matches){`,
		`var a=new URLSearchParams(location.search).get('app'),S=${sections},`,
		's=a&&Object.prototype.hasOwnProperty.call(S,a)?S[a]:null;',
		/* Keeps the black holding screen away for the moment before the
		   replacement lands. */
		"d.setAttribute('data-shell','document');",
		"location.replace('/'+(s?'#'+s:''));",
		'}else{',
		"if(dark)d.setAttribute('data-theme','dark');",
		"d.setAttribute('data-accent',g('shell:accent','blue'));",
		`var w=g('shell:wallpaper',${wallpaper}),cw=w.indexOf('custom:')===0?w.slice(7):'';`,
		"if(cw&&/^[A-Za-z0-9][\\w.-]*$/.test(cw)){d.setAttribute('data-wallpaper','custom');d.style.setProperty('--wp-custom','url(\"/background/'+encodeURIComponent(cw)+'\")');}",
		"else d.setAttribute('data-wallpaper',cw?'bloom':w);",
		"d.setAttribute('data-shell','desktop');",
		"var b=g('shell:brightness','1');if(b)d.style.setProperty('--screen-dim',String(Math.max(0,Math.min(0.65,1-parseFloat(b)||0))));",
		'}',
		'}else{',
		"if(dark)d.setAttribute('data-theme','dark');",
		"d.setAttribute('data-shell','document');",
		'}',
		'}catch(e){}',
	].join('');
}
