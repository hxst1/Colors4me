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

export default function AccessibilityPanel({ token, scale, crWhite, crBlack, theme = 'dark' }: Props) {
    const isDark = theme === 'dark';
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
        <div className={`border rounded-2xl p-4 ${isDark
                ? 'bg-zinc-900/60 border-zinc-800'
                : 'bg-white border-zinc-200'
            }`}>
            <h2 className="text-sm font-semibold mb-3">
                Accessibility (contrast vs {token}-500)
            </h2>
            <div className="space-y-3">
                {/* On brand color */}
                <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-zinc-300'
                        }`}
                    style={{ background: scale["500"], color: bestOnColor(scale["500"]) }}
                >
                    <div className="text-sm">
                        On <strong>{token}-500</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">White: {crWhite.toFixed(2)}:1</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crWhite, 'AA')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                        >
                            AA
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crWhite, 'AAA')
                                    ? 'bg-green-600 text-white'
                                    : isDark
                                        ? 'bg-zinc-800 text-zinc-400'
                                        : 'bg-zinc-200 text-zinc-500'
                                }`}
                        >
                            AAA
                        </span>
                    </div>
                </div>

                {/* On white */}
                <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${isDark
                            ? 'border-zinc-800 bg-white text-zinc-900'
                            : 'border-zinc-300 bg-white text-zinc-900'
                        }`}
                >
                    <div className="text-sm">
                        On <strong>white</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">{crOnWhite.toFixed(2)}:1</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crOnWhite, 'AA')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                        >
                            AA
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crOnWhite, 'AAA')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-zinc-200 text-zinc-500'
                                }`}
                        >
                            AAA
                        </span>
                    </div>
                </div>

                {/* On black */}
                <div
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100"
                >
                    <div className="text-sm">
                        On <strong>black</strong>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">{crOnBlack.toFixed(2)}:1</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crOnBlack, 'AA')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                        >
                            AA
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAAStatus(crOnBlack, 'AAA')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                        >
                            AAA
                        </span>
                    </div>
                </div>
            </div>
            <p className={`text-xs mt-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                Tip: use <span className="font-mono">var(--on-{token})</span> for legible text on your base color.
            </p>
        </div>
    );
}