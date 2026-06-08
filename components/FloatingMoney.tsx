"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { FloatingMoneyItem } from "@/types/game";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  items: FloatingMoneyItem[];
}

export default function FloatingMoney({ items }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y, x: item.x, scale: 0.5 }}
            animate={{ opacity: 0, y: item.y - 80, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute text-lg font-bold text-emerald-400"
            style={{ left: item.x, top: item.y }}
          >
            +{formatMoney(item.amount)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
