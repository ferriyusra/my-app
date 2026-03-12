'use client';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function NotFound() {
	return (
		<div style={{ background: '#f0ece8', minHeight: '100vh' }}>
			<Navbar />
		<div
			style={{
				minHeight: 'calc(100vh - 80px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '80px 24px',
				fontFamily: "'Inter', sans-serif",
			}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 64,
					flexWrap: 'wrap',
					justifyContent: 'center',
					maxWidth: 900,
					width: '100%',
				}}>
				{/* Left: 404 ghost numbers + warning triangle */}
				<div style={{ position: 'relative', flexShrink: 0 }}>
					{/* Ghost 404 */}
					<div
						style={{
							fontSize: 'clamp(120px, 20vw, 200px)',
							fontWeight: 900,
							color: 'rgba(0,0,0,0.07)',
							lineHeight: 1,
							letterSpacing: '-0.04em',
							userSelect: 'none',
							fontFamily: "'Inter', sans-serif",
						}}>
						404
					</div>

					{/* Warning triangle — centered over the ghost text */}
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}>
						<svg
							width='180'
							height='160'
							viewBox='0 0 180 160'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M90 14L170 150H10L90 14Z'
								fill='#FBBF24'
								stroke='#0a0a0a'
								strokeWidth='5'
								strokeLinejoin='round'
							/>
							{/* Rounded corners trick via clipPath is complex — using path with rounded feel */}
							<rect
								x='84'
								y='62'
								width='12'
								height='48'
								rx='6'
								fill='#0a0a0a'
							/>
							<rect
								x='84'
								y='120'
								width='12'
								height='12'
								rx='6'
								fill='#0a0a0a'
							/>
						</svg>
					</div>
				</div>

				{/* Right: text + button */}
				<div style={{ maxWidth: 400 }}>
					<p
						style={{
							fontSize: 'clamp(32px, 5vw, 48px)',
							fontWeight: 800,
							color: '#0a0a0a',
							margin: '0 0 4px',
							lineHeight: 1.1,
							letterSpacing: '-0.02em',
						}}>
						Oops!
					</p>
					<p
						style={{
							fontSize: 'clamp(24px, 4vw, 36px)',
							fontWeight: 800,
							color: '#0a0a0a',
							margin: '0 0 20px',
							lineHeight: 1.2,
							letterSpacing: '-0.02em',
						}}>
						Page Not Found
					</p>
					<p
						style={{
							fontSize: 15,
							color: '#525252',
							lineHeight: 1.7,
							margin: '0 0 36px',
							fontFamily: "'Inter', sans-serif",
						}}>
						The page you&apos;re looking for doesn&apos;t exist or has been
						moved. Let&apos;s get you back on track.
					</p>
					<Link
						href='/'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '16px 40px',
							background: '#0a0a0a',
							color: '#ffffff',
							borderRadius: 100,
							textDecoration: 'none',
							fontSize: 15,
							fontWeight: 700,
							fontFamily: "'Inter', sans-serif",
							transition: 'background 0.2s ease',
							minWidth: 220,
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.background =
								'#6366f1';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLAnchorElement).style.background =
								'#0a0a0a';
						}}>
						Go to homepage
					</Link>
				</div>
			</div>
		</div>
		<Footer />
		</div>
	);
}
