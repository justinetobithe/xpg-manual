export default function Sidebar({ games }) {
    return (
        <aside className="sticky top-20 self-start hidden lg:block w-64 pr-6">
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">All Games</h3>
            <ul className="space-y-2">
                {games.map((g) => (
                    <li key={g.iid}>
                        <a
                            href={`#game-${g.iid}`}
                            className="block px-2 py-1 rounded text-gray-200 hover:text-orange-300 hover:bg-orange-500/10 transition"
                        >
                            {g.iname1}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
