"use client";
import React from "react";
import { bestOnColor } from "@/lib/color";
export default function Preview({ color, scale }: { color: string; scale: Record<string, string> }) {
    return (
        <div>
            <h2 className="text-sm font-semibold mb-3">Preview</h2>
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-4 text-sm" style={{ background: color, color: bestOnColor(color) }}>
                        <strong>Solid button</strong>
                    </div>
                    <div className="p-4">
                        <button className="px-3 py-2 rounded-lg font-medium" style={{ background: color, color: bestOnColor(color) }}>Buy now</button>
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-4 text-sm" style={{ color: scale["500"] }}>
                        <strong>Brand text</strong>
                    </div>
                    <div className="p-4">
                        <p className="text-sm" style={{ color: scale["500"] }}>The quick brown fox jumps over the lazy dog.</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-4 text-sm" style={{ borderColor: scale["400"], color: scale["500"] }}>
                        <strong>Accent card</strong>
                    </div>
                    <div className="p-4 border-t" style={{ borderColor: scale["400"] }}>
                        <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${scale["400"]}, ${scale["600"]})` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
