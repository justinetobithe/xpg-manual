import { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Transition } from "@headlessui/react";
import { Search, X } from "lucide-react";

export default function Home() {
    const [games, setGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState("All");
    const [lang, setLang] = useState("EN");
    const [q, setQ] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        api.get("/api/categories").then((r) => setCategories(r.data)).catch(console.error);
    }, []);

    useEffect(() => {
        const params = {};
        if (selectedCat && selectedCat !== "All") params.category = selectedCat;
        if (q.trim()) params.q = q.trim();
        api.get("/api/games", { params }).then((r) => setGames(r.data)).catch(console.error);
    }, [selectedCat, q]);

    const filtered = useMemo(() => games, [games]);

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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-orange-400">XPG Manual</h1>

                    <div className="relative w-full md:w-96">
                        <label htmlFor="game-search" className="sr-only">Search games</label>
                        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            id="game-search"
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

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[256px_minmax(0,1fr)] gap-6">
                    <Sidebar categories={categories} selected={selectedCat} onSelect={setSelectedCat} />

                    <main>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-400">
                                Showing <span className="text-orange-300">{filtered.length}</span>
                                {selectedCat !== "All" ? ` in “${selectedCat}”` : " games"}
                                {q.trim() ? ` for “${q.trim()}”` : ""}
                            </span>
                            {(selectedCat !== "All" || q.trim()) && (
                                <button
                                    onClick={() => { setSelectedCat("All"); setQ(""); inputRef.current?.focus(); }}
                                    className="text-xs text-gray-300 underline hover:text-orange-300"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {filtered.map((g) => <GameCard key={g.iid} game={g} />)}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-gray-400 text-center py-12">No games found.</div>
                        )}

                        <Footer />
                    </main>
                </div>
            </div>
        </div>
    );
}
