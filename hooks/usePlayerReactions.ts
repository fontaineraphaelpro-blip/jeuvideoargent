"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GameState } from "@/types/game";
import {
  detectPlayerReaction,
  shouldHealCrackedScreen,
  type PlayerMood,
  type PlayerReaction,
} from "@/lib/playerReactions";
import { playSound } from "@/lib/audio";

interface UsePlayerReactionsResult {
  activeReaction: PlayerReaction | null;
  mood: PlayerMood;
  monitorCracked: boolean;
  showBankruptcyModal: boolean;
  phraseIndex: number;
}

export function usePlayerReactions(
  state: GameState,
  typing: boolean,
  clicking: boolean,
  soundEnabled: boolean
): UsePlayerReactionsResult {
  const prevRef = useRef({ capital: state.capital, gamePhase: state.gamePhase });
  const [activeReaction, setActiveReaction] = useState<PlayerReaction | null>(null);
  const [monitorCracked, setMonitorCracked] = useState(false);
  const [showBankruptcyModal, setShowBankruptcyModal] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phraseTimerRef.current) clearInterval(phraseTimerRef.current);
  }, []);

  const startReaction = useCallback(
    (reaction: PlayerReaction) => {
      clearTimers();
      setActiveReaction(reaction);
      setPhraseIndex(0);

      if (reaction.crackScreen) setMonitorCracked(true);
      if (reaction.sound) playSound(reaction.sound, soundEnabled);

      phraseTimerRef.current = setInterval(() => {
        setPhraseIndex((i) => i + 1);
      }, 700);

      timerRef.current = setTimeout(() => {
        setActiveReaction(null);
        if (phraseTimerRef.current) clearInterval(phraseTimerRef.current);

        if (reaction.type === "bankrupt_crashout") {
          setShowBankruptcyModal(true);
        }
      }, reaction.durationMs);
    },
    [clearTimers, soundEnabled]
  );

  useEffect(() => {
    const prev = prevRef.current;
    const delta = state.capital - prev.capital;

    if (prev.capital !== state.capital || prev.gamePhase !== state.gamePhase) {
      const reaction = detectPlayerReaction(prev, state, delta);
      if (reaction) startReaction(reaction);
      prevRef.current = { capital: state.capital, gamePhase: state.gamePhase };
    }

    if (monitorCracked && shouldHealCrackedScreen(state.capital, state.gamePhase)) {
      setMonitorCracked(false);
    }

    if (state.gamePhase !== "bankrupt") {
      setShowBankruptcyModal(false);
    } else if (!activeReaction) {
      setShowBankruptcyModal(true);
    }
  }, [state.capital, state.gamePhase, startReaction, monitorCracked, activeReaction]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const mood: PlayerMood = activeReaction
    ? activeReaction.mood
    : typing
      ? clicking
        ? "clicking"
        : "typing"
      : state.gamePhase === "struggling"
        ? "stressed"
        : "idle";

  return {
    activeReaction,
    mood,
    monitorCracked,
    showBankruptcyModal,
    phraseIndex,
  };
}
