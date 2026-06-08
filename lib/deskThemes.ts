export type DeskTier = "starter" | "entrepreneur" | "investor" | "millionaire" | "tycoon" | "billionaire" | "legend";

export function getDeskTier(capital: number): DeskTier {
  if (capital >= 1_000_000_000_000) return "legend";
  if (capital >= 1_000_000_000) return "billionaire";
  if (capital >= 100_000_000) return "tycoon";
  if (capital >= 1_000_000) return "millionaire";
  if (capital >= 100_000) return "investor";
  if (capital >= 10_000) return "entrepreneur";
  return "starter";
}

export interface DeskTheme {
  tier: DeskTier;
  roomName: string;
  windowGradient: string;
  deskWood: string;
  lampWarmth: string;
  monitorSize: string;
  coffeeLabel: string;
  ambientText: string;
}

export const DESK_THEMES: Record<DeskTier, DeskTheme> = {
  starter: {
    tier: "starter",
    roomName: "Studio — 22m²",
    windowGradient: "linear-gradient(180deg, #1a2744 0%, #2d3a52 40%, #4a5568 100%)",
    deskWood: "#3d2b1f",
    lampWarmth: "rgba(255, 180, 80, 0.15)",
    monitorSize: "clamp(280px, 72vw, 680px)",
    coffeeLabel: "Café maison",
    ambientText: "22h34 — Pluie fine dehors. Ton téléphone vibre encore.",
  },
  entrepreneur: {
    tier: "entrepreneur",
    roomName: "Bureau coworking",
    windowGradient: "linear-gradient(180deg, #1e3a5f 0%, #3d5a80 50%, #6b7c93 100%)",
    deskWood: "#4a3728",
    lampWarmth: "rgba(255, 200, 100, 0.2)",
    monitorSize: "clamp(300px, 74vw, 720px)",
    coffeeLabel: "Americano",
    ambientText: "L'open-space se vide. Tu restes, focus.",
  },
  investor: {
    tier: "investor",
    roomName: "Home office premium",
    windowGradient: "linear-gradient(180deg, #0f2847 0%, #1d4ed8 30%, #f59e0b 85%, #78350f 100%)",
    deskWood: "#5c4033",
    lampWarmth: "rgba(255, 210, 120, 0.25)",
    monitorSize: "clamp(320px, 76vw, 760px)",
    coffeeLabel: "Flat white",
    ambientText: "Coucher de soleil sur la ville. Les marchés ferment bientôt.",
  },
  millionaire: {
    tier: "millionaire",
    roomName: "Penthouse bureau",
    windowGradient: "linear-gradient(180deg, #0c1445 0%, #312e81 40%, #fbbf24 75%, #1c1917 100%)",
    deskWood: "#2c1810",
    lampWarmth: "rgba(255, 220, 140, 0.3)",
    monitorSize: "clamp(340px, 78vw, 800px)",
    coffeeLabel: "Espresso double",
    ambientText: "Vue 180°. La ville brille sous tes pieds.",
  },
  tycoon: {
    tier: "tycoon",
    roomName: "Suite exécutive",
    windowGradient: "linear-gradient(180deg, #020617 0%, #1e1b4b 35%, #eab308 70%, #0f172a 100%)",
    deskWood: "#1a0f0a",
    lampWarmth: "rgba(255, 230, 150, 0.35)",
    monitorSize: "clamp(360px, 80vw, 840px)",
    coffeeLabel: "Barista privé",
    ambientText: "Silence absolu. Seul le clavier résonne.",
  },
  billionaire: {
    tier: "billionaire",
    roomName: "Tour privée — étage 88",
    windowGradient: "linear-gradient(180deg, #000000 0%, #1e1b4b 25%, #f5c542 60%, #0a0a0a 100%)",
    deskWood: "#0d0d0d",
    lampWarmth: "rgba(245, 197, 66, 0.4)",
    monitorSize: "clamp(380px, 82vw, 880px)",
    coffeeLabel: "Or & arabica",
    ambientText: "Au-dessus des nuages. L'empire ne dort jamais.",
  },
  legend: {
    tier: "legend",
    roomName: "Command center orbital",
    windowGradient: "linear-gradient(180deg, #000 0%, #1a0533 30%, #3b82f6 55%, #f5c542 80%, #000 100%)",
    deskWood: "#111827",
    lampWarmth: "rgba(139, 92, 246, 0.35)",
    monitorSize: "clamp(400px, 84vw, 920px)",
    coffeeLabel: "Gravité zéro",
    ambientText: "La Terre tourne en bas. Ton empire aussi.",
  },
};
