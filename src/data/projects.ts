export interface Project {
	id: string;
	name: string;
	description: string;
	/** Cover image shown in the card */
	cover: string;
	/** All screenshots / gallery images */
	images: string[];
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
 * To migrate to an API, replace this export with a fetch call:
 *
 *   export async function getProjects(): Promise<Project[]> {
 *     const res = await fetch('/api/projects');
 *     return res.json();
 *   }
 *
 * Then update `projects.tsx` to `await getProjects()` (server component)
 * or `useSWR('/api/projects', fetcher)` (client component).
 */
export const projects: Project[] = [
	{
		id: 'ssd',
		name: 'SatuSehat Data',
		description:
			'SATUSEHAT Data Portal is a portal with a vision to unite all health data distribution and its processed results in one integrated portal access (SATU Health Data) which can be a tool to support decision making and transparency through interactive data/dashboards with trusted data sources. SATUSEHAT Data Portal consists of: Dashboard, Dataset, Metadata and Data Services.',
		cover: '/projects/ssd/ssd-1.png',
		images: ['/projects/ssd/ssd-1.png'],
		tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Nest.js'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data',
		featured: true,
		color: '#6366f1',
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
		images: [],
		tech: [
			'Next.js 15',
			'React 19',
			'TypeScript',
			'Tailwind CSS v4',
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
		color: '#0ea5e9',
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
		images: [
			'/projects/acara/ac-1.webp',
			'/projects/acara/ac-2.webp',
			'/projects/acara/ac-3.webp',
			'/projects/acara/ac-4.webp',
		],
		tech: ['React.Js', 'Next.Js', 'Express.Js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/ferriyusra/back-end-acara',
		demo: 'https://front-end-acara-lac.vercel.app/',
		featured: false,
		color: '#10b981',
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
		images: ['/projects/native/native-1.png'],
		tech: ['Golang', 'Gin Framework', 'PostgreSQL', 'React.Js', 'Next.Js'],
		github: null,
		demo: 'https://satusehat.kemkes.go.id/data/dashboard/3678097d-d11e-4b2c-8552-310d782a905b',
		featured: true,
		color: '#3b82f6',
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
		images: [
			'/projects/layanan-karir/lk-1.webp',
			'/projects/layanan-karir/lk-2.webp',
			'/projects/layanan-karir/lk-3.webp',
		],
		tech: ['PHP', 'Laravel 7', 'MySQL'],
		github: 'https://github.com/ferriyusra/e-career/issues/1',
		demo: null,
		featured: false,
		color: '#f59e0b',
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
		images: [
			'/projects/crowdfounding/cf-1.webp',
			'/projects/crowdfounding/cf-2.webp',
			'/projects/crowdfounding/cf-3.webp',
		],
		tech: ['React.Js', 'Next.Js', 'Express.Js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/ferriyusra/crowdfunding-be',
		demo: 'https://crowdfunding-fe-dun.vercel.app/',
		featured: false,
		color: '#e11d48',
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
		images: ['/projects/gis/gis-1.webp'],
		tech: ['PHP', 'Codeigniter 3', 'Leaflet', 'MySQL'],
		github: null,
		demo: null,
		featured: false,
		color: '#7c3aed',
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
		images: ['/projects/as/as-1.png'],
		tech: ['Python', 'Implement Algorithm TF-IDF', 'Implement Algorithm Naive Bayes Classifier'],
		github: 'https://github.com/ferriyusra/Analisis-Sentimen-Naive-Bayes/issues/1',
		demo: 'https://www.researchgate.net/publication/368490963_Application_of_the_Naive_Bayes_Classifier_Algorithm_to_Analyze_Sentiment_for_the_Covid-19_Vaccine_on_Twitter_in_Jakarta',
		featured: true,
		color: '#7c3aed',
		initial: 'AS',
		stars: 0,
		type: 'case-study',
	},
];
