'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	APP_BY_ID,
	DESKTOP_ITEMS,
	SHORTCUT_BY_ID,
	isAppId,
} from '@/components/apps/registry';
import { useWindowManager, TASKBAR_H } from '@/hooks/use-window-manager';
import type { TileArt } from '@/components/ui/app-tile';

export type DeskItem = {
	id: string;
	label: string;
	tile: TileArt;
	/** Present on shortcuts that leave the page. */
	href?: string;
	/** Shown by the icon's context menu, and by Start's all-apps list. */
	blurb: string;
	/** Drives the "Sort by type" ordering: apps before shortcuts. */
	kind: 'app' | 'link';
};

/** The three sizes Windows offers from the desktop's View sub-menu. */
export type IconSize = 'small' | 'medium' | 'large';
export type SortKey = 'default' | 'name' | 'type';

/** Tile artwork size and grid cell metrics for each View setting. */
export const ICON_METRICS: Record<
	IconSize,
	{ tile: number; cellW: number; cellH: number }
> = {
	small: { tile: 32, cellW: 76, cellH: 74 },
	medium: { tile: 46, cellW: 92, cellH: 92 },
	large: { tile: 64, cellW: 116, cellH: 116 },
};

const GRID_TOP = 12;

/**
 * Desktop icon state: what is selected, what opens, and how the arrow keys
 * walk the grid. Windows fills its desktop column-first, so Up/Down step one
 * cell and Left/Right jump a whole column.
 */
export function useDesktopIcons() {
	const { launch } = useWindowManager();
	const [selected, setSelected] = useState<string | null>(null);
	const [size, setSize] = useState<IconSize>('medium');
	const [sort, setSort] = useState<SortKey>('default');
	const [rows, setRows] = useState(6);

	const base = useMemo<DeskItem[]>(
		() =>
			DESKTOP_ITEMS.map(({ id, label }) => {
				if (isAppId(id)) {
					const app = APP_BY_ID[id];
					return { id, label, tile: app.tile, blurb: app.blurb, kind: 'app' };
				}
				const sc = SHORTCUT_BY_ID[id];
				return {
					id,
					label,
					tile: sc.tile,
					href: sc.href,
					blurb: sc.blurb,
					kind: 'link',
				};
			}),
		[],
	);

	const items = useMemo(() => {
		if (sort === 'name')
			return [...base].sort((a, b) => a.label.localeCompare(b.label));
		if (sort === 'type')
			return [...base].sort(
				(a, b) =>
					a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label),
			);
		return base;
	}, [base, sort]);

	/* How many icons fit in one column before the grid wraps. */
	useEffect(() => {
		const measure = () =>
			setRows(
				Math.max(
					1,
					Math.floor(
						(window.innerHeight - TASKBAR_H - GRID_TOP * 2) /
							ICON_METRICS[size].cellH,
					),
				),
			);
		measure();
		window.addEventListener('resize', measure, { passive: true });
		return () => window.removeEventListener('resize', measure);
	}, [size]);

	const openItem = useCallback(
		(id: string) => {
			if (isAppId(id)) return launch(id);
			const sc = SHORTCUT_BY_ID[id as keyof typeof SHORTCUT_BY_ID];
			if (sc) window.open(sc.href, '_blank', 'noopener,noreferrer');
		},
		[launch],
	);

	/** Returns the id the arrow key should move focus to, or null. */
	const step = useCallback(
		(from: string, key: string): string | null => {
			const i = items.findIndex((it) => it.id === from);
			if (i < 0) return null;
			const delta =
				key === 'ArrowDown' ? 1
				: key === 'ArrowUp' ? -1
				: key === 'ArrowRight' ? rows
				: key === 'ArrowLeft' ? -rows
				: 0;
			if (!delta) return null;
			const next = i + delta;
			return next >= 0 && next < items.length ? items[next].id : null;
		},
		[items, rows],
	);

	return {
		items,
		selected,
		setSelected,
		openItem,
		step,
		rows,
		size,
		setSize,
		sort,
		setSort,
		metrics: ICON_METRICS[size],
	};
}
