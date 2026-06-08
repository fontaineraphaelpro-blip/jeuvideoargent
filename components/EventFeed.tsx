"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "@/types/game";
import { GAME_EVENTS } from "@/lib/events";

interface Props {
  state: GameState;
  onChoice?: (eventId: string, choiceId: string) => void;
}

const rarityGlow: Record<string, string> = {
  common: "border-slate-500/30",
  uncommon: "border-blue-500/40",
  rare: "border-violet-500/50",
  epic: "border-empire-gold/50",
  legendary: "border-yellow-400/60 shadow-lg shadow-yellow-500/20",
};

export default function EventFeed({ state, onChoice }: Props) {
  const recentNotifs = state.notifications.slice(0, 5);

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {recentNotifs.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`glass rounded-lg px-3 py-2 text-xs border ${
              n.type === "milestone" ? "border-empire-gold/40" :
              n.type === "success" ? "border-emerald-500/30" :
              n.type === "warning" ? "border-red-500/30" : "border-white/10"
            }`}
          >
            <span className="font-semibold">{n.title}</span>
            <span className="text-slate-400 ml-2">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {state.activeEvents.map((ae) => {
        const ev = GAME_EVENTS.find((e) => e.id === ae.eventId);
        if (!ev?.choices || ae.resolved) return null;
        return (
          <motion.div
            key={ae.eventId}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`glass-gold rounded-xl p-4 border ${rarityGlow[ev.rarity]}`}
          >
            <h4 className="font-semibold text-sm text-empire-gold">{ev.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{ev.description}</p>
            <div className="flex gap-2 mt-3">
              {ev.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onChoice?.(ev.id, c.id)}
                  className="flex-1 rounded-lg bg-empire-gold/10 border border-empire-gold/30 py-2 text-xs font-semibold hover:bg-empire-gold/20"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
