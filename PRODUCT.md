# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: technical hiring managers.** Engineers, tech leads and engineering
managers deciding whether Ferri Yusra can build what their team needs. They
arrive from an application, a referral or a link, and they read rather than
skim: the case study and the role detail are aimed at
this reader. When a design decision has to favour one audience, it favours
them.

Other readers exist and are not designed around: recruiters and HR screeners
(fast, often on a phone), prospective freelance clients, and peer engineers.
None of them may cost the primary reader anything.

## Product Purpose

A personal portfolio for a backend engineer: one server-rendered page and one
long-form case study. It exists to turn an evaluation into a decision to
proceed.

**Success is the CV being opened or downloaded.** Everything else on the site
is evidence pointed at that moment. The CV lives at the two Google Drive URLs
in `src/data/profile.ts` (`cvView`, `cvDownload`), and it is the one filled
primary key on the home page. Future work must not make that route harder to
find, and must not add a competing primary action that outranks it.

## Positioning

A backend engineer whose portfolio shows its working rather than describing
it:

- **the career at a glance** on the first screen: the five places worked as
  one index, each giving its year and tenure in place;
- one production system written up at real depth (`case-study.ts`,
  transcribed from the author's own Markdown in `public/projects/meditap/`,
  with a test that keeps the two in step), its decision function and
  behaviour table shown on the home page, and what the write-up leaves
  unrecorded held in `openQuestions` rather than invented;
- every word in the server response, so a crawler, an ATS scraper or a
  browser with scripting off reads the whole portfolio.

## Operating Context

- Read on a desktop-class screen by the primary reader, and on a phone by most
  recruiters. Both get the same page; it reflows rather than switching.
- Read alongside a CV, a GitHub profile and a LinkedIn profile, all linked
  from it.
- Often reached mid-application, with a job description in hand: the reader
  is checking a claim, not browsing.
- Time zone GMT+7 (Jakarta), which overlaps most of the EU morning and all of
  APAC.

## Capabilities and Constraints

**What it does.** Two routes, both static and server-rendered. `/` is the
portfolio as an interview: the career as an index, then a question per
section (tools, roles, the case as a control, the
other projects, contact), each answered in a line with the depth folded.
`/deposit-alerting` is the case study as a long document with its system
diagram. Disclosures are native `<details>`, so nothing needs a script to
open. The only client code opens them all before printing and runs the one
reveal, which the page does not need: without script it is already finished.

**Content is typed data.** `src/data/` holds `profile`, `experience`,
`projects`, `skills`, `case-study` and `notes`. Every surface
derives from it; none keeps a second copy. Derived figures (tenure, reading
length) are computed from ISO dates and text rather than written
down.

**Technical constraints that future work must hold:**

- Next.js 16 App Router, React 19, TypeScript strict. Tailwind v4 is used only
  for the reset and to emit the tokens; all styling is hand-written CSS in
  `src/app/globals.css` over `tokens.css` and `base.css`.
- Every page stays a server component. Before the server document existed the
  response body was an empty div and crawlers saw a blank portfolio.
- No colour or font family outside `tokens.css`. The share card and the
  theme-colour meta tag, which cannot read CSS, take theirs through
  `src/lib/palette.ts`, which reads the token file.
- Tests run on Node's built-in runner with native type stripping; no test
  dependency, no config.
- No environment variables. Nothing is required to run or deploy.

## Brand Commitments

- **Name:** Ferri Yusra. Role as stated: Backend Engineer (Go, Node.js and
  PostgreSQL). Site: ferriyusra.com.
- **The design system is Hallmark's Grid theme, locked in `DESIGN.md`.**
  White poster stock, blue-black ink, Radio Canada Big in sentence case, an
  ultramarine field and one Swiss red mark, no strokes. It is the third
  Hallmark run of 2026-11-05: Cobalt, then Console, then Grid because the
  owner found the page too wordy. Keep the home page near 430 visible words.
- **The Windows 11 desktop is retired.** Until 2026-11-05 this file called the
  desktop metaphor binding. The owner reversed that and had the shell deleted
  outright.
- **Voice: specific, plain, unembellished, and willing to name its own
  mistakes.** Concrete proof over adjectives. The case study's
  `openQuestions` set the register: state what is not known, without
  softening.
- **Availability, confirmed current:** freelance and full-time backend work,
  hybrid in Jakarta or remote.

## Evidence on Hand

Real, checkable, and already in the repository:

- **Five roles**, 2021-10 to present, all Jakarta: Meditap (current), INA
  Digital / Peruri Digital Security, the Health Technology Transformation and
  Digitalization Team (SATUSEHAT), Moladin, Jojonomic.
- **One deep case study:** Meditap's deposit-threshold alerting for
  self-funded health plans. The record is the author's Markdown write-up in
  `public/projects/meditap/`.
- **Nine projects** in `projects.ts`, joined by name to `skills.ts`, a join
  pinned by `data.test.ts` because it fails silently. Two production projects
  have real screenshots in `public/projects`.
- **28 skills** across Backend, Frontend, Database, DevOps, Cloud and AI
  Tools.
- **CV** at the Google Drive links in `profile.ts`. **GitHub:**
  github.com/ferriyusra. **LinkedIn:** linkedin.com/in/ferriyusra.

**Absences future work must not fabricate:** there are no testimonials, no
named clients beyond the employers listed, no benchmarks, no user counts, no
pricing, no awards, and no portrait image (`profile.portrait` is `null`). Do
not fill `openQuestions` with plausible invention.

## Product Principles

1. **Every surface derives from one typed source.** A second copy of a fact is
   a bug.
2. **Show the work, not the workings.** On 2026-11-05 the owner removed the
   page's "decisions reversed" section as not useful to a reader; the case
   study carries the engineering judgement now.
3. **Claim nothing that is not recorded.** Where the rationale was never
   written down, name the gap instead of inventing one.
4. **The words must exist without JavaScript.** Every page is server-rendered
   and every disclosure is native.
5. **Nothing may cost the reader the CV.** It is the ink block on the first
   screen, in the floating nav on every page, and in the close.

## Accessibility & Inclusion

**WCAG 2.1 AA is a hard floor**, not a best effort. Contrast, visible focus,
keyboard reachability and `prefers-reduced-motion` support are non-negotiable
in every future change.

- Every text pairing passes 4.5:1 in both modes; the dark tokens are derived,
  not inverted, and were checked numerically.
- Focus rings appear instantly: ultramarine on paper, field-ink on the
  ultramarine, ink on the red.
- The hero's figure is drawn for the eye; each employer's link carries its
  role and dates in its accessible name.
- Disclosures are native and open with the keyboard; printing opens them all.
- `prefers-reduced-motion` ends every transition at once.
