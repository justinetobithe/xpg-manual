export default function Navbar({ onLang, lang = "EN" }) {
    return (
        <header className="sticky top-0 z-20 backdrop-blur bg-black/60 border-b border-orange-500/20">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-orange-400">XPG</span>
                    <span className="text-gray-300">Game Rules</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onLang?.("EN")}
                        className={`px-3 py-1 rounded border ${lang === "EN" ? "border-orange-500 text-white" : "border-orange-500/40 text-gray-300"
                            } hover:border-orange-500 transition`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => onLang?.("RU")}
                        className={`px-3 py-1 rounded border ${lang === "RU" ? "border-orange-500 text-white" : "border-orange-500/40 text-gray-300"
                            } hover:border-orange-500 transition`}
                    >
                        RU
                    </button>
                </div>
            </div>
        </header>
    );
}
