"use client";

import { motion } from "framer-motion";
import type { GameState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  state: GameState;
}

const COLORS = ["#f5c542", "#10b981", "#8b5cf6", "#3b82f6", "#f97316", "#ec4899", "#06b6d4"];

export default function StatsPanel({ state }: Props) {
  const { stats } = state;
  const roiData = Object.entries(stats.roiByCategory)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const statItems = [
    { label: "Total gagné", value: formatMoney(stats.totalEarned) },
    { label: "Total dépensé", value: formatMoney(stats.totalSpent) },
    { label: "Clics", value: stats.totalClicks.toLocaleString() },
    { label: "Missions", value: String(stats.missionsCompleted) },
    { label: "Meilleur capital", value: formatMoney(stats.bestCapital) },
    { label: "Niveau", value: String(state.level) },
    { label: "Prestiges", value: String(stats.prestigeCount) },
    { label: "Plus gros gain", value: formatMoney(stats.biggestGain) },
    { label: "Plus grosse perte", value: formatMoney(stats.biggestLoss) },
    { label: "Golden Rush", value: String(stats.goldenRushesTriggered) },
    { label: "Achievements", value: String(stats.achievementsUnlocked) },
    { label: "Réputation", value: String(state.reputation) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {statItems.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass rounded-xl p-3"
          >
            <p className="text-[10px] uppercase text-slate-500">{s.label}</p>
            <p className="font-semibold text-sm mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {roiData.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">ROI par catégorie</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roiData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {roiData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
