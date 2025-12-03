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

export default function ColorBlindnessSimulator({ scale, token }: Props) {
    const [selectedType, setSelectedType] = useState<ColorBlindnessType>('normal');

    const simulatedScale = useMemo(() => {
        const result: Record<string, string> = {};
        Object.entries(scale).forEach(([k, v]) => {
            result[k] = simulateColorBlindness(v, selectedType);
        });
        return result;
    }, [scale, selectedType]);

    const selectedTypeInfo = COLOR_BLINDNESS_TYPES.find(t => t.id === selectedType);

    return (
        <div className="card p-4" role="region" aria-labelledby="colorblind-heading">
            <div className="flex items-center justify-between mb-4">
                <h2 id="colorblind-heading" className="text-sm font-semibold text-[var(--text-primary)]">
                    Color Blindness Simulator
                </h2>
                <div className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                    {selectedTypeInfo?.icon} {selectedTypeInfo?.name}
                </div>
            </div>

            {/* Type Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Color blindness type">
                {COLOR_BLINDNESS_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`pill ${selectedType === type.id ? 'pill-active' : ''}`}
                        title={type.description}
                        role="radio"
                        aria-checked={selectedType === type.id}
                        aria-label={`${type.name}: ${type.description}`}
                    >
                        <span aria-hidden="true">{type.icon}</span>
                        <span>{type.name}</span>
                    </button>
                ))}
            </div>

            {/* Color Preview Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4" role="list" aria-label="Color scale preview">
                {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((step) => (
                    <div key={step} className="space-y-1" role="listitem">
                        <div
                            className="aspect-square rounded-lg border border-[var(--border-subtle)] shadow-sm transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: simulatedScale[String(step)] }}
                            title={`${token}-${step}\nOriginal: ${scale[String(step)]}\nSimulated: ${simulatedScale[String(step)]}`}
                            aria-label={`${token}-${step}: ${simulatedScale[String(step)]}`}
                        />
                        <div className="text-[9px] text-center font-mono text-[var(--text-tertiary)]">
                            {step}
                        </div>
                    </div>
                ))}
            </div>

            {/* Example Components */}
            <div className="mb-3">
                <div className="text-[10px] uppercase tracking-wider mb-2 text-[var(--text-tertiary)]">
                    Examples in context
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                    {/* Button Example */}
                    <div className="rounded-lg p-3 bg-[var(--bg-tertiary)]">
                        <div className="text-[10px] uppercase tracking-wider mb-2 text-[var(--text-tertiary)]">
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

                    {/* Text Example */}
                    <div className="rounded-lg p-3 bg-[var(--bg-tertiary)]">
                        <div className="text-[10px] uppercase tracking-wider mb-2 text-[var(--text-tertiary)]">
                            Text
                        </div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: simulatedScale["600"] }}
                        >
                            Brand text
                        </p>
                    </div>

                    {/* Badge Example */}
                    <div className="rounded-lg p-3 bg-[var(--bg-tertiary)]">
                        <div className="text-[10px] uppercase tracking-wider mb-2 text-[var(--text-tertiary)]">
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
            <div className="text-[11px] p-2.5 rounded-lg flex items-start gap-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                <span className="text-sm" aria-hidden="true">💡</span>
                <p className="flex-1">
                    <strong>Accessibility tip:</strong> Don&apos;t rely solely on color. Use text labels, icons, or patterns to convey information.
                </p>
            </div>
        </div>
    );
}