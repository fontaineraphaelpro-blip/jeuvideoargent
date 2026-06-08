"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, PieChart, LineChart, Target, ArrowUpCircle,
  Users, Award, BarChart3, Crown, Settings, Zap, X, Minus, Mail, Wifi,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import type { GameState, TabId } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";
import { GOLDEN_RUSH_METER_MAX } from "@/lib/gameData";
import CapitalCounter from "./CapitalCounter";
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

interface AppDef {
  id: TabId;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

const APPS: AppDef[] = [
  { id: "dashboard", name: "CashFlow", icon: LayoutDashboard, color: "#10b981", description: "Générer du revenu actif" },
  { id: "business", name: "EmpireBiz", icon: Building2, color: "#f5c542", description: "Acheter des business" },
  { id: "market", name: "TradeX Pro", icon: LineChart, color: "#3b82f6", description: "Bourse fictive" },
  { id: "invest", name: "Invest+", icon: PieChart, color: "#8b5cf6", description: "Placements" },
  { id: "missions", name: "MissionHQ", icon: Target, color: "#f97316", description: "Objectifs & missions" },
  { id: "upgrades", name: "Optimizer", icon: ArrowUpCircle, color: "#06b6d4", description: "Améliorations" },
  { id: "managers", name: "HR Desk", icon: Users, color: "#ec4899", description: "Recruter des managers" },
  { id: "achievements", name: "Trophées", icon: Award, color: "#eab308", description: "Succès débloqués" },
  { id: "stats", name: "Analytics", icon: BarChart3, color: "#64748b", description: "Statistiques" },
  { id: "prestige", name: "Prestige", icon: Crown, color: "#f5c542", description: "Reset & bonus" },
  { id: "settings", name: "Paramètres", icon: Settings, color: "#94a3b8", description: "Réglages du jeu" },
];

interface Props {
  state: GameState;
  clickIncome: number;
  onIncomeClick: (e: React.MouseEvent) => void;
  onClaim: (id: string) => void;
  actions: {
    buyBusiness: (id: string) => void;
    upgradeBusiness: (id: string) => void;
    buyUpgrade: (id: string) => void;
    invest: (id: string, amount: number) => void;
    withdraw: (id: string) => void;
    buyStock: (id: string, qty: number) => void;
    sellStock: (id: string, qty: number) => void;
    hireManager: (id: string) => void;
    prestige: () => void;
    toggleSound: () => void;
    toggleCompact: () => void;
    manualSave: () => void;
    reset: () => void;
    eventChoice: (eventId: string, choiceId: string) => void;
  };
}

export default function DesktopOS({ state, clickIncome, onIncomeClick, onClaim, actions }: Props) {
  const [openApp, setOpenApp] = useState<TabId | null>("dashboard");
  const [minimized, setMinimized] = useState<Set<TabId>>(new Set());

  const openWindow = (id: TabId) => {
    setMinimized((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setOpenApp(id);
  };

  const closeWindow = () => setOpenApp(null);
  const minimizeWindow = () => {
    if (openApp) setMinimized((prev) => new Set(prev).add(openApp));
    setOpenApp(null);
  };

  const currentApp = APPS.find((a) => a.id === openApp);

  const renderAppContent = (id: TabId) => {
    switch (id) {
      case "dashboard":
        return (
          <div className="os-app-content os-app-content--cashflow">
            <div className="os-cashflow-header">
              <CapitalCounter value={state.capital} size="sm" />
              <div className="os-cashflow-stats">
                <span className="text-emerald-400">{formatMoney(state.incomePerSecond)}/s</span>
                <span className="text-yellow-400">{state.wealthTitle}</span>
              </div>
            </div>
            <IncomeButton
              clickIncome={clickIncome}
              combo={state.combo}
              comboMultiplier={state.comboMultiplier}
              onClick={onIncomeClick}
              goldenRush={state.goldenRushActive}
              compact
            />
            <MilestoneBar state={state} />
            <CapitalChart state={state} compact />
            <EventFeed state={state} onChoice={actions.eventChoice} />
          </div>
        );
      case "business":
        return <BusinessShop state={state} onBuy={actions.buyBusiness} onUpgrade={actions.upgradeBusiness} />;
      case "invest":
        return <InvestmentPanel state={state} onInvest={actions.invest} onWithdraw={actions.withdraw} />;
      case "market":
        return <MarketPanel state={state} onBuy={actions.buyStock} onSell={actions.sellStock} />;
      case "missions":
        return <MissionPanel state={state} onClaim={onClaim} />;
      case "upgrades":
        return <UpgradePanel state={state} onBuy={actions.buyUpgrade} />;
      case "managers":
        return <ManagersPanel state={state} onHire={actions.hireManager} />;
      case "achievements":
        return <AchievementsPanel state={state} />;
      case "stats":
        return <StatsPanel state={state} />;
      case "prestige":
        return <PrestigePanel state={state} onPrestige={actions.prestige} />;
      case "settings":
        return (
          <SettingsPanel
            soundEnabled={state.settings.soundEnabled}
            compactMode={state.settings.compactMode}
            onToggleSound={actions.toggleSound}
            onToggleCompact={actions.toggleCompact}
            onSave={actions.manualSave}
            onReset={actions.reset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="desktop-os">
      {/* Wallpaper */}
      <div className="desktop-wallpaper" />

      {/* Desktop icons */}
      <div className="desktop-icons">
        {APPS.map((app) => {
          const Icon = app.icon;
          const isOpen = openApp === app.id;
          const isMin = minimized.has(app.id);
          return (
            <motion.button
              key={app.id}
              className={`desktop-icon ${isOpen ? "desktop-icon--active" : ""} ${isMin ? "desktop-icon--minimized" : ""}`}
              onDoubleClick={() => openWindow(app.id)}
              onClick={() => openWindow(app.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={app.description}
            >
              <div className="desktop-icon-img" style={{ backgroundColor: app.color + "33", borderColor: app.color + "66" }}>
                <Icon className="h-5 w-5" color={app.color} />
              </div>
              <span>{app.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* App window */}
      <AnimatePresence>
        {openApp && currentApp && !minimized.has(openApp) && (
          <motion.div
            key={openApp}
            className="os-window"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="os-window-titlebar" style={{ borderTopColor: currentApp.color }}>
              <div className="os-window-title">
                <currentApp.icon className="h-3.5 w-3.5" color={currentApp.color} />
                <span>{currentApp.name}</span>
                <span className="os-window-sub">— Money Empire OS</span>
              </div>
              <div className="os-window-controls">
                <button onClick={minimizeWindow} className="os-ctrl os-ctrl--min"><Minus className="h-3 w-3" /></button>
                <button onClick={closeWindow} className="os-ctrl os-ctrl--close"><X className="h-3 w-3" /></button>
              </div>
            </div>
            <div className="os-window-body scrollbar-thin">
              {renderAppContent(openApp)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div className="os-taskbar">
        <div className="os-taskbar-start">
          <div className="os-start-btn">
            <Zap className="h-4 w-4 text-empire-gold" />
            <span>ME OS</span>
          </div>
          <div className="os-taskbar-apps">
            {APPS.filter((a) => openApp === a.id || minimized.has(a.id)).map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => openWindow(app.id)}
                  className={`os-taskbar-app ${openApp === app.id ? "os-taskbar-app--active" : ""}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="os-taskbar-center">
          <div className="os-capital-pill">
            <span className="text-empire-gold font-bold">{formatMoney(state.capital)}</span>
            <span className="text-emerald-400 text-[10px]">+{formatMoney(state.incomePerSecond)}/s</span>
          </div>
          <div className="os-golden-meter">
            <div
              className="os-golden-meter-fill"
              style={{ width: `${(state.goldenRushMeter / GOLDEN_RUSH_METER_MAX) * 100}%` }}
            />
          </div>
        </div>

        <div className="os-taskbar-tray">
          <Wifi className="h-3.5 w-3.5 text-slate-400" />
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          <span className="os-tray-level">Nv.{state.level}</span>
          <span className="os-tray-clock">22:34</span>
        </div>
      </div>

      <p className="os-disclaimer">Simulation fictive — pas un conseil financier</p>
    </div>
  );
}
