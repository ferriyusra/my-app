'use client';

import { useEffect, useRef } from 'react';
import DesktopIcon from './desktop-icon';
import type { DeskItem } from '@/hooks/use-desktop-icons';

/**
 * The desktop grid.
 *
 * Windows fills its desktop column-first — down the left edge, then a second
 * column — so the grid is laid out with `grid-auto-flow: column` and a row
 * count measured from the viewport. Arrow keys walk it the same way.
 */
export default function DesktopIcons({
	items,
	selected,
	marked,
	onDragStart,
	rows,
	metrics,
	onSelect,
	onOpen,
	onStep,
	onContextMenu,
}: {
	items: DeskItem[];
	selected: string | null;
	/** Everything a marquee picked up; the focused one stays `selected`. */
	marked: string[];
	onDragStart: (e: React.PointerEvent, id: string) => void;
	rows: number;
	metrics: { tile: number; cellW: number; cellH: number };
	onSelect: (id: string) => void;
	onOpen: (id: string) => void;
	onStep: (from: string, key: string) => string | null;
	onContextMenu: (e: React.MouseEvent, item: DeskItem) => void;
}) {
	const ref = useRef<HTMLUListElement>(null);
	/* Focus follows the arrow keys, so the move has to happen after the
	   selection re-renders the roving tabindex. */
	const pending = useRef<string | null>(null);

	useEffect(() => {
		const id = pending.current;
		if (!id) return;
		pending.current = null;
		ref.current
			?.querySelector<HTMLElement>(`[data-icon-id="${CSS.escape(id)}"]`)
			?.focus();
	});

	return (
		<ul
			ref={ref}
			className='desk-icons'
			aria-label='Desktop'
			style={{
				gridTemplateRows: `repeat(${rows}, ${metrics.cellH}px)`,
				gridAutoColumns: `${metrics.cellW}px`,
			}}>
			{items.map((item, i) => (
				<li key={item.id}>
					<DesktopIcon
						id={item.id}
						label={item.label}
						tile={item.tile}
						href={item.href}
						tileSize={metrics.tile}
						selected={selected === item.id || marked.includes(item.id)}
						/* Exactly one cell is in the tab order: the selected one, or
						   the first when nothing is selected. */
						tabbable={selected ? selected === item.id : i === 0}
						onSelect={() => onSelect(item.id)}
						onOpen={() => onOpen(item.id)}
						onKeyDown={(e) => {
							const next = onStep(item.id, e.key);
							if (!next) return;
							e.preventDefault();
							onSelect(next);
							pending.current = next;
						}}
						onContextMenu={(e) => onContextMenu(e, item)}
						onDragStart={(e) => onDragStart(e, item.id)}
					/>
				</li>
			))}
		</ul>
	);
}
