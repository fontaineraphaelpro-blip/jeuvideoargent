"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { GameState } from "@/types/game";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
}

export default function AchievementsPanel({ state }: Props) {
  const unlocked = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="glass-gold rounded-xl p-3 text-center">
        <p className="text-sm">
          <span className="text-empire-gold font-bold">{unlocked}</span>
          <span className="text-slate-400"> / {ACHIEVEMENTS.length} achievements</span>
        </p>
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a, i) => {
          const as = state.achievements.find((x) => x.id === a.id);
          const isUnlocked = as?.unlocked ?? false;
          const isSecret = a.secret && !isUnlocked;
          const Icon = getIcon(a.icon, Award);

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
              className={`glass rounded-xl p-3 text-center ${
                isUnlocked ? "border border-empire-gold/30 glow-gold" : "opacity-50"
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-1 ${isUnlocked ? "text-empire-gold" : "text-slate-600"}`} />
              <h4 className="text-xs font-semibold truncate">
                {isSecret ? "???" : a.title}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                {isSecret ? "Achievement secret" : a.description}
              </p>
              {isUnlocked && (
                <span className="text-[10px] text-emerald-400">+{(a.bonus * 100).toFixed(0)}% permanent</span>
              )}
              {!isUnlocked && !isSecret && as && (
                <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-empire-gold/50 rounded-full"
                    style={{ width: `${Math.min(as.progress / a.target, 1) * 100}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
