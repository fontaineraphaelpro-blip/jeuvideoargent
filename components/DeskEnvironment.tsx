"use client";

import { motion } from "framer-motion";
import type { DeskTheme } from "@/lib/deskThemes";
import type { GameState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";
import type { PlayerMood } from "@/lib/playerReactions";
import DeskPhone from "./DeskPhone";
import MonitorCrack from "./MonitorCrack";
import PlayerHands from "./PlayerHands";

interface Props {
  theme: DeskTheme;
  state: GameState;
  goldenRush: boolean;
  typing: boolean;
  clicking: boolean;
  mood: PlayerMood;
  monitorCracked: boolean;
  shakeIntensity: "none" | "medium" | "extreme";
  children: React.ReactNode;
}

export default function DeskEnvironment({
  theme,
  state,
  goldenRush,
  typing,
  clicking,
  mood,
  monitorCracked,
  shakeIntensity,
  children,
}: Props) {
  const latestNotif = state.notifications[0] ?? null;
  const pendingMissions = state.missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div
      className={`desk-scene ${goldenRush ? "desk-scene--golden" : ""} desk-tier--${theme.tier} ${monitorCracked ? "desk-scene--cracked" : ""} ${mood === "celebrate" || mood === "victory" ? "desk-scene--euphoric" : ""} ${mood === "rage" || mood === "smash" ? "desk-scene--rage" : ""}`}
    >
      {/* Room */}
      <div className="desk-room">
        <div className="desk-room-wall" />
        <div className="desk-window" style={{ background: theme.windowGradient }}>
          <div className="desk-window-city" />
          <div className="desk-window-glow" />
        </div>
        <motion.div
          className="desk-lamp-glow"
          style={{ background: `radial-gradient(ellipse at 70% 20%, ${theme.lampWarmth}, transparent 60%)` }}
          animate={goldenRush ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.8 }}
          transition={{ repeat: goldenRush ? Infinity : 0, duration: 1.5 }}
        />
        <div className="desk-ambient-bar">
          <span className="desk-room-label">{theme.roomName}</span>
          <span className="desk-ambient-text">{theme.ambientText}</span>
          <span className="desk-hint">Tu ne quittes pas le bureau — tout se passe sur l&apos;écran.</span>
        </div>
      </div>

      {/* Desk POV */}
      <div className="desk-pov">
        <div className="desk-surface" style={{ backgroundColor: theme.deskWood }}>
          {/* Sticky notes */}
          <div className="desk-sticky desk-sticky--yellow">
            <strong>TODO</strong>
            <span>{pendingMissions} mission(s)</span>
            <span>Capital: {formatMoney(state.capital)}</span>
          </div>
          <div className="desk-sticky desk-sticky--pink">
            <strong>Objectifs</strong>
            {state.dailyObjectives.slice(0, 2).map((d) => (
              <span key={d.id}>{d.title}</span>
            ))}
          </div>

          {/* Coffee */}
          <div className="desk-coffee" title={theme.coffeeLabel}>
            <div className="desk-coffee-cup" />
            <span className="desk-coffee-label">{theme.coffeeLabel}</span>
          </div>

          {/* Phone */}
          <DeskPhone
            notification={latestNotif}
            vibrating={!!latestNotif && Date.now() - latestNotif.timestamp < 3000}
          />

          {/* Notebook */}
          <div className="desk-notebook">
            <span className="desk-notebook-title">Notes</span>
            <span>Risque: {state.globalRisk}%</span>
            <span>Rep: {state.reputation}</span>
          </div>

          {/* Monitor */}
          <motion.div
            className="desk-monitor-wrap"
            style={{ width: theme.monitorSize }}
            animate={
              shakeIntensity === "extreme"
                ? { x: [0, -12, 14, -10, 12, -8, 6, 0], y: [0, 4, -6, 5, -4, 3, 0] }
                : shakeIntensity === "medium"
                  ? { x: [0, -4, 4, -3, 0] }
                  : {}
            }
            transition={
              shakeIntensity !== "none"
                ? { duration: shakeIntensity === "extreme" ? 0.9 : 0.5, repeat: shakeIntensity === "extreme" ? 4 : 2 }
                : {}
            }
          >
            <div className="desk-monitor-stand" />
            <div
              className={`desk-monitor ${goldenRush ? "desk-monitor--golden" : ""} ${monitorCracked ? "desk-monitor--cracked" : ""} ${mood === "celebrate" || mood === "victory" ? "desk-monitor--euphoric" : ""}`}
            >
              <div className="desk-monitor-bezel">
                <div className={`desk-monitor-power ${monitorCracked ? "desk-monitor-power--dead" : ""}`} />
                <div className="desk-monitor-brand">ME Pro</div>
              </div>
              <div className="desk-monitor-screen">
                {children}
                <MonitorCrack cracked={monitorCracked} intensity={mood === "smash" ? "heavy" : "light"} />
              </div>
              <div className="desk-monitor-reflection" />
            </div>
          </motion.div>

          {/* Keyboard & hands */}
          <div className="desk-keyboard-area">
            <div className="desk-keyboard">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="desk-key" />
              ))}
            </div>
            <div className="desk-mouse" />
            <PlayerHands typing={typing} clicking={clicking} mood={mood} />
          </div>
        </div>
      </div>
    </div>
  );
}
