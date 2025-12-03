"use client";
import React, { useMemo, useState } from "react";
import { formatRgb, formatHsl, formatOklch } from "@/lib/color";

type Theme = { token: string; scale: Record<string, string> };
type Props = {
    cssVars: string;
    twCfg: string;
    scss: string;
    theme?: Theme;
};

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

function convertScaleFormat(scale: Record<string, string>, format: ColorFormat): Record<string, string> {
    const result: Record<string, string> = {};
    Object.entries(scale).forEach(([k, hex]) => {
        switch (format) {
            case 'hex':
                result[k] = hex;
                break;
            case 'rgb':
                result[k] = formatRgb(hex);
                break;
            case 'hsl':
                result[k] = formatHsl(hex);
                break;
            case 'oklch':
                result[k] = formatOklch(hex);
                break;
        }
    });
    return result;
}

function generateCssVarsWithFormat(name: string, scale: Record<string, string>, format: ColorFormat): string {
    const converted = convertScaleFormat(scale, format);
    const lines = [":root {"];
    lines.push(`  --${name}: ${converted["500"]};`);
    Object.entries(converted).forEach(([k, v]) => {
        lines.push(`  --${name}-${k}: ${v};`);
    });
    lines.push("}");
    return lines.join("\n");
}

type SnippetsProps = Props & { themeMode?: 'dark' | 'light' };

export default function SnippetsAccordion({ cssVars, twCfg, scss, theme, themeMode = 'dark' }: SnippetsProps) {
    const [open, setOpen] = useState(false);
    const [cssFormat, setCssFormat] = useState<ColorFormat>('hex');

    const isDark = themeMode === 'dark';
    const brand = theme?.scale ?? {};
    const token = theme?.token ?? "brand";
    const c500 = brand["500"] ?? "#7DD3FC";
    const c600 = brand["600"] ?? "#38BDF8";
    const c700 = brand["700"] ?? "#0EA5E9";
    const c200 = brand["200"] ?? "#BAE6FD";

    const cssVarsFormatted = useMemo(() =>
        generateCssVarsWithFormat(token, brand, cssFormat),
        [token, brand, cssFormat]
    );

    const tabs = useMemo(() => ([
        { id: "css", title: "CSS Variables", filename: "colors.css", lang: "css", code: cssVarsFormatted, hasFormatSelector: true },
        { id: "tw", title: "Tailwind Config (RGB)", filename: "tailwind.config.ts.txt", lang: "ts", code: twCfg, hasFormatSelector: false },
        { id: "scss", title: "SCSS Palette & Mixins", filename: "_palette.scss", lang: "scss", code: scss, hasFormatSelector: false },
    ]), [cssVarsFormatted, twCfg, scss]);

    const [active, setActive] = useState<string>(tabs[0].id);

    const activeTab = tabs.find(t => t.id === active);

    return (
        <div
            className={`rounded-2xl border backdrop-blur ${isDark ? 'bg-zinc-900/60' : 'bg-white'
                }`}
            style={{ borderColor: isDark ? `${c700}33` : `${c700}22` }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors ${isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-zinc-50'
                    }`}
            >
                <span className="text-base font-semibold">Copy-ready snippets</span>
                <svg
                    className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{ color: c200 }}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            {open && (
                <div className="px-5 pb-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            {tabs.map(t => {
                                const isActive = active === t.id;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setActive(t.id)}
                                        className="text-sm px-3.5 py-2 rounded-lg border transition cursor-pointer font-medium"
                                        style={
                                            isActive
                                                ? isDark
                                                    ? { background: `${c700}22`, color: c200, borderColor: `${c700}55` }
                                                    : { background: c500, color: '#ffffff', borderColor: c600 }
                                                : isDark
                                                    ? { background: "rgba(24,24,27,0.6)", color: "#a1a1aa", borderColor: "rgba(39,39,42,1)" }
                                                    : { background: "rgba(244,244,245,1)", color: "#52525b", borderColor: "rgba(228,228,231,1)" }
                                        }
                                        aria-pressed={isActive}
                                    >
                                        {t.title}
                                    </button>
                                );
                            })}
                        </div>

                        {activeTab?.hasFormatSelector && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] uppercase text-zinc-500 mr-1">Format:</span>
                                {(['hex', 'rgb', 'hsl', 'oklch'] as ColorFormat[]).map(fmt => (
                                    <button
                                        key={fmt}
                                        onClick={() => setCssFormat(fmt)}
                                        className={`px-2 py-1 text-[10px] uppercase font-mono rounded transition-colors ${cssFormat === fmt
                                                ? 'text-zinc-100'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                        style={cssFormat === fmt ? {
                                            background: `${c700}33`,
                                            borderColor: `${c700}55`,
                                            border: '1px solid'
                                        } : {
                                            background: 'rgba(24,24,27,0.4)'
                                        }}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        {tabs.map(t => (
                            <div key={t.id} hidden={active !== t.id}>
                                <CodePanel
                                    title={t.title}
                                    filename={t.filename}
                                    lang={t.lang}
                                    code={t.code}
                                    theme={{ c500, c600, c700, c200 }}
                                    themeMode={themeMode}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CodePanel(
    { title, filename, lang, code, theme, themeMode = 'dark' }:
        { title: string; filename: string; lang: string; code: string; theme: { c500: string; c600: string; c700: string; c200: string }; themeMode?: 'dark' | 'light' }
) {
    const { c500, c600, c700, c200 } = theme;
    const isDark = themeMode === 'dark';
    const [copied, setCopied] = useState(false);
    const [wrap, setWrap] = useState(true);
    const [minify, setMinify] = useState(false);

    const displayCode = useMemo(() => {
        if (!minify) return code.replace(/\r\n/g, "\n");
        return code.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    }, [code, minify]);

    const lines = useMemo(() => displayCode.split("\n"), [displayCode]);

    const onCopy = async () => {
        await navigator.clipboard.writeText(displayCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const containerOverflow = wrap ? "overflow-hidden" : "overflow-x-auto";

    return (
        <div
            className="rounded-xl border"
            style={{
                borderColor: isDark ? `${c700}33` : `${c700}22`,
                background: isDark
                    ? "linear-gradient(180deg, rgba(12,12,13,0.9), rgba(12,12,13,0.7))"
                    : "linear-gradient(180deg, rgba(250,250,250,0.9), rgba(255,255,255,0.7))"
            }}
        >
            <div
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b"
                style={{
                    borderColor: isDark ? `${c700}33` : `${c700}22`,
                    background: `linear-gradient(90deg, ${c700}22, transparent)`
                }}
            >
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'
                        }`}>{title}</span>
                    <span
                        className="text-[11px] px-2 py-0.5 rounded border"
                        style={{ background: `${c700}22`, color: c200, borderColor: `${c700}55` }}
                    >
                        {filename}
                    </span>
                    <span
                        className="text-[11px] px-2 py-0.5 rounded border uppercase"
                        style={{
                            background: isDark ? "rgba(24,24,27,0.6)" : "rgba(244,244,245,0.9)",
                            color: isDark ? "#a1a1aa" : "#71717a",
                            borderColor: isDark ? "rgba(39,39,42,1)" : "rgba(228,228,231,1)"
                        }}
                    >
                        {lang}
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setMinify(m => !m)}
                        className="text-xs px-2.5 py-1.5 rounded border cursor-pointer active:scale-[0.98] transition-transform font-medium"
                        style={{
                            borderColor: isDark ? `${c700}55` : `${c600}66`,
                            color: isDark ? c200 : c600,
                            background: isDark ? `${c700}15` : `${c500}10`
                        }}
                        title="Toggle minified view"
                    >
                        {minify ? "Unminify" : "Minify"}
                    </button>
                    <button
                        onClick={() => setWrap(w => !w)}
                        className="text-xs px-2.5 py-1.5 rounded border cursor-pointer active:scale-[0.98] transition-transform font-medium"
                        style={{
                            borderColor: isDark ? `${c700}55` : `${c600}66`,
                            color: isDark ? c200 : c600,
                            background: isDark ? `${c700}15` : `${c500}10`
                        }}
                        title="Toggle soft wrap"
                    >
                        {wrap ? "No wrap" : "Wrap"}
                    </button>
                    <button
                        onClick={() => downloadText(filename, displayCode)}
                        className="text-xs px-2.5 py-1.5 rounded border cursor-pointer active:scale-[0.98] transition-transform font-medium"
                        style={{
                            borderColor: isDark ? `${c600}66` : c600,
                            color: isDark ? c200 : '#ffffff',
                            background: isDark ? `${c600}15` : c600
                        }}
                    >
                        Download
                    </button>
                    <button
                        onClick={onCopy}
                        className="text-xs px-2.5 py-1.5 rounded border font-semibold cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
                        style={{
                            borderColor: isDark ? `${c500}88` : c700,
                            color: '#ffffff',
                            background: isDark ? c500 : c700
                        }}
                    >
                        {copied ? "Copied ✓" : "Copy"}
                    </button>
                </div>
            </div>

            <div className={containerOverflow}>
                <div className="font-mono text-[14px] leading-7">
                    {lines.map((ln, i) => (
                        <div key={i} className="flex">
                            <div
                                className="select-none w-14 shrink-0 text-right pr-3 border-r"
                                style={{
                                    color: isDark ? "#71717a" : "#a1a1aa",
                                    borderColor: isDark ? "rgba(39,39,42,1)" : "rgba(228,228,231,1)",
                                    background: isDark ? "rgba(12,12,13,0.5)" : "rgba(244,244,245,0.5)"
                                }}
                            >
                                <span className="inline-block w-full tabular-nums">{i + 1}</span>
                            </div>
                            <div
                                className={`flex-1 py-0 px-4 ${isDark ? 'text-zinc-200' : 'text-zinc-800'
                                    } ${wrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
                                style={{
                                    minWidth: 0,
                                    overflowWrap: "anywhere",
                                    wordBreak: "break-word",
                                }}
                            >
                                {ln.length ? ln : "\u00A0"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}