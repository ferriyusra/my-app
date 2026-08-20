'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';
import gsap from 'gsap';
import { profile } from '@/data/profile';
import { BORDER, FONT, RADIUS, SANS } from '@/lib/theme';

const navLinks = [
	{ href: '#hero', label: 'Home', id: 'hero', page: false },
	{ href: '#about', label: 'About', id: 'about', page: false },
	{ href: '#skills', label: 'Skills', id: 'skills', page: false },
	{ href: '#experience', label: 'Experience', id: 'experience', page: false },
	{ href: '#projects', label: 'Projects', id: 'projects', page: false },
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
	const [hovered, setHovered] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pillRef = useRef<HTMLDivElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);

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
		const OFFSET = 88;
		const ids = navLinks.filter((l) => !l.page).map((l) => l.id);
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

	// GSAP: slide the pill to the active nav link
	useEffect(() => {
		if (!isHomePage || isMobile) return;
		const pill = pillRef.current;
		const container = linksRef.current;
		if (!pill || !container) return;

		const activeLink = container.querySelector(
			`[data-nav="${activeSection}"]`,
		) as HTMLElement;
		if (!activeLink) return;

		const containerRect = container.getBoundingClientRect();
		const linkRect = activeLink.getBoundingClientRect();

		gsap.to(pill, {
			x: linkRect.left - containerRect.left,
			width: linkRect.width,
			opacity: 1,
			duration: 0.4,
			ease: 'power3.out',
		});
	}, [activeSection, isHomePage, isMobile]);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	/* Colours come from CSS variables, so the navbar re-themes without
	   re-rendering. `theme` is only read for the toggle icon. */
	const navBg = scrolled
		? 'color-mix(in srgb, var(--surface) 80%, transparent)'
		: 'var(--surface)';

	const toggleButtonStyle: React.CSSProperties = {
		width: 36,
		height: 36,
		borderRadius: '50%',
		background: 'transparent',
		border: `${BORDER.soft} solid var(--line-subtle)`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		color: 'var(--ink-secondary)',
		transition: 'border-color 0.2s ease, color 0.2s ease',
		flexShrink: 0,
	};

	return (
		<>
			<nav
				aria-label='Main'
				style={{
					position: 'fixed',
					top: 16,
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 50,
					display: 'flex',
					alignItems: 'center',
					gap: 4,
					padding: '6px 6px 6px 8px',
					background: navBg,
					border: `${BORDER.hard} solid var(--line)`,
					borderRadius: RADIUS.full,
					boxShadow: 'var(--sh-2)',
					backdropFilter: scrolled ? 'blur(12px)' : 'none',
					WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
					transition: 'background 0.3s ease, box-shadow 0.3s ease',
					width: isMobile ? 'calc(100vw - 32px)' : 'max-content',
					maxWidth: isMobile ? 480 : 'none',
					boxSizing: 'border-box',
				}}>
				{/* Logo */}
				<a
					href='#hero'
					style={{ textDecoration: 'none', flexShrink: 0 }}
					aria-label={`${profile.name} — home`}>
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: '50%',
							background: 'var(--nav-brand)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transition: 'background 0.3s ease',
						}}>
						<span
							style={{
								color: 'var(--nav-pill-ink)',
								fontSize: FONT.sm,
								fontWeight: 800,
								fontFamily: SANS,
							}}>
							{profile.initials}
						</span>
					</div>
				</a>

				{/* Desktop nav */}
				{!isMobile && (
					<>
						<div
							ref={linksRef}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 0,
								position: 'relative',
							}}>
							<div
								ref={pillRef}
								aria-hidden='true'
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									height: '100%',
									borderRadius: RADIUS.full,
									background: 'var(--nav-pill)',
									opacity: 0,
									pointerEvents: 'none',
									zIndex: 0,
								}}
							/>
							{navLinks.map((link) => {
								const resolvedHref =
									!link.page && !isHomePage ? `/${link.href}` : link.href;
								const active = link.page
									? pathname === link.href
									: isHomePage && activeSection === link.id;
								const hover = hovered === link.id;
								const linkStyle: React.CSSProperties = {
									display: 'inline-flex',
									alignItems: 'center',
									padding: '8px 14px',
									borderRadius: RADIUS.full,
									textDecoration: 'none',
									fontSize: FONT.sm,
									fontWeight: active ? 700 : 500,
									fontFamily: SANS,
									position: 'relative',
									zIndex: 1,
									color: active
										? 'var(--nav-pill-ink)'
										: hover
											? 'var(--ink)'
											: 'var(--ink-secondary)',
									background:
										hover && !active ? 'var(--surface-chip)' : 'transparent',
									transition: 'color 0.18s ease, background 0.18s ease',
									whiteSpace: 'nowrap',
								};
								const shared = {
									'data-nav': link.id,
									onMouseEnter: () => setHovered(link.id),
									onMouseLeave: () => setHovered(null),
									style: linkStyle,
									'aria-current': active
										? ('page' as const)
										: undefined,
								};
								return link.page ? (
									<Link key={link.id} href={resolvedHref} {...shared}>
										{link.label}
									</Link>
								) : (
									<a key={link.id} href={resolvedHref} {...shared}>
										{link.label}
									</a>
								);
							})}
						</div>

						{/* Theme toggle — icon only renders once the stored theme is known,
						    so server and first client render always agree. */}
						<button
							type='button'
							onClick={toggle}
							aria-label={
								isDark ? 'Switch to light mode' : 'Switch to dark mode'
							}
							style={toggleButtonStyle}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = 'var(--accent)';
								e.currentTarget.style.color = 'var(--accent)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = 'var(--line-subtle)';
								e.currentTarget.style.color = 'var(--ink-secondary)';
							}}>
							{mounted ? (
								isDark ? (
									<Sun size={15} aria-hidden='true' />
								) : (
									<Moon size={15} aria-hidden='true' />
								)
							) : null}
						</button>

						{/* Mail CTA */}
						<a
							href={isHomePage ? '#contact' : '/#contact'}
							aria-label='Contact'
							style={{
								width: 40,
								height: 40,
								borderRadius: RADIUS.md,
								background: 'var(--nav-brand)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								textDecoration: 'none',
								flexShrink: 0,
								transition: 'background 0.18s ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--accent)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--nav-brand)';
							}}>
							<Mail size={16} color='var(--nav-pill-ink)' aria-hidden='true' />
						</a>
					</>
				)}

				{/* Mobile: spacer + toggle + hamburger */}
				{isMobile && (
					<>
						<div style={{ flex: 1 }} />
						<button
							type='button'
							onClick={toggle}
							aria-label={
								isDark ? 'Switch to light mode' : 'Switch to dark mode'
							}
							style={{ ...toggleButtonStyle, marginRight: 4 }}>
							{mounted ? (
								isDark ? (
									<Sun size={14} aria-hidden='true' />
								) : (
									<Moon size={14} aria-hidden='true' />
								)
							) : null}
						</button>
						<button
							type='button'
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={menuOpen}
							style={{
								width: 40,
								height: 40,
								borderRadius: RADIUS.md,
								background: 'var(--nav-pill)',
								border: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								flexShrink: 0,
							}}>
							{menuOpen ? (
								<X size={16} color='var(--nav-pill-ink)' aria-hidden='true' />
							) : (
								<Menu size={16} color='var(--nav-pill-ink)' aria-hidden='true' />
							)}
						</button>
					</>
				)}
			</nav>

			{/* Mobile dropdown */}
			{isMobile && menuOpen && (
				<div
					style={{
						position: 'fixed',
						top: 80,
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 49,
						width: 'calc(100vw - 32px)',
						maxWidth: 480,
						background: 'var(--surface)',
						border: `${BORDER.hard} solid var(--line)`,
						borderRadius: RADIUS.lg,
						boxShadow: 'var(--sh-2)',
						padding: 12,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						boxSizing: 'border-box',
					}}>
					{navLinks.map((link) => {
						const resolvedHref =
							!link.page && !isHomePage ? `/${link.href}` : link.href;
						const active = link.page
							? pathname === link.href
							: isHomePage && activeSection === link.id;
						const mobileStyle: React.CSSProperties = {
							display: 'flex',
							alignItems: 'center',
							padding: '11px 16px',
							borderRadius: RADIUS.md,
							color: active ? 'var(--nav-pill-ink)' : 'var(--ink-secondary)',
							background: active ? 'var(--nav-pill)' : 'transparent',
							textDecoration: 'none',
							fontSize: FONT.base,
							fontWeight: active ? 700 : 500,
							fontFamily: SANS,
							transition: 'background 0.18s ease, color 0.18s ease',
						};
						return link.page ? (
							<Link
								key={link.id}
								href={resolvedHref}
								onClick={() => setMenuOpen(false)}
								aria-current={active ? 'page' : undefined}
								style={mobileStyle}>
								{link.label}
							</Link>
						) : (
							<a
								key={link.id}
								href={resolvedHref}
								onClick={() => setMenuOpen(false)}
								aria-current={active ? 'page' : undefined}
								style={mobileStyle}>
								{link.label}
							</a>
						);
					})}

					<a
						href={isHomePage ? '#contact' : '/#contact'}
						onClick={() => setMenuOpen(false)}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 8,
							padding: '11px 16px',
							marginTop: 4,
							borderRadius: RADIUS.md,
							background: 'var(--accent)',
							color: 'var(--accent-ink)',
							textDecoration: 'none',
							fontSize: FONT.sm,
							fontWeight: 700,
							fontFamily: SANS,
						}}>
						<Mail size={14} aria-hidden='true' /> Hire Me
					</a>
				</div>
			)}
		</>
	);
}
