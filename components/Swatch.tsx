"use client";
import React, { useState } from "react";
import { bestOnColor } from "@/lib/color";

type Props = {
    name: string;
    hex: string;
    theme?: 'dark' | 'light';
};

export default function Swatch({ name, hex, theme = 'dark' }: Props) {
    const [copied, setCopied] = useState(false);
    const isDark = theme === 'dark';
    const textColor = bestOnColor(hex);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <button
            onClick={handleCopy}
            className={`group relative rounded-lg p-3 transition-all cursor-pointer border ${isDark
                    ? 'hover:ring-2 hover:ring-zinc-700 border-zinc-800/50'
                    : 'hover:ring-2 hover:ring-zinc-300 border-zinc-300/50'
                }`}
            style={{ backgroundColor: hex }}
            title={`Click to copy ${hex}`}
        >
            <div className="flex flex-col gap-1.5">
                <div
                    className="text-xs font-mono font-semibold"
                    style={{ color: textColor }}
                >
                    {name}
                </div>
                <div
                    className="text-[11px] font-mono uppercase tracking-wider"
                    style={{ color: textColor, opacity: 0.8 }}
                >
                    {hex}
                </div>
            </div>

            {copied && (
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm"
                    style={{ backgroundColor: `${hex}cc` }}
                >
                    <span
                        className="text-xs font-semibold flex items-center gap-1"
                        style={{ color: textColor }}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                    </span>
                </div>
            )}
        </button>
    );
}