"use client";

interface Props {
  cracked: boolean;
  intensity?: "light" | "heavy";
}

export default function MonitorCrack({ cracked, intensity = "heavy" }: Props) {
  if (!cracked) return null;

  return (
    <div className={`monitor-crack monitor-crack--${intensity}`} aria-hidden>
      <svg viewBox="0 0 200 120" className="monitor-crack-svg" preserveAspectRatio="none">
        <line x1="100" y1="60" x2="30" y2="10" strokeWidth="1.5" />
        <line x1="100" y1="60" x2="170" y2="15" strokeWidth="1.5" />
        <line x1="100" y1="60" x2="15" y2="90" strokeWidth="1.2" />
        <line x1="100" y1="60" x2="185" y2="85" strokeWidth="1.2" />
        <line x1="100" y1="60" x2="60" y2="110" strokeWidth="1" />
        <line x1="100" y1="60" x2="140" y2="105" strokeWidth="1" />
        <line x1="70" y1="40" x2="45" y2="55" strokeWidth="0.8" />
        <line x1="130" y1="45" x2="155" y2="60" strokeWidth="0.8" />
      </svg>
      <div className="monitor-crack-glitch" />
    </div>
  );
}
