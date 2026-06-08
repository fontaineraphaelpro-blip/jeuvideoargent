"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useGameLoop } from "@/hooks/useGameLoop";
import { calculateClickIncome } from "@/lib/gameLogic";
import { getDeskTier, DESK_THEMES } from "@/lib/deskThemes";
import DeskEnvironment from "./DeskEnvironment";
import DesktopOS from "./DesktopOS";
import FloatingMoney from "./FloatingMoney";
import GoldenRushOverlay from "./GoldenRushOverlay";
import LevelUpOverlay from "./LevelUpOverlay";
import MilestoneOverlay from "./MilestoneOverlay";
import Confetti from "./Confetti";
import Particles from "./Particles";
import DecisionModal from "./DecisionModal";
import IntroModal from "./IntroModal";
import BankruptcyModal from "./BankruptcyModal";

export default function DeskScene() {
  const game = useGameState();
  const {
    state,
    dispatch,
    loaded,
    floatingMoney,
    handleClick,
    actions,
    showGoldenRush,
    showLevelUp,
    showMilestone,
    showConfetti,
    showParticles,
  } = game;

  const [typing, setTyping] = useState(false);
  const [clicking, setClicking] = useState(false);

  useGameLoop(loaded, dispatch, state.goldenRushMeter);

  const theme = DESK_THEMES[getDeskTier(state.capital)];
  const clickIncome = calculateClickIncome(state);

  const onIncomeClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setClicking(true);
      setTyping(true);
      handleClick(rect.left + rect.width / 2, rect.top);
      setTimeout(() => setClicking(false), 150);
      setTimeout(() => setTyping(false), 400);
    },
    [handleClick]
  );

  const claimHandler = (id: string) => {
    if (id.startsWith("daily_")) actions.claimDaily(id);
    else actions.claimMission(id);
  };

  if (!loaded) {
    return (
      <div className="desk-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Crown className="h-10 w-10 text-empire-gold" />
        </motion.div>
        <p>Chargement de ton bureau...</p>
      </div>
    );
  }

  return (
    <div className="desk-game-root">
      <FloatingMoney items={floatingMoney} />
      <GoldenRushOverlay active={showGoldenRush} endTime={state.goldenRushEndTime} />
      <LevelUpOverlay show={showLevelUp} level={state.level} />
      <MilestoneOverlay title={showMilestone} />
      <Confetti active={showConfetti} />
      <Particles active={showParticles} />
      <DecisionModal state={state} onChoice={actions.decisionChoice} />
      {state.gamePhase === "intro" && (
        <IntroModal onChoose={actions.setPlaystyle} />
      )}
      {state.gamePhase === "bankrupt" && (
        <BankruptcyModal state={state} onRestart={actions.restartRun} />
      )}

      <DeskEnvironment
        theme={theme}
        state={state}
        goldenRush={showGoldenRush}
        typing={typing}
        clicking={clicking}
      >
        <DesktopOS
          state={state}
          clickIncome={clickIncome}
          onIncomeClick={onIncomeClick}
          onClaim={claimHandler}
          actions={actions}
        />
      </DeskEnvironment>
    </div>
  );
}
