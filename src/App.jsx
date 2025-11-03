import { useEffect, useMemo, useState } from "react";
import api from "./lib/api";
import Navbar from "./components/Navbar";
import GameCard from "./components/GameCard";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [games, setGames] = useState([]);
  const [lang, setLang] = useState("EN");
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/api/games").then((r) => setGames(r.data)).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return games;
    return games.filter((g) =>
      `${g.iname1 || ""} ${g.itext || ""}`.toLowerCase().includes(term)
    );
  }, [games, q]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar onLang={setLang} lang={lang} />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-400">XPG Manual</h1>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search games..."
            className="w-full md:w-96 bg-[#0f141a] border border-[#A66C13] focus:border-[#F4A52E] outline-none rounded-lg px-4 py-2 text-sm"
          />
        </div>
 
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[256px_minmax(0,1fr)] gap-6">
          <Sidebar games={games} />

          <main>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((g) => (
                <GameCard key={g.iid} game={g} />
              ))}
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
