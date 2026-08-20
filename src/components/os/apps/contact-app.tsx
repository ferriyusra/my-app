'use client';

import { useId, useState } from 'react';
import {
	Mail,
	Github,
	Linkedin,
	Send,
	CheckCircle,
	AlertCircle,
	Loader2,
} from 'lucide-react';
import { profile } from '@/data/profile';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const links = [
	{ icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, external: false },
	{ icon: Github, label: 'GitHub', value: profile.github.replace('https://', ''), href: profile.github, external: true },
	{ icon: Linkedin, label: 'LinkedIn', value: profile.linkedin.replace('https://', ''), href: profile.linkedin, external: true },
];

export default function ContactApp() {
	const uid = useId();
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [status, setStatus] = useState<Status>('idle');
	const busy = status === 'sending';

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...form, subject: 'Portfolio contact' }),
			});
			if (!res.ok) throw new Error(String(res.status));
			setStatus('sent');
			setForm({ name: '', email: '', message: '' });
			setTimeout(() => setStatus('idle'), 4000);
		} catch {
			setStatus('error');
		}
	};

	return (
		<div className='app-pad'>
			<h2 className='app-h2'>Get in touch</h2>
			<p className='app-sub' style={{ marginBottom: 18 }}>
				{profile.availability}. My inbox is always open.
			</p>

			<div className='ct-links'>
				{links.map(({ icon: Icon, label, value, href, external }) => (
					<a
						key={label}
						href={href}
						{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
						className='ct-link'>
						<Icon size={16} aria-hidden='true' />
						<span>
							<small>{label}</small>
							{value}
						</span>
					</a>
				))}
			</div>

			<form onSubmit={submit} className='ct-form'>
				<div className='ct-row'>
					<div>
						<label htmlFor={`${uid}-n`}>Name</label>
						<input
							id={`${uid}-n`}
							className='field'
							value={form.name}
							autoComplete='name'
							required
							disabled={busy}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
					</div>
					<div>
						<label htmlFor={`${uid}-e`}>Email</label>
						<input
							id={`${uid}-e`}
							type='email'
							className='field'
							value={form.email}
							autoComplete='email'
							required
							disabled={busy}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
					</div>
				</div>

				<label htmlFor={`${uid}-m`}>Message</label>
				<textarea
					id={`${uid}-m`}
					className='field'
					rows={5}
					value={form.message}
					required
					disabled={busy}
					onChange={(e) => setForm({ ...form, message: e.target.value })}
				/>

				<button type='submit' className='fl-btn fl-btn-accent' disabled={busy}>
					{busy && <><Loader2 size={15} className='spin' aria-hidden='true' /> Sending…</>}
					{status === 'sent' && <><CheckCircle size={15} aria-hidden='true' /> Message sent</>}
					{(status === 'idle' || status === 'error') && (
						<><Send size={15} aria-hidden='true' /> Send message</>
					)}
				</button>

				<p role='status' aria-live='polite' className='ct-status' data-error={status === 'error'}>
					{status === 'sent' && (<><CheckCircle size={14} aria-hidden='true' /> Thanks — I&rsquo;ll reply shortly.</>)}
					{status === 'error' && (<><AlertCircle size={14} aria-hidden='true' /> Could not send. Email me at {profile.email}.</>)}
				</p>
			</form>
		</div>
	);
}
