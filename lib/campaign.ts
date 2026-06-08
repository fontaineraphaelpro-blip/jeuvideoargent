import type { CampaignChapter, CampaignState, GameState, Playstyle, TabId } from "@/types/game";
import { getCampaignMetric } from "./campaignMetrics";
import { applyCapitalChange } from "./runEconomy";

export const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    id: "ch1_first_day",
    title: "Chapitre 1 — Premier jour au bureau",
    narrative:
      "Tu viens d'installer ton PC. 100 € en poche, zéro client. Ton voisin de bureau dit que « tout le monde finit riche ici » — c'est faux. Commence par closer des deals sur CashFlow.",
    objectives: [
      { id: "c1_clicks", label: "Closer 5 deals", metric: "total_clicks", target: 5 },
      { id: "c1_capital", label: "Atteindre 130 €", metric: "capital", target: 130 },
    ],
    hints: [
      "Ouvre CashFlow et spam « Clôturer un deal » — chaque clic = cash instant.",
      "Enchaîne les clics pour monter le combo x.",
      "Plus tu cliques, plus le Golden Rush se charge.",
    ],
    unlockApps: ["dashboard", "guide", "settings"],
    freedomNote: "Go go go — le momentum est ton meilleur allié.",
  },
  {
    id: "ch2_first_asset",
    title: "Chapitre 2 — Premier actif",
    narrative:
      "Un collègue te glisse qu'acheter un business génère du cash pendant que tu dors — mais ça coûte aussi de l'argent à entretenir. Les charges existent.",
    objectives: [
      { id: "c2_business", label: "Acheter un business", metric: "businesses_bought", target: 1 },
      { id: "c2_capital", label: "Garder 80 € minimum", metric: "capital", target: 80 },
    ],
    hints: [
      "Ouvre EmpireBiz — le Compte épargne est le plus sûr.",
      "Regarde tes charges fixes dans le Guide.",
      "Si tu dépenses tout, tu ne pourras plus payer les frais.",
    ],
    unlockApps: ["dashboard", "business", "guide", "missions", "settings"],
    freedomNote: "Achète vite — le passif fait exploser ton capital.",
  },
  {
    id: "ch3_market",
    title: "Chapitre 3 — Le marché t'attend",
    narrative:
      "TradeX Pro s'ouvre sur ton bureau. La bourse fictive peut te rendre riche… ou te ruiner. Certains y laissent leur loyer.",
    objectives: [
      { id: "c3_trade", label: "Faire 1 transaction", metric: "trades_made", target: 1 },
      { id: "c3_survive", label: "Survivre sans faillite", metric: "not_bankrupt", target: 1 },
    ],
    hints: [
      "Achète peu. Le marché baisse autant qu'il monte.",
      "Ne mets jamais tout ton capital en actions.",
      "Vends quand tu es en gain — la cupidité coûte cher.",
    ],
    unlockApps: ["dashboard", "business", "market", "guide", "missions", "settings"],
    freedomNote: "Tu peux éviter le marché entièrement et rester prudent.",
  },
  {
    id: "ch4_invest",
    title: "Chapitre 4 — Placements & risque",
    narrative:
      "Invest+ débloque des produits fictifs. Les rendements élevés cachent des pertes réelles. Ton indicateur de risque monte quand tu joues gros.",
    objectives: [
      { id: "c4_invest", label: "Investir ou refuser (libre)", metric: "investments_made", target: 1, optional: true },
      { id: "c4_risk", label: "Gérer ton risque (< 40 %)", metric: "risk_under_40", target: 1, optional: true },
      { id: "c4_capital", label: "Atteindre 500 €", metric: "capital", target: 500 },
    ],
    hints: [
      "Investir est optionnel — la prudence est une stratégie valide.",
      "Le Livret ne fait pas rêver, mais il ne t'arnaque pas.",
      "Si ton risque dépasse 60 %, prépare-toi aux catastrophes.",
    ],
    unlockApps: ["dashboard", "business", "market", "invest", "guide", "missions", "upgrades", "settings"],
    freedomNote: "Deux joueurs peuvent finir ce chapitre avec des stratégies opposées.",
  },
  {
    id: "ch5_crisis",
    title: "Chapitre 5 — La crise frappe",
    narrative:
      "Un email interne annonce des « réorganisations ». Les événements négatifs deviennent fréquents. Ceux qui survient ont gardé une réserve de cash.",
    objectives: [
      { id: "c5_survive_crisis", label: "Survivre à un événement négatif", metric: "survive_crisis", target: 1 },
      { id: "c5_reserve", label: "Avoir 300 € de réserve", metric: "capital", target: 300 },
    ],
    hints: [
      "Garde toujours 20 % de ton capital en liquidités.",
      "Les charges fixes continuent même quand tu perds.",
      "Un prêt d'urgence existe — mais la dette a un prix.",
    ],
    unlockApps: ["dashboard", "business", "market", "invest", "guide", "missions", "upgrades", "managers", "settings"],
    freedomNote: "Tu peux vendre des actifs en urgence si tu t'étouffes.",
  },
  {
    id: "ch6_empire",
    title: "Chapitre 6 — Construire ou brûler",
    narrative:
      "Le bureau se remplit de post-its. Tu n'es plus débutant — mais la moitié des entrepreneurs de ce coworking ont déjà fait faillite une fois.",
    objectives: [
      { id: "c6_businesses", label: "Posséder 3 business", metric: "unique_businesses", target: 3 },
      { id: "c6_income", label: "Ou : 50 €/sec de revenu", metric: "income_per_sec", target: 50, optional: true },
      { id: "c6_decision", label: "Prendre une décision stratégique", metric: "decisions_made", target: 1 },
    ],
    hints: [
      "Diversifie — un seul secteur peut s'effondrer.",
      "Les synergies aident, mais ne garantissent rien.",
      "Ambition ≠ garantie de succès.",
    ],
    unlockApps: ["dashboard", "business", "market", "invest", "guide", "missions", "upgrades", "managers", "achievements", "stats", "settings"],
    freedomNote: "Expansion agressive = gains rapides OU faillite rapide.",
  },
  {
    id: "ch7_million",
    title: "Chapitre 7 — Le million ou la rue",
    narrative:
      "Dernier palier du parcours guidé. Beaucoup s'arrêtent avant. D'autres font faillite ici. Le prestige n'est ouvert qu'aux rares qui atteignent le milliard.",
    objectives: [
      { id: "c7_capital", label: "Atteindre 50 000 €", metric: "capital", target: 50000 },
      { id: "c7_no_debt", label: "Finir sans dette (bonus)", metric: "debt_free", target: 1, optional: true },
    ],
    hints: [
      "À ce stade, une mauvaise décision peut tout effacer.",
      "Tu n'as pas besoin du million pour « gagner » — mais c'est le défi.",
      "La faillite n'est pas la fin : tu peux recommencer plus sage.",
    ],
    unlockApps: ["dashboard", "business", "market", "invest", "guide", "missions", "upgrades", "managers", "achievements", "stats", "prestige", "settings"],
    freedomNote: "Liberté totale — le jeu ne te handhold plus.",
  },
];

export const PLAYSTYLE_MODIFIERS: Record<
  Playstyle,
  { incomeMult: number; lossMult: number; overheadMult: number; riskMult: number; label: string; desc: string }
> = {
  conservative: {
    incomeMult: 0.85,
    lossMult: 0.5,
    overheadMult: 0.9,
    riskMult: 0.7,
    label: "Prudent",
    desc: "Moins de gains, beaucoup moins de pertes. Pour ceux qui veulent survivre.",
  },
  balanced: {
    incomeMult: 1,
    lossMult: 1,
    overheadMult: 1,
    riskMult: 1,
    label: "Équilibré",
    desc: "Le chemin standard. Gains et risques réalistes.",
  },
  aggressive: {
    incomeMult: 1.25,
    lossMult: 1.8,
    overheadMult: 1.2,
    riskMult: 1.4,
    label: "Ambitieux",
    desc: "+25 % gains, mais les pertes peuvent être brutales. Pas pour tout le monde.",
  },
};

export function getCurrentChapter(campaign: CampaignState): CampaignChapter {
  return CAMPAIGN_CHAPTERS.find((c) => c.id === campaign.chapterId) ?? CAMPAIGN_CHAPTERS[0];
}

export function isAppUnlocked(state: GameState, app: TabId): boolean {
  if (app === "guide" || app === "settings") return true;
  const chapter = getCurrentChapter(state.campaign);
  const allUnlocked = new Set<TabId>();
  for (const ch of CAMPAIGN_CHAPTERS) {
    if (state.campaign.completedChapters.includes(ch.id) || ch.id === chapter.id) {
      ch.unlockApps.forEach((a) => allUnlocked.add(a));
    }
  }
  chapter.unlockApps.forEach((a) => allUnlocked.add(a));
  return allUnlocked.has(app);
}

export function checkCampaignObjectives(state: GameState): GameState {
  const chapter = getCurrentChapter(state.campaign);
  const done = new Set(state.campaign.objectivesDone);
  let changed = false;

  const newlyDone: typeof chapter.objectives = [];

  for (const obj of chapter.objectives) {
    if (done.has(obj.id)) continue;
    const val = getCampaignMetric(state, obj.metric);
    if (val >= obj.target) {
      done.add(obj.id);
      changed = true;
      newlyDone.push(obj);
    }
  }

  if (!changed) return state;

  const required = chapter.objectives.filter((o) => !o.optional);
  const allRequiredDone = required.every((o) => done.has(o.id));

  let s = {
    ...state,
    campaign: { ...state.campaign, objectivesDone: [...done] },
  };

  for (const obj of newlyDone) {
    const reward = obj.optional ? 25 : 50;
    s = applyCapitalChange(s, reward);
    s = {
      ...s,
      notifications: [
        {
          id: `obj_${obj.id}_${Date.now()}`,
          title: `✅ ${obj.label}`,
          message: `+${reward} € — continue, t'es en feu !`,
          type: "success" as const,
          timestamp: Date.now(),
        },
        ...s.notifications,
      ].slice(0, 20),
    };
  }

  if (allRequiredDone) {
    const idx = CAMPAIGN_CHAPTERS.findIndex((c) => c.id === chapter.id);
    const next = CAMPAIGN_CHAPTERS[idx + 1];
    const chapterBonus = 150 + idx * 75;

    s = {
      ...s,
      campaign: {
        ...s.campaign,
        completedChapters: [...s.campaign.completedChapters, chapter.id],
        chapterId: next?.id ?? chapter.id,
        objectivesDone: [],
      },
    };

    s = applyCapitalChange(s, chapterBonus);
    s = {
      ...s,
      notifications: [
        {
          id: `ch_done_${chapter.id}`,
          title: `🚀 Chapitre terminé !`,
          message: `+${chapterBonus} € — ${next ? "nouvelle app débloquée !" : "parcours complété !"}`,
          type: "milestone" as const,
          timestamp: Date.now(),
        },
        ...s.notifications,
      ].slice(0, 20),
    };

    if (next) {
      s = {
        ...s,
        notifications: [
          {
            id: `ch_${Date.now()}`,
            title: `🔓 ${next.title}`,
            message: next.narrative.slice(0, 80) + "…",
            type: "info" as const,
            timestamp: Date.now(),
          },
          ...s.notifications,
        ].slice(0, 20),
      };
    } else if (s.capital >= 50_000) {
      s = { ...s, gamePhase: "won", endingTitle: "Investisseur accompli" };
    }
  }

  return s;
}
