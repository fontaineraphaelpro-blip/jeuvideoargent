"use client";

import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { useState } from "react";
import type { GameState } from "@/types/game";
import { INVESTMENTS } from "@/lib/gameData";
import { formatMoney, formatPercent } from "@/lib/formatMoney";
import { isInvestmentUnlocked } from "@/lib/gameLogic";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
  onInvest: (id: string, amount: number) => void;
  onWithdraw: (id: string) => void;
}

const riskColors = {
  low: "text-emerald-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  extreme: "text-red-400",
};

export default function InvestmentPanel({ state, onInvest, onWithdraw }: Props) {
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 italic">
        Simulation fictive. Ceci n&apos;est pas un conseil financier.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {INVESTMENTS.map((inv) => {
          const unlocked = isInvestmentUnlocked(state, inv.unlockAt);
          const invState = state.investments.find((x) => x.id === inv.id);
          const Icon = getIcon(inv.icon, PieChart);
          const profit = invState ? invState.currentValue - invState.amount : 0;
          const profitPct = invState && invState.amount > 0 ? (profit / invState.amount) * 100 : 0;

          return (
            <motion.div
              key={inv.id}
              whileHover={{ y: -2 }}
              className={`glass rounded-xl p-4 ${!unlocked ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-empire-violet" />
                <h3 className="font-semibold text-sm">{inv.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-2">{inv.description}</p>
              <div className="flex gap-3 text-xs mb-3">
                <span className="text-emerald-400">{(inv.avgReturn * 100).toFixed(0)}%/an</span>
                <span className={riskColors[inv.risk]}>{inv.risk}</span>
              </div>

              {invState && (
                <div className="mb-3 rounded-lg bg-white/5 p-2 text-xs">
                  <div className="flex justify-between">
                    <span>Valeur: {formatMoney(invState.currentValue)}</span>
                    <span className={profit >= 0 ? "text-emerald-400" : "text-red-400"}>
                      {formatPercent(profitPct)}
                    </span>
                  </div>
                </div>
              )}

              {unlocked && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Montant"
                    value={amounts[inv.id] ?? ""}
                    onChange={(e) => setAmounts({ ...amounts, [inv.id]: Number(e.target.value) })}
                    className="flex-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs"
                  />
                  <button
                    onClick={() => onInvest(inv.id, amounts[inv.id] ?? 100)}
                    className="rounded-lg bg-emerald-600/30 text-emerald-300 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600/50"
                  >
                    Investir
                  </button>
                  {invState && (
                    <button
                      onClick={() => onWithdraw(inv.id)}
                      className="rounded-lg bg-red-600/20 text-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-600/40"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
