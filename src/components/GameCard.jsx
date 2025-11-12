import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GameCard({ game }) {
    const { i18n } = useTranslation();
    const slug = game?.tag || game?.id || "";

    const initialSrc = useMemo(() => {
        const img = String(game?.image || "").trim();
        if (!img) return "/games/placeholder.jpg";
        if (/^(https?:|data:|blob:|\/\/)/i.test(img)) return img;
        return `/games/${encodeURIComponent(img)}`;
    }, [game?.image]);

    const [imgSrc, setImgSrc] = useState(initialSrc);

    useEffect(() => {
        setImgSrc(initialSrc);
    }, [initialSrc]);

    const title =
        (game?.translation?.[i18n.language] ??
            game?.translation?.[(i18n.language || "").split("-")[0]])?.name ||
        game?.name ||
        "";

    return (
        <Link to={`/games/${slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl">
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
                    <div className="bg-black text-center border-t-2 border-primary-400 px-6 py-5 min-h-[80px] flex items-center justify-center">
                        <h2 className="text-white text-3xl md:text-4xl font-black tracking-wide leading-snug break-words line-clamp-2">
                            {title}
                        </h2>
                    </div>
                </div>
            </article>
        </Link>
    );
}
