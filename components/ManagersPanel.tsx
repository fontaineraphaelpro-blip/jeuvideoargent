"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { GameState } from "@/types/game";
import { MANAGERS } from "@/lib/gameData";
import { formatMoney } from "@/lib/formatMoney";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
  onHire: (id: string) => void;
}

const rarityStyles: Record<string, string> = {
  common: "border-slate-500/30 text-slate-300",
  rare: "border-blue-500/40 text-blue-300",
  epic: "border-violet-500/40 text-violet-300",
  legendary: "border-empire-gold/50 text-empire-gold",
};

export default function ManagersPanel({ state, onHire }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MANAGERS.map((m, i) => {
        const ms = state.managers.find((x) => x.id === m.id);
        const hired = ms?.hired ?? false;
        const unlocked = state.stats.bestCapital >= m.unlockAt;
        const Icon = getIcon(m.icon, User);

        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className={`glass rounded-xl p-4 border ${rarityStyles[m.rarity]} ${hired ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-white/5 p-2">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{m.name}</h3>
                <span className="text-[10px] uppercase tracking-wider opacity-60">{m.rarity}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">{m.description}</p>
            <p className="text-xs text-emerald-400 mb-3">+{(m.bonus * 100).toFixed(0)}% bonus</p>
            <button
              disabled={hired || !unlocked || state.capital < m.cost}
              onClick={() => onHire(m.id)}
              className="w-full rounded-lg bg-empire-gold/10 border border-empire-gold/30 py-2 text-xs font-semibold hover:bg-empire-gold/20 disabled:opacity-40"
            >
              {hired ? "✓ Recruté" : unlocked ? `Recruter ${formatMoney(m.cost)}` : "🔒 Verrouillé"}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
