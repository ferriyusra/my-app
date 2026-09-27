import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';

/*
 * The card LinkedIn, WhatsApp and Slack show for a shared link.
 *
 * In a mobile feed it is drawn about 350px wide — a third of its size — so
 * anything under ~36px here ends up under ~12px there. The previous card
 * spent its space on a 28px tagline (a hand-typed second copy of the bio)
 * and a 26px domain the feed prints underneath anyway, both illegible at
 * that scale; what survived was an initials tile, a name and a stack line.
 * It now carries four things, each large enough to survive: the name, the
 * role and stack, the employers — the reason to tap — and availability,
 * inside a Windows 11 window on the Bloom wallpaper, because that is what
 * the link opens.
 *
 * Satori cannot read CSS variables, so each colour is the hex of the token
 * named beside it in globals.css.
 */

const current = experiences.find((e) => e.current) ?? experiences[0];
const EMPLOYERS = `${current.short} · ${profile.previously}`;

export const alt = `${profile.name} — ${profile.role}, ${profile.roleDetail}. ${EMPLOYERS}. ${profile.availabilityShort}.`;
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
					alignItems: 'center',
					justifyContent: 'center',
					/* The Bloom wallpaper's gradient. */
					background: 'radial-gradient(120% 100% at 50% 46%, #cfe0f5 0%, #9fbde2 68%)',
					/* Satori renders this on the server, where Segoe UI Variable is
					   not installed, so the card cannot pick up the desktop's face.
					   Declaring it here would be a lie about what renders. */
					fontFamily: 'sans-serif',
				}}>
				<div
					style={{
						width: 1060,
						height: 500,
						display: 'flex',
						flexDirection: 'column',
						borderRadius: 10,
						background: '#ffffff' /* --surface */,
						border: '1px solid #d1d1d1' /* --line */,
						boxShadow: '0 24px 60px rgba(16, 35, 63, 0.28)',
						overflow: 'hidden',
					}}>
					{/* Title bar: the window's name, and the three caption marks. */}
					<div
						style={{
							height: 56,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 28px',
							background: '#fafafa' /* --surface-header */,
							borderBottom: '1px solid #ebebeb',
							fontSize: 24,
							color: '#424242' /* --ink-secondary */,
						}}>
						<div style={{ display: 'flex' }}>About Me</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
							<div style={{ width: 18, height: 2, background: '#424242' }} />
							<div style={{ width: 16, height: 16, border: '2px solid #424242' }} />
							<div style={{ display: 'flex', position: 'relative', width: 20, height: 20 }}>
								<div
									style={{
										position: 'absolute',
										left: 9,
										top: -3,
										width: 2,
										height: 26,
										background: '#424242',
										transform: 'rotate(45deg)',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: 9,
										top: -3,
										width: 2,
										height: 26,
										background: '#424242',
										transform: 'rotate(-45deg)',
									}}
								/>
							</div>
						</div>
					</div>

					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							padding: '0 64px',
						}}>
						<div
							style={{
								fontSize: 84,
								fontWeight: 700,
								color: '#1a1a1a' /* --ink */,
								lineHeight: 1.05,
							}}>
							{profile.name}
						</div>
						<div
							style={{
								marginTop: 14,
								fontSize: 40,
								fontWeight: 600,
								color: '#0f6cbd' /* --accent-fill, blue */,
							}}>
							{`${profile.role} — ${profile.roleDetail}`}
						</div>
						<div
							style={{
								marginTop: 18,
								fontSize: 36,
								color: '#424242' /* --ink-secondary */,
							}}>
							{EMPLOYERS}
						</div>
						<div
							style={{
								marginTop: 30,
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								fontSize: 32,
								fontWeight: 600,
								color: '#0e700e' /* --success */,
							}}>
							<div
								style={{
									width: 18,
									height: 18,
									borderRadius: 999,
									background: '#0e700e' /* --success */,
								}}
							/>
							{profile.availabilityShort}
						</div>
					</div>
				</div>
			</div>
		),
		size,
	);
}
