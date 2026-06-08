"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  active: boolean;
  endTime: number;
}

export default function GoldenRushOverlay({ active, endTime }: Props) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));
    }, 100);
    return () => clearInterval(interval);
  }, [active, endTime]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 pointer-events-none"
        >
          <div className="absolute inset-0 golden-rush-bg" />
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                opacity: 0,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-black text-gradient-gold drop-shadow-lg">
              GOLDEN RUSH
            </h2>
            <p className="text-2xl text-yellow-300 mt-2 font-bold">{remaining}s</p>
            <p className="text-sm text-yellow-200/80 mt-1">Revenus x3 • Clics x5</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
