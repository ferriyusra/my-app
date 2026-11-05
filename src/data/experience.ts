/**
 * Work history, lifted out of the Experience component so the desktop's
 * Experience window can render it without importing a page section.
 *
 * `stats` are the countable figures a role card leads with, and only those.
 * Every value is counted from that role's own `description` / `achievements`:
 * Meditap's 300+ records, ~19 RPCs and 154 tests are stated outright; the
 * service, store, dashboard and product-line counts elsewhere are the named
 * items in those sentences, counted. A
 * tile promises a metric, so nothing that is not a number goes in one. The
 * tiles used to hold "National", "Kafka", "On-call" and "PHP", and the
 * current role's third tile was the 20–30% productivity estimate — the one
 * figure here that was an estimate. That stays in its bullet.
 *
 * `highlights` are the facts that are not numbers: two or three short
 * phrases, each lifted from a bullet below, shown as a line rather than as
 * tiles. If it is not in the prose it does not belong in either list.
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
		/* Rewritten on 2026-11-05 to cover the new bullets below: it used to name
		   only the finance services. The spreadsheet and single-source-of-truth
		   claims are the old description's own; "health-plan" is the
		   deposit-alerting write-up's word for the ASO clients. */
		description:
			'Designed and developed backend systems for health-plan administration in Go and PostgreSQL: the hospital inpatient case-monitoring (guarantee) workflow linking hospitals with the internal guarantee team, and the finance services (ASO Database, ASO deposit-balance monitoring) that replaced manual spreadsheet-based tracking and became the single source of truth for finance operations.',
		stats: [
			{ value: '300+', label: 'ASO client records' },
			{ value: '~19', label: 'gRPC RPCs shipped' },
			{ value: '154', label: 'unit tests written' },
		],
		highlights: [
			'Inpatient case monitoring across hospital and guarantee-team portals',
			'Duplicate alert emails prevented by alert history',
			'A broken object-level authorization gap closed in the HR portal',
		],
		/* The owner's own bullets, as given on 2026-11-05, verbatim. They
		   replaced ten earlier ones, four of which were the résumé bullets of the
		   deposit-alerting write-up in public/projects/meditap/; that write-up and
		   case-study.ts are unchanged and still describe the service as it was
		   written up. */
		achievements: [
			'Built the backend for a hospital inpatient case-monitoring (guarantee) workflow linking hospital and internal guarantee-team portals: pre-admission, care dashboard, treatment plans, discharge, and document management. Shipped ~19 gRPC RPCs across Go microservices, with Redis-cached lookups and RFC 5322 email threading for hospital correspondence.',
			'Built the ASO (Administrative Services Only) client database end to end, now holding 300+ client records. On the backend: Go (Gin) and PostgreSQL APIs with partner validation against Odoo ERP and field-level audit logs. On the frontend: a React/TypeScript module (MUI, React Hook Form + Zod, TanStack Query) where the Finance team manages billing settings.',
			'Automated ASO deposit-balance monitoring with Cloud Scheduler and Google Pub/Sub. Each run combines Odoo deposit data with claims incurred from the core claims system (SQL Server) and evaluates a 10-scenario threshold state machine (breach, escalation, recovery, top-up detection). It uses alert history to prevent duplicate emails and publishes Protobuf events that a notification service sends as client emails.',
			"Secured access across portals: defined Keycloak viewer/editor roles and registered API routes in the KrakenD gateway. Closed a broken object-level authorization gap in the client (HR) portal by limiting claim, approval, and ride-hailing data to each user's assigned policies.",
			'Raised engineering quality: added golangci-lint, OSV dependency scanning, pre-commit hooks, and cached/parallel CI steps. Wrote 154 unit tests while refactoring 45 case-monitoring handlers, and set up shared Claude Code configuration (custom subagents, commands, hooks) for AI-assisted refactoring and code review.',
		],
		/* Spelled as skills.ts spells a tool wherever it is one (Claude, not
		   Claude Code), so the name join in skill-evidence.ts holds. */
		tech: [
			'Go',
			'Gin',
			'gRPC',
			'Protobuf',
			'PostgreSQL',
			'MS SQL Server',
			'Redis',
			'Pub/Sub',
			'Cloud Scheduler',
			'Odoo',
			'KrakenD',
			'Keycloak',
			'TypeScript',
			'React',
			'Material UI',
			'React Hook Form',
			'Zod',
			'TanStack Query',
			'GORM',
			'Claude',
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
			{ value: '4', label: 'data stores integrated' },
		],
		highlights: [
			'SATUSEHAT, the national health data platform',
			'Tableau licence costs cut',
			'Datadog monitoring on every service',
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
		],
		highlights: [
			'Dashboards used by Ministry of Health stakeholders',
			'First Tableau-to-native migration',
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
		],
		highlights: [
			'Kafka producers and consumers',
			'Weekly on-call rotation',
			'Unit tests with Mocha, Chai and Jest',
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
		/* Nothing countable in a four-month first role; the card leads with the
		   highlights alone rather than dressing words up as figures. */
		stats: [] as { value: string; label: string }[],
		highlights: [
			'First engineering role',
			'PHP (Lumen) and MySQL',
			'First exposure to Go',
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
