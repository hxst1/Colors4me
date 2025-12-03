"use client";
import React, { useMemo, useState, useEffect } from "react";
import { buildScale, parseColor, hexToRgb, contrastRatio, toCssVars, toTailwindConfig, toScss } from "@/lib/color";
import Controls from "@/components/Controls";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import Swatch from "@/components/Swatch";
import Preview from "@/components/Preview";
import SnippetsAccordion from "@/components/SnippetsAccordion";
import ColorBlindnessSimulator from "@/components/ColorBlindness";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

type Theme = 'dark' | 'light';

export default function Page() {
  const [base, setBase] = useState<string>("#FFFFFF");
  const [token, setToken] = useState<string>("brand");
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('color-theme') as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('color-theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const baseHex = useMemo(() => parseColor(base) ?? "#826EE7", [base]);
  const scale = useMemo(() => buildScale(baseHex), [baseHex]);

  const c500 = hexToRgb(scale["500"]);

  const crWhite = useMemo(() => contrastRatio(c500, WHITE), [c500]);
  const crBlack = useMemo(() => contrastRatio(c500, BLACK), [c500]);

  const cssVars = useMemo(() => toCssVars(token, scale), [token, scale]);
  const twCfg = useMemo(() => toTailwindConfig(token, scale), [token, scale]);
  const scss = useMemo(() => toScss(token, scale), [token, scale]);
  const isDark = theme === 'dark';


  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stars")
      .then(r => r.json())
      .then(({ stars }) => { if (!cancelled) setStars(stars); })
      .catch(() => { if (!cancelled) setStars(null); });
    return () => { cancelled = true; };
  }, []);


  return (
    <div className="min-h-[100dvh] transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            COLOR 4 DEV
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub Star Button */}
            <a
              href="https://github.com/hxst1/Colors4dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all bg-[var(--bg-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-strong)] group"
              title="Star on GitHub"
              aria-label={`Star this repo${stars != null ? ` (${stars.toLocaleString()})` : ""}`}
            >
              <svg
                className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-amber-400 transition-colors"
                fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-primary)] hidden sm:inline">Star</span>

              {/* Contador en vivo */}
              {stars !== null && (
                <span
                  className="ml-1.5 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md
                 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]
                 text-[var(--text-secondary)]"
                  aria-live="polite"
                >
                  {stars.toLocaleString("en-US")}
                </span>
              )}
            </a>

            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all bg-[var(--bg-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-strong)]"
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? (
                <>
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Light</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Dark</span>
                </>
              )}
            </button>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline underline-offset-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:inline"
            >
              WCAG
            </a>
          </div>
        </header>

        {/* Controls */}
        <Controls base={base} setBase={setBase} token={token} setToken={setToken} baseHex={baseHex} theme={theme} />

        {/* Preview Section */}
        <section className="mt-6" aria-labelledby="preview-heading">
          <Preview color={scale["500"]} scale={scale} theme={theme} />
        </section>

        {/* Scale & Accessibility Grid */}
        <section className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="card p-4">
            <h2 id="scale-heading" className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Generated scale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map(k => (
                <Swatch key={k} name={`${token}-${k}`} hex={scale[String(k)]} theme={theme} />
              ))}
            </div>
          </div>

          <AccessibilityPanel token={token} scale={scale} crWhite={crWhite} crBlack={crBlack} theme={theme} />
        </section>

        {/* Color Blindness Simulator */}
        <section className="mt-8" aria-labelledby="colorblind-heading">
          <ColorBlindnessSimulator scale={scale} token={token} theme={theme} />
        </section>

        {/* Snippets */}
        <section className="mt-8" aria-labelledby="snippets-heading">
          <SnippetsAccordion cssVars={cssVars} twCfg={twCfg} scss={scss} theme={{ token, scale }} themeMode={theme} />
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-tertiary)]">
              Crafted with ❤️ by{" "}
              <a
                href="https://github.com/hxst1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
              >
                hxst1
              </a>
              {" "}— built for developers
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hxst1/Colors4dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
                View on GitHub
              </a>
              <a
                href="https://github.com/hxst1/Colors4dev/stargazers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-amber-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                </svg>
                Star this project
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}