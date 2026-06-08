"use client";

import { Volume2, VolumeX, Smartphone, Save, Trash2 } from "lucide-react";

interface Props {
  soundEnabled: boolean;
  compactMode: boolean;
  onToggleSound: () => void;
  onToggleCompact: () => void;
  onSave: () => void;
  onReset: () => void;
}

export default function SettingsPanel({
  soundEnabled,
  compactMode,
  onToggleSound,
  onToggleCompact,
  onSave,
  onReset,
}: Props) {
  return (
    <div className="glass rounded-xl p-6 space-y-4 max-w-md">
      <h3 className="font-semibold">Paramètres</h3>

      <button
        onClick={onToggleSound}
        className="w-full flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10"
      >
        {soundEnabled ? <Volume2 className="h-5 w-5 text-emerald-400" /> : <VolumeX className="h-5 w-5 text-red-400" />}
        <span className="text-sm">{soundEnabled ? "Son activé" : "Son désactivé"}</span>
      </button>

      <button
        onClick={onToggleCompact}
        className="w-full flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10"
      >
        <Smartphone className="h-5 w-5 text-empire-blue" />
        <span className="text-sm">{compactMode ? "Mode compact activé" : "Mode normal"}</span>
      </button>

      <button
        onClick={onSave}
        className="w-full flex items-center gap-3 rounded-lg bg-emerald-600/20 p-3 hover:bg-emerald-600/30 text-emerald-300"
      >
        <Save className="h-5 w-5" />
        <span className="text-sm">Sauvegarder manuellement</span>
      </button>

      <button
        onClick={() => {
          if (confirm("Réinitialiser toute la progression ? Cette action est irréversible.")) {
            onReset();
          }
        }}
        className="w-full flex items-center gap-3 rounded-lg bg-red-600/20 p-3 hover:bg-red-600/30 text-red-300"
      >
        <Trash2 className="h-5 w-5" />
        <span className="text-sm">Reset progression</span>
      </button>

      <p className="text-xs text-slate-600 text-center">
        Autosave toutes les 5 secondes via localStorage.
      </p>
    </div>
  );
}
