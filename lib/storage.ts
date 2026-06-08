import type { GameState } from "@/types/game";
import { createInitialState } from "./gameLogic";

const STORAGE_KEY = "money-empire-save-v4";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const toSave = { ...state, lastSaveTime: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    console.warn("Failed to save game");
  }
}

function readSaveKey(key: string): GameState | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Partial<GameState>;
  const base = createInitialState();
  const merged: GameState = {
    ...base,
    ...parsed,
    campaign: { ...base.campaign, ...parsed.campaign },
    runEconomy: { ...base.runEconomy, ...parsed.runEconomy },
    progression: { ...base.progression, ...parsed.progression },
    stats: { ...base.stats, ...parsed.stats },
  };
  // Sauvegardes existantes : skip intro si déjà en jeu
  if (merged.capital > 150 && !merged.campaign.introDone) {
    merged.campaign = {
      ...merged.campaign,
      introDone: true,
      playstyle: merged.campaign.playstyle ?? "balanced",
    };
    merged.gamePhase = merged.gamePhase === "intro" ? "playing" : merged.gamePhase;
  }
  return merged;
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = readSaveKey(STORAGE_KEY);
    if (saved) return saved;
    // Migration v3 → v4 (progression + coach)
    const legacy = readSaveKey("money-empire-save-v3");
    if (legacy) {
      saveGame(legacy);
      localStorage.removeItem("money-empire-save-v3");
      return legacy;
    }
    return null;
  } catch {
    return null;
  }
}

export function resetGame(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
