# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: technical hiring managers** — engineers, tech leads and engineering
managers evaluating whether Ferri Yusra can build what their team needs. They
arrive from an application, a referral or a link, usually on a desktop-class
screen with a pointer, and they read rather than skim: the case study, the
reversed decisions, the source excerpts and the code itself are all aimed at
this reader. When a design decision has to favour one audience, it favours
them.

Other readers exist and are not designed around: recruiters and HR screeners
(fast, often mobile — served by the server-rendered document), prospective
freelance clients, and peer engineers who found the shell itself interesting.
None of them may cost the primary reader anything.

## Product Purpose

A personal portfolio for a backend engineer, presented as a **Windows 11
desktop that runs in the browser** rather than as a scrolling page. It exists
to convert an evaluation into a decision to proceed.

**Success is the CV being opened or downloaded.** Everything else in the shell
is evidence pointed at that moment; the visit succeeds when the reader takes
the document into their own hiring process. The CV lives at the two Google
Drive URLs recorded in `src/data/profile.ts` (`cvView`, `cvDownload`) and is
reachable as a desktop shortcut (`ShortcutId: 'resume'`). Future work must not
make that route harder to find, and must not add a competing primary action
that outranks it.

## Positioning

A backend engineer whose portfolio is itself the strongest evidence of
front-of-house engineering judgement. The differentiator is not the Windows
pastiche — it is what the pastiche is built to be honest about:

- one production system written up at real depth (`case-study.ts`, transcribed
  from the author's own Markdown write-up in `public/projects/meditap/`, with a
  test that keeps the two in step), with what the write-up leaves unrecorded
  held in `openQuestions` rather than invented;
- a `discarded.ts` of decisions this repository **reversed**, each with the
  commit that removed it — the failures are shipped, not hidden;
- an editor window whose excerpts are read from the real source files at build
  time, so the code shown cannot drift from the code that runs;
- the whole portfolio also present as plain semantic HTML in the server
  response, so a crawler, an ATS scraper or a scripting-disabled browser sees
  every word.

A neighbouring portfolio can copy the desktop metaphor. It cannot truthfully
copy a repository that publishes its own reversals.

## Operating Context

- Evaluated on a desktop-class screen with a pointer; the windowing metaphor
  needs room to overlap. Below 900px, or with JavaScript off, the shell is
  replaced by a stacked reading view built from the same data.
- Read alongside a CV, a GitHub profile and a LinkedIn profile — those three
  are the neighbours this site is compared against, and all three are linked
  from it.
- Often reached mid-application, with a job description already in hand: the
  reader is checking a claim, not browsing.
- Time zone GMT+7 (Jakarta), which overlaps most of the EU morning and all of
  APAC.

## Capabilities and Constraints

**What it does.** A single route `/` renders a desktop shell: draggable,
resizable, snappable windows; taskbar; Start with search; Quick Settings;
notification centre; File Explorer; a boot → lock → sign-in sequence; a
desktop cat; personalisation (light/dark, six accents, four CSS wallpapers
plus any image in `public/background`, brightness, volume). Twelve apps open in
windows: Tips, About, Explorer, Skills, Experience, Contact (Mail), Media
Player, Settings, VS Code, Recycle Bin, Career.exe, Terminal.

**Content is typed data.** `src/data/` holds `profile`, `experience`,
`projects`, `skills`, `case-study`, `discarded`, `tips`. Every surface derives
from it; none keeps a second copy. Derived figures (years of experience, role
tenure) are computed from ISO dates rather than written down.

**Technical constraints that future work must hold:**

- Next.js 16 App Router, React 19, TypeScript strict. Tailwind v4 is used only
  for the reset and `@theme`; all component styling is hand-written CSS in
  `src/app/globals.css`.
- The portfolio document is a **server component** and must not move behind a
  client boundary — that regression once left the response body empty.
- Every environment variable reads through a default in code (`.env*` is
  gitignored). Nothing is required to run or deploy.
- Tests run on Node's built-in runner with native type stripping; no test
  dependency, no config.
- No image or audio bytes ship for the shell itself: wallpapers are CSS, system
  sounds are Web Audio.

**Terminology.** "The shell" is the desktop enhancement; "the document" is the
server-rendered semantic HTML at the same route. "Apps" are windowed content
components registered in `APPS`; "shortcuts" leave the page.

## Brand Commitments

- **Name:** Ferri Yusra. Role as stated: Backend Engineer (Go, Node.js &
  PostgreSQL). Site: ferriyusra.com.
- **The Windows 11 desktop metaphor is binding.** It is not decoration to be
  toned down; it is the product. Fidelity to Windows behaviour is the standard
  the shell is judged against, and departures from it are deliberate and
  documented (the activation watermark can be cleared; the toast is lifted off
  it; `Ctrl`+`F6` replaces Alt+Tab).
- **Voice: specific, plain, unembellished, and willing to name its own
  mistakes.** Concrete proof over adjectives — the existing copy's own rule.
  The `discarded.ts` and `openQuestions` entries set the register: state what
  failed and why, without softening.
- **Availability, confirmed current:** Available for freelance and full-time
  backend work, hybrid Jakarta or remote.
- Two icon families, deliberately split — LineIcons for app icons, Lucide for
  the ~60 glyphs LineIcons lacks. A tight group of controls uses one family.

## Evidence on Hand

Real, checkable, and already in the repository:

- **Five roles**, 2021-10 to present, all Jakarta: Meditap (current), INA
  Digital / Peruri Digital Security, the Health Technology Transformation &
  Digitalization Team (SATUSEHAT), Moladin, Jojonomic.
- **One deep case study** — Meditap's deposit-threshold alerting for
  self-funded health plans: a Go service joining a PostgreSQL ERP, a legacy SQL
  Server claim system and its own portal database, a state machine deciding
  when to alert, typed Pub/Sub messages to a separate notification service,
  and a configuration module with a field-level audit trail. The record is the
  author's Markdown write-up in `public/projects/meditap/`; what it leaves
  unrecorded is held in `openQuestions` and rendered.
- **Nine projects** in `projects.ts`, joined by name to `skills.ts` — a join
  pinned by `data.test.ts` because it fails silently.
- **28 skills** across Backend, Frontend, Database, DevOps, Cloud, AI Tools;
  nine are named by no role, and `skill-evidence.ts` says so rather than
  padding them.
- **Reversed decisions** in `discarded.ts`, each with the removing commit. The
  one entry without a hash was reverted before it was ever committed and says
  so.
- **CV** at the Google Drive links in `profile.ts`. **GitHub:**
  github.com/ferriyusra. **LinkedIn:** linkedin.com/in/ferriyusra.

**Absences future work must not fabricate:** there are no testimonials, no
named clients beyond the employers listed, no benchmarks, no user counts, no
pricing, no awards, and no portrait image (`profile.portrait` is `null`). Do
not add an entry to `discarded.ts` that did not happen. Do not fill
`openQuestions` with plausible invention.

## Product Principles

1. **Every surface derives from one typed source.** A second copy of a fact is
   a bug; the editor window reads real files at build time for exactly this
   reason.
2. **Publish the reversals.** Decisions this repository undid are content, not
   embarrassment — they are the clearest evidence of judgement on the site.
3. **Claim nothing that is not recorded.** Where the rationale was never
   written down, name the gap instead of inventing one.
4. **The words must exist without JavaScript.** The document is the floor; the
   desktop shell is the enhancement on top of it.
5. **The shell must not cost the reader the CV.** Delight is welcome until it
   competes with the one action a successful visit ends in.

## Accessibility & Inclusion

**WCAG 2.1 AA is a hard floor**, not a best effort. Contrast, visible focus,
keyboard reachability and `prefers-reduced-motion` support are non-negotiable
in every future change.

Concretely, the following are commitments and not byproducts:

- Full keyboard operation of the shell, including `Ctrl`+`F6` window cycling,
  because Alt+Tab is never handed to a browser.
- `prefers-reduced-motion` respected throughout — the boot sequence collapses
  to a short fade, and Career.exe's Summary mode is the default rather than a
  fallback.
- The no-JavaScript document, which is also the sub-900px experience.
- Flyouts take focus and give it back; they are not focus traps and
  `aria-modal` stays off, matching the non-modal behaviour of the real thing.
