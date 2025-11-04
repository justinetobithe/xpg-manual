
export default function Sidebar({
    categories = [],
    selected = "All",
    onSelect = () => { },
}) {
    const total = categories.reduce((sum, c) => sum + Number(c.count || 0), 0);

    return (
        <aside className="sticky top-20 self-start hidden lg:block w-64 pr-6">
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                Categories {categories.length}
            </h3>

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

                {categories.map((c) => (
                    <li key={c.category}>
                        <button
                            type="button"
                            onClick={() => onSelect(c.category)}
                            className={`w-full text-left block px-2 py-1 rounded transition ${selected === c.category
                                ? "text-orange-300 bg-orange-500/10"
                                : "text-gray-200 hover:text-orange-300 hover:bg-orange-500/10"
                                }`}
                        >
                            {c.category} ({c.count})
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
