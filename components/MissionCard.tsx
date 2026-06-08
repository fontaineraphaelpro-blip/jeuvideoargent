"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { Mission, MissionState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";
import { getIcon } from "@/lib/icons";

interface Props {
  mission: Mission;
  state: MissionState;
  onClaim: () => void;
}

const categoryColors: Record<string, string> = {
  beginner: "bg-blue-500/20 text-blue-300",
  growth: "bg-emerald-500/20 text-emerald-300",
  trading: "bg-violet-500/20 text-violet-300",
  business: "bg-amber-500/20 text-amber-300",
  combo: "bg-orange-500/20 text-orange-300",
  prestige: "bg-yellow-500/20 text-yellow-300",
  challenge: "bg-red-500/20 text-red-300",
  daily: "bg-cyan-500/20 text-cyan-300",
};

export default function MissionCard({ mission, state, onClaim }: Props) {
  const Icon = getIcon(mission.icon, Target);
  const progress = Math.min(state.progress / mission.target, 1);
  const done = state.completed;
  const claimed = state.claimed;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      animate={done && !claimed ? { boxShadow: ["0 0 0px rgba(245,197,66,0)", "0 0 20px rgba(245,197,66,0.4)", "0 0 0px rgba(245,197,66,0)"] } : {}}
      transition={{ repeat: done && !claimed ? Infinity : 0, duration: 2 }}
      className={`glass rounded-xl p-4 ${done && !claimed ? "border border-empire-gold/40" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${done ? "bg-empire-gold/20" : "bg-white/5"}`}>
          <Icon className={`h-5 w-5 ${done ? "text-empire-gold" : "text-slate-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{mission.title}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColors[mission.category] ?? "bg-white/10"}`}>
              {mission.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-2">{mission.description}</p>

          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-empire-gold to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {state.progress}/{mission.target}
            </span>
            <span className="text-xs text-emerald-400">{formatMoney(mission.reward)}</span>
          </div>

          {done && !claimed && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              className="mt-2 w-full rounded-lg bg-empire-gold/20 text-empire-gold border border-empire-gold/40 py-1.5 text-xs font-bold hover:bg-empire-gold/30"
            >
              ✨ Réclamer la récompense
            </motion.button>
          )}
          {claimed && (
            <p className="mt-2 text-xs text-emerald-400 text-center">✓ Complétée</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
