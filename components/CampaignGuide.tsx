"use client";

import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, Target } from "lucide-react";
import type { GameState } from "@/types/game";
import { getCurrentChapter } from "@/lib/campaign";
import { formatMoney } from "@/lib/formatMoney";
import { getCampaignMetric } from "@/lib/campaignMetrics";

interface Props {
  state: GameState;
  onTakeLoan?: () => void;
  onEmergencySell?: (id: string) => void;
}

export default function CampaignGuide({ state, onTakeLoan, onEmergencySell }: Props) {
  const chapter = getCurrentChapter(state.campaign);
  const done = new Set(state.campaign.objectivesDone);

  return (
    <div className="campaign-guide">
      <div className="campaign-guide-header">
        <BookOpen className="h-4 w-4 text-empire-gold" />
        <div>
          <h2>{chapter.title}</h2>
          <p>{chapter.narrative}</p>
        </div>
      </div>

      {chapter.freedomNote && (
        <p className="campaign-freedom">{chapter.freedomNote}</p>
      )}

      <div className="campaign-objectives">
        <h3><Target className="h-3.5 w-3.5 inline mr-1" />Objectifs</h3>
        {chapter.objectives.map((obj) => {
          const progress = getCampaignMetric(state, obj.metric);
          const complete = done.has(obj.id) || progress >= obj.target;
          return (
            <div key={obj.id} className={`campaign-obj ${complete ? "campaign-obj--done" : ""}`}>
              <span>{obj.optional ? "○" : "●"} {obj.label}</span>
              <span>{Math.min(progress, obj.target)}/{obj.target}</span>
            </div>
          );
        })}
      </div>

      <div className="campaign-hints">
        <h3>Conseils</h3>
        {chapter.hints.map((h, i) => (
          <p key={i}>• {h}</p>
        ))}
      </div>

      <div className="campaign-economy">
        <h3><AlertTriangle className="h-3.5 w-3.5 inline mr-1" />Santé financière</h3>
        <div className="campaign-stat-row">
          <span>Capital</span><span className={state.capital < 100 ? "text-red-400" : "text-emerald-400"}>{formatMoney(state.capital)}</span>
        </div>
        <div className="campaign-stat-row">
          <span>Charges/sec</span><span className="text-orange-400">-{formatMoney(state.runEconomy.overheadPerSec)}/s</span>
        </div>
        <div className="campaign-stat-row">
          <span>Revenu/sec</span><span className="text-emerald-400">+{formatMoney(state.incomePerSecond)}/s</span>
        </div>
        {state.runEconomy.debt > 0 && (
          <div className="campaign-stat-row">
            <span>Dette</span><span className="text-red-400">{formatMoney(state.runEconomy.debt)}</span>
          </div>
        )}
        {state.gamePhase === "struggling" && (
          <div className="campaign-warning">
            ⚠️ Tu brûles plus que tu gagnes. Réduis tes charges ou trouve du cash.
            {onTakeLoan && (
              <button className="campaign-action-btn" onClick={onTakeLoan}>Prêt d&apos;urgence</button>
            )}
            {onEmergencySell && state.businesses[0] && (
              <button className="campaign-action-btn" onClick={() => onEmergencySell(state.businesses[0].id)}>
                Vendre un business (-60%)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
