"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { GameState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  state: GameState;
  compact?: boolean;
}

export default function CapitalChart({ state, compact }: Props) {
  const data = state.capitalHistory.map((p) => ({
    time: new Date(p.time).toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
    value: p.value,
  }));

  return (
    <div className={`glass rounded-xl ${compact ? "p-2" : "p-4"}`}>
      <h3 className={`font-semibold mb-2 ${compact ? "text-xs" : "text-sm"}`}>Évolution du capital</h3>
      <div className={compact ? "h-24" : "h-40"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="capitalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5c542" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f5c542" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} width={60} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              formatter={(v: number) => [formatMoney(v), "Capital"]}
            />
            <Area type="monotone" dataKey="value" stroke="#f5c542" fill="url(#capitalGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
