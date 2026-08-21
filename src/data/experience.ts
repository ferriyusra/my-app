/**
 * Work history, lifted out of the Experience component so the desktop's
 * Experience window can render it without importing a page section.
 *
 * `stats` is the headline figure trio each role card leads with. Every value
 * is countable from that role's own `description` / `achievements` — the ~160
 * entities and the 20–30% are stated there outright; the service, dashboard
 * and product-line counts are the named items in those sentences, counted.
 * Nothing in `stats` is an estimate. If a number is not already in the prose
 * below it does not belong here.
 */

export const experiences = [
	{
		role: 'Backend Engineer',
		company: 'PT. Teknologi Pamadya Analitika (Meditap)',
		short: 'Meditap',
		endISO: null,
		period: 'Jul 2025 — Present',
		years: '2025 —',
		startISO: '2025-07',
		current: true,
		location: 'Jakarta, Indonesia',
		description:
			'Designed and developed backend systems for finance-related platforms using Go (Gin Framework) and PostgreSQL, delivering core services (ASO Database, ASO Notification Below Threshold) that replaced manual spreadsheet-based tracking and became the single source of truth for finance operations.',
		stats: [
			{ value: '~160', label: 'entities billed' },
			{ value: '2', label: 'core services' },
			{ value: '20–30%', label: 'faster routine work' },
		],
		achievements: [
			'Built and maintained RESTful API services powering financial workflows for ~160 ASO entities, enabling the Finance Team to manage and monitor structured, real-time data used directly for billing and payment collection.',
			'Automated threshold-based financial notifications and scheduled billing processes with an event-driven architecture using Google Pub/Sub and Cloud Scheduler, eliminating recurring manual monitoring tasks previously done by the Finance Team.',
			'Configured and managed KrakenD API Gateway and Keycloak IAM with role-based access control across multiple internal services and user roles, centralizing access management and reducing security-misconfiguration risk.',
			'Developed internal CMS tools using React and Material UI, giving non-technical stakeholders direct visibility into financial data and streamlining workflows that previously required engineering support.',
			'Accelerated feature delivery and improved code consistency by integrating AI-assisted coding and review tools (Anthropic Claude) into daily refactoring, documentation, and implementation workflows — ~20–30% productivity gain on routine engineering tasks.',
		],
		tech: [
			'Go',
			'TypeScript',
			'React',
			'PostgreSQL',
			'MS SQL Server',
			'Redis',
			'Pub/Sub',
			'Cloud Scheduler',
			'KrakenD',
			'Keycloak',
		],
	},
	{
		role: 'Backend Engineer',
		company: 'INA Digital (Peruri Digital Security)',
		short: 'INA Digital',
		endISO: '2025-03',
		period: 'Jan 2024 — Mar 2025',
		years: '2024 — 2025',
		startISO: '2024-01',
		current: false,
		location: 'Jakarta, Indonesia',
		description:
			"Primary backend engineer on multiple health data products under SATUSEHAT — Indonesia's national health data interoperability platform — collaborating with Product Managers, Technical Program Managers, and cross-functional stakeholders to deliver backend systems supporting national-scale health data initiatives.",
		stats: [
			{ value: 'National', label: 'scale — SATUSEHAT' },
			{ value: '4', label: 'data stores integrated' },
			{ value: 'Tableau', label: 'licence costs cut' },
		],
		achievements: [
			'Maintained and extended API services for the SATUSEHAT Data Product in Node.js (NestJS) and PostgreSQL, developing new endpoints and improvements to ensure reliable data exchange and support evolving requirements for nationwide health data integration.',
			'Built dedicated API layers in Go (Gin Framework) integrating PostgreSQL, Google BigQuery, MongoDB, and Redis caching to power web-based dashboards for the Business Intelligence team, enabling near real-time access to large-scale health datasets.',
			"Continued the migration of legacy Tableau dashboards into fully native, API-driven solutions by developing the backend services that replaced Tableau's data layer, further reducing third-party licensing costs and improving dashboard performance.",
			'Developed and maintained backend services in Go and Node.js powering native dashboards — including Penyakit Tidak Menular and Pemantauan Aliran Data SATUSEHAT — working alongside frontend engineers to deliver dashboards used by stakeholders to monitor and analyze national health data flows.',
			"Implemented Datadog monitoring for backend services following the company's observability standards, enabling API performance and error-rate tracking to support proactive issue detection.",
		],
		tech: [
			'Go',
			'Node.js',
			'NestJS',
			'PostgreSQL',
			'BigQuery',
			'MongoDB',
			'Redis',
			'Docker',
			'GCS',
			'Datadog',
		],
	},
	{
		role: 'Backend Engineer',
		company: 'Health Technology Transformation & Digitalization Team',
		short: 'GovTech Health',
		endISO: '2023-12',
		period: 'Jul 2023 — Dec 2023',
		years: '2023',
		startISO: '2023-07',
		current: false,
		location: 'Jakarta, Indonesia',
		description:
			'Primary backend engineer on multiple data-driven products under the Health Technology Transformation initiative, collaborating with Product Managers, Data Analysts, and frontend engineers to deliver internal web-based dashboard solutions for operational teams.',
		stats: [
			{ value: '5', label: 'dashboards delivered' },
			{ value: '3', label: 'data sources joined' },
			{ value: 'MoH', label: 'stakeholders served' },
		],
		achievements: [
			'Designed and developed scalable API services in Go (Gin Framework) integrating PostgreSQL, Google BigQuery, and MongoDB to power interactive dashboards used by analysts and operational stakeholders, complemented by a Next.js API endpoint built to proxy requests to an external data source.',
			"Contributed to the initial migration of legacy Tableau dashboards into fully native, in-house dashboard solutions by developing the backend services that replaced Tableau's data layer — reducing Tableau dependency, lowering licensing costs, and improving performance and long-term maintainability.",
			'Developed and maintained backend services for key dashboard deliveries — including Gerakan Anak Sehat, Covid-19 Vaksin, Morbiditas Pasien, Kualitas Internet Survey & Monitoring, and the initial release of Monitoring Implementasi SATUSEHAT — working alongside frontend engineers to deliver dashboards used by Ministry of Health stakeholders.',
			"Implemented Datadog monitoring for backend services following the company's observability standards, enabling API performance and error-rate tracking to support proactive issue detection.",
		],
		tech: [
			'Go',
			'Node.js',
			'TypeScript',
			'Next.js',
			'PostgreSQL',
			'BigQuery',
			'MongoDB',
			'Redis',
			'Docker',
			'Datadog',
		],
	},
	{
		role: 'Software Engineer Backend',
		company: 'PT Moladin Digital Indonesia',
		short: 'Moladin',
		endISO: '2023-02',
		period: 'Mar 2022 — Feb 2023',
		years: '2022 — 2023',
		startISO: '2022-03',
		current: false,
		location: 'Jakarta, Indonesia',
		description:
			'Implemented backend systems alongside Engineering Managers and Senior Software Engineers, translating technical designs and product requirements into reliable and scalable engineering solutions across multiple product lines.',
		stats: [
			{ value: '7', label: 'product lines' },
			{ value: 'Kafka', label: 'event-driven processing' },
			{ value: 'On-call', label: 'weekly rotation' },
		],
		achievements: [
			'Contributed to backend API services across multiple core product lines — including Crash Program, Referral Program, Survey Program, Academy Program, Banner Program, Second Inspection Program, and Open Production Issue Tools — using Node.js (Express.js) and Go with MySQL, PostgreSQL, and MongoDB integrations to support diverse business and operational workflows.',
			'Improved system reliability and maintainability by increasing test coverage and implementing unit tests using Mocha, Chai, and Jest for Express-based services, helping reduce regressions across backend services.',
			'Built Kafka producers and consumers leveraging the existing Apache Kafka infrastructure to enable event-driven, asynchronous processing across backend services and improve system decoupling.',
			'Served on weekly on-call rotation, performing bug triage, troubleshooting, and root-cause analysis across backend services to maintain production stability and resolve incidents promptly.',
		],
		tech: [
			'Go',
			'Node.js',
			'Express.js',
			'MySQL',
			'PostgreSQL',
			'MongoDB',
			'Kafka',
			'Sentry',
			'Jest',
			'Mocha',
		],
	},
	{
		role: 'Backend Engineer',
		company: 'PT Jojonomic Indonesia',
		short: 'Jojonomic',
		endISO: '2022-01',
		period: 'Oct 2021 — Jan 2022',
		years: '2021 — 2022',
		startISO: '2021-10',
		current: false,
		location: 'Jakarta, Indonesia',
		description:
			'Implemented backend systems alongside System Analysts based on technical designs and business processes defined by the Product Team, contributing to backend development for banking-related web applications.',
		stats: [
			{ value: 'First', label: 'engineering role' },
			{ value: 'PHP', label: 'Lumen and MySQL' },
			{ value: 'Go', label: 'first exposure' },
		],
		achievements: [
			'Developed RESTful API services using PHP (Lumen framework) with MySQL for data persistence, supporting core application workflows.',
			'Contributed minor Go-based features during system integration tasks, gaining early hands-on experience with Go that supported later backend development in subsequent roles.',
		],
		tech: ['PHP', 'Lumen', 'MySQL', 'Go'],
	},
];

export type Experience = (typeof experiences)[number];

/** Length of a role in months, from its own ISO dates. */
export function tenureMonths(exp: Experience, now: Date = new Date()): number {
	const [sy, sm] = exp.startISO.split('-').map(Number);
	const [ey, em] = exp.endISO
		? exp.endISO.split('-').map(Number)
		: [now.getFullYear(), now.getMonth() + 1];
	return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
}

/** "1 yr 8 mos" — the way LinkedIn and Windows both phrase a duration. */
export function tenureLabel(exp: Experience, now: Date = new Date()): string {
	const m = tenureMonths(exp, now);
	const years = Math.floor(m / 12);
	const months = m % 12;
	const parts = [];
	if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
	if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
	return parts.join(' ') || '1 mo';
}
