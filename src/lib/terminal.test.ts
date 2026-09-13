import assert from 'node:assert/strict';
import { test } from 'node:test';

import { experiences } from '../data/experience.ts';
import { notes, writtenNotes } from '../data/notes.ts';
import { skills } from '../data/skills.ts';
import { completions, run } from './terminal.ts';

const text = (cmd: string) => run(cmd).lines.map((l) => l.text).join('\n');

test('an empty line does nothing at all', () => {
	assert.deepEqual(run('   '), { lines: [] });
});

test('an unknown command says so instead of failing silently', () => {
	const r = run('rm -rf /');
	assert.equal(r.lines[0].tone, 'error');
	assert.match(r.lines[0].text, /command not found/);
});

test('ls roles lists every role on record, not a copy of them', () => {
	const out = text('ls roles');
	for (const e of experiences) {
		assert.ok(out.includes(e.short), `${e.short} missing from ls roles`);
	}
});

test('cat finds a role by short name or by company', () => {
	assert.match(text('cat meditap'), /Backend Engineer/);
	assert.match(text('cat moladin'), /Software Engineer Backend/);
	assert.equal(run('cat nonsense').lines[0].tone, 'error');
});

test('skill reports the roles that actually name the tool', () => {
	/* The evidence is computed from experience.ts, so it cannot drift. */
	const go = skills.find((s) => s.name === 'Go');
	assert.ok(go, 'Go should be in the skills data');
	const used = experiences.filter((e) => e.tech.includes('Go'));
	const out = text('skill Go');
	assert.match(out, new RegExp(`Used in ${used.length} role`));
	for (const e of used) assert.ok(out.includes(e.short));
});

test('skill is case-insensitive and matches a partial name', () => {
	assert.match(text('skill postgres'), /PostgreSQL/);
	assert.match(text('skill GO'), /Used in/);
});

test('open hands a real app id back to the shell', () => {
	assert.equal(run('open skills').open, 'skills');
	assert.equal(run('open bin').open, 'recycle');
	assert.equal(run('open music').open, 'media');
	assert.equal(run('open nothing').open, undefined);
	assert.equal(run('open nothing').lines[0].tone, 'error');
});

test('clear asks for a clear rather than printing one', () => {
	const r = run('clear');
	assert.equal(r.clear, true);
	assert.deepEqual(r.lines, []);
});

test('uptime counts the months rather than stating a number', () => {
	const months = experiences.reduce((n, e) => {
		const [sy, sm] = e.startISO.split('-').map(Number);
		const [ey, em] = e.endISO ? e.endISO.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
		return n + Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
	}, 0);
	assert.match(text('uptime'), new RegExp(`${months} months`));
});

test('help lists every command it will answer to', () => {
	const out = text('help');
	for (const c of ['whoami', 'ls', 'cat', 'skill', 'open', 'uptime', 'clear']) {
		assert.ok(out.includes(c), `help does not mention ${c}`);
	}
});

test('tab completion offers commands, apps, roles and skills', () => {
	const c = completions();
	assert.ok(c.includes('whoami'));
	assert.ok(c.includes('skills'));
	assert.ok(c.some((x) => experiences.some((e) => e.short === x)));
	assert.ok(c.some((x) => skills.some((s) => s.name === x)));
});

test('the bare nouns answer as their ls form', () => {
	/* `skills` used to be "command not found" in a window next to one called
	   Skills. */
	for (const noun of ['roles', 'projects', 'skills']) {
		assert.equal(text(noun), text(`ls ${noun}`));
	}
});

test('cat case prints the figure as the text it is drawn from', () => {
	const out = text('cat case');
	assert.ok(out.includes('scheduler → message queue'), 'the run should print as arrows');
	assert.ok(out.includes('Reads, once each per run'), 'the sets should print');
	assert.ok(out.includes('func decide('), 'the code block should print');
	assert.ok(out.includes('Recovery is logged, not announced'), 'the table should print');
});

test('ls notes lists every note there is, written or not', () => {
	const out = text('ls notes');
	for (const n of notes) {
		assert.ok(out.includes(n.slug), `${n.slug} is missing from ls notes`);
	}
	if (notes.length === 0) {
		/* The state it is in. It should read as a sentence, not as three zeroes. */
		assert.match(out, /no notes yet/);
		assert.ok(!out.includes('0 notes'), 'an empty listing should say so in words');
	} else {
		assert.match(out, new RegExp(`${notes.length} notes`));
	}
});

test('the bare noun answers as its ls form', () => {
	assert.equal(text('notes'), text('ls notes'));
});

test('cat on a planned note says it is not written, and when it is due', () => {
	const planned = notes.filter((n) => n.status !== 'written');
	for (const n of planned.slice(0, 3)) {
		const out = text(`cat ${n.slug}`);
		assert.ok(out.includes(n.title), `${n.slug}: the title is missing`);
		assert.match(out, /not written up yet/);
		assert.ok(out.includes(n.target), `${n.slug}: the due month is missing`);
	}
});

test('cat reads a written note, with its sections', () => {
	for (const n of writtenNotes()) {
		const out = text(`cat ${n.slug}`);
		assert.ok(out.includes(n.title), `${n.slug}: the title is missing`);
		assert.ok(out.includes(n.source.name), `${n.slug}: the attribution is missing`);
		for (const sec of n.sections) {
			assert.ok(out.includes(sec.heading), `${n.slug}: section "${sec.heading}" is missing`);
		}
	}
});

test('a note is reachable by the path Explorer shows it at', (t) => {
	/* Skipped rather than passed while there are none: a vacuous assertion that
	   reports "ok" is how a broken path gets shipped. */
	const n = notes[0];
	if (!n) return t.skip('no notes to address yet');
	assert.equal(text(`cat notes/${n.slug}`), text(`cat ${n.slug}`));
});

test('open notes opens the window, and Tab knows every slug', () => {
	assert.equal(run('open notes').open, 'notes');
	const c = completions();
	for (const n of notes) assert.ok(c.includes(n.slug), `${n.slug} is not completable`);
});
