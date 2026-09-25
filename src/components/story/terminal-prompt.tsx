'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import type { Line } from '@/lib/terminal';
import { sectionForApp } from '@/lib/story-sections';
import { DESKTOP_MIN_WIDTH } from '@/lib/shell-defaults';

type Entry = { cmd: string; lines: Line[] };
type TerminalModule = typeof import('@/lib/terminal');

/**
 * The prompt under the hero terminal's opening output: type, and the same
 * `run()` that drives the desktop's Terminal answers.
 *
 * `terminal.ts` reaches into every data file, so it is imported on first focus
 * rather than with the page — a visitor who never types never downloads it.
 * The opening output above is server-rendered and costs nothing either way.
 *
 * `open <app>` is read for the page it is typed on: an app whose content is a
 * section here scrolls to it; one that only exists on the desktop goes there,
 * where the screen is wide enough for one.
 *
 * Keyboard: Enter runs, ↑/↓ walk the history, Tab completes a partial word and
 * otherwise moves focus on as it always would — a prompt on a page must not
 * trap the key a keyboard user leaves by. Esc lets go of the prompt.
 */
export default function TerminalPrompt({ hint }: { hint: string }) {
	const [log, setLog] = useState<Entry[]>([]);
	const input = useRef<HTMLInputElement>(null);
	const box = useRef<HTMLDivElement>(null);
	const history = useRef<string[]>([]);
	const cursor = useRef(-1);
	const loading = useRef<Promise<TerminalModule> | null>(null);
	const loaded = useRef<TerminalModule | null>(null);

	const load = () => {
		loading.current ??= import('@/lib/terminal').then((m) => (loaded.current = m));
		return loading.current;
	};

	/** The card's scrolling body, which holds the opening output and this log. */
	const scroller = () => box.current?.closest<HTMLElement>('.sy-term-scroll') ?? null;

	const settle = () =>
		requestAnimationFrame(() => {
			const s = scroller();
			if (s) s.scrollTop = s.scrollHeight;
		});

	async function exec(raw: string) {
		const cmd = raw.trim();
		if (!cmd) return;
		history.current = [cmd, ...history.current.filter((h) => h !== cmd)].slice(0, 30);
		cursor.current = -1;

		const { run } = await load();
		const res = run(cmd);
		if (res.clear) {
			setLog([]);
			box.current?.closest('.sy-term')?.setAttribute('data-cleared', 'true');
			return;
		}

		const extra: Line[] = [];
		if (res.open) {
			const section = sectionForApp(res.open);
			if (section) {
				const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				document.getElementById(section)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
				extra.push({ text: `→ #${section}, on this page`, tone: 'dim' });
			} else if (window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches) {
				window.location.assign(`/desktop?app=${encodeURIComponent(res.open)}`);
			} else {
				extra.push({
					text: `${res.open} lives on the desktop, which needs a screen at least ${DESKTOP_MIN_WIDTH}px wide.`,
					tone: 'dim',
				});
			}
		}
		setLog((l) => [...l, { cmd, lines: [...res.lines, ...extra] }]);
		settle();
	}

	function complete(e: KeyboardEvent<HTMLInputElement>) {
		const el = e.currentTarget;
		const words = loaded.current?.completions();
		const value = el.value;
		const start = value.lastIndexOf(' ') + 1;
		const part = value.slice(start).toLowerCase();
		if (!words || !part) return;
		const hits = [...new Set(words)].filter((w) => w.toLowerCase().startsWith(part));
		if (!hits.length) return;
		/* Only now is Tab ours: there was a word to finish. */
		e.preventDefault();
		let common = hits[0];
		for (const h of hits) {
			while (!h.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1);
		}
		const done = hits.length === 1 ? `${hits[0]} ` : common.length > part.length ? common : value.slice(start);
		el.value = value.slice(0, start) + done;
	}

	function onKey(e: KeyboardEvent<HTMLInputElement>) {
		const el = e.currentTarget;
		if (e.key === 'Tab' && !e.shiftKey) return complete(e);
		if (e.key === 'Escape') return el.blur();
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			const h = history.current;
			if (!h.length) return;
			e.preventDefault();
			cursor.current =
				e.key === 'ArrowUp' ? Math.min(cursor.current + 1, h.length - 1) : Math.max(cursor.current - 1, -1);
			el.value = cursor.current < 0 ? '' : h[cursor.current];
		}
	}

	return (
		<div className='sy-term-live sy-js' ref={box}>
			<div className='sy-term-log' role='log' aria-live='polite' aria-label='Terminal output'>
				{log.map((entry, i) => (
					<div key={i} className='sy-term-entry'>
						<p className='sy-term-line'>
							<span className='sy-term-ps' aria-hidden='true'>
								${' '}
							</span>
							{entry.cmd}
						</p>
						{entry.lines.map((l, j) => (
							<p key={j} className='sy-term-line' data-tone={l.tone}>
								{l.text || ' '}
							</p>
						))}
					</div>
				))}
			</div>
			<form
				className='sy-term-prompt'
				onSubmit={(e) => {
					e.preventDefault();
					const el = input.current;
					if (!el) return;
					const value = el.value;
					el.value = '';
					void exec(value);
				}}>
				<label className='sy-term-ps' htmlFor='sy-term-input'>
					$
				</label>
				<input
					id='sy-term-input'
					ref={input}
					className='sy-term-input'
					type='text'
					autoComplete='off'
					autoCapitalize='off'
					autoCorrect='off'
					spellCheck={false}
					enterKeyHint='go'
					aria-label='Terminal command'
					aria-describedby='sy-term-hint'
					onFocus={() => void load()}
					onKeyDown={onKey}
				/>
			</form>
			<p id='sy-term-hint' className='sy-term-hint'>
				{hint}
			</p>
		</div>
	);
}
