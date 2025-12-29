import { Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function DrawerList({ games = [], onSelect = () => { } }) {
    const { i18n } = useTranslation();

    const items = useMemo(() => {
        const lang = i18n.language || "en";
        const base = (lang || "").split("-")[0];

        return games
            .slice()
            .sort((a, b) => {
                const aName =
                    (a.translation?.[lang] ?? a.translation?.[base])?.name ?? a.name ?? "";
                const bName =
                    (b.translation?.[lang] ?? b.translation?.[base])?.name ?? b.name ?? "";
                return aName.localeCompare(bName);
            })
            .map((g) => ({
                tag: g.tag,
                name:
                    (g.translation?.[lang] ?? g.translation?.[base])?.name || g.name || "",
            }));
    }, [games, i18n.language]);

    return (
        <div className="px-7 pb-10 pt-5 overflow-y-auto h-[calc(100%-170px)]">
            <div className="space-y-4">
                {items.map((it) => (
                    <Link
                        key={it.tag}
                        to={`/games/${it.tag}`}
                        onClick={() => onSelect(it.tag)}
                        className="block text-white text-xl leading-snug hover:text-[#ffb670] transition"
                    >
                        {it.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SkeletonDrawerList() {
    return (
        <div className="px-7 pb-10 pt-5 animate-pulse">
            <div className="space-y-4">
                {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="h-6 w-56 bg-white/10 rounded" />
                ))}
            </div>
        </div>
    );
}

export default function AppDrawer({
    open,
    onClose,
    games = [],
    onSelect = () => { },
    loading = false,
}) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-out duration-200"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in duration-150"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative h-full w-[88vw] max-w-[340px] bg-gradient-to-b from-[#1b1f33] via-[#12162a] to-[#0b0f1a] shadow-2xl border-r border-white/10">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-6 top-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/10"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="px-7 pt-16">
                                    <div className="text-[#ff8904] font-extrabold text-3xl tracking-wide">
                                        Manuals
                                    </div>
                                    <div className="mt-4 h-px w-full bg-white/30" />
                                    <div className="mt-6 text-white font-extrabold text-3xl">
                                        Games
                                    </div>
                                </div>

                                {loading ? (
                                    <SkeletonDrawerList />
                                ) : (
                                    <DrawerList games={games} onSelect={onSelect} />
                                )}
                            </Dialog.Panel>
                        </Transition.Child>

                        <div className="flex-1" />
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
