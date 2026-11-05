/**
 * "On this page" for the case study: one link per section.
 *
 * Plain anchors and no script. The write-up is the page now, not a pane inside
 * a window, so following the hash scrolls the page, which is what a reader and
 * the browser's back button both expect.
 */
export default function CaseStudyNav({
	items,
}: {
	items: { id: string; num: string; label: string }[];
}) {
	return (
		<nav className='cs-nav' aria-label='On this page'>
			<p className='cs-nav-label'>On this page</p>
			<ol className='cs-nav-list'>
				{items.map((item) => (
					<li key={item.id}>
						{/* The same number the heading carries, from the same source. */}
						<span className='cs-num' aria-hidden='true'>
							{item.num}
						</span>
						<a href={`#${item.id}`}>{item.label}</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
