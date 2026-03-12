'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
	Mail,
	Github,
	Linkedin,
	Send,
	CheckCircle,
	User,
	MessageSquare,
	AtSign,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const contacts = [
	{
		icon: Mail,
		label: 'Email',
		value: 'feriyusra1616@gmail.com',
		href: 'mailto:feriyusra1616@gmail.com',
	},
	{
		icon: Github,
		label: 'GitHub',
		value: 'github.com/ferriyusra',
		href: 'https://github.com/ferriyusra',
	},
	{
		icon: Linkedin,
		label: 'LinkedIn',
		value: 'linkedin.com/in/ferriyusra',
		href: 'https://linkedin.com/in/ferriyusra',
	},
];

const CARD: React.CSSProperties = {
	background: '#ffffff',
	border: '2px solid #0a0a0a',
	borderRadius: 20,
	boxShadow: '6px 6px 0px #0a0a0a',
};

export default function Contact() {
	const [form, setForm] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [sent, setSent] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSent(true);
		setTimeout(() => setSent(false), 3000);
		setForm({ name: '', email: '', subject: '', message: '' });
	};

	const inputBase: React.CSSProperties = {
		width: '100%',
		padding: '11px 14px 11px 40px',
		background: '#ffffff',
		border: '1.5px solid #d4d4d4',
		borderRadius: 12,
		color: '#0a0a0a',
		fontSize: 14,
		fontFamily: "'Inter', sans-serif",
		outline: 'none',
		transition: 'border-color 0.2s ease',
		boxSizing: 'border-box',
	};

	return (
		<section id='contact' style={{ background: '#f0ece8' }}>
			<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
				{/* Two-column layout */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
						gap: 48,
						alignItems: 'start',
					}}>
					{/* ── Left: heading + info ── */}
					<div>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.35, 0)}
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: 11,
								color: '#a3a3a3',
								fontWeight: 600,
								letterSpacing: '0.18em',
								textTransform: 'uppercase',
								marginBottom: 16,
							}}
						/>

						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.45, 0.08)}
							style={{
								fontSize: 'clamp(32px, 5vw, 56px)',
								fontWeight: 800,
								marginBottom: 16,
								fontFamily: "'Inter', sans-serif",
								color: '#0a0a0a',
								letterSpacing: '-0.03em',
								lineHeight: 1.1,
							}}>
							Let&apos;s{' '}
							<span
								style={{
									background: '#6366f1',
									color: '#ffffff',
									padding: '2px 10px 4px',
									borderRadius: 8,
									display: 'inline-block',
								}}>
								Connect
							</span>
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.4, 0.16)}
							style={{
								color: '#525252',
								fontSize: 15,
								marginBottom: 36,
								maxWidth: 380,
								lineHeight: 1.75,
								fontFamily: "'Inter', sans-serif",
							}}>
							I&apos;m open to new opportunities — whether it&apos;s a project,
							a question, or just want to say hi. My inbox is always open.
						</motion.p>

						{/* Contact info card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.24)}
							style={{
								...CARD,
								padding: '24px 28px',
								display: 'flex',
								flexDirection: 'column',
								gap: 18,
							}}>
							{contacts.map(({ icon: Icon, label, value, href }, i) => (
								<motion.a
									key={label}
									href={href}
									initial={{ opacity: 0, x: -12 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={t(0.3, 0.32 + i * 0.06)}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 14,
										textDecoration: 'none',
										padding: '10px 0',
										borderBottom:
											i < contacts.length - 1 ? '1px solid #f0f0f0' : 'none',
									}}>
									<div
										style={{
											width: 38,
											height: 38,
											borderRadius: 10,
											background: '#f4f4f5',
											border: '1.5px solid #e4e4e7',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											color: '#6366f1',
										}}>
										<Icon size={16} />
									</div>
									<div>
										<div
											style={{
												fontSize: 11,
												color: '#a3a3a3',
												fontFamily: "'JetBrains Mono', monospace",
												letterSpacing: '0.1em',
												textTransform: 'uppercase',
												marginBottom: 2,
											}}>
											{label}
										</div>
										<div
											style={{
												fontSize: 13,
												color: '#0a0a0a',
												fontWeight: 600,
												fontFamily: "'Inter', sans-serif",
											}}>
											{value}
										</div>
									</div>
								</motion.a>
							))}
						</motion.div>
					</div>

					{/* ── Right: form card ── */}
					<motion.div
						initial={{ opacity: 0, x: 28 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: '-80px' }}
						transition={t(0.55, 0.2)}
						style={{ ...CARD, padding: 36 }}>
						<h3
							style={{
								fontSize: 20,
								fontWeight: 700,
								marginBottom: 28,
								fontFamily: "'Inter', sans-serif",
								color: '#0a0a0a',
								letterSpacing: '-0.01em',
							}}>
							Send a message
						</h3>

						<form
							onSubmit={handleSubmit}
							style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
							{/* Name + Email row */}
							<div
								style={{
									display: 'grid',
									gridTemplateColumns:
										'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
									gap: 14,
								}}>
								{/* Name */}
								<div>
									<label
										style={{
											fontSize: 13,
											fontWeight: 600,
											color: '#0a0a0a',
											display: 'block',
											marginBottom: 7,
											fontFamily: "'Inter', sans-serif",
										}}>
										Name
									</label>
									<div style={{ position: 'relative' }}>
										<User
											size={15}
											style={{
												position: 'absolute',
												left: 13,
												top: '50%',
												transform: 'translateY(-50%)',
												color: '#a3a3a3',
												pointerEvents: 'none',
											}}
										/>
										<input
											type='text'
											value={form.name}
											onChange={(e) =>
												setForm({ ...form, name: e.target.value })
											}
											placeholder='John Carter'
											required
											style={inputBase}
											onFocus={(e) =>
												(e.currentTarget.style.borderColor = '#6366f1')
											}
											onBlur={(e) =>
												(e.currentTarget.style.borderColor = '#d4d4d4')
											}
										/>
									</div>
								</div>

								{/* Email */}
								<div>
									<label
										style={{
											fontSize: 13,
											fontWeight: 600,
											color: '#0a0a0a',
											display: 'block',
											marginBottom: 7,
											fontFamily: "'Inter', sans-serif",
										}}>
										Email
									</label>
									<div style={{ position: 'relative' }}>
										<AtSign
											size={15}
											style={{
												position: 'absolute',
												left: 13,
												top: '50%',
												transform: 'translateY(-50%)',
												color: '#a3a3a3',
												pointerEvents: 'none',
											}}
										/>
										<input
											type='email'
											value={form.email}
											onChange={(e) =>
												setForm({ ...form, email: e.target.value })
											}
											placeholder='contact@email.com'
											required
											style={inputBase}
											onFocus={(e) =>
												(e.currentTarget.style.borderColor = '#6366f1')
											}
											onBlur={(e) =>
												(e.currentTarget.style.borderColor = '#d4d4d4')
											}
										/>
									</div>
								</div>
							</div>

							{/* Subject */}
							<div>
								<label
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: '#0a0a0a',
										display: 'block',
										marginBottom: 7,
										fontFamily: "'Inter', sans-serif",
									}}>
									Subject
								</label>
								<div style={{ position: 'relative' }}>
									<MessageSquare
										size={15}
										style={{
											position: 'absolute',
											left: 13,
											top: '50%',
											transform: 'translateY(-50%)',
											color: '#a3a3a3',
											pointerEvents: 'none',
										}}
									/>
									<input
										type='text'
										value={form.subject}
										onChange={(e) =>
											setForm({ ...form, subject: e.target.value })
										}
										placeholder='Project inquiry...'
										style={inputBase}
										onFocus={(e) =>
											(e.currentTarget.style.borderColor = '#6366f1')
										}
										onBlur={(e) =>
											(e.currentTarget.style.borderColor = '#d4d4d4')
										}
									/>
								</div>
							</div>

							{/* Message */}
							<div>
								<label
									style={{
										fontSize: 13,
										fontWeight: 600,
										color: '#0a0a0a',
										display: 'block',
										marginBottom: 7,
										fontFamily: "'Inter', sans-serif",
									}}>
									Message
								</label>
								<textarea
									value={form.message}
									onChange={(e) =>
										setForm({ ...form, message: e.target.value })
									}
									placeholder='Please write your message...'
									rows={5}
									required
									style={{
										...inputBase,
										padding: '12px 14px',
										resize: 'vertical',
									}}
									onFocus={(e) =>
										(e.currentTarget.style.borderColor = '#6366f1')
									}
									onBlur={(e) =>
										(e.currentTarget.style.borderColor = '#d4d4d4')
									}
								/>
							</div>

							{/* Submit */}
							<button
								type='submit'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
									padding: '14px 24px',
									background: sent ? '#f4f4f5' : '#6366f1',
									border: sent ? '1.5px solid #d4d4d4' : '2px solid #0a0a0a',
									borderRadius: 12,
									color: sent ? '#525252' : 'white',
									fontSize: 15,
									fontWeight: 700,
									cursor: 'pointer',
									fontFamily: "'Inter', sans-serif",
									transition: 'all 0.2s ease',
									boxShadow: sent ? 'none' : '3px 3px 0px #0a0a0a',
								}}
								onMouseEnter={(e) => {
									if (!sent) {
										e.currentTarget.style.transform = 'translate(-1px, -1px)';
										e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a';
									}
								}}
								onMouseLeave={(e) => {
									if (!sent) {
										e.currentTarget.style.transform = 'translate(0, 0)';
										e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a';
									}
								}}>
								{sent ? (
									<>
										<CheckCircle size={16} /> Message Sent!
									</>
								) : (
									<>
										<Send size={16} /> Send Message
									</>
								)}
							</button>
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
