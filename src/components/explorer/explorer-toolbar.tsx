'use client';

import {
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	LayoutGrid,
	List,
	RefreshCw,
	Rows3,
	Search,
	SortAsc,
} from 'lucide-react';

export type ViewMode = 'grid' | 'list' | 'details';
export type SortKey = 'name' | 'type';

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
					<ArrowLeft size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Forward'
					disabled={!canForward}
					onClick={onForward}>
					<ArrowRight size={16} aria-hidden='true' />
				</button>
				<button
					type='button'
					className='xp-icon-btn'
					aria-label='Up one level'
					disabled={!canUp}
					onClick={onUp}>
					<ArrowUp size={16} aria-hidden='true' />
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
				<Search size={14} aria-hidden='true' />
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
					aria-label={`Sort by ${sort === 'name' ? 'type' : 'name'}`}
					title={`Sorted by ${sort}`}
					onClick={() => onSort(sort === 'name' ? 'type' : 'name')}>
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
