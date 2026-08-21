/**
 * Single source of truth for profile facts.
 *
 * These strings previously lived in 3–5 components each and had drifted apart
 * (availability was stated three different ways, the role title two).
 */

export const profile = {
	name: 'Ferri Yusra',
	initials: 'FY',

	/** Used by the page title, hero, about card and structured data. */
	role: 'Backend Engineer',
	roleDetail: 'Go, Node.js & PostgreSQL',

	/** The hero statement. Specific enough that nobody else could write it. */
	headline:
		'I build APIs and event‑driven systems that replace manual work.',

	/** Concrete proof, not adjectives. */
	proof:
		"Four years in Go and Node.js. Previously backend for SATUSEHAT, Indonesia’s national health data platform; currently building finance infrastructure at Meditap.",

	/** Names carry more weight above the fold than a list of technologies. */
	previously: 'SATUSEHAT · Peruri · Moladin',

	/**
	 * Three outcomes, drawn verbatim in substance from the Experience entries.
	 * They fill the right half of the hero with proof rather than decoration —
	 * a visitor now sees what the work actually produced before scrolling.
	 */
highlights: [
		{
			lead: 'Billing source of truth',
			detail: 'for ~160 ASO entities, replacing spreadsheet tracking',
			at: 'Meditap',
			year: '2025',
		},
		{
			lead: 'Manual monitoring eliminated',
			detail: 'event-driven billing and threshold alerts on Pub/Sub',
			at: 'Meditap',
			year: '2025',
		},
		{
			lead: 'Tableau licence costs cut',
			detail: 'dashboards migrated to native, API-driven services',
			at: 'SATUSEHAT',
			year: '2024',
		},
	],

	/**
	 * Path to a portrait in `public/`, e.g. '/ferri.jpg'. Leave null and the
	 * hero stays a single typographic column; set it and the hero becomes two
	 * columns with the portrait beside the statement.
	 */
	portrait: null as string | null,

	tagline:
		'4+ years building production APIs and event-driven systems across fintech, GovTech health, and automotive. Currently going deeper on system design and DSA.',

	/**
	 * What is true right now, in the "/now page" sense.
	 *
	 * A CV says what someone has done; this says what they are doing this
	 * month, which is the question an interested reader actually has. Every
	 * line is drawn from something already recorded elsewhere in `src/data` —
	 * nothing here is aspirational. `updated` is shown, so a stale entry
	 * admits it rather than quietly implying it is current.
	 */
	nowUpdated: '2026-08',
	now: [
		{
			label: 'Building',
			text: 'Finance infrastructure at Meditap — the ASO billing services and threshold notifications that ~160 entities are invoiced from, in Go and PostgreSQL on Pub/Sub.',
		},
		{
			label: 'Learning',
			text: 'System design and data structures and algorithms, deliberately rather than incidentally — the gap between shipping a service that works and knowing why it holds at the next order of magnitude.',
		},
		{
			label: 'Open to',
			text: 'Freelance and full-time backend work, hybrid in Jakarta or remote. GMT+7 overlaps most of the EU morning and all of APAC.',
		},
	],

	bio: 'Backend engineer with 4+ years building scalable API systems across fintech, GovTech health, and automotive industries.',

	location: 'Jakarta, Indonesia',
	locationDetail: 'Jakarta, Indonesia (Hybrid / Remote)',
	workType: 'Freelance & Full-time roles',

	/** Stated once, rendered everywhere. */
	availability: 'Available',
	availabilityShort: 'Open for opportunities',

	email: 'feriyusra1616@gmail.com',
	github: 'https://github.com/ferriyusra',
	linkedin: 'https://linkedin.com/in/ferriyusra',
	site: 'https://ferriyusra.com',

	cvView:
		'https://drive.google.com/file/d/1ZK5ogVbmyrK95M6KYBz4w53dDJsmaQ8I/view?usp=sharing',
	cvDownload:
		'https://drive.google.com/uc?export=download&id=1ZK5ogVbmyrK95M6KYBz4w53dDJsmaQ8I',
} as const;

/** First month of professional work — the anchor for every "years" figure. */
export const CAREER_START = '2021-10';

/**
 * Years of experience, computed rather than written down.
 *
 * The old copy said "4+ years" in five places and had already drifted from the
 * dates in `experience.ts`. Deriving it from one constant means the number is
 * still true next year without anyone remembering to edit it.
 */
export function yearsOfExperience(now: Date = new Date()): number {
	const [y, m] = CAREER_START.split('-').map(Number);
	const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
	return Math.max(1, Math.floor(months / 12));
}
