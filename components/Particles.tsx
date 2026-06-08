"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  active: boolean;
}

export default function Particles({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-empire-gold"
              initial={{
                x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
                y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
                scale: 0,
              }}
              animate={{
                x: (typeof window !== "undefined" ? window.innerWidth / 2 : 500) + (Math.random() - 0.5) * 400,
                y: (typeof window !== "undefined" ? window.innerHeight / 2 : 400) + (Math.random() - 0.5) * 300,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.2, delay: i * 0.05 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
