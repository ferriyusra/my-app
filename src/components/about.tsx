'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, useReducedMotion } from 'framer-motion';
import { MapPin, Calendar, Briefcase, Download, Zap, Layers, Users, GitPullRequest } from 'lucide-react';

// Count-up component — respects prefers-reduced-motion
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      if (shouldReduceMotion) {
        motionVal.set(to);
      } else {
        animate(motionVal, to, { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] });
      }
    }
  }, [isInView, motionVal, to, shouldReduceMotion]);

  return (
    <span ref={ref} style={{ display: 'inline', fontVariantNumeric: 'tabular-nums' }}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { label: 'Years Experience', value: 5, suffix: '+', color: '#10b981', icon: Zap, bg: 'rgba(16,185,129,0.10)' },
  { label: 'Projects Shipped', value: 30, suffix: '+', color: '#3b82f6', icon: Layers, bg: 'rgba(59,130,246,0.10)' },
  { label: 'Happy Clients', value: 20, suffix: '+', color: '#7c3aed', icon: Users, bg: 'rgba(124,58,237,0.10)' },
  { label: 'Open Source PRs', value: 100, suffix: '+', color: '#f59e0b', icon: GitPullRequest, bg: 'rgba(245,158,11,0.10)' },
];

const infoItems = [
  { icon: MapPin, text: 'Tangerang, Indonesia (Hybrid / Remote)', label: 'Location' },
  { icon: Calendar, text: 'Available from April 2026', label: 'Availability' },
  { icon: Briefcase, text: 'Freelance & Full-time roles', label: 'Work type' },
];

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 };
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const t = (duration: number, delay: number) => ({
    duration: shouldReduceMotion ? 0 : duration,
    ease: EASE,
    delay: shouldReduceMotion ? 0 : delay,
  });

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{ background: '#0f0f11', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={t(0.35, 0)}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: '#10b981', fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12,
          }}>
          // 01. about
        </motion.div>

        {/* Heading */}
        <motion.h2
          id="about-heading"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={t(0.45, 0.08)}
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 56,
            fontFamily: "'Inter', sans-serif", color: '#fafafa',
            letterSpacing: '-0.02em', textWrap: 'balance' as never,
          }}>
          Who I{' '}
          <span style={{
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Am
          </span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>

          {/* ── Profile card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={t(0.5, 0.12)}
            whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: '0 24px 56px rgba(0,0,0,0.4)' }}
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '32px',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
              cursor: 'default',
            }}>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.06, rotate: 3 }}
                transition={SPRING}
                aria-hidden="true"
                style={{
                  width: 64, height: 64, borderRadius: 18, flexShrink: 0,
                  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(16,185,129,0.28)',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                }}>
                {/* Shimmer sweep */}
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ x: ['-100%', '220%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <span style={{
                  color: '#ffffff', fontSize: 20, fontWeight: 800,
                  fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em',
                }}>
                  FY
                </span>
              </motion.div>

              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#fafafa', fontFamily: "'Inter', sans-serif", marginBottom: 3 }}>
                  Ferri Yusra
                </div>
                <div style={{ color: '#10b981', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                  Full Stack Engineer
                </div>
              </div>
            </div>

            {/* Bio */}
            <p style={{ color: '#a1a1aa', lineHeight: 1.8, marginBottom: 14, fontFamily: "'Inter', sans-serif", fontSize: 15 }}>
              I&apos;m a passionate full-stack engineer with 5+ years of experience building production-grade web applications. I love the intersection of great engineering and great design.
            </p>
            <p style={{ color: '#a1a1aa', lineHeight: 1.8, marginBottom: 28, fontFamily: "'Inter', sans-serif", fontSize: 15 }}>
              When I&apos;m not shipping features, you&apos;ll find me contributing to open source, exploring new technologies, or writing technical articles.
            </p>

            {/* Info rows */}
            <ul
              role="list"
              aria-label="Personal information"
              style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, listStyle: 'none', margin: '0 0 28px', padding: 0 }}>
              {infoItems.map(({ icon: Icon, text, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={t(0.3, 0.32 + i * 0.05)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: '#18181b', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} style={{ color: '#10b981' }} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 10, color: '#52525b', fontFamily: "'JetBrains Mono', monospace",
                      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 1, fontWeight: 600,
                    }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 14, color: '#d4d4d8', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                      {text}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Actions row */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Availability pill */}
              <div
                role="status"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100 }}>
                <motion.span
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.45, 1], opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                  style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, color: '#10b981', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  Available April 2026
                </span>
              </div>

              {/* Download CV */}
              <a
                href="/resume.pdf"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.10)', background: 'transparent',
                  color: '#a1a1aa', fontSize: 12, textDecoration: 'none',
                  fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  transition: 'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.color = '#10b981';
                  if (!shouldReduceMotion) e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                  e.currentTarget.style.color = '#a1a1aa';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                <Download size={13} aria-hidden="true" />
                Download CV
              </a>
            </div>
          </motion.div>

          {/* ── Right column ─────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stats 2×2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.map(({ label, value, suffix, color, icon: Icon, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.88, y: 12 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ ...SPRING, delay: shouldReduceMotion ? 0 : 0.18 + i * 0.05 }}
                  whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.02 }}
                  style={{
                    background: '#111113',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 18, padding: '24px 18px',
                    textAlign: 'center',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
                    cursor: 'default', overflow: 'hidden', position: 'relative',
                  }}>

                  {/* Accent bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE, delay: shouldReduceMotion ? 0 : 0.38 + i * 0.06 }}
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 3, background: color,
                      transformOrigin: 'left', borderRadius: '18px 18px 0 0',
                    }}
                  />

                  {/* Icon bubble */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '6px auto 14px',
                  }}>
                    <Icon size={18} style={{ color }} aria-hidden="true" />
                  </div>

                  {/* Count */}
                  <div style={{
                    fontSize: 36, fontWeight: 800,
                    fontFamily: "'Inter', sans-serif",
                    color, marginBottom: 5, lineHeight: 1,
                  }}>
                    <CountUp to={value} suffix={suffix} />
                  </div>

                  <div style={{ color: '#52525b', fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    {label}
                  </div>

                  {/* Background glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', bottom: -24, right: -24,
                      width: 72, height: 72, borderRadius: '50%',
                      background: color, opacity: 0.06, pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Philosophy card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={t(0.5, 0.5)}
              style={{
                background: 'linear-gradient(135deg, #0d0d14 0%, #0f1120 100%)',
                borderRadius: 20, padding: '28px 30px',
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>

              {/* Decorative glows */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: -40, right: -40, width: 130, height: 130,
                background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
              }} />
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: -30, left: -30, width: 110, height: 110,
                background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#10b981',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600,
              }}>
                // my approach
              </div>

              <blockquote style={{ margin: 0 }}>
                <p style={{
                  color: '#e2e8f0', fontSize: 15, lineHeight: 1.75,
                  fontFamily: "'Inter', sans-serif", fontWeight: 500, margin: '0 0 16px',
                }}>
                  &ldquo;I believe great software lives at the intersection of{' '}
                  <span style={{ color: '#10b981', fontWeight: 700 }}>engineering excellence</span>
                  {' '}and{' '}
                  <span style={{ color: '#60a5fa', fontWeight: 700 }}>thoughtful design</span>.&rdquo;
                </p>
              </blockquote>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Clean Code', 'Performance', 'Scalability', 'DX'].map((tag) => (
                  <span key={tag} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 100,
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.05em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
