'use client';

import { LayoutGrid, List, RefreshCw, Rows3, SortAsc } from 'lucide-react';
import { LiArrowLeft, LiArrowRight, LiArrowUp, LiSearch } from '@/components/icons/line-icons';

export type ViewMode = 'grid' | 'list' | 'details';
/**
 * 'default' is the order the folder is in — featured projects first,
 * roles newest first, decisions in the order they were reversed. The folder
 * used to compute that order and then throw it away on an alphabetical sort
 * it could never be turned off.
 */
export type SortKey = 'default' | 'name' | 'type';

const NEXT_SORT: Record<SortKey, SortKey> = {
	default: 'name',
	name: 'type',
	type: 'default',
};

const SORT_LABEL: Record<SortKey, string> = {
	default: 'folder order',
	name: 'name',
	type: 'type',
};

const VIEWS: { key: ViewMode; label: string; Icon: typeof LayoutGrid }[] = [
	{ key: 'grid', label: 'Large icons', Icon: LayoutGrid },
	{ key: 'list', label: 'List', Icon: List },
	{ key: 'details', label: 'Details', Icon: Rows3 },
];

/**
 * Explorer's command bar: history buttons on the left, view and sort on the
 * right, and the search box that filters the current folder.
 */
export default function ExplorerToolbar({
	canBack,
	canForward,
	canUp,
	onBack,
	onForward,
	onUp,
	onRefresh,
	view,
	onView,
	sort,
	onSort,
	query,
	onQuery,
	searchLabel,
}: {
	canBack: boolean;
	canForward: boolean;
	canUp: boolean;
	onBack: () => void;
	onForward: () => void;
	onUp: () => void;
	onRefresh: () => void;
	view: ViewMode;
	onView: (v: ViewMode) => void;
	sort: SortKey;
	onSort: (s: SortKey) => void;
	query: string;
	onQuery: (q: string) => void;
	searchLabel: string;
}) {
	return (
		<div className='xp-toolbar'>
			<div className='xp-nav-btns'>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Back'
					disabled={!canBack}
					onClick={onBack}>
					<LiArrowLeft size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Forward'
					disabled={!canForward}
					onClick={onForward}>
					<LiArrowRight size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Up one level'
					disabled={!canUp}
					onClick={onUp}>
					<LiArrowUp size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Refresh'
					onClick={onRefresh}>
					<RefreshCw size={15} aria-hidden='true' />
				</button>
			</div>

			<label className='xp-search'>
				<LiSearch size={14} aria-hidden='true' />
				<input
					type='search'
					value={query}
					placeholder={searchLabel}
					aria-label={searchLabel}
					onChange={(e) => onQuery(e.target.value)}
				/>
			</label>

			<div className='xp-view-btns' role='group' aria-label='View'>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label={`Sort by ${SORT_LABEL[NEXT_SORT[sort]]}`}
					title={`Sorted by ${SORT_LABEL[sort]}`}
					data-active={sort !== 'default' || undefined}
					onClick={() => onSort(NEXT_SORT[sort])}>
					<SortAsc size={16} aria-hidden='true' />
				</button>
				{VIEWS.map(({ key, label, Icon }) => (
					<button
						key={key}
						type='button'
						className='xp-icon-btn'
						data-active={view === key || undefined}
						aria-pressed={view === key}
						aria-label={label}
						title={label}
						onClick={() => onView(key)}>
						<Icon size={16} aria-hidden='true' />
					</button>
				))}
			</div>
		</div>
	);
}
