import { NextResponse } from 'next/server';

/**
 * Song search, proxied through the server.
 *
 * Apple's Search API does send `Access-Control-Allow-Origin: *`, so the
 * browser could call it directly — but it rate-limits per IP at roughly
 * twenty calls a minute. Going through here means the limit applies to this
 * one server rather than to each visitor behind a shared NAT, and Next's
 * fetch cache means a repeated search costs nothing at all.
 *
 * The response is trimmed to what the player draws. Apple returns about
 * thirty fields per track; shipping those to the client would be most of a
 * megabyte for a busy search.
 */

/**
 * Both are configuration, not secrets, so both carry a working default:
 * `.env*` is gitignored, and a deploy that never set them should still search
 * rather than fail. Matches the pattern `contact/route.ts` already uses.
 */
const ENDPOINT =
	process.env.MUSIC_SEARCH_ENDPOINT ?? 'https://itunes.apple.com/search';

/**
 * How long Next may serve a repeated search from its own cache. Zero is a
 * legitimate setting — it means "never cache" — so it is read rather than
 * treated as absent, which `Number(x) || default` would get wrong.
 */
const CACHE_SECONDS = (() => {
	const raw = process.env.MUSIC_CACHE_SECONDS;
	if (!raw) return 3600;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 ? n : 3600;
})();

export type Track = {
	id: number;
	title: string;
	artist: string;
	album: string;
	/** Square cover, requested larger than the default 100px. */
	artwork: string;
	/** The 30-second preview this player streams. */
	preview: string;
	/** Length of the *full* track, which is not what the preview plays. */
	durationMs: number;
	/** Apple Music page for the whole song. */
	url: string;
};

type AppleTrack = {
	trackId?: number;
	trackName?: string;
	artistName?: string;
	collectionName?: string;
	artworkUrl100?: string;
	previewUrl?: string;
	trackTimeMillis?: number;
	trackViewUrl?: string;
};

export async function GET(req: Request) {
	const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';
	if (!q) return NextResponse.json({ tracks: [] });
	if (q.length > 120) {
		return NextResponse.json({ error: 'Search term is too long.' }, { status: 400 });
	}

	const url = `${ENDPOINT}?${new URLSearchParams({
		term: q,
		entity: 'song',
		media: 'music',
		limit: '24',
	})}`;

	try {
		const res = await fetch(url, { next: { revalidate: CACHE_SECONDS } });
		if (!res.ok) {
			return NextResponse.json(
				{ error: 'The music service is not answering right now.' },
				{ status: 502 },
			);
		}
		const data: { results?: AppleTrack[] } = await res.json();

		const tracks: Track[] = (data.results ?? [])
			/* A track with no preview is not playable, so it is not a result. */
			.filter((t): t is AppleTrack & { previewUrl: string; trackId: number } =>
				Boolean(t.previewUrl && t.trackId),
			)
			.map((t) => ({
				id: t.trackId,
				title: t.trackName ?? 'Unknown track',
				artist: t.artistName ?? 'Unknown artist',
				album: t.collectionName ?? '',
				artwork: (t.artworkUrl100 ?? '').replace('100x100', '300x300'),
				preview: t.previewUrl,
				durationMs: t.trackTimeMillis ?? 0,
				url: t.trackViewUrl ?? '',
			}));

		return NextResponse.json({ tracks });
	} catch {
		return NextResponse.json(
			{ error: 'Could not reach the music service.' },
			{ status: 502 },
		);
	}
}
