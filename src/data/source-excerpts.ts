/**
 * Real excerpts from this repository, shown by the editor window.
 *
 * They are copied rather than imported because the point is to read the
 * source, not to run it — and a build that inlined whole modules as strings
 * would ship them twice.
 */

export type SourceFile = {
	path: string;
	lang: string;
	summary: string;
	code: string;
};

export const sourceFiles: SourceFile[] = [
	{
		path: 'src/context/window-context.tsx',
		lang: 'TypeScript',
		summary: 'Snap Layouts geometry, derived from the desktop area.',
		code: `/** Geometry for each Snap Layouts zone, derived from the desktop area. */
export function zoneRect(zone: SnapZone, b: Bounds): Rect {
  const halfW = Math.round(b.w / 2);
  const halfH = Math.round(b.h / 2);
  const third = Math.round(b.w / 3);
  const twoThirds = Math.round((b.w * 2) / 3);
  switch (zone) {
    case 'left':     return { x: 0, y: 0, w: halfW, h: b.h };
    case 'right':    return { x: halfW, y: 0, w: b.w - halfW, h: b.h };
    case 'third-l':  return { x: 0, y: 0, w: third, h: b.h };
    case 'wide-l':   return { x: 0, y: 0, w: twoThirds, h: b.h };
    case 'stack-tr': return { x: twoThirds, y: 0, w: b.w - twoThirds, h: halfH };
    case 'max':      return { x: 0, y: 0, w: b.w, h: b.h };
  }
}`,
	},
	{
		path: 'src/components/windows/window.tsx',
		lang: 'TypeScript',
		summary: 'Which snap a drag near an edge would land on.',
		code: `/** Distance from a screen edge that arms a snap while dragging. */
const EDGE = 10;

function edgeZone(cx: number, cy: number, b: Bounds): SnapZone | null {
  const nearTop = cy <= EDGE;
  const nearLeft = cx <= EDGE;
  const nearRight = cx >= b.w - EDGE;
  if (nearTop && nearLeft) return 'tl';
  if (nearTop && nearRight) return 'tr';
  if (nearTop) return 'max';
  if (nearLeft) return cy >= b.h - b.h / 4 ? 'bl' : 'left';
  if (nearRight) return cy >= b.h - b.h / 4 ? 'br' : 'right';
  return null;
}`,
	},
	{
		path: 'src/lib/sounds.ts',
		lang: 'TypeScript',
		summary: 'System chimes, synthesised rather than downloaded.',
		code: `// Each cue is a short arpeggio, shaped by an exponential decay —
// a bell, not a beep. No .wav files ship with this site.
const CUES: Record<SoundName, Voice[]> = {
  open:  [{ freq: 587.33, at: 0, dur: 0.16, gain: 0.14 },
          { freq: 880.00, at: 0.05, dur: 0.22, gain: 0.10 }],
  close: [{ freq: 880.00, at: 0, dur: 0.14, gain: 0.11 },
          { freq: 587.33, at: 0.05, dur: 0.20, gain: 0.09 }],
};

export function playSound(name: SoundName, volume = 1) {
  const ac = audio();
  if (!ac) return;
  for (const v of CUES[name]) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.frequency.value = v.freq;
    amp.gain.exponentialRampToValueAtTime(v.gain * volume, ac.currentTime + 0.012);
    osc.connect(amp).connect(ac.destination);
  }
}`,
	},
	{
		path: 'src/hooks/use-window-manager.ts',
		lang: 'TypeScript',
		summary: 'Taskbar click behaviour: launch, minimise, or raise.',
		code: `/** Taskbar click: launch, minimise if it is already on top, else raise. */
const toggleFromTaskbar = useCallback(
  (id: AppId) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return launch(id);
    if (!win.minimised && win.z === ctx.topZ) return minimise(id);
    focus(id);
  },
  [windows, ctx.topZ, launch, minimise, focus],
);`,
	},
	{
		path: 'src/app/api/contact/route.ts',
		lang: 'TypeScript',
		summary: 'The endpoint behind the Mail window.',
		code: `// Without a mail key the route reports delivered: false rather than
// claiming success — the Mail window then falls back to a mailto: draft.
const key = process.env.RESEND_API_KEY;
if (!key) return NextResponse.json({ ok: true, delivered: false });

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${key}\`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: FROM, to: [TO], reply_to: email,
    subject: \`\${subject} — \${name}\`,
    text: \`From: \${name} <\${email}>\\n\\n\${message}\`,
  }),
});
return NextResponse.json({ ok: res.ok, delivered: res.ok });`,
	},
];
