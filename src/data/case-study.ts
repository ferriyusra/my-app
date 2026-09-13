/**
 * One production system, written up at more than bullet-point depth.
 *
 * The record is `public/projects/meditap/portfolio-aso-case-study.md`, the
 * author's own write-up of the work. This file is that document as typed data,
 * so the Experience window, the server document, Explorer, Start's search and
 * the terminal all render one shape of it — and `case-study.test.ts` reads the
 * Markdown and fails when the two drift: the title, the role, the stack, the
 * summary, every section heading, every code block and every table row here
 * must be the ones in the source.
 *
 * Everything the write-up leaves unsaid stays unsaid. Where a reader with
 * production experience would ask about something the document does not
 * record, the question is listed in `openQuestions` rather than answered with
 * a plausible guess. A case study that pretends to have no gaps reads as
 * marketing; one that names them reads as engineering.
 *
 * The employer is named on this site (the role is in `experience.ts`); the
 * prose keeps the document's own generic wording.
 */

/** One block of a section: a paragraph, a list, a code block, a table, or the figure. */
export type CaseBlock =
	| string
	| { kind: 'list'; items: string[] }
	| { kind: 'code'; lang: string; text: string }
	| { kind: 'table'; head: string[]; rows: string[][] }
	| { kind: 'figure' };

export type CaseSection = {
	heading: string;
	body: CaseBlock[];
};

/** One box in the figure: a part the write-up names, and a phrase it says about it. */
export type FigureNode = { label: string; detail?: string };
/** One row of boxes: a path draws arrows between them, a set stands them side by side. */
export type FigureRow = { name: string; kind: 'path' | 'set'; nodes: FigureNode[] };

/* The decision function, verbatim from the write-up. Tabs are the source's. */
const DECIDE = `// decide returns whether to email this client today, given today's reading
// and the last decision recorded for them.
func decide(cur reading, last *record) decision {
	if cur.t1 == 0 && cur.t2 == 0 {
		return decision{send: false, reason: "no thresholds configured"}
	}

	level := classify(cur) // "" (safe), "threshold1", or "threshold2"

	if level == "" {
		return decision{send: false, level: "safe", reason: "above both thresholds"}
	}
	if last == nil {
		return decision{send: true, level: level, reason: "first evaluation"}
	}

	// Material changes always win over repeat-suppression.
	if last.t1 != cur.t1 || last.t2 != cur.t2 {
		return decision{send: true, level: level, reason: "thresholds changed"}
	}
	if last.initialDeposit != cur.initialDeposit {
		return decision{send: true, level: level, reason: "top-up posted, still breaching"}
	}
	if last.level == "threshold1" && level == "threshold2" {
		return decision{send: true, level: level, reason: "escalation"}
	}

	// Already warned at this level and nothing changed — record it, don't email.
	if last.level == "threshold1" || last.level == "threshold2" {
		return decision{send: false, level: level, reason: "repeat breach suppressed"}
	}
	return decision{send: true, level: level, reason: "new breach after a safe period"}
}`;

export const caseStudy = {
	slug: 'deposit-alerting',
	title: 'Deposit Threshold Alerting for Self-Funded Health Plans',
	at: 'Meditap',
	/* Must equal the host role's own `period`; `data.test.ts` pins it. */
	period: 'Jul 2025 — Present',
	role: 'Backend Engineer — design & implementation',
	domain: 'Health insurance / benefits administration',
	year: '2025–2026',
	/** The write-up this file is transcribed from, served as-is. */
	source: '/projects/meditap/portfolio-aso-case-study.md',
	/** The entry in `projects.ts` that is this system's card. */
	project: 'deposit-alerting',
	summary:
		'A Go service that watches corporate health-plan deposit balances across three source systems and warns clients at two severity levels before their coverage gets suspended — with a state machine that suppresses repeat alerts without ever swallowing an escalation.',
	/* The source's own spellings; this list joins nothing. */
	stack: ['Go', 'PostgreSQL', 'SQL Server', 'Google Cloud Pub/Sub', 'Protobuf', 'Gin', 'GORM'],

	sections: [
		{
			heading: 'The problem',
			body: [
				"Some corporate clients don't buy insurance — they self-fund. The company places a deposit with the benefits administrator, and every employee's medical claim is settled out of that deposit. It's a good arrangement until the deposit runs low: once the remaining balance can't cover the claims already in flight, cashless treatment has to be suspended. That failure doesn't land in an inbox — it lands on an employee standing at a hospital admission desk.",
				'Preventing it means noticing the slide early and asking the client to top up. The catch is that "remaining balance" isn\'t a number you can look up anywhere:',
				{
					kind: 'list',
					items: [
						"the deposit ledger and each client's warning levels live in the **finance ERP**;",
						'the exposure from claims that are open but not yet paid lives in the **core claim system**, a legacy SQL Server database;',
						'who to contact, in which language, with whom in copy, is commercial information owned by the **account team**.',
					],
				},
				'The real number only exists once all three are joined.',
			],
		},
		{
			heading: 'What I built',
			body: [
				"**A configuration module.** An internal CRUD surface where the finance and account teams maintain each client's rules: invoice percentage and payment terms, how excess and outstanding claims are billed, document-fee model, and the full notification setup — recipients, internal and external CC lists, subject, and an active/inactive switch the alerting job respects. Creating a client validates its ID against the ERP's partner registry before anything is stored, and every edit writes a field-level audit entry in business language, so a change to a notification list is traceable to a person rather than a timestamp.",
				'**A daily alerting pipeline.** A scheduled job that evaluates every client with configured thresholds, decides who is at risk, and emails them at one of two severity levels: an early balance notice, or a warning that cashless and reimbursement service may be suspended. Sending is handled by a separate notification service — this one publishes a typed message and moves on.',
			],
		},
		{
			heading: 'Architecture',
			body: [
				'A message from the scheduler wakes the job. It reads its three sources once each — not once per client — then evaluates every client in memory:',
				{ kind: 'figure' },
				"Publishing the alert rather than calling the mail service directly buys three things worth more than the extra hop: the two services deploy independently, a slow mail provider can't stall the evaluation loop, and the message is a versioned schema — a field renamed on either side breaks a build instead of a production email.",
			],
		},
		{
			heading: 'The interesting part: deciding when to speak',
			body: [
				'Working out **who** is at risk is arithmetic:',
				{ kind: 'code', lang: 'text', text: 'balance estimation = current balance − claims billed but not yet paid' },
				"Compare that to the client's two thresholds and you have their severity level.",
				'Working out **whether to email them today** is the actual design problem. Send on every run and the alert becomes background noise within a week — the classic failure mode of monitoring systems. Suppress too eagerly and you silence the one message that mattered.',
				"So the decision is a state machine over the client's last recorded state, and the rules are evaluated in a deliberate order. The first match wins, which means the ordering *is* the policy:",
				{ kind: 'code', lang: 'go', text: DECIDE },
				'The resulting behaviour:',
				{
					kind: 'table',
					head: ['Last state', "Today's reading", 'Email?', 'Why'],
					rows: [
						['none', 'below threshold 1', '**Yes**', 'Nothing to compare against'],
						['safe', 'below threshold 1', '**Yes**', 'New breach after a safe period'],
						['safe', 'below threshold 2', '**Yes**', 'Straight to critical'],
						['threshold 1', 'below threshold 2', '**Yes**', 'Severity increased'],
						['threshold 1', 'below threshold 1', 'No', 'Already warned at this level'],
						['threshold 2', 'below threshold 2', 'No', 'Already warned at this level'],
						['any', 'thresholds edited, still breaching', '**Yes**', 'The figures they last saw are stale'],
						['any', 'deposit topped up, still breaching', '**Yes**', "They acted; it wasn't enough"],
						['any', 'above both thresholds', 'No', 'Recovery is logged, not announced'],
					],
				},
				"Three rules sit deliberately *above* the repeat-suppression rule — threshold edits, top-ups, and escalation. Those are the cases where a client's situation has genuinely changed, and they're exactly what a naive \"don't repeat yourself\" filter would swallow.",
			],
		},
		{
			heading: "Decisions I'd defend",
			body: [
				'**Record every evaluation, not just the sends.** The most frequent question about an alerting system is never "why did this email arrive" — it\'s "why didn\'t client X get one today". Every client processed writes a row carrying the decision, the reason in plain language, the state transition, and each figure used to reach it. That turns a support question from an engineering investigation into a spreadsheet lookup, and the same rows become a daily export the finance team opens in the format they already work in.',
				"**Read the source systems once per run.** Client configuration, claim exposure and prior decisions are each fetched in a single query rather than per client — including a window-function query to rank each client's history and pull only the latest row. Three heterogeneous systems, one round trip each.",
				'**Cross-system name matching is the real integration risk.** The ERP and the internal portal are maintained by different teams, and the only reliable join key between them is the company name. Matching runs through a case-insensitive index built once per run, and a client present in one system but missing from the other is recorded with an explicit "missing configuration" outcome instead of being silently dropped — so a mismatch shows up in the daily export as data rather than as an absence nobody notices.',
				'**One feature flag, honoured at every entry point.** The scheduled check, the publish step, the status write-back and even the subscriber registration all read the same flag. The whole feature could be deployed dark and switched on per environment, which is how it reached production without a separate release branch.',
			],
		},
		{
			heading: 'Outcome',
			body: [
				{
					kind: 'list',
					items: [
						'Deposit monitoring runs on a schedule and produces a written, reviewable decision for every client every day, instead of depending on someone remembering to check.',
						'Clients get a graded warning — a notice first, a service-suspension warning second — with the figures that justify it.',
						'Billing and notification rules became configuration an account manager edits in a UI, with a field-level audit trail, rather than assumptions baked into code.',
					],
				},
			],
		},
		{
			heading: "What I'd change next",
			body: [
				"**Extract the decision engine into a pure package.** It currently lives on the service alongside its data access. As a standalone function over a small input struct, the behaviour table above becomes a table-driven test suite almost verbatim — the highest-value test in the whole feature, and the one I'd write first if I started again.",
				'**Close the delivery loop.** The audit trail records that an alert was *published*, not that it was *delivered* — the notification service never reports back. A delivery callback would make "did the client actually receive it?" answerable from the same table that answers everything else.',
			],
		},
	] as CaseSection[],

	/**
	 * The shape of the system: the write-up's own diagram, as boxes. Every
	 * label and every detail is a phrase from the write-up, and
	 * `case-study.test.ts` fails if one is not, because a diagram is where
	 * "claim nothing unrecorded" slips most easily. Labels keep the source's
	 * casing.
	 */
	figure: {
		caption:
			'The write-up\'s own diagram, redrawn: the boxes are the parts it names, the arrows the path it states. The reads happen once each per run; the writes every run.',
		rows: [
			{
				name: 'The run',
				kind: 'path',
				nodes: [
					{ label: 'scheduler', detail: 'wakes the job' },
					{ label: 'message queue' },
					{ label: 'deposit watch service', detail: 'Go · reads its three sources once each · evaluates every client in memory' },
					{ label: 'alert queue', detail: 'typed message · for clients that need one' },
					{ label: 'notification service', detail: 'Go' },
					{ label: 'client mailbox' },
				],
			},
			{
				name: 'Reads, once each per run',
				kind: 'set',
				nodes: [
					{ label: 'finance ERP', detail: 'PostgreSQL · deposit, balance, thresholds, unpaid invoices' },
					{ label: 'core claim system', detail: 'SQL Server · exposure from open claims' },
					{ label: 'portal DB', detail: 'PostgreSQL · client config, previous decisions' },
				],
			},
			{
				name: 'Writes, every run',
				kind: 'set',
				nodes: [
					{ label: 'decision row', detail: 'per client, every run' },
					{ label: 'typed message', detail: 'on the alert queue · for clients that need one' },
					{ label: 'daily audit spreadsheet', detail: "to the finance team's file share" },
				],
			},
		] as FigureRow[],
	},

	/**
	 * Not rhetorical. These are the parts a reader with real experience would
	 * ask about, and the write-up does not record them. Two of the earlier
	 * questions — which store holds what, and how a threshold change reaches
	 * production — are answered by the write-up now, so they are gone.
	 */
	openQuestions: [
		'What the retry and idempotency semantics are on the scheduled run: a message from the scheduler is delivered at least once, and the write-up does not say what a second wake-up on the same day does — evaluate again and suppress, or skip.',
		'What happens when one of the three source systems is unreachable during a run — whether the run is skipped, retried, or recorded as a missing outcome for every client.',
	],
} as const;

/** Prose without its emphasis marks. Code keeps its asterisks (`*record` is a pointer). */
function plain(text: string): string {
	return text.replace(/\*/g, '');
}

/**
 * Every line of the write-up as plain text, in reading order — what the search
 * index and the tests see. One flattening, so a new block kind cannot be
 * rendered on the page and missed by the index.
 */
export function caseStudyText(): string[] {
	const out: string[] = [caseStudy.title, caseStudy.summary, ...caseStudy.stack];
	for (const s of caseStudy.sections) {
		out.push(s.heading);
		for (const b of s.body) {
			if (typeof b === 'string') out.push(plain(b));
			else if (b.kind === 'list') out.push(...b.items.map(plain));
			else if (b.kind === 'code') out.push(b.text);
			else if (b.kind === 'table') out.push(...b.head, ...b.rows.flat().map(plain));
		}
	}
	out.push(...caseStudy.openQuestions);
	return out;
}
