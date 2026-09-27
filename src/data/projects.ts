export interface Project {
	id: string;
	name: string;
	description: string;
	/** Cover image shown in the card */
	cover: string;
	tech: string[];
	/** Set to null to hide the button */
	github: string | null;
	/** Set to null to hide the button */
	demo: string | null;
	/** What the demo link actually is — a government portal is not a demo
	    and a paper is not live. Defaults to "Live demo". */
	demoLabel?: string;
	featured: boolean;
	color: string;
	/** Two-letter abbreviation shown on non-featured card header */
	initial: string;
	stars: number;
	/** 'real' = production / professional work; 'case-study' = learning / personal project */
	type: 'real' | 'case-study';
}

/**
 * The label a reader sees for a project's type, defined once.
 *
 * The data key says 'case-study' for a learning project, and three surfaces
 * printed it as "Case study" — so the HRIS app and a 2021 paper wore the badge
 * while the one project that has a case study (the Meditap write-up, which is
 * what "Case study" means everywhere else on the site) did not. The key stays;
 * the words change, to the ones PRODUCT.md and the Recycle Bin already use.
 */
export function projectKind(p: Pick<Project, 'type'>, long = false): string {
	if (p.type === 'real') return long ? 'Production work' : 'Production';
	return long ? 'Learning project' : 'Learning';
}

/**
 * Static project data.
 *
 * A `tech` entry must spell a tool exactly as `skills.ts` names it. The join
 * is `includes()` — in `evidenceFor()`, and again in `search.ts`,
 * `terminal.ts` and `career-game.ts` — so a near miss does not fail, it
 * silently drops the project from that skill's evidence. Writing "Golang"
 * while `skills.ts` said "Go" is how the two headline tools here, Go and
 * NestJS, came to claim no projects at all while shipping in two.
 *
 * Naming something `skills.ts` does not carry is fine — a framework used
 * once, a payment provider. `data.test.ts` keeps that allowlist, so adding
 * one is a decision rather than a typo.
 */
export const projects: Project[] = [
	{
		/* The card blurb from the write-up in public/projects/meditap/; the case
		   study is that system's detail page, joined by `caseStudy.project`. */
		id: 'deposit-alerting',
		name: 'Deposit Threshold Alerting',
		description:
			'A Go service that watches corporate health-plan deposit balances across three source systems and warns clients at two severity levels before their coverage gets suspended — with a state machine that suppresses repeat alerts without ever swallowing an escalation.',
		cover: '',
		/* skills.ts spellings where a skill exists; the rest are on the allowlist
		   in data.test.ts. The case study's own stack keeps the write-up's. */
		tech: ['Go', 'Gin Framework', 'GORM', 'PostgreSQL', 'MS SQL Server', 'Pub/Sub', 'Protobuf'],
		github: null,
		demo: null,
		featured: true,
		color: '#2f6f5e',
		initial: 'DT',
		stars: 0,
		type: 'real',
	},
	{
		id: 'ssd',
		name: 'SatuSehat Data',
		description:
			'The SATUSEHAT Data Portal brings the distribution of Indonesia’s health data and its processed results into one place, as interactive dashboards on trusted sources, to support decision-making and transparency. It has four parts: Dashboard, Dataset, Metadata and Data Services. I maintained and extended the Data Product’s API services in Node.js (NestJS) and PostgreSQL.',
		cover: '/projects/ssd/ssd-1.png',
		/* Node.js named as well as NestJS: the INA Digital role records the
		   Data Product APIs as "Node.js (NestJS)", and once the MERN exercises
		   left this list it was the only project that could show it. */
		tech: ['NestJS', 'Node.js', 'PostgreSQL', 'Next.js', 'TypeScript'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data',
		demoLabel: 'Live site',
		featured: true,
		color: '#a8432a',
		initial: 'SSD',
		stars: 0,
		type: 'real',
	},
	{
		id: 'hris',
		name: 'HRIS App',
		description:
			'A full-stack HRIS (Human Resource Information System) that centralizes employee management, attendance tracking (clock-in/out with auto status detection), leave request & approval workflows, payroll processing with payslip generation, and online salary disbursement via Midtrans. Features real-time dashboards powered by Supabase Realtime, role-based access control, dual-layer validation, dark mode, and an employee self-service portal.',
		cover: '',
		tech: [
			'Next.js',
			'React',
			'TypeScript',
			'Tailwind CSS',
			'shadcn/ui',
			'Supabase',
			'Zustand',
			'React Query',
			'Zod',
			'Midtrans',
			'Recharts',
		],
		github: 'https://github.com/ferriyusra/hris-app',
		demo: 'https://hris-app-xi.vercel.app/login',
		featured: false,
		color: '#3b6ea5',
		initial: 'HR',
		stars: 0,
		type: 'case-study',
	},
	{
		id: 'native',
		name: 'Dashboard Native',
		description:
			'Migration of Tableau dashboards to native ones, to cut licence cost and improve load times and performance. I built the backend APIs that deliver the data from PostgreSQL, BigQuery and MongoDB.',
		cover: '/projects/native/native-1.png',
		tech: ['Go', 'Gin Framework', 'PostgreSQL', 'React', 'Next.js'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data/dashboard/3678097d-d11e-4b2c-8552-310d782a905b',
		demoLabel: 'Live site',
		featured: true,
		color: '#4a6f8a',
		initial: 'NA',
		stars: 0,
		type: 'real',
	},
	{
		id: 'as',
		name: 'Covid-19 Vaccine Sentiment Analysis',
		description:
			'Sentiment analysis of Jakarta’s Twitter posts about the Covid-19 vaccine, after Presidential Decree No. 99 of 2020 set out the vaccination programme: tweets classified with TF-IDF features and a Naive Bayes classifier in Python, published on ResearchGate.',
		cover: '/projects/as/as-1.png',
		tech: ['Python', 'TF-IDF', 'Naive Bayes'],
		/* The repository, not its first issue: the Recycle Bin cut Tracer Study
		   for linking an issue, and the project that stayed kept the same
		   defect. */
		github: 'https://github.com/ferriyusra/Analisis-Sentimen-Naive-Bayes',
		demo: 'https://www.researchgate.net/publication/368490963_Application_of_the_Naive_Bayes_Classifier_Algorithm_to_Analyze_Sentiment_for_the_Covid-19_Vaccine_on_Twitter_in_Jakarta',
		demoLabel: 'Paper',
		featured: true,
		color: '#6b5570',
		initial: 'AS',
		stars: 0,
		type: 'case-study',
	},
];
