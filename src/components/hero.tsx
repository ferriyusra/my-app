'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { profile } from '@/data/profile';
import {
	CONTAINER,
	DISPLAY,
	EASE,
	EYEBROW,
	FONT,
	RADIUS,
	SANS,
} from '@/lib/theme';

export default function Hero() {
	const shouldReduceMotion = useReducedMotion();
	const hasPortrait = Boolean(profile.portrait);

	const step = (i: number) => ({
		initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
		animate: { opacity: 1, y: 0 },
		transition: {
			duration: shouldReduceMotion ? 0 : 0.5,
			ease: EASE,
			delay: shouldReduceMotion ? 0 : i * 0.08,
		},
	});

	return (
		<section
			id='hero'
			style={{
				/* Full viewport. Shortening this to 78svh to let the next section
				   peek pulled the whole block up the screen, because the content
				   is centred — the hero read as top-heavy. Letting Experience peek
				   is not worth badly placed type. */
				minHeight: '100svh',
				display: 'flex',
				alignItems: 'center',
				position: 'relative',
				background: 'var(--hero-bg)',
				/* Asymmetric: the extra 56px on top offsets the fixed navbar so the
				   block reads as optically centred rather than geometrically. */
				paddingTop: 104,
				paddingBottom: 72,
			}}>
			<div style={{ ...CONTAINER, width: '100%' }}>
				<div className='hero-grid' data-portrait={hasPortrait}>
					<div>
						{/* Eyebrow — the navbar wordmark already carries the name. */}
						<motion.div
							{...step(0)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								flexWrap: 'wrap',
								marginBottom: 30,
							}}>
							{/* Fluent labels sections with BodyStrong, not tracked-out
							    uppercase mono — Windows 11 has no such text style. */}
							<span
								style={{
									fontFamily: SANS,
									fontSize: FONT.sm,
									fontWeight: 600,
									color: 'var(--ink-secondary)',
								}}>
								{profile.role} · {profile.location}
							</span>
							<span
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 7,
									padding: '3px 10px',
									background: 'var(--accent-soft)',
									border: `1px solid var(--accent-ring)`,
									borderRadius: RADIUS.full,
									fontFamily: SANS,
									fontSize: FONT.micro,
									fontWeight: 600,
									color: 'var(--accent)',
								}}>
								<span
									aria-hidden='true'
									style={{
										width: 6,
										height: 6,
										borderRadius: '50%',
										background: 'var(--accent)',
									}}
								/>
								{profile.availability}
							</span>
						</motion.div>

						{/* Fluent Display: Semibold, no negative tracking. Windows 11
						    never sets headings in a light weight or tracks them tight. */}
						<motion.h1
							{...step(1)}
							style={{
								fontSize: 'clamp(32px, 4.4vw, 52px)',
								fontWeight: 600,
								fontFamily: DISPLAY,
								letterSpacing: 0,
								lineHeight: 1.24,
								margin: '0 0 26px',
								color: 'var(--ink)',
								/* Even out the rag instead of leaving a short last line,
								   and never auto-hyphenate a display face. */
								textWrap: 'balance',
								hyphens: 'none',
							}}>
							{profile.headline}
						</motion.h1>

						<motion.p
							{...step(2)}
							style={{
								fontSize: FONT.base,
								color: 'var(--ink-secondary)',
								lineHeight: 1.7,
								maxWidth: '64ch',
								margin: '0 0 36px',
								fontFamily: SANS,
							}}>
							{profile.proof}
						</motion.p>

						<motion.div
							{...step(3)}
							style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
							<a href='#contact' className='fl-btn fl-btn-accent'>
								Get in touch
								<ArrowRight size={16} aria-hidden='true' />
							</a>

							<a
								href={profile.cvDownload}
								download
								className='fl-btn fl-btn-standard'>
								<Download size={16} aria-hidden='true' />
								Download CV
							</a>
						</motion.div>

						{/* Recognisable names do more above the fold than a stack list —
						    the stack is already in the paragraph above and in Skills. */}
						<motion.p
							{...step(4)}
							style={{
								marginTop: 40,
								marginBottom: 0,
								fontFamily: SANS,
								fontSize: FONT.sm,
								lineHeight: 1.45,
								color: 'var(--ink-muted)',
							}}>
							Previously — {profile.previously}
						</motion.p>
					</div>

					{/* Right column: the portrait once one exists, otherwise proof.
					    A wide viewport previously left this half empty. */}
					{profile.portrait ? (
						<motion.div {...step(2)} style={{ justifySelf: 'center' }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={profile.portrait}
								alt={`${profile.name}, ${profile.role}`}
								className='hero-portrait'
							/>
						</motion.div>
					) : (
						<motion.div {...step(3)} className='hero-highlights'>
							<p id='hero-outcomes' style={{ ...EYEBROW, margin: '0 0 4px' }}>
								Selected outcomes
							</p>

							{/* Three type levels so the block can be scanned rather than
							    read: the result, then how, then where and when. It was
							    previously one flat grey weight throughout. */}
							<ul
								aria-labelledby='hero-outcomes'
								style={{ listStyle: 'none', margin: 0, padding: 0 }}>
								{profile.highlights.map((h) => (
									<li key={h.lead} className='hero-highlight'>
										<p
											style={{
												margin: '0 0 4px',
												fontSize: FONT.base,
												fontWeight: 600,
												lineHeight: 1.35,
												color: 'var(--ink)',
												fontFamily: SANS,
											}}>
											{h.lead}
										</p>
										<p
											style={{
												margin: '0 0 8px',
												fontSize: FONT.sm,
												lineHeight: 1.55,
												color: 'var(--ink-secondary)',
												fontFamily: SANS,
											}}>
											{h.detail}
										</p>
										<p
											style={{
												margin: 0,
												fontFamily: SANS,
												fontSize: FONT.micro,
												color: 'var(--ink-muted)',
											}}>
											{h.at} · {h.year}
										</p>
									</li>
								))}
							</ul>

							<a href='#experience' className='hero-outcomes-link'>
								All experience
								<ArrowRight size={14} aria-hidden='true' />
							</a>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
