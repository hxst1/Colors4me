"use client";
import React, { useMemo, useState } from "react";
import { buildScale, parseHex, hexToRgb, contrastRatio, toCssVars, toTailwindConfig, toScss } from "@/lib/color";
import Controls from "@/components/Controls";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import Swatch from "@/components/Swatch";
import Preview from "@/components/Preview";
import SnippetsAccordion from "@/components/SnippetsAccordion";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

export default function Page() {
  const [base, setBase] = useState<string>("#826EE7");
  const [token, setToken] = useState<string>("brand");

  const baseHex = useMemo(() => parseHex(base) ?? "#826EE7", [base]);
  const scale = useMemo(() => buildScale(baseHex), [baseHex]);

  const c500 = hexToRgb(scale["500"]);

  const crWhite = useMemo(() => contrastRatio(c500, WHITE), [c500]);
  const crBlack = useMemo(() => contrastRatio(c500, BLACK), [c500]);

  const cssVars = useMemo(() => toCssVars(token, scale), [token, scale]);
  const twCfg = useMemo(() => toTailwindConfig(token, scale), [token, scale]);
  const scss = useMemo(() => toScss(token, scale), [token, scale]);

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Colors4me</h1>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG"
            target="_blank"
            className="text-xs text-zinc-400 underline"
          >WCAG</a>
        </header>

        <Controls base={base} setBase={setBase} token={token} setToken={setToken} baseHex={baseHex} />

        <section className="mt-6">
          <Preview color={scale["500"]} scale={scale} />
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Generated scale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map(k => (
                <Swatch key={k} name={`${token}-${k}`} hex={scale[String(k)]} />
              ))}
            </div>
          </div>

          <AccessibilityPanel token={token} scale={scale} crWhite={crWhite} crBlack={crBlack} />
        </section>

        <section className="mt-8">
          <SnippetsAccordion cssVars={cssVars} twCfg={twCfg} scss={scss} theme={{ token, scale }} />
        </section>

        <footer className="text-xs text-zinc-500 mt-10">
          Crafted with ❤️ by hxst1 — built for developers. Copy the snippets into your project and ship.
        </footer>
      </div>
    </div>
  );
}
