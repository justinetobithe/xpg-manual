import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Dialog, Transition } from "@headlessui/react";
import { Search, X, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

function SidebarList({ games = [], selected = "All", onSelect = () => { }, onAfterSelect = () => { } }) {
    const { t, i18n } = useTranslation();
    const total = games.length;
    return (
        <div className="p-4">
            <h3 className="text-3xl md:text-4xl uppercase tracking-wide text-gray-200 mb-5 font-extrabold">
                {t("list.games")} {total}
            </h3>
            <ul className="space-y-2">
                <li>
                    <button
                        type="button"
                        onClick={() => {
                            onSelect("All");
                            onAfterSelect();
                        }}
                        className={`w-full text-left block px-5 py-4 rounded-lg border text-xl md:text-2xl font-extrabold ${selected === "All"
                                ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                : "border-[#2a3444] text-gray-100 hover:text-primary-300 hover:border-[#A66C13]"
                            }`}
                    >
                        {t("list.all")} ({total})
                    </button>
                </li>
                {games
                    .slice()
                    .sort((a, b) => {
                        const aName =
                            (a.translation?.[i18n.language] ??
                                a.translation?.[(i18n.language || "").split("-")[0]])?.name ??
                            a.name ??
                            "";
                        const bName =
                            (b.translation?.[i18n.language] ??
                                b.translation?.[(i18n.language || "").split("-")[0]])?.name ??
                            b.name ??
                            "";
                        return aName.localeCompare(bName);
                    })
                    .map((g) => (
                        <li key={g.tag}>
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(g.tag);
                                    onAfterSelect();
                                }}
                                className={`w-full text-left block px-5 py-4 rounded-lg border text-xl md:text-2xl font-extrabold ${selected === g.tag
                                        ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                        : "border-[#2a3444] text-gray-100 hover:text-primary-300 hover:border-[#A66C13]"
                                    }`}
                            >
                                {(g.translation?.[i18n.language] ??
                                    g.translation?.[(i18n.language || "").split("-")[0]])?.name || g.name}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

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

function SkeletonDrawerList() {
    return (
        <div className="p-4 animate-pulse">
            <div className="h-8 w-44 bg-gray-800 rounded mb-4" />
            <ul className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <li key={i} className="h-12 bg-gray-800/70 rounded-lg" />
                ))}
            </ul>
        </div>
    );
}

export default function Home() {
    const { t } = useTranslation();
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

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar onLang={setLang} lang={lang} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-md border border-[#A66C13] text-gray-100 hover:text-primary-300 hover:bg-orange-500/10"
                            aria-label={t("actions.openMenu")}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
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
                            <Sidebar games={sidebarGames} selected={selectedTag} onSelect={setSelectedTag} />
                        )}
                    </div>

                    <main>
                        <div className="flex items-center gap-3 mb-5 text-base md:text-lg text-gray-200 font-extrabold">
                            {t("list.showing")}{" "}
                            <span className="text-primary-300 mx-1">{loading ? "…" : filtered.length}</span>
                            {!loading && (selectedTag !== "All" ? `${t("list.in")} “${selectedTag}”` : t("list.gamesWord"))}
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

            <Transition show={drawerOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setDrawerOpen}>
                    <div className="fixed inset-0 bg-black/60" />
                    <div className="fixed inset-0 flex">
                        <Dialog.Panel className="relative w-80 max-w-[85%] bg-[#0f141a] border-r border-[#A66C13] shadow-xl h-full flex flex-col">
                            <div className="flex items-center justify-between p-5 border-b border-[#1b2330] shrink-0">
                                <span className="text-3xl font-extrabold text-primary-300">{t("list.games")}</span>
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="h-11 w-11 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                    aria-label={t("actions.closeMenu")}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                                {loading ? (
                                    <SkeletonDrawerList />
                                ) : (
                                    <SidebarList
                                        games={sidebarGames}
                                        selected={selectedTag}
                                        onSelect={setSelectedTag}
                                        onAfterSelect={() => setDrawerOpen(false)}
                                    />
                                )}
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
