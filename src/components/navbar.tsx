'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

const navLinks = [
  { href: '#hero',       label: 'Home',       id: 'hero' },
  { href: '#about',      label: 'About',      id: 'about' },
  { href: '#skills',     label: 'Skills',     id: 'skills' },
  { href: '#projects',   label: 'Projects',   id: 'projects' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#contact',    label: 'Contact',    id: 'contact' },
];

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeSection,  setActiveSection]  = useState('hero');
  const [hovered,        setHovered]        = useState<string | null>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function linkStyle(id: string) {
    const active     = activeSection === id;
    const highlight  = active || hovered === id;
    return {
      display: 'inline-flex',
      alignItems: 'center' as const,
      gap: 6,
      padding: '7px 14px',
      borderRadius: 100,
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      cursor: 'pointer' as const,
      background:    highlight ? 'rgba(99,102,241,0.12)'  : 'transparent',
      border:        highlight ? '1px solid rgba(99,102,241,0.22)' : '1px solid transparent',
      color:         highlight ? '#fafafa'  : '#71717a',
      transition:    'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
    };
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'rgba(9,9,11,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.45)' : 'none',
      }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Code2 size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#fafafa' }}>
              ferri.dev
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                style={linkStyle(link.id)}
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Active dot */}
                {activeSection === link.id && (
                  <span aria-hidden="true" style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#818cf8',
                    boxShadow: '0 0 6px #818cf8',
                    flexShrink: 0,
                  }} />
                )}
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            className="hidden md:block"
            style={{
              padding: '9px 22px',
              background: '#6366f1',
              borderRadius: 8,
              color: 'white',
              fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.02em',
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4f46e5';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6366f1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            Hire Me
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', color: '#fafafa', cursor: 'pointer' }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              padding: '12px 0 20px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px',
                  borderRadius: 10,
                  color: activeSection === link.id ? '#fafafa' : '#71717a',
                  background: activeSection === link.id ? 'rgba(99,102,241,0.10)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 15, fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'color 0.2s ease',
                }}>
                {activeSection === link.id && (
                  <span aria-hidden="true" style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#818cf8', boxShadow: '0 0 6px #818cf8',
                  }} />
                )}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
