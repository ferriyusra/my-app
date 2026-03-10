'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

const navLinks = [
	{ href: '#about', label: 'About' },
	{ href: '#skills', label: 'Skills' },
	{ href: '#projects', label: 'Projects' },
	{ href: '#experience', label: 'Experience' },
	{ href: '#contact', label: 'Contact' },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 50,
				background: 'rgba(9,9,11,0.80)',
				backdropFilter: 'blur(16px)',
				borderBottom: '1px solid rgba(255,255,255,0.07)',
				transition: 'box-shadow 0.3s ease',
				boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.4)' : 'none',
			}}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: 64,
					}}>
					{/* Logo */}
					<a
						href='#'
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							textDecoration: 'none',
						}}>
						<div
							style={{
								width: 34,
								height: 34,
								background: 'linear-gradient(135deg, #10b981, #3b82f6)',
								borderRadius: 8,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Code2 size={16} color='white' />
						</div>
						<span
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: 14,
								fontWeight: 700,
								color: '#fafafa',
							}}>
							ferri.dev
						</span>
					</a>

					{/* Desktop nav */}
					<div style={{ display: 'flex', gap: 32 }} className='hidden md:flex'>
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								style={{
									color: '#a1a1aa',
									textDecoration: 'none',
									fontSize: 14,
									fontWeight: 500,
									transition: 'color 0.2s ease',
									fontFamily: "'Inter', sans-serif",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = '#fafafa')}
								onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}>
								{link.label}
							</a>
						))}
					</div>

					{/* CTA */}
					<a
						href='#contact'
						className='hidden md:block'
						style={{
							padding: '9px 22px',
							background: '#10b981',
							borderRadius: 8,
							color: 'white',
							fontSize: 13,
							fontWeight: 700,
							textDecoration: 'none',
							fontFamily: "'Inter', sans-serif",
							letterSpacing: '0.02em',
							transition: 'background 0.2s ease, transform 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = '#059669';
							e.currentTarget.style.transform = 'translateY(-1px)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = '#10b981';
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						Hire Me
					</a>

					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className='md:hidden'
						style={{
							background: 'none',
							border: 'none',
							color: '#fafafa',
							cursor: 'pointer',
						}}>
						{menuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{menuOpen && (
					<div
						style={{
							padding: '16px 0 24px',
							borderTop: '1px solid rgba(255,255,255,0.07)',
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
							background: '#09090b',
						}}
						className='md:hidden'>
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={() => setMenuOpen(false)}
								style={{
									color: '#a1a1aa',
									textDecoration: 'none',
									fontSize: 16,
									fontWeight: 500,
									padding: '4px 0',
									fontFamily: "'Inter', sans-serif",
								}}>
								{link.label}
							</a>
						))}
					</div>
				)}
			</div>
		</nav>
	);
}
