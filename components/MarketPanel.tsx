"use client";

import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import type { GameState } from "@/types/game";
import { MARKET_ASSETS } from "@/lib/gameData";
import { getMarketChange } from "@/lib/market";
import { formatMoney, formatPercent } from "@/lib/formatMoney";
import { getIcon } from "@/lib/icons";

interface Props {
  state: GameState;
  onBuy: (id: string, qty: number) => void;
  onSell: (id: string, qty: number) => void;
}

export default function MarketPanel({ state, onBuy, onSell }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 italic">Marché fictif — actifs simulés uniquement.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {state.market.map((asset) => {
          const def = MARKET_ASSETS.find((a) => a.id === asset.id)!;
          const change = getMarketChange(asset);
          const Icon = getIcon(def.icon, LineChartIcon);
          const chartData = asset.priceHistory.map((p, i) => ({ i, p }));

          return (
            <motion.div
              key={asset.id}
              whileHover={{ y: -2 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-empire-blue" />
                  <div>
                    <h3 className="font-semibold text-sm">{def.name}</h3>
                    <span className="text-xs text-slate-500">{def.symbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMoney(asset.price)}</p>
                  <p className={`text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {formatPercent(change)}
                  </p>
                </div>
              </div>

              <div className="h-12 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="p"
                      stroke={change >= 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {asset.owned > 0 && (
                <p className="text-xs text-slate-400 mb-2">
                  Portefeuille: {asset.owned} actions ({formatMoney(asset.price * asset.owned)})
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onBuy(asset.id, 1)}
                  disabled={state.capital < asset.price}
                  className="flex-1 rounded-lg bg-emerald-600/30 text-emerald-300 py-1.5 text-xs font-semibold hover:bg-emerald-600/50 disabled:opacity-40"
                >
                  Acheter
                </button>
                <button
                  onClick={() => onSell(asset.id, 1)}
                  disabled={asset.owned < 1}
                  className="flex-1 rounded-lg bg-red-600/20 text-red-300 py-1.5 text-xs font-semibold hover:bg-red-600/40 disabled:opacity-40"
                >
                  Vendre
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
