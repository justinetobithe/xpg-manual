import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { db } from "../firebase";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

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

function SkeletonSidebar() {
    return (
        <div className="sticky top-[84px] self-start w-full lg:w-64">
            <div className="animate-pulse">
                <div className="h-5 w-40 bg-gray-800 rounded mb-3" />
                <ul className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <li key={i} className="h-10 bg-gray-800/70 rounded-lg" />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function SkeletonContent() {
    return (
        <div className="animate-pulse">
            <div className="h-6 w-28 bg-gray-800 rounded mb-4" />
            <div className="border border-[#A66C13] rounded-2xl p-5 sm:p-6 bg-[#0f141a] shadow-[0_0_0_1px_rgba(244,165,46,.08)]">
                <div className="space-y-3">
                    <div className="h-6 bg-gray-800 rounded w-3/5" />
                    <div className="h-4 bg-gray-800 rounded w-4/5" />
                    <div className="h-4 bg-gray-800 rounded w-11/12" />
                    <div className="h-4 bg-gray-800 rounded w-10/12" />
                    <div className="h-64 bg-gray-800 rounded mt-4" />
                    <div className="h-4 bg-gray-800 rounded w-9/12 mt-6" />
                    <div className="h-4 bg-gray-800 rounded w-7/12" />
                    <div className="h-4 bg-gray-800 rounded w-5/12" />
                </div>
            </div>
        </div>
    );
}

export default function GameDetails() {
    const { t } = useTranslation();
    const { iurl } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [lang, setLang] = useState("EN");
    const [sidebarGames, setSidebarGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);

            let foundGame = null;
            const tag = String(iurl || "").trim();
            if (tag) {
                const qByTag = query(
                    collection(db, "manual-games"),
                    where("tag", "==", tag),
                    limit(1)
                );
                const byTagSnap = await getDocs(qByTag);
                if (!byTagSnap.empty) {
                    const d = byTagSnap.docs[0];
                    foundGame = { ...d.data(), id: d.id, tag: d.data().tag || d.id };
                }
            }

            if (!foundGame && tag) {
                const docSnap = await getDoc(doc(db, "manual-games", tag));
                if (docSnap.exists()) {
                    foundGame = { ...docSnap.data(), id: docSnap.id, tag: docSnap.data().tag || docSnap.id };
                }
            }

            setGame(foundGame);

            const qs = await getDocs(query(collection(db, "manual-games"), orderBy("name")));
            setSidebarGames(qs.docs.map((d) => {
                const v = d.data() || {};
                return { name: v.name || "", tag: v.tag || d.id };
            }));

            setLoading(false);
        })();
    }, [iurl]);

    const rewrittenHTML = useMemo(() => rewriteImagesToGames(game?.text || ""), [game?.text]);

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar onLang={setLang} lang={lang} title={game?.name || ""} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 text-gray-200 hover:text-primary-300 text-base md:text-lg font-bold"
                    >
                        <ArrowLeft className="h-5 w-5" /> {t("actions.back")}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
                    <div className="hidden lg:block">
                        {loading ? (
                            <SkeletonSidebar />
                        ) : (
                            <Sidebar
                                games={sidebarGames}
                                selected={String(iurl)}
                                onSelect={(tag) => navigate(`/games/${tag}`)}
                            />
                        )}
                    </div>

                    <main>
                        {loading && <SkeletonContent />}

                        {!loading && !!rewrittenHTML && (
                            <div className="prose prose-invert max-w-none mt-2 border border-[#A66C13] rounded-2xl p-5 sm:p-6 bg-[#0f141a] shadow-[0_0_0_1px_rgba(244,165,46,.08)] font-bold prose-p:text-lg prose-li:text-lg prose-strong:font-extrabold prose-headings:text-primary-300 prose-a:text-primary-300">
                                <div className="font-bold" dangerouslySetInnerHTML={{ __html: rewrittenHTML }} />
                            </div>
                        )}

                        {!loading && !rewrittenHTML && (
                            <div className="text-gray-400 text-lg font-bold mt-4">
                                {t("details.noContent")}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
}
