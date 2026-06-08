"use client";

import { motion } from "framer-motion";
import type { GameState } from "@/types/game";
import { MISSIONS } from "@/lib/missions";
import MissionCard from "./MissionCard";

interface Props {
  state: GameState;
  onClaim: (id: string) => void;
}

export default function MissionPanel({ state, onClaim }: Props) {
  const active = MISSIONS.filter((m) => {
    const ms = state.missions.find((x) => x.id === m.id);
    return ms && !ms.claimed;
  });

  const completed = active.filter((m) => {
    const ms = state.missions.find((x) => x.id === m.id);
    return ms?.completed;
  });

  return (
    <div className="space-y-4">
      {completed.length > 0 && (
        <div className="glass-gold rounded-xl p-3 text-center">
          <p className="text-sm text-empire-gold font-semibold">
            🎯 {completed.length} mission(s) à réclamer !
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {active.map((m, i) => {
          const ms = state.missions.find((x) => x.id === m.id)!;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <MissionCard mission={m} state={ms} onClaim={() => onClaim(m.id)} />
            </motion.div>
          );
        })}
      </div>

      {state.dailyObjectives.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-empire-gold mb-2">Objectifs quotidiens</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {state.dailyObjectives.map((d) => (
              <motion.div key={d.id} whileHover={{ scale: 1.02 }} className="glass rounded-xl p-3">
                <h4 className="text-xs font-semibold">{d.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{d.description}</p>
                <div className="h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all"
                    style={{ width: `${Math.min(d.progress / d.target, 1) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px]">
                  <span>{d.progress}/{d.target}</span>
                  {d.completed && !d.claimed && (
                    <button
                      onClick={() => onClaim(d.id)}
                      className="text-empire-gold font-bold"
                    >
                      Réclamer
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
