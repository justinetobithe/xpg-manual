import { useState, useMemo } from "react";

function stripHtml(s = "") {
    return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function GameCard({ game }) {
    const title = game.iname1 || "Untitled";
    const filename = game.img || game.iurl || "placeholder.jpg";
    // const src = `/games/${filename}`;
    const text = useMemo(() => stripHtml(game.itext || ""), [game.itext]);
    const [loaded, setLoaded] = useState(false);

    return (
        <article className="group rounded-xl overflow-hidden bg-[#0f141a] border-2 border-[#A66C13] shadow-[0_0_0_1px_rgba(255,168,63,.15),0_8px_24px_rgba(0,0,0,.35)] hover:border-[#F4A52E] transition-colors">
            <div className="relative">
                <div className="aspect-[16/9] w-full bg-[#0b0f13]">
                    {!loaded && <div className="w-full h-full animate-pulse bg-[#121821]" />}
                    <img
                        src={`/games/${filename}`}
                        alt={title}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={(e) => (e.currentTarget.src = "/games/placeholder.jpg")}
                        className={`w-full h-full object-cover ${loaded ? "block" : "hidden"}`}
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-2 ring-[#F4A52E]/50 transition" />
            </div>

            <div className="p-4">
                <h2 className="text-lg font-semibold text-orange-300 line-clamp-1">{title}</h2>
                {text && <p className="text-sm text-gray-400 mt-2 line-clamp-3">{text}</p>}
            </div>
        </article>
    );
}
