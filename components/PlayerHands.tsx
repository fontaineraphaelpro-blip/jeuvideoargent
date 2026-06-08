"use client";

import { motion } from "framer-motion";

interface Props {
  typing: boolean;
  clicking: boolean;
}

export default function PlayerHands({ typing, clicking }: Props) {
  return (
    <div className="player-hands" aria-hidden>
      <motion.div
        className="hand hand-left"
        animate={typing ? { y: [0, -3, 0, -2, 0] } : {}}
        transition={{ duration: 0.15, repeat: typing ? Infinity : 0 }}
      />
      <motion.div
        className="hand hand-right"
        animate={
          clicking
            ? { y: [0, 4, 0], rotate: [0, -2, 0] }
            : typing
              ? { y: [0, -2, 0, -3, 0] }
              : {}
        }
        transition={{ duration: clicking ? 0.12 : 0.18, repeat: typing && !clicking ? Infinity : 0 }}
      />
    </div>
  );
}
