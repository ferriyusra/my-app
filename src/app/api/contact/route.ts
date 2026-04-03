import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { name, email, subject, message } = await req.json();

		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		// Integration point: connect your preferred email service here.
		//
		// Example with Resend (npm install resend):
		// import { Resend } from 'resend';
		// const resend = new Resend(process.env.RESEND_API_KEY);
		// await resend.emails.send({
		//   from: 'portfolio@ferriyusra.com',
		//   to: 'feriyusra1616@gmail.com',
		//   subject: `Portfolio Contact: ${subject || 'New Message'}`,
		//   text: `From: ${name} (${email})\n\n${message}`,
		// });

		console.log('[Contact Form]', { name, email, subject, message });

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json(
			{ error: 'Failed to send message' },
			{ status: 500 },
		);
	}
}
