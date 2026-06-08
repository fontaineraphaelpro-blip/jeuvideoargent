export type BusinessCategory =
  | "finance"
  | "tech"
  | "retail"
  | "media"
  | "real_estate"
  | "industry"
  | "space";

export type MissionCategory =
  | "beginner"
  | "growth"
  | "trading"
  | "business"
  | "real_estate"
  | "startup"
  | "prestige"
  | "risk"
  | "combo"
  | "daily"
  | "challenge";

export type EventType = "positive" | "negative" | "neutral" | "choice";
export type EventRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ManagerRarity = "common" | "rare" | "epic" | "legendary";
export type InvestmentRisk = "low" | "medium" | "high" | "extreme";
export type TabId =
  | "dashboard"
  | "business"
  | "invest"
  | "market"
  | "missions"
  | "upgrades"
  | "managers"
  | "achievements"
  | "stats"
  | "prestige"
  | "settings";

export interface Business {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  baseCost: number;
  baseIncome: number;
  risk: number;
  icon: string;
  unlockAt: number;
  multiplier: number;
}

export interface BusinessState {
  id: string;
  quantity: number;
  level: number;
}

export interface Investment {
  id: string;
  name: string;
  description: string;
  avgReturn: number;
  volatility: number;
  risk: InvestmentRisk;
  duration: number;
  icon: string;
  unlockAt: number;
}

export interface InvestmentState {
  id: string;
  amount: number;
  entryPrice: number;
  currentValue: number;
  history: number[];
}

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  basePrice: number;
  volatility: number;
  trend: number;
  icon: string;
}

export interface MarketAssetState {
  id: string;
  price: number;
  priceHistory: number[];
  owned: number;
  avgBuyPrice: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  target: number;
  metric: string;
  reward: number;
  xpReward: number;
  difficulty: number;
  icon: string;
  unlockAt?: number;
  timeLimit?: number;
}

export interface MissionState {
  id: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  effectValue: number;
  category: string;
  icon: string;
  unlockAt: number;
  maxLevel: number;
}

export interface UpgradeState {
  id: string;
  level: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  rarity: EventRarity;
  duration: number;
  effects: EventEffect;
  choices?: EventChoice[];
}

export interface EventEffect {
  incomeMultiplier?: number;
  clickMultiplier?: number;
  costReduction?: number;
  marketVolatility?: number;
  riskChange?: number;
  cashBonus?: number;
  assetImpact?: { assetId: string; change: number };
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: EventEffect;
}

export interface ActiveEvent {
  eventId: string;
  startTime: number;
  endTime: number;
  resolved: boolean;
  choiceId?: string;
}

export interface Milestone {
  id: string;
  amount: number;
  title: string;
  reward: number;
  bonus: number;
  icon: string;
}

export interface Manager {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  cost: number;
  bonus: number;
  rarity: ManagerRarity;
  icon: string;
  unlockAt: number;
}

export interface ManagerState {
  id: string;
  hired: boolean;
}

export interface Synergy {
  id: string;
  name: string;
  description: string;
  businessIds: string[];
  bonus: number;
  icon: string;
}

export interface DailyObjective {
  id: string;
  title: string;
  description: string;
  metric: string;
  target: number;
  progress: number;
  reward: number;
  rewardType: "cash" | "xp" | "goldenRush";
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric: string;
  target: number;
  icon: string;
  bonus: number;
  secret?: boolean;
}

export interface AchievementState {
  id: string;
  progress: number;
  unlocked: boolean;
}

export interface StrategicDecision {
  id: string;
  title: string;
  description: string;
  choices: StrategicChoice[];
  rarity: EventRarity;
}

export interface StrategicChoice {
  id: string;
  label: string;
  description: string;
  effects: {
    cash?: number;
    reputation?: number;
    risk?: number;
    incomeBonus?: number;
    duration?: number;
  };
}

export interface ActiveDecision {
  decisionId: string;
  expiresAt: number;
}

export interface GameStats {
  totalEarned: number;
  totalSpent: number;
  totalClicks: number;
  missionsCompleted: number;
  bestCapital: number;
  playTimeSeconds: number;
  prestigeCount: number;
  biggestGain: number;
  biggestLoss: number;
  businessesBought: number;
  investmentsMade: number;
  tradesMade: number;
  eventsExperienced: number;
  goldenRushesTriggered: number;
  achievementsUnlocked: number;
  roiByCategory: Record<BusinessCategory, number>;
}

export interface PrestigeState {
  points: number;
  totalResets: number;
}

export interface FloatingMoneyItem {
  id: string;
  amount: number;
  x: number;
  y: number;
}

export interface GameNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "milestone" | "levelup" | "achievement";
  timestamp: number;
}

export interface CapitalHistoryPoint {
  time: number;
  value: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  compactMode: boolean;
}

export interface GameState {
  capital: number;
  clickPower: number;
  clickLevel: number;
  level: number;
  xp: number;
  reputation: number;
  globalRisk: number;
  combo: number;
  comboMultiplier: number;
  lastClickTime: number;
  goldenRushMeter: number;
  goldenRushActive: boolean;
  goldenRushEndTime: number;
  businesses: BusinessState[];
  upgrades: UpgradeState[];
  investments: InvestmentState[];
  market: MarketAssetState[];
  missions: MissionState[];
  managers: ManagerState[];
  achievements: AchievementState[];
  dailyObjectives: DailyObjective[];
  dailySeed: string;
  activeEvents: ActiveEvent[];
  activeDecision: ActiveDecision | null;
  completedMilestones: string[];
  prestige: PrestigeState;
  stats: GameStats;
  capitalHistory: CapitalHistoryPoint[];
  notifications: GameNotification[];
  settings: GameSettings;
  wealthTitle: string;
  incomePerSecond: number;
  lastSaveTime: number;
  lastTickTime: number;
  sessionStartTime: number;
  passiveIncomeCache: number;
  clickIncomeCache: number;
  investmentIncomeCache: number;
  temporaryBonuses: {
    incomeMultiplier: number;
    clickMultiplier: number;
    costReduction: number;
    expiresAt: number;
  }[];
}
