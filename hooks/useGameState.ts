"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { FloatingMoneyItem, GameState, Playstyle } from "@/types/game";
import { checkCampaignObjectives } from "@/lib/campaign";
import { playSound } from "@/lib/audio";
import {
  applyCapitalChange,
  applyMarketPortfolioShock,
  emergencySellBusiness,
  maybeBusinessFailure,
  takeEmergencyLoan,
  tickInvestments,
  tickRunEconomy,
} from "@/lib/runEconomy";
import { GAME_EVENTS, STRATEGIC_DECISIONS } from "@/lib/events";
import { shouldRefreshDailyObjectives, generateDailyObjectives, getTodaySeed } from "@/lib/dailyObjectives";
import {
  BUSINESSES,
  COMBO_DECAY_MS,
  GOLDEN_RUSH_DURATION,
  GOLDEN_RUSH_METER_MAX,
  INVESTMENTS,
  MANAGERS,
  UPGRADES,
} from "@/lib/gameData";
import {
  addNotification,
  addXp,
  calculateClickIncome,
  calculatePassiveIncome,
  canPrestige,
  checkMilestones,
  createInitialState,
  getBusinessCost,
  getCostReduction,
  getUpgradeCost,
  isBusinessUnlocked,
  isInvestmentUnlocked,
  performPrestige,
  updateAchievements,
  updateDailyObjectives,
  updateMissions,
} from "@/lib/gameLogic";
import { MISSIONS } from "@/lib/missions";
import { tickMarket } from "@/lib/market";
import { loadGame, saveGame, resetGame } from "@/lib/storage";

type Action =
  | { type: "INIT"; state: GameState }
  | { type: "TICK"; delta: number }
  | { type: "CLICK"; x: number; y: number }
  | { type: "BUY_BUSINESS"; id: string }
  | { type: "UPGRADE_BUSINESS"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "INVEST"; id: string; amount: number }
  | { type: "WITHDRAW"; id: string }
  | { type: "BUY_STOCK"; id: string; qty: number }
  | { type: "SELL_STOCK"; id: string; qty: number }
  | { type: "CLAIM_MISSION"; id: string }
  | { type: "CLAIM_DAILY"; id: string }
  | { type: "HIRE_MANAGER"; id: string }
  | { type: "TRIGGER_GOLDEN_RUSH" }
  | { type: "EVENT_CHOICE"; eventId: string; choiceId: string }
  | { type: "DECISION_CHOICE"; decisionId: string; choiceId: string }
  | { type: "PRESTIGE" }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_COMPACT" }
  | { type: "MANUAL_SAVE" }
  | { type: "RESET" }
  | { type: "CLEAR_FLOATING"; id: string }
  | { type: "RANDOM_EVENT" }
  | { type: "STRATEGIC_DECISION" }
  | { type: "MARKET_TICK" }
  | { type: "SET_PLAYSTYLE"; playstyle: Playstyle }
  | { type: "TAKE_LOAN" }
  | { type: "EMERGENCY_SELL"; businessId: string }
  | { type: "RESTART_RUN" };

let floatingId = 0;
let failureCheckCounter = 0;

function canPlay(state: GameState): boolean {
  return state.gamePhase !== "bankrupt" && state.gamePhase !== "intro";
}

function gameReducer(state: GameState, action: Action): GameState {
  const sound = state.settings.soundEnabled;

  switch (action.type) {
    case "INIT":
      return action.state;

    case "TICK": {
      if (state.gamePhase === "intro" || state.gamePhase === "bankrupt") return state;

      let s = { ...state };
      const now = Date.now();
      const deltaSec = action.delta / 1000;
      s.stats = { ...s.stats, playTimeSeconds: s.stats.playTimeSeconds + deltaSec };

      if (s.combo > 0 && now - s.lastClickTime > COMBO_DECAY_MS) {
        s.combo = 0;
        s.comboMultiplier = 1;
      }

      if (s.goldenRushActive && now > s.goldenRushEndTime) {
        s.goldenRushActive = false;
      }

      s.temporaryBonuses = s.temporaryBonuses.filter((b) => b.expiresAt > now);
      s.activeEvents = s.activeEvents.filter((e) => e.endTime === 0 || e.endTime > now);

      const passive = calculatePassiveIncome(s);
      s.incomePerSecond = passive;
      const gain = passive * deltaSec;
      if (gain > 0) {
        s = applyCapitalChange(s, gain);
        s.passiveIncomeCache += gain;
      }

      s = tickRunEconomy(s, deltaSec);
      s = tickInvestments(s, action.delta);

      failureCheckCounter += action.delta;
      if (failureCheckCounter > 15000) {
        failureCheckCounter = 0;
        s = maybeBusinessFailure(s);
      }

      if (now - s.lastTickTime > 5000) {
        s.capitalHistory = [...s.capitalHistory, { time: now, value: s.capital }].slice(-60);
        s.lastTickTime = now;
      }

      if (shouldRefreshDailyObjectives(s.dailySeed)) {
        s.dailyObjectives = generateDailyObjectives();
        s.dailySeed = getTodaySeed();
      }

      s = updateMissions(s);
      s = updateAchievements(s);
      s = checkCampaignObjectives(s);
      const milestoneResult = checkMilestones(s);
      s = milestoneResult.state;

      return s;
    }

    case "CLICK": {
      if (!canPlay(state)) return state;
      let s = { ...state };
      const now = Date.now();
      const timeSince = now - s.lastClickTime;
      if (timeSince < 400) {
        s.combo = Math.min(s.combo + 1, 20);
        s.comboMultiplier = 1 + s.combo * 0.1;
      } else if (timeSince > COMBO_DECAY_MS) {
        s.combo = 1;
        s.comboMultiplier = 1.1;
      }
      s.lastClickTime = now;

      const income = calculateClickIncome(s);
      s = applyCapitalChange(s, income);
      s.clickIncomeCache += income;
      s.stats.totalClicks++;
      s.goldenRushMeter = Math.min(GOLDEN_RUSH_METER_MAX, s.goldenRushMeter + 1 + s.combo * 0.2);
      s = updateDailyObjectives(s, "daily_clicks");
      s = addXp(s, 1);
      s = updateMissions(s);
      s = updateAchievements(s);
      const mr = checkMilestones(s);
      s = mr.state;
      s = checkCampaignObjectives(s);
      playSound("click", sound);
      return s;
    }

    case "SET_PLAYSTYLE": {
      return {
        ...state,
        campaign: { ...state.campaign, playstyle: action.playstyle, introDone: true },
        gamePhase: "playing",
      };
    }

    case "TAKE_LOAN": {
      if (!canPlay(state)) return state;
      const s = takeEmergencyLoan(state);
      playSound("event", sound);
      return addNotification(s, "Prêt d'urgence", "Dette contractée. Les intérêts grignotent ton capital.", "warning");
    }

    case "EMERGENCY_SELL": {
      if (!canPlay(state)) return state;
      const s = emergencySellBusiness(state, action.businessId);
      playSound("error", sound);
      return addNotification(s, "Vente d'urgence", "Tu as dû vendre à perte pour survivre.", "warning");
    }

    case "RESTART_RUN": {
      resetGame();
      return createInitialState();
    }

    case "BUY_BUSINESS": {
      if (!canPlay(state)) return state;
      const b = BUSINESSES.find((x) => x.id === action.id);
      if (!b) return state;
      let s = { ...state };
      const bs = s.businesses.find((x) => x.id === action.id) ?? { id: action.id, quantity: 0, level: 1 };
      const cost = getBusinessCost(b.baseCost, bs.quantity, getCostReduction(s));
      if (s.capital < cost || !isBusinessUnlocked(s, b.unlockAt)) {
        playSound("error", sound);
        return s;
      }
      s.capital -= cost;
      s.stats.totalSpent += cost;
      s.stats.businessesBought++;
      const existing = s.businesses.filter((x) => x.id !== action.id);
      s.businesses = [...existing, { ...bs, quantity: bs.quantity + 1 }];
      s.goldenRushMeter = Math.min(GOLDEN_RUSH_METER_MAX, s.goldenRushMeter + 3);
      s = addXp(s, 10);
      s = updateDailyObjectives(s, "daily_buys");
      s = updateMissions(s);
      s = updateAchievements(s);
      playSound("purchase", sound);
      return addNotification(s, "Business acheté", `${b.name} acquis !`, "success");
    }

    case "UPGRADE_BUSINESS": {
      const b = BUSINESSES.find((x) => x.id === action.id);
      if (!b) return state;
      let s = { ...state };
      const bs = s.businesses.find((x) => x.id === action.id);
      if (!bs || bs.quantity <= 0) return s;
      const cost = getBusinessCost(b.baseCost, bs.quantity, getCostReduction(s)) * 2;
      if (s.capital < cost) { playSound("error", sound); return s; }
      s.capital -= cost;
      s.stats.totalSpent += cost;
      s.businesses = s.businesses.map((x) =>
        x.id === action.id ? { ...x, level: x.level + 1 } : x
      );
      playSound("purchase", sound);
      return s;
    }

    case "BUY_UPGRADE": {
      const u = UPGRADES.find((x) => x.id === action.id);
      if (!u) return state;
      let s = { ...state };
      const us = s.upgrades.find((x) => x.id === action.id) ?? { id: action.id, level: 0 };
      if (us.level >= u.maxLevel || s.capital < getUpgradeCost(u, us.level) || s.stats.bestCapital < u.unlockAt) {
        playSound("error", sound);
        return s;
      }
      const cost = getUpgradeCost(u, us.level);
      s.capital -= cost;
      s.stats.totalSpent += cost;
      const rest = s.upgrades.filter((x) => x.id !== action.id);
      s.upgrades = [...rest, { id: action.id, level: us.level + 1 }];
      s = addXp(s, 15);
      playSound("purchase", sound);
      return addNotification(s, "Upgrade !", u.name, "success");
    }

    case "INVEST": {
      const inv = INVESTMENTS.find((x) => x.id === action.id);
      if (!inv || action.amount <= 0 || state.capital < action.amount) {
        playSound("error", sound);
        return state;
      }
      let s = { ...state };
      s.capital -= action.amount;
      s.stats.totalSpent += action.amount;
      s.stats.investmentsMade++;
      const existing = s.investments.find((x) => x.id === action.id);
      if (existing) {
        s.investments = s.investments.map((x) =>
          x.id === action.id
            ? { ...x, amount: x.amount + action.amount, currentValue: x.currentValue + action.amount }
            : x
        );
      } else {
        s.investments = [...s.investments, { id: action.id, amount: action.amount, entryPrice: 1, currentValue: action.amount, history: [action.amount] }];
      }
      const riskMap = { low: 1, medium: 3, high: 6, extreme: 12 };
      s.globalRisk = Math.min(100, s.globalRisk + (riskMap[inv.risk] ?? 2));
      s = updateDailyObjectives(s, "daily_invest", action.amount);
      playSound("purchase", sound);
      return s;
    }

    case "WITHDRAW": {
      let s = { ...state };
      const inv = s.investments.find((x) => x.id === action.id);
      if (!inv || inv.currentValue <= 0) return s;
      const profit = inv.currentValue - inv.amount;
      s.capital += inv.currentValue;
      s.stats.totalEarned += inv.currentValue;
      if (profit > 0) s.stats.biggestGain = Math.max(s.stats.biggestGain, profit);
      if (profit < 0) s.stats.biggestLoss = Math.max(s.stats.biggestLoss, Math.abs(profit));
      s.investments = s.investments.filter((x) => x.id !== action.id);
      playSound("purchase", sound);
      return s;
    }

    case "BUY_STOCK": {
      let s = { ...state };
      const asset = s.market.find((x) => x.id === action.id);
      if (!asset) return s;
      const cost = asset.price * action.qty;
      if (s.capital < cost) { playSound("error", sound); return s; }
      s.capital -= cost;
      s.stats.totalSpent += cost;
      s.stats.tradesMade++;
      const newOwned = asset.owned + action.qty;
      const newAvg = (asset.avgBuyPrice * asset.owned + cost) / newOwned;
      s.market = s.market.map((x) =>
        x.id === action.id ? { ...x, owned: newOwned, avgBuyPrice: newAvg } : x
      );
      s.globalRisk = Math.min(100, s.globalRisk + 2);
      s = updateDailyObjectives(s, "daily_trades");
      playSound("purchase", sound);
      return s;
    }

    case "SELL_STOCK": {
      let s = { ...state };
      const asset = s.market.find((x) => x.id === action.id);
      if (!asset || asset.owned < action.qty) { playSound("error", sound); return s; }
      const revenue = asset.price * action.qty;
      const profit = (asset.price - asset.avgBuyPrice) * action.qty;
      s.capital += revenue;
      s.stats.totalEarned += revenue;
      s.stats.tradesMade++;
      if (profit > 0) s.stats.biggestGain = Math.max(s.stats.biggestGain, profit);
      s.market = s.market.map((x) =>
        x.id === action.id ? { ...x, owned: x.owned - action.qty } : x
      );
      s = updateDailyObjectives(s, "daily_trades");
      playSound("purchase", sound);
      return s;
    }

    case "CLAIM_MISSION": {
      const m = MISSIONS.find((x) => x.id === action.id);
      const ms = state.missions.find((x) => x.id === action.id);
      if (!m || !ms?.completed || ms.claimed) return state;
      let s = { ...state };
      const rewardMult = 1 + s.reputation * 0.01;
      const reward = Math.round(m.reward * rewardMult);
      s.capital += reward;
      s.stats.totalEarned += reward;
      s.stats.missionsCompleted++;
      s.missions = s.missions.map((x) =>
        x.id === action.id ? { ...x, claimed: true } : x
      );
      s = addXp(s, m.xpReward);
      s = updateDailyObjectives(s, "daily_missions");
      s.reputation += 1;
      playSound("mission", sound);
      return addNotification(s, "Mission accomplie !", `${m.title} — +${reward} €`, "success");
    }

    case "CLAIM_DAILY": {
      const d = state.dailyObjectives.find((x) => x.id === action.id);
      if (!d?.completed || d.claimed) return state;
      let s = { ...state };
      if (d.rewardType === "cash") {
        s.capital += d.reward;
        s.stats.totalEarned += d.reward;
      } else if (d.rewardType === "xp") {
        s = addXp(s, d.reward);
      } else {
        s.goldenRushMeter = Math.min(GOLDEN_RUSH_METER_MAX, s.goldenRushMeter + d.reward / 10);
      }
      s.dailyObjectives = s.dailyObjectives.map((x) =>
        x.id === action.id ? { ...x, claimed: true } : x
      );
      playSound("mission", sound);
      return addNotification(s, "Objectif quotidien !", d.title, "success");
    }

    case "HIRE_MANAGER": {
      const m = MANAGERS.find((x) => x.id === action.id);
      const ms = state.managers.find((x) => x.id === action.id);
      if (!m || ms?.hired || state.capital < m.cost) {
        playSound("error", sound);
        return state;
      }
      let s = { ...state };
      s.capital -= m.cost;
      s.stats.totalSpent += m.cost;
      s.managers = s.managers.map((x) =>
        x.id === action.id ? { ...x, hired: true } : x
      );
      s.reputation += 3;
      playSound("purchase", sound);
      return addNotification(s, "Manager recruté", m.name, "success");
    }

    case "TRIGGER_GOLDEN_RUSH": {
      if (state.goldenRushActive || state.goldenRushMeter < GOLDEN_RUSH_METER_MAX) return state;
      let s = { ...state };
      s.goldenRushActive = true;
      s.goldenRushEndTime = Date.now() + GOLDEN_RUSH_DURATION * 1000;
      s.goldenRushMeter = 0;
      s.stats.goldenRushesTriggered++;
      playSound("golden", sound);
      return addNotification(s, "GOLDEN RUSH !", "Revenus x3, Clics x5 pendant 15s !", "milestone");
    }

    case "EVENT_CHOICE": {
      const ev = GAME_EVENTS.find((x) => x.id === action.eventId);
      const choice = ev?.choices?.find((c) => c.id === action.choiceId);
      if (!ev || !choice) return state;
      let s = { ...state };
      if (choice.effects.cashBonus) {
        const bonus = choice.effects.cashBonus > 1 || choice.effects.cashBonus < -1
          ? choice.effects.cashBonus
          : s.capital * choice.effects.cashBonus;
        s = applyCapitalChange(s, bonus, ev.title);
      }
      if (choice.effects.riskChange) s.globalRisk = Math.max(0, s.globalRisk + choice.effects.riskChange);
      if (choice.id === "refuse") s.reputation += 5;
      s.stats.eventsExperienced++;
      playSound("event", sound);
      return addNotification(s, ev.title, choice.label, "info");
    }

    case "DECISION_CHOICE": {
      const dec = STRATEGIC_DECISIONS.find((x) => x.id === action.decisionId);
      const choice = dec?.choices.find((c) => c.id === action.choiceId);
      if (!dec || !choice) return state;
      let s = { ...state };
      const fx = choice.effects as {
        cash?: number;
        reputation?: number;
        risk?: number;
        incomeBonus?: number;
        duration?: number;
      };
      if (fx.cash !== undefined) {
        let cash = fx.cash;
        if (action.choiceId === "all_in") {
          cash = Math.random() < 0.35 ? -10000 : 30000;
        }
        if (cash < 0 && s.capital < Math.abs(cash)) {
          cash = -s.capital * 0.6;
        }
        s = applyCapitalChange(s, cash, dec.title);
        if (cash < 0) s.stats.totalSpent += Math.abs(cash);
      }
      if (fx.reputation !== undefined) s.reputation += fx.reputation;
      if (fx.risk !== undefined) s.globalRisk = Math.max(0, Math.min(100, s.globalRisk + fx.risk));
      if (fx.incomeBonus !== undefined && fx.duration) {
        s.temporaryBonuses = [...s.temporaryBonuses, {
          incomeMultiplier: 1 + fx.incomeBonus,
          clickMultiplier: 1,
          costReduction: 0,
          expiresAt: Date.now() + fx.duration * 1000,
        }];
      }
      s.activeDecision = null;
      playSound("decision", sound);
      return addNotification(s, "Décision prise", `${dec.title}: ${choice.label}`, "info");
    }

    case "PRESTIGE": {
      if (!canPrestige(state)) return state;
      const newState = performPrestige(state);
      playSound("milestone", sound);
      return addNotification(newState, "Prestige !", `+${newState.prestige.points} points de réputation investisseur`, "milestone");
    }

    case "TOGGLE_SOUND":
      return { ...state, settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled } };

    case "TOGGLE_COMPACT":
      return { ...state, settings: { ...state.settings, compactMode: !state.settings.compactMode } };

    case "MANUAL_SAVE":
      saveGame(state);
      return addNotification(state, "Sauvegardé", "Progression enregistrée.", "info");

    case "RESET":
      resetGame();
      return createInitialState();

    case "RANDOM_EVENT": {
      if (!canPlay(state)) return state;
      const ev = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
      let s = { ...state };
      if (ev.effects.cashBonus) {
        const bonus = ev.effects.cashBonus > 1 || ev.effects.cashBonus < -1
          ? ev.effects.cashBonus
          : s.capital * Math.abs(ev.effects.cashBonus) * (ev.effects.cashBonus < 0 ? -1 : 1);
        s = applyCapitalChange(s, bonus, ev.title);
      }
      if (ev.type === "negative" && (ev.id === "panic" || ev.id === "crash_crypto")) {
        s = applyMarketPortfolioShock(s, ev.id === "panic" ? 0.12 : 0.2);
      }
      if (ev.duration > 0) {
        s.activeEvents = [...s.activeEvents, {
          eventId: ev.id,
          startTime: Date.now(),
          endTime: Date.now() + ev.duration * 1000,
          resolved: !ev.choices,
        }];
        if (ev.effects.incomeMultiplier || ev.effects.clickMultiplier) {
          s.temporaryBonuses = [...s.temporaryBonuses, {
            incomeMultiplier: ev.effects.incomeMultiplier ?? 1,
            clickMultiplier: ev.effects.clickMultiplier ?? 1,
            costReduction: ev.effects.costReduction ?? 0,
            expiresAt: Date.now() + ev.duration * 1000,
          }];
        }
      }
      s.stats.eventsExperienced++;
      if (ev.type === "choice" && ev.choices) {
        return addNotification(s, ev.title, ev.description, "info");
      }
      playSound("event", sound);
      return addNotification(s, ev.title, ev.description, ev.type === "positive" ? "success" : ev.type === "negative" ? "warning" : "info");
    }

    case "STRATEGIC_DECISION": {
      const dec = STRATEGIC_DECISIONS[Math.floor(Math.random() * STRATEGIC_DECISIONS.length)];
      return {
        ...state,
        activeDecision: { decisionId: dec.id, expiresAt: Date.now() + 30000 },
      };
    }

    case "MARKET_TICK": {
      const volatilityMult = 1 + state.globalRisk * 0.01;
      return { ...state, market: tickMarket(state.market, volatilityMult) };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [floatingMoney, setFloatingMoney] = useState<FloatingMoneyItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const prevLevel = useRef(1);
  const prevIncome = useRef(0);
  const prevMilestones = useRef<string[]>([]);
  const [incomePulse, setIncomePulse] = useState(false);
  const [showGoldenRush, setShowGoldenRush] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (saved) dispatch({ type: "INIT", state: saved });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => saveGame(state), 5000);
    return () => clearInterval(interval);
  }, [state, loaded]);

  useEffect(() => {
    if (state.level > prevLevel.current) {
      setShowLevelUp(true);
      playSound("levelup", state.settings.soundEnabled);
      setTimeout(() => setShowLevelUp(false), 2500);
    }
    prevLevel.current = state.level;
  }, [state.level, state.settings.soundEnabled]);

  useEffect(() => {
    if (state.incomePerSecond > prevIncome.current * 1.05 && prevIncome.current > 0) {
      setIncomePulse(true);
      setTimeout(() => setIncomePulse(false), 1000);
    }
    prevIncome.current = state.incomePerSecond;
  }, [state.incomePerSecond]);

  useEffect(() => {
    if (state.goldenRushActive) setShowGoldenRush(true);
    else setShowGoldenRush(false);
  }, [state.goldenRushActive]);

  useEffect(() => {
    const newOnes = state.completedMilestones.filter((id) => !prevMilestones.current.includes(id));
    if (newOnes.length > 0) {
      const title = state.wealthTitle;
      setShowMilestone(title);
      setShowConfetti(true);
      playSound("milestone", state.settings.soundEnabled);
      setTimeout(() => { setShowMilestone(null); setShowConfetti(false); }, 3000);
    }
    prevMilestones.current = state.completedMilestones;
  }, [state.completedMilestones, state.wealthTitle, state.settings.soundEnabled]);

  const handleClick = useCallback((x: number, y: number) => {
    const income = calculateClickIncome(state);
    const id = `float_${++floatingId}`;
    setFloatingMoney((prev) => [...prev.slice(-15), { id, amount: income, x, y }]);
    setTimeout(() => setFloatingMoney((prev) => prev.filter((f) => f.id !== id)), 1200);
    dispatch({ type: "CLICK", x, y });
  }, [state]);

  const buyBusiness = useCallback((id: string) => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1500);
    dispatch({ type: "BUY_BUSINESS", id });
  }, []);

  const triggerMilestoneCelebration = useCallback((title: string) => {
    setShowMilestone(title);
    setShowConfetti(true);
    playSound("milestone", state.settings.soundEnabled);
    setTimeout(() => { setShowMilestone(null); setShowConfetti(false); }, 3000);
  }, [state.settings.soundEnabled]);

  return {
    state,
    dispatch,
    loaded,
    floatingMoney,
    handleClick,
    buyBusiness,
    incomePulse,
    showGoldenRush,
    showLevelUp,
    showMilestone,
    showConfetti,
    showParticles,
    triggerMilestoneCelebration,
    actions: {
      buyBusiness,
      upgradeBusiness: (id: string) => dispatch({ type: "UPGRADE_BUSINESS", id }),
      buyUpgrade: (id: string) => dispatch({ type: "BUY_UPGRADE", id }),
      invest: (id: string, amount: number) => dispatch({ type: "INVEST", id, amount }),
      withdraw: (id: string) => dispatch({ type: "WITHDRAW", id }),
      buyStock: (id: string, qty: number) => dispatch({ type: "BUY_STOCK", id, qty }),
      sellStock: (id: string, qty: number) => dispatch({ type: "SELL_STOCK", id, qty }),
      claimMission: (id: string) => dispatch({ type: "CLAIM_MISSION", id }),
      claimDaily: (id: string) => dispatch({ type: "CLAIM_DAILY", id }),
      hireManager: (id: string) => dispatch({ type: "HIRE_MANAGER", id }),
      triggerGoldenRush: () => dispatch({ type: "TRIGGER_GOLDEN_RUSH" }),
      eventChoice: (eventId: string, choiceId: string) => dispatch({ type: "EVENT_CHOICE", eventId, choiceId }),
      decisionChoice: (decisionId: string, choiceId: string) => dispatch({ type: "DECISION_CHOICE", decisionId, choiceId }),
      prestige: () => dispatch({ type: "PRESTIGE" }),
      toggleSound: () => dispatch({ type: "TOGGLE_SOUND" }),
      toggleCompact: () => dispatch({ type: "TOGGLE_COMPACT" }),
      manualSave: () => dispatch({ type: "MANUAL_SAVE" }),
      reset: () => dispatch({ type: "RESET" }),
      setPlaystyle: (playstyle: Playstyle) => dispatch({ type: "SET_PLAYSTYLE", playstyle }),
      takeLoan: () => dispatch({ type: "TAKE_LOAN" }),
      emergencySell: (businessId: string) => dispatch({ type: "EMERGENCY_SELL", businessId }),
      restartRun: () => dispatch({ type: "RESTART_RUN" }),
    },
  };
}
