'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowManager } from '@/hooks/use-window-manager';
import { completions, run, type Line } from '@/lib/terminal';
import { profile } from '@/data/profile';

/**
 * A terminal, because a backend engineer's desktop without one is a strange
 * desktop.
 *
 * It is a second way into the same content the windows hold — and the way the
 * people most likely to be assessing him would reach for first. `open <app>`
 * hands off to the real window manager, so the two halves of the shell are not
 * separate exhibits.
 *
 * The command set lives in `src/lib/terminal.ts` as a pure function, which is
 * why it can be tested without a DOM. This file is only the screen: history,
 * the caret, Tab completion and scroll.
 */

type Block = { id: number; input: string; lines: Line[] };

const BANNER: Line[] = [
	{ text: `${profile.name} — ${profile.role}`, tone: 'accent' },
	{ text: 'Type `help` for the command list.', tone: 'dim' },
	{ text: '' },
];

export default function TerminalApp() {
	const { launch } = useWindowManager();
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [value, setValue] = useState('');
	const seq = useRef(0);
	const scroller = useRef<HTMLDivElement>(null);
	const input = useRef<HTMLInputElement>(null);

	/* Shell history: `past` is oldest-first, `cursor` walks back through it. */
	const past = useRef<string[]>([]);
	const cursor = useRef(-1);

	/* Put the caret in the prompt as soon as the window opens.
	 *
	 * Two things fight for focus here. The window frame moves focus to itself
	 * when it is raised (window.tsx), and it only stands down if focus is
	 * already inside — which it is by the time that effect runs, because a
	 * child's effects run before its parent's. And on a click, the browser's
	 * own focus-follows-mousedown lands on whatever was pressed, overriding a
	 * `focus()` call made during the same event; `preventDefault` on mousedown
	 * is what stops that, which is why the handler below is not a click.
	 *
	 * A terminal is the one window where taking the caret on open is right:
	 * there is nothing else in it to interact with. */
	useEffect(() => {
		input.current?.focus();

		/* And take it back whenever the window is raised again. Focus lands on
		   the frame itself — by the taskbar, by a click on the title bar — and
		   the frame is not something you can type into, so the caret has to be
		   handed on. Only when the frame itself received it: a click on a
		   control inside the terminal keeps its own focus. */
		const frame = input.current?.closest<HTMLElement>('.win');
		if (!frame) return;
		const onFocusIn = (e: FocusEvent) => {
			if (e.target === frame) input.current?.focus();
		};
		frame.addEventListener('focusin', onFocusIn);
		return () => frame.removeEventListener('focusin', onFocusIn);
	}, []);

	/* Follow the output down, but only when new output arrives. */
	useEffect(() => {
		const el = scroller.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [blocks]);

	const submit = useCallback(() => {
		const line = value;
		setValue('');
		if (line.trim()) {
			past.current = [...past.current, line];
			cursor.current = -1;
		}
		const result = run(line);
		if (result.clear) {
			setBlocks([]);
			return;
		}
		seq.current += 1;
		setBlocks((b) => [...b, { id: seq.current, input: line, lines: result.lines }]);
		/* The window manager is the shell's, not the terminal's — `open` asks
		   for a real window rather than drawing a fake one. */
		if (result.open) launch(result.open);
	}, [launch, value]);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				submit();
				return;
			}
			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
				e.preventDefault();
				const h = past.current;
				if (!h.length) return;
				if (cursor.current === -1) cursor.current = h.length;
				cursor.current += e.key === 'ArrowUp' ? -1 : 1;
				cursor.current = Math.max(0, Math.min(cursor.current, h.length));
				setValue(cursor.current === h.length ? '' : h[cursor.current]);
				return;
			}
			if (e.key === 'Tab') {
				e.preventDefault();
				const parts = value.split(/\s+/);
				const last = parts[parts.length - 1].toLowerCase();
				if (!last) return;
				const hit = completions().find((c) => c.toLowerCase().startsWith(last));
				if (hit) {
					parts[parts.length - 1] = hit;
					setValue(parts.join(' '));
				}
			}
		},
		[submit, value],
	);

	return (
		/* Clicking anywhere in the screen focuses the prompt, the way a real
		   terminal behaves — the caret is the only thing you can type into. */
		<div
			className='tm'
			onMouseDown={(e) => {
				/* Keep the browser from moving focus to the pressed element,
				   which is never the input, then put it where it belongs. */
				if (e.target !== input.current) {
					e.preventDefault();
					input.current?.focus();
				}
			}}>
			<div className='tm-screen' ref={scroller}>
				{BANNER.map((l, i) => (
					<p key={`b${i}`} className='tm-line' data-tone={l.tone}>
						{l.text || ' '}
					</p>
				))}

				{blocks.map((b) => (
					<div key={b.id}>
						<p className='tm-line tm-echo'>
							<span className='tm-prompt'>$</span> {b.input}
						</p>
						{b.lines.map((l, i) => (
							<p key={i} className='tm-line' data-tone={l.tone}>
								{l.text || ' '}
							</p>
						))}
					</div>
				))}

				<label className='tm-line tm-input'>
					<span className='tm-prompt'>$</span>
					<input
						ref={input}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={onKeyDown}
						spellCheck={false}
						autoComplete='off'
						autoCapitalize='off'
						aria-label='Terminal input'
					/>
				</label>
			</div>
		</div>
	);
}
