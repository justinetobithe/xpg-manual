// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AppDrawer from "@/components/AppDrawer";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function SkeletonSidebar() {
    return (
        <div className="sticky top-[84px] self-start w-full lg:w-64">
            <div className="p-4 animate-pulse">
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

function SkeletonCard() {
    return (
        <article className="rounded-xl border-2 border-primary-400 shadow-[0_10px_30px_rgba(0,0,0,.45)] overflow-hidden">
            <div className="aspect-[16/9] w-full bg-gray-800 animate-pulse" />
            <div className="bg-black border-t-2 border-primary-400 px-5 py-6">
                <div className="h-8 bg-gray-800 rounded w-3/4 mx-auto animate-pulse" />
            </div>
        </article>
    );
}

export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [sidebarGames, setSidebarGames] = useState([]);
    const [selectedTag, setSelectedTag] = useState("All");
    const [lang, setLang] = useState("EN");
    const [q, setQ] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const qRef = query(collection(db, "manual-games"), where("visible", "==", true));
            const snap = await getDocs(qRef);
            const list = snap.docs
                .map((d) => {
                    const v = d.data() || {};
                    return {
                        id: d.id,
                        name: v.name || "",
                        tag: v.tag || d.id,
                        text: v.text || "",
                        image: v.image || "",
                        translation: v.translation || {},
                    };
                })
                .sort((a, b) => a.name.localeCompare(b.name));
            setGames(list);
            setSidebarGames(list.map(({ name, tag, translation }) => ({ name, tag, translation })));
            setLoading(false);
        })();
    }, []);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return games.filter((g) => {
            const matchesSearch = !term || `${g.name} ${g.text}`.toLowerCase().includes(term);
            const matchesTag = selectedTag === "All" || g.tag === selectedTag;
            return matchesSearch && matchesTag;
        });
    }, [games, q, selectedTag]);

    const clearSearch = () => {
        setQ("");
        inputRef.current?.focus();
    };

    const handleSelectGame = (tag) => {
        setSelectedTag(tag);
        if (tag !== "All") {
            navigate(`/games/${tag}`);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar
                onLang={setLang}
                lang={lang}
                showMenuButton
                onMenuClick={() => setDrawerOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-400 leading-tight">
                            {t("titles.manual")}
                        </h1>
                    </div>

                    <div className="relative hidden lg:block w-[22rem] xl:w-[26rem]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") clearSearch();
                            }}
                            placeholder={t("search.placeholder")}
                            className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-md pl-9 pr-9 py-2.5 text-base md:text-lg font-bold text-gray-100"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                aria-label={t("actions.clearFilters")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:hidden mt-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") clearSearch();
                            }}
                            placeholder={t("search.placeholder")}
                            className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-md pl-9 pr-9 py-2.5 text-base md:text-lg font-bold text-gray-100"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                aria-label={t("actions.clearFilters")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
                    <div className="hidden lg:block">
                        {loading ? (
                            <SkeletonSidebar />
                        ) : (
                            <Sidebar
                                games={sidebarGames}
                                selected={selectedTag}
                                onSelect={handleSelectGame}
                            />
                        )}
                    </div>

                    <main>
                        <div className="flex items-center gap-3 mb-5 text-base md:text-lg text-gray-200 font-extrabold">
                            {t("list.showing")}{" "}
                            <span className="text-primary-300 mx-1">
                                {loading ? "…" : filtered.length}
                            </span>
                            {!loading &&
                                (selectedTag !== "All" ? `${t("list.in")} “${selectedTag}”` : t("list.gamesWord"))}
                            {!loading && (q.trim() ? ` ${t("list.for")} “${q.trim()}”` : "")}
                            {!loading && (selectedTag !== "All" || q.trim()) && (
                                <button
                                    onClick={() => {
                                        setSelectedTag("All");
                                        setQ("");
                                        inputRef.current?.focus();
                                    }}
                                    className="ml-3 text-gray-100 underline hover:text-primary-300 text-sm md:text-base"
                                >
                                    {t("actions.clearFilters")}
                                </button>
                            )}
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                                : filtered.map((g) => <GameCard key={g.tag} game={g} />)}
                        </div>

                        {!loading && filtered.length === 0 && (
                            <div className="text-gray-300 text-center py-10 text-2xl md:text-3xl font-extrabold">
                                {t("list.noResults")}
                            </div>
                        )}

                        <Footer />
                    </main>
                </div>
            </div>

            <AppDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                games={sidebarGames}
                selected={selectedTag}
                loading={loading}
                onSelect={(tag) => {
                    handleSelectGame(tag);
                    setDrawerOpen(false);
                }}
            />
        </div>
    );
}
