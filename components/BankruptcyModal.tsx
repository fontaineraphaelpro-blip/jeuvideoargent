"use client";

import { motion } from "framer-motion";
import type { GameState } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  state: GameState;
  onRestart: () => void;
}

export default function BankruptcyModal({ state, onRestart }: Props) {
  return (
    <div className="game-modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="game-modal game-modal--bankrupt"
      >
        <h1>Faillite</h1>
        <p className="ending-title">{state.endingTitle ?? "Game Over"}</p>
        <p className="game-modal-sub">
          Tu n&apos;étais pas fait pour être riche — pas cette fois. L&apos;empire s&apos;effondre.
          Ce n&apos;est pas la fin du monde : recommence plus sage.
        </p>
        <div className="bankrupt-stats">
          <div><span>Meilleur capital</span><strong>{formatMoney(state.stats.bestCapital)}</strong></div>
          <div><span>Pertes totales</span><strong>{formatMoney(state.runEconomy.totalLosses)}</strong></div>
          <div><span>Chapitre atteint</span><strong>{state.campaign.completedChapters.length + 1}/7</strong></div>
          <div><span>Style</span><strong>{state.campaign.playstyle ?? "—"}</strong></div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="game-modal-btn"
          onClick={onRestart}
        >
          Recommencer au bureau
        </motion.button>
      </motion.div>
    </div>
  );
}
