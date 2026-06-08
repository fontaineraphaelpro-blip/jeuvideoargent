import type { GameState, TabId } from "@/types/game";
import { getCurrentChapter } from "./campaign";
import { getCampaignMetric } from "./campaignMetrics";
import { getAppUnlockInfo, getChapterProgress, getLockedAppsSummary, isAppFullyUnlocked, APP_LABELS } from "./progression";

export interface CoachStep {
  title: string;
  description: string;
  action: string;
  app: TabId;
  priority: number;
}

export function getNextCoachStep(state: GameState): CoachStep {
  const chapter = getCurrentChapter(state.campaign);
  const done = new Set(state.campaign.objectivesDone);

  // Bankruptcy prevention first
  if (state.gamePhase === "struggling") {
    return {
      title: "Urgence — tu perds de l'argent",
      description: `Tu dépenses ${state.runEconomy.overheadPerSec.toFixed(1)} €/s en charges mais tu ne gagnes que ${state.incomePerSecond.toFixed(1)} €/s. Agis maintenant.`,
      action: "Ouvre le Guide → options d'urgence",
      app: "guide",
      priority: 100,
    };
  }

  // Incomplete required objectives
  for (const obj of chapter.objectives.filter((o) => !o.optional)) {
    if (done.has(obj.id)) continue;
    const progress = getCampaignMetric(state, obj.metric);
    if (progress >= obj.target) continue;

    const step = objectiveToStep(obj.id, obj.label, progress, obj.target, state);
    if (step) return step;
  }

  // Optional objectives hint
  const optionalLeft = chapter.objectives.filter((o) => o.optional && !done.has(o.id));
  if (optionalLeft.length > 0 && getChapterProgress(state).percent >= 100) {
    return {
      title: "Objectifs bonus disponibles",
      description: optionalLeft[0].label + " — optionnel mais rentable.",
      action: "Explore les apps débloquées",
      app: suggestBestApp(state),
      priority: 30,
    };
  }

  const locked = getLockedAppsSummary(state);
  if (locked.length > 0) {
    const next = locked[0];
    return {
      title: "Prochain déblocage",
      description: `${APP_LABELS[next.app]} : ${next.info.reason}`,
      action: "Termine l'objectif en cours — récompense instantanée",
      app: suggestBestApp(state),
      priority: 25,
    };
  }

  if (state.combo >= 5) {
    return {
      title: "Combo actif — ne lâche pas !",
      description: `x${state.comboMultiplier.toFixed(1)} en cours. Chaque clic rapporte de plus en plus.`,
      action: "Spam CashFlow — charge le Golden Rush",
      app: "dashboard",
      priority: 22,
    };
  }

  return {
    title: "Tout est ouvert — fonce !",
    description: "Clique, achète, trade, investis. Chaque action = cash + XP + dopamine.",
    action: "Choisis ton prochain coup",
    app: "dashboard",
    priority: 10,
  };
}

function objectiveToStep(
  id: string,
  label: string,
  progress: number,
  target: number,
  state: GameState
): CoachStep {
  const remaining = target - progress;

  if (id.includes("click") || id === "c1_clicks") {
    return {
      title: "Closer des deals",
      description: `${label} — encore ${remaining} à faire. Chaque clic = cash immédiat.`,
      action: "Ouvre CashFlow → Clôturer un deal",
      app: "dashboard",
      priority: 90,
    };
  }
  if (id.includes("capital") || id.includes("cap")) {
    return {
      title: "Faire grossir ton capital",
      description: `${label} (${progress}/${target} €). Clique ou achète un business safe.`,
      action: isAppFullyUnlocked(state, "business")
        ? "CashFlow pour cliquer OU EmpireBiz pour du passif"
        : "CashFlow → clique jusqu'au objectif",
      app: isAppFullyUnlocked(state, "business") ? "business" : "dashboard",
      priority: 85,
    };
  }
  if (id.includes("business")) {
    return {
      title: "Acheter ton premier business",
      description: "Le Compte épargne coûte ~50 € et génère du cash en continu. Attention aux charges !",
      action: "Ouvre EmpireBiz → Compte épargne",
      app: "business",
      priority: 88,
    };
  }
  if (id.includes("trade")) {
    return {
      title: "Première transaction boursière",
      description: "Achète 1 action (petit montant). Le marché peut baisser — sois prudent.",
      action: "Ouvre TradeX Pro → achète 1 action",
      app: "market",
      priority: 80,
    };
  }
  if (id.includes("invest")) {
    return {
      title: "Placer ton argent (optionnel)",
      description: "Invest+ propose des produits fictifs. Le Livret est le plus sûr.",
      action: "Ouvre Invest+ ou ignore si tu préfères la prudence",
      app: "invest",
      priority: 70,
    };
  }
  if (id.includes("crisis") || id.includes("survive")) {
    return {
      title: "Survivre à la tempête",
      description: "Un événement négatif va arriver. Garde du cash en réserve.",
      action: "Ne dépense pas tout — attends un événement",
      app: "guide",
      priority: 75,
    };
  }

  return {
    title: label,
    description: `Progression : ${progress}/${target}`,
    action: "Consulte le Guide pour les détails",
    app: "guide",
    priority: 50,
  };
}

function suggestBestApp(state: GameState): TabId {
  if (isAppFullyUnlocked(state, "business") && state.businesses.length === 0) return "business";
  if (isAppFullyUnlocked(state, "market") && state.stats.tradesMade === 0) return "market";
  if (isAppFullyUnlocked(state, "missions")) return "missions";
  return "dashboard";
}
