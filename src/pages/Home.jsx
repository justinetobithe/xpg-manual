import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Dialog, Transition } from "@headlessui/react";
import { Search, X, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

function SidebarList({ games = [], selected = "All", onSelect = () => { }, onAfterSelect = () => { } }) {
    const { t } = useTranslation();
    const total = games.length;
    return (
        <div className="p-4">
            <h3 className="text-base md:text-lg uppercase tracking-wide text-gray-300 mb-3 font-bold">
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
                        className={`w-full text-left block px-3 py-2.5 rounded-lg border text-base font-bold ${selected === "All"
                                ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                : "border-[#2a3444] text-gray-200 hover:text-primary-300 hover:border-[#A66C13]"
                            }`}
                    >
                        {t("list.all")} ({total})
                    </button>
                </li>
                {games
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((g) => (
                        <li key={g.tag}>
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(g.tag);
                                    onAfterSelect();
                                }}
                                className={`w-full text-left block px-3 py-2.5 rounded-lg border text-base font-bold ${selected === g.tag
                                        ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                        : "border-[#2a3444] text-gray-200 hover:text-primary-300 hover:border-[#A66C13]"
                                    }`}
                            >
                                {g.name}
                            </button>
                        </li>
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
    const inputRef = useRef(null);

    useEffect(() => {
        (async () => {
            const qRef = query(collection(db, "manual-games"), orderBy("name"));
            const snap = await getDocs(qRef);
            const list = snap.docs.map((d) => {
                const v = d.data() || {};
                return { iid: d.id, iname1: v.name || "", iurl: v.tag || d.id, itext: v.text || "", img: v.image || "" };
            });
            setGames(list);
            setSidebarGames(list.map((g) => ({ name: g.iname1, tag: g.iurl })));
        })();
    }, []);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return games.filter((g) => {
            const matchesSearch = !term || `${g.iname1} ${g.itext}`.toLowerCase().includes(term);
            const matchesTag = selectedTag === "All" || g.iurl === selectedTag;
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-[#A66C13] text-gray-200 hover:text-primary-300 hover:bg-orange-500/10"
                            aria-label={t("actions.openMenu")}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-400">
                            {t("titles.manual")}
                        </h1>
                    </div>

                    <div className="relative hidden lg:block w-[26rem]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") clearSearch();
                            }}
                            placeholder={t("search.placeholder")}
                            className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-lg pl-10 pr-10 py-3 text-base font-bold text-gray-100"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                aria-label={t("actions.clearFilters")}
                            >
                                <X className="h-5 w-5" />
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
                            className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-lg pl-10 pr-10 py-3 text-base font-bold text-gray-100"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                aria-label={t("actions.clearFilters")}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
                    <div className="hidden lg:block">
                        <Sidebar games={sidebarGames} selected={selectedTag} onSelect={setSelectedTag} />
                    </div>

                    <main>
                        <div className="flex items-center gap-2 mb-4 text-base md:text-lg text-gray-300 font-bold">
                            {t("list.showing")}{" "}
                            <span className="text-primary-300 mx-1">{filtered.length}</span>
                            {selectedTag !== "All" ? `${t("list.in")} “${selectedTag}”` : t("list.gamesWord")}
                            {q.trim() ? ` ${t("list.for")} “${q.trim()}”` : ""}
                            {(selectedTag !== "All" || q.trim()) && (
                                <button
                                    onClick={() => {
                                        setSelectedTag("All");
                                        setQ("");
                                        inputRef.current?.focus();
                                    }}
                                    className="ml-3 text-gray-200 underline hover:text-primary-300"
                                >
                                    {t("actions.clearFilters")}
                                </button>
                            )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((g) => (
                                <GameCard key={g.iurl} game={g} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-gray-300 text-center py-12 text-lg font-bold">
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
                        <Dialog.Panel className="relative w-80 max-w-[85%] bg-[#0f141a] border-r border-[#A66C13] shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b border-[#1b2330]">
                                <span className="text-base font-bold text-primary-300">{t("list.games")}</span>
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                    aria-label={t("actions.closeMenu")}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <SidebarList
                                games={sidebarGames}
                                selected={selectedTag}
                                onSelect={setSelectedTag}
                                onAfterSelect={() => setDrawerOpen(false)}
                            />
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
