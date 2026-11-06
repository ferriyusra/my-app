# Ferri Yusra, portfolio

A backend engineer's portfolio: one server-rendered page and one long-form
case study, designed with [Hallmark](https://github.com/Nutlope/hallmark)'s
Grid theme.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## What is in it

| Route | What it shows |
|---|---|
| `/` | An interview: the five places worked as one index on the first sheet, then a question per section (tools, roles, what shipped for SATUSEHAT, contact), each answered in a line with the depth folded; the case study is linked from the nav and the Meditap role |
| `/deposit-alerting` | The case study as a long document: the problem, the architecture diagram, the state machine, the decisions, the outcome, and the questions the write-up does not answer |

Every word is in the server response, so the pages read the same with
scripting off, in print and to a crawler. The home page shows about 430 words;
the rest sits in native disclosures.

All content is typed data in `src/data/`. The case study is transcribed from
the author's own write-up in `public/projects/meditap/`, and a test keeps the
two in step.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npm test         # unit tests (Node's built-in runner)
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (reset and
tokens only; the styling is hand-written CSS). The design system is locked in
[DESIGN.md](DESIGN.md).

Until November 2026 this repository was a Windows 11 desktop that ran in the
browser. It was retired in favour of this design; it remains in the git
history.
