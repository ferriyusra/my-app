import type { AnchorHTMLAttributes } from 'react';

/**
 * A link between the story and the desktop — always a plain `<a>`, never
 * `next/link`.
 *
 * They are two modes rather than two pages of one app. Each sets attributes on
 * <html> in the inline boot script, which only runs when a document loads; and
 * Next never unloads a route's stylesheet on a client-side navigation, so a
 * soft hop would arrive with the wrong attributes and the other mode's CSS still
 * applied. A full load also lets the browser play the cross-document view
 * transition between them.
 *
 * No `'use client'`: it is a link, and it works with scripting off.
 */
export type ModeHref = '/' | `/#${string}` | '/desktop' | `/desktop?app=${string}`;

export default function ModeLink({
	href,
	...rest
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: ModeHref }) {
	return <a href={href} {...rest} />;
}
