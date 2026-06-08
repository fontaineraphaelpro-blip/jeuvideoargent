"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GameNotification } from "@/types/game";

interface Props {
  notification: GameNotification | null;
  vibrating: boolean;
}

export default function DeskPhone({ notification, vibrating }: Props) {
  return (
    <motion.div
      className="desk-phone"
      animate={vibrating ? { x: [-1, 1, -1, 1, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="phone-screen">
        <div className="phone-time">22:34</div>
        <AnimatePresence mode="wait">
          {notification ? (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="phone-notif"
            >
              <span className="phone-notif-app">Money Empire</span>
              <span className="phone-notif-title">{notification.title}</span>
              <span className="phone-notif-msg">{notification.message}</span>
            </motion.div>
          ) : (
            <motion.div key="idle" className="phone-idle">
              <span>📱</span>
              <span>3 notifs</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
