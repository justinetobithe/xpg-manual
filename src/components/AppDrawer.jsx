import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

function SidebarList({ games = [], selected = "All", onSelect = () => { } }) {
    const { t, i18n } = useTranslation();
    const total = games.length;

    return (
        <div className="p-4">
            <h3 className="text-3xl md:text-4xl uppercase tracking-wide text-gray-200 mb-5 font-extrabold">
                {t("list.games")} {total}
            </h3>
            <ul className="space-y-2">
                <li>
                    <button
                        type="button"
                        onClick={() => onSelect("All")}
                        className={
                            "w-full text-left block px-5 py-4 rounded-lg border text-xl md:text-2xl font-extrabold " +
                            (selected === "All"
                                ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                : "border-[#2a3444] text-gray-100 hover:text-primary-300 hover:border-[#A66C13]")
                        }
                    >
                        {t("list.all")} ({total})
                    </button>
                </li>
                {games
                    .slice()
                    .sort((a, b) => {
                        const aName =
                            (a.translation?.[i18n.language] ??
                                a.translation?.[(i18n.language || "").split("-")[0]])?.name ??
                            a.name ??
                            "";
                        const bName =
                            (b.translation?.[i18n.language] ??
                                b.translation?.[(i18n.language || "").split("-")[0]])?.name ??
                            b.name ??
                            "";
                        return aName.localeCompare(bName);
                    })
                    .map((g) => (
                        <li key={g.tag}>
                            <button
                                type="button"
                                onClick={() => onSelect(g.tag)}
                                className={
                                    "w-full text-left block px-5 py-4 rounded-lg border text-xl md:text-2xl font-extrabold " +
                                    (selected === g.tag
                                        ? "border-[#F4A52E] text-primary-300 bg-[#1a2028]"
                                        : "border-[#2a3444] text-gray-100 hover:text-primary-300 hover:border-[#A66C13]")
                                }
                            >
                                {(g.translation?.[i18n.language] ??
                                    g.translation?.[(i18n.language || "").split("-")[0]])?.name ||
                                    g.name}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

function SkeletonDrawerList() {
    return (
        <div className="p-4 animate-pulse">
            <div className="h-8 w-44 bg-gray-800 rounded mb-4" />
            <ul className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <li key={i} className="h-12 bg-gray-800/70 rounded-lg" />
                ))}
            </ul>
        </div>
    );
}

export default function AppDrawer({
    open,
    onClose,
    games = [],
    selected = "All",
    onSelect = () => { },
    loading = false,
}) {
    const { t } = useTranslation();

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
                <div className="fixed inset-0 bg-black/60" />
                <div className="fixed inset-0 flex">
                    <Dialog.Panel className="relative w-80 max-w-[85%] bg-[#0f141a] border-r border-[#A66C13] shadow-xl h-full flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-[#1b2330] shrink-0">
                            <span className="text-3xl font-extrabold text-primary-300">
                                {t("list.games")}
                            </span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-11 w-11 inline-flex items-center justify-center rounded-md text-gray-300 hover:text-primary-300 hover:bg-orange-500/10"
                                aria-label={t("actions.closeMenu")}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            {loading ? (
                                <SkeletonDrawerList />
                            ) : (
                                <SidebarList games={games} selected={selected} onSelect={onSelect} />
                            )}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
