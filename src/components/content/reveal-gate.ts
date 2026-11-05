/**
 * The inline script `layout.tsx` puts in <head>, run before the first paint.
 * It marks <html data-js="pending"> only where the reveal can run and motion
 * is allowed, so blocks start hidden on exactly those pages and nowhere else:
 * without script, under reduced motion and in print, the page is already
 * finished. Kept out of `reveal.tsx` because a server component that imports
 * from a 'use client' module gets a client reference, not the string.
 */
export const REVEAL_GATE =
	"try{if('IntersectionObserver'in window&&matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.dataset.js='pending'}catch(e){}";

/** In step with the `3s` failsafe in globals.css. */
export const FAILSAFE_MS = 3000;
