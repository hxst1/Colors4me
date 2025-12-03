import { NextResponse } from "next/server";

const OWNER = "hxst1";
const REPO = "Colors4dev";

// Revalida cada 5 minutos (ajusta a tu gusto)
export async function GET() {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
        headers: {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(process.env.GITHUB_TOKEN
                ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                : {}),
        },
        next: { revalidate: 300 }, // cache lado servidor
    });

    if (!res.ok) {
        return NextResponse.json({ stars: null }, {
            status: res.status, headers: {
                "Cache-Control": "public, max-age=60"
            }
        });
    }

    const data = await res.json();
    return NextResponse.json(
        { stars: data.stargazers_count as number },
        {
            headers: {
                // ideal para Vercel/CDN
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400"
            }
        }
    );
}
