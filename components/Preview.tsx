"use client";
import React from "react";
import { bestOnColor } from "@/lib/color";

type Props = {
    color: string;
    scale: Record<string, string>;
    theme?: 'dark' | 'light';
};

export default function Preview({ color, scale, theme = 'dark' }: Props) {
    const isDark = theme === 'dark';

    return (
        <div>
            <h2 className="text-sm font-semibold mb-3">Preview</h2>
            <div className="grid sm:grid-cols-3 gap-4">
                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`}>
                    <div
                        className="p-4 text-sm"
                        style={{ background: color, color: bestOnColor(color) }}
                    >
                        <strong>Solid button</strong>
                    </div>
                    <div className={`p-4 ${isDark ? 'bg-zinc-900/60' : 'bg-white'}`}>
                        <button
                            className="px-3 py-2 rounded-lg font-medium transition-transform active:scale-95"
                            style={{ background: color, color: bestOnColor(color) }}
                        >
                            Buy now
                        </button>
                    </div>
                </div>

                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`}>
                    <div
                        className="p-4 text-sm"
                        style={{ color: scale["500"] }}
                    >
                        <strong>Brand text</strong>
                    </div>
                    <div className={`p-4 ${isDark ? 'bg-zinc-900/60' : 'bg-white'}`}>
                        <p
                            className="text-sm"
                            style={{ color: scale["500"] }}
                        >
                            The quick brown fox jumps over the lazy dog.
                        </p>
                    </div>
                </div>

                <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`}>
                    <div
                        className="p-4 text-sm"
                        style={{ borderColor: scale["400"], color: scale["500"] }}
                    >
                        <strong>Accent card</strong>
                    </div>
                    <div
                        className={`p-4 border-t ${isDark ? 'bg-zinc-900/60' : 'bg-white'}`}
                        style={{ borderColor: scale["400"] }}
                    >
                        <div
                            className="h-2 rounded-full"
                            style={{ background: `linear-gradient(90deg, ${scale["400"]}, ${scale["600"]})` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}