"use client";

import { useState, useEffect, useCallback } from "react";
import { HiX, HiRefresh } from "react-icons/hi";

type Settings = {
  fontSize: -1 | 0 | 1 | 2;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
  readingGuide: boolean;
};

const DEFAULT: Settings = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  reduceMotion: false,
  readingGuide: false,
};

const LS_KEY = "prime-a11y";

function applyToDOM(s: Settings) {
  const h = document.documentElement;

  // Text size
  h.classList.remove("a11y-text-sm", "a11y-text-lg", "a11y-text-xl");
  if (s.fontSize === -1) h.classList.add("a11y-text-sm");
  if (s.fontSize === 1)  h.classList.add("a11y-text-lg");
  if (s.fontSize === 2)  h.classList.add("a11y-text-xl");

  // Composable CSS filters
  const filters: string[] = [];
  if (s.highContrast) filters.push("contrast(1.5)");
  if (s.grayscale)    filters.push("grayscale(1)");
  h.style.filter = filters.join(" ");

  // Class toggles
  h.classList.toggle("a11y-links",     s.highlightLinks);
  h.classList.toggle("a11y-no-motion", s.reduceMotion);
}

export default function AccessibilityToolbar() {
  const [open, setOpen]       = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [guideY, setGuideY]   = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Settings;
        setSettings(parsed);
        applyToDOM(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Sync to DOM + localStorage whenever settings change
  useEffect(() => {
    if (!mounted) return;
    applyToDOM(settings);
    try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings, mounted]);

  // Reading guide mouse tracking
  useEffect(() => {
    if (!settings.readingGuide) return;
    const onMove = (e: MouseEvent) => setGuideY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [settings.readingGuide]);

  const toggle = useCallback(<K extends keyof Settings>(key: K, val?: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: val !== undefined ? val : !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT);
    applyToDOM(DEFAULT);
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  if (!mounted) return null;

  const hasActive =
    settings.fontSize !== 0 ||
    settings.highContrast ||
    settings.grayscale ||
    settings.highlightLinks ||
    settings.reduceMotion ||
    settings.readingGuide;

  const Toggle = ({ keyName, label }: { keyName: "highContrast" | "grayscale" | "highlightLinks" | "reduceMotion" | "readingGuide"; label: string }) => {
    const on = settings[keyName] as boolean;
    return (
      <button
        onClick={() => toggle(keyName)}
        aria-pressed={on}
        className={`flex items-center justify-between px-4 py-3 border text-left transition-all duration-150 w-full ${
          on
            ? "bg-[#1B4332] text-white border-[#1B4332]"
            : "bg-white text-black/60 border-black/[0.1] hover:border-[#2D6A4F] hover:text-black"
        }`}
        style={{ fontSize: "var(--text-label)" }}
      >
        <span className="font-semibold">{label}</span>
        <span className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-200 shrink-0 ${on ? "bg-[#74C69D]" : "bg-black/15"}`}>
          <span className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-0"}`} />
        </span>
      </button>
    );
  };

  const fontSizes: { val: Settings["fontSize"]; label: string; size: string }[] = [
    { val: -1, label: "A−",  size: "10px" },
    { val:  0, label: "A",   size: "12px" },
    { val:  1, label: "A+",  size: "14px" },
    { val:  2, label: "A++", size: "16px" },
  ];

  return (
    <>
      {/* Reading guide line */}
      {settings.readingGuide && (
        <div
          className="fixed inset-x-0 pointer-events-none z-[9998]"
          style={{
            top: guideY - 20,
            height: 40,
            background: "rgba(116,198,157,0.15)",
            borderTop: "1px solid rgba(116,198,157,0.4)",
            borderBottom: "1px solid rgba(116,198,157,0.4)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility options"
          className="fixed bottom-20 right-6 z-[9999] w-72 bg-white border border-black/[0.1] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#1B4332]">
            <div>
              <p className="font-black text-white" style={{ fontSize: "var(--text-sm)" }}>
                Accessibility
              </p>
              <p className="text-white/40 mt-0.5" style={{ fontSize: "9px" }}>
                WCAG 2.1 tools
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white p-1 transition-colors"
              aria-label="Close accessibility panel"
            >
              <HiX size={16} />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-6">

            {/* Text size */}
            <div>
              <p className="font-semibold text-black/35 tracking-[0.18em] uppercase mb-3" style={{ fontSize: "9px" }}>
                Text Size
              </p>
              <div className="flex gap-1">
                {fontSizes.map(({ val, label, size }) => {
                  const active = settings.fontSize === val;
                  return (
                    <button
                      key={val}
                      onClick={() => toggle("fontSize", val)}
                      aria-pressed={active}
                      aria-label={`Text size ${label}`}
                      className={`flex-1 py-3 font-black border transition-all duration-150 ${
                        active
                          ? "bg-[#1B4332] text-white border-[#1B4332]"
                          : "bg-white text-black/40 border-black/[0.12] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                      }`}
                      style={{ fontSize: size }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vision */}
            <div>
              <p className="font-semibold text-black/35 tracking-[0.18em] uppercase mb-3" style={{ fontSize: "9px" }}>
                Vision
              </p>
              <div className="flex flex-col gap-1.5">
                <Toggle keyName="highContrast"   label="High Contrast"    />
                <Toggle keyName="grayscale"       label="Grayscale"        />
                <Toggle keyName="highlightLinks"  label="Highlight Links"  />
              </div>
            </div>

            {/* Motion & Navigation */}
            <div>
              <p className="font-semibold text-black/35 tracking-[0.18em] uppercase mb-3" style={{ fontSize: "9px" }}>
                Motion & Navigation
              </p>
              <div className="flex flex-col gap-1.5">
                <Toggle keyName="reduceMotion"  label="Reduce Motion"  />
                <Toggle keyName="readingGuide"  label="Reading Guide"  />
              </div>
            </div>

            {/* Reset */}
            {hasActive && (
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 w-full py-3 border border-black/[0.08] text-black/35 hover:border-red-300 hover:text-red-400 transition-all duration-150"
                style={{ fontSize: "var(--text-label)" }}
              >
                <HiRefresh size={13} />
                Reset all settings
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle accessibility options"
        aria-expanded={open}
        aria-controls="a11y-panel"
        className={`fixed bottom-6 right-6 z-[9999] w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 ${
          open || hasActive
            ? "bg-[#74C69D] text-[#1B4332]"
            : "bg-[#1B4332] text-white hover:bg-[#2D6A4F]"
        }`}
      >
        {/* Universal accessibility person symbol */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="4" r="2" fill="currentColor" />
          <path d="M6 9.5l4 1.5v4L8 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 9.5l-4 1.5v4l2 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        {/* Active indicator dot */}
        {hasActive && !open && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#74C69D] border-2 border-white" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
