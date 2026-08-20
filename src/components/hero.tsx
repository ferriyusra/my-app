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
	MONO,
	RADIUS,
	SANS,
} from '@/lib/theme';

const CTA_BASE: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 8,
	padding: '13px 26px',
	border: `1px solid var(--line)`,
	borderRadius: RADIUS.md,
	fontSize: FONT.base,
	fontWeight: 600,
	textDecoration: 'none',
	fontFamily: SANS,
	boxShadow: 'var(--sh-1)',
	transition: 'box-shadow 0.2s ease, transform 0.2s ease',
};

function lift(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translateY(-1px)';
	e.currentTarget.style.boxShadow = 'var(--sh-2-hi)';
}
function drop(e: React.MouseEvent<HTMLElement>) {
	e.currentTarget.style.transform = 'translateY(0)';
	e.currentTarget.style.boxShadow = 'var(--sh-1)';
}

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
				paddingTop: 128,
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
							<span
								style={{
									fontFamily: MONO,
									fontSize: FONT.micro,
									fontWeight: 600,
									letterSpacing: '0.18em',
									textTransform: 'uppercase',
									color: 'var(--ink-muted)',
								}}>
								{profile.role} · {profile.location}
							</span>
							<span
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 7,
									padding: '5px 12px',
									background:
										'color-mix(in srgb, var(--accent) 11%, var(--surface))',
									border: `1px solid color-mix(in srgb, var(--accent) 34%, transparent)`,
									borderRadius: RADIUS.full,
									fontFamily: MONO,
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

						{/* Set in the display serif, matching every section heading.
						    It was the one piece of display type still in Inter 800. */}
						<motion.h1
							{...step(1)}
							style={{
								fontSize: 'clamp(36px, 5.2vw, 62px)',
								fontWeight: 400,
								fontFamily: DISPLAY,
								letterSpacing: '-0.02em',
								lineHeight: 1.05,
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
								fontSize: 'clamp(16px, 1.6vw, 19px)',
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
							<a
								href='#contact'
								style={{
									...CTA_BASE,
									background: 'var(--accent)',
									borderColor: 'var(--accent)',
									color: 'var(--accent-ink)',
								}}
								onMouseEnter={lift}
								onMouseLeave={drop}>
								Get in touch
								<ArrowRight size={16} aria-hidden='true' />
							</a>

							<a
								href={profile.cvDownload}
								download
								style={{
									...CTA_BASE,
									background: 'var(--surface)',
									color: 'var(--ink)',
								}}
								onMouseEnter={lift}
								onMouseLeave={drop}>
								<Download size={16} aria-hidden='true' />
								Download CV
							</a>
						</motion.div>

						{/* Recognisable names do more above the fold than a stack list —
						    the stack is already in the paragraph above and in Skills. */}
						<motion.p
							{...step(4)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								marginTop: 48,
								marginBottom: 0,
								fontFamily: MONO,
								fontSize: FONT.sm,
								color: 'var(--ink-muted)',
								letterSpacing: '0.02em',
							}}>
							<span
								aria-hidden='true'
								style={{
									width: 24,
									height: 1,
									background: 'var(--line-strong)',
									opacity: 0.35,
									flexShrink: 0,
								}}
							/>
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
							<p
								style={{
									...EYEBROW,
									margin: '0 0 4px',
								}}>
								Selected outcomes
							</p>
							<ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
								{profile.highlights.map((h) => (
									<li key={h.outcome} className='hero-highlight'>
										<p
											style={{
												margin: '0 0 6px',
												fontSize: FONT.sm,
												lineHeight: 1.6,
												color: 'var(--ink-secondary)',
												fontFamily: SANS,
											}}>
											{h.outcome}
										</p>
										<p
											style={{
												margin: 0,
												fontFamily: MONO,
												fontSize: FONT.micro,
												color: 'var(--ink-muted)',
												letterSpacing: '0.06em',
											}}>
											{h.at} · {h.year}
										</p>
									</li>
								))}
							</ul>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
