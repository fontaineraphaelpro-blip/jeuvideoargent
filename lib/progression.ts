import type { GameState, TabId } from "@/types/game";
import { CAMPAIGN_CHAPTERS, getCurrentChapter, isAppUnlocked as campaignUnlock } from "./campaign";

export interface CareerRank {
  id: string;
  title: string;
  minLevel: number;
  description: string;
  incomeBonus: number;
}

export const CAREER_RANKS: CareerRank[] = [
  { id: "intern", title: "Stagiaire", minLevel: 1, description: "Premier deal — ça commence.", incomeBonus: 0 },
  { id: "junior", title: "Junior", minLevel: 3, description: "Le cash coule déjà.", incomeBonus: 0.02 },
  { id: "analyst", title: "Analyste", minLevel: 6, description: "Tu sens le momentum.", incomeBonus: 0.04 },
  { id: "associate", title: "Associate", minLevel: 10, description: "Combo en feu — continue !", incomeBonus: 0.06 },
  { id: "manager", title: "Manager", minLevel: 15, description: "L'empire grossit vite.", incomeBonus: 0.08 },
  { id: "director", title: "Directeur", minLevel: 22, description: "Tu ne peux plus t'arrêter.", incomeBonus: 0.1 },
  { id: "vp", title: "VP Finance", minLevel: 32, description: "Machine à dopamine financière.", incomeBonus: 0.13 },
  { id: "ceo", title: "PDG en devenir", minLevel: 45, description: "Légende du coworking.", incomeBonus: 0.16 },
];

export const APP_LABELS: Record<TabId, string> = {
  dashboard: "CashFlow",
  business: "EmpireBiz",
  market: "TradeX Pro",
  invest: "Invest+",
  missions: "MissionHQ",
  upgrades: "Optimizer",
  managers: "HR Desk",
  achievements: "Trophées",
  stats: "Analytics",
  prestige: "Prestige",
  guide: "Guide",
  settings: "Paramètres",
};

export function getCareerRank(state: GameState): CareerRank {
  let rank = CAREER_RANKS[0];
  for (const r of CAREER_RANKS) {
    if (state.level >= r.minLevel) rank = r;
  }
  return rank;
}

export function getNextCareerRank(state: GameState): CareerRank | null {
  const current = getCareerRank(state);
  const idx = CAREER_RANKS.findIndex((r) => r.id === current.id);
  return CAREER_RANKS[idx + 1] ?? null;
}

/** Bonus permanent lié au niveau / carrière — plus de temps de jeu */
export function getCareerBonus(state: GameState): number {
  return getCareerRank(state).incomeBonus;
}

/** @deprecated alias */
export const getPlaytimeBonus = getCareerBonus;

export function isAppFullyUnlocked(state: GameState, app: TabId): boolean {
  return campaignUnlock(state, app);
}

export interface UnlockInfo {
  unlocked: boolean;
  reason: string;
  progress?: number;
  target?: number;
  progressLabel?: string;
}

export function getAppUnlockInfo(state: GameState, app: TabId): UnlockInfo {
  if (isAppFullyUnlocked(state, app)) {
    return { unlocked: true, reason: "Débloqué" };
  }

  const chapter = getCurrentChapter(state.campaign);
  const unlockChapter = CAMPAIGN_CHAPTERS.find((ch) => ch.unlockApps.includes(app));

  if (unlockChapter) {
    const chIdx = CAMPAIGN_CHAPTERS.indexOf(unlockChapter);
    const currentIdx = CAMPAIGN_CHAPTERS.findIndex((c) => c.id === chapter.id);
    if (currentIdx < chIdx) {
      const required = unlockChapter.objectives.filter((o) => !o.optional);
      const done = required.filter(
        (o) =>
          state.campaign.objectivesDone.includes(o.id) ||
          state.campaign.completedChapters.includes(unlockChapter.id)
      ).length;
      return {
        unlocked: false,
        reason: `Termine le chapitre ${chIdx + 1}`,
        progress: state.campaign.completedChapters.includes(unlockChapter.id) ? required.length : done,
        target: required.length,
        progressLabel: unlockChapter.title.replace(/Chapitre \d+ — /, ""),
      };
    }
  }

  if (app === "prestige") {
    return {
      unlocked: false,
      reason: "Atteins 1 milliard €",
      progress: state.capital,
      target: 1_000_000_000,
      progressLabel: "Capital",
    };
  }

  return { unlocked: false, reason: "Continue — prochain chapitre" };
}

export function checkCareerProgression(state: GameState): GameState {
  const newRank = getCareerRank(state);
  if (newRank.id === state.progression.careerRankId) return state;

  return {
    ...state,
    progression: { ...state.progression, careerRankId: newRank.id },
    notifications: [
      {
        id: `rank_${newRank.id}`,
        title: `🔥 Promotion : ${newRank.title}`,
        message: `${newRank.description} (+${(newRank.incomeBonus * 100).toFixed(0)} % revenus)`,
        type: "levelup" as const,
        timestamp: Date.now(),
      },
      ...state.notifications,
    ].slice(0, 20),
  };
}

/** @deprecated alias */
export const checkPlaytimeUnlocks = checkCareerProgression;

export function getChapterProgress(state: GameState): { current: number; total: number; percent: number } {
  const chapter = getCurrentChapter(state.campaign);
  const required = chapter.objectives.filter((o) => !o.optional);
  const done = required.filter((o) => state.campaign.objectivesDone.includes(o.id)).length;
  return {
    current: done,
    total: required.length,
    percent: required.length > 0 ? (done / required.length) * 100 : 0,
  };
}

export function getLockedAppsSummary(
  state: GameState
): { app: TabId; info: UnlockInfo }[] {
  const apps: TabId[] = [
    "business",
    "market",
    "invest",
    "missions",
    "upgrades",
    "managers",
    "achievements",
    "stats",
    "prestige",
  ];
  return apps
    .filter((a) => !isAppFullyUnlocked(state, a))
    .map((app) => ({ app, info: getAppUnlockInfo(state, app) }));
}
