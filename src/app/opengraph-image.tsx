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
					background: '#f0ece8',
					padding: 72,
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
							borderRadius: 28,
							background: '#6366f1',
							border: '4px solid #0a0a0a',
							boxShadow: '10px 10px 0 #0a0a0a',
							color: '#ffffff',
							fontSize: 44,
							fontWeight: 800,
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
							border: '3px solid #0a0a0a',
							boxShadow: '6px 6px 0 #0a0a0a',
							fontSize: 24,
							fontWeight: 700,
							color: '#0a0a0a',
						}}>
						<div
							style={{
								width: 14,
								height: 14,
								borderRadius: 999,
								background: '#22c55e',
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
							fontWeight: 800,
							letterSpacing: '-0.03em',
							color: '#0a0a0a',
							lineHeight: 1.05,
						}}>
						{profile.name}
					</div>
					<div
						style={{
							marginTop: 16,
							fontSize: 40,
							fontWeight: 700,
							color: '#6366f1',
							letterSpacing: '-0.02em',
						}}>
						{`${profile.role} — ${profile.roleDetail}`}
					</div>
					<div
						style={{
							marginTop: 20,
							fontSize: 28,
							color: '#4a4a4a',
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
						color: '#4a4a4a',
					}}>
					<div
						style={{
							width: 48,
							height: 6,
							background: '#6366f1',
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
