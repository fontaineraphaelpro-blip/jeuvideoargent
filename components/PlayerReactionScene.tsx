"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PlayerReaction } from "@/lib/playerReactions";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  reaction: PlayerReaction | null;
  phraseIndex: number;
}

export default function PlayerReactionScene({ reaction, phraseIndex }: Props) {
  if (!reaction) return null;

  const isCrash =
    reaction.type === "zero_crashout" || reaction.type === "bankrupt_crashout";
  const isWin =
    reaction.type === "big_win" || reaction.type === "mega_win";
  const phrase = reaction.phrases[phraseIndex % reaction.phrases.length];

  return (
    <AnimatePresence>
      <motion.div
        key={reaction.id}
        className={`player-reaction-scene ${isCrash ? "player-reaction--crash" : ""} ${isWin ? "player-reaction--win" : ""} player-reaction--${reaction.type}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-hidden
      >
        {isCrash && (
          <>
            <motion.div
              className="player-reaction-flash player-reaction-flash--red"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.3, 0.7, 0] }}
              transition={{ duration: 1.2 }}
            />
            <div className="player-reaction-vignette player-reaction-vignette--rage" />
            <div className="player-reaction-static" />
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="glass-shard"
                style={{
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${15 + (i * 11) % 50}%`,
                  rotate: i * 30,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.6], scale: [0, 1.2, 1], y: [0, 40, 80] }}
                transition={{ delay: 0.8 + i * 0.05, duration: 1.5 }}
              />
            ))}
          </>
        )}

        {isWin && (
          <>
            <motion.div
              className="player-reaction-flash player-reaction-flash--gold"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8 }}
            />
            <div className="player-reaction-vignette player-reaction-vignette--win" />
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="win-sparkle"
                style={{ left: `${12 + i * 10}%`, top: `${20 + (i % 3) * 15}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 360 }}
                transition={{ delay: i * 0.1, duration: 1.2 }}
              />
            ))}
          </>
        )}

        {reaction.type === "big_loss" && (
          <div className="player-reaction-vignette player-reaction-vignette--loss" />
        )}

        <motion.div
          className={`player-reaction-bubble ${isCrash ? "player-reaction-bubble--rage" : ""} ${isWin ? "player-reaction-bubble--win" : ""}`}
          key={phrase}
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={
            isCrash
              ? { scale: [0.5, 1.3, 1.1], opacity: 1, y: 0, rotate: [-3, 3, -2, 0] }
              : { scale: [0.6, 1.15, 1], opacity: 1, y: 0 }
          }
          transition={{ duration: 0.35 }}
        >
          <span className="player-reaction-text">{phrase}</span>
          {reaction.amount !== undefined && isWin && (
            <span className="player-reaction-amount">+{formatMoney(reaction.amount)}</span>
          )}
          {reaction.amount !== undefined && reaction.type === "big_loss" && (
            <span className="player-reaction-amount player-reaction-amount--loss">
              −{formatMoney(reaction.amount)}
            </span>
          )}
        </motion.div>

        {isCrash && (
          <motion.p
            className="player-reaction-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1.5, duration: 2.5 }}
          >
            *le joueur frappe l&apos;écran à mains nues*
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
