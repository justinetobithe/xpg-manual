import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { db } from "../firebase";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import { ArrowLeft } from "lucide-react";

const basename = (p = "") => {
    const parts = String(p).trim().split(/[/\\]+/);
    return parts[parts.length - 1] || "";
};

function rewriteImagesToGames(html = "") {
    const container = document.createElement("div");
    container.innerHTML = html || "";
    container.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (/^(https?:|data:|blob:|\/\/|\/games\/)/i.test(src)) return;
        const file = basename(src.split("?")[0].split("#")[0]);
        if (file) img.setAttribute("src", `/games/${encodeURIComponent(file)}`);
    });
    return container.innerHTML;
}

export default function GameDetails() {
    const { iurl } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [lang, setLang] = useState("EN");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const snap = await getDoc(doc(db, "manual-games", iurl));
            setGame(snap.exists() ? { ...snap.data(), id: snap.id } : null);
            setLoading(false);
        })().catch(() => {
            setGame(null);
            setLoading(false);
        });
    }, [iurl]);

    const rewrittenHTML = useMemo(
        () => rewriteImagesToGames(game?.text || ""),
        [game?.text]
    );

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar onLang={setLang} lang={lang} />
                <div className="max-w-4xl mx-auto px-6 pt-16 grid place-items-center">
                    <Spinner className="h-7 w-7 text-orange-300" />
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
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-orange-300 hover:underline mt-4"
                    >
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
                    <Link
                        to="/"
                        className="text-xs text-gray-400 hover:text-orange-300 underline"
                    >
                        Back to all games
                    </Link>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
                    {game.name || "Untitled"}
                </h1>

                {Boolean(rewrittenHTML) && (
                    <div
                        className="prose prose-invert max-w-none mt-6 prose-p:leading-relaxed prose-headings:text-orange-300 prose-a:text-orange-300"
                        dangerouslySetInnerHTML={{ __html: rewrittenHTML }}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}
