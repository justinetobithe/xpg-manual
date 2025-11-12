import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ games = [], selected = "All", onSelect = () => { } }) {
    const { t, i18n } = useTranslation();
    const total = games.length;
    const navigate = useNavigate();

    return (
        <aside className="sticky top-[84px] self-start w-full lg:w-64 mb-5">
            <h3 className="text-3xl md:text-4xl uppercase tracking-wide text-gray-200 mb-5 font-extrabold">
                {t("list.games")} {total}
            </h3>
            <div
                className="max-h-[calc(100vh-84px-80px)] overflow-y-auto lg:max-h-none lg:overflow-visible"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                <ul className="space-y-2">
                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                onSelect("All");
                                navigate("/");
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
                        .sort((a, b) =>
                            (
                                (a.translation?.[i18n.language] ??
                                    a.translation?.[(i18n.language || "").split("-")[0]])?.name ||
                                a.name ||
                                ""
                            ).localeCompare(
                                (
                                    (b.translation?.[i18n.language] ??
                                        b.translation?.[(i18n.language || "").split("-")[0]])?.name ||
                                    b.name ||
                                    ""
                                )
                            )
                        )
                        .map((g) => (
                            <li key={g.tag}>
                                <button
                                    type="button"
                                    onClick={() => onSelect(g.tag)}
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
        </aside>
    );
}
