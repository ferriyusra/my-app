import assert from 'node:assert/strict';
import { test } from 'node:test';

import { experiences } from '../data/experience.ts';
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
