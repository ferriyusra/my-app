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
	featured: boolean;
	color: string;
	/** Two-letter abbreviation shown on non-featured card header */
	initial: string;
	stars: number;
	/** 'real' = production / professional work; 'case-study' = learning / personal project */
	type: 'real' | 'case-study';
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
		id: 'ssd',
		name: 'SatuSehat Data',
		description:
			'SATUSEHAT Data Portal is a portal with a vision to unite all health data distribution and its processed results in one integrated portal access (SATU Health Data) which can be a tool to support decision making and transparency through interactive data/dashboards with trusted data sources. SATUSEHAT Data Portal consists of: Dashboard, Dataset, Metadata and Data Services.',
		cover: '/projects/ssd/ssd-1.png',
		tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'NestJS'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data',
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
		id: 'acara',
		name: 'Acara',
		description:
			'Learning to fullstack development using MERN Stack.',
		cover: '',
		tech: ['React', 'Next.js', 'Express.js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/ferriyusra/back-end-acara',
		demo: 'https://front-end-acara-lac.vercel.app/',
		featured: false,
		color: '#3d7a5c',
		initial: 'AC',
		stars: 0,
		type: 'case-study',
	},
	{
		id: 'native',
		name: 'Dashboard Native',
		description:
			'Migrating from dashboard tableau to native dashboard to reduce cost, loaded data and performance. handle the backend api to delivered data from database like postgresql, big query and mongodb.',
		cover: '/projects/native/native-1.png',
		tech: ['Go', 'Gin Framework', 'PostgreSQL', 'React', 'Next.js'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data/dashboard/3678097d-d11e-4b2c-8552-310d782a905b',
		featured: true,
		color: '#4a6f8a',
		initial: 'NA',
		stars: 0,
		type: 'real',
	},
	{
		id: 'tracerstd',
		name: 'Tracer Study',
		description:
			'Create website for tracing the student after graduate to tracking data by using quisionare and give them information about job vaccanies and redirect to the third party job portal to easly apply.',
		cover: '',
		tech: ['PHP', 'Laravel 7', 'MySQL'],
		github: 'https://github.com/ferriyusra/e-career/issues/1',
		demo: null,
		featured: false,
		color: '#a8762b',
		initial: 'TS',
		stars: 0,
		type: 'case-study',
	},
	{
		id: 'crowdfounding',
		name: 'Mini Crowdfounding',
		description:
			'Create Mini Crowdfunding Website for implementation MERN Stack to implement after finish course MERN Stack.',
		cover: '',
		tech: ['React', 'Next.js', 'Express.js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/ferriyusra/crowdfunding-be',
		demo: 'https://crowdfunding-fe-dun.vercel.app/',
		featured: false,
		color: '#96453f',
		initial: 'CF',
		stars: 0,
		type: 'case-study',
	},
	{
		id: 'gis',
		name: 'GIS Platform',
		description:
			'Create the web application to integrate GIS to the web app using minimum library map, and showing the data base on lang and lat coordinate.',
		cover: '',
		tech: ['PHP', 'Codeigniter 3', 'Leaflet', 'MySQL'],
		github: null,
		demo: null,
		featured: false,
		color: '#6b5570',
		initial: 'GI',
		stars: 0,
		type: 'case-study',
	},
	{
		id: 'as',
		name: 'Analysis Sentiment Vaccine Covid-19',
		description:
			'The epidemic of a new disease caused by the coronavirus (2019-nCoV), commonly referred to as COVID- 19, has been declared a global virus epidemic by the World Health Organization(WHO). President Joko Widodo has officially ratified Presidential Decree No. 99 of 2020 concerning the provision of vaccines and the implementation of vaccination activities.',
		cover: '/projects/as/as-1.png',
		tech: ['Python', 'Implement Algorithm TF-IDF', 'Implement Algorithm Naive Bayes Classifier'],
		github: 'https://github.com/ferriyusra/Analisis-Sentimen-Naive-Bayes/issues/1',
		demo: 'https://www.researchgate.net/publication/368490963_Application_of_the_Naive_Bayes_Classifier_Algorithm_to_Analyze_Sentiment_for_the_Covid-19_Vaccine_on_Twitter_in_Jakarta',
		featured: true,
		color: '#6b5570',
		initial: 'AS',
		stars: 0,
		type: 'case-study',
	},
];
