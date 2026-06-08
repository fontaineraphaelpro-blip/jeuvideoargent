"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  pulse?: boolean;
  compact?: boolean;
}

export default function StatCard({ label, value, icon: Icon, color = "text-empire-gold", pulse, compact }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass rounded-xl ${compact ? "p-2" : "p-3"} flex items-center gap-2`}
    >
      <div className={`rounded-lg bg-white/5 p-1.5 ${pulse ? "animate-pulse-glow" : ""}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 truncate">{label}</p>
        <p className={`font-semibold ${compact ? "text-sm" : "text-base"} truncate ${color}`}>{value}</p>
      </div>
    </motion.div>
  );
}
