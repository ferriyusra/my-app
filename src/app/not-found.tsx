'use client';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { FONT, RADIUS, SANS } from '@/lib/theme';

export default function NotFound() {
	return (
		<div style={{ background: 'var(--section-a)', minHeight: '100svh' }}>
			<Navbar />
			<div
				style={{
					minHeight: 'calc(100svh - 80px)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '80px 24px',
					fontFamily: SANS,
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
						<div
							aria-hidden='true'
							style={{
								fontSize: 'clamp(120px, 20vw, 200px)',
								fontWeight: 900,
								color: 'color-mix(in srgb, var(--ink) 7%, transparent)',
								lineHeight: 1,
								letterSpacing: '-0.04em',
								userSelect: 'none',
								fontFamily: SANS,
							}}>
							404
						</div>

						<div
							aria-hidden='true'
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
									fill='var(--warn)'
									stroke='var(--line-strong)'
									strokeWidth='5'
									strokeLinejoin='round'
								/>
								<rect x='84' y='62' width='12' height='48' rx='6' fill='#1c1815' />
								<rect x='84' y='120' width='12' height='12' rx='6' fill='#1c1815' />
							</svg>
						</div>
					</div>

					{/* Right: text + button */}
					<div style={{ maxWidth: 400 }}>
						<h1
							style={{
								fontSize: 'clamp(32px, 5vw, 48px)',
								fontWeight: 800,
								color: 'var(--ink)',
								margin: '0 0 4px',
								lineHeight: 1.1,
								letterSpacing: '-0.02em',
							}}>
							Oops!
						</h1>
						<p
							style={{
								fontSize: 'clamp(24px, 4vw, 36px)',
								fontWeight: 800,
								color: 'var(--ink)',
								margin: '0 0 20px',
								lineHeight: 1.2,
								letterSpacing: '-0.02em',
							}}>
							Page Not Found
						</p>
						<p
							style={{
								fontSize: FONT.base,
								color: 'var(--ink-secondary)',
								lineHeight: 1.7,
								margin: '0 0 36px',
								fontFamily: SANS,
							}}>
							The page you’re looking for doesn’t exist or has been
							moved. Let’s get you back on track.
						</p>
						<Link
							href='/'
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '16px 40px',
								background: 'var(--solid)',
								color: 'var(--solid-ink)',
								borderRadius: RADIUS.full,
								textDecoration: 'none',
								fontSize: FONT.base,
								fontWeight: 700,
								fontFamily: SANS,
								transition: 'background 0.2s ease',
								minWidth: 220,
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--accent)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--solid)';
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
