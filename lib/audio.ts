type SoundType =
  | "click"
  | "purchase"
  | "mission"
  | "levelup"
  | "milestone"
  | "golden"
  | "error"
  | "achievement"
  | "event"
  | "decision";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  attack = 0.01,
  decay = 0.1
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playChord(freqs: number[], duration: number, volume = 0.1) {
  freqs.forEach((f, i) => {
    setTimeout(() => playTone(f, duration, "sine", volume * 0.6), i * 30);
  });
}

export function playSound(type: SoundType, enabled = true) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  switch (type) {
    case "click":
      playTone(600 + Math.random() * 200, 0.08, "sine", 0.12);
      break;
    case "purchase":
      playChord([523, 659, 784], 0.25, 0.14);
      break;
    case "mission":
      playChord([440, 554, 659, 880], 0.4, 0.15);
      break;
    case "levelup":
      playChord([392, 494, 587, 784, 988], 0.5, 0.16);
      break;
    case "milestone":
      playChord([523, 659, 784, 1047], 0.6, 0.18);
      setTimeout(() => playTone(1318, 0.3, "triangle", 0.1), 200);
      break;
    case "golden":
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playTone(800 + i * 100, 0.15, "triangle", 0.12), i * 80);
      }
      break;
    case "error":
      playTone(200, 0.2, "square", 0.08);
      break;
    case "achievement":
      playChord([587, 740, 880], 0.35, 0.14);
      break;
    case "event":
      playTone(440, 0.2, "triangle", 0.1);
      setTimeout(() => playTone(550, 0.15, "triangle", 0.08), 100);
      break;
    case "decision":
      playChord([330, 415, 523], 0.3, 0.12);
      break;
  }
}
