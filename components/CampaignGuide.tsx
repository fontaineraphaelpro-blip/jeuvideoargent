"use client";

import { BookOpen, AlertTriangle, Target, TrendingUp } from "lucide-react";
import type { GameState } from "@/types/game";
import { getCurrentChapter } from "@/lib/campaign";
import { formatMoney } from "@/lib/formatMoney";
import { getCampaignMetric } from "@/lib/campaignMetrics";
import { getChapterProgress, getCareerRank, getPlaytimeBonus } from "@/lib/progression";
import ProgressionRoadmap from "./ProgressionRoadmap";

interface Props {
  state: GameState;
  onTakeLoan?: () => void;
  onEmergencySell?: (id: string) => void;
}

export default function CampaignGuide({ state, onTakeLoan, onEmergencySell }: Props) {
  const chapter = getCurrentChapter(state.campaign);
  const done = new Set(state.campaign.objectivesDone);
  const chProgress = getChapterProgress(state);
  const rank = getCareerRank(state);
  const timeBonus = getPlaytimeBonus(state);

  return (
    <div className="campaign-guide">
      {/* Résumé rapide — toujours visible */}
      <div className="guide-summary">
        <div className="guide-summary-item">
          <span className="guide-summary-label">Rang</span>
          <span className="guide-summary-value text-empire-gold">{rank.title}</span>
        </div>
        <div className="guide-summary-item">
          <span className="guide-summary-label">Chapitre</span>
          <span className="guide-summary-value">{state.campaign.completedChapters.length + 1}/7</span>
        </div>
        <div className="guide-summary-item">
          <span className="guide-summary-label">Bonus temps</span>
          <span className="guide-summary-value text-emerald-400">+{(timeBonus * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="campaign-guide-header">
        <BookOpen className="h-4 w-4 text-empire-gold" />
        <div>
          <h2>{chapter.title}</h2>
          <p>{chapter.narrative}</p>
        </div>
      </div>

      {/* Barre de progression chapitre */}
      <div className="chapter-progress-block">
        <div className="chapter-progress-label">
          <span>Progression du chapitre</span>
          <span>{chProgress.current}/{chProgress.total} objectifs</span>
        </div>
        <div className="chapter-progress-bar">
          <div className="chapter-progress-fill" style={{ width: `${chProgress.percent}%` }} />
        </div>
      </div>

      {chapter.freedomNote && (
        <p className="campaign-freedom">{chapter.freedomNote}</p>
      )}

      <div className="campaign-objectives">
        <h3><Target className="h-3.5 w-3.5 inline mr-1" />À faire maintenant</h3>
        {chapter.objectives.map((obj) => {
          const progress = getCampaignMetric(state, obj.metric);
          const complete = done.has(obj.id) || progress >= obj.target;
          const pct = Math.min(100, (progress / obj.target) * 100);
          return (
            <div key={obj.id} className={`campaign-obj ${complete ? "campaign-obj--done" : ""}`}>
              <div className="campaign-obj-top">
                <span>{obj.optional ? "○ Optionnel" : "● Obligatoire"} — {obj.label}</span>
                <span>{Math.min(progress, obj.target)}/{obj.target}</span>
              </div>
              {!complete && (
                <div className="campaign-obj-bar">
                  <div style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="campaign-hints">
        <h3>💡 Comprendre ce chapitre</h3>
        {chapter.hints.map((h, i) => (
          <p key={i}>{i + 1}. {h}</p>
        ))}
      </div>

      <div className="campaign-economy">
        <h3><AlertTriangle className="h-3.5 w-3.5 inline mr-1" />Ta situation</h3>
        <div className="economy-grid">
          <div className="economy-cell">
            <span>Capital</span>
            <strong className={state.capital < 100 ? "text-red-400" : "text-emerald-400"}>{formatMoney(state.capital)}</strong>
          </div>
          <div className="economy-cell">
            <span>Revenu/sec</span>
            <strong className="text-emerald-400">+{formatMoney(state.incomePerSecond)}</strong>
          </div>
          <div className="economy-cell">
            <span>Charges/sec</span>
            <strong className="text-orange-400">-{formatMoney(state.runEconomy.overheadPerSec)}</strong>
          </div>
          <div className="economy-cell">
            <span>Bilan net/sec</span>
            <strong className={state.incomePerSecond - state.runEconomy.overheadPerSec >= 0 ? "text-emerald-400" : "text-red-400"}>
              {formatMoney(state.incomePerSecond - state.runEconomy.overheadPerSec)}/s
            </strong>
          </div>
        </div>
        <p className="economy-explainer">
          <TrendingUp className="h-3 w-3 inline" /> Si le bilan net est négatif, tu perds de l&apos;argent en continu même sans rien faire.
        </p>
        {state.runEconomy.debt > 0 && (
          <div className="campaign-stat-row">
            <span>Dette</span><span className="text-red-400">{formatMoney(state.runEconomy.debt)}</span>
          </div>
        )}
        {state.gamePhase === "struggling" && (
          <div className="campaign-warning">
            Tu dépenses plus que tu gagnes. Réduis tes charges ou génère plus de cash.
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

      <ProgressionRoadmap state={state} />
    </div>
  );
}
