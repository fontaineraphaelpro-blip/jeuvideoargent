"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { formatMoney } from "@/lib/formatMoney";

interface Props {
  value: number;
  size?: "sm" | "lg" | "xl";
}

export default function CapitalCounter({ value, size = "xl" }: Props) {
  const spring = useSpring(value, { stiffness: 80, damping: 20, mass: 0.5 });
  const display = useTransform(spring, (v) => formatMoney(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const sizeClass = {
    sm: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl md:text-6xl",
  }[size];

  return (
    <motion.div
      className={`font-bold tracking-tight text-gradient-gold ${sizeClass}`}
      key={Math.floor(value / 100)}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{display}</motion.span>
    </motion.div>
  );
}
