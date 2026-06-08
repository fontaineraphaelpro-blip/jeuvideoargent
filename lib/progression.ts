import type { GameState, TabId } from "@/types/game";
import { CAMPAIGN_CHAPTERS, getCurrentChapter, isAppUnlocked as campaignUnlock } from "./campaign";

export interface CareerRank {
  id: string;
  title: string;
  minPlayMinutes: number;
  description: string;
  incomeBonus: number;
}

export interface PlaytimeUnlock {
  id: string;
  minPlayMinutes: number;
  title: string;
  description: string;
  unlockApps?: TabId[];
  incomeBonus?: number;
}

export const CAREER_RANKS: CareerRank[] = [
  { id: "intern", title: "Stagiaire", minPlayMinutes: 0, description: "Premier jour au bureau.", incomeBonus: 0 },
  { id: "junior", title: "Junior", minPlayMinutes: 10, description: "Tu commences à comprendre les bases.", incomeBonus: 0.01 },
  { id: "analyst", title: "Analyste", minPlayMinutes: 30, description: "Tu lis les chiffres avant d'agir.", incomeBonus: 0.02 },
  { id: "associate", title: "Associate", minPlayMinutes: 60, description: "Une heure de jeu — tu maîtrises le bureau.", incomeBonus: 0.03 },
  { id: "manager", title: "Manager", minPlayMinutes: 120, description: "Deux heures — tu gères plusieurs flux.", incomeBonus: 0.04 },
  { id: "director", title: "Directeur", minPlayMinutes: 300, description: "Cinq heures — l'empire prend forme.", incomeBonus: 0.06 },
  { id: "vp", title: "VP Finance", minPlayMinutes: 600, description: "Dix heures — tu es un habitué.", incomeBonus: 0.08 },
  { id: "ceo", title: "PDG en devenir", minPlayMinutes: 1200, description: "Vingt heures — légende du coworking.", incomeBonus: 0.1 },
];

export const PLAYTIME_UNLOCKS: PlaytimeUnlock[] = [
  { id: "pu_5m", minPlayMinutes: 5, title: "Premiers repères", description: "Tu connais ton bureau.", incomeBonus: 0.005 },
  { id: "pu_15m", minPlayMinutes: 15, title: "Routine installée", description: "+0,5 % revenus permanents.", incomeBonus: 0.005 },
  { id: "pu_30m", minPlayMinutes: 30, title: "Habitué du clavier", description: "Optimizer accessible plus tôt si besoin.", unlockApps: ["upgrades"], incomeBonus: 0.01 },
  { id: "pu_60m", minPlayMinutes: 60, title: "Une heure de grind", description: "HR Desk débloqué (managers).", unlockApps: ["managers"], incomeBonus: 0.015 },
  { id: "pu_120m", minPlayMinutes: 120, title: "Marathon financier", description: "Trophées & Analytics ouverts.", unlockApps: ["achievements", "stats"], incomeBonus: 0.02 },
  { id: "pu_300m", minPlayMinutes: 300, title: "Vétéran", description: "+5 % revenus passifs permanents.", incomeBonus: 0.05 },
  { id: "pu_600m", minPlayMinutes: 600, title: "Expert du bureau", description: "Accès anticipé Prestige (si 100M €).", unlockApps: ["prestige"], incomeBonus: 0.03 },
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

export function getPlayMinutes(state: GameState): number {
  return state.stats.playTimeSeconds / 60;
}

export function getCareerRank(state: GameState): CareerRank {
  const mins = getPlayMinutes(state);
  let rank = CAREER_RANKS[0];
  for (const r of CAREER_RANKS) {
    if (mins >= r.minPlayMinutes) rank = r;
  }
  return rank;
}

export function getPlaytimeBonus(state: GameState): number {
  let bonus = getCareerRank(state).incomeBonus;
  for (const tier of PLAYTIME_UNLOCKS) {
    if (state.progression.unlockedPlaytimeTiers.includes(tier.id)) {
      bonus += tier.incomeBonus ?? 0;
    }
  }
  return bonus;
}

export function isAppUnlockedByPlaytime(state: GameState, app: TabId): boolean {
  if (app === "guide" || app === "settings" || app === "dashboard") return true;
  for (const tier of PLAYTIME_UNLOCKS) {
    if (!state.progression.unlockedPlaytimeTiers.includes(tier.id)) continue;
    if (tier.unlockApps?.includes(app)) return true;
  }
  return false;
}

export function isAppFullyUnlocked(state: GameState, app: TabId): boolean {
  return campaignUnlock(state, app) || isAppUnlockedByPlaytime(state, app);
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

  const mins = getPlayMinutes(state);
  const chapter = getCurrentChapter(state.campaign);

  // Find which chapter unlocks this app
  const unlockChapter = CAMPAIGN_CHAPTERS.find((ch) => ch.unlockApps.includes(app));
  if (unlockChapter) {
    const chIdx = CAMPAIGN_CHAPTERS.indexOf(unlockChapter);
    const currentIdx = CAMPAIGN_CHAPTERS.findIndex((c) => c.id === chapter.id);
    if (currentIdx < chIdx) {
      const required = unlockChapter.objectives.filter((o) => !o.optional);
      const done = required.filter((o) => state.campaign.objectivesDone.includes(o.id) || state.campaign.completedChapters.includes(unlockChapter.id)).length;
      return {
        unlocked: false,
        reason: `Termine le chapitre ${chIdx + 1}`,
        progress: state.campaign.completedChapters.includes(unlockChapter.id) ? required.length : done,
        target: required.length,
        progressLabel: unlockChapter.title.replace(/Chapitre \d+ — /, ""),
      };
    }
  }

  // Playtime fallback
  const ptUnlock = PLAYTIME_UNLOCKS.find((t) => t.unlockApps?.includes(app));
  if (ptUnlock) {
    return {
      unlocked: false,
      reason: `${Math.ceil(ptUnlock.minPlayMinutes - mins)} min de jeu restantes`,
      progress: mins,
      target: ptUnlock.minPlayMinutes,
      progressLabel: ptUnlock.title,
    };
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

  return { unlocked: false, reason: "Continue l'aventure" };
}

export function checkPlaytimeUnlocks(state: GameState): GameState {
  const mins = getPlayMinutes(state);
  let s = { ...state };
  let changed = false;

  for (const tier of PLAYTIME_UNLOCKS) {
    if (s.progression.unlockedPlaytimeTiers.includes(tier.id)) continue;
    if (mins >= tier.minPlayMinutes) {
      s = {
        ...s,
        progression: {
          ...s.progression,
          unlockedPlaytimeTiers: [...s.progression.unlockedPlaytimeTiers, tier.id],
          careerRankId: getCareerRank(s).id,
        },
        notifications: [
          {
            id: `pu_${tier.id}`,
            title: `⏱️ ${tier.title}`,
            message: tier.description,
            type: "milestone" as const,
            timestamp: Date.now(),
          },
          ...s.notifications,
        ].slice(0, 20),
      };
      changed = true;
    }
  }

  const newRank = getCareerRank(s);
  if (newRank.id !== s.progression.careerRankId) {
    s = {
      ...s,
      progression: { ...s.progression, careerRankId: newRank.id },
      notifications: changed ? s.notifications : [
        {
          id: `rank_${newRank.id}`,
          title: `Promotion : ${newRank.title}`,
          message: newRank.description,
          type: "levelup" as const,
          timestamp: Date.now(),
        },
        ...s.notifications,
      ].slice(0, 20),
    };
  }

  return s;
}

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

export function getNextPlaytimeUnlock(state: GameState): PlaytimeUnlock | null {
  const mins = getPlayMinutes(state);
  return PLAYTIME_UNLOCKS.find(
    (t) => !state.progression.unlockedPlaytimeTiers.includes(t.id) && mins < t.minPlayMinutes
  ) ?? null;
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
