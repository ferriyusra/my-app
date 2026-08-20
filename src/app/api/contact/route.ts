import { NextResponse } from 'next/server';

/**
 * The endpoint behind the Mail window.
 *
 * With `RESEND_API_KEY` set the message is delivered over Resend's REST API —
 * no SDK, so nothing is added to the bundle. Without a key the route reports
 * `delivered: false` instead of claiming success, and the Mail window falls
 * back to opening the visitor's own mail client with the message pre-filled.
 * Telling someone their note was sent when it went nowhere is the one failure
 * mode a contact form must not have.
 */

const FROM = process.env.CONTACT_FROM ?? 'portfolio@ferriyusra.com';
const TO = process.env.CONTACT_TO ?? 'feriyusra1616@gmail.com';

type Payload = {
	name?: unknown;
	email?: unknown;
	subject?: unknown;
	message?: unknown;
};

function str(v: unknown, max: number): string | null {
	if (typeof v !== 'string') return null;
	const t = v.trim();
	return t.length > 0 && t.length <= max ? t : null;
}

export async function POST(req: Request) {
	let body: Payload;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
	}

	const name = str(body.name, 120);
	const email = str(body.email, 200);
	const message = str(body.message, 5000);
	const subject = str(body.subject, 160) ?? 'Portfolio contact';

	if (!name || !email || !message) {
		return NextResponse.json(
			{ error: 'Name, email and message are all required.' },
			{ status: 400 },
		);
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return NextResponse.json(
			{ error: 'That email address does not look valid.' },
			{ status: 400 },
		);
	}

	const key = process.env.RESEND_API_KEY;
	if (!key) {
		/* Not an error: the form worked, delivery is simply not configured. */
		return NextResponse.json({ ok: true, delivered: false });
	}

	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${key}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: FROM,
				to: [TO],
				reply_to: email,
				subject: `${subject} — ${name}`,
				text: `From: ${name} <${email}>\n\n${message}`,
			}),
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: 'The mail service rejected the message.', delivered: false },
				{ status: 502 },
			);
		}
		return NextResponse.json({ ok: true, delivered: true });
	} catch {
		return NextResponse.json(
			{ error: 'Could not reach the mail service.', delivered: false },
			{ status: 502 },
		);
	}
}
