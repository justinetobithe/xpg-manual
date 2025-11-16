import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    where,
    limit
} from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AppDrawer from "@/components/AppDrawer";
import { db } from "../firebase";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import ImageDialog from "@/components/ImageDialog";

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
                <div className="h-8 w-56 bg-gray-800 rounded mb-4" />
                <ul className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <li key={i} className="h-12 bg-gray-800/70 rounded-lg" />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function SkeletonContent() {
    return (
        <div className="animate-pulse">
            <div className="h-9 w-40 bg-gray-800 rounded mb-4" />
            <div className="border border-[#A66C13] rounded-2xl p-6 sm:p-8 bg-[#0f141a] shadow-[0_0_0_1px_rgba(244,165,46,.08)]">
                <div className="space-y-4">
                    <div className="h-7 bg-gray-800 rounded w-3/5" />
                    <div className="h-6 bg-gray-800 rounded w-4/5" />
                    <div className="h-6 bg-gray-800 rounded w-11/12" />
                    <div className="h-6 bg-gray-800 rounded w-10/12" />
                    <div className="h-72 bg-gray-800 rounded mt-4" />
                </div>
            </div>
        </div>
    );
}

export default function GameDetails() {
    const { t, i18n } = useTranslation();
    const { iurl } = useParams();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [game, setGame] = useState(null);
    const [sidebarGames, setSidebarGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageDialogSrc, setImageDialogSrc] = useState("");
    const [imageDialogAlt, setImageDialogAlt] = useState("");

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
            setSidebarGames(
                qs.docs.map((d) => {
                    const v = d.data() || {};
                    return { name: v.name || "", tag: v.tag || d.id, translation: v.translation || {} };
                })
            );

            setLoading(false);
        })();
    }, [iurl]);

    const baseLang = (i18n.language || "").split("-")[0];
    const tr = game?.translation || {};
    const currentTr = tr[i18n.language] ?? tr[baseLang] ?? null;

    const title = currentTr?.name ?? game?.name ?? "";
    const sourceText = currentTr?.text ?? game?.text ?? "";

    const rewrittenHTML = useMemo(() => rewriteImagesToGames(sourceText), [sourceText]);

    const isRTL = /^ar|^he|^fa|^ur/i.test(i18n.language || "");

    const handleContentClick = (e) => {
        const img = e.target.closest("img");
        if (!img) return;
        setImageDialogSrc(img.src);
        setImageDialogAlt(img.alt);
        setImageDialogOpen(true);
    };

    return (
        <div className="bg-black min-h-screen text-white" dir={isRTL ? "rtl" : "ltr"}>
            <Navbar
                title={title}
                showMenuButton
                onMenuClick={() => setDrawerOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
                <div className="mb-5 flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-3 text-gray-100 hover:text-primary-300 text-3xl md:text-4xl font-extrabold"
                    >
                        <ArrowLeft className="h-7 w-7" /> {t("actions.back")}
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
                            <div
                                className="manual-html mt-2 border border-[#A66C13] rounded-2xl p-6 sm:p-8 bg-[#0f141a]"
                                style={{ textAlign: isRTL ? "right" : "left" }}
                                dangerouslySetInnerHTML={{ __html: rewrittenHTML }}
                                onClick={handleContentClick}
                            />
                        )}
                    </main>
                </div>
            </div>

            <Footer />

            <AppDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                games={sidebarGames}
                selected={String(iurl)}
                loading={loading}
                onSelect={(tag) => {
                    navigate(`/games/${tag}`);
                    setDrawerOpen(false);
                }}
            />

            <ImageDialog
                open={imageDialogOpen}
                src={imageDialogSrc}
                alt={imageDialogAlt}
                onClose={() => setImageDialogOpen(false)}
            />
        </div>
    );
}
