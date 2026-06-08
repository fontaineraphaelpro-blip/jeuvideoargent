import type { DailyObjective } from "@/types/game";

const DAILY_TEMPLATES = [
  { title: "Clics du jour", description: "Effectue {target} clics aujourd'hui", metric: "daily_clicks", baseTarget: 30, reward: 200, rewardType: "cash" as const },
  { title: "Revenus passifs", description: "Gagne {target} € en revenu passif", metric: "daily_passive", baseTarget: 500, reward: 300, rewardType: "cash" as const },
  { title: "Acheteur", description: "Achète {target} business", metric: "daily_buys", baseTarget: 2, reward: 400, rewardType: "xp" as const },
  { title: "Trader actif", description: "Effectue {target} transactions", metric: "daily_trades", baseTarget: 3, reward: 250, rewardType: "cash" as const },
  { title: "Missionnaire", description: "Complète {target} mission(s)", metric: "daily_missions", baseTarget: 1, reward: 500, rewardType: "goldenRush" as const },
  { title: "Investisseur", description: "Investis {target} €", metric: "daily_invest", baseTarget: 1000, reward: 350, rewardType: "cash" as const },
  { title: "Combo du jour", description: "Atteins combo x{target}", metric: "daily_combo", baseTarget: 5, reward: 300, rewardType: "xp" as const },
  { title: "Épargnant", description: "Atteins {target} € de capital", metric: "daily_capital", baseTarget: 5000, reward: 600, rewardType: "goldenRush" as const },
];

function hashSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function getTodaySeed(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function generateDailyObjectives(seed?: string): DailyObjective[] {
  const daySeed = seed ?? getTodaySeed();
  const hash = hashSeed(daySeed);
  const indices: number[] = [];
  let i = 0;
  while (indices.length < 3 && i < 20) {
    const idx = Math.floor(seededRandom(hash, i) * DAILY_TEMPLATES.length);
    if (!indices.includes(idx)) indices.push(idx);
    i++;
  }

  return indices.map((idx, n) => {
    const t = DAILY_TEMPLATES[idx];
    const scale = 0.8 + seededRandom(hash, n + 10) * 0.6;
    const target = Math.round(t.baseTarget * scale);
    return {
      id: `daily_${daySeed}_${n}`,
      title: t.title,
      description: t.description.replace("{target}", String(target)),
      metric: t.metric,
      target,
      progress: 0,
      reward: Math.round(t.reward * scale),
      rewardType: t.rewardType,
      completed: false,
      claimed: false,
    };
  });
}

export function shouldRefreshDailyObjectives(currentSeed: string): boolean {
  return currentSeed !== getTodaySeed();
}
