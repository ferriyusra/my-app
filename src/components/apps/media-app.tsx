'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ExternalLink, Loader2, Music, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { LiSearch, LiVolume2, LiVolumeX } from '@/components/icons/line-icons';
import type { Track } from '@/app/api/music/search/route';

/**
 * A media player that searches Apple's catalogue and streams the previews.
 *
 * Those previews are thirty seconds — that is what the public API serves, and
 * no amount of client code changes it. Rather than let the player look broken
 * when a song stops early, the UI says so and links out to the full track.
 *
 * Full-length playback was investigated and dropped. Spotify's Web Playback
 * SDK now caps a development app at five allowlisted Premium users, so it
 * cannot serve a public page. YouTube can, but only behind a Google Cloud
 * project and an API key — too much setup to hang a portfolio feature on.
 * Audius streams full tracks with no key at all, but its catalogue is
 * independent artists: searching a mainstream name returns other people's
 * remixes, not the song you asked for.
 */

/** Long enough that typing a band name is one request, not eight. */
const DEBOUNCE_MS = 450;

const SUGGESTIONS = ['Daft Punk', 'Tulus', 'Radiohead', 'Rex Orange County'];

function clock(ms: number) {
	if (!Number.isFinite(ms) || ms <= 0) return '0:00';
	const total = Math.round(ms / 1000);
	return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function MediaApp() {
	const [query, setQuery] = useState('');
	const [tracks, setTracks] = useState<Track[]>([]);
	const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
	const [error, setError] = useState('');
	const [index, setIndex] = useState<number | null>(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);

	const audioRef = useRef<HTMLAudioElement>(null);

	/* Progress ticks several times a second. Writing it to the DOM keeps the
	   result list from re-rendering on every tick — the same reason the window
	   frame keeps its geometry out of state. */
	const seekRef = useRef<HTMLInputElement>(null);
	const elapsedRef = useRef<HTMLSpanElement>(null);
	const lengthRef = useRef<HTMLSpanElement>(null);

	const current = index === null ? null : (tracks[index] ?? null);

	/* ── LiSearch ──────────────────────────────────────────────── */

	const search = useCallback(async (term: string, signal: AbortSignal) => {
		if (!term.trim()) {
			setTracks([]);
			setStatus('idle');
			return;
		}
		setStatus('loading');
		setError('');
		try {
			const res = await fetch(`/api/music/search?q=${encodeURIComponent(term)}`, {
				signal,
			});
			const data: { tracks?: Track[]; error?: string } = await res.json();
			if (!res.ok) throw new Error(data.error ?? 'Search failed.');
			setTracks(data.tracks ?? []);
			setStatus('done');
		} catch (err) {
			if ((err as Error).name === 'AbortError') return;
			setError((err as Error).message || 'Search failed.');
			setStatus('error');
		}
	}, []);

	useEffect(() => {
		const ctrl = new AbortController();
		const t = setTimeout(() => void search(query, ctrl.signal), DEBOUNCE_MS);
		return () => {
			clearTimeout(t);
			ctrl.abort();
		};
	}, [query, search]);

	/* ── Transport ───────────────────────────────────────────── */

	const playAt = (i: number) => {
		if (i < 0 || i >= tracks.length) return;
		setIndex(i);
		setPlaying(true);
	};

	const step = (by: number) => {
		if (index === null) return;
		playAt((index + by + tracks.length) % tracks.length);
	};

	const writeProgress = useCallback((seconds: number, duration: number) => {
		if (seekRef.current) {
			seekRef.current.value = String(duration ? (seconds / duration) * 100 : 0);
		}
		if (elapsedRef.current) elapsedRef.current.textContent = clock(seconds * 1000);
		if (lengthRef.current) lengthRef.current.textContent = clock(duration * 1000);
	}, []);

	/* Loading a new source and starting it is one job, so it lives in one
	   effect keyed on the track rather than being spread across handlers. */
	useEffect(() => {
		const el = audioRef.current;
		if (!el || !current) return;
		writeProgress(0, 0);
		el.src = current.preview;
		el.load();
		void el.play().catch(() => setPlaying(false));
	}, [current, writeProgress]);

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		if (playing) void el.play().catch(() => setPlaying(false));
		else el.pause();
	}, [playing]);

	const togglePlay = () => setPlaying((v) => !v);

	const onAudioTime = () => {
		const el = audioRef.current;
		if (el) writeProgress(el.currentTime, el.duration || 0);
	};

	const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const el = audioRef.current;
		if (el?.duration) el.currentTime = (Number(e.target.value) / 100) * el.duration;
	};

	const toggleMute = () => {
		const next = !muted;
		setMuted(next);
		const el = audioRef.current;
		if (el) el.muted = next;
	};

	return (
		<div className='mp'>
			<header className='mp-head'>
				<label className='mp-search'>
					<LiSearch size={16} aria-hidden='true' />
					<input
						type='search'
						value={query}
						placeholder='Search for a song, artist or album'
						aria-label='Search for music'
						onChange={(e) => setQuery(e.target.value)}
					/>
					{status === 'loading' && (
						<Loader2 size={15} className='spin' aria-hidden='true' />
					)}
				</label>
			</header>

			<div className='mp-body'>
				{status === 'idle' && (
					<div className='mp-empty'>
						<Music size={30} aria-hidden='true' />
						<p>
							LiSearch Apple&rsquo;s catalogue and play a track.
							<br />
							Previews are 30 seconds — the full song is one click away.
						</p>
						<div className='mp-chips'>
							{SUGGESTIONS.map((s) => (
								<button key={s} type='button' onClick={() => setQuery(s)}>
									{s}
								</button>
							))}
						</div>
					</div>
				)}

				{status === 'error' && (
					<p className='mp-error'>
						<AlertCircle size={16} aria-hidden='true' /> {error}
					</p>
				)}

				{status === 'done' && tracks.length === 0 && (
					<p className='mp-error'>Nothing matched &ldquo;{query}&rdquo;.</p>
				)}

				{tracks.length > 0 && (
					<ul className='mp-list' aria-label='Search results'>
						{tracks.map((t, i) => (
							<li key={t.id}>
								<button
									type='button'
									className='mp-row'
									data-current={i === index || undefined}
									aria-label={`Play ${t.title} by ${t.artist}`}
									onClick={() => (i === index ? togglePlay() : playAt(i))}>
									<span className='mp-cover'>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={t.artwork} alt='' loading='lazy' width={44} height={44} />
										<span className='mp-cover-play' aria-hidden='true'>
											{i === index && playing ? <Pause size={15} /> : <Play size={15} />}
										</span>
									</span>
									<span className='mp-meta'>
										<strong>{t.title}</strong>
										<small>
											{t.artist}
											{t.album ? ` · ${t.album}` : ''}
										</small>
									</span>
									<span className='mp-len'>{clock(t.durationMs)}</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<footer className='mp-now' data-active={!!current || undefined}>
				<span className='mp-now-cover' aria-hidden='true'>
					{current ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={current.artwork} alt='' width={44} height={44} />
					) : (
						<Music size={18} />
					)}
				</span>

				<span className='mp-now-meta'>
					<strong>{current ? current.title : 'Nothing playing'}</strong>
					<small>
						{current ? current.artist : 'Pick a track to start'}
					</small>
				</span>

				<span className='mp-controls'>
					<button
						type='button'
						aria-label='Previous track'
						disabled={index === null}
						onClick={() => step(-1)}>
						<SkipBack size={16} aria-hidden='true' />
					</button>
					<button
						type='button'
						className='mp-play'
						aria-label={playing ? 'Pause' : 'Play'}
						disabled={!current}
						onClick={togglePlay}>
						{playing ? (
							<Pause size={17} aria-hidden='true' />
						) : (
							<Play size={17} aria-hidden='true' />
						)}
					</button>
					<button
						type='button'
						aria-label='Next track'
						disabled={index === null}
						onClick={() => step(1)}>
						<SkipForward size={16} aria-hidden='true' />
					</button>
				</span>

				<span className='mp-seek'>
					<span ref={elapsedRef} className='mp-time'>
						0:00
					</span>
					<input
						ref={seekRef}
						type='range'
						min={0}
						max={100}
						defaultValue={0}
						step={0.1}
						aria-label='Seek'
						disabled={!current}
						onChange={seek}
					/>
					<span ref={lengthRef} className='mp-time'>
						0:00
					</span>
				</span>

				<button
					type='button'
					className='mp-mute'
					aria-label={muted ? 'Unmute' : 'Mute'}
					onClick={toggleMute}>
					{muted ? (
						<LiVolumeX size={16} aria-hidden='true' />
					) : (
						<LiVolume2 size={16} aria-hidden='true' />
					)}
				</button>

				{current?.url && (
					<a
						className='mp-full'
						href={current.url}
						target='_blank'
						rel='noopener noreferrer'
						title='Previews are 30 seconds — open the full track'>
						<ExternalLink size={14} aria-hidden='true' />
						Full track
					</a>
				)}

				<audio
					ref={audioRef}
					onTimeUpdate={onAudioTime}
					onLoadedMetadata={onAudioTime}
					onEnded={() => step(1)}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
				/>
			</footer>
		</div>
	);
}
