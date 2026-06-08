"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GameNotification } from "@/types/game";

interface Props {
  notifications: GameNotification[];
}

export default function NotificationCenter({ notifications }: Props) {
  const latest = notifications[0];
  if (!latest) return null;

  const colors: Record<string, string> = {
    success: "from-emerald-600/90 to-emerald-800/90",
    info: "from-blue-600/90 to-blue-800/90",
    warning: "from-orange-600/90 to-orange-800/90",
    milestone: "from-yellow-600/90 to-amber-800/90",
    levelup: "from-violet-600/90 to-violet-800/90",
    achievement: "from-empire-gold/90 to-yellow-700/90",
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-xs">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={latest.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100 }}
          className={`rounded-xl bg-gradient-to-r ${colors[latest.type] ?? colors.info} p-3 shadow-lg backdrop-blur-sm border border-white/10`}
        >
          <p className="font-semibold text-sm text-white">{latest.title}</p>
          <p className="text-xs text-white/80 mt-0.5">{latest.message}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
