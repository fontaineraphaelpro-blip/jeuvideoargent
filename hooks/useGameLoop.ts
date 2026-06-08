"use client";

import { useEffect, useRef } from "react";
import { EVENT_CHECK_MIN_MS, EVENT_CHECK_MAX_MS, MARKET_TICK_MS, PASSIVE_TICK_MS } from "@/lib/gameData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGameLoop(
  loaded: boolean,
  dispatch: (action: any) => void,
  goldenRushMeter: number
) {
  const lastEventRef = useRef(Date.now());
  const nextEventDelay = useRef(
    EVENT_CHECK_MIN_MS + Math.random() * (EVENT_CHECK_MAX_MS - EVENT_CHECK_MIN_MS)
  );

  useEffect(() => {
    if (!loaded) return;

    const passiveInterval = setInterval(() => {
      dispatch({ type: "TICK", delta: PASSIVE_TICK_MS });
    }, PASSIVE_TICK_MS);

    const marketInterval = setInterval(() => {
      dispatch({ type: "MARKET_TICK" });
    }, MARKET_TICK_MS);

    const eventInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastEventRef.current > nextEventDelay.current) {
        lastEventRef.current = now;
        nextEventDelay.current =
          EVENT_CHECK_MIN_MS + Math.random() * (EVENT_CHECK_MAX_MS - EVENT_CHECK_MIN_MS);
        if (Math.random() < 0.7) {
          dispatch({ type: "RANDOM_EVENT" });
        } else if (Math.random() < 0.4) {
          dispatch({ type: "STRATEGIC_DECISION" });
        }
      }
    }, 5000);

    return () => {
      clearInterval(passiveInterval);
      clearInterval(marketInterval);
      clearInterval(eventInterval);
    };
  }, [loaded, dispatch]);

  useEffect(() => {
    if (goldenRushMeter >= 100) {
      dispatch({ type: "TRIGGER_GOLDEN_RUSH" });
    }
  }, [goldenRushMeter, dispatch]);
}
