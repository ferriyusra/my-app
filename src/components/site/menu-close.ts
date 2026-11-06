/**
 * The inline script `layout.tsx` puts in <head> beside the reveal gate.
 *
 * A popover closes itself on a click outside it and on Escape, but not when a
 * link inside it is followed. On a phone the menu sheet would stay open over
 * the section its link just scrolled to, so following any link inside an open
 * popover closes that popover first. One delegated listener, no React, so it
 * also covers the next page after a client-side navigation. Without script
 * the sheet still closes on a tap outside it.
 */
export const MENU_CLOSE =
	"document.addEventListener('click',function(e){var t=e.target;var a=t&&t.closest&&t.closest('[popover] a[href]');if(!a)return;var p=a.closest('[popover]');try{p.hidePopover()}catch(_){}})";
