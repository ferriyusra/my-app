'use client';

import {
	Bell,
	Moon,
	Settings as SettingsGlyph,
	Sun,
	Volume2,
	VolumeX,
	Wifi,
	SunMedium,
	Image as ImageIcon,
} from 'lucide-react';
import { useShell, WALLPAPERS } from '@/context/shell-context';
import { useTheme } from '@/components/theme-provider';
import { useWindowManager } from '@/hooks/use-window-manager';
import Flyout from '@/components/ui/flyout';

/**
 * Windows 11's Quick Settings panel.
 *
 * Every tile here changes something real. A row of Wi-Fi and Bluetooth
 * switches that toggle nothing would be the same decorative furniture the
 * rest of this shell avoids, so the grid carries the settings this desktop
 * actually has: theme, sound, wallpaper, and the two sliders.
 */
export default function QuickSettings({ onClose }: { onClose: () => void }) {
	const {
		sound,
		setSound,
		volume,
		setVolume,
		brightness,
		setBrightness,
		wallpaper,
		setWallpaper,
		notifications,
		openFlyout,
	} = useShell();
	const { theme, toggle, mounted } = useTheme();
	const { launch } = useWindowManager();
	const dark = mounted && theme === 'dark';

	const nextWallpaper = () => {
		const i = WALLPAPERS.findIndex((w) => w.id === wallpaper);
		setWallpaper(WALLPAPERS[(i + 1) % WALLPAPERS.length].id);
	};

	return (
		<Flyout
			className='qs'
			label='Quick settings'
			anchor='right'
			onClose={onClose}
			ignoreSelector='.tb-tray-group'>
			<div className='qs-grid'>
				<button
					type='button'
					className='qs-tile'
					data-on={dark || undefined}
					aria-pressed={dark}
					onClick={toggle}>
					<span className='qs-tile-icon' aria-hidden='true'>
						{dark ? <Moon size={18} /> : <Sun size={18} />}
					</span>
					<span className='qs-tile-label'>
						{dark ? 'Dark mode' : 'Light mode'}
					</span>
				</button>

				<button
					type='button'
					className='qs-tile'
					data-on={sound || undefined}
					aria-pressed={sound}
					onClick={() => setSound(!sound)}>
					<span className='qs-tile-icon' aria-hidden='true'>
						{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
					</span>
					<span className='qs-tile-label'>
						{sound ? 'Sounds on' : 'Sounds off'}
					</span>
				</button>

				<button type='button' className='qs-tile' onClick={nextWallpaper}>
					<span className='qs-tile-icon' aria-hidden='true'>
						<ImageIcon size={18} />
					</span>
					<span className='qs-tile-label'>
						{WALLPAPERS.find((w) => w.id === wallpaper)?.label}
					</span>
				</button>

				<button
					type='button'
					className='qs-tile'
					data-on
					onClick={() => {
						onClose();
						openFlyout('notifications');
					}}>
					<span className='qs-tile-icon' aria-hidden='true'>
						<Bell size={18} />
					</span>
					<span className='qs-tile-label'>
						{notifications.length
							? `${notifications.length} new`
							: 'Notifications'}
					</span>
				</button>
			</div>

			<label className='qs-slider'>
				<SunMedium size={17} aria-hidden='true' />
				<input
					type='range'
					min={35}
					max={100}
					value={Math.round(brightness * 100)}
					aria-label='Screen brightness'
					onChange={(e) => setBrightness(Number(e.target.value) / 100)}
				/>
			</label>

			<label className='qs-slider'>
				{volume > 0 ? (
					<Volume2 size={17} aria-hidden='true' />
				) : (
					<VolumeX size={17} aria-hidden='true' />
				)}
				<input
					type='range'
					min={0}
					max={100}
					value={Math.round(volume * 100)}
					aria-label='Cue volume'
					onChange={(e) => setVolume(Number(e.target.value) / 100)}
				/>
			</label>

			<footer className='qs-foot'>
				<span className='qs-net'>
					<Wifi size={15} aria-hidden='true' />
					Connected
				</span>
				<button
					type='button'
					className='qs-more'
					aria-label='Open Settings'
					onClick={() => {
						onClose();
						launch('settings');
					}}>
					<SettingsGlyph size={16} aria-hidden='true' />
				</button>
			</footer>
		</Flyout>
	);
}
