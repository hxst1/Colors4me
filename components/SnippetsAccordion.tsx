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

export default function SnippetsAccordion({ twCfg, scss, theme, themeMode = 'dark' }: SnippetsProps) {
    const [open, setOpen] = useState(false);
    const [cssFormat, setCssFormat] = useState<ColorFormat>('hex');

    const brand = useMemo(() => theme?.scale ?? {}, [theme?.scale]);
    const token = theme?.token ?? "brand";

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
        <div className="card" role="region" aria-labelledby="snippets-heading">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] rounded-t-2xl"
                aria-expanded={open}
                aria-controls="snippets-content"
            >
                <span id="snippets-heading" className="text-base font-semibold text-[var(--text-primary)]">
                    Copy-ready snippets
                </span>
                <svg
                    className={`h-5 w-5 transition-transform text-[var(--text-secondary)] ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            {open && (
                <div id="snippets-content" className="px-5 pb-5">
                    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                        {/* Tab buttons */}
                        <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Code snippets">
                            {tabs.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActive(t.id)}
                                    className={`text-sm px-3.5 py-2 rounded-lg border transition cursor-pointer font-medium ${active === t.id
                                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--interactive-hover)] hover:text-[var(--text-primary)]'
                                        }`}
                                    role="tab"
                                    aria-selected={active === t.id}
                                    aria-controls={`tabpanel-${t.id}`}
                                    id={`tab-${t.id}`}
                                >
                                    {t.title}
                                </button>
                            ))}
                        </div>

                        {/* Format selector for CSS tab */}
                        {activeTab?.hasFormatSelector && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] uppercase text-[var(--text-tertiary)] mr-1">Format:</span>
                                {(['hex', 'rgb', 'hsl', 'oklch'] as ColorFormat[]).map(fmt => (
                                    <button
                                        key={fmt}
                                        onClick={() => setCssFormat(fmt)}
                                        className={`px-2 py-1 text-[10px] uppercase font-mono rounded transition-colors border ${cssFormat === fmt
                                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--interactive-hover)] hover:text-[var(--text-primary)]'
                                            }`}
                                        aria-pressed={cssFormat === fmt}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tab panels */}
                    <div>
                        {tabs.map(t => (
                            <div
                                key={t.id}
                                hidden={active !== t.id}
                                role="tabpanel"
                                id={`tabpanel-${t.id}`}
                                aria-labelledby={`tab-${t.id}`}
                            >
                                <CodePanel
                                    title={t.title}
                                    filename={t.filename}
                                    lang={t.lang}
                                    code={t.code}
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
    { title, filename, lang, code }:
        { title: string; filename: string; lang: string; code: string; themeMode?: 'dark' | 'light' }
) {
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
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)] rounded-t-xl">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded border bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)]">
                        {filename}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded border uppercase bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-subtle)]">
                        {lang}
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setMinify(m => !m)}
                        className="btn-ghost text-xs px-2.5 py-1.5 border border-[var(--border-default)]"
                        title="Toggle minified view"
                    >
                        {minify ? "Unminify" : "Minify"}
                    </button>
                    <button
                        onClick={() => setWrap(w => !w)}
                        className="btn-ghost text-xs px-2.5 py-1.5 border border-[var(--border-default)]"
                        title="Toggle soft wrap"
                    >
                        {wrap ? "No wrap" : "Wrap"}
                    </button>
                    <button
                        onClick={() => downloadText(filename, displayCode)}
                        className="btn-secondary text-xs px-2.5 py-1.5"
                    >
                        Download
                    </button>
                    <button
                        onClick={onCopy}
                        className="btn-primary text-xs px-2.5 py-1.5"
                        aria-live="polite"
                    >
                        {copied ? "Copied ✓" : "Copy"}
                    </button>
                </div>
            </div>

            {/* Code content */}
            <div className={containerOverflow}>
                <div className="font-mono text-[14px] leading-7">
                    {lines.map((ln, i) => (
                        <div key={i} className="flex">
                            <div
                                className="select-none w-14 shrink-0 text-right pr-3 border-r border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                            >
                                <span className="inline-block w-full tabular-nums">{i + 1}</span>
                            </div>
                            <div
                                className={`flex-1 py-0 px-4 text-[var(--text-primary)] ${wrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
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