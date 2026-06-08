"use client";

import type { GameState } from "@/types/game";
import { BUSINESSES } from "@/lib/gameData";
import { getBusinessCost, getCategoryBonus, getCostReduction, getActiveSynergies, isBusinessUnlocked } from "@/lib/gameLogic";
import BusinessCard from "./BusinessCard";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
  onUpgrade: (id: string) => void;
}

export default function BusinessShop({ state, onBuy, onUpgrade }: Props) {
  const costReduction = getCostReduction(state);
  const synergies = getActiveSynergies(state.businesses);

  return (
    <div className="space-y-4">
      {synergies.length > 0 && (
        <div className="glass-gold rounded-xl p-3">
          <h3 className="text-sm font-semibold text-empire-gold mb-2">Synergies actives</h3>
          <div className="flex flex-wrap gap-2">
            {synergies.map((s) => {
              const Icon = getIcon(s.icon, Link);
              return (
                <motion.div
                  key={s.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 rounded-full bg-empire-gold/10 border border-empire-gold/30 px-3 py-1 text-xs"
                >
                  <Icon className="h-3 w-3 text-empire-gold" />
                  <span>{s.name}</span>
                  <span className="text-emerald-400">+{(s.bonus * 100).toFixed(0)}%</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESSES.map((b, i) => {
          const bs = state.businesses.find((x) => x.id === b.id);
          const unlocked = isBusinessUnlocked(state, b.unlockAt);
          const cost = getBusinessCost(b.baseCost, bs?.quantity ?? 0, costReduction);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <BusinessCard
                business={b}
                state={bs}
                costReduction={costReduction}
                capital={state.capital}
                unlocked={unlocked}
                affordable={state.capital >= cost}
                categoryBonus={getCategoryBonus(state, b.category)}
                onBuy={() => onBuy(b.id)}
                onUpgrade={() => onUpgrade(b.id)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
