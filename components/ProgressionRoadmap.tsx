"use client";

import type { GameState } from "@/types/game";
import {
  CAMPAIGN_CHAPTERS,
  getCurrentChapter,
} from "@/lib/campaign";
import {
  CAREER_RANKS,
  PLAYTIME_UNLOCKS,
  getCareerRank,
  getPlayMinutes,
  getLockedAppsSummary,
  APP_LABELS,
} from "@/lib/progression";
import { formatDuration } from "@/lib/formatMoney";

interface Props {
  state: GameState;
}

export default function ProgressionRoadmap({ state }: Props) {
  const mins = getPlayMinutes(state);
  const rank = getCareerRank(state);
  const currentCh = getCurrentChapter(state.campaign);
  const locked = getLockedAppsSummary(state);

  return (
    <div className="progression-roadmap">
      <section className="roadmap-section">
        <h3>🎖️ Carrière ({formatDuration(state.stats.playTimeSeconds)} jouées)</h3>
        <p className="roadmap-rank">{rank.title}</p>
        <p className="roadmap-rank-desc">{rank.description}</p>
        <div className="roadmap-rank-bar">
          {CAREER_RANKS.map((r, i) => {
            const active = mins >= r.minPlayMinutes;
            const next = CAREER_RANKS[i + 1];
            const progress = next
              ? Math.min(1, (mins - r.minPlayMinutes) / (next.minPlayMinutes - r.minPlayMinutes))
              : 1;
            return (
              <div key={r.id} className={`roadmap-rank-node ${active ? "active" : ""}`} title={r.title}>
                {active && i < CAREER_RANKS.length - 1 && (
                  <div className="roadmap-rank-fill" style={{ width: `${progress * 100}%` }} />
                )}
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
                {current && <p className="roadmap-ch-hint">En cours — vois les objectifs ci-dessus</p>}
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

      <section className="roadmap-section">
        <h3>⏱️ Récompenses temps de jeu</h3>
        {PLAYTIME_UNLOCKS.map((pu) => {
          const unlocked = state.progression.unlockedPlaytimeTiers.includes(pu.id);
          return (
            <div key={pu.id} className={`roadmap-time ${unlocked ? "done" : ""}`}>
              <span>{unlocked ? "✓" : `${pu.minPlayMinutes} min`}</span>
              <div>
                <strong>{pu.title}</strong>
                <p>{pu.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      {locked.length > 0 && (
        <section className="roadmap-section">
          <h3>🔒 Prochains déblocages</h3>
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
