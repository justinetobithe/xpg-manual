import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "";

export default function GameDetails() {
    const { iurl } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [lang, setLang] = useState("EN");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/games/${iurl}`)
            .then((r) => setGame(r.data))
            .catch(() => setGame(null))
            .finally(() => setLoading(false));
    }, [iurl]);

    const imgSrcs = useMemo(() => {
        if (!game) return [];
        const list = [];
        if (game.img) list.push(`${API_ORIGIN}/games/${game.img}`);
        if (game.iurl) list.push(
            `${API_ORIGIN}/games/${game.iurl}.jpg`,
            `${API_ORIGIN}/games/${game.iurl}.png`,
            `${API_ORIGIN}/games/${game.iurl}.webp`
        );
        list.push(`${API_ORIGIN}/games/placeholder.jpg`);
        return Array.from(new Set(list));
    }, [game]);

    const [imgIdx, setImgIdx] = useState(0);
    useEffect(() => setImgIdx(0), [imgSrcs.join("|")]);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar onLang={setLang} lang={lang} />
                <div className="max-w-4xl mx-auto px-6 pt-10">
                    <div className="h-48 w-full animate-pulse bg-[#121821] rounded-xl" />
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar onLang={setLang} lang={lang} />
                <div className="max-w-4xl mx-auto px-6 pt-10">
                    <p className="text-gray-400">Game not found.</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-orange-300 hover:underline mt-4">
                        <ArrowLeft className="h-4 w-4" /> Back to list
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar onLang={setLang} lang={lang} />

            <div className="max-w-4xl mx-auto px-6 pt-6 pb-16">
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-orange-300"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <Link to="/" className="text-xs text-gray-400 hover:text-orange-300 underline">
                        Back to all games
                    </Link>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
                    {game.iname1 || "Untitled"}
                </h1>

                <div className="rounded-xl overflow-hidden bg-[#0b0f13] border border-[#A66C13]">
                    <img
                        src={imgSrcs[imgIdx]}
                        alt={game.iname1 || "game cover"}
                        className="w-full h-auto object-cover"
                        onError={() => {
                            if (imgIdx < imgSrcs.length - 1) setImgIdx((i) => i + 1);
                        }}
                    />
                </div>

                {Boolean(game.itext) && (
                    <div
                        className="prose prose-invert max-w-none mt-6 prose-p:leading-relaxed prose-headings:text-orange-300 prose-a:text-orange-300"
                        dangerouslySetInnerHTML={{ __html: game.itext }}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
}
