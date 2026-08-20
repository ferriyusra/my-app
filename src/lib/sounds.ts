/**
 * Windows-style UI chimes, synthesised with the Web Audio API.
 *
 * Sampled .wav files would be a licensing problem and three network requests;
 * these are two-oscillator blips shaped by a short exponential decay, which is
 * what the real system sounds are once you strip the reverb. Nothing is
 * created until the first play, so a muted visitor never builds a context.
 */

export type SoundName = 'open' | 'close' | 'notify' | 'error';

type Voice = { freq: number; at: number; dur: number; gain: number };

/* Each cue is a short arpeggio. Windows 11's own cues are all major intervals
   with the exception of the error tone, which drops a tritone. */
const CUES: Record<SoundName, Voice[]> = {
	open: [
		{ freq: 587.33, at: 0, dur: 0.16, gain: 0.14 },
		{ freq: 880.0, at: 0.05, dur: 0.22, gain: 0.1 },
	],
	close: [
		{ freq: 880.0, at: 0, dur: 0.14, gain: 0.11 },
		{ freq: 587.33, at: 0.05, dur: 0.2, gain: 0.09 },
	],
	notify: [
		{ freq: 987.77, at: 0, dur: 0.18, gain: 0.12 },
		{ freq: 1318.51, at: 0.09, dur: 0.26, gain: 0.09 },
	],
	error: [
		{ freq: 415.3, at: 0, dur: 0.2, gain: 0.13 },
		{ freq: 293.66, at: 0.1, dur: 0.3, gain: 0.11 },
	],
};

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!ctx) {
		const Ctor =
			window.AudioContext ??
			(window as unknown as { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	/* Browsers suspend the context until a gesture; every call site here is
	   downstream of a click, so resuming is safe and usually a no-op. */
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

/**
 * Play one cue at `volume` (0–1). Silently does nothing where Web Audio is
 * unavailable, so callers never have to feature-detect.
 */
export function playSound(name: SoundName, volume = 1) {
	const ac = audio();
	if (!ac) return;
	const vol = Math.max(0, Math.min(1, volume));
	if (vol === 0) return;
	const now = ac.currentTime;
	for (const v of CUES[name]) {
		const osc = ac.createOscillator();
		const amp = ac.createGain();
		osc.type = 'sine';
		osc.frequency.value = v.freq;
		/* Attack fast, decay exponentially — a bell, not a beep. */
		amp.gain.setValueAtTime(0.0001, now + v.at);
		amp.gain.exponentialRampToValueAtTime(v.gain * vol, now + v.at + 0.012);
		amp.gain.exponentialRampToValueAtTime(0.0001, now + v.at + v.dur);
		osc.connect(amp).connect(ac.destination);
		osc.start(now + v.at);
		osc.stop(now + v.at + v.dur + 0.02);
	}
}
