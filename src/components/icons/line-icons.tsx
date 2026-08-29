/**
 * LineIcons, vendored as components.
 *
 * Generated from the official `lineicons-react` package, which cannot be used
 * as a dependency here: it bundles its own React 18, so every element it makes
 * carries `Symbol(react.element)` while React 19 expects
 * `Symbol(react.transitional.element)` — the tree rejects them outright. The
 * community `react-lineicons` is worse: it reaches for `document` at import
 * time, so it cannot be imported by a server component at all.
 *
 * Taking the artwork and leaving the packaging fixes both, and adds two things
 * neither package offered: every fill is `currentColor`, so an icon follows the
 * theme and accent like the rest of the shell, and only the icons actually used
 * are shipped.
 *
 * Do not hand-edit. `scratchpad/gen/line-icons.mjs` emits exactly this shape
 * from the package; its header carries the three commands. The package is
 * installed with --no-save for the length of a regeneration and removed
 * again, so it never becomes a dependency of the build.
 */

import type * as React from 'react';

export type IconProps = {
	size?: number;
	className?: string;
	/** Accepted so a LineIcon can stand in wherever a Lucide glyph did. */
	color?: string;
	strokeWidth?: number;
};

/**
 * The slot type for "an icon component", satisfied by both families.
 *
 * Lucide's own `LucideIcon` is a `ForwardRefExoticComponent`, so a plain
 * function component fails it. Anything that only ever renders an icon should
 * ask for this instead.
 */
export type IconLike = React.ComponentType<{
	size?: number;
	className?: string;
	color?: string;
	strokeWidth?: number;
}>;


/** LineIcons `ArrowLeft`. */
export function LiArrowLeft({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M3.578 12.498c0 .193.073.385.22.532l5.996 6a.75.75 0 0 0 1.06-1.06l-4.72-4.724H20.33a.75.75 0 0 0 0-1.5H6.143l4.713-4.716a.75.75 0 1 0-1.061-1.06l-5.95 5.953a.748.748 0 0 0-.266.573v.002Z"></path>
		</svg>
	);
}

/** LineIcons `ArrowRight`. */
export function LiArrowRight({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M21.08 12.519a.747.747 0 0 1-.22.51l-5.996 6.001a.75.75 0 0 1-1.061-1.06l4.72-4.724H4.328a.75.75 0 0 1 0-1.5h14.188L13.803 7.03a.75.75 0 1 1 1.06-1.06l5.95 5.953a.748.748 0 0 1 .266.596Z"></path>
		</svg>
	);
}

/** LineIcons `ArrowUpward`. */
export function LiArrowUp({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M11.755 4.013a.748.748 0 0 1 .57-.263h.001c.193 0 .385.073.532.22l6 5.995a.75.75 0 0 1-1.06 1.062l-4.723-4.72V20.5a.75.75 0 0 1-1.5 0V6.313l-4.717 4.714a.75.75 0 0 1-1.06-1.062l5.957-5.952Z"></path>
		</svg>
	);
}

/** LineIcons `Bell1`. */
export function LiBell({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12.002 2.001a.75.75 0 0 1 .75.75v.787a7.5 7.5 0 0 1 6.75 7.463v3.114l.692 1.846A2.25 2.25 0 0 1 18.087 19h-3.024a3.063 3.063 0 0 1-6.126 0h-3.02a2.25 2.25 0 0 1-2.108-3.04l.693-1.846v-3.114a7.5 7.5 0 0 1 6.75-7.463v-.787a.75.75 0 0 1 .75-.75Zm-1.565 17a1.563 1.563 0 0 0 3.125 0h-3.124Zm-4.435-8v3.116c0 .178-.033.356-.095.523l-.693 1.848a.75.75 0 0 0 .702 1.013h12.171a.75.75 0 0 0 .702-1.013l-.693-1.848a1.489 1.489 0 0 1-.094-.523V11a6 6 0 1 0-12 0Z"></path>
		</svg>
	);
}

/** LineIcons `Briefcase1`. */
export function LiBriefcase({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M10.023 3a2.25 2.25 0 0 0-2.25 2.25V6h-3a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h14.5a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 19.274 6h-3v-.75A2.25 2.25 0 0 0 14.023 3h-4Zm4.75 3h-5.5v-.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75V6Zm-10 1.5h14.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-14.5a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75Z"></path>
		</svg>
	);
}

/** LineIcons `Bug1`. */
export function LiBug({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M9.134 2.08a.75.75 0 0 1 1.006.335l.542 1.085h2.665c.052 0 .104.002.156.006l.545-1.091a.75.75 0 0 1 1.342.67l-.51 1.019c.194.18.357.396.479.64l.879 1.758a2.25 2.25 0 0 1 2.16 2.248v.732l1.398-.446a.75.75 0 1 1 .456 1.429l-1.853.591v2.07h1.625a.75.75 0 1 1 0 1.5h-1.625v1c0 .354-.03.702-.085 1.04l1.938.62a.75.75 0 1 1-.456 1.429l-1.9-.607a6.377 6.377 0 0 1-11.746 0l-1.898.607a.75.75 0 1 1-.457-1.43l1.938-.618a6.42 6.42 0 0 1-.084-1.042v-1H4.024a.75.75 0 0 1 0-1.5h1.625v-2.069l-1.854-.591a.75.75 0 1 1 .457-1.43l1.397.447V8.75a2.25 2.25 0 0 1 2.16-2.248l.88-1.758c.141-.285.34-.53.575-.726l-.466-.932a.75.75 0 0 1 .336-1.007ZM14.56 6.5l-.543-1.085a.75.75 0 0 0-.67-.415H10.7a.75.75 0 0 0-.671.415L9.487 6.5h5.073ZM7.9 8a.75.75 0 0 0-.75.75v6.875a4.875 4.875 0 1 0 9.75 0V8.75a.75.75 0 0 0-.75-.75h-8.25Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Check`. */
export function LiBulb({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M9.063 18.045c-.046-1.131-.794-2.194-1.803-3.18a7.5 7.5 0 1 1 10.48 0c-1.041 1.017-1.805 2.117-1.805 3.29v1.595a2.25 2.25 0 0 1-2.25 2.25h-2.373a2.25 2.25 0 0 1-2.25-2.25v-1.705ZM6.5 9.5a5.98 5.98 0 0 0 1.808 4.293c.741.724 1.512 1.633 1.933 2.707h4.518c.421-1.074 1.192-1.984 1.933-2.707A6 6 0 1 0 6.5 9.5Zm4.063 8.713v1.537c0 .414.335.75.75.75h2.372a.75.75 0 0 0 .75-.75V18h-3.873v.017a4.17 4.17 0 0 1 0 .196ZM1.75 9.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM4.215 3.85a.75.75 0 1 0-.75 1.3l.866.5a.75.75 0 1 0 .75-1.3l-.866-.5ZM3.19 14.875a.75.75 0 0 1 .275-1.024l.866-.5a.75.75 0 0 1 .75 1.298l-.866.5a.75.75 0 0 1-1.025-.274ZM21.5 8.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1ZM19.645 13.625a.75.75 0 0 1 1.025-.274l.866.5a.75.75 0 1 1-.75 1.298l-.866-.5a.75.75 0 0 1-.275-1.024ZM19.92 4.35a.75.75 0 0 0 .75 1.3l.866-.5a.75.75 0 1 0-.75-1.3l-.866.5Z"></path>
		</svg>
	);
}

export function LiCheck({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M19.28 6.763a.75.75 0 0 1 0 1.06L9.863 17.24a.75.75 0 0 1-1.06 0L4.72 13.157a.75.75 0 0 1 1.06-1.06l3.553 3.552 8.887-8.886a.75.75 0 0 1 1.06 0Z"></path>
		</svg>
	);
}

/** LineIcons `CheckCircle1`. */
export function LiCheckCircle({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M15.507 10.524a.75.75 0 1 0-1.06-1.06l-3.482 3.481-1.411-1.41a.75.75 0 0 0-1.061 1.06l1.942 1.941a.75.75 0 0 0 1.06 0l4.012-4.011Z"></path><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `ChevronDown`. */
export function LiChevronDown({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M5.548 9.095a.75.75 0 0 1 1.06 0l5.72 5.72 5.72-5.72a.75.75 0 0 1 1.06 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0l-6.25-6.25a.75.75 0 0 1 0-1.06Z"></path>
		</svg>
	);
}

/** LineIcons `ChevronUp`. */
export function LiChevronUp({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M19.108 14.905a.75.75 0 0 1-1.06 0l-5.72-5.72-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06Z"></path>
		</svg>
	);
}

/** LineIcons `Cloud2`. */
export function LiCloud({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M6.387 9.984a5.615 5.615 0 0 1 10.918-1.715 5.658 5.658 0 0 1-.961 11.231H6.766a4.766 4.766 0 0 1-.38-9.516ZM12 6a4.115 4.115 0 0 0-4.116 4.115v.604a.75.75 0 0 1-.75.75h-.37a3.266 3.266 0 1 0 0 6.531h9.579a4.156 4.156 0 0 0 .324-8.3.75.75 0 0 1-.67-.57A4.117 4.117 0 0 0 12 6Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Database2`. */
export function LiDatabase({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M5.286 3.713c-.433.38-.786.897-.786 1.537v13.5c0 .64.353 1.158.786 1.537.435.381 1.021.69 1.68.934 1.325.49 3.105.779 5.034.779 1.93 0 3.709-.288 5.034-.779.659-.244 1.245-.553 1.68-.934.433-.38.786-.897.786-1.537V5.25c0-.64-.353-1.158-.786-1.537-.435-.381-1.021-.69-1.68-.934C15.709 2.289 13.928 2 12 2c-1.93 0-3.709.288-5.033.779-.66.244-1.246.553-1.68.934Zm.989 1.128c.248-.217.65-.447 1.213-.655C8.606 3.77 10.2 3.5 12 3.5c1.799 0 3.394.271 4.512.686.563.208.965.438 1.213.655.25.219.275.36.275.409 0 .05-.025.19-.274.409-.249.217-.651.447-1.213.655C15.393 6.73 13.798 7 12 7s-3.394-.271-4.512-.686c-.563-.208-.965-.438-1.213-.655C6.025 5.44 6 5.299 6 5.25c0-.05.025-.19.275-.409ZM18 9.75c0 .05-.025.19-.274.409-.249.217-.651.447-1.213.655-1.119.415-2.714.686-4.513.686s-3.394-.271-4.512-.685c-.563-.209-.965-.439-1.213-.656C6.025 9.94 6 9.799 6 9.75V7.282c.294.165.62.31.967.44C8.29 8.211 10.07 8.5 12 8.5c1.93 0 3.709-.288 5.034-.779.346-.128.672-.274.966-.439V9.75ZM6 11.782c.294.165.62.31.967.44C8.29 12.711 10.07 13 12 13c1.93 0 3.709-.288 5.034-.779.346-.128.672-.274.966-.439v2.468c0 .05-.025.19-.274.409-.249.217-.651.447-1.213.655C15.393 15.73 13.798 16 12 16s-3.394-.271-4.512-.685c-.563-.209-.965-.439-1.213-.656-.25-.219-.275-.36-.275-.409v-2.468Zm0 6.968v-2.468c.294.165.62.31.967.44 1.324.49 3.104.778 5.033.778 1.93 0 3.709-.288 5.034-.779.346-.128.672-.274.966-.439v2.468c0 .05-.025.19-.274.409-.249.217-.651.447-1.213.655-1.119.415-2.714.686-4.513.686s-3.394-.271-4.512-.686c-.563-.208-.965-.438-1.213-.655-.25-.219-.275-.36-.275-.409Z"></path>
		</svg>
	);
}

/** LineIcons `Download1`. */
export function LiDownload({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12.424 16.75a.748.748 0 0 1-.548-.237l-4.61-4.607a.75.75 0 0 1 1.061-1.061l3.347 3.345V4a.75.75 0 1 1 1.5 0v10.185l3.343-3.34a.75.75 0 1 1 1.06 1.06l-4.575 4.573a.748.748 0 0 1-.578.272Z"></path><path fill="currentColor" d="M5.172 16a.75.75 0 0 0-1.5 0v2.5a2.25 2.25 0 0 0 2.25 2.25h13a2.25 2.25 0 0 0 2.25-2.25V16a.75.75 0 1 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-13a.75.75 0 0 1-.75-.75V16Z"></path>
		</svg>
	);
}

/** LineIcons `Github`. */
export function LiGithub({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12 2.249c-5.484 0-10 4.452-10 10 0 4.387 2.871 8.13 6.871 9.484.516.097.677-.226.677-.452s0-.87-.032-1.742c-2.774.645-3.355-1.355-3.355-1.355-.451-1.129-1.129-1.451-1.129-1.451-.903-.645.033-.645.033-.645 1 .032 1.548 1.032 1.548 1.032.87 1.548 2.355 1.097 2.903.806.097-.645.355-1.096.645-1.354-2.193-.226-4.548-1.097-4.548-4.904 0-1.096.42-1.967 1.032-2.645-.097-.226-.451-1.258.097-2.645 0 0 .87-.258 2.774 1.032a9.296 9.296 0 0 1 2.516-.355c.871 0 1.742.097 2.516.355 1.904-1.258 2.742-1.032 2.742-1.032.549 1.355.226 2.42.097 2.645.645.678 1.032 1.58 1.032 2.645 0 3.807-2.355 4.678-4.548 4.904.355.322.677.967.677 1.87 0 1.355-.032 2.42-.032 2.742 0 .259.194.549.678.452C19.128 20.314 22 16.604 22 12.185c-.032-5.484-4.516-9.936-10-9.936Z"></path>
		</svg>
	);
}

/** LineIcons `Home2`. */
export function LiHome({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12.45 4.903a.75.75 0 0 0-.9 0l-6.5 4.875a.75.75 0 0 0-.3.6V18.5c0 .414.336.75.75.75H9V17a3 3 0 0 1 6 0v2.25h3.5a.75.75 0 0 0 .75-.75v-8.122a.75.75 0 0 0-.3-.6l-6.5-4.875Zm-1.8-1.2c.8-.6 1.9-.6 2.7 0l6.5 4.875c.567.425.9 1.092.9 1.8V18.5a2.25 2.25 0 0 1-2.25 2.25h-4.25a.75.75 0 0 1-.75-.75v-3a1.5 1.5 0 0 0-3 0v3a.75.75 0 0 1-.75.75H5.5a2.25 2.25 0 0 1-2.25-2.25v-8.122c0-.708.333-1.375.9-1.8l6.5-4.875Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Layers1`. */
export function LiKeyboard({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M6.441 8.192a.8.8 0 1 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01ZM5.64 12.367a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM10.145 8.192a.8.8 0 0 0 0 1.6h.01a.8.8 0 1 0 0-1.6h-.01ZM9.358 12.367a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM8 14.992a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8ZM13.046 8.992a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM17.548 8.192a.8.8 0 1 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01ZM13.037 12.367a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM17.556 11.567a.8.8 0 1 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01Z"></path>
			<path fill="currentColor" fillRule="evenodd" d="M4.25 4.867A2.25 2.25 0 0 0 2 7.117v10.5a2.25 2.25 0 0 0 2.25 2.25h15.5a2.25 2.25 0 0 0 2.25-2.25v-10.5a2.25 2.25 0 0 0-2.25-2.25H4.25Zm-.75 2.25a.75.75 0 0 1 .75-.75h15.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-10.5Z" clipRule="evenodd"></path>
		</svg>
	);
}

export function LiLayers({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12.86 4.969a2.483 2.483 0 0 0-1.675 0L2.911 7.935c-1.173.42-1.173 2.079 0 2.5l8.274 2.966a2.482 2.482 0 0 0 1.676 0l8.274-2.967c1.173-.42 1.173-2.079 0-2.499l-8.274-2.966ZM11.693 6.38a.983.983 0 0 1 .663 0l7.821 2.804-7.821 2.804a.983.983 0 0 1-.664 0L3.87 9.185 11.69 6.38Z" clipRule="evenodd"></path><path fill="currentColor" d="m2.91 13.565 2.144-.769 2.223.797-3.407 1.221 7.821 2.804a.982.982 0 0 0 .664 0l7.821-2.804-3.406-1.22 2.222-.798 2.143.769c1.173.42 1.173 2.079 0 2.5l-8.274 2.965a2.482 2.482 0 0 1-1.676 0l-8.274-2.966c-1.173-.42-1.173-2.079 0-2.5Z"></path>
		</svg>
	);
}

/** LineIcons `Linkedin`. */
export function LiLinkedin({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M19.706 3H4.348c-.725 0-1.306.58-1.306 1.306v15.387c0 .697.58 1.307 1.306 1.307h15.3c.726 0 1.307-.58 1.307-1.306V4.277C21.013 3.581 20.432 3 19.707 3ZM8.355 18.3H5.713V9.735h2.642V18.3ZM7.019 8.545a1.53 1.53 0 0 1-1.538-1.539c0-.841.696-1.538 1.538-1.538.842 0 1.54.697 1.54 1.538 0 .842-.64 1.54-1.54 1.54ZM18.371 18.3h-2.642v-4.152c0-.987-.029-2.293-1.393-2.293-1.394 0-1.597 1.103-1.597 2.206V18.3h-2.642V9.735h2.584v1.19h.029c.377-.696 1.22-1.393 2.526-1.393 2.7 0 3.193 1.742 3.193 4.123V18.3h-.058Z"></path>
		</svg>
	);
}

/** LineIcons `Locked1`. */
export function LiLock({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12.75 15.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2Z"></path><path fill="currentColor" d="M12 1.25A4.75 4.75 0 0 0 7.25 6v2.696a7.5 7.5 0 1 0 9.5 0V6A4.75 4.75 0 0 0 12 1.25ZM12 7a7.47 7.47 0 0 0-3.25.739V6a3.25 3.25 0 0 1 6.5 0v1.739A7.47 7.47 0 0 0 12 7Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"></path>
		</svg>
	);
}

/** LineIcons `Envelope1`. */
export function LiMail({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M22 6.256V17.25a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.25V6.204A1.736 1.736 0 0 1 3.737 4.5h16.528c.959 0 1.736.777 1.736 1.735v.021ZM3.5 8.187v9.063c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V8.187l-7.213 5.03c-.773.54-1.8.54-2.574 0L3.5 8.187Zm17-1.958A.236.236 0 0 0 20.264 6H3.736a.236.236 0 0 0-.135.429l7.97 5.558c.258.18.6.18.858 0l7.97-5.558a.236.236 0 0 0 .101-.186V6.23Z"></path>
		</svg>
	);
}

/** LineIcons `MapPin5`. */
export function LiMapPin({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M13.254 13.538a5.376 5.376 0 1 0-1.5 0v8.552a.75.75 0 1 0 1.5 0v-8.552ZM8.629 8.215a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Minus`. */
export function LiMinus({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M5.25 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z"></path>
		</svg>
	);
}

/** LineIcons `Monitor`. */
export function LiMonitor({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M2 6.422a2.25 2.25 0 0 1 2.25-2.25h15.5A2.25 2.25 0 0 1 22 6.422v7.406a2.25 2.25 0 0 1-2.25 2.25h-7v2.25H15a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5h2.25v-2.25h-7A2.25 2.25 0 0 1 2 13.828V6.422Zm2.25-.75a.75.75 0 0 0-.75.75v7.406c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.422a.75.75 0 0 0-.75-.75H4.25Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `MoonHalfRight5`. */
export function LiMoon({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M13.744 3.17a.75.75 0 0 0 .094.895A7.252 7.252 0 0 1 3.589 14.314a.75.75 0 0 0-1.236.74c1.13 4.286 5.03 7.446 9.67 7.446 5.523 0 10-4.477 10-10 0-4.64-3.16-8.541-7.445-9.67a.75.75 0 0 0-.834.34Zm2.678 2.055A8.5 8.5 0 1 1 4.748 16.9 8.752 8.752 0 0 0 16.423 5.225Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Music`. */
export function LiMusic({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M21.25 4a.75.75 0 0 0-.888-.737l-12 2.25a.75.75 0 0 0-.612.737v8.209A3.952 3.952 0 0 0 5.875 14c-.874 0-1.694.27-2.31.74-.618.47-1.065 1.174-1.065 2.01 0 .836.447 1.54 1.064 2.01.617.47 1.437.74 2.311.74.874 0 1.694-.27 2.31-.74.606-.46 1.047-1.146 1.064-1.96l.001-.029V10.62l10.5-2.01v3.599a3.952 3.952 0 0 0-1.875-.459c-.874 0-1.694.27-2.31.74-.618.47-1.065 1.174-1.065 2.01 0 .836.447 1.54 1.064 2.01.617.47 1.437.74 2.311.74.874 0 1.694-.27 2.31-.74.606-.46 1.047-1.146 1.065-1.96V4Zm-1.5 10.5c0 .268-.14.564-.473.818-.333.253-.826.432-1.402.432s-1.069-.179-1.402-.432c-.332-.254-.473-.55-.473-.818 0-.268.14-.564.473-.818.333-.253.826-.432 1.402-.432s1.069.179 1.402.432c.332.254.473.55.473.818ZM7.277 15.932c.332.254.473.55.473.818 0 .268-.14.564-.473.818-.333.253-.827.432-1.402.432s-1.069-.179-1.402-.432c-.332-.254-.473-.55-.473-.818 0-.268.14-.564.473-.818.333-.253.827-.432 1.402-.432s1.069.179 1.402.432Zm12.473-8.85-10.5 2.01v-2.22l10.5-1.968v2.178Z"></path>
		</svg>
	);
}

/** LineIcons `Pause`. */
export function LiPause({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M7 3.25A2.25 2.25 0 0 0 4.75 5.5v13A2.25 2.25 0 0 0 7 20.75h1.75A2.25 2.25 0 0 0 11 18.5v-13a2.25 2.25 0 0 0-2.25-2.25H7ZM6.25 5.5A.75.75 0 0 1 7 4.75h1.75a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75H7a.75.75 0 0 1-.75-.75v-13ZM16.25 3.25A2.25 2.25 0 0 0 14 5.5v13a2.25 2.25 0 0 0 2.25 2.25H18a2.25 2.25 0 0 0 2.25-2.25v-13A2.25 2.25 0 0 0 18 3.25h-1.75ZM15.5 5.5a.75.75 0 0 1 .75-.75H18a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75h-1.75a.75.75 0 0 1-.75-.75v-13Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Play`. */
export function LiPlay({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M19.436 13.917c1.43-.878 1.43-2.956 0-3.834l-9.884-6.07c-1.499-.92-3.427.159-3.427 1.918V18.07c0 1.759 1.928 2.838 3.427 1.917l9.884-6.069Zm-.785-2.556a.75.75 0 0 1 0 1.278l-9.884 6.069a.75.75 0 0 1-1.142-.64V5.932a.75.75 0 0 1 1.142-.639l9.884 6.069Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Plus`. */
export function LiPlus({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M11.25 6a.75.75 0 0 1 1.5 0v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 1 1-1.5 0v-5.25H6a.75.75 0 1 1 0-1.5h5.25V6Z"></path>
		</svg>
	);
}

/** LineIcons `PowerButton`. */
export function LiPower({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M11.25 13.42a.75.75 0 0 0 1.5 0V2.75a.75.75 0 0 0-1.5 0v10.67Z"></path><path fill="currentColor" d="M19.625 12.875a7.628 7.628 0 0 0-5.375-7.288V4.03c3.951 1.003 6.875 4.583 6.875 8.846a9.125 9.125 0 0 1-18.25 0c0-4.263 2.924-7.844 6.875-8.846v1.558a7.625 7.625 0 1 0 9.875 7.287Z"></path>
		</svg>
	);
}

/** LineIcons `Search1`. */
export function LiSearch({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M11.25 2.75C6.142 2.75 2 6.89 2 11.998s4.142 9.248 9.25 9.248a9.214 9.214 0 0 0 5.987-2.198l3.481 3.48a.75.75 0 1 0 1.06-1.06l-3.48-3.48a9.21 9.21 0 0 0 2.202-5.99c0-5.108-4.142-9.248-9.25-9.248ZM3.5 11.998a7.749 7.749 0 0 1 7.75-7.748 7.749 7.749 0 1 1 0 15.496 7.749 7.749 0 0 1-7.75-7.748Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Telegram`. */
export function LiSend({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="m21.936 5.17-3.03 14.185c-.226.999-.806 1.224-1.644.773l-4.545-3.352-2.225 2.127c-.225.226-.451.452-.967.452l.355-4.675 8.478-7.704c.354-.355-.097-.484-.548-.193l-10.541 6.64-4.546-1.386c-.999-.322-.999-1 .226-1.45L20.614 3.72c.87-.258 1.612.194 1.322 1.45Z"></path>
		</svg>
	);
}

/** LineIcons `Gear1`. */
export function LiSettings({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12 8.774a3.835 3.835 0 1 0 0 7.67 3.835 3.835 0 0 0 0-7.67ZM9.663 12.61a2.335 2.335 0 1 1 4.67 0 2.335 2.335 0 0 1-4.67 0Z" clipRule="evenodd"></path><path fill="currentColor" fillRule="evenodd" d="M2.58 8.922a2.234 2.234 0 0 0 .819 3.052c.489.282.489.989 0 1.27a2.234 2.234 0 0 0-.818 3.052l1.516 2.626a2.234 2.234 0 0 0 3.052.818.734.734 0 0 1 1.101.635c0 1.234 1 2.234 2.234 2.234h3.033c1.233 0 2.233-1 2.233-2.233a.734.734 0 0 1 1.1-.636 2.233 2.233 0 0 0 3.051-.817l1.517-2.627a2.234 2.234 0 0 0-.818-3.051.734.734 0 0 1 0-1.271 2.234 2.234 0 0 0 .818-3.052L19.9 6.296a2.233 2.233 0 0 0-3.05-.817.734.734 0 0 1-1.1-.636c0-1.233-1-2.234-2.234-2.234h-3.033c-1.234 0-2.234 1-2.234 2.234a.734.734 0 0 1-1.101.636 2.234 2.234 0 0 0-3.052.818L2.58 8.922Zm1.569 1.753a.734.734 0 0 1-.27-1.003l1.517-2.625a.734.734 0 0 1 1.003-.269c1.49.86 3.351-.215 3.351-1.935 0-.405.329-.734.734-.734h3.033c.405 0 .733.329.733.734 0 1.72 1.861 2.794 3.35 1.935a.733.733 0 0 1 1.002.268l1.517 2.626c.202.351.082.8-.269 1.003-1.49.86-1.49 3.01 0 3.869.35.202.471.651.269 1.002l-1.517 2.627a.733.733 0 0 1-1.002.268c-1.489-.86-3.35.216-3.35 1.935a.734.734 0 0 1-.733.733h-3.033a.734.734 0 0 1-.734-.734c0-1.72-1.862-2.794-3.351-1.934a.734.734 0 0 1-1.003-.269L3.88 15.546a.734.734 0 0 1 .269-1.002c1.489-.86 1.489-3.01 0-3.87Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Gears3`. */
export function LiSettings2({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M4.253 5.397a1.492 1.492 0 0 0 2.23-1.288h1.5a1.492 1.492 0 0 0 2.231 1.288l.75 1.298c.417-.233.916-.387 1.424-.478-.031-.09-.071-.178-.12-.264l-.759-1.313a1.492 1.492 0 0 0-2.025-.553A1.492 1.492 0 0 0 7.992 2.61H6.476c-.82 0-1.485.66-1.492 1.478a1.492 1.492 0 0 0-2.026.553L2.2 5.953c-.41.71-.17 1.616.534 2.031a1.492 1.492 0 0 0-.534 2.031l.758 1.313c.41.71 1.314.955 2.026.553.006.618.388 1.147.928 1.368-.003-.571.14-1.15.447-1.68l.068-.118a1.494 1.494 0 0 0-2.174-.88l-.75-1.299c.985-.576.985-2 0-2.576l.75-1.299Z"></path><path fill="currentColor" d="M7.234 9.484a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path fill="currentColor" fillRule="evenodd" d="M11.64 15.11a3.065 3.065 0 1 1 6.13 0 3.065 3.065 0 0 1-6.13 0Zm3.066-1.564a1.565 1.565 0 1 0 0 3.13 1.565 1.565 0 0 0 0-3.13Z" clipRule="evenodd"></path><path fill="currentColor" fillRule="evenodd" d="M7.658 17.903a1.833 1.833 0 0 1 .671-2.505.333.333 0 0 0 0-.576 1.833 1.833 0 0 1-.67-2.504l1.106-1.916a1.833 1.833 0 0 1 2.503-.67.332.332 0 0 0 .499-.288c0-1.012.82-1.833 1.832-1.833h2.213c1.013 0 1.833.821 1.833 1.833 0 .256.277.416.498.288a1.832 1.832 0 0 1 2.503.67l1.107 1.918a1.832 1.832 0 0 1-.67 2.502.332.332 0 0 0 0 .576 1.833 1.833 0 0 1 .67 2.503l-1.105 1.916a1.833 1.833 0 0 1-2.504.671.333.333 0 0 0-.5.288c0 1.013-.82 1.833-1.832 1.833H13.6a1.833 1.833 0 0 1-1.833-1.832.333.333 0 0 0-.5-.288 1.833 1.833 0 0 1-2.503-.671l-1.106-1.915Zm1.421-1.206a.333.333 0 0 0-.122.456l1.106 1.915c.092.16.295.214.455.122 1.221-.705 2.749.176 2.749 1.587 0 .183.149.332.333.332h2.212c.184 0 .333-.149.333-.333 0-1.41 1.527-2.292 2.749-1.587.16.092.363.037.455-.122l1.106-1.916a.333.333 0 0 0-.122-.454c-1.221-.705-1.222-2.468 0-3.174a.332.332 0 0 0 .121-.453l-1.107-1.917a.332.332 0 0 0-.454-.122c-1.221.706-2.748-.177-2.748-1.587a.333.333 0 0 0-.333-.333H13.6a.332.332 0 0 0-.332.333c0 1.41-1.527 2.292-2.749 1.586a.333.333 0 0 0-.454.122l-1.106 1.916a.333.333 0 0 0 .122.455c1.222.705 1.22 2.47 0 3.174Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `StarFat`. */
export function LiStar({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12 2.125a.75.75 0 0 1 .672.418l2.654 5.378 5.935.863a.75.75 0 0 1 .416 1.279l-4.294 4.186 1.013 5.911a.75.75 0 0 1-1.088.79L12 18.16 6.69 20.95a.75.75 0 0 1-1.088-.79l1.014-5.911-4.295-4.186a.75.75 0 0 1 .416-1.28l5.935-.862 2.654-5.378A.75.75 0 0 1 12 2.125Zm0 2.445L9.843 8.939a.75.75 0 0 1-.564.41l-4.822.7 3.49 3.401a.75.75 0 0 1 .215.664l-.824 4.802 4.313-2.267a.75.75 0 0 1 .698 0l4.312 2.267-.824-4.802a.75.75 0 0 1 .216-.664l3.489-3.4-4.822-.701a.75.75 0 0 1-.564-.41L12 4.569Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Sun1`. */
export function LiSun({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12.023 2.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Z"></path><path fill="currentColor" fillRule="evenodd" d="M6.523 12.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Zm5.5-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clipRule="evenodd"></path><path fill="currentColor" d="M19.095 6.491a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM22.023 12.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM18.034 19.57a.75.75 0 0 0 1.06-1.061l-1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM12.023 19.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM7.073 18.515a.75.75 0 0 0-1.06-1.061l-1.061 1.06a.75.75 0 0 0 1.06 1.061l1.061-1.06ZM5.023 12.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM6.013 7.546a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 0 0-1.061 1.06l1.06 1.061Z"></path>
		</svg>
	);
}

/** LineIcons `Trash3`. */
export function LiTrash2({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M14.722 12.758a.75.75 0 0 0-1.498-.073L13 17.24a.75.75 0 0 0 1.498.074l.224-4.557ZM9.988 11.973a.75.75 0 0 0-.712.785l.224 4.557a.75.75 0 1 0 1.498-.074l-.224-4.556a.75.75 0 0 0-.786-.712Z"></path><path fill="currentColor" d="M10.249 2a2.25 2.25 0 0 0-2.25 2.25V5H5.5a2.25 2.25 0 0 0-.587 4.423l.628 10.462A2.25 2.25 0 0 0 7.787 22h8.424a2.25 2.25 0 0 0 2.246-2.115l.628-10.462A2.25 2.25 0 0 0 18.498 5h-2.499v-.75A2.25 2.25 0 0 0 13.749 2h-3.5Zm4.25 3h-5v-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75V5ZM5.5 6.5h12.998a.75.75 0 1 1 0 1.5H5.5a.75.75 0 0 1 0-1.5Zm.92 3h11.158l-.618 10.295a.75.75 0 0 1-.749.705H7.787a.75.75 0 0 1-.749-.705L6.42 9.5Z"></path>
		</svg>
	);
}

/** LineIcons `User4`. */
export function LiUser({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M16.434 6.35c0 2.39-1.94 4.34-4.34 4.34l-.01-.01c-2.39 0-4.34-1.95-4.34-4.34 0-2.39 1.96-4.34 4.35-4.34 2.39 0 4.34 1.96 4.34 4.35Zm-1.5-.01c0-1.56-1.27-2.84-2.84-2.84-1.56 0-2.84 1.28-2.84 2.84 0 1.56 1.28 2.84 2.84 2.84a2.85 2.85 0 0 0 2.84-2.84Z" clipRule="evenodd"></path><path fill="currentColor" d="M12.024 12.19c2.67 0 4.76.75 6.21 2.23v-.01c2.046 2.086 2.04 4.846 2.04 5.024v.005c-.01.41-.34.74-.75.74h-.01a.755.755 0 0 1-.74-.76c0-.05 0-2.33-1.62-3.97-1.16-1.17-2.89-1.77-5.13-1.77-2.24 0-3.97.6-5.13 1.77-1.62 1.65-1.62 3.95-1.62 3.97 0 .41-.33.76-.74.76-.36.02-.76-.32-.76-.73v-.004c-.001-.168-.008-2.939 2.04-5.026 1.45-1.48 3.54-2.23 6.21-2.23Z"></path>
		</svg>
	);
}

/** LineIcons `VolumeLow`. */
export function LiVolume1({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M13.75 6.34c0-1.941-2.294-2.971-3.745-1.681L6.81 7.5H4.75A2.25 2.25 0 0 0 2.5 9.75v4.5a2.25 2.25 0 0 0 2.25 2.25h2.059l3.196 2.841c1.451 1.29 3.745.26 3.745-1.681V6.34Zm-2.748-.56a.75.75 0 0 1 1.248.56v11.32a.75.75 0 0 1-1.248.56l-3.41-3.03a.75.75 0 0 0-.498-.19H4.75a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 1 4.75 9h2.344a.75.75 0 0 0 .498-.19l3.41-3.03Z" clipRule="evenodd"></path><path fill="currentColor" d="M14.985 10.653c.688.765.688 1.93 0 2.695a.75.75 0 0 0 1.116 1.003 3.517 3.517 0 0 0 0-4.7.75.75 0 0 0-1.116 1.002Z"></path>
		</svg>
	);
}

/** LineIcons `VolumeHigh`. */
export function LiVolume2({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M13.75 6.34c0-1.941-2.294-2.971-3.745-1.681L6.81 7.5H4.75A2.25 2.25 0 0 0 2.5 9.75v4.5a2.25 2.25 0 0 0 2.25 2.25h2.059l3.196 2.841c1.451 1.29 3.745.26 3.745-1.681V6.34Zm-2.748-.56a.75.75 0 0 1 1.248.56v11.32a.75.75 0 0 1-1.248.56l-3.41-3.03a.75.75 0 0 0-.498-.19H4.75a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 1 4.75 9h2.344a.75.75 0 0 0 .498-.19l3.41-3.03Z" clipRule="evenodd"></path><path fill="currentColor" d="M17.077 8.837c1.561 1.739 1.561 4.588 0 6.327a.75.75 0 1 0 1.116 1.002c2.073-2.309 2.073-6.023 0-8.332a.75.75 0 0 0-1.116 1.003Z"></path><path fill="currentColor" d="M19.266 16.886c2.312-2.687 2.312-7.084 0-9.771a.75.75 0 1 1 1.137-.979c2.796 3.25 2.796 8.479 0 11.729a.75.75 0 0 1-1.137-.979ZM14.985 10.653c.688.765.688 1.93 0 2.695a.75.75 0 0 0 1.116 1.003 3.517 3.517 0 0 0 0-4.7.75.75 0 0 0-1.116 1.002Z"></path>
		</svg>
	);
}

/** LineIcons `VolumeMute`. */
export function LiVolumeX({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M3.78 2.22a.75.75 0 0 0-1.06 1.06l4.158 4.158-.07.062H4.75A2.25 2.25 0 0 0 2.5 9.75v4.5a2.25 2.25 0 0 0 2.25 2.25h2.059l3.196 2.841c1.451 1.29 3.745.26 3.745-1.681v-3.35l7.47 7.47a.75.75 0 0 0 1.06-1.061l-18.5-18.5Zm8.47 10.59v4.85a.75.75 0 0 1-1.248.56l-3.41-3.03a.75.75 0 0 0-.498-.19H4.75a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 1 4.75 9h2.344a.75.75 0 0 0 .498-.19l.348-.31 4.31 4.31ZM12.25 6.34v2.321l1.5 1.5v-3.82c0-1.942-2.294-2.972-3.745-1.683l-.93.828 1.062 1.062.865-.768a.75.75 0 0 1 1.248.56ZM15.499 11.91l1.291 1.291a3.519 3.519 0 0 0-.69-3.551.75.75 0 0 0-1.115 1.003c.323.358.494.805.514 1.257ZM17.752 14.163l1.105 1.105c1.379-2.292 1.158-5.405-.664-7.434a.75.75 0 0 0-1.116 1.002c1.289 1.435 1.514 3.628.675 5.327Z"></path>
		</svg>
	);
}

/** LineIcons `X`. */
export function LiX({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M17.751 2.96h3.067l-6.7 7.659L22 21.039h-6.172l-4.833-6.32-5.531 6.32h-3.07l7.167-8.19L2 2.96h6.328l4.37 5.777L17.75 2.96Zm-1.076 16.243h1.7L7.404 4.7H5.58l11.094 14.503Z"></path>
		</svg>
	);
}

/** LineIcons `GamePadModern1`. */
export function LiGamepad2({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M9.303 7.739a.75.75 0 0 1 .75.75v1.004h1.005a.75.75 0 0 1 0 1.5h-1.005V12a.75.75 0 0 1-1.5 0v-1.007H7.547a.75.75 0 0 1 0-1.5h1.006V8.489a.75.75 0 0 1 .75-.75ZM14.479 11.746a.75.75 0 0 1 .75-.75h.877a.75.75 0 0 1 0 1.5h-.877a.75.75 0 0 1-.75-.75ZM15.229 7.989a.75.75 0 1 0 0 1.5h.877a.75.75 0 0 0 0-1.5h-.877Z"></path><path fill="currentColor" fillRule="evenodd" d="M6.402 5.018a30.75 30.75 0 0 1 11.188 0l1.565.29a2.25 2.25 0 0 1 1.825 1.944l1.167 9.73a2.25 2.25 0 0 1-2.234 2.518h-2.097a2.25 2.25 0 0 1-1.915-1.07l-1.434-2.324a.75.75 0 0 0-.638-.356h-3.667a.75.75 0 0 0-.638.356l-1.433 2.325A2.25 2.25 0 0 1 6.175 19.5H4.078a2.25 2.25 0 0 1-2.234-2.518l1.168-9.73a2.25 2.25 0 0 1 1.824-1.944l1.566-.29Zm10.915 1.475a29.25 29.25 0 0 0-10.642 0l-1.566.29a.75.75 0 0 0-.608.648l-1.167 9.73a.75.75 0 0 0 .744.839h2.097a.75.75 0 0 0 .639-.357l1.433-2.324a2.25 2.25 0 0 1 1.915-1.07h3.667c.78 0 1.505.405 1.915 1.07l1.434 2.324a.75.75 0 0 0 .638.357h2.097a.75.75 0 0 0 .745-.84L19.49 7.43a.75.75 0 0 0-.609-.647l-1.565-.29Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Globe1`. */
export function LiGlobe({ size = 16, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M2.003 12.126C2.07 17.59 6.521 22 12.001 22c5.523 0 10-4.478 10-10 0-5.508-4.454-9.976-9.956-10a2.538 2.538 0 0 0-.088 0c-5.46.024-9.886 4.424-9.954 9.873a2.54 2.54 0 0 0 0 .253ZM8.98 8.977A19.705 19.705 0 0 1 12 8.75c1.069 0 2.087.081 3.024.228.147.937.228 1.954.228 3.022 0 1.067-.081 2.085-.227 3.022-.938.146-1.956.227-3.024.227-1.067 0-2.084-.081-3.02-.227A19.703 19.703 0 0 1 8.751 12c0-1.068.08-2.086.227-3.023Zm-1.56.321c-.11.861-.167 1.768-.167 2.702 0 .933.058 1.84.167 2.701a11.54 11.54 0 0 1-1.662-.562c-.781-.337-1.365-.72-1.744-1.107-.345-.353-.49-.676-.51-.96a8.574 8.574 0 0 1 0-.145c.02-.284.165-.607.51-.96.379-.386.963-.77 1.744-1.107a11.553 11.553 0 0 1 1.662-.562ZM9.3 7.418c.16-.611.349-1.168.562-1.661.337-.781.72-1.365 1.107-1.744.373-.365.712-.505 1.007-.513h.05c.295.008.635.148 1.008.513.386.379.77.963 1.107 1.744.213.493.402 1.05.561 1.66A21.539 21.539 0 0 0 12 7.25c-.933 0-1.84.058-2.7.167Zm7.284 1.881c.61.16 1.166.348 1.658.561.781.338 1.366.72 1.744 1.107.375.384.513.732.513 1.033 0 .3-.138.648-.513 1.032-.378.387-.963.77-1.744 1.107a11.53 11.53 0 0 1-1.658.561c.109-.86.166-1.767.166-2.7 0-.934-.057-1.84-.166-2.7Zm-1.882 7.283c-.159.61-.348 1.167-.561 1.66-.338.781-.72 1.366-1.107 1.744-.384.375-.732.513-1.033.513-.3 0-.649-.138-1.032-.513-.387-.378-.77-.963-1.107-1.744a11.546 11.546 0 0 1-.562-1.66c.86.11 1.767.167 2.7.167.934 0 1.84-.058 2.702-.167Zm-7.009-.274c.203.932.47 1.785.792 2.53.178.41.375.795.592 1.145a8.525 8.525 0 0 1-5.057-5.056c.349.215.732.412 1.142.589.744.322 1.598.59 2.531.792Zm8.616 0c.932-.203 1.785-.47 2.528-.792a8.855 8.855 0 0 0 1.147-.592 8.525 8.525 0 0 1-5.058 5.06c.217-.35.414-.736.592-1.147.321-.744.589-1.597.791-2.53Zm3.675-7.233a8.853 8.853 0 0 0-1.147-.592 13.795 13.795 0 0 0-2.527-.791 13.794 13.794 0 0 0-.792-2.53 8.865 8.865 0 0 0-.591-1.145 8.525 8.525 0 0 1 5.057 5.058ZM7.694 7.691a13.8 13.8 0 0 0-2.532.792c-.41.177-.793.374-1.142.59a8.525 8.525 0 0 1 5.056-5.056c-.217.35-.414.734-.591 1.145-.322.744-.59 1.597-.792 2.529Z"></path>
		</svg>
	);
}

/** LineIcons `Folder1`. */
export function FolderIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M2 6a2.25 2.25 0 0 1 2.25-2.25H8.5a2.25 2.25 0 0 1 1.8.9l1.35 1.8a.75.75 0 0 0 .6.3h7.5A2.25 2.25 0 0 1 22 9v9a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 18V6Zm2.25-.75A.75.75 0 0 0 3.5 6v12c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-7.5a2.25 2.25 0 0 1-1.8-.9L9.1 5.55a.75.75 0 0 0-.6-.3H4.25Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Bulb4`. */
export function TipsIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M9.063 18.045c-.046-1.131-.794-2.194-1.803-3.18a7.5 7.5 0 1 1 10.48 0c-1.041 1.017-1.805 2.117-1.805 3.29v1.595a2.25 2.25 0 0 1-2.25 2.25h-2.373a2.25 2.25 0 0 1-2.25-2.25v-1.705ZM6.5 9.5a5.98 5.98 0 0 0 1.808 4.293c.741.724 1.512 1.633 1.933 2.707h4.518c.421-1.074 1.192-1.984 1.933-2.707A6 6 0 1 0 6.5 9.5Zm4.063 8.713v1.537c0 .414.335.75.75.75h2.372a.75.75 0 0 0 .75-.75V18h-3.873v.017a4.17 4.17 0 0 1 0 .196ZM1.75 9.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM4.215 3.85a.75.75 0 1 0-.75 1.3l.866.5a.75.75 0 1 0 .75-1.3l-.866-.5ZM3.19 14.875a.75.75 0 0 1 .275-1.024l.866-.5a.75.75 0 0 1 .75 1.298l-.866.5a.75.75 0 0 1-1.025-.274ZM21.5 8.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1ZM19.645 13.625a.75.75 0 0 1 1.025-.274l.866.5a.75.75 0 1 1-.75 1.298l-.866-.5a.75.75 0 0 1-.275-1.024ZM19.92 4.35a.75.75 0 0 0 .75 1.3l.866-.5a.75.75 0 1 0-.75-1.3l-.866.5Z"></path>
		</svg>
	);
}

/** LineIcons `VsCode`. */
export function CodeIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M21.95 4.903a1.045 1.045 0 0 0-.06-.166 1.178 1.178 0 0 0-.31-.425 1.179 1.179 0 0 0-.29-.197l-4.118-1.994a1.267 1.267 0 0 0-.75-.103 1.256 1.256 0 0 0-.672.347L9.106 9.75 5.228 6.553l-.337-.281a.822.822 0 0 0-.413-.19c-.022-.004-.044-.007-.066-.007-.018-.003-.04-.003-.059-.003-.031 0-.06 0-.09.003a.314.314 0 0 0-.079.013.693.693 0 0 0-.156.046l-1.515.629a.869.869 0 0 0-.372.306c-.091.138-.141.3-.141.463v8.936c0 .163.05.325.14.463.091.134.222.24.373.306l1.515.638a.85.85 0 0 0 .45.056.85.85 0 0 0 .413-.19l.337-.294 3.878-3.198 6.644 7.386c.022.022.047.044.072.066a1.256 1.256 0 0 0 .6.281c.253.044.515.006.75-.103l4.119-1.994a1.07 1.07 0 0 0 .153-.088c.097-.065.187-.147.262-.231a1.26 1.26 0 0 0 .294-.813V5.247c0-.116-.016-.232-.05-.344ZM4.5 14.874V9.126l2.584 2.876L4.5 14.873Zm7.334-2.873L17 7.742v8.518L11.834 12Z"></path>
		</svg>
	);
}

/** LineIcons `Trash3`. */
export function RecycleIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M14.722 12.758a.75.75 0 0 0-1.498-.073L13 17.24a.75.75 0 0 0 1.498.074l.224-4.557ZM9.988 11.973a.75.75 0 0 0-.712.785l.224 4.557a.75.75 0 1 0 1.498-.074l-.224-4.556a.75.75 0 0 0-.786-.712Z"></path><path fill="currentColor" d="M10.249 2a2.25 2.25 0 0 0-2.25 2.25V5H5.5a2.25 2.25 0 0 0-.587 4.423l.628 10.462A2.25 2.25 0 0 0 7.787 22h8.424a2.25 2.25 0 0 0 2.246-2.115l.628-10.462A2.25 2.25 0 0 0 18.498 5h-2.499v-.75A2.25 2.25 0 0 0 13.749 2h-3.5Zm4.25 3h-5v-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75V5ZM5.5 6.5h12.998a.75.75 0 1 1 0 1.5H5.5a.75.75 0 0 1 0-1.5Zm.92 3h11.158l-.618 10.295a.75.75 0 0 1-.749.705H7.787a.75.75 0 0 1-.749-.705L6.42 9.5Z"></path>
		</svg>
	);
}

/** LineIcons `FileMultiple`. */
export function DocumentIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M16.892 16.733V4.25A2.25 2.25 0 0 0 14.642 2h-3.95a2.25 2.25 0 0 0-1.59.66L4.751 7.01a2.25 2.25 0 0 0-.658 1.59v8.132a2.25 2.25 0 0 0 2.25 2.25h8.298a2.25 2.25 0 0 0 2.25-2.25Zm-2.25.75H6.344a.75.75 0 0 1-.75-.75V8.731h2.98a2.25 2.25 0 0 0 2.25-2.251l-.001-2.98h3.82a.75.75 0 0 1 .75.75v12.483a.75.75 0 0 1-.75.75ZM6.653 7.231l2.67-2.672.002 1.922a.75.75 0 0 1-.75.75H6.653Z"></path><path fill="currentColor" d="M18.407 5.684a.75.75 0 0 1 1.5 0v11.567a4.75 4.75 0 0 1-4.75 4.75h-7.36a.75.75 0 0 1 0-1.5h7.36a3.25 3.25 0 0 0 3.25-3.25V5.684Z"></path>
		</svg>
	);
}

/** LineIcons `Monitor`. */
export function ThisPcIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M2 6.422a2.25 2.25 0 0 1 2.25-2.25h15.5A2.25 2.25 0 0 1 22 6.422v7.406a2.25 2.25 0 0 1-2.25 2.25h-7v2.25H15a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5h2.25v-2.25h-7A2.25 2.25 0 0 1 2 13.828V6.422Zm2.25-.75a.75.75 0 0 0-.75.75v7.406c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.422a.75.75 0 0 0-.75-.75H4.25Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `User4`. */
export function PersonIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M16.434 6.35c0 2.39-1.94 4.34-4.34 4.34l-.01-.01c-2.39 0-4.34-1.95-4.34-4.34 0-2.39 1.96-4.34 4.35-4.34 2.39 0 4.34 1.96 4.34 4.35Zm-1.5-.01c0-1.56-1.27-2.84-2.84-2.84-1.56 0-2.84 1.28-2.84 2.84 0 1.56 1.28 2.84 2.84 2.84a2.85 2.85 0 0 0 2.84-2.84Z" clipRule="evenodd"></path><path fill="currentColor" d="M12.024 12.19c2.67 0 4.76.75 6.21 2.23v-.01c2.046 2.086 2.04 4.846 2.04 5.024v.005c-.01.41-.34.74-.75.74h-.01a.755.755 0 0 1-.74-.76c0-.05 0-2.33-1.62-3.97-1.16-1.17-2.89-1.77-5.13-1.77-2.24 0-3.97.6-5.13 1.77-1.62 1.65-1.62 3.95-1.62 3.97 0 .41-.33.76-.74.76-.36.02-.76-.32-.76-.73v-.004c-.001-.168-.008-2.939 2.04-5.026 1.45-1.48 3.54-2.23 6.21-2.23Z"></path>
		</svg>
	);
}

/** LineIcons `Layers1`. */
export function LayersIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12.86 4.969a2.483 2.483 0 0 0-1.675 0L2.911 7.935c-1.173.42-1.173 2.079 0 2.5l8.274 2.966a2.482 2.482 0 0 0 1.676 0l8.274-2.967c1.173-.42 1.173-2.079 0-2.499l-8.274-2.966ZM11.693 6.38a.983.983 0 0 1 .663 0l7.821 2.804-7.821 2.804a.983.983 0 0 1-.664 0L3.87 9.185 11.69 6.38Z" clipRule="evenodd"></path><path fill="currentColor" d="m2.91 13.565 2.144-.769 2.223.797-3.407 1.221 7.821 2.804a.982.982 0 0 0 .664 0l7.821-2.804-3.406-1.22 2.222-.798 2.143.769c1.173.42 1.173 2.079 0 2.5l-8.274 2.965a2.482 2.482 0 0 1-1.676 0l-8.274-2.966c-1.173-.42-1.173-2.079 0-2.5Z"></path>
		</svg>
	);
}

/** LineIcons `Briefcase1`. */
export function BriefcaseIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M10.023 3a2.25 2.25 0 0 0-2.25 2.25V6h-3a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h14.5a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 19.274 6h-3v-.75A2.25 2.25 0 0 0 14.023 3h-4Zm4.75 3h-5.5v-.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75V6Zm-10 1.5h14.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-14.5a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75Z"></path>
		</svg>
	);
}

/** LineIcons `GamePadModern1`. */
export function CareerIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M9.303 7.739a.75.75 0 0 1 .75.75v1.004h1.005a.75.75 0 0 1 0 1.5h-1.005V12a.75.75 0 0 1-1.5 0v-1.007H7.547a.75.75 0 0 1 0-1.5h1.006V8.489a.75.75 0 0 1 .75-.75ZM14.479 11.746a.75.75 0 0 1 .75-.75h.877a.75.75 0 0 1 0 1.5h-.877a.75.75 0 0 1-.75-.75ZM15.229 7.989a.75.75 0 1 0 0 1.5h.877a.75.75 0 0 0 0-1.5h-.877Z"></path><path fill="currentColor" fillRule="evenodd" d="M6.402 5.018a30.75 30.75 0 0 1 11.188 0l1.565.29a2.25 2.25 0 0 1 1.825 1.944l1.167 9.73a2.25 2.25 0 0 1-2.234 2.518h-2.097a2.25 2.25 0 0 1-1.915-1.07l-1.434-2.324a.75.75 0 0 0-.638-.356h-3.667a.75.75 0 0 0-.638.356l-1.433 2.325A2.25 2.25 0 0 1 6.175 19.5H4.078a2.25 2.25 0 0 1-2.234-2.518l1.168-9.73a2.25 2.25 0 0 1 1.824-1.944l1.566-.29Zm10.915 1.475a29.25 29.25 0 0 0-10.642 0l-1.566.29a.75.75 0 0 0-.608.648l-1.167 9.73a.75.75 0 0 0 .744.839h2.097a.75.75 0 0 0 .639-.357l1.433-2.324a2.25 2.25 0 0 1 1.915-1.07h3.667c.78 0 1.505.405 1.915 1.07l1.434 2.324a.75.75 0 0 0 .638.357h2.097a.75.75 0 0 0 .745-.84L19.49 7.43a.75.75 0 0 0-.609-.647l-1.565-.29Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Envelope1`. */
export function MailIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M22 6.256V17.25a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.25V6.204A1.736 1.736 0 0 1 3.737 4.5h16.528c.959 0 1.736.777 1.736 1.735v.021ZM3.5 8.187v9.063c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V8.187l-7.213 5.03c-.773.54-1.8.54-2.574 0L3.5 8.187Zm17-1.958A.236.236 0 0 0 20.264 6H3.736a.236.236 0 0 0-.135.429l7.97 5.558c.258.18.6.18.858 0l7.97-5.558a.236.236 0 0 0 .101-.186V6.23Z"></path>
		</svg>
	);
}

/** LineIcons `Gear1`. */
export function GearIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 25'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" fillRule="evenodd" d="M12 8.774a3.835 3.835 0 1 0 0 7.67 3.835 3.835 0 0 0 0-7.67ZM9.663 12.61a2.335 2.335 0 1 1 4.67 0 2.335 2.335 0 0 1-4.67 0Z" clipRule="evenodd"></path><path fill="currentColor" fillRule="evenodd" d="M2.58 8.922a2.234 2.234 0 0 0 .819 3.052c.489.282.489.989 0 1.27a2.234 2.234 0 0 0-.818 3.052l1.516 2.626a2.234 2.234 0 0 0 3.052.818.734.734 0 0 1 1.101.635c0 1.234 1 2.234 2.234 2.234h3.033c1.233 0 2.233-1 2.233-2.233a.734.734 0 0 1 1.1-.636 2.233 2.233 0 0 0 3.051-.817l1.517-2.627a2.234 2.234 0 0 0-.818-3.051.734.734 0 0 1 0-1.271 2.234 2.234 0 0 0 .818-3.052L19.9 6.296a2.233 2.233 0 0 0-3.05-.817.734.734 0 0 1-1.1-.636c0-1.233-1-2.234-2.234-2.234h-3.033c-1.234 0-2.234 1-2.234 2.234a.734.734 0 0 1-1.101.636 2.234 2.234 0 0 0-3.052.818L2.58 8.922Zm1.569 1.753a.734.734 0 0 1-.27-1.003l1.517-2.625a.734.734 0 0 1 1.003-.269c1.49.86 3.351-.215 3.351-1.935 0-.405.329-.734.734-.734h3.033c.405 0 .733.329.733.734 0 1.72 1.861 2.794 3.35 1.935a.733.733 0 0 1 1.002.268l1.517 2.626c.202.351.082.8-.269 1.003-1.49.86-1.49 3.01 0 3.869.35.202.471.651.269 1.002l-1.517 2.627a.733.733 0 0 1-1.002.268c-1.489-.86-3.35.216-3.35 1.935a.734.734 0 0 1-.733.733h-3.033a.734.734 0 0 1-.734-.734c0-1.72-1.862-2.794-3.351-1.934a.734.734 0 0 1-1.003-.269L3.88 15.546a.734.734 0 0 1 .269-1.002c1.489-.86 1.489-3.01 0-3.87Z" clipRule="evenodd"></path>
		</svg>
	);
}

/** LineIcons `Github`. */
export function GitHubIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M12 2.249c-5.484 0-10 4.452-10 10 0 4.387 2.871 8.13 6.871 9.484.516.097.677-.226.677-.452s0-.87-.032-1.742c-2.774.645-3.355-1.355-3.355-1.355-.451-1.129-1.129-1.451-1.129-1.451-.903-.645.033-.645.033-.645 1 .032 1.548 1.032 1.548 1.032.87 1.548 2.355 1.097 2.903.806.097-.645.355-1.096.645-1.354-2.193-.226-4.548-1.097-4.548-4.904 0-1.096.42-1.967 1.032-2.645-.097-.226-.451-1.258.097-2.645 0 0 .87-.258 2.774 1.032a9.296 9.296 0 0 1 2.516-.355c.871 0 1.742.097 2.516.355 1.904-1.258 2.742-1.032 2.742-1.032.549 1.355.226 2.42.097 2.645.645.678 1.032 1.58 1.032 2.645 0 3.807-2.355 4.678-4.548 4.904.355.322.677.967.677 1.87 0 1.355-.032 2.42-.032 2.742 0 .259.194.549.678.452C19.128 20.314 22 16.604 22 12.185c-.032-5.484-4.516-9.936-10-9.936Z"></path>
		</svg>
	);
}

/** LineIcons `Linkedin`. */
export function LinkedInIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M19.706 3H4.348c-.725 0-1.306.58-1.306 1.306v15.387c0 .697.58 1.307 1.306 1.307h15.3c.726 0 1.307-.58 1.307-1.306V4.277C21.013 3.581 20.432 3 19.707 3ZM8.355 18.3H5.713V9.735h2.642V18.3ZM7.019 8.545a1.53 1.53 0 0 1-1.538-1.539c0-.841.696-1.538 1.538-1.538.842 0 1.54.697 1.54 1.538 0 .842-.64 1.54-1.54 1.54ZM18.371 18.3h-2.642v-4.152c0-.987-.029-2.293-1.393-2.293-1.394 0-1.597 1.103-1.597 2.206V18.3h-2.642V9.735h2.584v1.19h.029c.377-.696 1.22-1.393 2.526-1.393 2.7 0 3.193 1.742 3.193 4.123V18.3h-.058Z"></path>
		</svg>
	);
}

/** LineIcons `Music`. */
export function MediaIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 25 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M21.25 4a.75.75 0 0 0-.888-.737l-12 2.25a.75.75 0 0 0-.612.737v8.209A3.952 3.952 0 0 0 5.875 14c-.874 0-1.694.27-2.31.74-.618.47-1.065 1.174-1.065 2.01 0 .836.447 1.54 1.064 2.01.617.47 1.437.74 2.311.74.874 0 1.694-.27 2.31-.74.606-.46 1.047-1.146 1.064-1.96l.001-.029V10.62l10.5-2.01v3.599a3.952 3.952 0 0 0-1.875-.459c-.874 0-1.694.27-2.31.74-.618.47-1.065 1.174-1.065 2.01 0 .836.447 1.54 1.064 2.01.617.47 1.437.74 2.311.74.874 0 1.694-.27 2.31-.74.606-.46 1.047-1.146 1.065-1.96V4Zm-1.5 10.5c0 .268-.14.564-.473.818-.333.253-.826.432-1.402.432s-1.069-.179-1.402-.432c-.332-.254-.473-.55-.473-.818 0-.268.14-.564.473-.818.333-.253.826-.432 1.402-.432s1.069.179 1.402.432c.332.254.473.55.473.818ZM7.277 15.932c.332.254.473.55.473.818 0 .268-.14.564-.473.818-.333.253-.827.432-1.402.432s-1.069-.179-1.402-.432c-.332-.254-.473-.55-.473-.818 0-.268.14-.564.473-.818.333-.253.827-.432 1.402-.432s1.069.179 1.402.432Zm12.473-8.85-10.5 2.01v-2.22l10.5-1.968v2.178Z"></path>
		</svg>
	);
}

/** LineIcons `MonitorCode`. */
export function TerminalIcon({ size = 32, className }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			className={className}
			aria-hidden='true'
			focusable='false'>
			<path fill="currentColor" d="M15.03 4.343a.75.75 0 0 1 0 1.06l-1.97 1.972 1.97 1.972a.75.75 0 0 1-1.06 1.06l-2.5-2.502a.75.75 0 0 1 0-1.06l2.5-2.502a.75.75 0 0 1 1.06 0ZM18.22 4.343a.75.75 0 0 0 0 1.06l1.97 1.972-1.97 1.972a.75.75 0 0 0 1.06 1.06l2.5-2.502a.75.75 0 0 0 0-1.06l-2.5-2.502a.75.75 0 0 0-1.06 0Z"></path><path fill="currentColor" d="M22 15.344v-3.682a6.914 6.914 0 0 1-1.5 1.393v2.289a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 4.25 6h5.638a6.82 6.82 0 0 1 .49-1.5H4.25A2.25 2.25 0 0 0 2 6.75v8.594a2.25 2.25 0 0 0 2.25 2.25h7v1.656H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-2.25v-1.656h7a2.25 2.25 0 0 0 2.25-2.25Z"></path>
		</svg>
	);
}
