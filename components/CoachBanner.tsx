"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";
import type { GameState, TabId } from "@/types/game";
import { getNextCoachStep } from "@/lib/coach";
import { APP_LABELS } from "@/lib/progression";

interface Props {
  state: GameState;
  onOpenApp: (app: TabId) => void;
}

export default function CoachBanner({ state, onOpenApp }: Props) {
  if (state.gamePhase === "intro" || state.gamePhase === "bankrupt") return null;

  const step = getNextCoachStep(state);

  return (
    <motion.div
      className="coach-banner"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      key={step.title}
    >
      <div className="coach-banner-icon">
        <Lightbulb className="h-4 w-4" />
      </div>
      <div className="coach-banner-content">
        <p className="coach-banner-title">{step.title}</p>
        <p className="coach-banner-desc">{step.description}</p>
        <p className="coach-banner-action">{step.action}</p>
      </div>
      <button
        className="coach-banner-btn"
        onClick={() => onOpenApp(step.app)}
      >
        {APP_LABELS[step.app]}
        <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
