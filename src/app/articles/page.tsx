'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Rss, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ArticlesPage() {
	const [toast, setToast] = useState(false);

	const handleNotify = () => {
		if (toast) return;
		setToast(true);
		setTimeout(() => setToast(false), 3500);
	};

	return (
		<div style={{ background: '#f0ece8', minHeight: '100vh' }}>
			<Navbar />
		<div
			style={{
				fontFamily: "'Inter', sans-serif",
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
						background: '#ffffff',
						border: '2px solid #0a0a0a',
						borderRadius: 100,
						boxShadow: '3px 3px 0px #0a0a0a',
						textDecoration: 'none',
						fontSize: 13,
						fontWeight: 600,
						color: '#0a0a0a',
						fontFamily: "'Inter', sans-serif",
						transition: 'all 0.18s ease',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = 'translate(-1px, -1px)';
						e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = 'translate(0, 0)';
						e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a';
					}}>
					<ArrowLeft size={14} />
					Back to home
				</Link>
			</motion.div>

			{/* Main card */}
			<motion.div
				initial={{ opacity: 0, y: 32 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
				style={{
					background: '#ffffff',
					border: '2px solid #0a0a0a',
					borderRadius: 28,
					boxShadow: '8px 8px 0px #0a0a0a',
					padding: 'clamp(40px, 6vw, 72px)',
					maxWidth: 560,
					width: '100%',
				}}>
				{/* Icon */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
					style={{
						width: 80,
						height: 80,
						borderRadius: 22,
						background: '#6366f1',
						border: '2px solid #0a0a0a',
						boxShadow: '4px 4px 0px #0a0a0a',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						margin: '0 auto 32px',
					}}>
					<BookOpen size={36} color='#ffffff' />
				</motion.div>

				{/* Label */}
				<p
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: 11,
						color: '#a3a3a3',
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
						color: '#0a0a0a',
						letterSpacing: '-0.03em',
						lineHeight: 1.1,
						marginBottom: 16,
					}}>
					Articles &{' '}
					<span
						style={{
							background: '#6366f1',
							color: '#ffffff',
							padding: '2px 10px 4px',
							borderRadius: 8,
							display: 'inline-block',
						}}>
						Thoughts
					</span>
				</h1>

				<p
					style={{
						color: '#525252',
						fontSize: 15,
						lineHeight: 1.75,
						marginBottom: 36,
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
						{ icon: Rss,      label: 'Backend patterns' },
						{ icon: Clock,    label: 'Weekly posts' },
					].map(({ icon: Icon, label }) => (
						<div
							key={label}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 7,
								padding: '8px 14px',
								background: '#f4f4f5',
								border: '1.5px solid #e4e4e7',
								borderRadius: 100,
								fontSize: 13,
								fontWeight: 500,
								color: '#525252',
							}}>
							<Icon size={13} />
							{label}
						</div>
					))}
				</div>

				{/* Notify CTA */}
				<button
					onClick={handleNotify}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 8,
						padding: '14px 32px',
						background: toast ? '#10b981' : '#0a0a0a',
						color: '#ffffff',
						border: `2px solid ${toast ? '#10b981' : '#0a0a0a'}`,
						borderRadius: 100,
						fontSize: 14,
						fontWeight: 700,
						fontFamily: "'Inter', sans-serif",
						boxShadow: `3px 3px 0px ${toast ? '#10b981' : '#0a0a0a'}`,
						cursor: toast ? 'default' : 'pointer',
						transition: 'all 0.2s ease',
					}}
					onMouseEnter={(e) => {
						if (toast) return;
						e.currentTarget.style.background = '#6366f1';
						e.currentTarget.style.borderColor = '#6366f1';
						e.currentTarget.style.transform = 'translate(-1px, -1px)';
						e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a';
					}}
					onMouseLeave={(e) => {
						if (toast) return;
						e.currentTarget.style.background = '#0a0a0a';
						e.currentTarget.style.borderColor = '#0a0a0a';
						e.currentTarget.style.transform = 'translate(0, 0)';
						e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a';
					}}>
					{toast ? <CheckCircle size={15} /> : <Rss size={15} />}
					{toast ? "You're on the list!" : "Notify me when it's ready"}
				</button>
			</motion.div>

			{/* Toast */}
			<AnimatePresence>
				{toast && (
					<motion.div
						key='toast'
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
							background: '#0a0a0a',
							color: '#ffffff',
							border: '2px solid #0a0a0a',
							borderRadius: 100,
							boxShadow: '4px 4px 0px rgba(0,0,0,0.25)',
							padding: '14px 24px',
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							fontSize: 14,
							fontWeight: 600,
							fontFamily: "'Inter', sans-serif",
							whiteSpace: 'nowrap',
						}}>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: '50%',
								background: '#10b981',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
							}}>
							<CheckCircle size={15} color='#ffffff' />
						</div>
						<span>
							Got it! I&apos;ll let you know when Articles launches.
						</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
		<Footer />
		</div>
	);
}
