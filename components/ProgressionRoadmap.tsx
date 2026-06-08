"use client";

import type { GameState } from "@/types/game";
import { CAMPAIGN_CHAPTERS, getCurrentChapter } from "@/lib/campaign";
import {
  CAREER_RANKS,
  getCareerRank,
  getNextCareerRank,
  getLockedAppsSummary,
  APP_LABELS,
} from "@/lib/progression";

interface Props {
  state: GameState;
}

export default function ProgressionRoadmap({ state }: Props) {
  const rank = getCareerRank(state);
  const nextRank = getNextCareerRank(state);
  const currentCh = getCurrentChapter(state.campaign);
  const locked = getLockedAppsSummary(state);

  return (
    <div className="progression-roadmap">
      <section className="roadmap-section">
        <h3>🎖️ Carrière — Nv.{state.level}</h3>
        <p className="roadmap-rank">{rank.title}</p>
        <p className="roadmap-rank-desc">{rank.description}</p>
        {nextRank && (
          <p className="roadmap-next-rank">
            Prochain : <strong>{nextRank.title}</strong> au niveau {nextRank.minLevel}
            ({nextRank.minLevel - state.level} lvl restants)
          </p>
        )}
        <div className="roadmap-rank-bar">
          {CAREER_RANKS.map((r) => {
            const active = state.level >= r.minLevel;
            return (
              <div key={r.id} className={`roadmap-rank-node ${active ? "active" : ""}`} title={`Nv.${r.minLevel} — ${r.title}`}>
                <span className="roadmap-rank-dot" />
                <span className="roadmap-rank-label">{r.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="roadmap-section">
        <h3>📖 Chapitres ({state.campaign.completedChapters.length}/{CAMPAIGN_CHAPTERS.length})</h3>
        {CAMPAIGN_CHAPTERS.map((ch) => {
          const done = state.campaign.completedChapters.includes(ch.id);
          const current = ch.id === currentCh.id;
          return (
            <div
              key={ch.id}
              className={`roadmap-chapter ${done ? "done" : ""} ${current ? "current" : ""}`}
            >
              <span className="roadmap-ch-status">{done ? "✓" : current ? "→" : "○"}</span>
              <div>
                <strong>{ch.title.replace(/Chapitre \d+ — /, "")}</strong>
                {current && <p className="roadmap-ch-hint">En cours — chaque objectif = cash bonus</p>}
                {done && (
                  <p className="roadmap-ch-unlocks">
                    Débloque : {ch.unlockApps.filter((a) => a !== "guide" && a !== "settings" && a !== "dashboard").map((a) => APP_LABELS[a]).join(", ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {locked.length > 0 && (
        <section className="roadmap-section">
          <h3>🔓 Prochains déblocages</h3>
          {locked.slice(0, 4).map(({ app, info }) => (
            <div key={app} className="roadmap-locked">
              <strong>{APP_LABELS[app]}</strong>
              <span>{info.reason}</span>
              {info.progress !== undefined && info.target !== undefined && (
                <div className="roadmap-mini-bar">
                  <div style={{ width: `${Math.min(100, (info.progress / info.target) * 100)}%` }} />
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
