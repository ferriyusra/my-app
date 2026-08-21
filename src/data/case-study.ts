/**
 * One production system, written up at more than bullet-point depth.
 *
 * Everything here traces to the Meditap entry in `experience.ts` — the ~160
 * entities, the two services, Pub/Sub and Cloud Scheduler, KrakenD and
 * Keycloak, the CMS. Nothing about the internals is invented: where a design
 * decision is not recorded anywhere in this repository, the write-up describes
 * the shape of the system rather than claiming a rationale nobody wrote down.
 *
 * `openQuestions` is deliberately part of the data and deliberately shown. A
 * case study that pretends to have no gaps reads as marketing; one that names
 * them reads as engineering.
 */

export type CaseSection = {
	heading: string;
	body: string[];
};

export const caseStudy = {
	slug: 'aso-billing',
	title: 'A billing source of truth for ~160 entities',
	at: 'Meditap',
	period: 'Jul 2025 — present',
	role: 'Backend Engineer',
	summary:
		'Finance was tracking ~160 ASO entities in spreadsheets and watching balances by hand. The replacement is two Go services, an event-driven notification path on Pub/Sub, and a CMS the finance team operates without an engineer.',
	stack: [
		'Go (Gin)',
		'PostgreSQL',
		'MS SQL Server',
		'Redis',
		'Google Pub/Sub',
		'Cloud Scheduler',
		'KrakenD',
		'Keycloak',
		'React',
	],

	sections: [
		{
			heading: 'The problem',
			body: [
				'Billing for roughly 160 ASO entities ran on spreadsheets. That is workable at ten entities and quietly untenable at a hundred and sixty: the file is the record, the record is whatever the last person saved, and there is no answer to "what did this entity owe on the 3rd" that does not involve opening an older copy.',
				'The expensive part was not the arithmetic. It was that balance thresholds had to be watched by a person. Somebody on the finance team opened the sheet, read down a column, and raised a flag — every cycle, indefinitely, with the failure mode being that a busy week meant a threshold was crossed and nobody noticed until invoicing.',
			],
		},
		{
			heading: 'What replaced it',
			body: [
				'Two services. **ASO Database** holds the entity records and exposes them over a REST API — the structured, real-time data that billing and payment collection are now driven from directly, rather than transcribed out of a sheet. **ASO Notification Below Threshold** watches balances and raises the alert that a person used to raise.',
				'The notification path is event-driven rather than polled from the API: Cloud Scheduler triggers the recurring billing runs, and Pub/Sub carries the threshold events. That split matters — the schedule is a known cadence and belongs to a scheduler, while a threshold crossing is a fact about data that should propagate the moment it becomes true, not on the next sweep.',
			],
		},
		{
			heading: 'Access, and why it is a separate concern',
			body: [
				'Several internal services and several user roles needed to reach this data, and the naive version of that is per-service auth code — which is where role checks drift apart and one service ends up more permissive than the rest.',
				'Access is centralised instead: KrakenD as the API gateway, Keycloak as the identity provider, role-based access enforced in one place rather than re-implemented per service. The point is not that it is impossible to get authorisation right in each service; it is that keeping several implementations in agreement over time is work nobody schedules, and misconfiguration is the failure that follows.',
			],
		},
		{
			heading: 'The interface finance actually uses',
			body: [
				'An API that only engineers can operate has moved the bottleneck rather than removed it. The system includes an internal CMS in React and Material UI, so the finance team reads and manages this data themselves.',
				'That is the part that decides whether the migration held. Before, every question about the data was answered by a spreadsheet; if the replacement had answered them with a support ticket, the sheets would have come back within a quarter.',
			],
		},
		{
			heading: 'What it changed',
			body: [
				'Billing and payment collection now run off a single source of truth rather than a file, for ~160 entities. Threshold monitoring that was a standing manual task is gone — not reduced, removed. Access management for the surrounding services is configured in one place, which is what took the misconfiguration risk down.',
				'The honest framing of the result: none of this is novel architecture. It is a fairly ordinary set of choices — a REST service, a scheduler, a message bus, a gateway, an IAM — applied to a process that was being done by hand. Most of the value was in noticing that the manual monitoring was the expensive part, and that it was the part an event bus makes disappear.',
			],
		},
	] as CaseSection[],

	/**
	 * Not rhetorical. These are the parts a reader with real experience would
	 * ask about, and they are not recorded anywhere in this repository.
	 */
	openQuestions: [
		'What the retry and idempotency semantics are on the billing run — a scheduled job publishing to Pub/Sub is at-least-once, and money makes duplicates expensive.',
		'Why both PostgreSQL and MS SQL Server are in the stack, and where the boundary between them falls.',
		'What Redis is caching, and what happens to the numbers finance sees when it is cold or stale.',
		'How a threshold change is rolled out — configuration, deploy, or something finance can set from the CMS.',
	],
} as const;
