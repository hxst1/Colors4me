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
export function luminance({ r, g, b }: { r: number, g: number, b: number }) {
    const srgb = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
export function contrastRatio(c1: { r: number, g: number, b: number }, c2: { r: number, g: number, b: number }) {
    const L1 = luminance(c1), L2 = luminance(c2); const [a, b] = L1 >= L2 ? [L1, L2] : [L2, L1]; return (a + 0.05) / (b + 0.05);
}
export function parseHex(hex: string) { const ok = /^#?[0-9a-fA-F]{6}$/.test(hex); if (!ok) return null; const h = hex.startsWith('#') ? hex : '#' + hex; return h.toUpperCase(); }

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
    const lines = [`$${name}-palette: (
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

@function ${name}-color($step) { @return map-get($${name}-palette, $step); }

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

