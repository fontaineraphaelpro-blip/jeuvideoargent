"use client";

import { motion } from "framer-motion";
import type { TabId } from "@/types/game";
import type { LucideIcon } from "lucide-react";

export interface TabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface Props {
  tabs: TabItem[];
  active: TabId;
  onChange: (id: TabId) => void;
  compact?: boolean;
}

export default function Tabs({ tabs, active, onChange, compact }: Props) {
  return (
    <nav className={`flex gap-1 overflow-x-auto scrollbar-thin ${compact ? "pb-1" : "pb-2"}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive ? "text-empire-gold" : "text-slate-400 hover:text-slate-200"
            } ${compact ? "px-2 py-1.5 text-xs" : ""}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-empire-gold/10 border border-empire-gold/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative h-4 w-4" />
            <span className="relative hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
