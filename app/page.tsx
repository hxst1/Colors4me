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
  const [base, setBase] = useState<string>("#826EE7");
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

  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Colors4me</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isDark
                ? 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900'
                : 'bg-white border-zinc-300 hover:bg-zinc-100'
                }`}
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? (
                <>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Light</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span className="text-xs font-medium">Dark</span>
                </>
              )}
            </button>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG"
              target="_blank"
              className={`text-xs underline ${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-600 hover:text-zinc-900'}`}
            >WCAG</a>
          </div>
        </header>

        <Controls base={base} setBase={setBase} token={token} setToken={setToken} baseHex={baseHex} theme={theme} />

        <section className="mt-6">
          <Preview color={scale["500"]} scale={scale} theme={theme} />
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-6">
          <div className={`border rounded-2xl p-4 ${isDark
            ? 'bg-zinc-900/60 border-zinc-800'
            : 'bg-white border-zinc-200'
            }`}>
            <h2 className="text-sm font-semibold mb-3">Generated scale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map(k => (
                <Swatch key={k} name={`${token}-${k}`} hex={scale[String(k)]} theme={theme} />
              ))}
            </div>
          </div>

          <AccessibilityPanel token={token} scale={scale} crWhite={crWhite} crBlack={crBlack} theme={theme} />
        </section>

        <section className="mt-8">
          <ColorBlindnessSimulator scale={scale} token={token} theme={theme} />
        </section>

        <section className="mt-8">
          <SnippetsAccordion cssVars={cssVars} twCfg={twCfg} scss={scss} theme={{ token, scale }} themeMode={theme} />
        </section>

        <footer className={`text-xs mt-10 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
          Crafted with ❤️ by hxst1 — built for developers. Copy the snippets into your project and ship.
        </footer>
      </div>
    </div>
  );
}