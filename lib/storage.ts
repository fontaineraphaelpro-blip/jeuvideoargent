import type { GameState } from "@/types/game";
import { createInitialState } from "./gameLogic";

const STORAGE_KEY = "money-empire-save-v2";

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
    return { ...createInitialState(), ...parsed };
  } catch {
    return null;
  }
}

export function resetGame(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
