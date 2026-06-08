"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { Business, BusinessState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";
import { getBusinessCost } from "@/lib/gameLogic";
import { getIcon } from "@/lib/icons";

interface Props {
  business: Business;
  state?: BusinessState;
  costReduction: number;
  capital: number;
  unlocked: boolean;
  affordable: boolean;
  categoryBonus: number;
  onBuy: () => void;
  onUpgrade: () => void;
}

export default function BusinessCard({
  business,
  state,
  costReduction,
  capital,
  unlocked,
  affordable,
  categoryBonus,
  onBuy,
  onUpgrade,
}: Props) {
  const qty = state?.quantity ?? 0;
  const level = state?.level ?? 1;
  const cost = getBusinessCost(business.baseCost, qty, costReduction);
  const income = business.baseIncome * (qty || 1) * (1 + (level - 1) * 0.1) * categoryBonus;
  const Icon = getIcon(business.icon, Building2);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass rounded-xl p-4 transition-all ${
        affordable && unlocked ? "purchasable-glow border-empire-gold/30" : ""
      } ${!unlocked ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-empire-gold/10 p-2">
            <Icon className="h-5 w-5 text-empire-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{business.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{business.description}</p>
          </div>
        </div>
        {qty > 0 && (
          <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5">
            x{qty} Lv.{level}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-emerald-400">{formatMoney(income)}/s</span>
        <span className="text-slate-500">Risque: {business.risk}%</span>
      </div>

      <div className="mt-3 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!unlocked || capital < cost}
          onClick={onBuy}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            affordable && unlocked
              ? "bg-empire-gold/20 text-empire-gold border border-empire-gold/40 hover:bg-empire-gold/30"
              : "bg-white/5 text-slate-500 cursor-not-allowed"
          }`}
        >
          {!unlocked ? "🔒 Bientôt" : `Acheter ${formatMoney(cost)}`}
        </motion.button>
        {qty > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={capital < cost * 2}
            onClick={onUpgrade}
            className="rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-2 text-xs font-semibold hover:bg-violet-500/30 disabled:opacity-40"
          >
            ⬆
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
