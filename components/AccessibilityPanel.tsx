"use client";
import React from "react";
import { bestOnColor, hexToRgb, contrastRatio } from "@/lib/color";

type Props = {
    token: string;
    scale: Record<string, string>;
    crWhite: number;
    crBlack: number;
    theme?: 'dark' | 'light';
};

export default function AccessibilityPanel({ token, scale, crWhite }: Props) {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const c500 = hexToRgb(scale["500"]);

    const getAAStatus = (ratio: number, level: 'AA' | 'AAA') => {
        const threshold = level === 'AA' ? 4.5 : 7;
        return ratio >= threshold;
    };

    const crOnWhite = contrastRatio(c500, white);
    const crOnBlack = contrastRatio(c500, black);

    return (
        <div className="card p-4" role="region" aria-labelledby="accessibility-heading">
            <h2 id="accessibility-heading" className="text-sm font-semibold mb-3 text-[var(--text-primary)]">
                Accessibility (contrast vs {token}-500)
            </h2>
            <div className="space-y-3">
                {/* On brand color */}
                <div
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)]"
                    style={{ background: scale["500"], color: bestOnColor(scale["500"]) }}
                >
                    <div className="text-sm font-medium">
                        On <strong>{token}-500</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{crWhite.toFixed(2)}:1</span>
                        <span
                            className={`badge ${getAAStatus(crWhite, 'AA') ? 'badge-success' : 'badge-error'}`}
                            role="status"
                            aria-label={`AA ${getAAStatus(crWhite, 'AA') ? 'pass' : 'fail'}`}
                        >
                            AA
                        </span>
                        <span
                            className={`badge ${getAAStatus(crWhite, 'AAA') ? 'badge-success' : 'badge-neutral'}`}
                            role="status"
                            aria-label={`AAA ${getAAStatus(crWhite, 'AAA') ? 'pass' : 'fail'}`}
                        >
                            AAA
                        </span>
                    </div>
                </div>

                {/* On white */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-white text-zinc-900">
                    <div className="text-sm font-medium">
                        On <strong>white</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{crOnWhite.toFixed(2)}:1</span>
                        <span
                            className={`badge ${getAAStatus(crOnWhite, 'AA') ? 'badge-success' : 'badge-error'}`}
                            role="status"
                            aria-label={`AA ${getAAStatus(crOnWhite, 'AA') ? 'pass' : 'fail'}`}
                        >
                            AA
                        </span>
                        <span
                            className={`badge ${getAAStatus(crOnWhite, 'AAA') ? 'badge-success' : 'bg-zinc-200 text-zinc-600'}`}
                            role="status"
                            aria-label={`AAA ${getAAStatus(crOnWhite, 'AAA') ? 'pass' : 'fail'}`}
                        >
                            AAA
                        </span>
                    </div>
                </div>

                {/* On black */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100">
                    <div className="text-sm font-medium">
                        On <strong>black</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{crOnBlack.toFixed(2)}:1</span>
                        <span
                            className={`badge ${getAAStatus(crOnBlack, 'AA') ? 'badge-success' : 'badge-error'}`}
                            role="status"
                            aria-label={`AA ${getAAStatus(crOnBlack, 'AA') ? 'pass' : 'fail'}`}
                        >
                            AA
                        </span>
                        <span
                            className={`badge ${getAAStatus(crOnBlack, 'AAA') ? 'badge-success' : 'bg-zinc-800 text-zinc-400'}`}
                            role="status"
                            aria-label={`AAA ${getAAStatus(crOnBlack, 'AAA') ? 'pass' : 'fail'}`}
                        >
                            AAA
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-xs mt-3 text-[var(--text-secondary)]">
                Tip: use <code className="font-mono bg-[var(--bg-tertiary)] px-1 py-0.5 rounded">var(--on-{token})</code> for legible text on your base color.
            </p>
        </div>
    );
}