"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  clickIncome: number;
  combo: number;
  comboMultiplier: number;
  onClick: (e: React.MouseEvent) => void;
  goldenRush: boolean;
  compact?: boolean;
}

export default function IncomeButton({ clickIncome, combo, comboMultiplier, onClick, goldenRush, compact }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={(e) => onClick(e)}
        className={`btn-glow relative rounded-xl font-bold transition-all ${
          compact ? "px-6 py-3 text-sm" : "rounded-2xl px-10 py-6 text-lg"
        } ${
          goldenRush
            ? "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black glow-gold"
            : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white glow-emerald"
        }`}
      >
        <Zap className={`inline mr-1 ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
        Clôturer un deal
        <span className={`block font-normal opacity-80 mt-1 ${compact ? "text-xs" : "text-sm"}`}>
          +{formatMoney(clickIncome)} / action
        </span>
      </motion.button>

      {combo > 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 rounded-full bg-orange-500/20 border border-orange-500/40 px-4 py-1"
        >
          <span className="text-orange-400 font-bold">COMBO x{combo}</span>
          <span className="text-orange-300 text-sm">({comboMultiplier.toFixed(1)}x)</span>
        </motion.div>
      )}
    </div>
  );
}
