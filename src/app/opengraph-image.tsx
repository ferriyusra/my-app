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
 * The share card as one Blueprint sheet: the Prussian-blue paper inside a
 * double keyline, the claim in capitals in the white line ink, and along the
 * foot a title block of the name and the five places worked, the current one
 * first.
 *
 * Satori cannot read CSS custom properties, so the colours come through
 * `palette.ts`, which reads them out of tokens.css. The face is the renderer's
 * own sans: declaring Chakra Petch here would claim a face that does not
 * render.
 */
export default function OpengraphImage() {
	const ink = color('ink');
	const rule = color('rule');

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					padding: 28,
					background: color('paper'),
					color: ink,
					fontFamily: 'sans-serif',
				}}>
				<div style={{ display: 'flex', flexGrow: 1, padding: 5, border: `1px solid ${rule}` }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							flexGrow: 1,
							padding: 48,
							border: `1px solid ${color('muted')}`,
						}}>
						<div style={{ display: 'flex', fontSize: 22, color: color('ink-2') }}>
							{`${profile.role}, ${profile.location}`}
						</div>
						<div
							style={{
								display: 'flex',
								maxWidth: 900,
								fontSize: 70,
								lineHeight: 1.02,
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: -1,
							}}>
							{profile.headline}
						</div>
						<div style={{ display: 'flex', borderTop: `2px solid ${rule}`, paddingTop: 18 }}>
							<div style={{ display: 'flex', flexDirection: 'column', marginRight: 48 }}>
								<div style={{ display: 'flex', fontSize: 16, color: color('muted') }}>Drawn by</div>
								<div style={{ display: 'flex', fontSize: 26 }}>{profile.name}</div>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', fontSize: 16, color: color('muted') }}>Worked at</div>
								<div style={{ display: 'flex', fontSize: 26 }}>
									{experiences.map((e) => e.short).join(', ')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
		size,
	);
}
