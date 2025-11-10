import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

function buildImgSrc(image = "") {
    const src = String(image || "").trim();
    if (!src) return "/games/placeholder.jpg";
    if (/^(https?:|data:|blob:|\/\/|\/games\/)/i.test(src)) return src;
    return `/games/${encodeURIComponent(src)}`;
}

export default function GameCard({ game }) {
    const title = game?.name || "Untitled";
    const slug = game?.tag || game?.id || "";
    const initialSrc = useMemo(() => buildImgSrc(game?.image), [game?.image]);
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
        <Link
            to={`/games/${slug}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
        >
            <article className="group rounded-xl bg-transparent">
                <div className="rounded-xl overflow-hidden border-2 border-primary-400 shadow-[0_10px_30px_rgba(0,0,0,.45)] transition">
                    <div className="aspect-[16/9] w-full bg-black">
                        <img
                            src={imgSrc}
                            alt={title}
                            loading="lazy"
                            onError={() => setImgSrc("/games/placeholder.jpg")}
                            className="block h-full w-full object-cover"
                        />
                    </div>
                    <div className="bg-black text-center border-t-2 border-primary-400 px-4 py-3 min-h-[56px] flex items-center justify-center">
                        <h2 className="text-white text-base md:text-lg font-extrabold tracking-wide leading-snug break-words line-clamp-2">
                            {title}
                        </h2>
                    </div>
                </div>
            </article>
        </Link>
    );
}
