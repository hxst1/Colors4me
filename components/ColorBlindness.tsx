"use client";
import React, { useState, useMemo } from "react";
import { simulateColorBlindness, bestOnColor, type ColorBlindnessType } from "@/lib/color";

type Props = {
    scale: Record<string, string>;
    token: string;
    theme?: 'dark' | 'light';
};

const COLOR_BLINDNESS_TYPES = [
    {
        id: 'normal' as ColorBlindnessType,
        name: 'Normal',
        description: 'Full color vision',
        icon: '👁️'
    },
    {
        id: 'protanopia' as ColorBlindnessType,
        name: 'Protanopia',
        description: 'Red-blind',
        icon: '🔴'
    },
    {
        id: 'deuteranopia' as ColorBlindnessType,
        name: 'Deuteranopia',
        description: 'Green-blind',
        icon: '🟢'
    },
    {
        id: 'tritanopia' as ColorBlindnessType,
        name: 'Tritanopia',
        description: 'Blue-blind',
        icon: '🔵'
    },
    {
        id: 'achromatopsia' as ColorBlindnessType,
        name: 'Monochrome',
        description: 'No color',
        icon: '⚫'
    }
];

export default function ColorBlindnessSimulator({ scale, token, theme = 'dark' }: Props) {
    const [selectedType, setSelectedType] = useState<ColorBlindnessType>('normal');
    const isDark = theme === 'dark';

    const simulatedScale = useMemo(() => {
        const result: Record<string, string> = {};
        Object.entries(scale).forEach(([k, v]) => {
            result[k] = simulateColorBlindness(v, selectedType);
        });
        return result;
    }, [scale, selectedType]);

    return (
        <div className={`border rounded-2xl p-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Color Blindness Simulator</h2>
                <div className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                    {COLOR_BLINDNESS_TYPES.find(t => t.id === selectedType)?.icon} {' '}
                    {COLOR_BLINDNESS_TYPES.find(t => t.id === selectedType)?.name}
                </div>
            </div>

            {/* Type Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {COLOR_BLINDNESS_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type.id
                            ? isDark
                                ? 'bg-zinc-700 text-zinc-100 ring-2 ring-zinc-600'
                                : 'bg-zinc-200 text-zinc-900 ring-2 ring-zinc-400'
                            : isDark
                                ? 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                            }`}
                        title={type.description}
                    >
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                    </button>
                ))}
            </div>

            {/* Color Preview Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
                {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((step) => (
                    <div key={step} className="space-y-1">
                        <div
                            className="aspect-square rounded-lg border shadow-sm transition-transform hover:scale-110 cursor-pointer"
                            style={{
                                backgroundColor: simulatedScale[String(step)],
                                borderColor: isDark ? 'rgba(63,63,70,0.5)' : 'rgba(228,228,231,1)'
                            }}
                            title={`${token}-${step}\nOriginal: ${scale[String(step)]}\nSimulated: ${simulatedScale[String(step)]}`}
                        />
                        <div className={`text-[9px] text-center font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                            }`}>
                            {step}
                        </div>
                    </div>
                ))}
            </div>

            {/* Example Components */}
            <div className="mb-3">
                <div className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                    }`}>
                    Examples in context
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                    <div className={`rounded-lg p-3 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
                        }`}>
                        <div className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                            }`}>
                            Button
                        </div>
                        <button
                            className="px-3 py-2 rounded-lg font-medium text-sm w-full transition-transform active:scale-95"
                            style={{
                                backgroundColor: simulatedScale["500"],
                                color: bestOnColor(simulatedScale["500"])
                            }}
                        >
                            Click me
                        </button>
                    </div>

                    <div className={`rounded-lg p-3 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
                        }`}>
                        <div className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                            }`}>
                            Text
                        </div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: simulatedScale["600"] }}
                        >
                            Brand text
                        </p>
                    </div>

                    <div className={`rounded-lg p-3 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
                        }`}>
                        <div className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'
                            }`}>
                            Badge
                        </div>
                        <span
                            className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: `${simulatedScale["500"]}22`,
                                color: simulatedScale["700"],
                                border: `1px solid ${simulatedScale["500"]}44`
                            }}
                        >
                            New
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Tip */}
            <div className={`text-[11px] p-2.5 rounded-lg flex items-start gap-2 ${isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                }`}>
                <span className="text-sm">💡</span>
                <p className="flex-1">
                    <strong>Accessibility tip:</strong> Don&apos;t rely solely on color. Use text labels, icons, or patterns to convey information.
                </p>
            </div>
        </div>
    );
}