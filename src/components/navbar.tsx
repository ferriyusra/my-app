'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';
import { profile } from '@/data/profile';
import { DISPLAY, FONT, RADIUS, SANS } from '@/lib/theme';

const navLinks = [
	{ href: '#experience', label: 'Experience', id: 'experience', page: false },
	{ href: '#projects', label: 'Projects', id: 'projects', page: false },
	{ href: '#skills', label: 'Skills', id: 'skills', page: false },
	{ href: '#about', label: 'About', id: 'about', page: false },
	{ href: '#contact', label: 'Contact', id: 'contact', page: false },
	{ href: '/articles', label: 'Articles', id: 'articles', page: true },
];

const MD = 768;

export default function Navbar() {
	const pathname = usePathname();
	const { theme, toggle, mounted } = useTheme();
	const isDark = theme === 'dark';

	const [menuOpen, setMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState('hero');
	const [isMobile, setIsMobile] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const isHomePage = pathname === '/';

	useEffect(() => {
		const check = () => {
			const mobile = window.innerWidth < MD;
			setIsMobile(mobile);
			if (!mobile) setMenuOpen(false);
		};
		check();
		window.addEventListener('resize', check, { passive: true });
		return () => window.removeEventListener('resize', check);
	}, []);

	useEffect(() => {
		if (!isHomePage) return;
		const OFFSET = 80;
		const ids = ['hero', ...navLinks.filter((l) => !l.page).map((l) => l.id)];
		const update = () => {
			let current = ids[0];
			for (const id of ids) {
				const el = document.getElementById(id);
				if (!el) continue;
				if (el.getBoundingClientRect().top <= OFFSET) current = id;
			}
			setActiveSection(current);
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	}, [isHomePage]);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const isActive = (link: (typeof navLinks)[number]) =>
		link.page
			? pathname === link.href
			: isHomePage && activeSection === link.id;

	const iconButton: React.CSSProperties = {
		width: 36,
		height: 36,
		borderRadius: RADIUS.sm,
		background: 'transparent',
		border: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		color: 'var(--ink-muted)',
		transition: 'color 0.18s ease',
		flexShrink: 0,
	};

	return (
		<>
			<nav aria-label='Main' className='nav-bar' data-scrolled={scrolled}>
				<div className='nav-inner'>
					{/* Wordmark — set in the display serif, no filled circle */}
					<a
						href={isHomePage ? '#hero' : '/'}
					style={{
						textDecoration: 'none',
						color: 'var(--ink)',
						fontFamily: DISPLAY,
						fontSize: 22,
						letterSpacing: '-0.01em',
						whiteSpace: 'nowrap',
						flexShrink: 0,
					}}>
					{profile.name}
				</a>

				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					{!isMobile && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 26,
								marginRight: 12,
								fontSize: FONT.sm,
								fontFamily: SANS,
							}}>
							{navLinks.map((link) => {
								const active = isActive(link);
								const href =
									!link.page && !isHomePage ? `/${link.href}` : link.href;
								const props = {
									className: 'nav-link',
									'data-active': active,
									'aria-current': active ? ('page' as const) : undefined,
									style: { fontWeight: active ? 600 : 500 },
								};
								return link.page ? (
									<Link key={link.id} href={href} {...props}>
										{link.label}
									</Link>
								) : (
									<a key={link.id} href={href} {...props}>
										{link.label}
									</a>
								);
							})}
						</div>
					)}

					<button
						type='button'
						onClick={toggle}
						aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
						style={iconButton}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = 'var(--accent)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = 'var(--ink-muted)';
						}}>
						{mounted ? (
							isDark ? (
								<Sun size={17} aria-hidden='true' />
							) : (
								<Moon size={17} aria-hidden='true' />
							)
						) : null}
					</button>

					{isMobile && (
						<button
							type='button'
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={menuOpen}
							style={{ ...iconButton, color: 'var(--ink)' }}>
							{menuOpen ? (
								<X size={19} aria-hidden='true' />
							) : (
								<Menu size={19} aria-hidden='true' />
							)}
						</button>
					)}
				</div>
				</div>
			</nav>

			{/* Mobile dropdown */}
			{isMobile && menuOpen && (
				<div
					style={{
						position: 'fixed',
						top: 64,
						left: 0,
						right: 0,
						zIndex: 49,
						background: 'var(--bg)',
						borderBottom: `1px solid var(--line)`,
						padding: '8px 24px 20px',
						display: 'flex',
						flexDirection: 'column',
					}}>
					{navLinks.map((link) => {
						const active = isActive(link);
						const href = !link.page && !isHomePage ? `/${link.href}` : link.href;
						const style: React.CSSProperties = {
							padding: '14px 0',
							borderBottom: `1px solid var(--line-subtle)`,
							color: active ? 'var(--accent)' : 'var(--ink-secondary)',
							textDecoration: 'none',
							fontSize: FONT.base,
							fontWeight: active ? 600 : 500,
							fontFamily: SANS,
						};
						return link.page ? (
							<Link
								key={link.id}
								href={href}
								onClick={() => setMenuOpen(false)}
								aria-current={active ? 'page' : undefined}
								style={style}>
								{link.label}
							</Link>
						) : (
							<a
								key={link.id}
								href={href}
								onClick={() => setMenuOpen(false)}
								aria-current={active ? 'page' : undefined}
								style={style}>
								{link.label}
							</a>
						);
					})}
				</div>
			)}
		</>
	);
}
