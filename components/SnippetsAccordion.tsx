"use client";
import React, { useMemo, useState } from "react";

type Theme = { token: string; scale: Record<string, string> };
type Props = {
    cssVars: string;
    twCfg: string;
    scss: string;
    theme?: Theme;
};

function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

export default function SnippetsAccordion({ cssVars, twCfg, scss, theme }: Props) {
    const [open, setOpen] = useState(false);

    const brand = theme?.scale ?? {};
    const c500 = brand["500"] ?? "#7DD3FC";
    const c600 = brand["600"] ?? "#38BDF8";
    const c700 = brand["700"] ?? "#0EA5E9";
    const c200 = brand["200"] ?? "#BAE6FD";

    const tabs = useMemo(() => ([
        { id: "css", title: "CSS Variables", filename: "colors.css", lang: "css", code: cssVars },
        { id: "tw", title: "Tailwind Config (RGB)", filename: "tailwind.config.ts.txt", lang: "ts", code: twCfg },
        { id: "scss", title: "SCSS Palette & Mixins", filename: "_palette.scss", lang: "scss", code: scss },
    ]), [cssVars, twCfg, scss]);

    const [active, setActive] = useState<string>(tabs[0].id);

    return (
        <div
            className="rounded-2xl border bg-zinc-900/60 backdrop-blur"
            style={{ borderColor: `${c700}33` }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
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
                    <div className="flex items-center gap-2">
                        {tabs.map(t => {
                            const isActive = active === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActive(t.id)}
                                    className="text-sm px-3.5 py-2 rounded-lg border transition cursor-pointer"
                                    style={
                                        isActive
                                            ? { background: `${c700}22`, color: c200, borderColor: `${c700}55` }
                                            : { background: "rgba(24,24,27,0.6)", color: "#a1a1aa", borderColor: "rgba(39,39,42,1)" }
                                    }
                                    aria-pressed={isActive}
                                >
                                    {t.title}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4">
                        {tabs.map(t => (
                            <div key={t.id} hidden={active !== t.id}>
                                <CodePanel
                                    title={t.title}
                                    filename={t.filename}
                                    lang={t.lang}
                                    code={t.code}
                                    theme={{ c500, c600, c700, c200 }}
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
    { title, filename, lang, code, theme }:
        { title: string; filename: string; lang: string; code: string; theme: { c500: string; c600: string; c700: string; c200: string } }
) {
    const { c500, c600, c700, c200 } = theme;
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
            style={{ borderColor: `${c700}33`, background: "linear-gradient(180deg, rgba(12,12,13,0.9), rgba(12,12,13,0.7))" }}
        >
            <div
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b"
                style={{ borderColor: `${c700}33`, background: `linear-gradient(90deg, ${c700}22, transparent)` }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100">{title}</span>
                    <span
                        className="text-[11px] px-2 py-0.5 rounded border"
                        style={{ background: `${c700}22`, color: c200, borderColor: `${c700}55` }}
                    >
                        {filename}
                    </span>
                    <span
                        className="text-[11px] px-2 py-0.5 rounded border uppercase"
                        style={{ background: "rgba(24,24,27,0.6)", color: "#a1a1aa", borderColor: "rgba(39,39,42,1)" }}
                    >
                        {lang}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMinify(m => !m)}
                        className="text-sm px-3 py-1.5 rounded border cursor-pointer active:scale-[0.98]"
                        style={{ borderColor: `${c700}55`, color: c200, background: `${c700}15` }}
                        title="Toggle minified view"
                    >
                        {minify ? "Unminify" : "Minify"}
                    </button>
                    <button
                        onClick={() => setWrap(w => !w)}
                        className="text-sm px-3 py-1.5 rounded border cursor-pointer active:scale-[0.98]"
                        style={{ borderColor: `${c700}55`, color: c200, background: `${c700}15` }}
                        title="Toggle soft wrap"
                    >
                        {wrap ? "No wrap" : "Wrap"}
                    </button>
                    <button
                        onClick={() => downloadText(filename, displayCode)}
                        className="text-sm px-3 py-1.5 rounded border cursor-pointer active:scale-[0.98]"
                        style={{ borderColor: `${c600}66`, color: c200, background: `${c600}15` }}
                    >
                        Download
                    </button>
                    <button
                        onClick={onCopy}
                        className="text-sm px-3 py-1.5 rounded border font-medium cursor-pointer active:scale-[0.98]"
                        style={{ borderColor: `${c500}88`, color: "#0a0a0a", background: c200 }}
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
                                style={{ color: "#71717a", borderColor: "rgba(39,39,42,1)", background: "rgba(12,12,13,0.5)" }}
                            >
                                <span className="inline-block w-full tabular-nums">{i + 1}</span>
                            </div>
                            <div
                                className={`flex-1 py-0 px-4 text-zinc-200 ${wrap ? "whitespace-pre-wrap" : "whitespace-pre"
                                    }`}
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
