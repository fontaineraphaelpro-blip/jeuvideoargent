"use client";

import { motion } from "framer-motion";
import type { PlayerMood } from "@/lib/playerReactions";

interface Props {
  typing: boolean;
  clicking: boolean;
  mood: PlayerMood;
}

function getHandAnimations(mood: PlayerMood, typing: boolean, clicking: boolean) {
  switch (mood) {
    case "smash":
      return {
        left: {
          x: [0, -15, -25, -10],
          y: [0, -80, -120, -60],
          rotate: [-8, -25, -40, -15],
          scale: [1, 1.1, 1.05, 1],
        },
        right: {
          x: [0, 20, 35, 15],
          y: [0, -100, -150, -80],
          rotate: [8, 30, 50, 20],
          scale: [1, 1.15, 1.1, 1],
        },
        transition: { duration: 1.2, times: [0, 0.35, 0.55, 1], ease: "easeOut" as const },
      };
    case "rage":
      return {
        left: {
          x: [0, -8, 6, -4, 0],
          y: [0, -5, 2, -3, 0],
          rotate: [-8, -20, -5, -15, -8],
        },
        right: {
          x: [0, 12, -8, 10, 0],
          y: [0, -90, -40, -70, 0],
          rotate: [8, 35, 15, 30, 8],
        },
        transition: { duration: 0.8, repeat: 3, ease: "easeInOut" as const },
      };
    case "celebrate":
      return {
        left: {
          y: [0, -50, -30, -60, -20, 0],
          rotate: [-8, -30, -15, -35, -10, -8],
          x: [0, -20, -10, -25, -5, 0],
        },
        right: {
          y: [0, -55, -35, -65, -25, 0],
          rotate: [8, 30, 15, 35, 10, 8],
          x: [0, 20, 10, 25, 5, 0],
        },
        transition: { duration: 1.4, repeat: 2, ease: "easeOut" as const },
      };
    case "victory":
      return {
        left: {
          y: [0, -40, -25, 0],
          rotate: [-8, -25, -20, -8],
        },
        right: {
          y: [0, -45, -30, 0],
          rotate: [8, 25, 20, 8],
        },
        transition: { duration: 0.6, repeat: 2, ease: "easeOut" as const },
      };
    case "stressed":
      return {
        left: {
          x: [0, -2, 2, -1, 0],
          rotate: [-8, -12, -6, -10, -8],
        },
        right: {
          x: [0, 2, -2, 1, 0],
          rotate: [8, 12, 6, 10, 8],
          y: [0, 2, 0, 1, 0],
        },
        transition: { duration: 0.15, repeat: Infinity, ease: "linear" as const },
      };
    case "clicking":
      return {
        left: {},
        right: { y: [0, 4, 0], rotate: [0, -2, 0] },
        transition: { duration: 0.12, repeat: 0 },
      };
    case "typing":
      return {
        left: { y: [0, -3, 0, -2, 0] },
        right: { y: [0, -2, 0, -3, 0] },
        transition: { duration: 0.18, repeat: Infinity, ease: "easeInOut" as const },
      };
    default:
      if (clicking) {
        return {
          left: {},
          right: { y: [0, 4, 0], rotate: [0, -2, 0] },
          transition: { duration: 0.12 },
        };
      }
      if (typing) {
        return {
          left: { y: [0, -3, 0, -2, 0] },
          right: { y: [0, -2, 0, -3, 0] },
          transition: { duration: 0.18, repeat: Infinity },
        };
      }
      return { left: {}, right: {}, transition: { duration: 0.3 } };
  }
}

export default function PlayerHands({ typing, clicking, mood }: Props) {
  const anim = getHandAnimations(mood, typing, clicking);
  const isIntense = mood === "rage" || mood === "smash" || mood === "celebrate" || mood === "victory";

  return (
    <div className={`player-hands ${isIntense ? `player-hands--${mood}` : ""}`} aria-hidden>
      <motion.div
        className="hand hand-left"
        animate={anim.left}
        transition={anim.transition}
      />
      <motion.div
        className="hand hand-right"
        animate={anim.right}
        transition={anim.transition}
      />
      {(mood === "rage" || mood === "smash") && (
        <motion.div
          className="hand-impact-ring"
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
      )}
    </div>
  );
}
