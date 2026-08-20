'use client';

import { useState } from 'react';
import {
	BadgeCheck,
	Cat,
	Info,
	Monitor,
	ShieldAlert,
	Moon,
	Paintbrush,
	Sun,
	SunMedium,
	Volume2,
} from 'lucide-react';
import SettingsShell, { type SettingsPage } from '@/components/ui/settings-shell';
import SettingCard from '@/components/ui/setting-card';
import ToggleSwitch from '@/components/ui/toggle-switch';
import {
	useShell,
	ACCENTS,
	WALLPAPERS,
	wallpaperLabel,
	type WallpaperId,
} from '@/context/shell-context';
import { useTheme } from '@/components/theme-provider';
import { profile } from '@/data/profile';

const PAGES: SettingsPage[] = [
	{ key: 'personalisation', label: 'Personalisation', Icon: Paintbrush },
	{ key: 'system', label: 'System', Icon: Monitor },
	{ key: 'about', label: 'About', Icon: Info },
];

const STACK: [string, string][] = [
	['Framework', 'Next.js 16 · App Router'],
	['UI', 'React 19 · TypeScript · Tailwind CSS v4'],
	['Motion', 'Framer Motion'],
	['Icons', 'Lucide, plus hand-drawn Fluent-style artwork'],
	['Sound', 'Web Audio — synthesised, no audio files'],
	['Wallpaper', 'CSS gradients — no image bytes'],
];

/**
 * Settings: the app the Personalise command opens.
 *
 * Everything on this page changes the running shell, which is the point —
 * a settings screen whose switches do nothing is scenery.
 */
export default function SettingsApp() {
	const [page, setPage] = useState('personalisation');
	const {
		accent,
		setAccent,
		wallpaper,
		setWallpaper,
		customWallpapers,
		activated,
		activate,
		catOn,
		setCatOn,
		catBusy,
		feedCat,
		sound,
		setSound,
		volume,
		setVolume,
		brightness,
		setBrightness,
	} = useShell();
	const { theme, toggle, mounted } = useTheme();
	const dark = mounted && theme === 'dark';

	/* Drawn and photographic backgrounds sit in one list. Which is which is an
	   implementation detail, not something a visitor picking one needs told. */
	const backgrounds = [
		...WALLPAPERS.map((w) => ({
			id: w.id as WallpaperId,
			label: w.label,
			wall: w.id as string,
			art: undefined as React.CSSProperties | undefined,
		})),
		...customWallpapers.map((file) => ({
			id: `custom:${file}` as WallpaperId,
			label: wallpaperLabel(file),
			wall: 'custom',
			art: {
				backgroundImage: `url("/background/${encodeURIComponent(file)}")`,
			} as React.CSSProperties,
		})),
	];

	return (
		<SettingsShell
			pages={PAGES}
			active={page}
			onSelect={setPage}
			navLabel='Settings sections'
			title={PAGES.find((p) => p.key === page)?.label ?? 'Settings'}
			subtitle='These controls change this desktop, and are remembered on this device.'>
			{page === 'personalisation' && (
				<>
					<SettingCard
						Icon={dark ? Moon : Sun}
						title='Colour mode'
						description='Light and dark both ship a full Fluent palette.'
						control={
							<div className='seg' role='group' aria-label='Colour mode'>
								<button
									type='button'
									data-active={!dark || undefined}
									aria-pressed={!dark}
									onClick={() => dark && toggle()}>
									<Sun size={14} aria-hidden='true' /> Light
								</button>
								<button
									type='button'
									data-active={dark || undefined}
									aria-pressed={dark}
									onClick={() => !dark && toggle()}>
									<Moon size={14} aria-hidden='true' /> Dark
								</button>
							</div>
						}
					/>

					<SettingCard
						Icon={Paintbrush}
						title='Accent colour'
						description='Drives buttons, indicators, focus rings and selection.'>
						<div className='sw-swatches' role='radiogroup' aria-label='Accent colour'>
							{ACCENTS.map((a) => (
								<button
									key={a.id}
									type='button'
									role='radio'
									aria-checked={accent === a.id}
									aria-label={a.label}
									title={a.label}
									className='sw-swatch'
									data-active={accent === a.id || undefined}
									style={{ background: a.swatch }}
									onClick={() => setAccent(a.id)}
								/>
							))}
						</div>
					</SettingCard>

					<SettingCard
						Icon={Monitor}
						title='Background'
						description='The abstract ones are drawn in CSS rather than downloaded.'>
						<div className='sw-walls' role='radiogroup' aria-label='Background'>
							{backgrounds.map((w) => (
								<button
									key={w.id}
									type='button'
									role='radio'
									aria-checked={wallpaper === w.id}
									className='sw-wall'
									data-wall={w.wall}
									data-active={wallpaper === w.id || undefined}
									onClick={() => setWallpaper(w.id)}>
									<span
										className='sw-wall-art'
										aria-hidden='true'
										style={w.art}
									/>
									{w.label}
								</button>
							))}
						</div>
					</SettingCard>
				</>
			)}

			{page === 'system' && (
				<>
					{/* Where the watermark in the corner says to go. */}
					<SettingCard
						Icon={activated ? BadgeCheck : ShieldAlert}
						tint={
							activated
								? 'color-mix(in srgb, var(--success) 16%, transparent)'
								: undefined
						}
						title='Activation'
						description={
							activated
								? 'Windows is activated.'
								: 'Windows is not activated. Activate Windows to remove the watermark from the desktop.'
						}
						control={
							activated ? (
								<span className='st-activated'>
									<BadgeCheck size={14} aria-hidden='true' /> Active
								</span>
							) : (
								<button
									type='button'
									className='fl-btn fl-btn-accent'
									onClick={activate}>
									Activate Windows
								</button>
							)
						}
					/>

					<SettingCard Icon={Cat} title='Desktop cat'>
						<ToggleSwitch
							checked={catOn}
							onChange={setCatOn}
							disabled={catBusy}
							label='Let the cat out'
							description={
								catBusy
									? catOn
										? 'Coming out of its house…'
										: 'Walking home…'
									: 'It naps, grooms and comes when there is food. Click to pet it.'
							}
						/>
						{catOn && (
							<button
								type='button'
								className='fl-btn fl-btn-standard st-feed'
								disabled={catBusy}
								onClick={feedCat}>
								<Cat size={15} aria-hidden='true' /> Put food down
							</button>
						)}
					</SettingCard>

					<SettingCard Icon={Volume2} title='Sound'>
						<ToggleSwitch
							checked={sound}
							onChange={setSound}
							label='System sounds'
							description='Short chimes on open, close and notification. Off by default.'
						/>
						<label className='st-slider'>
							<span>Volume</span>
							<input
								type='range'
								min={0}
								max={100}
								value={Math.round(volume * 100)}
								aria-label='Cue volume'
								onChange={(e) => setVolume(Number(e.target.value) / 100)}
							/>
							<output>{Math.round(volume * 100)}%</output>
						</label>
					</SettingCard>

					<SettingCard Icon={SunMedium} title='Display'>
						<label className='st-slider'>
							<span>Brightness</span>
							<input
								type='range'
								min={35}
								max={100}
								value={Math.round(brightness * 100)}
								aria-label='Screen brightness'
								onChange={(e) => setBrightness(Number(e.target.value) / 100)}
							/>
							<output>{Math.round(brightness * 100)}%</output>
						</label>
					</SettingCard>
				</>
			)}

			{page === 'about' && (
				<>
					<SettingCard
						Icon={Info}
						title='About this desktop'
						description={`A portfolio for ${profile.name}, built as a Windows 11 shell rather than a scrolling page. Every window, menu and flyout is real UI — nothing here is a screenshot.`}
					/>
					<SettingCard Icon={Monitor} title='Specifications'>
						<dl className='st-specs'>
							{STACK.map(([k, v]) => (
								<div key={k}>
									<dt>{k}</dt>
									<dd>{v}</dd>
								</div>
							))}
						</dl>
					</SettingCard>
				</>
			)}
		</SettingsShell>
	);
}
