"use client";
import React, { useState } from "react";
import { bestOnColor } from "@/lib/color";

type Props = {
    color: string;
    scale: Record<string, string>;
    theme?: 'dark' | 'light';
};

export default function Preview({ scale }: Props) {
    const [liked, setLiked] = useState(false);
    const [progress] = useState(67);
    const [isOn, setIsOn] = useState(true);

    return (
        <div>
            <h2 id="preview-heading" className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Preview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Notification Card */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: `${scale["500"]}22` }}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={scale["500"]} strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--text-primary)]">New message</p>
                                <p className="text-xs text-[var(--text-secondary)] truncate">Sarah sent you a photo...</p>
                            </div>
                            <span
                                className="w-2 h-2 rounded-full shrink-0 mt-2"
                                style={{ background: scale["500"] }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[var(--text-secondary)]">Monthly revenue</span>
                            <span
                                className="text-xs font-medium px-1.5 py-0.5 rounded"
                                style={{ background: `${scale["500"]}22`, color: scale["600"] }}
                            >
                                +12.5%
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">$48,294</p>
                        <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${scale["400"]}, ${scale["600"]})` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Interactive Button Group */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div className="flex flex-col gap-2">
                            <button
                                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all active:scale-[0.98]"
                                style={{ background: scale["500"], color: bestOnColor(scale["500"]) }}
                            >
                                Primary action
                            </button>
                            <button
                                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm border-2 transition-all active:scale-[0.98]"
                                style={{
                                    borderColor: scale["500"],
                                    color: scale["500"],
                                    background: 'transparent'
                                }}
                            >
                                Secondary
                            </button>
                            <button
                                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all active:scale-[0.98]"
                                style={{
                                    background: `${scale["500"]}15`,
                                    color: scale["600"]
                                }}
                            >
                                Ghost button
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Profile Mini */}
                <div className="card overflow-hidden">
                    <div
                        className="h-12"
                        style={{ background: `linear-gradient(135deg, ${scale["400"]}, ${scale["600"]})` }}
                    />
                    <div className="p-4 bg-[var(--bg-secondary)] -mt-6">
                        <div
                            className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg font-bold mb-2"
                            style={{
                                background: scale["500"],
                                color: bestOnColor(scale["500"]),
                                borderColor: 'var(--bg-secondary)'
                            }}
                        >
                            JD
                        </div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">Jane Doe</p>
                        <p className="text-xs text-[var(--text-secondary)]">Product Designer</p>
                    </div>
                </div>

                {/* Toggle Switch */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">Dark mode</p>
                                <p className="text-xs text-[var(--text-secondary)]">Enable night theme</p>
                            </div>
                            <button
                                onClick={() => setIsOn(!isOn)}
                                className="relative w-11 h-6 rounded-full transition-colors duration-200"
                                style={{ background: isOn ? scale["500"] : 'var(--bg-tertiary)' }}
                                role="switch"
                                aria-checked={isOn}
                                aria-label={`Dark mode toggle, currently ${isOn ? 'on' : 'off'}`}
                            >
                                <span
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                                    style={{ transform: isOn ? 'translateX(20px)' : 'translateX(0)' }}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Like Button */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setLiked(!liked)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95"
                                style={{
                                    background: liked ? scale["500"] : 'var(--bg-tertiary)',
                                    color: liked ? bestOnColor(scale["500"]) : 'var(--text-secondary)'
                                }}
                            >
                                <svg
                                    className="w-5 h-5 transition-transform"
                                    fill={liked ? "currentColor" : "none"}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    style={{ transform: liked ? 'scale(1.1)' : 'scale(1)' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-sm font-medium">{liked ? '1,249' : '1,248'}</span>
                            </button>
                            <div className="flex -space-x-2">
                                {[300, 500, 700].map((shade, i) => (
                                    <div
                                        key={shade}
                                        className="w-7 h-7 rounded-full border-2 text-[10px] font-bold flex items-center justify-center"
                                        style={{
                                            background: scale[String(shade)],
                                            color: bestOnColor(scale[String(shade)]),
                                            borderColor: 'var(--bg-secondary)',
                                            zIndex: 3 - i
                                        }}
                                    >
                                        {['AK', 'LM', 'RJ'][i]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input with Icon */}
                <div className="card overflow-hidden">
                    <div className="p-4 bg-[var(--bg-secondary)]">
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors"
                            style={{ borderColor: scale["500"], background: `${scale["500"]}08` }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={scale["500"]} strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                        <div className="flex gap-1.5 mt-2">
                            {['Design', 'Dev', 'Art'].map(tag => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                    style={{ background: `${scale["500"]}20`, color: scale["600"] }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Badge */}
                <div className="card overflow-hidden">
                    <div
                        className="p-4"
                        style={{ background: `linear-gradient(135deg, ${scale["500"]}, ${scale["700"]})` }}
                    >
                        <div className="text-center">
                            <span
                                className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2"
                                style={{ background: 'rgba(255,255,255,0.2)', color: bestOnColor(scale["500"]) }}
                            >
                                Popular
                            </span>
                            <p
                                className="text-3xl font-bold"
                                style={{ color: bestOnColor(scale["500"]) }}
                            >
                                $29<span className="text-sm font-normal opacity-80">/mo</span>
                            </p>
                            <p
                                className="text-xs mt-1 opacity-80"
                                style={{ color: bestOnColor(scale["500"]) }}
                            >
                                Billed annually
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}