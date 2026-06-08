import type { GameState } from "@/types/game";
import { createInitialState } from "./gameLogic";

const STORAGE_KEY = "money-empire-save-v3";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const toSave = { ...state, lastSaveTime: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    console.warn("Failed to save game");
  }
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    const merged = { ...createInitialState(), ...parsed };
    // Sauvegardes existantes : skip intro si déjà en jeu
    if (merged.capital > 150 && !merged.campaign?.introDone) {
      merged.campaign = {
        ...merged.campaign,
        introDone: true,
        playstyle: merged.campaign.playstyle ?? "balanced",
      };
      merged.gamePhase = merged.gamePhase === "intro" ? "playing" : merged.gamePhase;
    }
    return merged;
  } catch {
    return null;
  }
}

export function resetGame(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
