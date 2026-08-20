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
		'I build APIs and event-driven systems that replace manual work.',

	/** Concrete proof, not adjectives. */
	proof:
		"Four years in Go and Node.js. Previously backend for SATUSEHAT, Indonesia's national health data platform; currently building finance infrastructure at Meditap.",

	/** Names carry more weight above the fold than a list of technologies. */
	previously: 'SATUSEHAT · Peruri · Moladin',

	/**
	 * Path to a portrait in `public/`, e.g. '/ferri.jpg'. Leave null and the
	 * hero stays a single typographic column; set it and the hero becomes two
	 * columns with the portrait beside the statement.
	 */
	portrait: null as string | null,

	tagline:
		'4+ years building production APIs and event-driven systems across fintech, GovTech health, and automotive. Currently going deeper on system design and DSA.',

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
