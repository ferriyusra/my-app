'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Rss, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { BORDER, CARD, EASE, FONT, MONO, RADIUS, SANS } from '@/lib/theme';

export default function ArticlesPage() {
	const [toast, setToast] = useState(false);

	const handleNotify = () => {
		if (toast) return;
		setToast(true);
		setTimeout(() => setToast(false), 3500);
	};

	return (
		<div style={{ background: 'var(--section-a)', minHeight: '100svh' }}>
			<Navbar />
			<div
				style={{
					fontFamily: SANS,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '120px 24px 80px',
					textAlign: 'center',
				}}>
				{/* Back link */}
				<motion.div
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: EASE }}
					style={{ marginBottom: 48 }}>
					<Link
						href='/'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '10px 18px',
							background: 'var(--surface)',
							border: `${BORDER.hard} solid var(--line)`,
							borderRadius: RADIUS.full,
							boxShadow: 'var(--sh-1-hi)',
							textDecoration: 'none',
							fontSize: FONT.sm,
							fontWeight: 600,
							color: 'var(--ink)',
							fontFamily: SANS,
							transition: 'transform 0.18s ease, box-shadow 0.18s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translate(-1px, -1px)';
							e.currentTarget.style.boxShadow = 'var(--sh-2)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translate(0, 0)';
							e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
						}}>
						<ArrowLeft size={14} aria-hidden='true' />
						Back to home
					</Link>
				</motion.div>

				{/* Main card */}
				<motion.div
					initial={{ opacity: 0, y: 32 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
					style={{
						...CARD,
						boxShadow: 'var(--sh-3-hi)',
						padding: 'clamp(40px, 6vw, 72px)',
						maxWidth: 560,
						width: '100%',
					}}>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
						aria-hidden='true'
						style={{
							width: 80,
							height: 80,
							borderRadius: RADIUS.lg,
							background: 'var(--accent)',
							border: `${BORDER.hard} solid var(--line)`,
							boxShadow: 'var(--sh-2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							margin: '0 auto 32px',
						}}>
						<BookOpen size={36} color='var(--accent-ink)' />
					</motion.div>

					<p
						style={{
							fontFamily: MONO,
							fontSize: FONT.micro,
							color: 'var(--ink-muted)',
							fontWeight: 600,
							letterSpacing: '0.18em',
							textTransform: 'uppercase',
							marginBottom: 16,
						}}>
						Coming Soon
					</p>

					<h1
						style={{
							fontSize: 'clamp(28px, 5vw, 42px)',
							fontWeight: 800,
							color: 'var(--ink)',
							letterSpacing: '-0.03em',
							lineHeight: 1.1,
							marginBottom: 16,
						}}>
						Articles &{' '}
						<span
							style={{
								background: 'var(--accent)',
								color: 'var(--accent-ink)',
								padding: '2px 10px 4px',
								borderRadius: RADIUS.sm,
								display: 'inline-block',
							}}>
							Thoughts
						</span>
					</h1>

					<p
						style={{
							color: 'var(--ink-secondary)',
							fontSize: FONT.base,
							lineHeight: 1.75,
							maxWidth: 380,
							margin: '0 auto 36px',
						}}>
						I&apos;m working on writing about backend engineering, Go, system
						design, and lessons learned in production. Stay tuned!
					</p>

					{/* Feature pills */}
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 10,
							justifyContent: 'center',
							marginBottom: 40,
						}}>
						{[
							{ icon: BookOpen, label: 'Tech deep-dives' },
							{ icon: Rss, label: 'Backend patterns' },
							{ icon: Clock, label: 'Weekly posts' },
						].map(({ icon: Icon, label }) => (
							<div
								key={label}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 7,
									padding: '8px 14px',
									background: 'var(--surface-chip)',
									border: `${BORDER.soft} solid var(--line-subtle)`,
									borderRadius: RADIUS.full,
									fontSize: FONT.sm,
									fontWeight: 500,
									color: 'var(--ink-secondary)',
								}}>
								<Icon size={13} aria-hidden='true' />
								{label}
							</div>
						))}
					</div>

					{/* Notify CTA */}
					<button
						type='button'
						onClick={handleNotify}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 8,
							padding: '14px 32px',
							background: toast ? 'var(--success)' : 'var(--solid)',
							color: 'var(--solid-ink)',
							border: `${BORDER.hard} solid ${toast ? 'var(--success)' : 'var(--solid)'}`,
							borderRadius: RADIUS.full,
							fontSize: FONT.sm,
							fontWeight: 700,
							fontFamily: SANS,
							boxShadow: 'var(--sh-1-hi)',
							cursor: toast ? 'default' : 'pointer',
							transition:
								'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
						}}
						onMouseEnter={(e) => {
							if (toast) return;
							e.currentTarget.style.background = 'var(--accent)';
							e.currentTarget.style.borderColor = 'var(--accent)';
							e.currentTarget.style.transform = 'translate(-1px, -1px)';
							e.currentTarget.style.boxShadow = 'var(--sh-2)';
						}}
						onMouseLeave={(e) => {
							if (toast) return;
							e.currentTarget.style.background = 'var(--solid)';
							e.currentTarget.style.borderColor = 'var(--solid)';
							e.currentTarget.style.transform = 'translate(0, 0)';
							e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
						}}>
						{toast ? (
							<CheckCircle size={15} aria-hidden='true' />
						) : (
							<Rss size={15} aria-hidden='true' />
						)}
						{toast ? "You're on the list!" : "Notify me when it's ready"}
					</button>
				</motion.div>

				{/* Toast */}
				<AnimatePresence>
					{toast && (
						<motion.div
							key='toast'
							role='status'
							aria-live='polite'
							initial={{ opacity: 0, y: 24, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 16, scale: 0.95 }}
							transition={{ duration: 0.3, ease: EASE }}
							style={{
								position: 'fixed',
								bottom: 32,
								left: '50%',
								transform: 'translateX(-50%)',
								zIndex: 100,
								background: 'var(--footer-bg)',
								color: 'var(--on-dark)',
								border: `${BORDER.hard} solid var(--footer-bg)`,
								borderRadius: RADIUS.full,
								boxShadow: '4px 4px 0 rgba(0,0,0,0.25)',
								padding: '14px 24px',
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								fontSize: FONT.sm,
								fontWeight: 600,
								fontFamily: SANS,
								whiteSpace: 'nowrap',
							}}>
							<span
								aria-hidden='true'
								style={{
									width: 28,
									height: 28,
									borderRadius: '50%',
									background: 'var(--success)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}>
								<CheckCircle size={15} color='#ffffff' />
							</span>
							<span>Got it! I&apos;ll let you know when Articles launches.</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<Footer />
		</div>
	);
}
