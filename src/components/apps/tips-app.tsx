'use client';

import { useMemo, useState } from 'react';
import { LiBulb, LiKeyboard, LiLayers, LiCheckCircle } from '@/components/icons/line-icons';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SettingCard from '@/components/ui/setting-card';
import { SHORTCUTS, SHORTCUT_NOTE, TIP_PAGES } from '@/data/tips';

const PAGE_ICON = {
	start: LiBulb,
	built: LiLayers,
	missing: LiCheckCircle,
} as const;

/**
 * Tips, which Windows ships too — and which this desktop needs more, because
 * nothing on screen says a window can be snapped or that the cat is listening.
 *
 * It opens by itself once, on a visitor's first arrival, and never again. That
 * is the whole reason it is a window rather than an overlay: the first thing
 * anybody does here is drag, resize and close the thing explaining drag,
 * resize and close.
 */
export default function TipsApp() {
	const [active, setActive] = useState('start');

	const pages = useMemo<SettingsPage[]>(
		() => [
			...TIP_PAGES.map((p) => ({
				key: p.key,
				label: p.label,
				Icon: PAGE_ICON[p.key as keyof typeof PAGE_ICON],
			})),
			{ key: 'keys', label: 'Keyboard', Icon: LiKeyboard },
		],
		[],
	);

	const page = TIP_PAGES.find((p) => p.key === active);

	/* Which column to name first. Both are always shown — a macOS reader told
	   about Ctrl Alt learns something, and a Windows reader shown only ⊞
	   concludes the site is broken. */
	const onWindows =
		typeof navigator !== 'undefined' &&
		/win/i.test(
			(navigator as Navigator & { userAgentData?: { platform?: string } })
				.userAgentData?.platform ?? navigator.platform,
		);

	return (
		<SettingsShell
			pages={pages}
			active={active}
			onSelect={setActive}
			navLabel='Tips'
			title={page ? page.title : 'Keyboard'}
			subtitle={
				page ? page.subtitle : 'What works, and where the operating system wins'
			}>
			{page ? (
				page.tips.map((t) => (
					<SettingCard
						key={t.title}
						title={t.title}
						description={t.body}
						control={
							t.where ? <span className='tp-where'>{t.where}</span> : undefined
						}
					/>
				))
			) : (
				<>
					<SettingCard Icon={LiKeyboard} title='Shortcuts'>
						<dl className='st-specs tp-keys'>
							{SHORTCUTS.map((s) => (
								<div key={s.chord}>
									<dt>
										<kbd>{onWindows && s.alt ? s.alt : s.chord}</kbd>
										{s.alt && (
											<kbd className='tp-alt'>
												{onWindows ? s.chord : s.alt}
											</kbd>
										)}
									</dt>
									<dd>{s.does}</dd>
								</div>
							))}
						</dl>
					</SettingCard>

					<SettingCard
						Icon={LiBulb}
						title='Why two columns'
						description={SHORTCUT_NOTE}
					/>
				</>
			)}
		</SettingsShell>
	);
}
