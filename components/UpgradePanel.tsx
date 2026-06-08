"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import type { GameState } from "@/types/game";
import { UPGRADES } from "@/lib/gameData";
import { getUpgradeCost } from "@/lib/gameLogic";
import { formatMoney } from "@/lib/formatMoney";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
}

export default function UpgradePanel({ state, onBuy }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {UPGRADES.map((u, i) => {
        const us = state.upgrades.find((x) => x.id === u.id);
        const level = us?.level ?? 0;
        const maxed = level >= u.maxLevel;
        const cost = getUpgradeCost(u, level);
        const unlocked = state.stats.bestCapital >= u.unlockAt;
        const Icon = getIcon(u.icon, ArrowUp);

        return (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ y: -2 }}
            className={`glass rounded-xl p-4 ${!unlocked ? "opacity-40" : ""}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-empire-violet" />
              <h3 className="font-semibold text-sm">{u.name}</h3>
              <span className="ml-auto text-xs text-slate-500">{level}/{u.maxLevel}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{u.description}</p>
            <button
              disabled={maxed || !unlocked || state.capital < cost}
              onClick={() => onBuy(u.id)}
              className="w-full rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 py-2 text-xs font-semibold hover:bg-violet-600/40 disabled:opacity-40"
            >
              {maxed ? "Max" : unlocked ? `Améliorer ${formatMoney(cost)}` : "🔒 Verrouillé"}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
