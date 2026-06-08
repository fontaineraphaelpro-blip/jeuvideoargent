import type { GameState } from "@/types/game";
import { getMetricValue } from "./gameLogic";

export function getCampaignMetric(state: GameState, metric: string): number {
  if (metric === "not_bankrupt") return state.gamePhase !== "bankrupt" ? 1 : 0;
  if (metric === "risk_under_40") return state.globalRisk < 40 ? 1 : 0;
  if (metric === "debt_free") return state.runEconomy.debt <= 0 ? 1 : 0;
  return getMetricValue(state, metric);
}
