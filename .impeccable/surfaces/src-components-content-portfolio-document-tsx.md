---
version: 1
slug: "src-components-content-portfolio-document-tsx"
primary_target: "src/components/content/portfolio-document.tsx"
related_targets: ["src/app/globals.css"]
---

Scope: the server-rendered portfolio document — `src/components/content/portfolio-document.tsx`
and the `.mb-*` block in `globals.css`. It is in charge below 900px, with
JavaScript off at any width, and when the page is printed.

Visitor mode: Read.

Audience and job: a technical hiring manager, often on a phone, often
mid-application with a job description already in hand. They are checking a
claim, not browsing. Success is the CV opened or downloaded (PRODUCT.md).

Constraints that outrank any composition choice:
- Server component. No `'use client'`, no client boundary. The words ship in
  the response body.
- Sections stay native `<details>` where collapsing is used at all, so the
  page works with scripting off. `PrintExpander` opens them for print.
- Same design tokens as the shell — the six accents and light/dark switch
  this surface too. It shares one stylesheet with the desktop.
- WCAG 2.1 AA is a hard floor.
- Must not ape the Windows shell. The document does not cosplay the thing it
  replaces (user-pinned anti-goal).

Confirmed in this round: Case study and Decisions reversed come out from
behind their taps. Screen first; print stays correct but does not drive
layout. Length and density are free.

## Direction contract

THESIS: The career read as one continuous spine, where the deepest evidence
sits inside the role that produced it. It refuses the accordion stack of
equal bordered cards that files a case study as a peer of "Skills" and puts
the two strongest sections behind a tap.

OWN-WORLD: The shell's own Fluent tokens, unchanged — `#f3f3f3` ground,
`#ffffff` surface, `#1a1a1a` ink, `--accent` switchable. Card borders and
rounded plates are gone; structure comes from one accent hairline running
down the left with role nodes on it, `--line-subtle` rules between blocks,
and type scale carrying hierarchy. Tabular figures for every date and
number. Recognizable with all content removed by the spine alone.

STORY: The reader understands four years across five roles and one system
built at real depth; believes it because the depth is shown rather than
summarized, including the decisions that were reversed; and opens or
downloads the CV.

FIRST VIEWPORT: Name, role line, location and availability top-left with the
theme toggle right. The one-line claim at reading size, then the proof
sentence. Three actions in a row — Resume (accent), Download, Email. The
spine then begins inside the first viewport on a 390px screen: the Meditap
node visible above the fold, so the reader sees the career start rather than
a wall of section headings.

FORM: The career spine — index 3 of 7 on the ordered list, dealt as the lead
of 3 · 7 · 1. Seed key aa2db8f9. Roll ran degraded (service reachable but
past the script's timeout); at surface scope that costs challengers only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
