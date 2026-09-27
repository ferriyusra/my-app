/**
 * The run, kept.
 *
 * It lived in React state inside the window, so closing Career.exe threw away
 * everything collected. It is saved to `localStorage` now, under one versioned
 * key, and read back through `sanitizeRun` — the same rule `readPins()` keeps
 * for the taskbar: stored data is untrusted, and an id the world no longer
 * has (a skill renamed in `experience.ts`, a stop moved) is dropped rather
 * than counted.
 *
 * Pure apart from `loadRun`/`saveRun`, which touch storage only inside a
 * try/catch, so `node --test` can load the rest.
 */

export const RUN_KEY = 'career:run';

export type Run = {
	v: 1;
	/** Token ids collected. */
	tokens: string[];
	/** Objective stops done. */
	stops: string[];
	/** decide() rows answered the way the table does. */
	solved: string[];
	/** decide() rows answered right the first time — the score. */
	firstTry: string[];
	/** decide() rows already attempted once, so a retry is not a first try. */
	tried: string[];
	/** Bugs landed on. */
	fixed: string[];
	/** Seconds of play: moving, not paused, not yet won. */
	played: number;
	/** The finishing time of this run, once it is won. */
	time: number | null;
	/** The best finishing time across runs. Survives Play again. */
	best: number | null;
};

/** What the loop mutates between publishes. Sets, so a frame can ask cheaply. */
export type Live = {
	tokens: Set<string>;
	stops: Set<string>;
	solved: Set<string>;
	firstTry: Set<string>;
	tried: Set<string>;
	fixed: Set<string>;
	played: number;
	time: number | null;
	best: number | null;
};

/** Every id the world knows, to filter a stored run through. */
export type Known = {
	tokens: ReadonlySet<string>;
	stops: ReadonlySet<string>;
	rows: ReadonlySet<string>;
	bugs: ReadonlySet<string>;
};

export function emptyRun(): Run {
	return { v: 1, tokens: [], stops: [], solved: [], firstTry: [], tried: [], fixed: [], played: 0, time: null, best: null };
}

const ids = (value: unknown, known: ReadonlySet<string>): string[] =>
	Array.isArray(value)
		? [...new Set(value.filter((x): x is string => typeof x === 'string' && known.has(x)))]
		: [];

const seconds = (value: unknown): number | null =>
	typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;

/** Anything read from storage, made safe: unknown ids gone, numbers sane. */
export function sanitizeRun(raw: unknown, known: Known): Run {
	if (!raw || typeof raw !== 'object' || (raw as { v?: unknown }).v !== 1) return emptyRun();
	const r = raw as Record<string, unknown>;
	return {
		v: 1,
		tokens: ids(r.tokens, known.tokens),
		stops: ids(r.stops, known.stops),
		solved: ids(r.solved, known.rows),
		firstTry: ids(r.firstTry, known.rows),
		tried: ids(r.tried, known.rows),
		fixed: ids(r.fixed, known.bugs),
		played: seconds(r.played) ?? 0,
		time: seconds(r.time),
		best: seconds(r.best),
	};
}

export function toLive(run: Run): Live {
	return {
		tokens: new Set(run.tokens),
		stops: new Set(run.stops),
		solved: new Set(run.solved),
		firstTry: new Set(run.firstTry),
		tried: new Set(run.tried),
		fixed: new Set(run.fixed),
		played: run.played,
		time: run.time,
		best: run.best,
	};
}

export function toRun(live: Live): Run {
	return {
		v: 1,
		tokens: [...live.tokens],
		stops: [...live.stops],
		solved: [...live.solved],
		firstTry: [...live.firstTry],
		tried: [...live.tried],
		fixed: [...live.fixed],
		played: Math.round(live.played * 10) / 10,
		time: live.time,
		best: live.best,
	};
}

/**
 * Whether a run is won: every skill and every stop of every objective. The
 * bugs are not required — fixing them is for the player's own satisfaction.
 *
 * The old check asked only whether the *last* chapter was cleared while you
 * stood in it, which once chapters stopped being gated meant flying to
 * Meditap, taking its eight tokens, and being told all 28 were collected.
 */
export function complete(live: Pick<Live, 'tokens' | 'stops'>, known: Pick<Known, 'tokens' | 'stops'>): boolean {
	for (const t of known.tokens) if (!live.tokens.has(t)) return false;
	for (const s of known.stops) if (!live.stops.has(s)) return false;
	return true;
}

/** A fresh run that keeps the best time. */
export function resetRun(best: number | null): Run {
	return { ...emptyRun(), best };
}

export function loadRun(known: Known): Run {
	try {
		const raw = localStorage.getItem(RUN_KEY);
		return raw ? sanitizeRun(JSON.parse(raw), known) : emptyRun();
	} catch {
		return emptyRun();
	}
}

export function saveRun(run: Run): void {
	try {
		localStorage.setItem(RUN_KEY, JSON.stringify(run));
	} catch {
		/* Private mode, a full quota: the run still works, it just is not kept. */
	}
}
