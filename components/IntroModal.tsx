"use client";

import { motion } from "framer-motion";
import type { Playstyle } from "@/types/game";
import { PLAYSTYLE_MODIFIERS } from "@/lib/campaign";

interface Props {
  onChoose: (style: Playstyle) => void;
}

const styles: Playstyle[] = ["conservative", "balanced", "aggressive"];

export default function IntroModal({ onChoose }: Props) {
  return (
    <div className="game-modal-overlay">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-modal game-modal--intro"
      >
        <h1>Money Empire</h1>
        <p className="game-modal-sub">
          Tu t&apos;assois à ton bureau. 100 € en poche. Tout le monde ne devient pas riche — beaucoup font faillite.
          Choisis comment tu veux jouer.
        </p>
        <div className="playstyle-grid">
          {styles.map((s) => {
            const m = PLAYSTYLE_MODIFIERS[s];
            return (
              <motion.button
                key={s}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`playstyle-card playstyle-card--${s}`}
                onClick={() => onChoose(s)}
              >
                <h3>{m.label}</h3>
                <p>{m.desc}</p>
              </motion.button>
            );
          })}
        </div>
        <p className="game-modal-note">Simulation fictive. Pas un conseil financier.</p>
      </motion.div>
    </div>
  );
}
