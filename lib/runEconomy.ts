import type { GameNotification, GameState } from "@/types/game";
import { BUSINESSES, INVESTMENTS } from "./gameData";
import { PLAYSTYLE_MODIFIERS } from "./campaign";

export const BANKRUPTCY_THRESHOLD = -150;
export const STRUGGLING_THRESHOLD = 120;
export const LOAN_AMOUNT = 200;
export const LOAN_INTEREST_PER_SEC = 0.02;

export function getPlaystyleMod(state: GameState) {
  const ps = state.campaign.playstyle ?? "balanced";
  return PLAYSTYLE_MODIFIERS[ps];
}

export function calculateOverheadPerSec(state: GameState): number {
  let overhead = 0;
  for (const bs of state.businesses) {
    if (bs.quantity <= 0) continue;
    const b = BUSINESSES.find((x) => x.id === bs.id);
    if (!b) continue;
    // Maintenance = 8% of base income per unit, scaled by risk
    overhead += b.baseIncome * bs.quantity * 0.08 * (1 + b.risk * 0.02);
  }
  // Managers cost upkeep
  overhead += state.managers.filter((m) => m.hired).length * 2;
  overhead *= getPlaystyleMod(state).overheadMult;
  return overhead;
}

export function applyCapitalChange(state: GameState, delta: number, reason?: string): GameState {
  const mod = getPlaystyleMod(state);
  const adjusted = delta < 0 ? delta * mod.lossMult : delta;

  let capital = state.capital + adjusted;
  let runEconomy = { ...state.runEconomy };
  let stats = { ...state.stats };
  let gamePhase = state.gamePhase;
  let endingTitle = state.endingTitle;

  if (adjusted < 0) {
    runEconomy.totalLosses += Math.abs(adjusted);
    stats.biggestLoss = Math.max(stats.biggestLoss, Math.abs(adjusted));
  } else if (adjusted > 0) {
    stats.totalEarned += adjusted;
    stats.biggestGain = Math.max(stats.biggestGain, adjusted);
  }

  stats.bestCapital = Math.max(stats.bestCapital, capital);

  // Auto-loan when deeply negative but not yet bankrupt
  if (capital < 0 && capital > BANKRUPTCY_THRESHOLD && runEconomy.debt === 0) {
    runEconomy.debt += LOAN_AMOUNT;
    runEconomy.loansTaken += 1;
    capital += LOAN_AMOUNT * 0.7;
  }

  // Debt interest
  if (runEconomy.debt > 0) {
    const interest = runEconomy.debt * LOAN_INTEREST_PER_SEC * 0.01;
    runEconomy.debtInterestPerSec = interest;
  }

  // Phase detection
  const income = state.incomePerSecond;
  const overhead = calculateOverheadPerSec(state);

  if (capital <= BANKRUPTCY_THRESHOLD) {
    gamePhase = "bankrupt";
    endingTitle = pickBankruptcyEnding(state);
  } else if (capital < STRUGGLING_THRESHOLD && overhead > income * 0.8) {
    gamePhase = "struggling";
  } else if (gamePhase !== "won" && gamePhase !== "intro") {
    gamePhase = "playing";
  }

  let notifications: GameNotification[] = state.notifications;
  if (adjusted < -20 && reason) {
    const notif: GameNotification = {
      id: `loss_${Date.now()}`,
      title: "Perte",
      message: `${reason} : ${adjusted.toFixed(0)} €`,
      type: "loss",
      timestamp: Date.now(),
    };
    notifications = [notif, ...notifications].slice(0, 20);
  }

  return {
    ...state,
    capital,
    runEconomy,
    stats,
    gamePhase,
    endingTitle,
    notifications,
  };
}

function pickBankruptcyEnding(state: GameState): string {
  if (state.campaign.playstyle === "aggressive") return "Ruiné par l'ambition";
  if (state.runEconomy.debt > 500) return "Écrasé par la dette";
  if (state.globalRisk > 70) return "Victime de ses paris risqués";
  if (state.stats.tradesMade > 30 && state.capital < 0) return "Liquidé par le marché";
  return "Faillite — le rêve s'arrête ici";
}

export function tickRunEconomy(state: GameState, deltaSec: number): GameState {
  if (state.gamePhase === "bankrupt" || state.gamePhase === "intro") return state;

  let s = { ...state };
  const overhead = calculateOverheadPerSec(s);
  s.runEconomy = { ...s.runEconomy, overheadPerSec: overhead };

  // Net burn: overhead minus passive (if passive doesn't cover)
  const passive = s.incomePerSecond;
  const net = passive - overhead;

  if (net < 0) {
    const loss = net * deltaSec;
    s = applyCapitalChange(s, loss, "Charges fixes");
    s.runEconomy.burnStreakSec += deltaSec;
  } else {
    s.runEconomy.burnStreakSec = Math.max(0, s.runEconomy.burnStreakSec - deltaSec);
  }

  // Debt interest drain
  if (s.runEconomy.debt > 0) {
    const interestCost = s.runEconomy.debt * LOAN_INTEREST_PER_SEC * deltaSec;
    s.runEconomy.debt += interestCost * 0.1;
    s = applyCapitalChange(s, -interestCost, "Intérêts dette");
  }

  // Long burn streak → bankruptcy risk
  if (s.runEconomy.burnStreakSec > 45 && s.capital < 50) {
    s = applyCapitalChange(s, -s.capital * 0.05 * deltaSec, "Fuite des liquidités");
  }

  return s;
}

export function tickInvestments(state: GameState, deltaMs: number): GameState {
  let s = { ...state };
  const mod = getPlaystyleMod(s);
  const deltaSec = deltaMs / 1000;

  s.investments = s.investments.map((inv) => {
    const def = INVESTMENTS.find((x) => x.id === inv.id);
    if (!def || inv.amount <= 0) return inv;

    const riskFactor = def.volatility * mod.lossMult;
    const drift = (def.avgReturn / 365 / 24 / 3600) * deltaSec;
    const shock = (Math.random() - 0.52) * riskFactor * deltaSec * 5;
    const change = inv.currentValue * (drift + shock);
    let currentValue = Math.max(0, inv.currentValue + change);

    if (def.risk === "extreme" && Math.random() < 0.0003 * deltaSec * mod.riskMult) {
      const crash = currentValue * (0.3 + Math.random() * 0.3);
      currentValue -= crash;
      s.globalRisk = Math.min(100, s.globalRisk + 5);
      const crashNotif: GameNotification = {
        id: `crash_${Date.now()}`,
        title: "Crash investissement",
        message: `${def.name} perd ${crash.toFixed(0)} € de valeur`,
        type: "danger",
        timestamp: Date.now(),
      };
      s.notifications = [crashNotif, ...s.notifications].slice(0, 20);
    }

    return { ...inv, currentValue };
  });

  return s;
}

export function maybeBusinessFailure(state: GameState): GameState {
  if (state.gamePhase === "bankrupt") return state;
  const mod = getPlaystyleMod(state);
  const riskChance = (state.globalRisk / 100) * 0.0008 * mod.lossMult;

  if (Math.random() > riskChance) return state;

  const owned = state.businesses.filter((b) => b.quantity > 0);
  if (owned.length === 0) return state;

  // Pick highest risk business
  let worst = owned[0];
  let worstRisk = 0;
  for (const bs of owned) {
    const b = BUSINESSES.find((x) => x.id === bs.id);
    if (b && b.risk > worstRisk) {
      worst = bs;
      worstRisk = b.risk;
    }
  }

  let s = { ...state };
  s.businesses = s.businesses
    .map((b) => (b.id === worst.id ? { ...b, quantity: Math.max(0, b.quantity - 1) } : b))
    .filter((b) => b.quantity > 0);
  s.runEconomy.businessFailures += 1;
  s.globalRisk = Math.min(100, s.globalRisk + 3);

  const bDef = BUSINESSES.find((x) => x.id === worst.id);
  const loss = bDef ? bDef.baseCost * 0.3 : 50;
  s = applyCapitalChange(s, -loss, `${bDef?.name ?? "Business"} en faillite`);

  const failNotif: GameNotification = {
    id: `bfail_${Date.now()}`,
    title: "Business en faillite",
    message: `${bDef?.name} — une unité perdue. -${loss.toFixed(0)} €`,
    type: "danger",
    timestamp: Date.now(),
  };
  return { ...s, notifications: [failNotif, ...s.notifications].slice(0, 20) };
}

export function applyMarketPortfolioShock(state: GameState, severity: number): GameState {
  let s = { ...state };
  const mod = getPlaystyleMod(s);

  for (const asset of s.market) {
    if (asset.owned <= 0) continue;
    const loss = asset.price * asset.owned * severity * mod.lossMult * (Math.random() * 0.5 + 0.5);
    if (loss > 0) {
      // Realize partial loss immediately (margin call simulation)
      s = applyCapitalChange(s, -loss * 0.15, `Portefeuille ${asset.id}`);
    }
    asset.price = Math.max(1, asset.price * (1 - severity * 0.5));
  }

  return s;
}

export function emergencySellBusiness(state: GameState, businessId: string): GameState {
  const bs = state.businesses.find((b) => b.id === businessId);
  if (!bs || bs.quantity <= 0) return state;

  const b = BUSINESSES.find((x) => x.id === businessId);
  if (!b) return state;

  const recovery = b.baseCost * bs.quantity * 0.4;
  let s = {
    ...state,
    businesses: state.businesses
      .map((x) => (x.id === businessId ? { ...x, quantity: x.quantity - 1 } : x))
      .filter((x) => x.quantity > 0),
  };
  s = applyCapitalChange(s, recovery, `Vente urgence ${b.name}`);
  return s;
}

export function takeEmergencyLoan(state: GameState): GameState {
  if (state.runEconomy.debt > 0 && state.capital > 50) return state;
  let s = { ...state };
  s.runEconomy.debt += LOAN_AMOUNT;
  s.runEconomy.loansTaken += 1;
  s.globalRisk = Math.min(100, s.globalRisk + 8);
  s = applyCapitalChange(s, LOAN_AMOUNT * 0.85, "Prêt d'urgence");
  return s;
}
