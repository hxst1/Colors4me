export function clamp(n: number, min = 0, max = 1) { return Math.min(max, Math.max(min, n)); }

export function hexToRgb(hex: string) {
    const m = hex.replace('#', '').match(/.{1,2}/g);
    if (!m || (m.length !== 3)) return { r: 0, g: 0, b: 0 };
    const [r, g, b] = m.map(v => parseInt(v.length === 1 ? v + v : v, 16));
    return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number) {
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number) {
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    let r: number, g: number, b: number;
    if (s === 0) { r = g = b = l; }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// OKLCH conversion functions
export function rgbToOklch(r: number, g: number, b: number) {
    // Convert RGB to linear RGB
    const toLinear = (c: number) => {
        c = c / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    // Convert linear RGB to OKLab
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    // Convert to OKLCH
    const C = Math.sqrt(a * a + b_ * b_);
    let H = Math.atan2(b_, a) * 180 / Math.PI;
    if (H < 0) H += 360;

    return { l: L, c: C, h: H };
}

export function oklchToRgb(l: number, c: number, h: number) {
    // Convert OKLCH to OKLab
    const hRad = h * Math.PI / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);

    // Convert OKLab to linear RGB
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const lr = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    // Convert linear RGB to sRGB
    const fromLinear = (c: number) => {
        c = Math.max(0, Math.min(1, c));
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    };

    const r = Math.round(fromLinear(lr) * 255);
    const g = Math.round(fromLinear(lg) * 255);
    const b_out = Math.round(fromLinear(lb) * 255);

    return {
        r: Math.max(0, Math.min(255, r)),
        g: Math.max(0, Math.min(255, g)),
        b: Math.max(0, Math.min(255, b_out))
    };
}

export function luminance({ r, g, b }: { r: number, g: number, b: number }) {
    const srgb = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(c1: { r: number, g: number, b: number }, c2: { r: number, g: number, b: number }) {
    const L1 = luminance(c1), L2 = luminance(c2); const [a, b] = L1 >= L2 ? [L1, L2] : [L2, L1]; return (a + 0.05) / (b + 0.05);
}

export function parseHex(hex: string) {
    const ok = /^#?[0-9a-fA-F]{6}$/.test(hex);
    if (!ok) return null;
    const h = hex.startsWith('#') ? hex : '#' + hex;
    return h.toUpperCase();
}

// Parse RGB format: rgb(255, 128, 0) or 255, 128, 0
export function parseRgb(input: string): { r: number, g: number, b: number } | null {
    const match = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
        || input.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);

    if (!match) return null;

    const [, r, g, b] = match;
    const rn = parseInt(r), gn = parseInt(g), bn = parseInt(b);

    if (rn > 255 || gn > 255 || bn > 255 || rn < 0 || gn < 0 || bn < 0) return null;

    return { r: rn, g: gn, b: bn };
}

// Parse HSL format: hsl(240, 75%, 60%) or 240, 75%, 60%
export function parseHsl(input: string): { h: number, s: number, l: number } | null {
    const match = input.match(/hsla?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?/i)
        || input.match(/^(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?$/);

    if (!match) return null;

    const [, h, s, l] = match;
    const hn = parseFloat(h);
    const sn = parseFloat(s);
    const ln = parseFloat(l);

    if (hn < 0 || hn > 360 || sn < 0 || sn > 100 || ln < 0 || ln > 100) return null;

    return { h: hn / 360, s: sn / 100, l: ln / 100 };
}

// Parse OKLCH format: oklch(0.65, 0.15, 270) or 0.65, 0.15, 270
export function parseOklch(input: string): { l: number, c: number, h: number } | null {
    const match = input.match(/oklch\s*\(\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)/i)
        || input.match(/^(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)$/);

    if (!match) return null;

    const [, l, c, h] = match;
    const ln = parseFloat(l);
    const cn = parseFloat(c);
    const hn = parseFloat(h);

    if (ln < 0 || ln > 1 || cn < 0 || cn > 0.4 || hn < 0 || hn > 360) return null;

    return { l: ln, c: cn, h: hn };
}

// Universal color parser - accepts HEX, RGB, HSL, or OKLCH
export function parseColor(input: string): string | null {
    input = input.trim();

    // Try HEX first
    const hex = parseHex(input);
    if (hex) return hex;

    // Try RGB
    const rgb = parseRgb(input);
    if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b);

    // Try HSL
    const hsl = parseHsl(input);
    if (hsl) {
        const rgbFromHsl = hslToRgb(hsl.h, hsl.s, hsl.l);
        return rgbToHex(rgbFromHsl.r, rgbFromHsl.g, rgbFromHsl.b);
    }

    // Try OKLCH
    const oklch = parseOklch(input);
    if (oklch) {
        const rgbFromOklch = oklchToRgb(oklch.l, oklch.c, oklch.h);
        return rgbToHex(rgbFromOklch.r, rgbFromOklch.g, rgbFromOklch.b);
    }

    return null;
}

// Format color in different formats
export function formatRgb(hex: string): string {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl(hex: string): string {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function formatOklch(hex: string): string {
    const { r, g, b } = hexToRgb(hex);
    const { l, c, h } = rgbToOklch(r, g, b);
    return `oklch(${l.toFixed(3)}, ${c.toFixed(3)}, ${h.toFixed(1)})`;
}

export function buildScale(baseHex: string) {
    const base = hexToRgb(baseHex);
    const { h, s, l } = rgbToHsl(base.r, base.g, base.b);

    const lighten = (t: number) => clamp(l + (1 - l) * t, 0, 1);
    const darken = (t: number) => clamp(l * (1 - t), 0, 1);

    const L: Record<number, number> = {
        50: lighten(0.90),
        100: lighten(0.75),
        200: lighten(0.60),
        300: lighten(0.45),
        400: lighten(0.30),
        500: l,
        600: darken(0.18),
        700: darken(0.38),
        800: darken(0.58),
        900: darken(0.78),
    };

    const out: Record<string, string> = {};
    ([
        50, 100, 200, 300, 400, 500, 600, 700, 800, 900
    ] as const).forEach((k) => {
        const rgb = hslToRgb(h, s, L[k]);
        out[String(k)] = rgbToHex(rgb.r, rgb.g, rgb.b);
    });
    return out;
}

export function bestOnColor(hex: string) {
    const c = hexToRgb(hex);
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const cw = contrastRatio(c, white);
    const cb = contrastRatio(c, black);
    return cw >= cb ? '#FFFFFF' : '#000000';
}

export function hexToRgbTuple(hex: string) { const { r, g, b } = hexToRgb(hex); return `${r} ${g} ${b}`; }

export function toCssVars(name: string, scale: Record<string, string>) {
    const lines = [":root {"];
    lines.push(`  --${name}: ${scale["500"]};`);
    Object.entries(scale).forEach(([k, v]) => { lines.push(`  --${name}-${k}: ${v};`); });
    lines.push(`  --on-${name}: ${bestOnColor(scale["500"])};`);
    lines.push("}");
    return lines.join("\n");
}

export function toTailwindConfig(name: string, scale: Record<string, string>) {
    const lines = [`// tailwind.config.ts (fragment)
export default {
  theme: {
    extend: {
      colors: {
        ${name}: {
          50: 'rgb(var(--${name}-50) / <alpha-value>)',
          100: 'rgb(var(--${name}-100) / <alpha-value>)',
          200: 'rgb(var(--${name}-200) / <alpha-value>)',
          300: 'rgb(var(--${name}-300) / <alpha-value>)',
          400: 'rgb(var(--${name}-400) / <alpha-value>)',
          500: 'rgb(var(--${name}-500) / <alpha-value>)',
          600: 'rgb(var(--${name}-600) / <alpha-value>)',
          700: 'rgb(var(--${name}-700) / <alpha-value>)',
          800: 'rgb(var(--${name}-800) / <alpha-value>)',
          900: 'rgb(var(--${name}-900) / <alpha-value>)',
        },
      },
    },
  },
};`];
    lines.push(`\n/* Put this in your global CSS */`);
    lines.push(`:root {`);
    Object.entries(scale).forEach(([k, v]) => { lines.push(`  --${name}-${k}: ${hexToRgbTuple(v)};`); });
    lines.push(`}`);
    return lines.join("\n");
}

export function toScss(name: string, scale: Record<string, string>) {
    const lines = [`${name}-palette: (
  50: ${scale["50"]},
  100: ${scale["100"]},
  200: ${scale["200"]},
  300: ${scale["300"]},
  400: ${scale["400"]},
  500: ${scale["500"]},
  600: ${scale["600"]},
  700: ${scale["700"]},
  800: ${scale["800"]},
  900: ${scale["900"]}
);

@function ${name}-color($step) { @return map-get(${name}-palette, $step); }

@mixin btn-${name}($step: 500) {
  $c: ${name}-color($step);
  color: if(contrast($c, #fff) > contrast($c, #000), #fff, #000);
  background: $c;
  border: 1px solid scale-color($c, $lightness: -20%);
  box-shadow: 0 6px 20px -8px scale-color($c, $alpha: -40%);
}
`];
    return lines.join("\n");
}

// Color Blindness Simulation
export type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
    if (type === 'normal') return hex;

    const { r, g, b } = hexToRgb(hex);

    // Conversion matrices for different types of color blindness
    let nr = r, ng = g, nb = b;

    switch (type) {
        case 'protanopia': // Red-blind
            nr = 0.567 * r + 0.433 * g + 0.000 * b;
            ng = 0.558 * r + 0.442 * g + 0.000 * b;
            nb = 0.000 * r + 0.242 * g + 0.758 * b;
            break;

        case 'deuteranopia': // Green-blind
            nr = 0.625 * r + 0.375 * g + 0.000 * b;
            ng = 0.700 * r + 0.300 * g + 0.000 * b;
            nb = 0.000 * r + 0.300 * g + 0.700 * b;
            break;

        case 'tritanopia': // Blue-blind
            nr = 0.950 * r + 0.050 * g + 0.000 * b;
            ng = 0.000 * r + 0.433 * g + 0.567 * b;
            nb = 0.000 * r + 0.475 * g + 0.525 * b;
            break;

        case 'achromatopsia': // Complete color blindness (monochrome)
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            nr = ng = nb = gray;
            break;
    }

    return rgbToHex(
        Math.round(Math.max(0, Math.min(255, nr))),
        Math.round(Math.max(0, Math.min(255, ng))),
        Math.round(Math.max(0, Math.min(255, nb)))
    );
}

export function simulateScaleColorBlindness(scale: Record<string, string>, type: ColorBlindnessType): Record<string, string> {
    const result: Record<string, string> = {};
    Object.entries(scale).forEach(([k, v]) => {
        result[k] = simulateColorBlindness(v, type);
    });
    return result;
}