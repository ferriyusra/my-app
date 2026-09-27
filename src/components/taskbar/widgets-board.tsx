'use client';

import { FileCode2, History } from 'lucide-react';
import Flyout from '@/components/ui/flyout';
import CareerTrack from '@/components/apps/career/track';
import { chapters } from '@/components/apps/career/world';
import { useWindowManager } from '@/hooks/use-window-manager';
import { sendIntent } from '@/hooks/use-app-intent';
import { useClock } from '@/hooks/use-clock';
import { profile } from '@/data/profile';
import { caseStudy, caseStudyLength } from '@/data/case-study';
import { monthsLabel } from '@/lib/skill-evidence';
import { careerSummary, firstSentence } from '@/lib/widgets';

/* Computed once: none of it changes while the page is open. */
const TRACK = chapters();
const SUMMARY = careerSummary();
const CASE_LENGTH = caseStudyLength();
const CASE_LINE = firstSentence(caseStudy.summary);

/**
 * Windows 11's Widgets board, from the button at the left of the taskbar or
 * ⊞ W.
 *
 * Windows fills it with weather and news. A portfolio's glanceable facts are
 * the shape of the career and the one piece of work written up at depth, so
 * those are the two widgets — and nothing else, by the owner's choice: a
 * board of filler is the thing Windows' own is criticised for. Every figure
 * comes from the record through the same functions Experience and Career.exe
 * use, so the board cannot state a number the windows do not.
 *
 * Fixed, not customisable. Windows offers "Add widgets" and a menu per card;
 * with two widgets written for one reader, that would be machinery with
 * nothing to arrange.
 *
 * The buttons open windows through `launch`, which closes the board, as
 * picking anything in a Windows flyout does.
 */
export default function WidgetsBoard({ onClose }: { onClose: () => void }) {
	const { launch } = useWindowManager();
	const { jakarta } = useClock();

	const openCase = () => {
		sendIntent('experience', 'case');
		launch('experience');
	};

	return (
		<Flyout
			className='wg'
			label='Widgets'
			anchor='left'
			from='left'
			onClose={onClose}
			ignoreSelector='.tb-widget'>
			<header className='wg-head'>
				<div>
					<p className='wg-time' suppressHydrationWarning>
						{jakarta || '--:--'}
					</p>
					<p className='wg-where'>In Jakarta · GMT+7</p>
				</div>
				<span className='wg-avatar' aria-hidden='true'>
					{profile.initials}
				</span>
			</header>

			<div className='wg-grid'>
				<section className='wg-card' aria-labelledby='wg-career'>
					<h2 className='wg-title' id='wg-career'>
						<History size={14} aria-hidden='true' /> Career
					</h2>
					<p className='wg-lead'>
						{SUMMARY.roles} roles since {SUMMARY.since} ·{' '}
						{monthsLabel(SUMMARY.months)} in role
					</p>
					{/* The same strip Career.exe's Summary draws, static: each role as
					    wide as the months it lasted. */}
					<CareerTrack chapters={TRACK} />
					<div className='wg-foot'>
						<p className='wg-now'>
							Now <strong>{SUMMARY.current.role}</strong> at {SUMMARY.current.short}
						</p>
						<button
							type='button'
							className='fl-btn fl-btn-standard'
							onClick={() => launch('experience')}>
							Open Experience
						</button>
					</div>
				</section>

				<section className='wg-card' aria-labelledby='wg-case'>
					<h2 className='wg-title' id='wg-case'>
						<FileCode2 size={14} aria-hidden='true' /> Case study
					</h2>
					<h3 className='wg-case-title'>{caseStudy.title}</h3>
					<p className='wg-meta'>
						{caseStudy.at} · {caseStudy.year} · {CASE_LENGTH.sections} sections ·
						about {CASE_LENGTH.minutes} min
					</p>
					<p className='wg-body'>{CASE_LINE}</p>
					<ul className='wg-chips' aria-label='Stack'>
						{caseStudy.stack.slice(0, 4).map((t) => (
							<li key={t}>{t}</li>
						))}
					</ul>
					<div className='wg-foot'>
						<button
							type='button'
							className='fl-btn fl-btn-standard'
							onClick={openCase}>
							Read the case study
						</button>
					</div>
				</section>
			</div>
		</Flyout>
	);
}
