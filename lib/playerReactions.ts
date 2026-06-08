import type { GameState } from "@/types/game";
import { BANKRUPTCY_THRESHOLD } from "./runEconomy";

export type PlayerMood =
  | "idle"
  | "typing"
  | "clicking"
  | "stressed"
  | "rage"
  | "smash"
  | "victory"
  | "celebrate";

export type ReactionType =
  | "zero_crashout"
  | "bankrupt_crashout"
  | "mega_win"
  | "big_win"
  | "big_loss";

export interface PlayerReaction {
  id: string;
  type: ReactionType;
  mood: PlayerMood;
  durationMs: number;
  phrases: string[];
  amount?: number;
  crackScreen: boolean;
  shakeIntensity: "none" | "medium" | "extreme";
  sound: "crash" | "rage" | "victory" | "panic" | null;
}

const ZERO_PHRASES = [
  "PUTAIN — ZÉRO !!!",
  "NON NON NON !!!",
  "J'AI TOUT PERDU !!!",
  "C'EST FOUTU !!!",
  "MERDE MERDE MERDE !!!",
];

const BANKRUPT_PHRASES = [
  "FAILLITE !!!",
  "MON ÉCRAN !!!",
  "J'EN PEUX PLUS !!!",
  "TOUT EST CASSÉ !!!",
  "C'EST LA FIN !!!",
];

const MEGA_WIN_PHRASES = [
  "OUIIIII !!!",
  "ON EST RICHES !!!",
  "INCROYABLE !!!",
  "LET'S GOOO !!!",
];

const BIG_WIN_PHRASES = [
  "YES !!!",
  "ÇA C'EST DU LOURD !",
  "ENFIN !!!",
  "BOUM !!!",
];

const LOSS_PHRASES = [
  "Non...",
  "Putain...",
  "J'ai tout perdu là...",
];

export function detectPlayerReaction(
  prev: { capital: number; gamePhase: GameState["gamePhase"] },
  next: GameState,
  delta: number
): PlayerReaction | null {
  const id = `rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  if (prev.gamePhase !== "bankrupt" && next.gamePhase === "bankrupt") {
    return {
      id,
      type: "bankrupt_crashout",
      mood: "smash",
      durationMs: 6500,
      phrases: BANKRUPT_PHRASES,
      crackScreen: true,
      shakeIntensity: "extreme",
      sound: "crash",
    };
  }

  if (prev.capital > 0 && next.capital <= 0 && next.capital > BANKRUPTCY_THRESHOLD) {
    return {
      id,
      type: "zero_crashout",
      mood: "rage",
      durationMs: 5200,
      phrases: ZERO_PHRASES,
      crackScreen: true,
      shakeIntensity: "extreme",
      sound: "rage",
    };
  }

  if (delta >= 1000) {
    return {
      id,
      type: "mega_win",
      mood: "celebrate",
      durationMs: 4000,
      phrases: MEGA_WIN_PHRASES,
      amount: delta,
      crackScreen: false,
      shakeIntensity: "none",
      sound: "victory",
    };
  }

  if (delta >= 200 || (delta >= 80 && prev.capital > 0 && delta >= prev.capital * 0.3)) {
    return {
      id,
      type: "big_win",
      mood: "victory",
      durationMs: 2800,
      phrases: BIG_WIN_PHRASES,
      amount: delta,
      crackScreen: false,
      shakeIntensity: "none",
      sound: "victory",
    };
  }

  if (delta <= -150 && prev.capital > 0) {
    return {
      id,
      type: "big_loss",
      mood: "stressed",
      durationMs: 2200,
      phrases: LOSS_PHRASES,
      amount: Math.abs(delta),
      crackScreen: false,
      shakeIntensity: "medium",
      sound: "panic",
    };
  }

  return null;
}

export function shouldHealCrackedScreen(capital: number, gamePhase: GameState["gamePhase"]): boolean {
  return capital > 80 && gamePhase !== "bankrupt";
}
