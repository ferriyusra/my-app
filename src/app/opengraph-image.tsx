import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { color } from '@/lib/palette';

/* Rendered by Next at build time. Without it, every share of the site on
   LinkedIn, X or WhatsApp showed a blank preview card. */
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The share card as one Grid sheet: the claim on white, the five places worked
 * along the foot with the current one in the mark red, and an ultramarine
 * field from the right holding its first year, as the page's first screen does.
 *
 * Satori cannot read CSS custom properties, so the colours come through
 * `palette.ts`, which reads them out of tokens.css. The face is the renderer's
 * own sans: declaring Radio Canada here would claim a face that does not render.
 */
export default function OpengraphImage() {
	const current = experiences.find((e) => e.current) ?? experiences[0];

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					background: color('paper'),
					color: color('ink'),
					fontFamily: 'sans-serif',
				}}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						width: 800,
						padding: 64,
					}}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26 }}>
							<div style={{ width: 30, height: 30, background: color('mark') }} />
							{profile.name}
						</div>
						<div style={{ marginTop: 28, fontSize: 60, lineHeight: 1, letterSpacing: -2, fontWeight: 700 }}>
							{profile.headline}
						</div>
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 4, fontSize: 34, letterSpacing: -1 }}>
						{experiences.map((e) => (
							<div key={e.short} style={{ display: 'flex', marginRight: 28, color: e.current ? color('mark') : color('ink') }}>
								{e.short}
							</div>
						))}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						flexGrow: 1,
						padding: 40,
						background: color('field'),
						color: color('field-ink'),
					}}>
					<div style={{ display: 'flex', fontSize: 120, lineHeight: 0.9, letterSpacing: -5 }}>
						{current.startISO.slice(0, 4)}
					</div>
					<div style={{ display: 'flex', marginTop: 12, fontSize: 22 }}>
						{`Joined ${current.short}${current.current ? ', still there' : ''}`}
					</div>
				</div>
			</div>
		),
		size,
	);
}
