import type {
  BusinessCategory,
  BusinessState,
  GameNotification,
  GameState,
  Milestone,
} from "@/types/game";
import { ACHIEVEMENTS } from "./achievements";
import {
  BUSINESSES,
  INITIAL_CAPITAL,
  INITIAL_CLICK_POWER,
  INVESTMENTS,
  MANAGERS,
  MILESTONES,
  SYNERGIES,
  UPGRADES,
  XP_PER_LEVEL,
} from "./gameData";
import { generateDailyObjectives, getTodaySeed } from "./dailyObjectives";
import { initMarketState } from "./market";
import { MISSIONS as MISSION_LIST } from "./missions";
import { getPlaytimeBonus } from "./progression";

export function createInitialState(): GameState {
  const now = Date.now();
  return {
    capital: INITIAL_CAPITAL,
    clickPower: INITIAL_CLICK_POWER,
    clickLevel: 1,
    level: 1,
    xp: 0,
    reputation: 0,
    globalRisk: 5,
    combo: 0,
    comboMultiplier: 1,
    lastClickTime: 0,
    goldenRushMeter: 0,
    goldenRushActive: false,
    goldenRushEndTime: 0,
    businesses: [],
    upgrades: [],
    investments: [],
    market: initMarketState(),
    missions: MISSION_LIST.map((m) => ({ id: m.id, progress: 0, completed: false, claimed: false })),
    managers: MANAGERS.map((m) => ({ id: m.id, hired: false })),
    achievements: ACHIEVEMENTS.map((a) => ({ id: a.id, progress: 0, unlocked: false })),
    dailyObjectives: generateDailyObjectives(),
    dailySeed: getTodaySeed(),
    activeEvents: [],
    activeDecision: null,
    completedMilestones: [],
    prestige: { points: 0, totalResets: 0 },
    stats: {
      totalEarned: 0,
      totalSpent: 0,
      totalClicks: 0,
      missionsCompleted: 0,
      bestCapital: INITIAL_CAPITAL,
      playTimeSeconds: 0,
      prestigeCount: 0,
      biggestGain: 0,
      biggestLoss: 0,
      businessesBought: 0,
      investmentsMade: 0,
      tradesMade: 0,
      eventsExperienced: 0,
      goldenRushesTriggered: 0,
      achievementsUnlocked: 0,
      roiByCategory: {
        finance: 0,
        tech: 0,
        retail: 0,
        media: 0,
        real_estate: 0,
        industry: 0,
        space: 0,
      },
    },
    capitalHistory: [{ time: now, value: INITIAL_CAPITAL }],
    notifications: [],
    settings: { soundEnabled: true, compactMode: false },
    wealthTitle: "Débutant",
    incomePerSecond: 0,
    lastSaveTime: now,
    lastTickTime: now,
    sessionStartTime: now,
    passiveIncomeCache: 0,
    clickIncomeCache: 0,
    investmentIncomeCache: 0,
    temporaryBonuses: [],
    gamePhase: "intro",
    campaign: {
      chapterId: "ch1_first_day",
      completedChapters: [],
      introDone: false,
      playstyle: null,
      objectivesDone: [],
    },
    runEconomy: {
      debt: 0,
      debtInterestPerSec: 0,
      overheadPerSec: 0,
      burnStreakSec: 0,
      totalLosses: 0,
      loansTaken: 0,
      businessFailures: 0,
      lastOverheadTick: Date.now(),
    },
    endingTitle: null,
    progression: {
      careerRankId: "intern",
      unlockedPlaytimeTiers: [],
      dismissedCoachTips: [],
    },
  };
}

export function getBusinessCost(baseCost: number, quantity: number, costReduction = 0): number {
  return baseCost * Math.pow(1.12, quantity) * (1 - costReduction);
}

export function getUpgradeCost(upgrade: { cost: number }, level: number): number {
  return upgrade.cost * Math.pow(1.5, level);
}

export function getActiveSynergies(businesses: BusinessState[]): typeof SYNERGIES {
  const ownedIds = new Set(businesses.filter((b) => b.quantity > 0).map((b) => b.id));
  return SYNERGIES.filter((s) => s.businessIds.every((id) => ownedIds.has(id)));
}

export function getUpgradeMultiplier(state: GameState, effect: string): number {
  let mult = 1;
  for (const us of state.upgrades) {
    const u = UPGRADES.find((x) => x.id === us.id);
    if (!u || u.effect !== effect) continue;
    mult += u.effectValue * us.level;
  }
  return mult;
}

export function getCategoryBonus(state: GameState, category: BusinessCategory): number {
  let bonus = 1;
  const effectMap: Record<BusinessCategory, string> = {
    finance: "business_finance",
    tech: "business_tech",
    retail: "business_ecommerce",
    media: "business_media",
    real_estate: "business_real_estate",
    industry: "business_industry",
    space: "business_space",
  };
  const specific = effectMap[category];
  for (const us of state.upgrades) {
    const u = UPGRADES.find((x) => x.id === us.id);
    if (!u) continue;
    if (u.effect === specific || u.effect === "global") {
      bonus += u.effectValue * us.level;
    }
  }
  for (const ms of state.managers) {
    if (!ms.hired) continue;
    const m = MANAGERS.find((x) => x.id === ms.id);
    if (!m) continue;
    if (m.category === category || m.id === "mgr_global") {
      bonus += m.bonus;
    }
  }
  return bonus;
}

export function calculatePassiveIncome(state: GameState): number {
  let total = 0;
  const playstyleMult = state.campaign.playstyle === "conservative" ? 0.85
    : state.campaign.playstyle === "aggressive" ? 1.25 : 1;
  const passiveMult = getUpgradeMultiplier(state, "passive") * playstyleMult;
  const globalMult = getUpgradeMultiplier(state, "global");
  const prestigeMult = 1 + state.prestige.points * 0.1;
  const repMult = 1 + state.reputation * 0.005;
  const milestoneBonus = getMilestoneBonus(state);
  const achievementBonus = getAchievementBonus(state);
  const playtimeBonus = 1 + getPlaytimeBonus(state);
  const synergies = getActiveSynergies(state.businesses);

  for (const bs of state.businesses) {
    if (bs.quantity <= 0) continue;
    const b = BUSINESSES.find((x) => x.id === bs.id);
    if (!b) continue;
    let income = b.baseIncome * bs.quantity * (1 + (bs.level - 1) * 0.1);
    income *= getCategoryBonus(state, b.category);
    income *= b.multiplier;
    for (const syn of synergies) {
      if (syn.businessIds.includes(b.id)) income *= 1 + syn.bonus;
    }
    if (b.id === "ecommerce") income *= getUpgradeMultiplier(state, "business_ecommerce") > 1 ? getUpgradeMultiplier(state, "business_ecommerce") : 1;
    if (b.id === "saas") income *= getUpgradeMultiplier(state, "business_saas") > 1 ? getUpgradeMultiplier(state, "business_saas") : 1;
    total += income;
  }

  total *= passiveMult * globalMult * prestigeMult * repMult * milestoneBonus * achievementBonus * playtimeBonus;

  for (const bonus of state.temporaryBonuses) {
    if (bonus.expiresAt > Date.now() && bonus.incomeMultiplier) {
      total *= bonus.incomeMultiplier;
    }
  }
  for (const ev of state.activeEvents) {
    if (ev.endTime > Date.now() || ev.endTime === 0) {
      // handled separately
    }
  }

  if (state.goldenRushActive) total *= 3;

  return total;
}

export function getMilestoneBonus(state: GameState): number {
  let bonus = 1;
  for (const id of state.completedMilestones) {
    const m = MILESTONES.find((x) => x.id === id);
    if (m) bonus += m.bonus;
  }
  return bonus;
}

export function getAchievementBonus(state: GameState): number {
  let bonus = 1;
  for (const as of state.achievements) {
    if (!as.unlocked) continue;
    const a = ACHIEVEMENTS.find((x) => x.id === as.id);
    if (a) bonus += a.bonus;
  }
  return bonus;
}

export function calculateClickIncome(state: GameState): number {
  const playstyleMult = state.campaign.playstyle === "conservative" ? 0.85
    : state.campaign.playstyle === "aggressive" ? 1.25 : 1;
  const playtimeBonus = 1 + getPlaytimeBonus(state);
  let income = state.clickPower * playstyleMult * playtimeBonus;
  income *= getUpgradeMultiplier(state, "click");
  income *= getUpgradeMultiplier(state, "global");
  income *= 1 + state.prestige.points * 0.1;
  income *= 1 + state.reputation * 0.005;
  income *= getMilestoneBonus(state);
  income *= getAchievementBonus(state);
  income *= state.comboMultiplier;

  for (const bonus of state.temporaryBonuses) {
    if (bonus.expiresAt > Date.now() && bonus.clickMultiplier) {
      income *= bonus.clickMultiplier;
    }
  }

  if (state.goldenRushActive) income *= 5;

  return income;
}

export function getCostReduction(state: GameState): number {
  let reduction = 0;
  for (const us of state.upgrades) {
    const u = UPGRADES.find((x) => x.id === us.id);
    if (u?.effect === "cost") reduction += u.effectValue * us.level;
  }
  for (const bonus of state.temporaryBonuses) {
    if (bonus.expiresAt > Date.now() && bonus.costReduction) {
      reduction += bonus.costReduction;
    }
  }
  return Math.min(reduction, 0.5);
}

export function getXpForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(1.15, level - 1));
}

export function addXp(state: GameState, amount: number): GameState {
  let xp = state.xp + amount;
  let level = state.level;
  while (xp >= getXpForLevel(level)) {
    xp -= getXpForLevel(level);
    level++;
  }
  return { ...state, xp, level };
}

export function addNotification(
  state: GameState,
  title: string,
  message: string,
  type: GameNotification["type"]
): GameState {
  const notif: GameNotification = {
    id: `notif_${Date.now()}_${Math.random()}`,
    title,
    message,
    type,
    timestamp: Date.now(),
  };
  return {
    ...state,
    notifications: [notif, ...state.notifications].slice(0, 20),
  };
}

export function checkMilestones(state: GameState): { state: GameState; newMilestones: Milestone[] } {
  const newMilestones: Milestone[] = [];
  let s = state;
  for (const m of MILESTONES) {
    if (s.completedMilestones.includes(m.id)) continue;
    if (s.capital >= m.amount) {
      s = {
        ...s,
        completedMilestones: [...s.completedMilestones, m.id],
        capital: s.capital + m.reward,
        wealthTitle: m.title,
        stats: {
          ...s.stats,
          totalEarned: s.stats.totalEarned + m.reward,
          biggestGain: Math.max(s.stats.biggestGain, m.reward),
        },
      };
      s = addNotification(s, `🏆 ${m.title}`, `+${m.reward} € — Bonus permanent +${(m.bonus * 100).toFixed(0)}%`, "milestone");
      newMilestones.push(m);
    }
  }
  return { state: s, newMilestones };
}

export function getMetricValue(state: GameState, metric: string): number {
  switch (metric) {
    case "capital":
      return state.capital;
    case "click_earnings":
      return state.clickIncomeCache;
    case "unique_businesses":
      return state.businesses.filter((b) => b.quantity > 0).length;
    case "income_per_sec":
      return state.incomePerSecond;
    case "max_combo":
      return state.combo;
    case "total_invested":
      return state.investments.reduce((s, i) => s + i.amount, 0);
    case "stock_novatech":
      return state.market.find((m) => m.id === "novatech")?.owned ?? 0;
    case "market_profit":
      return state.stats.biggestGain;
    case "business_rental":
      return state.businesses.find((b) => b.id === "rental")?.quantity ?? 0;
    case "business_saas":
      return state.businesses.find((b) => b.id === "saas")?.quantity ?? 0;
    case "survive_crisis":
      return state.stats.eventsExperienced > 0 ? 1 : 0;
    case "upgrade_count":
      return state.upgrades.reduce((s, u) => s + u.level, 0);
    case "passive_earned":
      return state.passiveIncomeCache;
    case "investment_multiplier":
      return state.investments.some((i) => i.currentValue >= i.amount * 2) ? 2 : 0;
    case "milestone_m1m":
      return state.completedMilestones.includes("m1m") ? 1 : 0;
    case "golden_rush":
      return state.stats.goldenRushesTriggered;
    case "clicks_in_20s":
      return state.stats.totalClicks;
    case "business_ai_startup":
      return state.businesses.find((b) => b.id === "ai_startup")?.quantity ?? 0;
    case "total_businesses":
      return state.businesses.reduce((s, b) => s + b.quantity, 0);
    case "level":
      return state.level;
    case "managers_hired":
      return state.managers.filter((m) => m.hired).length;
    case "synergies_active":
      return getActiveSynergies(state.businesses).length;
    case "achievements":
      return state.achievements.filter((a) => a.unlocked).length;
    case "daily_completed":
      return state.dailyObjectives.filter((d) => d.completed).length;
    case "reputation":
      return state.reputation;
    case "trades_made":
      return state.stats.tradesMade;
    case "events_experienced":
      return state.stats.eventsExperienced;
    case "prestige_count":
      return state.prestige.totalResets;
    case "total_clicks":
      return state.stats.totalClicks;
    case "business_orbital":
      return state.businesses.find((b) => b.id === "orbital")?.quantity ?? 0;
    case "decisions_made":
      return state.stats.eventsExperienced;
    case "total_spent":
      return state.stats.totalSpent;
    case "total_earned":
      return state.stats.totalEarned;
    case "daily_clicks":
    case "daily_passive":
    case "daily_buys":
    case "daily_trades":
    case "daily_missions":
    case "daily_invest":
    case "daily_combo":
    case "daily_capital":
      return state.dailyObjectives.find((d) => d.metric === metric)?.progress ?? 0;
    case "best_capital":
      return state.stats.bestCapital;
    case "golden_rushes":
      return state.stats.goldenRushesTriggered;
    case "play_time":
      return state.stats.playTimeSeconds;
    case "daily_all":
      return state.dailyObjectives.every((d) => d.completed) ? 1 : 0;
    case "upgrade_levels":
      return state.upgrades.reduce((s, u) => s + u.level, 0);
    case "investments_made":
      return state.stats.investmentsMade;
    case "businesses_bought":
      return state.stats.businessesBought;
    default:
      return 0;
  }
}

export function updateMissions(state: GameState): GameState {
  const missions = state.missions.map((ms) => {
    const m = MISSION_LIST.find((x) => x.id === ms.id);
    if (!m || ms.completed) return ms;
    const progress = getMetricValue(state, m.metric);
    const completed = progress >= m.target;
    return { ...ms, progress: Math.min(progress, m.target), completed };
  });
  return { ...state, missions };
}

export function updateAchievements(state: GameState): GameState {
  const achievements = state.achievements.map((as) => {
    const a = ACHIEVEMENTS.find((x) => x.id === as.id);
    if (!a || as.unlocked) return as;
    const progress = getMetricValue(state, a.metric);
    const unlocked = progress >= a.target;
    return { ...as, progress: Math.min(progress, a.target), unlocked };
  });
  return { ...state, achievements };
}

export function updateDailyObjectives(state: GameState, metric: string, amount = 1): GameState {
  const dailyObjectives = state.dailyObjectives.map((d) => {
    if (d.metric !== metric || d.completed) return d;
    const progress = d.progress + amount;
    return {
      ...d,
      progress,
      completed: progress >= d.target,
    };
  });
  return { ...state, dailyObjectives };
}

export function canPrestige(state: GameState): boolean {
  return state.capital >= 1_000_000_000;
}

export function performPrestige(state: GameState): GameState {
  const points = Math.floor(Math.log10(state.capital / 1_000_000_000) + 1);
  const fresh = createInitialState();
  return {
    ...fresh,
    prestige: {
      points: state.prestige.points + points,
      totalResets: state.prestige.totalResets + 1,
    },
    reputation: state.reputation + points * 5,
    achievements: state.achievements,
    settings: state.settings,
    stats: {
      ...fresh.stats,
      prestigeCount: state.stats.prestigeCount + 1,
      playTimeSeconds: state.stats.playTimeSeconds,
      achievementsUnlocked: state.stats.achievementsUnlocked,
    },
  };
}

export function getWealthTitle(capital: number): string {
  const m = [...MILESTONES].reverse().find((x) => capital >= x.amount);
  return m?.title ?? "Débutant";
}

export function isBusinessUnlocked(state: GameState, unlockAt: number): boolean {
  return state.capital >= unlockAt * 0.5 || state.stats.bestCapital >= unlockAt;
}

export function isInvestmentUnlocked(state: GameState, unlockAt: number): boolean {
  return state.stats.bestCapital >= unlockAt || state.capital >= unlockAt * 0.3;
}
