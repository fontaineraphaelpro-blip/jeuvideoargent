"use client";

import { motion, AnimatePresence } from "framer-motion";
import { STRATEGIC_DECISIONS } from "@/lib/events";
import type { GameState } from "@/types/game";

interface Props {
  state: GameState;
  onChoice: (decisionId: string, choiceId: string) => void;
}

const rarityBorder: Record<string, string> = {
  common: "border-slate-500/40",
  uncommon: "border-blue-500/50",
  rare: "border-violet-500/50",
  epic: "border-empire-gold/60",
  legendary: "border-yellow-400/70",
};

export default function DecisionModal({ state, onChoice }: Props) {
  const decision = state.activeDecision
    ? STRATEGIC_DECISIONS.find((d) => d.id === state.activeDecision?.decisionId)
    : null;

  return (
    <AnimatePresence>
      {decision && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className={`glass-gold rounded-2xl p-6 max-w-md w-full border-2 ${rarityBorder[decision.rarity]}`}
          >
            <span className="text-[10px] uppercase tracking-widest text-empire-gold">{decision.rarity}</span>
            <h2 className="text-xl font-bold mt-1">{decision.title}</h2>
            <p className="text-sm text-slate-400 mt-2">{decision.description}</p>
            <div className="space-y-2 mt-4">
              {decision.choices.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChoice(decision.id, c.id)}
                  className="w-full text-left rounded-xl bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors"
                >
                  <p className="font-semibold text-sm">{c.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
