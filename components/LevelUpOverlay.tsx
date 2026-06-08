"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  show: boolean;
  level: number;
}

export default function LevelUpOverlay({ show, level }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg text-violet-300 uppercase tracking-widest">Level Up!</p>
            <h2 className="text-6xl font-black text-gradient-gold mt-2">Niveau {level}</h2>
            <p className="text-sm text-emerald-400 mt-2">+1% bonus global</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
