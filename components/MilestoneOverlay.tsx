"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  title: string | null;
}

export default function MilestoneOverlay({ title }: Props) {
  return (
    <AnimatePresence>
      {title && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <p className="text-sm text-empire-gold uppercase tracking-widest">Nouveau palier</p>
            <h2 className="text-4xl md:text-5xl font-black text-gradient-gold mt-2">{title}</h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
