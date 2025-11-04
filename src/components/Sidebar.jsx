export default function Sidebar({
    games = [],
    selected = "All",
    onSelect = () => { },
}) {
    const total = games.length;

    return (
        <aside className="sticky top-20 self-start w-64 pr-6">
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Games {total}</h3>
            <ul className="space-y-2">
                <li>
                    <button
                        type="button"
                        onClick={() => onSelect("All")}
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
                                onClick={() => onSelect(g.tag)}
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
        </aside>
    );
}
