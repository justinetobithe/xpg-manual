import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Dialog, Transition } from "@headlessui/react";
import { Search, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";

function SidebarList({ games = [], selected = "All", onSelect = () => { }, onAfterSelect = () => { } }) {
    const total = games.length;
    return (
        <div className="p-4">
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Games {total}</h3>
            <ul className="space-y-2">
                <li>
                    <button
                        type="button"
                        onClick={() => { onSelect("All"); onAfterSelect(); }}
                        className={`w-full text-left block px-2 py-1 rounded transition ${selected === "All"
                            ? "text-orange-300 bg-orange-500/10"
                            : "text-gray-200 hover:text-orange-300 hover:bg-orange-500/10"
                            }`}
                    >
                        All ({total})
                    </button>
                </li>

                {games
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((g) => (
                        <li key={g.tag}>
                            <button
                                type="button"
                                onClick={() => { onSelect(g.tag); onAfterSelect(); }}
                                className={`w-full text-left block px-2 py-1 rounded transition ${selected === g.tag
                                    ? "text-orange-300 bg-orange-500/10"
                                    : "text-gray-200 hover:text-orange-300 hover:bg-orange-500/10"
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
                return {
                    iid: d.id,
                    iname1: v.name || "",
                    iurl: v.tag || d.id,
                    itext: v.text || "",
                    img: v.image || "",
                };
            });
            setGames(list);
            setSidebarGames(list.map((g) => ({ name: g.iname1, tag: g.iurl })));
        })().catch(console.error);
    }, []);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return games.filter((g) => {
            const matchesSearch = !term || `${g.iname1} ${g.itext}`.toLowerCase().includes(term);
            const matchesTag = selectedTag === "All" || g.iurl === selectedTag;
            return matchesSearch && matchesTag;
        });
    }, [games, q, selectedTag]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const clearSearch = () => {
        setQ("");
        inputRef.current?.focus();
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar onLang={setLang} lang={lang} />

            <div className="max-w-6xl mx-auto px-6 pt-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(true)}
                                    className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#A66C13] text-gray-200 hover:text-orange-300 hover:bg-orange-500/10 focus:outline-none"
                                    aria-label="Open menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                <h1 className="text-3xl md:text-4xl font-bold text-orange-400">XPG Manual</h1>
                            </div>

                            <div className="relative hidden lg:block w-96">
                                <label htmlFor="game-search-desktop" className="sr-only">Search games</label>
                                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="game-search-desktop"
                                    ref={inputRef}
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Escape") clearSearch(); }}
                                    placeholder="Search games…"
                                    className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-lg pl-9 pr-9 py-2 text-sm"
                                />
                                <Transition
                                    show={Boolean(q)}
                                    enter="transition-opacity duration-150"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 focus:outline-none"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </Transition>
                            </div>
                        </div>

                        <div className="relative lg:hidden">
                            <label htmlFor="game-search-mobile" className="sr-only">Search games</label>
                            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                id="game-search-mobile"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Escape") clearSearch(); }}
                                placeholder="Search games…"
                                className="w-full bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-lg pl-9 pr-9 py-2 text-sm"
                            />
                            <Transition
                                show={Boolean(q)}
                                enter="transition-opacity duration-150"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-300 hover:text-orange-300 hover:bg-orange-500/10 focus:outline-none"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </Transition>
                        </div>
                    </div>

                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[256px_minmax(0,1fr)] gap-6">
                    <div className="hidden lg:block">
                        <Sidebar
                            games={sidebarGames}
                            selected={selectedTag}
                            onSelect={setSelectedTag}
                        />
                    </div>

                    <main>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-400">
                                Showing <span className="text-orange-300">{filtered.length}</span>
                                {selectedTag !== "All" ? ` in “${selectedTag}”` : " games"}
                                {q.trim() ? ` for “${q.trim()}”` : ""}
                            </span>
                            {(selectedTag !== "All" || q.trim()) && (
                                <button
                                    onClick={() => { setSelectedTag("All"); setQ(""); inputRef.current?.focus(); }}
                                    className="text-xs text-gray-300 underline hover:text-orange-300"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((g) => (
                                <GameCard key={g.iurl} game={g} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-gray-400 text-center py-12">No games found.</div>
                        )}

                        <Footer />
                    </main>
                </div>
            </div>

            <Transition show={drawerOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setDrawerOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-out duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-out duration-200 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in duration-200 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative w-80 max-w-[85%] bg-[#0f141a] border-r border-[#A66C13] shadow-xl">
                                <div className="flex items-center justify-between p-4 border-b border-[#1b2330]">
                                    <Dialog.Title className="text-sm font-semibold text-orange-300">Games</Dialog.Title>
                                    <button
                                        type="button"
                                        onClick={() => setDrawerOpen(false)}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-orange-300 hover:bg-orange-500/10"
                                        aria-label="Close menu"
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
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
