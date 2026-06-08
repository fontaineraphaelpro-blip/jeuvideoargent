import type { MarketAssetState } from "@/types/game";
import { MARKET_ASSETS } from "./gameData";

export function initMarketState(): MarketAssetState[] {
  return MARKET_ASSETS.map((a) => ({
    id: a.id,
    price: a.basePrice,
    priceHistory: [a.basePrice],
    owned: 0,
    avgBuyPrice: 0,
  }));
}

export function tickMarket(
  market: MarketAssetState[],
  volatilityMult = 1,
  assetImpacts: Record<string, number> = {}
): MarketAssetState[] {
  return market.map((state) => {
    const asset = MARKET_ASSETS.find((a) => a.id === state.id)!;
    const impact = assetImpacts[state.id] ?? 0;
    const randomWalk = (Math.random() - 0.48) * asset.volatility * volatilityMult;
    const trend = asset.trend;
    const change = 1 + randomWalk + trend + impact;
    let newPrice = Math.max(1, state.price * change);
    newPrice = Math.round(newPrice * 100) / 100;
    const history = [...state.priceHistory, newPrice].slice(-30);
    return { ...state, price: newPrice, priceHistory: history };
  });
}

export function getMarketChange(state: MarketAssetState): number {
  if (state.priceHistory.length < 2) return 0;
  const prev = state.priceHistory[state.priceHistory.length - 2];
  return ((state.price - prev) / prev) * 100;
}
