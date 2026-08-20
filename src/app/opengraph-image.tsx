import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

/* Rendered at build/request time by Next. Without this, every share of the
   site on LinkedIn / X / WhatsApp showed a blank preview card. */
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					background: '#f5f5f5',
					padding: 72,
					/* Satori only ships a sans fallback, so the card does not pick up
					   Instrument Serif the way the site does. Declaring `serif` here
					   would be a lie about what renders. */
					fontFamily: 'sans-serif',
				}}>
				{/* Top row: avatar tile + availability */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 104,
							height: 104,
							borderRadius: 8,
							background: '#0f6cbd',
							border: '1px solid #d1d1d1',
							boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
							color: '#ffffff',
							fontSize: 44,
							fontWeight: 600,
						}}>
						{profile.initials}
					</div>

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							padding: '12px 24px',
							borderRadius: 999,
							background: '#ffffff',
							border: '1px solid #ddd4c6',
							boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
							fontSize: 24,
							fontWeight: 600,
							color: '#242424',
						}}>
						<div
							style={{
								width: 14,
								height: 14,
								borderRadius: 999,
								background: '#0e700e',
							}}
						/>
						{profile.availabilityShort}
					</div>
				</div>

				{/* Name + role */}
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							fontSize: 92,
							fontWeight: 600,
							color: '#242424',
							lineHeight: 1.05,
						}}>
						{profile.name}
					</div>
					<div
						style={{
							marginTop: 16,
							fontSize: 40,
							fontWeight: 600,
							color: '#0f6cbd',
						}}>
						{`${profile.role} — ${profile.roleDetail}`}
					</div>
					<div
						style={{
							marginTop: 20,
							fontSize: 28,
							color: '#616161',
							maxWidth: 900,
							lineHeight: 1.4,
						}}>
						4+ years building production APIs and event-driven systems across
						fintech, GovTech health, and automotive.
					</div>
				</div>

				{/* Footer strip */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						fontSize: 26,
						color: '#616161',
					}}>
					<div
						style={{
							width: 48,
							height: 6,
							background: '#0f6cbd',
							borderRadius: 999,
						}}
					/>
					{profile.site.replace('https://', '')}
				</div>
			</div>
		),
		size,
	);
}
