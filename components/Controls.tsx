"use client";
import React, { useState } from "react";
import { formatRgb, formatHsl, formatOklch } from "@/lib/color";

type Props = {
    base: string;
    setBase: (v: string) => void;
    token: string;
    setToken: (v: string) => void;
    baseHex: string;
    theme: 'dark' | 'light';
};

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export default function Controls({ base, setBase, token, setToken, baseHex, theme }: Props) {
    const [format, setFormat] = useState<ColorFormat>('hex');

    const isDark = theme === 'dark';

    const getFormattedColor = () => {
        switch (format) {
            case 'hex': return baseHex;
            case 'rgb': return formatRgb(baseHex);
            case 'hsl': return formatHsl(baseHex);
            case 'oklch': return formatOklch(baseHex);
            default: return baseHex;
        }
    };

    const getPlaceholder = () => {
        switch (format) {
            case 'hex': return '#826EE7';
            case 'rgb': return 'rgb(130, 110, 231)';
            case 'hsl': return 'hsl(249, 71%, 67%)';
            case 'oklch': return 'oklch(0.598, 0.156, 283.5)';
            default: return '#826EE7';
        }
    };

    return (
        <section className="grid md:grid-cols-3 gap-6 mb-2">
            <div className={`md:col-span-2 backdrop-blur border rounded-2xl p-4 ${isDark
                    ? 'bg-zinc-900/60 border-zinc-800'
                    : 'bg-white border-zinc-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                    <label className={`block text-xs uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>Base color</label>
                    <div className="flex gap-1">
                        {(['hex', 'rgb', 'hsl', 'oklch'] as ColorFormat[]).map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => setFormat(fmt)}
                                className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors ${format === fmt
                                        ? isDark
                                            ? 'bg-zinc-700 text-zinc-100'
                                            : 'bg-zinc-200 text-zinc-900'
                                        : isDark
                                            ? 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700'
                                    }`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={baseHex}
                        onChange={e => setBase(e.target.value)}
                        className="h-10 w-14 cursor-pointer bg-transparent rounded-lg"
                    />
                    <input
                        value={format === 'hex' ? base : getFormattedColor()}
                        onChange={e => setBase(e.target.value)}
                        placeholder={getPlaceholder()}
                        className={`flex-1 border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 ${isDark
                                ? 'bg-zinc-950/50 border-zinc-800 focus:ring-zinc-600'
                                : 'bg-zinc-50 border-zinc-300 focus:ring-zinc-400'
                            }`}
                    />
                </div>
                <p className={`text-[10px] mt-2 font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                    }`}>
                    Accepts: HEX, RGB, HSL, or OKLCH format
                </p>
            </div>

            <div className={`backdrop-blur border rounded-2xl p-4 ${isDark
                    ? 'bg-zinc-900/60 border-zinc-800'
                    : 'bg-white border-zinc-200'
                }`}>
                <label className={`block text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>Token name</label>
                <input
                    value={token}
                    onChange={e => setToken(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                    className={`w-full border rounded-lg px-3 py-2 font-mono text-sm ${isDark
                            ? 'bg-zinc-950/50 border-zinc-800'
                            : 'bg-zinc-50 border-zinc-300'
                        }`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>e.g. <span className="font-mono">brand</span>, <span className="font-mono">primary</span>, <span className="font-mono">accent</span></p>
            </div>
        </section>
    );
}