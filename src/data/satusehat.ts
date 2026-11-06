import type { CaseSection } from './case-study.ts';

/**
 * A rough case study of the SATUSEHAT work, across two roles.
 *
 * Unlike `case-study.ts` there is no write-up behind it. It was drafted on
 * 2026-11-06 from what the owner remembers, told in so many words: the
 * dashboards were built in Go over PostgreSQL, MongoDB and BigQuery; the data
 * team built the pipelines and the owner consumed the data they loaded; the
 * SATUSEHAT Data API was a previous team's NestJS, Prisma and PostgreSQL
 * project that the owner continued. Everything else is taken from the two
 * roles' own bullets in `experience.ts` and the two projects in
 * `projects.ts`, and says no more than they do.
 *
 * The owner does not remember the detail, so the page is rough on purpose and
 * says so. What a reader would ask next and nobody kept goes in
 * `openQuestions`, the same discipline as the deposit-alerting case: a gap
 * named, never a plausible guess.
 */
export const satusehat = {
	slug: 'satusehat',
	/* What the nav's case-study menu calls it. */
	name: 'SATUSEHAT Dashboards and Data API',
	title: 'Backend for SATUSEHAT dashboards and the Data API',
	summary:
		"Two pieces of backend work for SATUSEHAT, Indonesia's national health data platform, from July 2023 to March 2025: Go APIs serving the Ministry of Health's native dashboards in place of Tableau's data layer, and continued work on the SATUSEHAT Data API in NestJS. It is written from memory, so it stays rough, and what is not remembered is listed at the end rather than guessed.",
	/* The roles it spans, by `short` in experience.ts, oldest first.
	   data.test.ts fails if one stops matching. */
	at: ['GovTech Health', 'INA Digital'],
	/* The entries in projects.ts this page is about; its live link comes from
	   the first. */
	projects: ['ssd', 'native'],
	stack: ['Go', 'Gin', 'PostgreSQL', 'MongoDB', 'BigQuery', 'Redis', 'NestJS', 'Prisma', 'Datadog'],

	sections: [
		{
			heading: 'Dashboards: replacing Tableau',
			body: [
				"The Ministry of Health's dashboards for SATUSEHAT were built in Tableau. The work was to move them to native, in-house dashboards: less dependence on Tableau, lower licensing costs, and pages that load faster.",
				'I joined that migration at its start, in the Health Technology Transformation and Digitalization Team in July 2023, and carried on with it at INA Digital from January 2024 to March 2025.',
			],
		},
		{
			heading: 'Dashboards: who built what',
			body: [
				'Three groups shared each dashboard, and the line between them is the most useful thing to know about my part.',
				{
					kind: 'list',
					items: [
						'**The data team** built and ran the pipelines that load the data into PostgreSQL, MongoDB and Google BigQuery.',
						'**I** built the backend: API services in Go that read what the pipelines had loaded and shape it for each dashboard. I consumed the data; I did not build the pipelines.',
						'**Frontend engineers** built the dashboards on top of those APIs, with product managers and data analysts deciding what each one shows.',
					],
				},
			],
		},
		{
			heading: 'Dashboards: the APIs I built',
			body: [
				{
					kind: 'list',
					items: [
						'A dedicated API layer in Go (Gin) for the dashboards, reading from PostgreSQL, MongoDB and BigQuery, with Redis caching.',
						'A Next.js API endpoint that proxied requests to an external data source.',
						"Datadog monitoring on the services, tracking API performance and error rates to the company's observability standard.",
					],
				},
				'The dashboards I built backends for:',
				{
					kind: 'list',
					items: [
						'2023: Gerakan Anak Sehat, Covid-19 Vaksin, Morbiditas Pasien, Kualitas Internet Survey & Monitoring, and the first release of Monitoring Implementasi SATUSEHAT.',
						'2024 to 2025: Penyakit Tidak Menular and Pemantauan Aliran Data SATUSEHAT.',
					],
				},
			],
		},
		{
			heading: 'Dashboards: what changed',
			body: [
				"Tableau's data layer was replaced by services the team owns. That lowered the licensing costs and made the dashboards faster. I did not keep figures for either.",
			],
		},
		{
			heading: 'The Data API, inherited',
			body: [
				"The SATUSEHAT Data portal brings Indonesia's health data and its processed results into one place, in four parts: Dashboard, Dataset, Metadata and Data Services.",
				'Its API was built by a previous team in NestJS, with Prisma over PostgreSQL. I picked it up at INA Digital in January 2024 and continued it.',
			],
		},
		{
			heading: 'The Data API: what I did',
			body: [
				'I maintained and extended the API services: new endpoints and improvements as the requirements for nationwide health data integration changed, so that data exchange stayed reliable.',
			],
		},
	] as CaseSection[],

	/**
	 * What a reader would ask next and the owner no longer has. Listed, not
	 * answered: a figure invented here would be the one thing on the page a
	 * careful reader could catch.
	 */
	openQuestions: [
		'How much data the dashboards read and how quickly the APIs answered. Request volumes and latencies were not kept.',
		'Which store each dashboard read from, and why its data sat in PostgreSQL, MongoDB or BigQuery.',
		'What the Redis cache held, for how long, and how it was cleared when the pipelines loaded new data.',
		'What the Tableau licences cost before the migration and after it.',
		'Which endpoints were added to the Data API, and which services called them.',
	],
} as const;
