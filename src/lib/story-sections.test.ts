import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP_SECTION, STORY_SECTIONS, section, sectionForApp } from './story-sections.ts';

/**
 * The AppId union, read as text — the same way search.test.ts reads it.
 *
 * `Record<AppId, …>` already makes the compiler insist on every id, but the
 * test runner strips types without checking them, so the guarantee is only
 * as good as the last `tsc`. This makes it hold under `npm test` too.
 */
function appIds(): string[] {
	const src = readFileSync(join(process.cwd(), 'src/types/windows.ts'), 'utf8');
	const union = src.slice(src.indexOf('export type AppId ='), src.indexOf(';', src.indexOf('export type AppId =')));
	return [...union.matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
}

test('every app has a decided place on the story, even if that place is none', () => {
	const ids = appIds();
	assert.ok(ids.length >= 13, 'the AppId union should parse');
	assert.deepEqual(Object.keys(APP_SECTION).sort(), [...ids].sort());
});

test('every mapped section exists', () => {
	const known = new Set(STORY_SECTIONS.map((s) => s.id));
	for (const [app, id] of Object.entries(APP_SECTION)) {
		if (id !== null) assert.ok(known.has(id), `${app} maps to missing section ${id}`);
	}
});

test('section ids are unique and safe to put after a #', () => {
	const ids = STORY_SECTIONS.map((s) => s.id);
	assert.equal(new Set(ids).size, ids.length);
	for (const id of ids) assert.match(id, /^[a-z][a-z-]*$/);
});

/** Prefixes the story generates ids under: one per role, skill, project, and the write-up's headings. */
const GENERATED = ['role', 'skill', 'project', 'write-up'];

test('section ids stay clear of the namespaces the story builds ids in', () => {
	for (const { id } of STORY_SECTIONS) {
		assert.doesNotMatch(id, new RegExp(`^(${GENERATED.join('|')})-`), `${id} could collide with a generated id`);
	}
});

test('indices run 01, 02, … in order, and only the hero has none', () => {
	const indexed = STORY_SECTIONS.filter((s) => s.index !== null);
	assert.equal(STORY_SECTIONS.length - indexed.length, 1);
	indexed.forEach((s, i) => assert.equal(s.index, String(i + 1).padStart(2, '0')));
});

test('sectionForApp takes what a URL hands it', () => {
	assert.equal(sectionForApp('experience'), 'career');
	assert.equal(sectionForApp('recycle'), 'decisions');
	assert.equal(sectionForApp('media'), null);
	assert.equal(sectionForApp('nonsense'), null);
	assert.equal(sectionForApp('__proto__'), null);
	assert.equal(sectionForApp(null), null);
});

test('section() refuses a name that is not there', () => {
	assert.equal(section('career').index, '01');
	assert.throws(() => section('careers' as never));
});
