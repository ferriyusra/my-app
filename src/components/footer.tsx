'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Footer() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.footer
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
			style={{
				borderTop: '1px solid rgba(255,255,255,0.07)',
				padding: '32px 24px',
				textAlign: 'center',
				background: '#09090b',
			}}>
			<div style={{ maxWidth: 1200, margin: '0 auto' }}>
				<p
					style={{
						color: '#52525b',
						fontSize: 13,
						fontFamily: "'JetBrains Mono', monospace",
					}}>
					&lt;/&gt; with <span style={{ color: '#f97316' }}>♥</span> by{' '}
					<span style={{ color: '#10b981', fontWeight: 600 }}>Ferri Yusra</span>{' '}
					— built with Next.js &amp; TailwindCSS
				</p>
				<p
					style={{
						color: '#52525b',
						fontSize: 12,
						marginTop: 8,
						fontFamily: "'JetBrains Mono', monospace",
					}}>
					&copy; {new Date().getFullYear()} Ferri Yusra. All rights reserved.
				</p>
			</div>
		</motion.footer>
	);
}
