"use client";

import { motion } from "framer-motion";
import { Crown, RefreshCw, Sparkles } from "lucide-react";
import type { GameState } from "@/types/game";
import { canPrestige } from "@/lib/gameLogic";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  state: GameState;
  onPrestige: () => void;
}

export default function PrestigePanel({ state, onPrestige }: Props) {
  const available = canPrestige(state);
  const points = Math.floor(Math.log10(Math.max(state.capital, 1) / 1_000_000_000) + 1);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-gold rounded-2xl p-8 text-center border border-empire-gold/30"
      >
        <Crown className="h-12 w-12 text-empire-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gradient-gold">Prestige Investisseur</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Reset votre empire pour gagner des points de Réputation Investisseur.
          Chaque point donne +10% revenus globaux permanents.
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-slate-500">Points actuels</p>
            <p className="text-2xl font-bold text-empire-gold">{state.prestige.points}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-slate-500">Bonus revenus</p>
            <p className="text-2xl font-bold text-emerald-400">+{state.prestige.points * 10}%</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-slate-500">Resets</p>
            <p className="text-2xl font-bold text-violet-400">{state.prestige.totalResets}</p>
          </div>
        </div>

        {available ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrestige}
            className="mt-6 rounded-xl bg-gradient-to-r from-empire-gold to-yellow-500 text-black font-bold px-8 py-3 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            Prestige (+{points} points)
          </motion.button>
        ) : (
          <div className="mt-6 text-sm text-slate-500">
            <Sparkles className="h-5 w-5 inline mr-1 text-empire-gold" />
            Atteignez {formatMoney(1_000_000_000)} pour débloquer le prestige
          </div>
        )}
      </motion.div>

      <p className="text-xs text-slate-600 text-center italic">
        Le prestige est entièrement optionnel. Votre progression actuelle est conservée si vous ne resettez pas.
      </p>
    </div>
  );
}
