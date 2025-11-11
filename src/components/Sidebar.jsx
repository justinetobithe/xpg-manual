import { useTranslation } from "react-i18next";

export default function Sidebar({ games = [], selected = "All", onSelect = () => { } }) {
    const { t, i18n } = useTranslation();
    const total = games.length;

    return (
        <aside className="sticky top-[84px] self-start w-full lg:w-64 mb-[20px]">
            <h3 className="text-base md:text-lg uppercase tracking-wide text-gray-300 mb-3 font-bold">
                {t("list.games")} {total}
            </h3>
            <ul className="space-y-2">
                <li>
                    <button
                        type="button"
                        onClick={() => onSelect("All")}
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
                                className={`w-full text-left block px-3 py-2.5 rounded-lg border text-base font-bold ${selected === g.tag
                                    ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                    : "border-[#2a3444] text-gray-200 hover:text-primary-300 hover:border-[#A66C13]"
                                    }`}
                            >
                                {(g.translation?.[i18n.language] ??
                                    g.translation?.[(i18n.language || "").split("-")[0]])?.name || g.name}
                            </button>
                        </li>
                    ))}
            </ul>
        </aside>
    );
}
