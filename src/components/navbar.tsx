'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Mail } from 'lucide-react';

const navLinks = [
  { href: '#hero',       label: 'Home',       id: 'hero',       page: false },
  { href: '#about',      label: 'About',      id: 'about',      page: false },
  { href: '#skills',     label: 'Skills',     id: 'skills',     page: false },
  { href: '#experience', label: 'Experience', id: 'experience', page: false },
  { href: '#projects',   label: 'Projects',   id: 'projects',   page: false },
  { href: '#contact',    label: 'Contact',    id: 'contact',    page: false },
  { href: '/articles',   label: 'Articles',   id: 'articles',   page: true  },
];

const MD = 768; // breakpoint in px

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hovered,       setHovered]       = useState<string | null>(null);
  const [isMobile,      setIsMobile]      = useState(false);

  const isHomePage = pathname === '/';

  // Detect mobile breakpoint + close menu on resize to desktop
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

  // Active section via scroll — only on home page
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

  return (
    <>
      {/* ── Floating pill navbar ── */}
      <nav
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
          background: '#ffffff',
          border: '2px solid #0a0a0a',
          borderRadius: 100,
          boxShadow: '4px 4px 0px #0a0a0a',
          // Mobile: full width pill, Desktop: hug content
          width: isMobile ? 'calc(100vw - 32px)' : 'max-content',
          maxWidth: isMobile ? 480 : 'none',
          boxSizing: 'border-box',
        }}>

        {/* Logo circle */}
        <a href='#hero' style={{ textDecoration: 'none', flexShrink: 0 }} aria-label='Home'>
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: '#0a0a0a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
              FY
            </span>
          </div>
        </a>

        {/* ── Desktop: nav links + CTA ── */}
        {!isMobile && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {navLinks.map((link) => {
                const resolvedHref = !link.page && !isHomePage
                  ? `/${link.href}`
                  : link.href;
                const active = link.page
                  ? pathname === link.href
                  : isHomePage && activeSection === link.id;
                const hover  = hovered === link.id;
                const linkStyle: React.CSSProperties = {
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 14px',
                  borderRadius: 100,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  fontFamily: "'Inter', sans-serif",
                  color:      active ? '#ffffff' : hover ? '#0a0a0a' : '#525252',
                  background: active ? '#0a0a0a' : hover ? 'rgba(0,0,0,0.05)' : 'transparent',
                  transition: 'background 0.18s ease, color 0.18s ease',
                  whiteSpace: 'nowrap',
                };
                return link.page ? (
                  <Link
                    key={link.id}
                    href={resolvedHref}
                    onMouseEnter={() => setHovered(link.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={linkStyle}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.id}
                    href={resolvedHref}
                    onMouseEnter={() => setHovered(link.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={linkStyle}>
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Mail CTA */}
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              aria-label='Contact'
              style={{
                width: 40, height: 40,
                borderRadius: 12,
                background: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                transition: 'background 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#6366f1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0a0a0a'; }}>
              <Mail size={16} color='#ffffff' />
            </a>
          </>
        )}

        {/* ── Mobile: spacer + hamburger ── */}
        {isMobile && (
          <>
            {/* Spacer pushes hamburger to the right */}
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Toggle menu'
              style={{
                width: 40, height: 40,
                borderRadius: 12,
                background: '#0a0a0a',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}>
              {menuOpen
                ? <X    size={16} color='#ffffff' />
                : <Menu size={16} color='#ffffff' />}
            </button>
          </>
        )}
      </nav>

      {/* ── Mobile dropdown menu ── */}
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
            background: '#ffffff',
            border: '2px solid #0a0a0a',
            borderRadius: 20,
            boxShadow: '4px 4px 0px #0a0a0a',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
          }}>
          {navLinks.map((link) => {
            const resolvedHref = !link.page && !isHomePage
              ? `/${link.href}`
              : link.href;
            const active = link.page
              ? pathname === link.href
              : isHomePage && activeSection === link.id;
            const mobileStyle: React.CSSProperties = {
              display: 'flex', alignItems: 'center',
              padding: '11px 16px',
              borderRadius: 12,
              color:      active ? '#ffffff' : '#525252',
              background: active ? '#0a0a0a' : 'transparent',
              textDecoration: 'none',
              fontSize: 15, fontWeight: active ? 700 : 500,
              fontFamily: "'Inter', sans-serif",
              transition: 'background 0.18s ease, color 0.18s ease',
            };
            return link.page ? (
              <Link
                key={link.id}
                href={resolvedHref}
                onClick={() => setMenuOpen(false)}
                style={mobileStyle}>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={resolvedHref}
                onClick={() => setMenuOpen(false)}
                style={mobileStyle}>
                {link.label}
              </a>
            );
          })}

          <a
            href={isHomePage ? '#contact' : '/#contact'}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 16px',
              marginTop: 4,
              borderRadius: 12,
              background: '#6366f1',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
            }}>
            <Mail size={14} /> Hire Me
          </a>
        </div>
      )}
    </>
  );
}
