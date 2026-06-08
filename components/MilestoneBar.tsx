"use client";

import { motion } from "framer-motion";
import type { GameState } from "@/types/game";
import { MILESTONES } from "@/lib/gameData";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  state: GameState;
}

export default function MilestoneBar({ state }: Props) {
  const next = MILESTONES.find((m) => !state.completedMilestones.includes(m.id));
  if (!next) return null;

  const prev = MILESTONES[MILESTONES.indexOf(next) - 1];
  const prevAmount = prev?.amount ?? 0;
  const progress = Math.min((state.capital - prevAmount) / (next.amount - prevAmount), 1);

  return (
    <div className="glass rounded-xl p-3">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-400">Prochain: <span className="text-empire-gold font-semibold">{next.title}</span></span>
        <span className="text-slate-500">{formatMoney(next.amount)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-empire-gold via-yellow-300 to-empire-gold rounded-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
