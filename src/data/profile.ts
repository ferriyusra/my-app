/**
 * Single source of truth for profile facts.
 *
 * These strings previously lived in 3–5 components each and had drifted apart
 * (availability was stated three different ways, the role title two).
 */

/** First month of professional work — the anchor for every "since" figure. */
export const CAREER_START = '2021-10';

/** The year the copy states, derived rather than typed. */
const SINCE = CAREER_START.slice(0, 4);

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
		`Go since ${SINCE}, Node.js since 2022. Previously backend for SATUSEHAT, Indonesia’s national health data platform; currently building finance infrastructure at Meditap.`,

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
		`Building production APIs and event-driven systems since ${SINCE} across fintech, GovTech health, and automotive. Currently going deeper on system design and DSA.`,

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

	bio: `Backend engineer building scalable API systems since ${SINCE} across fintech, GovTech health, and automotive industries.`,

	location: 'Jakarta, Indonesia',
	locationDetail: 'Jakarta, Indonesia (Hybrid / Remote)',
	workType: 'Freelance & Full-time roles',

	/**
	 * The line a reader decides on, in one breath: what, where, when. On a
	 * phone the long form in `now` sat eight screens down; this goes under the
	 * name.
	 */
	openTo:
		'Open to freelance and full-time backend work · Jakarta, hybrid or remote · GMT+7',

	/** Stated once, rendered everywhere. */
	availability: 'Available',
	availabilityShort: 'Open for opportunities',

	email: 'feriyusra1616@gmail.com',
	github: 'https://github.com/ferriyusra',
	/**
	 * This site's own repository. The Recycle Bin's commit hashes link into
	 * it, so "checkable" means one click rather than typing a hash into
	 * GitHub. PRs must keep landing as merge commits: a squash rewrites the
	 * hashes those links point at.
	 */
	repo: 'https://github.com/ferriyusra/my-app',
	linkedin: 'https://linkedin.com/in/ferriyusra',
	site: 'https://ferriyusra.com',

	/**
	 * Where the CV file lives. Nothing links these directly: next.config.ts
	 * redirects /cv and /cv.pdf to them, so replacing the file is one edit
	 * here and every button on the site keeps working.
	 */
	cvDriveView:
		'https://drive.google.com/file/d/1-VPpaD0Rdhyq2BbZ7wdNQkbzyflgZtZ5/view?usp=sharing',
	cvDriveDownload:
		'https://drive.google.com/uc?export=download&id=1-VPpaD0Rdhyq2BbZ7wdNQkbzyflgZtZ5',
	/** What every CV button links: the site's own short addresses. */
	cvView: '/cv',
	cvDownload: '/cv.pdf',
} as const;

/**
 * When the career started, as a reader sees it: "Oct 2021", or "2021" alone.
 *
 * The site used to state a year count, and stated it three ways at once:
 * calendar years since `CAREER_START` (5 from October 2026), the months
 * actually spent in role (4 yrs 4 mos at that point — there are gaps between
 * jobs), and "Four years" / "4+ years" typed into the copy. A start
 * date is the one figure all three agree on, and it never goes stale, so it is
 * the only one stated. Durations are shown in months, computed per role.
 */
export function careerSince(form: 'month' | 'year' = 'month'): string {
	const [y, m] = CAREER_START.split('-').map(Number);
	if (form === 'year') return String(y);
	return new Date(y, m - 1, 1).toLocaleDateString('en-GB', {
		month: 'short',
		year: 'numeric',
	});
}
