"use client";

import { useMemo } from "react";

interface Props {
  active: boolean;
}

export default function Confetti({ active }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: ["#f5c542", "#10b981", "#8b5cf6", "#3b82f6", "#ec4899"][i % 5],
        size: 4 + Math.random() * 6,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece absolute"
          style={{
            left: `${p.left}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
