'use client';

/**
 * "On this page" for the case study: one link per section.
 *
 * Plain anchors, so the list works with scripting off — which is how the
 * server document is read on a phone. Inside a window the click is handled
 * here instead: the pane scrolls, not the page, and the hidden server document
 * carries the same headings earlier in the DOM, so following the hash would
 * scroll to nothing. The heading is found inside *this* write-up and scrolled
 * into view within whatever scrolls it.
 */
export default function CaseStudyNav({
	items,
}: {
	items: { id: string; num: string; label: string }[];
}) {
	return (
		<nav className='cs-nav' aria-label='On this page'>
			<span className='cs-nav-label'>On this page</span>
			<ol className='cs-nav-list'>
				{items.map((item) => (
					<li key={item.id}>
						{/* The same number the heading carries, from the same source. */}
						<span className='cs-num' aria-hidden='true'>
							{item.num}
						</span>
						<a
							href={`#${item.id}`}
							onClick={(e) => {
								const root = e.currentTarget.closest('.cs');
								const target = root?.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`);
								if (!target) return;
								e.preventDefault();
								const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
								target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
							}}>
							{item.label}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
