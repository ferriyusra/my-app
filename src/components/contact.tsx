'use client';

import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
	Mail,
	Github,
	Linkedin,
	Send,
	CheckCircle,
	AlertCircle,
	Loader2,
	User,
	MessageSquare,
	AtSign,
	type LucideIcon,
} from 'lucide-react';
import { profile } from '@/data/profile';
import {
	BORDER,
	CARD,
	CONTAINER,
	EASE,
	FONT,
	RADIUS,
	SANS,
} from '@/lib/theme';

const contacts = [
	{
		icon: Mail,
		label: 'Email',
		value: profile.email,
		href: `mailto:${profile.email}`,
		external: false,
	},
	{
		icon: Github,
		label: 'GitHub',
		value: profile.github.replace('https://', ''),
		href: profile.github,
		external: true,
	},
	{
		icon: Linkedin,
		label: 'LinkedIn',
		value: profile.linkedin.replace('https://', ''),
		href: profile.linkedin,
		external: true,
	},
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

/* Focus styling lives in globals.css (.field:focus) — CSS transitions handle
   var()-based colours correctly, which GSAP tweens cannot. */
const INPUT_BASE: React.CSSProperties = {
	width: '100%',
	padding: '11px 14px 11px 40px',
	background: 'var(--surface)',
	border: `${BORDER.soft} solid var(--line-soft)`,
	borderRadius: RADIUS.md,
	color: 'var(--ink)',
	fontSize: FONT.sm,
	fontFamily: SANS,
	boxSizing: 'border-box',
};

const LABEL: React.CSSProperties = {
	fontSize: FONT.sm,
	fontWeight: 600,
	color: 'var(--ink)',
	display: 'block',
	marginBottom: 7,
	fontFamily: SANS,
};

/** One labelled input. Every field gets a real `for`/`id` pair. */
function Field({
	id,
	label,
	icon: Icon,
	children,
}: {
	id: string;
	label: string;
	icon: LucideIcon;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label htmlFor={id} style={LABEL}>
				{label}
			</label>
			<div style={{ position: 'relative' }}>
				<Icon
					size={15}
					aria-hidden='true'
					style={{
						position: 'absolute',
						left: 13,
						top: 19,
						transform: 'translateY(-50%)',
						color: 'var(--ink-muted)',
						pointerEvents: 'none',
					}}
				/>
				{children}
			</div>
		</div>
	);
}

export default function Contact() {
	const [form, setForm] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [status, setStatus] = useState<Status>('idle');
	const shouldReduceMotion = useReducedMotion();

	const t = (duration: number, delay: number) => ({
		duration: shouldReduceMotion ? 0 : duration,
		ease: EASE,
		delay: shouldReduceMotion ? 0 : delay,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			setStatus('sent');
			setForm({ name: '', email: '', subject: '', message: '' });
			setTimeout(() => setStatus('idle'), 4000);
		} catch {
			// Surface the failure instead of swallowing it — the user needs
			// to know the message did not go through.
			setStatus('error');
		}
	};

	return (
		<section id='contact' style={{ background: 'var(--section-a)' }}>
			<div style={CONTAINER}>
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
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.45, 0.08)}
							style={{
								fontSize: 'clamp(32px, 5vw, 56px)',
								fontWeight: 600,
								marginBottom: 16,
								fontFamily: SANS,
								color: 'var(--ink)',
								lineHeight: 1.1,
							}}>
							Let’s{' '}
							<span
								style={{
									background: 'var(--accent)',
									color: 'var(--accent-ink)',
									padding: '2px 10px 4px',
									borderRadius: RADIUS.sm,
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
								color: 'var(--ink-secondary)',
								fontSize: FONT.base,
								marginBottom: 36,
								maxWidth: 380,
								lineHeight: 1.75,
								fontFamily: SANS,
							}}>
							I’m open to new opportunities — whether it’s a project, a
							question, or just want to say hi. My inbox is always open.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={t(0.5, 0.24)}
							className='card'
							style={{
								...CARD,
								padding: '24px 28px',
								display: 'flex',
								flexDirection: 'column',
								gap: 18,
							}}>
							{contacts.map(({ icon: Icon, label, value, href, external }, i) => (
								<motion.a
									key={label}
									href={href}
									{...(external
										? { target: '_blank', rel: 'noopener noreferrer' }
										: {})}
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
											i < contacts.length - 1
												? `1px solid var(--line-subtle)`
												: 'none',
									}}>
									<div
										style={{
											width: 38,
											height: 38,
											borderRadius: RADIUS.sm,
											background: 'var(--surface-chip)',
											border: `${BORDER.soft} solid var(--line-subtle)`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											color: 'var(--accent)',
										}}>
										<Icon size={16} aria-hidden='true' />
									</div>
									<div>
										<div
											style={{
												fontSize: FONT.micro,
												color: 'var(--ink-muted)',
												fontFamily: SANS,
												marginBottom: 2,
											}}>
											{label}
										</div>
										<div
											style={{
												fontSize: FONT.sm,
												color: 'var(--ink)',
												fontWeight: 600,
												fontFamily: SANS,
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
						className='card'
						style={{ ...CARD, padding: 36 }}>
						<h3
							style={{
								fontSize: FONT.xl,
								fontWeight: 600,
								marginBottom: 28,
								fontFamily: SANS,
								color: 'var(--ink)',
							}}>
							Send a message
						</h3>

						<ContactForm
							form={form}
							setForm={setForm}
							status={status}
							handleSubmit={handleSubmit}
							t={t}
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

function ContactForm({
	form,
	setForm,
	status,
	handleSubmit,
	t,
}: {
	form: { name: string; email: string; subject: string; message: string };
	setForm: (f: {
		name: string;
		email: string;
		subject: string;
		message: string;
	}) => void;
	status: Status;
	handleSubmit: (e: React.FormEvent) => void;
	t: (
		duration: number,
		delay: number,
	) => { duration: number; ease: [number, number, number, number]; delay: number };
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const isInView = useInView(formRef, { once: true, margin: '-60px' });

	// Stable, collision-free ids so every label points at its own input.
	const uid = useId();
	const ids = {
		name: `${uid}-name`,
		email: `${uid}-email`,
		subject: `${uid}-subject`,
		message: `${uid}-message`,
	};

	const busy = status === 'sending';

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
			{/* Name + Email row */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
				transition={t(0.4, 0.1)}
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
					gap: 14,
				}}>
				<Field id={ids.name} label='Name' icon={User}>
					<input
						id={ids.name}
						name='name'
						type='text'
						autoComplete='name'
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						placeholder='John Carter'
						required
						disabled={busy}
						className='field'
						style={INPUT_BASE}
					/>
				</Field>

				<Field id={ids.email} label='Email' icon={AtSign}>
					<input
						id={ids.email}
						name='email'
						type='email'
						autoComplete='email'
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						placeholder='contact@email.com'
						required
						disabled={busy}
						className='field'
						style={INPUT_BASE}
					/>
				</Field>
			</motion.div>

			{/* Subject */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
				transition={t(0.4, 0.2)}>
				<Field id={ids.subject} label='Subject' icon={MessageSquare}>
					<input
						id={ids.subject}
						name='subject'
						type='text'
						value={form.subject}
						onChange={(e) => setForm({ ...form, subject: e.target.value })}
						placeholder='Project inquiry...'
						disabled={busy}
						className='field'
						style={INPUT_BASE}
					/>
				</Field>
			</motion.div>

			{/* Message */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
				transition={t(0.4, 0.3)}>
				<label htmlFor={ids.message} style={LABEL}>
					Message
				</label>
				<textarea
					id={ids.message}
					name='message'
					value={form.message}
					onChange={(e) => setForm({ ...form, message: e.target.value })}
					placeholder='Please write your message...'
					rows={5}
					required
					disabled={busy}
					className='field'
					style={{ ...INPUT_BASE, padding: '12px 14px', resize: 'vertical' }}
				/>
			</motion.div>

			{/* Submit */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
				transition={t(0.4, 0.4)}>
				<button
					type='submit'
					disabled={busy}
					style={{
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 8,
						padding: '14px 24px',
						background: status === 'sent' ? 'var(--success)' : 'var(--accent)',
						border: `${BORDER.hard} solid var(--line)`,
						borderRadius: RADIUS.md,
						color: 'var(--accent-ink)',
						fontSize: FONT.base,
						fontWeight: 600,
						cursor: busy ? 'progress' : 'pointer',
						fontFamily: SANS,
						transition: 'background 0.2s ease, box-shadow 0.2s ease',
						boxShadow: 'var(--sh-1-hi)',
						opacity: busy ? 0.75 : 1,
					}}
					onMouseEnter={(e) => {
						if (!busy) e.currentTarget.style.boxShadow = 'var(--sh-2)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.boxShadow = 'var(--sh-1-hi)';
					}}>
					{busy && (
						<>
							<Loader2 size={16} className='spin' aria-hidden='true' /> Sending…
						</>
					)}
					{status === 'sent' && (
						<>
							<CheckCircle size={16} aria-hidden='true' /> Message sent
						</>
					)}
					{(status === 'idle' || status === 'error') && (
						<>
							<Send size={16} aria-hidden='true' /> Send Message
						</>
					)}
				</button>

				{/* Status is announced to screen readers, not just shown. */}
				<p
					role='status'
					aria-live='polite'
					style={{
						minHeight: 20,
						margin: '10px 0 0',
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						fontSize: FONT.sm,
						fontFamily: SANS,
						color:
							status === 'error' ? 'var(--danger)' : 'var(--ink-secondary)',
					}}>
					{status === 'sent' && (
						<>
							<CheckCircle size={14} aria-hidden='true' />
							Thanks — I’ll get back to you shortly.
						</>
					)}
					{status === 'error' && (
						<>
							<AlertCircle size={14} aria-hidden='true' />
							Could not send. Please email me directly at {profile.email}.
						</>
					)}
				</p>
			</motion.div>
		</form>
	);
}
