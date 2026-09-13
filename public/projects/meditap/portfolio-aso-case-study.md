---
title: "Deposit Threshold Alerting for Self-Funded Health Plans"
role: "Backend Engineer — design & implementation"
stack: ["Go", "PostgreSQL", "SQL Server", "Google Cloud Pub/Sub", "Protobuf", "Gin", "GORM"]
domain: "Health insurance / benefits administration"
year: "2025–2026"
---

<!--
HOW TO USE THIS FILE
- "Card blurb" below is for the project grid on your portfolio home.
- Everything from "Case study" down is the detail page.
- Company name is intentionally left generic. Swap it in only if you have
  clearance to name your employer.
-->

## Card blurb (project grid, ~40 words)

A Go service that watches corporate health-plan deposit balances across three
source systems and warns clients at two severity levels before their coverage
gets suspended — with a state machine that suppresses repeat alerts without ever
swallowing an escalation.

**Tags:** Go · Event-driven · Pub/Sub · Multi-system integration · Scheduled jobs

---

# Case study

## The problem

Some corporate clients don't buy insurance — they self-fund. The company places a
deposit with the benefits administrator, and every employee's medical claim is
settled out of that deposit. It's a good arrangement until the deposit runs low:
once the remaining balance can't cover the claims already in flight, cashless
treatment has to be suspended. That failure doesn't land in an inbox — it lands
on an employee standing at a hospital admission desk.

Preventing it means noticing the slide early and asking the client to top up. The
catch is that "remaining balance" isn't a number you can look up anywhere:

- the deposit ledger and each client's warning levels live in the **finance ERP**;
- the exposure from claims that are open but not yet paid lives in the **core
  claim system**, a legacy SQL Server database;
- who to contact, in which language, with whom in copy, is commercial information
  owned by the **account team**.

The real number only exists once all three are joined.

## What I built

**A configuration module.** An internal CRUD surface where the finance and
account teams maintain each client's rules: invoice percentage and payment terms,
how excess and outstanding claims are billed, document-fee model, and the full
notification setup — recipients, internal and external CC lists, subject, and an
active/inactive switch the alerting job respects. Creating a client validates its
ID against the ERP's partner registry before anything is stored, and every edit
writes a field-level audit entry in business language, so a change to a
notification list is traceable to a person rather than a timestamp.

**A daily alerting pipeline.** A scheduled job that evaluates every client with
configured thresholds, decides who is at risk, and emails them at one of two
severity levels: an early balance notice, or a warning that cashless and
reimbursement service may be suspended. Sending is handled by a separate
notification service — this one publishes a typed message and moves on.

## Architecture

A message from the scheduler wakes the job. It reads its three sources once each —
not once per client — then evaluates every client in memory:

```
scheduler ──▶ message queue ──▶ deposit watch service (Go)
                                  │
      reads ◀─────────────────────┤
      • finance ERP (PostgreSQL) — deposit, balance, thresholds, unpaid invoices
      • core claim system (SQL Server) — exposure from open claims
      • portal DB (PostgreSQL) — client config, previous decisions
                                  │
      writes ◀────────────────────┤
      • one decision row per client, every run
      • typed message on the alert queue — for clients that need one
      • daily audit spreadsheet to the finance team's file share
                                  │
                                  ▼
                    notification service (Go) ──▶ client mailbox
```

Publishing the alert rather than calling the mail service directly buys three
things worth more than the extra hop: the two services deploy independently, a
slow mail provider can't stall the evaluation loop, and the message is a
versioned schema — a field renamed on either side breaks a build instead of a
production email.

## The interesting part: deciding *when* to speak

Working out **who** is at risk is arithmetic:

```
balance estimation = current balance − claims billed but not yet paid
```

Compare that to the client's two thresholds and you have their severity level.

Working out **whether to email them today** is the actual design problem. Send on
every run and the alert becomes background noise within a week — the classic
failure mode of monitoring systems. Suppress too eagerly and you silence the one
message that mattered.

So the decision is a state machine over the client's last recorded state, and the
rules are evaluated in a deliberate order. The first match wins, which means the
ordering *is* the policy:

```go
// decide returns whether to email this client today, given today's reading
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
}
```

The resulting behaviour:

| Last state | Today's reading | Email? | Why |
|---|---|---|---|
| none | below threshold 1 | **Yes** | Nothing to compare against |
| safe | below threshold 1 | **Yes** | New breach after a safe period |
| safe | below threshold 2 | **Yes** | Straight to critical |
| threshold 1 | below threshold 2 | **Yes** | Severity increased |
| threshold 1 | below threshold 1 | No | Already warned at this level |
| threshold 2 | below threshold 2 | No | Already warned at this level |
| any | thresholds edited, still breaching | **Yes** | The figures they last saw are stale |
| any | deposit topped up, still breaching | **Yes** | They acted; it wasn't enough |
| any | above both thresholds | No | Recovery is logged, not announced |

Three rules sit deliberately *above* the repeat-suppression rule — threshold
edits, top-ups, and escalation. Those are the cases where a client's situation
has genuinely changed, and they're exactly what a naive "don't repeat yourself"
filter would swallow.

## Decisions I'd defend

**Record every evaluation, not just the sends.** The most frequent question about
an alerting system is never "why did this email arrive" — it's "why didn't client
X get one today". Every client processed writes a row carrying the decision, the
reason in plain language, the state transition, and each figure used to reach it.
That turns a support question from an engineering investigation into a
spreadsheet lookup, and the same rows become a daily export the finance team
opens in the format they already work in.

**Read the source systems once per run.** Client configuration, claim exposure
and prior decisions are each fetched in a single query rather than per client —
including a window-function query to rank each client's history and pull only the
latest row. Three heterogeneous systems, one round trip each.

**Cross-system name matching is the real integration risk.** The ERP and the
internal portal are maintained by different teams, and the only reliable join key
between them is the company name. Matching runs through a case-insensitive index
built once per run, and a client present in one system but missing from the other
is recorded with an explicit "missing configuration" outcome instead of being
silently dropped — so a mismatch shows up in the daily export as data rather than
as an absence nobody notices.

**One feature flag, honoured at every entry point.** The scheduled check, the
publish step, the status write-back and even the subscriber registration all read
the same flag. The whole feature could be deployed dark and switched on per
environment, which is how it reached production without a separate release
branch.

## Outcome

- Deposit monitoring runs on a schedule and produces a written, reviewable
  decision for every client every day, instead of depending on someone
  remembering to check.
- Clients get a graded warning — a notice first, a service-suspension warning
  second — with the figures that justify it.
- Billing and notification rules became configuration an account manager edits in
  a UI, with a field-level audit trail, rather than assumptions baked into code.

## What I'd change next

**Extract the decision engine into a pure package.** It currently lives on the
service alongside its data access. As a standalone function over a small input
struct, the behaviour table above becomes a table-driven test suite almost
verbatim — the highest-value test in the whole feature, and the one I'd write
first if I started again.

**Close the delivery loop.** The audit trail records that an alert was
*published*, not that it was *delivered* — the notification service never reports
back. A delivery callback would make "did the client actually receive it?"
answerable from the same table that answers everything else.

---

## Résumé bullets

**One-liner**

> Built a Go service that monitors self-funded health-plan deposit balances
> across corporate clients and issues two-level, state-aware alerts — joining an
> ERP deposit ledger, a legacy claim system and internal configuration, and
> publishing typed queue messages to a separate notification service.

**Expanded**

- Designed a state-machine alerting engine that suppresses repeat warnings while
  guaranteeing delivery on escalation, threshold changes and deposit top-ups.
- Integrated three heterogeneous sources (PostgreSQL ERP, legacy SQL Server, and
  the service's own database) with one batched read per source per run.
- Built the client configuration module — CRUD, cross-system validation, and
  field-level audit logging — turning per-client billing and notification rules
  into data an account manager can edit.
- Decoupled evaluation from delivery with schema-versioned Pub/Sub messages
  consumed by a separate Go service.
- Shipped to production behind a single feature flag honoured by every entry
  point, including message subscriber registration.
