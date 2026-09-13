import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { caseStudy, caseStudyLength, caseStudyText } from './case-study.ts';
import { projects } from './projects.ts';

/**
 * The record is the Markdown write-up in `public/projects/meditap/`; this file
 * is that document as typed data. The tests below read the Markdown and fail
 * when the two drift, which is the same discipline `source.test.ts` applies to
 * the editor window: a copy that can go stale must be pinned to what it copies.
 */
const md = readFileSync(new URL(`../../public${caseStudy.source}`, import.meta.url), 'utf8').replace(
	/\r\n/g,
	'\n',
);

/** Whitespace-insensitive, so a rewrapped line is not a drift. */
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** The front matter, as the write-up declares it. */
function frontMatter(): Record<string, string> {
	const block = md.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	const out: Record<string, string> = {};
	for (const line of block.split('\n')) {
		const m = line.match(/^(\w+):\s*(.+)$/);
		if (m) out[m[1]] = m[2].trim();
	}
	return out;
}

/** The write-up's `## ` headings, with Markdown stress marks removed. */
const mdHeadings = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1].replace(/\*/g, '').trim());

test('the title, role and year are the write-up\'s front matter', () => {
	const fm = frontMatter();
	assert.equal(caseStudy.title, JSON.parse(fm.title));
	assert.equal(caseStudy.role, JSON.parse(fm.role));
	assert.equal(caseStudy.domain, JSON.parse(fm.domain));
	assert.equal(caseStudy.year, JSON.parse(fm.year));
});

test('the stack is the write-up\'s stack, spelled its way', () => {
	const declared: string[] = JSON.parse(frontMatter().stack);
	assert.deepEqual([...caseStudy.stack].sort(), [...declared].sort());
});

test('the summary is the write-up\'s card blurb', () => {
	const blurb = md.match(/^## Card blurb[^\n]*\n([\s\S]*?)\n\*\*Tags:/m)?.[1] ?? '';
	assert.equal(norm(caseStudy.summary), norm(blurb));
});

test('every section is a heading in the write-up, and every detail heading is a section', () => {
	const ours = caseStudy.sections.map((s) => s.heading);
	for (const h of ours) {
		assert.ok(mdHeadings.includes(h), `"${h}" is not a ## heading in the write-up`);
	}
	/* Everything from "# Case study" down is the detail page; the two headings
	   above and below it are the card blurb and the résumé bullets. */
	const detail = mdHeadings.filter((h) => !/^Card blurb|^Résumé bullets/.test(h));
	assert.deepEqual(ours, detail, 'the sections are not the write-up\'s detail headings, in order');
});

test('every code block and every table row is in the write-up verbatim', () => {
	const flat = norm(md);
	for (const s of caseStudy.sections) {
		for (const b of s.body) {
			if (typeof b === 'string') continue;
			if (b.kind === 'code') {
				assert.ok(flat.includes(norm(b.text)), `${s.heading}: a code block is not in the write-up`);
			}
			if (b.kind === 'table') {
				assert.ok(md.includes(`| ${b.head.join(' | ')} |`), `${s.heading}: the table header is not in the write-up`);
				for (const row of b.rows) {
					assert.ok(md.includes(`| ${row.join(' | ')} |`), `${s.heading}: table row "${row[0]} / ${row[1]}" is not in the write-up`);
				}
			}
		}
	}
});

test('every box and every detail in the figure is a phrase from the write-up', () => {
	/* The Markdown includes the diagram the figure redraws, so its labels are
	   on record even where the transcribed paragraphs do not repeat them. */
	const corpus = [md, ...caseStudyText()].join(' ').replace(/\*/g, '').toLowerCase();
	for (const row of caseStudy.figure.rows) {
		for (const node of row.nodes) {
			assert.ok(corpus.includes(node.label.toLowerCase()), `${row.name}: "${node.label}" is not a phrase in the write-up`);
			for (const piece of (node.detail ?? '').split(' · ').filter(Boolean)) {
				assert.ok(corpus.includes(piece.toLowerCase()), `${row.name} › ${node.label}: detail "${piece}" is not a phrase in the write-up`);
			}
		}
	}
});

test('the figure is placed once, and every row is a path or a set of at least two', () => {
	const placed = caseStudy.sections.flatMap((s) => s.body).filter((b) => typeof b !== 'string' && b.kind === 'figure');
	assert.equal(placed.length, 1, 'the figure should appear exactly once in the write-up');
	for (const row of caseStudy.figure.rows) {
		assert.ok(row.nodes.length >= 2, `${row.name} has fewer than two boxes`);
		const labels = row.nodes.map((n) => n.label);
		assert.equal(new Set(labels).size, labels.length, `${row.name} repeats a box`);
	}
});

test('the case study names a project card that exists', () => {
	assert.ok(
		projects.some((p) => p.id === caseStudy.project),
		`caseStudy.project is "${caseStudy.project}", which is no id in projects.ts`,
	);
});

test('the reading length is computed from the text, and is the size of a real write-up', () => {
	const { sections, words, minutes } = caseStudyLength();
	assert.equal(sections, caseStudy.sections.length);
	assert.ok(words > 400 && words < 4000, `${words} words is not the size of this write-up`);
	assert.equal(minutes, Math.max(1, Math.round(words / 200)));
});

test('section headings make distinct, anchor-safe ids', () => {
	const ids = caseStudy.sections.map((s) =>
		s.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
	);
	assert.equal(new Set(ids).size, ids.length, 'two headings slug to the same id');
	for (const id of ids) assert.match(id, /^[a-z0-9][a-z0-9-]*$/);
});

test('the flattened text carries every block, so search cannot miss one', () => {
	const text = caseStudyText().join(' ');
	assert.ok(text.includes('func decide('), 'the code block is missing from the text');
	assert.ok(text.includes('Recovery is logged, not announced'), 'the table is missing from the text');
	assert.ok(text.includes('The real number only exists once all three are joined'), 'a paragraph is missing');
	assert.ok(!text.includes('**'), 'emphasis marks should be stripped from prose');
});
