import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function stripHtml(s = "") {
    return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
const basename = (p = "") => {
    const parts = String(p).trim().split(/[/\\]+/);
    return parts[parts.length - 1] || "";
};
const buildVariants = (slug = "") => {
    const s = String(slug).trim();
    if (!s) return [];
    const v = new Set();
    const dash = s.replace(/_/g, "-");
    const under = s.replace(/-/g, "_");
    const all = [s, dash, under, s.toLowerCase(), dash.toLowerCase(), under.toLowerCase()];
    const exts = [".jpg", ".jpeg", ".png", ".webp"];
    for (const name of all) for (const ext of exts) v.add(`/games/${encodeURIComponent(name)}${ext}`);
    return [...v];
};

export default function GameCard({ game }) {
    const title = game.iname1 || "Untitled";
    const text = useMemo(() => stripHtml(game.itext || ""), [game.itext]);

    const file = basename(game.img);
    const slug = (game.iurl || "").trim();

    const candidates = useMemo(() => {
        const list = [];
        if (file) list.push(`/games/${encodeURIComponent(file)}`);
        list.push(...buildVariants(slug));
        list.push(`/games/placeholder.jpg`);
        return Array.from(new Set(list));
    }, [file, slug]);

    const [idx, setIdx] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setIdx(0);
        setLoaded(false);
    }, [candidates.join("|")]);

    const src = candidates[idx];

    return (
        <Link
            to={`/games/${slug || game.iid}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A52E]/50 rounded-xl min-w-0"
        >
            <article
                className="
          rounded-xl overflow-hidden bg-[#0f141a] border-2 border-[#A66C13]
          ring-1 ring-[#F4A52E]/10 shadow-lg
          hover:border-[#F4A52E] transition-colors
          min-w-0 max-w-full
        "
            >
                <div className="relative">
                    <div className="aspect-[16/9] w-full bg-[#0b0f13] overflow-hidden">
                        {!loaded && (
                            <div className="absolute inset-0 grid place-items-center">
                                <Spinner className="h-6 w-6 text-orange-300" />
                            </div>
                        )}
                        <img
                            src={src}
                            alt={title}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                            onError={() => {
                                if (idx < candidates.length - 1) setIdx((i) => i + 1);
                                else setLoaded(true);
                            }}
                            className={`block w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
                        />
                    </div>

                    <div className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-2 ring-[#F4A52E]/50 transition" />
                </div>

                <div className="p-4 min-w-0">
                    <h2 className="text-lg font-semibold text-orange-300 line-clamp-1 break-words">{title}</h2>
                    {text && <p className="text-sm text-gray-400 mt-2 line-clamp-3 break-words">{text}</p>}
                </div>
            </article>
        </Link>
    );
}
