"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, PieChart, LineChart, Target, ArrowUpCircle,
  Users, Award, BarChart3, Crown, Settings, TrendingUp, Shield, Star, Zap,
} from "lucide-react";
import { useState } from "react";
import type { TabId } from "@/types/game";
import { useGameState } from "@/hooks/useGameState";
import { useGameLoop } from "@/hooks/useGameLoop";
import { calculateClickIncome, getXpForLevel } from "@/lib/gameLogic";
import { formatMoney } from "@/lib/formatMoney";
import { GOLDEN_RUSH_METER_MAX } from "@/lib/gameData";
import CapitalCounter from "./CapitalCounter";
import StatCard from "./StatCard";
import IncomeButton from "./IncomeButton";
import MilestoneBar from "./MilestoneBar";
import CapitalChart from "./CapitalChart";
import EventFeed from "./EventFeed";
import BusinessShop from "./BusinessShop";
import InvestmentPanel from "./InvestmentPanel";
import MarketPanel from "./MarketPanel";
import MissionPanel from "./MissionPanel";
import UpgradePanel from "./UpgradePanel";
import ManagersPanel from "./ManagersPanel";
import AchievementsPanel from "./AchievementsPanel";
import StatsPanel from "./StatsPanel";
import PrestigePanel from "./PrestigePanel";
import SettingsPanel from "./SettingsPanel";
import Tabs, { type TabItem } from "./Tabs";
import FloatingMoney from "./FloatingMoney";
import GoldenRushOverlay from "./GoldenRushOverlay";
import LevelUpOverlay from "./LevelUpOverlay";
import Confetti from "./Confetti";
import Particles from "./Particles";
import DecisionModal from "./DecisionModal";
import NotificationCenter from "./NotificationCenter";
import MilestoneOverlay from "./MilestoneOverlay";

const TABS: TabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "business", label: "Business", icon: Building2 },
  { id: "invest", label: "Investir", icon: PieChart },
  { id: "market", label: "Marché", icon: LineChart },
  { id: "missions", label: "Missions", icon: Target },
  { id: "upgrades", label: "Upgrades", icon: ArrowUpCircle },
  { id: "managers", label: "Managers", icon: Users },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "prestige", label: "Prestige", icon: Crown },
  { id: "settings", label: "Réglages", icon: Settings },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const game = useGameState();
  const { state, dispatch, loaded, floatingMoney, handleClick, actions, incomePulse, showGoldenRush, showLevelUp, showMilestone, showConfetti, showParticles } = game;

  useGameLoop(loaded, dispatch, state.goldenRushMeter);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Crown className="h-8 w-8 text-empire-gold" />
        </motion.div>
      </div>
    );
  }

  const clickIncome = calculateClickIncome(state);
  const xpNeeded = getXpForLevel(state.level);
  const compact = state.settings.compactMode;

  const onIncomeClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    handleClick(rect.left + rect.width / 2, rect.top);
  };

  const claimHandler = (id: string) => {
    if (id.startsWith("daily_")) actions.claimDaily(id);
    else actions.claimMission(id);
  };

  return (
    <div className={`relative z-10 min-h-screen ${compact ? "text-sm" : ""}`}>
      <FloatingMoney items={floatingMoney} />
      <GoldenRushOverlay active={showGoldenRush} endTime={state.goldenRushEndTime} />
      <LevelUpOverlay show={showLevelUp} level={state.level} />
      <MilestoneOverlay title={showMilestone} />
      <Confetti active={showConfetti} />
      <Particles active={showParticles} />
      <DecisionModal state={state} onChoice={actions.decisionChoice} />
      <NotificationCenter notifications={state.notifications} />

      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-white/5">
        <div className={`max-w-7xl mx-auto px-4 ${compact ? "py-2" : "py-3"}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-empire-gold" />
              <h1 className="font-bold text-lg hidden sm:block">Money Empire</h1>
            </div>
            <div className="flex-1 text-center">
              <CapitalCounter value={state.capital} size={compact ? "sm" : "lg"} />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-empire-gold hidden md:inline">{state.wealthTitle}</span>
              <span className="text-emerald-400">Nv.{state.level}</span>
            </div>
          </div>

          <div className={`grid gap-2 mt-2 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"}`}>
            <StatCard label="Revenu/sec" value={formatMoney(state.incomePerSecond) + "/s"} icon={TrendingUp} color="text-emerald-400" pulse={incomePulse} compact={compact} />
            <StatCard label="Par clic" value={formatMoney(clickIncome)} icon={Zap} color="text-yellow-400" compact={compact} />
            <StatCard label="Risque" value={`${state.globalRisk}%`} icon={Shield} color="text-orange-400" compact={compact} />
            <StatCard label="Réputation" value={String(state.reputation)} icon={Star} color="text-violet-400" compact={compact} />
            <StatCard label="Prestige" value={`+${state.prestige.points * 10}%`} icon={Crown} color="text-empire-gold" compact={compact} />
            <StatCard label="XP" value={`${state.xp}/${xpNeeded}`} icon={ArrowUpCircle} color="text-blue-400" compact={compact} />
          </div>

          {/* Golden Rush meter */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Golden Rush</span>
              <span>{Math.floor(state.goldenRushMeter)}/{GOLDEN_RUSH_METER_MAX}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full"
                animate={{ width: `${(state.goldenRushMeter / GOLDEN_RUSH_METER_MAX) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-3">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} compact={compact} />
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-3"}`}>
                <div className={`space-y-4 ${compact ? "" : "lg:col-span-2"}`}>
                  <div className="glass rounded-2xl p-6 flex flex-col items-center">
                    <IncomeButton
                      clickIncome={clickIncome}
                      combo={state.combo}
                      comboMultiplier={state.comboMultiplier}
                      onClick={onIncomeClick}
                      goldenRush={state.goldenRushActive}
                    />
                  </div>
                  <MilestoneBar state={state} />
                  <CapitalChart state={state} compact={compact} />
                </div>
                <div className="space-y-4">
                  <EventFeed state={state} onChoice={actions.eventChoice} />
                </div>
              </div>
            )}
            {activeTab === "business" && <BusinessShop state={state} onBuy={actions.buyBusiness} onUpgrade={actions.upgradeBusiness} />}
            {activeTab === "invest" && <InvestmentPanel state={state} onInvest={actions.invest} onWithdraw={actions.withdraw} />}
            {activeTab === "market" && <MarketPanel state={state} onBuy={actions.buyStock} onSell={actions.sellStock} />}
            {activeTab === "missions" && <MissionPanel state={state} onClaim={claimHandler} />}
            {activeTab === "upgrades" && <UpgradePanel state={state} onBuy={actions.buyUpgrade} />}
            {activeTab === "managers" && <ManagersPanel state={state} onHire={actions.hireManager} />}
            {activeTab === "achievements" && <AchievementsPanel state={state} />}
            {activeTab === "stats" && <StatsPanel state={state} />}
            {activeTab === "prestige" && <PrestigePanel state={state} onPrestige={actions.prestige} />}
            {activeTab === "settings" && (
              <SettingsPanel
                soundEnabled={state.settings.soundEnabled}
                compactMode={state.settings.compactMode}
                onToggleSound={actions.toggleSound}
                onToggleCompact={actions.toggleCompact}
                onSave={actions.manualSave}
                onReset={actions.reset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 inset-x-0 glass border-t border-white/5 py-2 text-center text-[10px] text-slate-600">
        Simulation fictive. Ceci n&apos;est pas un conseil financier.
      </footer>
    </div>
  );
}
