'use client';

import { Fragment, useMemo, useState } from 'react';
import {
	Bug,
	ChevronDown,
	FileCode2,
	GitBranch,
	Package,
	Search,
	Settings2,
	X,
} from 'lucide-react';
import { sourceFiles, type SourceFile } from '@/data/source-excerpts';

/**
 * A minimal TypeScript highlighter.
 *
 * A full tokeniser (or Shiki) would be several hundred kilobytes to colour
 * five short excerpts. One alternation regex covering comments, strings,
 * keywords and numbers gets the same read at a rounding error of the cost —
 * and because the alternation is ordered, a keyword inside a string or a
 * comment is never mis-coloured.
 */
const TOKEN =
	/(\/\/[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|type|interface|export|import|from|if|else|switch|case|default|new|await|async|for|of|null|true|false|undefined)\b|\b(\d+(?:\.\d+)?)\b/g;

function highlight(line: string) {
	const out: React.ReactNode[] = [];
	let last = 0;
	let m: RegExpExecArray | null;
	TOKEN.lastIndex = 0;

	while ((m = TOKEN.exec(line))) {
		if (m.index > last) out.push(line.slice(last, m.index));
		const [full, comment, string, keyword, num] = m;
		const cls = comment
			? 'tk-comment'
			: string
				? 'tk-string'
				: keyword
					? 'tk-keyword'
					: num
						? 'tk-number'
						: '';
		out.push(
			<span key={`${m.index}-${full}`} className={cls}>
				{full}
			</span>,
		);
		last = m.index + full.length;
	}
	if (last < line.length) out.push(line.slice(last));
	return out;
}

function CodePane({ file }: { file: SourceFile }) {
	const lines = useMemo(() => file.code.split('\n'), [file.code]);
	return (
		<pre className='vs-code' tabIndex={0} aria-label={`${file.path} source`}>
			<code>
				{lines.map((line, i) => (
					<Fragment key={i}>
						<span className='vs-ln' aria-hidden='true'>
							{i + 1}
						</span>
						<span className='vs-line'>{highlight(line)}</span>
					</Fragment>
				))}
			</code>
		</pre>
	);
}

/**
 * An editor window showing this site's own source.
 *
 * The most useful thing a backend engineer's portfolio can put behind a
 * VS Code icon is the code the visitor is currently looking at, so the file
 * tree is real paths from this repository and every excerpt is lifted from
 * the module it names.
 */
export default function EditorApp() {
	const [openPaths, setOpenPaths] = useState<string[]>([sourceFiles[0].path]);
	const [active, setActive] = useState(sourceFiles[0].path);
	const file = sourceFiles.find((f) => f.path === active) ?? sourceFiles[0];

	const open = (path: string) => {
		setOpenPaths((p) => (p.includes(path) ? p : [...p, path]));
		setActive(path);
	};

	/* Both pieces of state move together and neither moves inside an updater —
	   a `setActive` call in there would be a setState during render. Closing
	   the last tab reopens the first file rather than leaving an empty editor,
	   which is what VS Code does with its welcome tab. */
	const close = (path: string) => {
		const next = openPaths.filter((x) => x !== path);
		if (!next.length) {
			setOpenPaths([sourceFiles[0].path]);
			setActive(sourceFiles[0].path);
			return;
		}
		setOpenPaths(next);
		if (active === path) setActive(next[next.length - 1]);
	};

	/* Group the flat path list into a directory tree, one level deep — which
	   is as much structure as five files justify. */
	const tree = useMemo(() => {
		const dirs = new Map<string, SourceFile[]>();
		for (const f of sourceFiles) {
			const dir = f.path.slice(0, f.path.lastIndexOf('/'));
			dirs.set(dir, [...(dirs.get(dir) ?? []), f]);
		}
		return [...dirs.entries()];
	}, []);

	return (
		<div className='vs-shell'>
			<nav className='vs-activity' aria-label='Activity bar'>
				<button type='button' data-active aria-label='Explorer' aria-pressed='true'>
					<FileCode2 size={20} aria-hidden='true' />
				</button>
				<button type='button' aria-label='Search' disabled>
					<Search size={20} aria-hidden='true' />
				</button>
				<button type='button' aria-label='Source control' disabled>
					<GitBranch size={20} aria-hidden='true' />
				</button>
				<button type='button' aria-label='Extensions' disabled>
					<Package size={20} aria-hidden='true' />
				</button>
				<button type='button' className='vs-activity-end' aria-label='Settings' disabled>
					<Settings2 size={20} aria-hidden='true' />
				</button>
			</nav>

			<aside className='vs-side'>
				<p className='vs-side-head'>Explorer</p>
				<p className='vs-side-project'>
					<ChevronDown size={13} aria-hidden='true' />
					PORTFOLIO-DESKTOP
				</p>
				{tree.map(([dir, files]) => (
					<div key={dir} className='vs-folder'>
						<p className='vs-folder-name'>
							<ChevronDown size={12} aria-hidden='true' />
							{dir}
						</p>
						{files.map((f) => (
							<button
								key={f.path}
								type='button'
								className='vs-file'
								data-active={active === f.path || undefined}
								onClick={() => open(f.path)}>
								<FileCode2 size={13} aria-hidden='true' />
								{f.path.slice(f.path.lastIndexOf('/') + 1)}
							</button>
						))}
					</div>
				))}
			</aside>

			<div className='vs-main'>
				<div className='vs-tabs' role='tablist' aria-label='Open editors'>
					{openPaths.map((path) => {
						const name = path.slice(path.lastIndexOf('/') + 1);
						return (
							<span
								key={path}
								className='vs-tab'
								data-active={active === path || undefined}>
								<button
									type='button'
									role='tab'
									aria-selected={active === path}
									onClick={() => setActive(path)}>
									<FileCode2 size={13} aria-hidden='true' />
									{name}
								</button>
								<button
									type='button'
									className='vs-tab-close'
									aria-label={`Close ${name}`}
									onClick={() => close(path)}>
									<X size={11} aria-hidden='true' />
								</button>
							</span>
						);
					})}
				</div>

				<p className='vs-breadcrumb'>{file.path}</p>
				<p className='vs-summary'>{file.summary}</p>

				<CodePane file={file} />

				<footer className='vs-status'>
					<span className='vs-status-left'>
						<GitBranch size={13} aria-hidden='true' /> main
						<Bug size={13} aria-hidden='true' /> 0
					</span>
					<span className='vs-status-right'>
						<span>{file.code.split('\n').length} lines</span>
						<span>UTF-8</span>
						<span>{file.lang}</span>
					</span>
				</footer>
			</div>
		</div>
	);
}
