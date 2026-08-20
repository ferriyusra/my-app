'use client';

import { useId, useState } from 'react';
import {
	AlertCircle,
	Archive,
	CheckCircle,
	FileText,
	Github,
	Inbox,
	Linkedin,
	Loader2,
	Mail,
	PenSquare,
	Send,
	Trash2,
} from 'lucide-react';
import { useShell } from '@/context/shell-context';
import { profile } from '@/data/profile';

/**
 * `fallback` is the honest middle state: the request succeeded but no mail
 * service is configured, so the message has not actually reached anyone yet.
 */
type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'error';

type Channel = {
	id: string;
	from: string;
	subject: string;
	preview: string;
	Icon: typeof Mail;
	tint: string;
	href: string;
	action: string;
	body: string;
};

const CHANNELS: Channel[] = [
	{
		id: 'email',
		from: 'Email',
		subject: profile.email,
		preview: 'The fastest way to reach me — I read everything.',
		Icon: Mail,
		tint: 'linear-gradient(140deg, #59b4f0 0%, #1454a8 100%)',
		href: `mailto:${profile.email}`,
		action: 'Compose in your mail app',
		body: 'Direct email. I reply to everything that is not a recruiter template, usually within a day or two.',
	},
	{
		id: 'github',
		from: 'GitHub',
		subject: profile.github.replace('https://', ''),
		preview: 'Source for the case studies, and this desktop.',
		Icon: Github,
		tint: 'linear-gradient(140deg, #5b636d 0%, #1c2128 100%)',
		href: profile.github,
		action: 'Open GitHub profile',
		body: 'Public repositories for the case-study projects. Client work at Meditap, INA Digital and Moladin is private, so the production systems are described rather than linked.',
	},
	{
		id: 'linkedin',
		from: 'LinkedIn',
		subject: profile.linkedin.replace('https://', ''),
		preview: 'Full work history and the occasional post.',
		Icon: Linkedin,
		tint: 'linear-gradient(140deg, #4aa3f0 0%, #0a66c2 100%)',
		href: profile.linkedin,
		action: 'Open LinkedIn profile',
		body: 'The same five roles listed in the Experience window, plus references and endorsements.',
	},
	{
		id: 'cv',
		from: 'Resume',
		subject: 'Ferri-Yusra-CV.pdf',
		preview: 'One page, PDF, kept current.',
		Icon: FileText,
		tint: 'linear-gradient(140deg, #ff8a65 0%, #b3300f 100%)',
		href: profile.cvView,
		action: 'View the PDF',
		body: 'A one-page CV covering the same history in the format a hiring system expects.',
	},
];

const FOLDERS = [
	{ key: 'inbox', label: 'Inbox', Icon: Inbox },
	{ key: 'sent', label: 'Sent', Icon: Send },
	{ key: 'archive', label: 'Archive', Icon: Archive },
	{ key: 'deleted', label: 'Deleted', Icon: Trash2 },
] as const;

/** Contact, presented as the Windows Mail app: rail, list, reading pane. */
export default function ContactApp() {
	const uid = useId();
	const { notify } = useShell();
	const [pane, setPane] = useState<'compose' | string>('compose');
	const [folder, setFolder] = useState<string>('inbox');
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [status, setStatus] = useState<Status>('idle');
	const busy = status === 'sending';
	const active = CHANNELS.find((c) => c.id === pane) ?? null;

	/** A pre-filled draft in the visitor's own mail client. */
	const mailtoDraft = () => {
		const body = `From: ${form.name} <${form.email}>\n\n${form.message}`;
		return `mailto:${profile.email}?subject=${encodeURIComponent(
			'Portfolio contact',
		)}&body=${encodeURIComponent(body)}`;
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('sending');
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...form, subject: 'Portfolio contact' }),
			});
			const data: { delivered?: boolean } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(String(res.status));

			if (data.delivered) {
				setStatus('sent');
				setForm({ name: '', email: '', message: '' });
				notify({
					app: 'contact',
					title: 'Message sent',
					body: `Thanks ${form.name || 'there'} — I’ll reply to ${form.email}.`,
				});
				setTimeout(() => setStatus('idle'), 5000);
			} else {
				/* Keep the text in the fields: it is about to seed a mailto draft. */
				setStatus('fallback');
			}
		} catch {
			setStatus('error');
		}
	};

	return (
		<div className='ml-shell'>
			<nav className='ml-rail' aria-label='Mail folders'>
				<button
					type='button'
					className='ml-compose'
					data-active={pane === 'compose' || undefined}
					onClick={() => setPane('compose')}>
					<PenSquare size={16} aria-hidden='true' />
					New message
				</button>

				<ul>
					{FOLDERS.map(({ key, label, Icon }) => (
						<li key={key}>
							<button
								type='button'
								className='ml-folder'
								data-active={folder === key || undefined}
								aria-current={folder === key ? 'page' : undefined}
								onClick={() => setFolder(key)}>
								<Icon size={16} aria-hidden='true' />
								{label}
								{key === 'inbox' && (
									<span className='ml-count'>{CHANNELS.length}</span>
								)}
							</button>
						</li>
					))}
				</ul>

				<p className='ml-status-line'>
					<span className='ml-dot' aria-hidden='true' />
					{profile.availability} · {profile.workType}
				</p>
			</nav>

			<div className='ml-list' aria-label='Ways to reach me'>
				{folder === 'inbox' ? (
					CHANNELS.map((c) => (
						<button
							key={c.id}
							type='button'
							className='ml-item'
							data-active={pane === c.id || undefined}
							onClick={() => setPane(c.id)}>
							<span className='ml-avatar' aria-hidden='true' style={{ background: c.tint }}>
								<c.Icon size={16} color='#fff' strokeWidth={2.1} />
							</span>
							<span className='ml-item-text'>
								<strong>{c.from}</strong>
								<span className='ml-subject'>{c.subject}</span>
								<span className='ml-preview'>{c.preview}</span>
							</span>
						</button>
					))
				) : (
					<p className='ml-empty'>
						Nothing in {FOLDERS.find((f) => f.key === folder)?.label}.
					</p>
				)}
			</div>

			<div className='ml-read'>
				{pane === 'compose' || !active ? (
					<form onSubmit={submit} className='ml-form'>
						<header className='ml-form-head'>
							<h2>New message</h2>
							<p>
								To: <strong>{profile.name}</strong> &lt;{profile.email}&gt;
							</p>
						</header>

						<div className='ml-fields'>
							<div className='ml-row'>
								<label htmlFor={`${uid}-n`}>From</label>
								<input
									id={`${uid}-n`}
									className='field'
									value={form.name}
									autoComplete='name'
									placeholder='Your name'
									required
									disabled={busy}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
								/>
							</div>
							<div className='ml-row'>
								<label htmlFor={`${uid}-e`}>Reply to</label>
								<input
									id={`${uid}-e`}
									type='email'
									className='field'
									value={form.email}
									autoComplete='email'
									placeholder='you@company.com'
									required
									disabled={busy}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
								/>
							</div>
							<div className='ml-row ml-row-grow'>
								<label htmlFor={`${uid}-m`}>Message</label>
								<textarea
									id={`${uid}-m`}
									className='field'
									value={form.message}
									placeholder='What are you building?'
									required
									disabled={busy}
									onChange={(e) => setForm({ ...form, message: e.target.value })}
								/>
							</div>
						</div>

						<footer className='ml-form-foot'>
							<button type='submit' className='fl-btn fl-btn-accent' disabled={busy}>
								{busy ? (
									<>
										<Loader2 size={15} className='spin' aria-hidden='true' /> Sending…
									</>
								) : status === 'sent' ? (
									<>
										<CheckCircle size={15} aria-hidden='true' /> Sent
									</>
								) : (
									<>
										<Send size={15} aria-hidden='true' /> Send
									</>
								)}
							</button>

							<p
								role='status'
								aria-live='polite'
								className='ml-form-status'
								data-error={
									status === 'error' || status === 'fallback' || undefined
								}>
								{status === 'sent' && (
									<>
										<CheckCircle size={14} aria-hidden='true' /> Thanks — I&rsquo;ll
										reply shortly.
									</>
								)}
								{status === 'fallback' && (
									<>
										<AlertCircle size={14} aria-hidden='true' /> This deployment
										has no mail service connected yet, so nothing was delivered.
										<a className='ml-fallback' href={mailtoDraft()}>
											Open this message in your mail app
										</a>
									</>
								)}
								{status === 'error' && (
									<>
										<AlertCircle size={14} aria-hidden='true' /> Could not send.
										Email me at {profile.email}.
									</>
								)}
							</p>
						</footer>
					</form>
				) : (
					<article className='ml-message'>
						<header className='ml-message-head'>
							<span className='ml-avatar ml-avatar-lg' aria-hidden='true' style={{ background: active.tint }}>
								<active.Icon size={22} color='#fff' strokeWidth={2.1} />
							</span>
							<div>
								<h2>{active.from}</h2>
								<p>{active.subject}</p>
							</div>
						</header>

						<p className='ml-message-body'>{active.body}</p>

						<a
							className='fl-btn fl-btn-accent'
							href={active.href}
							{...(active.href.startsWith('mailto:')
								? {}
								: { target: '_blank', rel: 'noopener noreferrer' })}>
							<active.Icon size={15} aria-hidden='true' />
							{active.action}
						</a>

						<button
							type='button'
							className='ml-reply'
							onClick={() => setPane('compose')}>
							<PenSquare size={14} aria-hidden='true' />
							Write here instead
						</button>
					</article>
				)}
			</div>
		</div>
	);
}
