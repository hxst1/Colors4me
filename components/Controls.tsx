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

export default function Controls({ base, setBase, token, setToken, baseHex }: Props) {
    const [format, setFormat] = useState<ColorFormat>('hex');

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
        <section className="grid md:grid-cols-3 gap-6 mb-2" aria-labelledby="controls-heading">
            <h2 id="controls-heading" className="sr-only">Color Controls</h2>

            {/* Base Color Input */}
            <div className="md:col-span-2 card p-4">
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="color-input" className="label mb-0">Base color</label>
                    <div className="flex gap-1" role="radiogroup" aria-label="Color format">
                        {(['hex', 'rgb', 'hsl', 'oklch'] as ColorFormat[]).map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => setFormat(fmt)}
                                className={`px-2 py-1 text-[10px] uppercase font-mono rounded transition-colors ${format === fmt
                                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--interactive-hover)] hover:text-[var(--text-primary)]'
                                    }`}
                                aria-pressed={format === fmt}
                                aria-label={`${fmt.toUpperCase()} format`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Color picker con wrapper visual */}
                    <div
                        className="relative h-10 w-14 rounded-lg border border-[var(--border-default)] overflow-hidden cursor-pointer hover:border-[var(--border-strong)] transition-colors shrink-0"
                        style={{ backgroundColor: baseHex }}
                    >
                        <input
                            type="color"
                            value={baseHex}
                            onChange={e => setBase(e.target.value)}
                            className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
                            aria-label="Color picker"
                        />
                    </div>
                    <input
                        id="color-input"
                        value={format === 'hex' ? base : getFormattedColor()}
                        onChange={e => setBase(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="input font-mono"
                        aria-describedby="color-format-hint"
                    />
                </div>
                <p id="color-format-hint" className="text-[10px] mt-2 font-mono text-[var(--text-tertiary)]">
                    Accepts: HEX, RGB, HSL, or OKLCH format
                </p>
            </div>

            {/* Token Name Input */}
            <div className="card p-4">
                <label htmlFor="token-input" className="label">Token name</label>
                <input
                    id="token-input"
                    value={token}
                    onChange={e => setToken(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                    className="input font-mono"
                    aria-describedby="token-hint"
                />
                <p id="token-hint" className="text-xs mt-2 text-[var(--text-secondary)]">
                    e.g. <span className="font-mono">brand</span>, <span className="font-mono">primary</span>, <span className="font-mono">accent</span>
                </p>
            </div>
        </section>
    );
}