'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, type LucideIcon } from 'lucide-react';

export type MenuEntry =
	| {
			kind: 'item';
			label: string;
			Icon?: LucideIcon;
			shortcut?: string;
			disabled?: boolean;
			/** Renders red, as Windows does for Delete. */
			danger?: boolean;
			/** Renders a tick in the icon gutter. */
			checked?: boolean;
			onSelect?: () => void;
			/** Present on a row that opens a sub-menu instead of acting. */
			submenu?: MenuEntry[];
	  }
	| { kind: 'separator' }
	| { kind: 'label'; label: string };

export type MenuPos = { x: number; y: number };

const GAP = 8;

/** Keeps a sheet inside the viewport, flipping it back from the edge. */
function clamp(el: HTMLElement, x: number, y: number, bottomGutter: number) {
	const r = el.getBoundingClientRect();
	const left =
		x + r.width > window.innerWidth - GAP
			? Math.max(GAP, window.innerWidth - r.width - GAP)
			: x;
	const top =
		y + r.height > window.innerHeight - bottomGutter
			? Math.max(GAP, window.innerHeight - r.height - bottomGutter)
			: y;
	el.style.left = `${left}px`;
	el.style.top = `${top}px`;
}

/**
 * A sub-menu sheet. Windows opens one to the right of its parent row and
 * flips it to the left when the parent is close to the screen edge — without
 * that, a menu opened near the right margin loses its own contents.
 */
function Submenu({
	label,
	items,
	onRun,
}: {
	label: string;
	items: MenuEntry[];
	onRun: (fn?: () => void) => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	/* Measured and written straight to the node rather than held in state:
	   the sheet is already on screen by the time it can be measured, so a
	   round trip through React would render it once in the wrong place. */
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		if (r.right > window.innerWidth - GAP) el.dataset.flip = 'true';
		if (r.bottom > window.innerHeight - GAP) {
			el.style.top = `${Math.min(0, window.innerHeight - GAP - r.bottom)}px`;
		}
	}, []);

	return (
		<div
			ref={ref}
			className='menu menu-sub'
			role='menu'
			aria-label={label}>
			<div className='menu-list'>
				{items.map((sub, j) =>
					sub.kind === 'separator' ? (
						<span key={j} className='menu-sep' role='separator' />
					) : sub.kind === 'label' ? (
						<span key={j} className='menu-label'>
							{sub.label}
						</span>
					) : (
						<button
							key={sub.label}
							type='button'
							role='menuitem'
							className='menu-item'
							aria-disabled={sub.disabled || undefined}
							onClick={() => !sub.disabled && onRun(sub.onSelect)}>
							<span className='menu-gutter' aria-hidden='true'>
								{sub.checked ? (
									<Check size={15} />
								) : sub.Icon ? (
									<sub.Icon size={16} />
								) : null}
							</span>
							<span className='menu-text'>{sub.label}</span>
							{sub.shortcut && <kbd>{sub.shortcut}</kbd>}
						</button>
					),
				)}
			</div>
		</div>
	);
}

/**
 * The Windows 11 context menu: a rounded acrylic sheet of icon-and-label rows
 * with an optional command bar on top, arrow-key navigation, and sub-menus
 * that fly out to the right.
 */
export default function ContextMenu({
	x,
	y,
	items,
	onClose,
	commands,
	bottomGutter = 56,
	label = 'Context menu',
}: {
	x: number;
	y: number;
	items: MenuEntry[];
	onClose: () => void;
	/** The icon strip Windows 11 puts above the list (cut / copy / rename …). */
	commands?: { label: string; Icon: LucideIcon; onSelect: () => void }[];
	/** Space to leave at the bottom of the screen, e.g. for the taskbar. */
	bottomGutter?: number;
	label?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [openSub, setOpenSub] = useState<number | null>(null);

	/* Rows that can take focus, in DOM order. */
	const rows = useCallback(
		() =>
			Array.from(
				ref.current?.querySelectorAll<HTMLElement>(
					':scope > .menu-list > [role="menuitem"]:not([aria-disabled="true"])',
				) ?? [],
			),
		[],
	);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		clamp(el, x, y, bottomGutter);
		el.focus({ preventScroll: true });
	}, [x, y, bottomGutter]);

	useEffect(() => {
		const dismiss = (e: Event) => {
			if (ref.current?.contains(e.target as Node)) return;
			onClose();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				onClose();
			}
		};
		/* `pointerdown` on the document closes; capture phase so a click that
		   also opens another menu does not immediately re-close it. */
		document.addEventListener('pointerdown', dismiss);
		window.addEventListener('blur', onClose);
		window.addEventListener('resize', onClose);
		window.addEventListener('keydown', onKey, true);
		return () => {
			document.removeEventListener('pointerdown', dismiss);
			window.removeEventListener('blur', onClose);
			window.removeEventListener('resize', onClose);
			window.removeEventListener('keydown', onKey, true);
		};
	}, [onClose]);

	const onKeyDown = (e: React.KeyboardEvent) => {
		const list = rows();
		if (!list.length) return;
		const i = list.indexOf(document.activeElement as HTMLElement);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			list[(i + 1 + list.length) % list.length]?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			list[(i - 1 + list.length) % list.length]?.focus();
		} else if (e.key === 'Home') {
			e.preventDefault();
			list[0]?.focus();
		} else if (e.key === 'End') {
			e.preventDefault();
			list[list.length - 1]?.focus();
		}
	};

	const run = (fn?: () => void) => {
		fn?.();
		onClose();
	};

	return (
		<div
			ref={ref}
			className='menu'
			role='menu'
			aria-label={label}
			tabIndex={-1}
			style={{ left: x, top: y }}
			onKeyDown={onKeyDown}
			onContextMenu={(e) => e.preventDefault()}>
			{commands && commands.length > 0 && (
				<div className='menu-cmds' role='group' aria-label='Quick actions'>
					{commands.map((c) => (
						<button
							key={c.label}
							type='button'
							role='menuitem'
							className='menu-cmd'
							title={c.label}
							aria-label={c.label}
							onClick={() => run(c.onSelect)}>
							<c.Icon size={16} aria-hidden='true' />
						</button>
					))}
				</div>
			)}

			<div className='menu-list'>
				{items.map((item, i) => {
					if (item.kind === 'separator')
						return <span key={i} className='menu-sep' role='separator' />;
					if (item.kind === 'label')
						return (
							<span key={i} className='menu-label'>
								{item.label}
							</span>
						);

					const hasSub = !!item.submenu?.length;
					return (
						<div
							key={item.label}
							className='menu-row'
							onPointerEnter={() => setOpenSub(hasSub ? i : null)}
							onPointerLeave={() => hasSub && setOpenSub(null)}>
							<button
								type='button'
								role='menuitem'
								className='menu-item'
								data-danger={item.danger || undefined}
								aria-disabled={item.disabled || undefined}
								aria-haspopup={hasSub || undefined}
								aria-expanded={hasSub ? openSub === i : undefined}
								onFocus={() => setOpenSub(hasSub ? i : null)}
								onKeyDown={(e) => {
									if (hasSub && (e.key === 'ArrowRight' || e.key === 'Enter')) {
										e.preventDefault();
										setOpenSub(i);
									}
								}}
								onClick={() => {
									if (item.disabled) return;
									if (hasSub) return setOpenSub(openSub === i ? null : i);
									run(item.onSelect);
								}}>
								<span className='menu-gutter' aria-hidden='true'>
									{item.checked ? (
										<Check size={15} />
									) : item.Icon ? (
										<item.Icon size={16} />
									) : null}
								</span>
								<span className='menu-text'>{item.label}</span>
								{item.shortcut && <kbd>{item.shortcut}</kbd>}
								{hasSub && (
									<ChevronRight size={14} aria-hidden='true' className='menu-more' />
								)}
							</button>

							{hasSub && openSub === i && (
								<Submenu label={item.label} items={item.submenu!} onRun={run} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
