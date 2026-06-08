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
  | "decision"
  | "crash"
  | "rage"
  | "victory"
  | "panic";

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
    case "crash":
      playTone(80, 0.5, "square", 0.2);
      setTimeout(() => playTone(120, 0.3, "sawtooth", 0.15), 80);
      setTimeout(() => playTone(60, 0.6, "square", 0.12), 200);
      for (let i = 0; i < 6; i++) {
        setTimeout(() => playTone(2000 + Math.random() * 3000, 0.05, "square", 0.06), 300 + i * 40);
      }
      break;
    case "rage":
      playTone(150, 0.15, "square", 0.14);
      setTimeout(() => playTone(100, 0.2, "sawtooth", 0.12), 100);
      setTimeout(() => playTone(180, 0.15, "square", 0.1), 250);
      setTimeout(() => playTone(90, 0.25, "sawtooth", 0.14), 400);
      setTimeout(() => playTone(70, 0.3, "square", 0.1), 600);
      break;
    case "victory":
      playChord([523, 659, 784, 1047], 0.5, 0.18);
      setTimeout(() => playChord([587, 740, 880, 1175], 0.4, 0.16), 200);
      setTimeout(() => playTone(1318, 0.35, "triangle", 0.14), 450);
      break;
    case "panic":
      playTone(300, 0.25, "triangle", 0.1);
      setTimeout(() => playTone(220, 0.3, "sine", 0.08), 150);
      break;
  }
}
